/**
 * 造型锚定卡页面
 *
 * 表单结构：
 * - 风格关键词（标签式输入）
 * - 设计意图（长文本）
 * - 参考图像（可选上传）
 * - 硬性约束（汇总 + 打开约束库按钮 + 已选列表）
 *
 * 全部输入 500ms 防抖自动保存至 localStorage。
 */

import { debounce, escapeHtml } from '../utils.js';
import { store } from '../store.js';
import { createKeywordInput } from './keyword-input.js';
import { createConstraintLibrary } from './constraint-library.js';
import { openModal, closeModal } from './modal.js';
import { getFullConstraintLibrary } from '../data/constraints.js';

let _destroyFns = [];

export function initAnchorPage(container) {
  const project = store.getActiveProject();
  const card = store.getAnchorCard(project.id);

  // ---- 防抖保存 ----
  const save = debounce((partial) => {
    store.saveAnchorCard(project.id, partial);
    showSavedIndicator();
  }, 500);

  // ---- 保存提示 ----
  let saveTimer = null;
  function showSavedIndicator() {
    const el = container.querySelector('.anchor-card__save-indicator');
    if (!el) return;
    el.classList.add('is-visible');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => el.classList.remove('is-visible'), 1500);
  }

  // ---- 构建 DOM ----
  container.innerHTML = `
    <div class="anchor-card">
      <div class="anchor-card__header">
        <h1 class="anchor-card__title">造型锚定卡</h1>
        <p class="anchor-card__subtitle">定义设计方向，消除 AI 生成中的认知偏见</p>
        <span class="anchor-card__save-indicator">已自动保存</span>
      </div>

      <!-- 风格关键词 -->
      <section class="anchor-card__section">
        <div class="anchor-card__section-header">
          <h2 class="anchor-card__section-title">风格关键词</h2>
          <span class="anchor-card__section-hint">Enter / 逗号 添加</span>
        </div>
        <div class="anchor-card__kw-container"></div>
      </section>

      <!-- 设计意图 -->
      <section class="anchor-card__section">
        <div class="anchor-card__section-header">
          <h2 class="anchor-card__section-title">设计意图</h2>
          <span class="anchor-card__section-hint">描述产品定位、使用场景与期望体验</span>
        </div>
        <textarea class="anchor-card__textarea form-textarea" placeholder="例如：为一二线城市年轻白领设计一款便携咖啡杯，要求单手可操作、易清洗、适合通勤场景携带..." maxlength="1000"></textarea>
        <span class="anchor-card__char-count">0 / 1000</span>
      </section>

      <!-- 参考图像 -->
      <section class="anchor-card__section">
        <div class="anchor-card__section-header">
          <h2 class="anchor-card__section-title">参考图像</h2>
          <span class="anchor-card__section-hint">可选，最多 3 张</span>
        </div>
        <div class="anchor-card__image-zone">
          <div class="anchor-card__image-list"></div>
          ${card.referenceImages.length < 3 ? `
            <label class="anchor-card__image-add">
              <input type="file" accept="image/*" hidden class="anchor-card__image-input">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>添加图片</span>
            </label>
          ` : ''}
        </div>
      </section>

      <!-- 硬性约束 -->
      <section class="anchor-card__section">
        <div class="anchor-card__section-header">
          <h2 class="anchor-card__section-title">硬性约束</h2>
          <span class="anchor-card__section-hint anchor-card__constraint-count">已选 ${card.constraints.length} 项</span>
        </div>
        <div class="anchor-card__constraint-list"></div>
        <button class="btn btn--outline anchor-card__open-library" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>
          打开约束库
        </button>
      </section>
    </div>
  `;

  // ---- 引用 DOM 关键节点 ----
  const kwContainer = container.querySelector('.anchor-card__kw-container');
  const textarea = container.querySelector('.anchor-card__textarea');
  const charCount = container.querySelector('.anchor-card__char-count');
  const imageList = container.querySelector('.anchor-card__image-list');
  const imageInput = container.querySelector('.anchor-card__image-input');
  const imageAdd = container.querySelector('.anchor-card__image-add');
  const constraintList = container.querySelector('.anchor-card__constraint-list');
  const constraintCount = container.querySelector('.anchor-card__constraint-count');
  const openLibraryBtn = container.querySelector('.anchor-card__open-library');

  // ---- 关键词输入 ----
  const kw = createKeywordInput({
    container: kwContainer,
    keywords: card.styleKeywords || [],
    placeholder: '输入风格关键词，如：极简、圆润、有机形态...',
    maxItems: 20,
    onChange: (keywords) => {
      save({ styleKeywords: keywords });
    }
  });
  _destroyFns.push(() => kw.destroy());

  // ---- 设计意图 ----
  textarea.value = card.designIntent || '';
  charCount.textContent = `${textarea.value.length} / 1000`;
  textarea.addEventListener('input', () => {
    charCount.textContent = `${textarea.value.length} / 1000`;
    save({ designIntent: textarea.value });
  });

  // ---- 参考图像 ----
  let _images = [...(card.referenceImages || [])];

  function renderImages() {
    imageList.innerHTML = '';
    _images.forEach((dataUrl, idx) => {
      const thumb = document.createElement('div');
      thumb.className = 'anchor-card__image-thumb';
      thumb.innerHTML = `
        <img src="${dataUrl}" alt="参考图 ${idx + 1}">
        <button class="anchor-card__image-remove" data-index="${idx}" type="button" aria-label="移除图片">&times;</button>
      `;
      imageList.appendChild(thumb);
    });

    // 超过 3 张隐藏添加按钮
    if (imageAdd) {
      imageAdd.style.display = _images.length >= 3 ? 'none' : '';
    }
  }

  function addImage(file) {
    if (_images.length >= 3) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      // 压缩大图：用 canvas 缩放至最大宽度 800px
      const img = new Image();
      img.onload = () => {
        let dataUrl = e.target.result;
        if (img.width > 800) {
          const canvas = document.createElement('canvas');
          const ratio = 800 / img.width;
          canvas.width = 800;
          canvas.height = img.height * ratio;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        }
        _images.push(dataUrl);
        renderImages();
        save({ referenceImages: _images });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  if (imageInput) {
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) addImage(file);
      imageInput.value = '';
    });
  }

  imageList.addEventListener('click', (e) => {
    const btn = e.target.closest('.anchor-card__image-remove');
    if (btn) {
      const idx = parseInt(btn.dataset.index, 10);
      _images.splice(idx, 1);
      renderImages();
      save({ referenceImages: _images });
    }
  });

  renderImages();

  // ---- 约束列表 ----
  let _constraints = [...card.constraints];

  function renderConstraints() {
    constraintList.innerHTML = '';
    if (_constraints.length === 0) {
      constraintList.innerHTML = '<p class="anchor-card__constraint-empty">尚未添加约束，点击下方按钮从约束库中选择</p>';
    } else {
      _constraints.forEach((c, idx) => {
        const item = document.createElement('div');
        item.className = 'constraint-chip';
        const detail = c.value && typeof c.value === 'string' ? `：${c.value}` : '';
        item.innerHTML = `
          <span class="constraint-chip__cat">${escapeHtml(getCategoryLabel(c.category))}</span>
          <span class="constraint-chip__label">${escapeHtml(c.label)}${escapeHtml(detail)}</span>
          <button class="constraint-chip__remove" data-index="${idx}" type="button" aria-label="移除约束">&times;</button>
        `;
        constraintList.appendChild(item);
      });
    }
    constraintCount.textContent = `已选 ${_constraints.length} 项`;
  }

  function getCategoryLabel(cat) {
    const map = { structure: '结构', process: '工艺', ergonomics: '人机', custom: '自定义' };
    return map[cat] || cat;
  }

  // 约束删除
  constraintList.addEventListener('click', (e) => {
    const btn = e.target.closest('.constraint-chip__remove');
    if (btn) {
      const idx = parseInt(btn.dataset.index, 10);
      _constraints.splice(idx, 1);
      renderConstraints();
      save({ constraints: _constraints });
    }
  });

  // ---- 打开约束库 ----
  openLibraryBtn.addEventListener('click', () => {
    const selectedIds = new Set(_constraints.map(c => c.id));

    // 保存当前选中的值（用于 text/select 类型）
    const valueMap = {};
    _constraints.forEach(c => {
      if (c.value !== undefined) valueMap[c.id] = c.value;
    });

    const lib = createConstraintLibrary({
      selectedIds,
      onToggle: (constraint, isSelected) => {
        if (isSelected) {
          valueMap[constraint.id] = constraint._value ?? constraint.defaultValue ?? true;
        } else {
          delete valueMap[constraint.id];
        }
      },
      onCustomAdd: () => {},
      onConfirm: (newSelected) => {
        const fullLib = getFullConstraintLibrary(store.getCustomConstraints());
        _constraints = [];
        newSelected.forEach(id => {
          const c = fullLib.find(item => item.id === id);
          if (c) {
            const entry = {
              id: c.id,
              category: c.category,
              subcategory: c.subcategory,
              label: c.label,
              value: valueMap[id] ?? c.defaultValue ?? true,
              isCustom: c.isCustom || false
            };
            _constraints.push(entry);
          }
        });
        renderConstraints();
        save({ constraints: _constraints });
        closeModal();
      }
    });

    openModal({
      title: '约束库',
      content: lib.getElement(),
      onClose: () => {
        lib.destroy();
      }
    });
  });

  renderConstraints();

  // ---- 返回清理函数 ----
  return {
    destroy() {
      _destroyFns.forEach(fn => fn());
      _destroyFns = [];
    },
    hasUnsavedChanges() {
      return false; // 自动保存，无需提示
    }
  };
}
