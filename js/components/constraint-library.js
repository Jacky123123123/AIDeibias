/**
 * 约束库组件
 *
 * 在指定容器内渲染完整的约束库浏览器：
 * - 搜索筛选
 * - 分类手风琴
 * - 复选框列表
 * - 自定义约束添加
 *
 * 通常配合 modal.js 使用。
 */

import { escapeHtml, generateId } from '../utils.js';
import { getFullConstraintLibrary, groupConstraints } from '../data/constraints.js';
import { store } from '../store.js';

export function createConstraintLibrary(options = {}) {
  const {
    selectedIds = new Set(),     // Set<string> 已选中的约束 ID
    onToggle = null,              // (constraint, isSelected) => void
    onCustomAdd = null,          // (constraint) => void
    onConfirm = null             // (selectedIds: Set) => void
  } = options;

  const wrapper = document.createElement('div');
  wrapper.className = 'constraint-library';

  let _selected = new Set(selectedIds);
  let _customConstraints = store.getCustomConstraints();

  // ---- 构建 UI ----
  wrapper.innerHTML = `
    <div class="cl-search">
      <svg class="cl-search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input class="cl-search__input" type="text" placeholder="搜索约束条件..." autocomplete="off">
    </div>
    <div class="cl-categories"></div>
    <div class="cl-custom">
      <h3 class="cl-custom__title">添加自定义约束</h3>
      <div class="cl-custom__form">
        <input class="cl-custom__input" type="text" placeholder="输入自定义约束名称..." maxlength="40">
        <button class="btn btn--primary btn--sm cl-custom__btn" type="button">添加</button>
      </div>
    </div>
    <div class="cl-footer">
      <span class="cl-footer__count">已选 <strong>${_selected.size}</strong> 项</span>
      <button class="btn btn--primary cl-footer__confirm" type="button">确认选择</button>
    </div>
  `;

  const searchInput = wrapper.querySelector('.cl-search__input');
  const categoriesEl = wrapper.querySelector('.cl-categories');
  const customInput = wrapper.querySelector('.cl-custom__input');
  const customBtn = wrapper.querySelector('.cl-custom__btn');
  const countEl = wrapper.querySelector('.cl-footer__count strong');
  const confirmBtn = wrapper.querySelector('.cl-footer__confirm');

  // ---- 渲染分类 ----
  function render(query = '') {
    const fullLibrary = getFullConstraintLibrary(_customConstraints);
    const q = query.toLowerCase().trim();

    const filtered = q
      ? fullLibrary.filter(c =>
          c.label.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.subcategory.toLowerCase().includes(q)
        )
      : fullLibrary;

    const grouped = groupConstraints(filtered);

    categoriesEl.innerHTML = '';

    for (const [key, group] of Object.entries(grouped)) {
      if (group.items.length === 0) continue;

      const section = document.createElement('div');
      section.className = 'cl-category';

      const isExpanded = q
        ? true   // 搜索时全部展开
        : (key === 'structure'); // 默认展开第一个

      section.innerHTML = `
        <button class="cl-category__header ${isExpanded ? 'is-expanded' : ''}" type="button" data-category="${key}">
          <span class="cl-category__icon">${group.icon}</span>
          <span class="cl-category__label">${group.label}</span>
          <span class="cl-category__count">${group.items.length} 项</span>
          <svg class="cl-category__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="cl-category__body ${isExpanded ? '' : 'is-collapsed'}">
          <div class="cl-items"></div>
        </div>
      `;

      const bodyEl = section.querySelector('.cl-category__body');
      const itemsEl = section.querySelector('.cl-items');

      // 渲染该类别的约束项
      group.items.forEach(c => {
        const isChecked = _selected.has(c.id);
        const item = document.createElement('div');
        item.className = `cl-item ${isChecked ? 'cl-item--checked' : ''}`;

        if (c.inputType === 'checkbox') {
          item.innerHTML = `
            <label class="cl-item__row">
              <input class="cl-item__checkbox" type="checkbox" ${isChecked ? 'checked' : ''} data-id="${c.id}">
              <span class="cl-item__label">${escapeHtml(c.label)}</span>
              <span class="cl-item__subcategory">${escapeHtml(c.subcategory)}</span>
            </label>
            ${c.description ? `<p class="cl-item__desc">${escapeHtml(c.description)}</p>` : ''}
          `;
        } else if (c.inputType === 'text') {
          const val = _selected.has(c.id) ? (c._value || '') : (c.defaultValue || '');
          item.innerHTML = `
            <label class="cl-item__row">
              <input class="cl-item__checkbox" type="checkbox" ${isChecked ? 'checked' : 'false'} data-id="${c.id}">
              <span class="cl-item__label">${escapeHtml(c.label)}</span>
              <span class="cl-item__subcategory">${escapeHtml(c.subcategory)}</span>
            </label>
            ${c.description ? `<p class="cl-item__desc">${escapeHtml(c.description)}</p>` : ''}
            <div class="cl-item__value ${isChecked ? '' : 'is-hidden'}">
              <input class="cl-item__text-input" type="text" placeholder="填写具体数值..." value="${escapeHtml(val)}" data-id="${c.id}">
            </div>
          `;
        } else if (c.inputType === 'select') {
          const val = _selected.has(c.id) ? (c._value || c.defaultValue) : (c.defaultValue || '');
          const optionsHtml = (c.options || []).map(o =>
            `<option value="${escapeHtml(o)}" ${o === val ? 'selected' : ''}>${escapeHtml(o)}</option>`
          ).join('');
          item.innerHTML = `
            <label class="cl-item__row">
              <input class="cl-item__checkbox" type="checkbox" ${isChecked ? 'checked' : ''} data-id="${c.id}">
              <span class="cl-item__label">${escapeHtml(c.label)}</span>
              <span class="cl-item__subcategory">${escapeHtml(c.subcategory)}</span>
            </label>
            ${c.description ? `<p class="cl-item__desc">${escapeHtml(c.description)}</p>` : ''}
            <div class="cl-item__value ${isChecked ? '' : 'is-hidden'}">
              <select class="cl-item__select" data-id="${c.id}">
                ${optionsHtml}
              </select>
            </div>
          `;
        }

        itemsEl.appendChild(item);
      });

      // 手风琴切换
      const header = section.querySelector('.cl-category__header');
      header.addEventListener('click', () => {
        header.classList.toggle('is-expanded');
        bodyEl.classList.toggle('is-collapsed');
      });

      categoriesEl.appendChild(section);
    }
  }

  // ---- 事件委托 ----

  // 复选框切换
  categoriesEl.addEventListener('change', (e) => {
    if (e.target.classList.contains('cl-item__checkbox')) {
      const id = e.target.dataset.id;
      const isChecked = e.target.checked;

      if (isChecked) {
        _selected.add(id);
      } else {
        _selected.delete(id);
      }

      // 显示/隐藏 value 输入区域
      const item = e.target.closest('.cl-item');
      if (item) {
        item.classList.toggle('cl-item--checked', isChecked);
        const valueRow = item.querySelector('.cl-item__value');
        if (valueRow) valueRow.classList.toggle('is-hidden', !isChecked);
      }

      // 查找对应约束数据
      const fullLib = getFullConstraintLibrary(_customConstraints);
      const constraint = fullLib.find(c => c.id === id);

      updateCount();
      if (onToggle && constraint) onToggle(constraint, isChecked);
    }
  });

  // 文本/选择值变更
  categoriesEl.addEventListener('input', (e) => {
    if (e.target.classList.contains('cl-item__text-input') || e.target.classList.contains('cl-item__select')) {
      const id = e.target.dataset.id;
      const fullLib = getFullConstraintLibrary(_customConstraints);
      const constraint = fullLib.find(c => c.id === id);
      if (constraint && onToggle) {
        constraint._value = e.target.value;
        onToggle(constraint, true);
      }
    }
  });

  // 搜索
  searchInput.addEventListener('input', (e) => {
    render(e.target.value);
  });

  // 自定义约束添加
  function addCustom() {
    const label = customInput.value.trim();
    if (!label) return;

    const custom = {
      id: generateId('cstm'),
      category: 'custom',
      subcategory: '自定义约束',
      label,
      description: '',
      inputType: 'checkbox',
      options: null,
      defaultValue: false,
      isCustom: true
    };

    _customConstraints = store.addCustomConstraint(custom);
    _selected.add(custom.id);
    customInput.value = '';
    render(searchInput.value);
    updateCount();

    if (onCustomAdd) onCustomAdd(custom);
  }

  customBtn.addEventListener('click', addCustom);
  customInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustom();
    }
  });

  // 确认按钮
  confirmBtn.addEventListener('click', () => {
    if (onConfirm) onConfirm(new Set(_selected));
  });

  function updateCount() {
    countEl.textContent = _selected.size;
  }

  // ---- 公开 API ----
  const api = {
    getElement() { return wrapper; },
    getSelected() { return new Set(_selected); },
    refresh() {
      _customConstraints = store.getCustomConstraints();
      render(searchInput.value);
    },
    destroy() {
      wrapper.remove();
    }
  };

  // 初始渲染
  render();

  return api;
}
