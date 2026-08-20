/**
 * AI造型探索工具 — 应用入口
 *
 * 职责：
 * 1. 确保默认项目和设定存在
 * 2. 初始化导航栏
 * 3. 配置路由
 * 4. 启动应用
 */

import { store } from './store.js';
import { Router } from './router.js';
import { $ } from './utils.js';
import { initNavbar } from './components/navbar.js';
import { initAnchorPage } from './components/anchor-card.js';

// ---- 应用初始化 ----
function boot() {
  // 确保数据层就绪
  const project = store.getActiveProject();

  // 初始化导航栏
  const navbarEl = $('#navbar');
  const navbar = initNavbar(navbarEl);

  // 占位页面工厂
  function placeholderPage(label) {
    return (container) => {
      container.innerHTML = `
        <div class="placeholder-page">
          <div class="placeholder-page__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <h2 class="placeholder-page__title">${label}</h2>
          <p class="placeholder-page__desc">功能开发中，敬请期待</p>
        </div>
      `;
      return { destroy() {} };
    };
  }

  // 路由配置
  const router = new Router(
    {
      '#/anchor': initAnchorPage,
      '#/compare': placeholderPage('辩证对比'),
      '#/reflect': placeholderPage('反思沉淀')
    },
    $('#app-main'),
    {
      onBeforeChange(hash) {
        navbar.updateActiveStep(hash);
      }
    }
  );

  router.start();
}

// 页面加载完成后启动
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
