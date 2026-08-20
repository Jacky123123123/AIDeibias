/**
 * 顶部导航栏
 * 品牌名 + 三阶段步骤条。当前高亮，后续阶段灰色+tooltip。
 */

export function initNavbar(container) {
  const steps = [
    { hash: '#/anchor', num: 1, label: '造型锚定', available: true },
    { hash: '#/compare', num: 2, label: '辩证对比', available: false },
    { hash: '#/reflect', num: 3, label: '反思沉淀', available: false }
  ];

  container.innerHTML = `
    <div class="navbar__inner">
      <a class="navbar__brand" href="#/anchor">AI 造型探索</a>
      <div class="navbar__stepper">
        ${steps.map(s => `
          <a class="navbar__step ${s.available ? 'navbar__step--active' : 'navbar__step--disabled'}"
             href="${s.available ? s.hash : '#'}"
             data-step="${s.num}"
             ${!s.available ? 'data-tooltip="即将推出"' : ''}>
            <span class="navbar__step-num">${s.num}</span>
            <span class="navbar__step-label">${s.label}</span>
          </a>
        `).join('')}
      </div>
    </div>
  `;

  // 点击灰阶步骤时阻止跳转并显示提示
  container.addEventListener('click', (e) => {
    const step = e.target.closest('.navbar__step--disabled');
    if (step) {
      e.preventDefault();
      // 简易 tooltip 闪烁
      const existing = container.querySelector('.navbar__tooltip');
      if (existing) existing.remove();
      const tip = document.createElement('span');
      tip.className = 'navbar__tooltip';
      tip.textContent = '即将推出';
      step.appendChild(tip);
      setTimeout(() => tip.remove(), 2000);
    }
  });

  return {
    updateActiveStep(hash) {
      container.querySelectorAll('.navbar__step').forEach(el => {
        const stepNum = parseInt(el.dataset.step, 10);
        const step = steps[stepNum - 1];
        if (step && step.hash === hash) {
          el.classList.add('navbar__step--active');
          el.classList.remove('navbar__step--disabled');
        } else if (!step.available) {
          el.classList.remove('navbar__step--active');
          el.classList.add('navbar__step--disabled');
        } else {
          el.classList.remove('navbar__step--active', 'navbar__step--disabled');
        }
      });
    },
    destroy() {
      container.innerHTML = '';
    }
  };
}
