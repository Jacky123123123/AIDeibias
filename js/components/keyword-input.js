/**
 * 标签式关键词输入组件
 *
 * 用法：
 *   const kw = createKeywordInput({
 *     container: document.getElementById('some-div'),
 *     keywords: ['极简', '圆润'],
 *     placeholder: '输入关键词...',
 *     maxItems: 20,
 *     onChange: (keywords) => { ... }
 *   });
 *   kw.getKeywords()   // 读取当前关键词
 *   kw.setKeywords([]) // 设置关键词
 *   kw.destroy()       // 移除组件
 */

import { escapeHtml } from '../utils.js';

export function createKeywordInput(options = {}) {
  const {
    container,
    keywords = [],
    placeholder = '输入关键词，按 Enter 或逗号添加',
    maxItems = 20,
    onChange = null
  } = options;

  if (!container) {
    throw new Error('keyword-input: container is required');
  }

  let _keywords = [...keywords];

  // ---- DOM 构建 ----
  const wrapper = document.createElement('div');
  wrapper.className = 'keyword-input';

  const tagsArea = document.createElement('div');
  tagsArea.className = 'keyword-input__tags';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'keyword-input__field';
  input.placeholder = placeholder;
  input.maxLength = 30;

  wrapper.appendChild(tagsArea);
  wrapper.appendChild(input);
  container.appendChild(wrapper);

  // ---- 渲染标签 ----
  function renderTags() {
    tagsArea.innerHTML = '';
    _keywords.forEach((kw, idx) => {
      const tag = document.createElement('span');
      tag.className = 'keyword-input__tag';
      tag.innerHTML = `
        <span class="keyword-input__tag-text">${escapeHtml(kw)}</span>
        <button class="keyword-input__tag-remove" data-index="${idx}" type="button" aria-label="移除 ${escapeHtml(kw)}">&times;</button>
      `;
      tagsArea.appendChild(tag);
    });
  }

  // ---- 添加关键词 ----
  function addKeyword(raw) {
    const trimmed = raw.trim().replace(/[，,]+$/, '').trim();
    if (!trimmed) return;
    if (_keywords.length >= maxItems) return;
    if (_keywords.includes(trimmed)) return; // 去重

    _keywords.push(trimmed);
    renderTags();
    if (onChange) onChange([..._keywords]);
  }

  // ---- 移除关键词 ----
  function removeKeyword(index) {
    if (index < 0 || index >= _keywords.length) return;
    _keywords.splice(index, 1);
    renderTags();
    if (onChange) onChange([..._keywords]);
  }

  // ---- 事件 ----
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword(input.value);
      input.value = '';
    } else if (e.key === 'Backspace' && input.value === '' && _keywords.length > 0) {
      removeKeyword(_keywords.length - 1);
    }
  });

  // 失焦时也尝试添加（处理粘贴后直接点击其他地方的情况）
  input.addEventListener('blur', () => {
    if (input.value.trim()) {
      addKeyword(input.value);
      input.value = '';
    }
  });

  // 点击标签删除
  tagsArea.addEventListener('click', (e) => {
    const btn = e.target.closest('.keyword-input__tag-remove');
    if (btn) {
      const idx = parseInt(btn.dataset.index, 10);
      removeKeyword(idx);
    }
  });

  // 点击 wrapper 空白处聚焦 input
  wrapper.addEventListener('click', (e) => {
    if (e.target === wrapper || e.target === tagsArea) {
      input.focus();
    }
  });

  // ---- 初始渲染 ----
  renderTags();

  // ---- 公开 API ----
  return {
    getKeywords() {
      return [..._keywords];
    },
    setKeywords(newKeywords) {
      _keywords = [...newKeywords];
      renderTags();
      if (onChange) onChange([..._keywords]);
    },
    addKeyword,
    removeKeyword,
    destroy() {
      wrapper.remove();
    }
  };
}
