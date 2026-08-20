/**
 * 通用弹窗组件
 * 渲染到 #modal-root，支持背景点击 / Escape / 关闭按钮三种关闭方式。
 * 同一时间只允许一个弹窗。
 */

import { $ } from '../utils.js';

let currentModal = null;

function createModalDom(options) {
  const { title, content, width } = options;
  const maxWidth = width || '680px';

  const wrapper = document.createElement('div');
  wrapper.className = 'modal';
  wrapper.innerHTML = `
    <div class="modal__backdrop"></div>
    <div class="modal__container" style="max-width:${maxWidth}" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="modal__header">
        <h2 class="modal__title">${title}</h2>
        <button class="modal__close" aria-label="关闭">&times;</button>
      </div>
      <div class="modal__body"></div>
    </div>
  `;

  const bodyEl = wrapper.querySelector('.modal__body');
  if (typeof content === 'string') {
    bodyEl.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    bodyEl.appendChild(content);
  }

  return { wrapper, bodyEl };
}

export function openModal(options = {}) {
  // 先关闭已有的
  if (currentModal) {
    closeModal();
  }

  const root = $('#modal-root');
  if (!root) return null;

  const { wrapper, bodyEl } = createModalDom(options);
  root.appendChild(wrapper);
  document.body.classList.add('body--modal-open');

  // 关闭处理
  const backdrop = wrapper.querySelector('.modal__backdrop');
  const closeBtn = wrapper.querySelector('.modal__close');

  const handleClose = () => {
    if (options.onClose) options.onClose();
    closeModal();
  };

  backdrop.addEventListener('click', handleClose);
  closeBtn.addEventListener('click', handleClose);

  const handleKey = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
    // 焦点捕获
    if (e.key === 'Tab') {
      const container = wrapper.querySelector('.modal__container');
      const focusable = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  document.addEventListener('keydown', handleKey);

  // 聚焦第一个可聚焦元素
  requestAnimationFrame(() => {
    const firstFocus = wrapper.querySelector('button, input, select, textarea');
    if (firstFocus) firstFocus.focus();
  });

  currentModal = {
    wrapper,
    bodyEl,
    handleClose,
    handleKey,
    setContent(newContent) {
      bodyEl.innerHTML = '';
      if (typeof newContent === 'string') {
        bodyEl.innerHTML = newContent;
      } else if (newContent instanceof HTMLElement) {
        bodyEl.appendChild(newContent);
      }
    },
    setTitle(newTitle) {
      const titleEl = wrapper.querySelector('.modal__title');
      if (titleEl) titleEl.textContent = newTitle;
      const container = wrapper.querySelector('.modal__container');
      if (container) container.setAttribute('aria-label', newTitle);
    },
    close: handleClose
  };

  return currentModal;
}

export function closeModal() {
  if (!currentModal) return;
  const { wrapper, handleKey } = currentModal;
  document.removeEventListener('keydown', handleKey);
  if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
  document.body.classList.remove('body--modal-open');
  currentModal = null;
}
