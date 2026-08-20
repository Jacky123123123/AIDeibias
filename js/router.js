/**
 * 简易 Hash 路由
 *
 * 用法：
 *   const router = new Router({
 *     '#/anchor': (container) => { return { destroy() {} }; },
 *     '#/compare': (container) => { return { destroy() {} }; },
 *   });
 *   router.start();
 */

export class Router {
  constructor(routes, container, { onBeforeChange = null } = {}) {
    this._routes = routes;
    this._container = container;
    this._onBeforeChange = onBeforeChange;
    this._currentHandler = null;
    this._currentDestroy = null;
    this._boundOnHashChange = this._onHashChange.bind(this);
  }

  start() {
    window.addEventListener('hashchange', this._boundOnHashChange);
    // 初始化：处理当前 hash
    if (!window.location.hash) {
      window.location.hash = '#/anchor';
    } else {
      this._handleRoute(window.location.hash);
    }
  }

  stop() {
    window.removeEventListener('hashchange', this._boundOnHashChange);
    this._cleanup();
  }

  navigate(hash) {
    window.location.hash = hash;
  }

  _onHashChange() {
    this._handleRoute(window.location.hash);
  }

  _handleRoute(hash) {
    const rawHash = hash || '#/anchor';

    // 查找匹配的路由：优先 exact match，然后尝试去掉 query string
    let handler = this._routes[rawHash];
    let routeKey = rawHash;

    if (!handler) {
      // 解析 query string
      const qIdx = rawHash.indexOf('?');
      const base = qIdx > 0 ? rawHash.substring(0, qIdx) : rawHash;
      handler = this._routes[base];
      routeKey = base;
    }

    if (!handler) {
      // 未知路由 → 重定向到 anchor
      this.navigate('#/anchor');
      return;
    }

    if (this._onBeforeChange) {
      this._onBeforeChange(routeKey);
    }

    // 清理旧页面
    this._cleanup();

    // 初始化新页面
    this._currentHandler = handler;
    const result = handler(this._container);
    if (result && typeof result.destroy === 'function') {
      this._currentDestroy = result.destroy;
    }
  }

  _cleanup() {
    if (this._currentDestroy) {
      try { this._currentDestroy(); } catch (e) { console.error(e); }
      this._currentDestroy = null;
    }
    this._container.innerHTML = '';
  }
}
