/**
 * Critical Reading Before Commitment — Website
 * Pure frontend SPA. Hash-based routing. No build step.
 */
(function () {
  'use strict';

  /* ===================================================================
     Site config (content is separated from components for easy editing)
     =================================================================== */

  var SITE = {
    name: 'AI Debias Kit',
    brand: 'AI Debias Kit',
    brandSub: 'Design with AI, not by AI.',
    claim: 'Before accepting a finished-looking AI image as a design direction, separate what the image actually shows, what it leads you to believe, and what remains undecided.'
  };

  /* AI follow-up questions endpoint.
     Default '/api/review' works both locally (node server.js) and on Vercel
     (same-origin). Change to an absolute URL if the function is hosted elsewhere. */
  var AI_ENDPOINT = '/api/review';

  var NAV = [
    { hash: '#/overview',     label: 'Overview' },
    { hash: '#/capabilities', label: 'Capabilities' },
    { hash: '#/read',         label: 'Read the Image' },
    { hash: '#/cases',        label: 'Cases' },
    { hash: '#/your-image',   label: 'Your Image' },
    { hash: '#/about',        label: 'About' }
  ];

  /* Four-part toolkit structure (learning sequence) */
  var FLOW = [
    { title: 'Check Capabilities', desc: 'Understand what AI images can do — and what they cannot prove.' },
    { title: 'Read Errors & Uncertainty', desc: 'Learn to name three kinds of issues: mistakes you can see, gaps in logic, and claims without proof.' },
    { title: 'Practice with Cases', desc: 'Work through sample cases before you analyse your own image.' },
    { title: 'Apply to Your Image', desc: 'Upload your own AI image and mark up the errors you spot.' }
  ];

  /* ===================================================================
     DOM helpers
     =================================================================== */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ===================================================================
     Router
     =================================================================== */

  function Router(routes, mainEl, onBeforeChange) {
    var self = this;
    this.routes = routes;
    this.mainEl = mainEl;
    this.onBeforeChange = onBeforeChange;
    this._boundOnHashChange = function () { self._handleRoute(); };

    this._handleRoute = function () {
      var hash = window.location.hash || '#/overview';
      var route = routes[hash] || routes['#/overview'];
      if (self.onBeforeChange) self.onBeforeChange(hash);
      var result = route(self.mainEl);
      self._cleanup();
      if (result && result.destroy) self._cleanup = result.destroy;
    };

    this._cleanup = function () {};
    this.start = function () {
      window.addEventListener('hashchange', this._boundOnHashChange);
      if (!window.location.hash) { window.location.hash = '#/overview'; }
      else { this._handleRoute(); }
    };
    this.navigate = function (hash) { window.location.hash = hash; };
  }

  /* ===================================================================
     Header
     =================================================================== */

  function renderHeader() {
    var header = $('#site-header');
    header.innerHTML =
      '<div class="container header__inner">' +
        '<a class="header__brand" href="#/overview">' +
          '<span class="header__brand-name">' + escapeHtml(SITE.brand) + '</span>' +
          '<span class="header__brand-sub">' + escapeHtml(SITE.brandSub) + '</span>' +
        '</a>' +
        '<nav class="header__nav" aria-label="Primary">' +
          NAV.map(function (n) {
            return '<a class="header__link" href="' + n.hash + '" data-nav="' + n.hash + '">' + escapeHtml(n.label) + '</a>';
          }).join('') +
        '</nav>' +
      '</div>';
  }

  function updateActiveNav(hash) {
    $$('.header__link').forEach(function (link) {
      link.classList.toggle('is-active', link.dataset.nav === hash);
    });
  }

  /* ===================================================================
     Footer
     =================================================================== */

  function renderFooter() {
    var footer = $('#site-footer');
    footer.innerHTML =
      '<div class="container footer__inner">' +
        '<div>' +
          '<div class="footer__brand">' + escapeHtml(SITE.name) + '</div>' +
          '<p class="footer__blurb">An educational companion to a physical card toolkit, helping design students and early practitioners critically read AI-generated product concept images before committing to a direction.</p>' +
        '</div>' +
        '<div>' +
          '<div class="footer__heading">Toolkit</div>' +
          '<div class="footer__links">' +
            NAV.slice(0, 6).map(function (n) {
              return '<a class="footer__link" href="' + n.hash + '">' + escapeHtml(n.label) + '</a>';
            }).join('') +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="footer__heading">Research</div>' +
          '<div class="footer__links">' +
            '<a class="footer__link" href="#/about">About the Project</a>' +
            '<a class="footer__link" href="#/about">References</a>' +
            '<a class="footer__link" href="#/about">Limitations</a>' +
            '<a class="footer__link" href="#/about">AI Use Statement</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="footer__bottom">' +
        '<span>© 2026 ' + escapeHtml(SITE.name) + '.</span>' +
        '<span>This toolkit supports critical reading, but does not verify usability, ergonomics, safety, manufacturability, or design quality.</span>' +
      '</div>';
  }

  /* ===================================================================
     Shared building blocks
     =================================================================== */

  function sectionEyebrow(text) {
    return '<span class="section__eyebrow">' + escapeHtml(text) + '</span>';
  }

  function iconSvg(inner, size) {
    size = size || 24;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
  }

  /* ===================================================================
     Overview page
     =================================================================== */

  function renderOverview(container) {
    container.innerHTML =
      // Hero
      '<section class="hero" data-hero>' +
        '<div class="hero__bg">' +
          '<img class="hero__photo" src="assets/toolkit-pic.jpg" alt="" aria-hidden="true">' +
          '<div class="hero__overlay"></div>' +
        '</div>' +
        '<div class="container hero__inner">' +
          '<div class="hero__content-box" data-hero-box>' +
            '<span class="hero__eyebrow"><span class="hero__eyebrow-dot"></span>For Industrial &amp; Product Design Students</span>' +
            '<h1 class="hero__title">AI Debias Kit</h1>' +
            '<p class="hero__subtitle">' + escapeHtml(SITE.claim) + '</p>' +
            '<div class="hero__actions">' +
              '<a class="btn btn--primary btn--lg" href="#/capabilities">Start with Capabilities</a>' +
              '<a class="btn btn--outline btn--lg" href="#/read">Browse the Toolkit</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      // Four-part structure
      '<section class="section">' +
        '<div class="container">' +
          '<div class="section__header">' +
            sectionEyebrow('How to use it') +
            '<h2 class="section__title">Four parts, one learning sequence.</h2>' +
            '<p class="section__lead">You can browse freely, but the sequence below is the recommended first-time path.</p>' +
          '</div>' +
          '<div class="flow-alt" data-flow>' +
            FLOW.map(function (step, i) {
              var flip = (i % 2 === 1) ? ' flow-alt__step--flip' : '';
              return (
                '<div class="flow-alt__step' + flip + '">' +
                  (i === 0
                    ? '<figure class="flow-alt__media" aria-hidden="true">' +
                        '<div class="split">' +
                          '<img class="split__l" src="assets/d1.png" alt="" loading="lazy">' +
                          '<img class="split__r" src="assets/d2.png" alt="" loading="lazy">' +
                        '</div>' +
                      '</figure>'
                    : '<figure class="flow-alt__media" aria-hidden="true">' +
                        '<img src="assets/flow-' + (i + 1) + '.png" alt="" loading="lazy">' +
                      '</figure>') +
                  '<div class="flow-alt__body">' +
                    '<div class="flow-alt__num">' + (i + 1) + '</div>' +
                    '<h3 class="flow-alt__title">' + escapeHtml(step.title) + '</h3>' +
                    '<p class="flow-alt__desc">' + escapeHtml(step.desc) + '</p>' +
                  '</div>' +
                '</div>'
              );
            }).join('') +
          '</div>' +
        '</div>' +
      '</section>' +

      // Problem context
      '<section class="section">' +
        '<div class="container">' +
          '<div class="section__header">' +
            sectionEyebrow('Why this exists') +
            '<h2 class="section__title">AI images can look finished before the design truly is.</h2>' +
          '</div>' +
          '<p class="section__lead">AI-generated product images can appear complete — polished surfaces, plausible forms, convincing contexts — while leaving critical design decisions unresolved. This toolkit helps you tell the difference between what an image <strong>actually shows</strong>, what it <strong>leads you to believe</strong>, and what <strong>remains undecided</strong>.</p>' +
          '<div style="height: 40px"></div>' +
          '<div class="card" style="background: var(--color-primary-subtle); border-color: var(--color-primary-light)">' +
            '<p style="font-size: var(--font-size-lg); line-height: var(--line-height-relaxed); color: var(--color-neutral-700); font-style: italic; margin: 0">"The right moment to use this toolkit is <strong>before</strong> you accept an AI image as a direction — not after."</p>' +
          '</div>' +
        '</div>' +
      '</section>' +

      // Physical toolkit
      '<section class="section section--alt">' +
        '<div class="container">' +
          '<div class="section__header">' +
            sectionEyebrow('A physical companion') +
            '<h2 class="section__title">A card toolkit you can hold.</h2>' +
            '<p class="section__lead">This website is the digital companion to a physical card deck — with capability cards, error and uncertainty cards, and case prompts designed to be spread across a desk, not scrolled past.</p>' +
          '</div>' +
          '<div class="card" style="padding: 0; overflow: hidden">' +
            '<div style="aspect-ratio: 16/7; background: linear-gradient(135deg, #E8E6F0 0%, #DDDAE5 100%); display: flex; align-items: center; justify-content: center; color: var(--color-neutral-400); font-size: var(--font-size-sm); font-weight: 500">' +
              'Physical toolkit photography — place image here' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>';

    var hero = container.querySelector('.hero');
    var box = container.querySelector('[data-hero-box]');
    var photo = container.querySelector('.hero__photo');
    var overlay = container.querySelector('.hero__overlay');
    var flowVisual = container.querySelector('[data-flow]');
    var flowFigs = flowVisual ? flowVisual.querySelectorAll('.flow-alt__media') : [];

    function onScroll() {
      if (!hero) return;
      var rect = hero.getBoundingClientRect();
      var scrolled = Math.max(0, -rect.top);
      var pText = Math.min(1, scrolled / Math.max(1, rect.height * 0.75));
      var pPhoto = Math.min(1, scrolled / Math.max(1, rect.height * 0.4));

      if (box) {
        box.style.opacity = 1 - pText;
        box.style.filter = 'blur(' + (pText * 12).toFixed(1) + 'px)';
        box.style.transform = 'translateY(' + (pText * 36).toFixed(1) + 'px)';
      }
      if (photo) {
        photo.style.filter = 'blur(' + (5 * (1 - pPhoto)).toFixed(1) + 'px)';
      }
      if (overlay) {
        overlay.style.opacity = 1 - pPhoto;
      }
    }

    // Subtle parallax for the "How to use it" illustration gallery — each tile
    // drifts vertically at its own depth as the user scrolls, in the spirit of
    // big-brand editorial sites.
    var FLOW_SPEED = [30, 18, 24, 12];
    function onFlowScroll() {
      if (!flowVisual) return;
      var vh = window.innerHeight || 1;
      for (var i = 0; i < flowFigs.length; i++) {
        var fig = flowFigs[i];
        var target = fig.querySelector('.split') || fig.querySelector('img');
        if (!target) continue;
        var rect = fig.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var p = (center - vh / 2) / vh; // ~ -0.5 .. 0.5 while visible
        target.style.transform = 'translateY(' + (p * FLOW_SPEED[i % FLOW_SPEED.length]).toFixed(1) + 'px)';
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('scroll', onFlowScroll, { passive: true });
    window.addEventListener('resize', onFlowScroll);
    onScroll();
    onFlowScroll();

    return {
      destroy: function () {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        window.removeEventListener('scroll', onFlowScroll);
        window.removeEventListener('resize', onFlowScroll);
      }
    };
  }

  /* ===================================================================
     About page
     =================================================================== */

  function renderAbout(container) {
    container.innerHTML =
      '<section class="section section--narrow" style="padding-top: calc(var(--header-height) + var(--spacing-5xl))">' +
        '<div class="container">' +
          '<div class="section__header">' +
            sectionEyebrow('About') +
            '<h1 class="section__title" style="font-size: clamp(2rem, 5vw, 3rem)">About the project</h1>' +
          '</div>' +

          '<div class="card" style="margin-bottom: var(--spacing-xl)">' +
            '<h3 style="font-size: var(--font-size-lg); font-weight: 700; margin-bottom: var(--spacing-sm)">Creator</h3>' +
            '<p style="font-size: var(--font-size-base); color: var(--color-neutral-600); line-height: var(--line-height-relaxed)">Jianyi Wang — Industrial / Product Design.</p>' +
          '</div>' +

          '<div class="card" style="margin-bottom: var(--spacing-xl)">' +
            '<h3 style="font-size: var(--font-size-lg); font-weight: 700; margin-bottom: var(--spacing-sm)">Motivation</h3>' +
            '<p style="font-size: var(--font-size-base); color: var(--color-neutral-600); line-height: var(--line-height-relaxed)">This project began from a simple observation: AI image generators make it easy to mistake a polished render for a solved design problem. The toolkit is an attempt to give designers a lightweight, repeatable habit for slowing down and reading an image critically — before they commit to it.</p>' +
          '</div>' +

          '<div class="card" style="margin-bottom: var(--spacing-xl)">' +
            '<h3 style="font-size: var(--font-size-lg); font-weight: 700; margin-bottom: var(--spacing-sm)">Core limitation</h3>' +
            '<p style="font-size: var(--font-size-base); color: var(--color-neutral-600); line-height: var(--line-height-relaxed)">This toolkit supports critical reading, but does <strong>not</strong> verify usability, ergonomics, safety, manufacturability, or overall design quality. It is a thinking aid, not an engineering or validation tool.</p>' +
          '</div>' +

          '<div class="card">' +
            '<h3 style="font-size: var(--font-size-lg); font-weight: 700; margin-bottom: var(--spacing-md)">Research transparency</h3>' +
            '<ul style="display: flex; flex-direction: column; gap: var(--spacing-sm)">' +
              ['Research basis', 'References', 'Project limitations', 'Ethics &amp; participant research', 'Image &amp; case attributions', 'Generative AI use statement'].map(function (item) {
                return '<li style="color: var(--color-primary); font-size: var(--font-size-sm); font-weight: 500">' + item + ' <span style="color: var(--color-neutral-400); font-weight: 400">— content to be added</span></li>';
              }).join('') +
            '</ul>' +
          '</div>' +

        '</div>' +
      '</section>';

    return {};
  }

  /* ===================================================================
     Icon library (inline SVG, line style)
     =================================================================== */

  var ICONS = {
    lightbulb: '<path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7z"/><path d="M9 21h6"/><path d="M10 18h4"/>',
    sparkles: '<path d="M12 3l1.9 4.6 4.6 1.4-4.6 1.9L12 15.5l-1.9-4.6-4.6-1.9 4.6-1.4L12 3z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z"/>',
    flag: '<path d="M4 22V4"/><path d="M4 4h12l-2 4 2 4H4"/>',
    sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
    scene: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M3 7l9-4 9 4"/>',
    error: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    gap: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    claim: '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>',
    pen: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>'
  };

  function iconFor(key, size) {
    return iconSvg(ICONS[key] || ICONS.lightbulb, size);
  }

  /* ===================================================================
     Capabilities page (5 flip cards)
     =================================================================== */

  function renderCapabilities(container) {
    var caps = (window.CRBC_DATA && window.CRBC_DATA.CAPABILITIES) || [];

    container.innerHTML =
      '<section class="section" style="padding-top: calc(var(--header-height) + var(--spacing-4xl))">' +
        '<div class="container">' +
          '<div class="section__header">' +
            sectionEyebrow('Part 2 · Capabilities') +
            '<h1 class="section__title">What AI images can — and cannot — do.</h1>' +
            '<p class="section__lead">Five capabilities describe the design activities AI images can support. Each card also tells you what the capability <strong>cannot prove</strong>. Click a card to flip it.</p>' +
          '</div>' +
          '<div class="grid grid--2" style="align-items: stretch">' +
            caps.map(renderCapabilityCard).join('') +
          '</div>' +
        '</div>' +
      '</section>' +
      renderUseCasesSection(caps);

    $$('.flip-card', container).forEach(function (card) {
      card.addEventListener('click', function () { card.classList.toggle('is-flipped'); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('is-flipped'); }
      });
    });

    return {};
  }

  function renderCapabilityCard(cap) {
    return (
      '<div class="flip-card flip-card--cap" role="button" tabindex="0" aria-label="' + escapeHtml(cap.title) + ' — front and back">' +
        '<div class="flip-card__inner">' +
          '<div class="flip-card__face flip-card__front">' +
            '<img class="flip-card__img" src="' + escapeHtml(cap.front) + '" alt="' + escapeHtml(cap.title) + ' — front" loading="lazy">' +
            '<span class="cap-flip-hint">' + iconSvg('<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>', 14) + ' Tap to flip</span>' +
          '</div>' +
          '<div class="flip-card__face flip-card__back">' +
            '<img class="flip-card__img" src="' + escapeHtml(cap.back) + '" alt="' + escapeHtml(cap.title) + ' — back" loading="lazy">' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  /* -------------------------------------------------------------------
     Capabilities — Applied examples (one or more per capability)
     ------------------------------------------------------------------- */

  function renderUseCasesSection(caps) {
    return (
      '<section class="section section--alt section--examples">' +
        '<div class="container">' +
          '<div class="section__header">' +
            sectionEyebrow('Applied examples') +
            '<h2 class="section__title">See each capability in action.</h2>' +
            '<p class="section__lead">Eight applied examples from the card deck — each shows a real starting prompt or sketch, the concept image the AI produced, and the <strong>considerations</strong> a critical reader should hold onto.</p>' +
          '</div>' +
          '<div class="example-list">' +
            caps.map(renderExampleGroup).join('') +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function renderExampleGroup(cap) {
    var examples = (cap.useCases || []).map(function (uc, i) {
      return (
        '<figure class="example">' +
          '<div class="example__media">' +
            '<img class="example__img" src="' + escapeHtml(uc.image) + '" alt="' + escapeHtml(uc.title) + '" loading="lazy">' +
          '</div>' +
          '<figcaption class="example__caption">' +
            '<span class="example__num">Example ' + ('0' + (i + 1)).slice(-2) + '</span>' +
            '<span class="example__title">' + escapeHtml(uc.title) + '</span>' +
          '</figcaption>' +
        '</figure>'
      );
    }).join('');

    return (
      '<div class="example-group">' +
        '<header class="example-group__head">' +
          '<span class="example-group__badge">' + escapeHtml(cap.letter) + '</span>' +
          '<div class="example-group__text">' +
            '<h3 class="example-group__title">' + escapeHtml(cap.title) + '</h3>' +
          '</div>' +
        '</header>' +
        '<div class="example-group__items">' + examples + '</div>' +
      '</div>'
    );
  }

  /* ===================================================================
     Read the Image page (dual-axis matrix + 17 error cards + filter)
     =================================================================== */

  function renderRead(container) {
    var data = window.CRBC_DATA || {};
    var focuses = data.INSPECTION_FOCUSES || [];
    var levels = data.JUDGEMENT_LEVELS || [];
    var cards = data.ERROR_CARDS || [];

    var state = { focus: null, level: null, keyword: '' };

    function getFiltered() {
      return cards.filter(function (c) {
        if (state.focus && c.inspectionFocus !== state.focus) return false;
        if (state.level && c.judgementLevel !== state.level) return false;
        if (state.keyword) {
          var hay = (c.title + ' ' + c.helperTitle).toLowerCase();
          if (hay.indexOf(state.keyword.toLowerCase()) === -1) return false;
        }
        return true;
      });
    }

    function countInCell(focus, level) {
      return cards.filter(function (c) { return c.inspectionFocus === focus && c.judgementLevel === level; }).length;
    }

    function buildMatrix() {
      var html = '<div class="matrix-wrap"><div class="matrix">';
      html += '<div class="matrix__corner">Focus ↓ / Level →</div>';
      levels.forEach(function (l) {
        var isActive = state.level === l.label;
        html += '<div class="matrix__col-head' + (isActive ? ' is-active' : '') + '" data-col-level="' + l.label + '" style="cursor:pointer">' + escapeHtml(l.label) + '</div>';
      });
      focuses.forEach(function (f) {
        var isActiveRow = state.focus === f.label;
        html += '<div class="matrix__row-head' + (isActiveRow ? ' is-active' : '') + '" data-row-focus="' + f.label + '">' + escapeHtml(f.label) + '</div>';
        levels.forEach(function (l) {
          var count = countInCell(f.label, l.label);
          var isEmpty = count === 0;
          var isActive = state.focus === f.label && state.level === l.label;
          html += '<div class="matrix__cell' + (isEmpty ? ' is-empty' : '') + (isActive ? ' is-active' : '') + '" data-cell-focus="' + f.label + '" data-cell-level="' + l.label + '">' +
            (isEmpty ? '' : '<span class="matrix__cell-count">' + count + '</span><span class="matrix__cell-label">card' + (count !== 1 ? 's' : '') + '</span>') +
          '</div>';
        });
      });
      html += '</div></div>';
      return html;
    }

    function buildFilterBar() {
      var active = [];
      if (state.focus) active.push(state.focus);
      if (state.level) active.push(state.level);
      var html = '<div class="filter-bar">';
      html += '<input class="filter-chip" style="cursor:text" type="text" placeholder="Search cards…" data-keyword value="' + escapeHtml(state.keyword) + '">';
      active.forEach(function (a) {
        html += '<span class="filter-chip is-active">' + escapeHtml(a) + '</span>';
      });
      if (active.length) {
        html += '<button class="filter-chip__reset" type="button">Reset filters</button>';
      }
      html += '</div>';
      return html;
    }

    function buildCards(filtered) {
      if (!filtered.length) {
        return '<div class="card" style="text-align:center"><p style="color: var(--color-neutral-500)">No cards match this filter.</p></div>';
      }
      return '<div class="error-grid">' + filtered.map(renderErrorCard).join('') + '</div>';
    }

    function paint() {
      var filtered = getFiltered();
      container.innerHTML =
        '<section class="section" style="padding-top: calc(var(--header-height) + var(--spacing-4xl))">' +
          '<div class="container">' +
            '<div class="section__header">' +
              sectionEyebrow('Part 3 · Read the Image') +
              '<h1 class="section__title">Read errors and uncertainty.</h1>' +
              '<p class="section__lead">A structured vocabulary for reading AI product images — without calling every uncertainty an "AI error". Use the matrix to explore, then filter the cards below.</p>' +
            '</div>' +
            buildMatrix() +
            '<div style="height: var(--spacing-2xl)"></div>' +
            '<h2 style="font-size: var(--font-size-xl); font-weight: 700; margin-bottom: var(--spacing-md)">Cards <span style="color: var(--color-neutral-400); font-weight: 500; font-size: var(--font-size-base)">(' + filtered.length + ' of ' + cards.length + ')</span></h2>' +
            buildFilterBar() +
            buildCards(filtered) +
          '</div>' +
        '</section>';
    }

    paint();

    container.addEventListener('click', function (e) {
      var flip = e.target.closest('.flip-card');
      if (flip) { flip.classList.toggle('is-flipped'); return; }

      var cell = e.target.closest('.matrix__cell');
      if (cell && !cell.classList.contains('is-empty')) {
        state.focus = cell.dataset.cellFocus;
        state.level = cell.dataset.cellLevel;
        paint(); return;
      }

      var row = e.target.closest('.matrix__row-head');
      if (row) {
        var f = row.dataset.rowFocus;
        state.focus = (state.focus === f) ? null : f;
        state.level = null;
        paint(); return;
      }

      var col = e.target.closest('.matrix__col-head');
      if (col) {
        var l = col.dataset.colLevel;
        state.level = (state.level === l) ? null : l;
        state.focus = null;
        paint(); return;
      }

      var reset = e.target.closest('.filter-chip__reset');
      if (reset) {
        state.focus = null; state.level = null; state.keyword = '';
        paint(); return;
      }
    });

    container.addEventListener('input', function (e) {
      if (e.target && e.target.dataset && e.target.dataset.keyword !== undefined) {
        state.keyword = e.target.value;
        // Debounce-free: re-paint on input (acceptable for 17 cards)
        var kw = state.keyword;
        paint();
        var inp = container.querySelector('[data-keyword]');
        if (inp) { inp.value = kw; inp.focus(); }
      }
    });

    container.addEventListener('keydown', function (e) {
      var flip = e.target.closest('.flip-card');
      if (flip && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault(); flip.classList.toggle('is-flipped');
      }
    });

    return {};
  }

  function renderErrorCard(card) {
    return (
      '<figure class="error-card">' +
        '<div class="error-card__media">' +
          '<img class="error-card__img" src="' + escapeHtml(card.image) + '" alt="' + escapeHtml(card.title) + ' — front and back" loading="lazy">' +
        '</div>' +
        '<figcaption class="error-card__caption">' +
          '<span class="error-card__title">' + escapeHtml(card.title) + '</span>' +
          '<span class="error-card__meta">' + escapeHtml(card.inspectionFocus) + ' · ' + escapeHtml(card.judgementLevel) + '</span>' +
        '</figcaption>' +
      '</figure>'
    );
  }

  /* ===================================================================
     Cases page — simple 3-task case flow + comparison result
     =================================================================== */

  var MARK_REASONS = [
    'It looks visually incorrect',
    'It does not match the design intention',
    'The image does not provide enough evidence'
  ];

  var NEXT_ACTIONS = [
    'Correct or redraw the marked area',
    'Generate another view',
    'Compare it with the original intention',
    'Keep the issue unresolved for now',
    'Test it with a model or prototype',
    'Ask for specialist validation',
    'Do not continue with this direction'
  ];

  var CASE_STEP_LABELS = ['Understand the Idea', 'Review the Image', 'Decide What to Do'];

  function caseIllo(name, alt) {
    return '<img class="case-illo" src="assets/' + name + '.png" alt="' + escapeHtml(alt) + '" aria-hidden="true" loading="lazy">';
  }

  function caseImage(src, alt) {
    return '<img class="case-image__img" src="' + src + '" alt="' + escapeHtml(alt) + '">';
  }

  function renderCases(container) {
    var data = window.CRBC_DATA || {};
    var cases = data.CASES || [];
    var esc = escapeHtml;

    var view = 'hub';
    var currentCase = null;
    var state = null;
    var lsKey = null;
    var flashError = null;

    function freshState() {
      return {
        phase: 'intention',   // 'intention' | 'review' | 'decide' | 'result'
        seq: 0,
        markers: [],          // { id, x, y, note, reason, card }
        nextActions: [],
        completed: false
      };
    }

    function save() { if (state && lsKey) { try { localStorage.setItem(lsKey, JSON.stringify(state)); } catch (e) {} } }
    function clearSaved() { if (lsKey) { try { localStorage.removeItem(lsKey); } catch (e) {} } }
    function readSaved(id) { try { return JSON.parse(localStorage.getItem('crbc:' + id)); } catch (e) { return null; } }

    function findMarker(id) {
      for (var i = 0; i < state.markers.length; i++) if (state.markers[i].id === id) return state.markers[i];
      return null;
    }

    function goPhase(p) {
      state.phase = p;
      save();
      paint();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ----- persistent task statement ----- */

    function taskCard() {
      return '<div class="task-card">' +
        '<span class="task-card__label">Your task</span>' +
        '<p class="task-card__text">Read what the designer intended, inspect the AI-generated image, and mark anything that <strong>looks wrong</strong>, <strong>does not match the intention</strong>, or <strong>still needs to be checked</strong>. There is no score.</p>' +
      '</div>';
    }

    /* ----- simple 3-step stepper ----- */

    function stepperHtml() {
      var order = { intention: 0, review: 1, decide: 2, result: 3 };
      var active = order[state.phase] == null ? 0 : order[state.phase];
      var steps = CASE_STEP_LABELS.map(function (label, i) {
        var cls = 'stepper__step';
        if (i < active) cls += ' is-done';
        if (i === active) cls += ' is-current';
        return '<li class="' + cls + '"><span class="stepper__num">' + (i + 1) + '</span><span class="stepper__name">' + esc(label) + '</span></li>';
      }).join('');
      return '<ol class="stepper">' + steps + '</ol>';
    }

    /* ----- hub ----- */

    function hubHtml() {
      var rows = cases.map(function (c) {
        var saved = readSaved(c.id);
        var status, cta;
        if (c.available) {
          if (saved && saved.phase && !saved.completed) status = '<span class="case-card__status is-progress">In progress</span>';
          else status = '<span class="case-card__status">Not started</span>';
          cta = '<button type="button" class="btn btn--primary" data-action="start-case" data-value="' + esc(c.id) + '">' + (saved && saved.phase && !saved.completed ? 'Continue' : 'Start') + '</button>';
        } else {
          status = '<span class="case-card__status is-locked">Coming soon</span>';
          cta = '<button type="button" class="btn btn--outline" disabled>Locked</button>';
        }
        var meta = '<div class="case-card__meta"><span>' + esc(c.category) + '</span>' + (c.available ? '<span>' + esc(c.time) + '</span>' : '') + '<span class="case-card__focus">' + esc(c.focus) + '</span></div>';
        return '<article class="case-card' + (c.available ? '' : ' case-card--locked') + '">' +
          '<div class="case-card__top"><span class="case-card__number">Case ' + esc(c.number) + '</span>' + status + '</div>' +
          '<h3 class="case-card__title">' + esc(c.title) + '</h3>' +
          (c.subtitle ? '<p class="case-card__subtitle">' + esc(c.subtitle) + '</p>' : '') +
          meta +
          '<div class="case-card__cta">' + cta + '</div>' +
        '</article>';
      }).join('');

      return '<section class="section" style="padding-top: calc(var(--header-height) + var(--spacing-4xl))">' +
        '<div class="container">' +
          '<div class="section__header">' +
            sectionEyebrow('Part 4 · Cases') +
            '<h1 class="section__title">Practice before your own image.</h1>' +
            '<p class="section__lead">Three short tasks: understand what was intended, question the image, and decide what to do next — then compare your reading. Never a score.</p>' +
          '</div>' +
          '<div class="grid grid--2" style="align-items: stretch">' + rows + '</div>' +
        '</div>' +
      '</section>';
    }

    /* ----- Step 1: understand the idea ----- */

    function intentionHtml() {
      var c = currentCase;
      var reqs = c.intention.map(function (r, i) {
        return '<li><span class="req__num">' + (i + 1) + '</span><span>' + esc(r) + '</span></li>';
      }).join('');
      return '<div class="case-step">' +
        '<div class="case-hero">' +
          '<div class="case-hero__media">' + caseIllo('c5', 'A designer thinking about what they want to make') + '</div>' +
          '<div class="case-hero__body">' +
            '<h2 class="case-step__title">Understand the idea</h2>' +
            '<p class="case-step__question">What was the designer trying to create?</p>' +
          '</div>' +
        '</div>' +
        '<div class="case-panel">' +
          '<div class="case-panel__label">Design background</div>' +
          '<p class="case-panel__text">' + esc(c.designBackground.en) + '</p>' +
          '<p class="case-panel__text case-panel__text--cn">' + esc(c.designBackground.cn) + '</p>' +
        '</div>' +
        '<div class="case-panel">' +
          '<div class="case-panel__label">What the designer intended</div>' +
          '<ul class="req-list">' + reqs + '</ul>' +
        '</div>' +
        '<div class="case-hero">' +
          '<div class="case-hero__media">' + caseIllo('c6', 'A designer sketching the idea') + '</div>' +
          '<div class="case-hero__body">' +
            '<h3 class="case-step__title">The starting sketch</h3>' +
            '<p class="case-step__question">A rough drawing of the idea before generating.</p>' +
          '</div>' +
        '</div>' +
        '<div class="image-stage image-stage--readonly">' + caseImage(c.images.sketch, 'Initial concept sketch of the handheld health scanner') + '</div>' +
        '<div class="case-panel">' +
          '<div class="case-panel__label">The prompt they used</div>' +
          '<p class="case-panel__text case-panel__text--prompt">' + esc(c.prompt) + '</p>' +
        '</div>' +
        '<div class="case-step__actions">' +
          '<button type="button" class="btn btn--primary btn--lg" data-action="show-result">Show the AI result</button>' +
        '</div>' +
      '</div>';
    }

    /* ----- collapsible intention reference (kept beside the image) ----- */

    function intentionRefHtml() {
      var c = currentCase;
      var reqs = c.intention.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('');
      return '<details class="intention-ref" open>' +
        '<summary>Design intention (for reference)</summary>' +
        '<div class="intention-ref__body">' +
          '<p class="intention-ref__text">' + esc(c.designBackground.en) + '</p>' +
          '<ul class="case-list">' + reqs + '</ul>' +
        '</div>' +
      '</details>';
    }

    /* ----- Step 2: review the image ----- */

    function markerFormHtml(m, i) {
      var c = currentCase;
      var reasons = MARK_REASONS.map(function (r) {
        return '<button type="button" class="opt' + (m.reason === r ? ' is-selected' : '') + '" data-action="mark-reason" data-marker="' + m.id + '" data-value="' + esc(r) + '">' + esc(r) + '</button>';
      }).join('');

      var cards = (c.suggestedCards || []).map(function (title) {
        return '<button type="button" class="chip' + (m.card === title ? ' is-selected' : '') + '" data-action="mark-card" data-marker="' + m.id + '" data-value="' + esc(title) + '">' + esc(title) + '</button>';
      }).join('');

      return '<div class="marker marker--review">' +
        '<div class="marker__head">' +
          '<span class="marker__badge">' + (i + 1) + '</span>' +
          '<span class="marker__region-name">Marked area</span>' +
          '<button type="button" class="marker__remove" data-action="marker-remove" data-value="' + m.id + '">Remove</button>' +
        '</div>' +
        '<label class="marker__note">' +
          '<span class="marker__field-label">What did you notice?</span>' +
          '<textarea rows="2" data-marker-note="' + m.id + '" placeholder="e.g. The sensing head overlaps the body edge">' + esc(m.note || '') + '</textarea>' +
        '</label>' +
        '<div class="marker__field">' +
          '<span class="marker__field-label">Why did you mark it?</span>' +
          '<div class="opt-list">' + reasons + '</div>' +
        '</div>' +
        '<div class="marker__field">' +
          '<span class="marker__field-label">Add a card to describe this issue <em>(optional)</em></span>' +
          '<div class="chip-list">' + cards + '</div>' +
        '</div>' +
      '</div>';
    }

    function reviewHtml() {
      var c = currentCase;
      var max = 3;
      var pins = state.markers.map(function (m, i) {
        return '<div class="marker-pin" style="left:' + m.x + '%; top:' + m.y + '%">' + (i + 1) + '</div>';
      }).join('');

      var markersHtml = state.markers.length
        ? '<div class="marker-list">' + state.markers.map(markerFormHtml).join('') + '</div>'
        : '<div class="case-empty">Click an area on the image to mark it — you can mark up to three.</div>';

      return '<div class="case-step">' +
        '<div class="case-hero">' +
          '<div class="case-hero__media">' + caseIllo('c8', 'A designer checking the image against a card') + '</div>' +
          '<div class="case-hero__body">' +
            '<h2 class="case-step__title">Review the image</h2>' +
            '<p class="case-step__question">What looks wrong or unresolved?</p>' +
            '<p class="case-step__lead">Click up to three areas that you would question before using this image as a design direction.</p>' +
          '</div>' +
        '</div>' +
        intentionRefHtml() +
        '<div class="case-hero">' +
          '<div class="case-hero__media">' + caseIllo('c7', 'A designer generating an image on a computer') + '</div>' +
          '<div class="case-hero__body">' +
            '<h3 class="case-step__title">The AI result</h3>' +
            '<p class="case-step__question">Generated from the sketch and the prompt.</p>' +
          '</div>' +
        '</div>' +
        '<div class="image-stage" data-action="mark-stage">' +
          caseImage(c.images.challenge, 'AI concept render of the handheld health scanner — inspect closely') +
          pins +
          '<div class="image-stage__hint">Click to mark (' + state.markers.length + '/' + max + ')</div>' +
        '</div>' +
        markersHtml +
        '<div class="case-step__actions">' +
          '<button type="button" class="btn btn--outline" data-action="back-phase" data-value="intention">Back</button>' +
          '<button type="button" class="btn btn--primary" data-action="to-decide">Decide what to do next</button>' +
        '</div>' +
      '</div>';
    }

    /* ----- Step 3: decide what to do ----- */

    function decideHtml() {
      var opts = NEXT_ACTIONS.map(function (a) {
        return '<button type="button" class="chip' + (state.nextActions.indexOf(a) >= 0 ? ' is-selected' : '') + '" data-action="action-opt" data-value="' + esc(a) + '">' + esc(a) + '</button>';
      }).join('');
      return '<div class="case-step">' +
        '<div class="case-step__head">' +
          '<h2 class="case-step__title">Decide what to do</h2>' +
          '<p class="case-step__question">What would you do before using this image?</p>' +
        '</div>' +
        '<p class="case-step__lead">Pick one or two. You have already recorded <em>why</em> you questioned the image — now choose the next move.</p>' +
        '<div class="chip-list chip-list--lg">' + opts + '</div>' +
        '<div class="case-step__actions">' +
          '<button type="button" class="btn btn--outline" data-action="back-phase" data-value="review">Back</button>' +
          '<button type="button" class="btn btn--primary btn--lg" data-action="compare">Compare my reading</button>' +
        '</div>' +
      '</div>';
    }

    /* ----- Result: compare your reading ----- */

    function resultHtml() {
      var c = currentCase;

      var yourItems = state.markers.map(function (m, i) {
        return '<div class="compare-row">' +
          '<div class="compare-row__num">' + (i + 1) + '</div>' +
          '<div class="compare-row__body">' +
            '<p class="compare-row__text">' + esc(m.note || '—') + '</p>' +
            '<div class="compare-row__meta">' +
              (m.reason ? '<span class="tag">' + esc(m.reason) + '</span>' : '') +
              (m.card ? '<span class="tag tag--level">' + esc(m.card) + '</span>' : '') +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('') || '<p class="case-empty">Nothing marked.</p>';

      var yourActions = state.nextActions.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');

      var refItems = c.reference.findings.map(function (f, i) {
        return '<div class="ref-finding">' +
          '<div class="ref-finding__head"><span class="ref-finding__num">' + (i + 1) + '</span><span class="ref-finding__region">' + esc(f.region) + '</span><span class="tag">' + esc(f.card) + '</span></div>' +
          '<div class="ref-finding__block"><span class="ref-finding__label">What is visible</span><p>' + esc(f.evidence) + '</p></div>' +
          '<div class="ref-finding__block"><span class="ref-finding__label">Evidence boundary</span><p>' + esc(f.boundary) + '</p></div>' +
          '<div class="ref-finding__block"><span class="ref-finding__label">Possible next action</span><p>' + esc(f.action) + '</p></div>' +
        '</div>';
      }).join('');

      return '<div class="case-step">' +
        '<div class="case-step__head">' +
          '<h2 class="case-step__title">Compare your reading</h2>' +
          '<p class="case-step__subtitle">' + esc(c.reference.intro) + '</p>' +
        '</div>' +
        '<div class="case-panel">' +
          '<div class="case-panel__label">Corrected comparison image</div>' +
          '<div class="image-stage image-stage--readonly">' + caseImage(c.images.corrected, 'Corrected comparison render of the handheld health scanner') + '</div>' +
        '</div>' +
        '<div class="compare">' +
          '<div class="compare__col">' +
            '<h3 class="compare__heading">Your reading</h3>' +
            yourItems +
            '<div class="compare__block"><h4 class="compare__subhead">What you would do</h4>' +
              (yourActions ? '<ul class="case-list">' + yourActions + '</ul>' : '<p class="case-empty">Nothing chosen.</p>') +
            '</div>' +
          '</div>' +
          '<div class="compare__col">' +
            '<h3 class="compare__heading">Reference reading</h3>' +
            refItems +
          '</div>' +
        '</div>' +
        '<div class="case-feedback case-feedback--key">' + esc(c.keyReminder) + '</div>' +
        '<div class="compare-actions">' +
          '<a class="btn btn--outline" href="#/read">Review the cards</a>' +
          '<button type="button" class="btn btn--ghost" data-action="restart-case">Start over</button>' +
        '</div>' +
      '</div>';
    }

    /* ----- shell ----- */

    function errBanner(msg) {
      return '<div class="case-error" role="alert">' + esc(msg) + '</div>';
    }

    function caseHtml(err) {
      var body;
      if (state.phase === 'review') body = reviewHtml();
      else if (state.phase === 'decide') body = decideHtml();
      else if (state.phase === 'result') body = resultHtml();
      else body = intentionHtml();
      return '<section class="case">' +
        '<div class="container container--narrow">' +
          taskCard() +
          stepperHtml() +
          (err ? errBanner(err) : '') +
          body +
        '</div>' +
      '</section>';
    }

    /* ----- actions ----- */

    function startCase(id) {
      currentCase = null;
      for (var i = 0; i < cases.length; i++) if (cases[i].id === id) currentCase = cases[i];
      if (!currentCase || !currentCase.available) return;
      lsKey = 'crbc:' + id;
      var saved = readSaved(id);
      state = (saved && saved.phase && !saved.completed) ? saved : freshState();
      view = 'case';
      paint();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function addMarker(e, stage) {
      if (state.markers.length >= 3) {
        flashError = 'You can mark up to three areas.';
        paint();
        return;
      }
      var rect = stage.getBoundingClientRect();
      var x = Math.max(0, Math.min(100, Math.round((e.clientX - rect.left) / rect.width * 1000) / 10));
      var y = Math.max(0, Math.min(100, Math.round((e.clientY - rect.top) / rect.height * 1000) / 10));
      state.seq = (state.seq || 0) + 1;
      state.markers.push({ id: 'm' + state.seq, x: x, y: y, note: '', reason: '', card: '' });
      save();
      paint();
    }

    function removeMarker(id) {
      state.markers = state.markers.filter(function (m) { return m.id !== id; });
      save();
      paint();
    }

    function setReason(id, val) {
      var m = findMarker(id);
      if (m) { m.reason = (m.reason === val ? '' : val); save(); paint(); }
    }

    function setCard(id, val) {
      var m = findMarker(id);
      if (m) { m.card = (m.card === val ? '' : val); save(); paint(); }
    }

    function toggleAction(val) {
      var i = state.nextActions.indexOf(val);
      if (i >= 0) state.nextActions.splice(i, 1);
      else if (state.nextActions.length < 2) state.nextActions.push(val);
      else { flashError = 'Choose up to two actions.'; }
      save();
      paint();
    }

    function toDecide() {
      if (!state.markers.length) { flashError = 'Mark at least one area first.'; paint(); return; }
      var described = state.markers.some(function (m) { return m.note && m.note.trim(); });
      if (!described) { flashError = 'Describe at least one marked area.'; paint(); return; }
      goPhase('decide');
    }

    function compare() {
      if (!state.nextActions.length) { flashError = 'Choose at least one action.'; paint(); return; }
      state.completed = true;
      state.phase = 'result';
      save();
      paint();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function confirmRestart() {
      if (window.confirm('Clear your answers and start this case again?')) {
        clearSaved();
        state = freshState();
        paint();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    function onClick(e) {
      var t = e.target.closest('[data-action]');
      if (!t) return;
      var action = t.getAttribute('data-action');
      var val = t.getAttribute('data-value');
      var mid = t.getAttribute('data-marker');

      switch (action) {
        case 'start-case': startCase(val); break;
        case 'show-result': goPhase('review'); break;
        case 'mark-stage': addMarker(e, t); break;
        case 'marker-remove': removeMarker(val); break;
        case 'mark-reason': setReason(mid, val); break;
        case 'mark-card': setCard(mid, val); break;
        case 'action-opt': toggleAction(val); break;
        case 'back-phase': goPhase(val); break;
        case 'to-decide': toDecide(); break;
        case 'compare': compare(); break;
        case 'restart-case': confirmRestart(); break;
      }
    }

    function onInput(e) {
      var t = e.target;
      if (t && t.getAttribute && t.getAttribute('data-marker-note')) {
        var m = findMarker(t.getAttribute('data-marker-note'));
        if (m) { m.note = t.value; save(); }
      }
    }

    function paint() {
      var err = flashError;
      flashError = null;
      container.innerHTML = (view === 'hub') ? hubHtml() : caseHtml(err);
    }

    paint();
    container.addEventListener('click', onClick);
    container.addEventListener('input', onInput);

    return {
      destroy: function () {
        container.removeEventListener('click', onClick);
        container.removeEventListener('input', onInput);
      }
    };
  }

  /* ===================================================================
     Your Image — upload, observe, AI second reader, review record
     =================================================================== */

  function YI_annCenter(a) {
    if (a.type === 'ellipse') {
      return { x: (a.x0 + a.x1) / 2, y: (a.y0 + a.y1) / 2 };
    }
    if (a.points && a.points.length) {
      var xs = a.points.map(function (p) { return p[0]; });
      var ys = a.points.map(function (p) { return p[1]; });
      return {
        x: (Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2,
        y: (Math.min.apply(null, ys) + Math.max.apply(null, ys)) / 2
      };
    }
    return { x: 0.5, y: 0.5 };
  }

  function drawAnnotationsOn(ctx, W, H, annotations) {
    var i, a, k;
    var lw = Math.max(2, W / 280);
    ctx.lineWidth = lw;
    ctx.strokeStyle = '#4F46E5';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    for (i = 0; i < annotations.length; i++) {
      a = annotations[i];
      if (a.type === 'ellipse') {
        var cx = (a.x0 + a.x1) / 2 * W;
        var cy = (a.y0 + a.y1) / 2 * H;
        var rx = Math.max(Math.abs(a.x1 - a.x0) / 2 * W, 1);
        var ry = Math.max(Math.abs(a.y1 - a.y0) / 2 * H, 1);
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (a.type === 'freehand' && a.points && a.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(a.points[0][0] * W, a.points[0][1] * H);
        for (k = 1; k < a.points.length; k++) ctx.lineTo(a.points[k][0] * W, a.points[k][1] * H);
        ctx.stroke();
      }
    }
    for (i = 0; i < annotations.length; i++) {
      a = annotations[i];
      var c = YI_annCenter(a);
      var bx = c.x * W, by = c.y * H;
      var r = Math.max(10, W / 48);
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fillStyle = '#4F46E5';
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '600 ' + Math.max(11, W / 40) + 'px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(i + 1), bx, by + 1);
    }
  }

  function renderYourImage(container) {
    var YI_KEY = 'crbc:your-image';
    var data = window.CRBC_DATA || {};
    var CAPS = (data.CAPABILITIES || []).map(function (c) { return c.title; });
    var CARDS = data.ERROR_CARDS || [];
    var CAP_OPTIONS = CAPS.concat(['I am not sure']);

    var state = YI_load();
    var zoom = 1;
    var natural = { w: 0, h: 0 };
    var loadedSrc = null;
    var drawTool = 'ellipse';
    var draft = null;
    var noteLinks = [];
    var uid = (function () {
      var n = 0;
      return function () { n++; return 'yi-' + n + '-' + Math.random().toString(36).slice(2, 7); };
    })();

    function YI_default() {
      return {
        step: 1,
        image: null, imageName: '',
        prompt: '', intention: '', capability: '',
        annotations: [], observations: [], noConcern: false,
        ai: { status: 'idle', questions: [], error: '' }
      };
    }
    function YI_load() {
      try {
        var s = JSON.parse(window.localStorage.getItem(YI_KEY));
        if (s && s.annotations && s.observations) return s;
      } catch (e) {}
      return YI_default();
    }
    function YI_save() {
      try { window.localStorage.setItem(YI_KEY, JSON.stringify(state)); } catch (e) {}
    }
    function YI_reset() {
      state = YI_default();
      loadedSrc = null; zoom = 1; natural = { w: 0, h: 0 }; draft = null; noteLinks = [];
      YI_save();
    }

    function cardTitle(id) {
      for (var i = 0; i < CARDS.length; i++) if (CARDS[i].id === id) return CARDS[i].title;
      return '';
    }
    function annIndexOf(id) {
      for (var i = 0; i < state.annotations.length; i++) if (state.annotations[i].id === id) return i;
      return -1;
    }
    function fitZoom() {
      if (!natural.w) return 1;
      return Math.max(0.12, Math.min(2, 540 / natural.w));
    }

    /* ---- stepper ---- */
    function stepperHtml(current) {
      var steps = ['Add your image', 'Make your own notes', 'Review AI questions'];
      return '<div class="stepper">' + steps.map(function (label, i) {
        var n = i + 1;
        var cls = 'stepper__step';
        if (n < current) cls += ' is-done';
        else if (n === current) cls += ' is-current';
        return '<div class="' + cls + '"><span class="stepper__num">' + n + '</span>' + label + '</div>';
      }).join('') + '</div>';
    }

    function headerHtml(eyebrow, title, lead) {
      return '<div class="yi__header">' +
        '<span class="section__eyebrow">' + escapeHtml(eyebrow) + '</span>' +
        '<h1 class="section__title">' + escapeHtml(title) + '</h1>' +
        (lead ? '<p class="yi__lead">' + escapeHtml(lead) + '</p>' : '') +
      '</div>';
    }

    /* ---- Step 1 ---- */
    function paintStep1() {
      var capChips = CAP_OPTIONS.map(function (cap) {
        return '<button type="button" class="chip' + (state.capability === cap ? ' is-selected' : '') + '" data-action="capability" data-val="' + escapeHtml(cap) + '">' + escapeHtml(cap) + '</button>';
      }).join('');

      var uploadHtml;
      if (state.image) {
        uploadHtml =
          '<div class="yi-upload yi-upload--has">' +
            '<img class="yi-upload__img" src="' + state.image + '" alt="Your uploaded image">' +
            '<div class="yi-upload__overlay">' +
              '<span class="yi-upload__name">' + escapeHtml(state.imageName || 'Uploaded image') + '</span>' +
              '<button type="button" class="btn btn--outline btn--sm" data-action="change-image">Change image</button>' +
            '</div>' +
          '</div>';
      } else {
        uploadHtml =
          '<div class="yi-upload" data-action="upload">' +
            '<div class="yi-upload__icon">' + iconSvg('<path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>', 28) + '</div>' +
            '<p class="yi-upload__text">Click to upload a JPG, PNG or WebP</p>' +
            '<p class="yi-upload__hint">Your image stays on this device.</p>' +
          '</div>';
      }

      container.innerHTML =
        '<section class="yi">' +
          '<div class="container">' +
            headerHtml('Your Image · Step 1 of 3', 'What were you trying to create?',
              'Add your image and a short note about what you asked the AI to do. This becomes the baseline you compare your review against.') +
            '<div class="yi-card">' +
              '<div class="yi-field">' +
                '<span class="yi-field__label">Your AI-generated image <span class="yi-req">*</span></span>' +
                uploadHtml +
                '<input type="file" class="u-hidden" data-file accept="image/png,image/jpeg,image/webp">' +
              '</div>' +
              '<div class="yi-field">' +
                '<label class="yi-field__label" for="yi-prompt">What did you ask the AI to create? <span class="yi-req">*</span></label>' +
                '<textarea id="yi-prompt" class="yi-input" rows="4" data-field="prompt" placeholder="Paste the main prompt you used to generate this image.">' + escapeHtml(state.prompt) + '</textarea>' +
              '</div>' +
              '<div class="yi-field">' +
                '<label class="yi-field__label" for="yi-intention">What is this concept meant to do? <span class="yi-req">*</span></label>' +
                '<input id="yi-intention" class="yi-input" type="text" data-field="intention" value="' + escapeHtml(state.intention) + '" placeholder="One sentence, e.g. a handheld health device used one-handed.">' +
              '</div>' +
              '<div class="yi-field">' +
                '<span class="yi-field__label">How did you use AI for this image? <span class="yi-optional">(optional)</span></span>' +
                '<div class="chip-list">' + capChips + '</div>' +
                '<p class="yi-field__hint">This helps the AI pick more relevant questions. It does not predict that a certain use causes errors.</p>' +
              '</div>' +
              '<div class="yi-actions">' +
                '<button type="button" class="btn btn--primary btn--lg" data-action="start">Start My Review</button>' +
                '<span class="yi-form-err u-hidden" data-err>Please add an image, your prompt and one sentence about the intended use.</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</section>';
    }

    /* ---- Step 2 ---- */
    function noteListHtml() {
      if (!state.observations.length) {
        return '<p class="yi-notes__empty">No notes yet. Add one below, or circle an area on the image first.</p>';
      }
      return '<div class="yi-notes">' + state.observations.map(function (o, i) {
        var marks = (o.annotationIds || []).map(function (id) {
          var idx = annIndexOf(id);
          return idx >= 0 ? '<span class="yi-note__mark">Mark ' + (idx + 1) + '</span>' : '';
        }).filter(Boolean).join('');
        return '<div class="yi-note">' +
          '<div class="yi-note__head"><span class="yi-note__badge">' + (i + 1) + '</span>' + marks + '<button type="button" class="yi-note__remove" data-action="remove-note" data-id="' + o.id + '">Remove</button></div>' +
          '<p class="yi-note__text">' + escapeHtml(o.text) + '</p>' +
          (o.card ? '<span class="yi-note__card">' + escapeHtml(cardTitle(o.card)) + '</span>' : '') +
        '</div>';
      }).join('') + '</div>';
    }

    function linkChipsHtml() {
      if (!state.annotations.length) {
        return '<span class="yi-link__empty">Draw a mark on the image first, then link it to your note (optional).</span>';
      }
      return state.annotations.map(function (a, i) {
        var on = noteLinks.indexOf(a.id) >= 0;
        return '<button type="button" class="chip' + (on ? ' is-selected' : '') + '" data-action="link" data-id="' + a.id + '">Mark ' + (i + 1) + '</button>';
      }).join('');
    }

    function toolbarHtml() {
      var tools = [
        { id: 'ellipse', label: 'Circle an area' },
        { id: 'freehand', label: 'Draw freely' },
        { id: 'erase', label: 'Erase a mark' }
      ];
      var toolBtns = tools.map(function (t) {
        return '<button type="button" class="yi-tool' + (drawTool === t.id ? ' is-active' : '') + '" data-action="tool" data-tool="' + t.id + '" title="' + escapeHtml(t.label) + '">' + escapeHtml(t.label) + '</button>';
      }).join('');
      return '<div class="yi-toolbar">' +
        toolBtns +
        '<span class="yi-toolbar__sep"></span>' +
        '<button type="button" class="yi-tool" data-action="undo" title="Undo last mark">Undo</button>' +
        '<button type="button" class="yi-tool" data-action="clear" title="Clear all marks">Clear</button>' +
        '<span class="yi-toolbar__sep"></span>' +
        '<button type="button" class="yi-tool yi-tool--icon" data-action="zoom-out" title="Zoom out">−</button>' +
        '<button type="button" class="yi-tool" data-action="zoom-reset" title="Fit to width">Fit</button>' +
        '<button type="button" class="yi-tool yi-tool--icon" data-action="zoom-in" title="Zoom in">+</button>' +
      '</div>';
    }

    function paintStep2() {
      var cap = state.capability || 'Not specified';
      container.innerHTML =
        '<section class="yi">' +
          '<div class="container">' +
            headerHtml('Your Image · Step 2 of 3', 'Before any suggestions, is there anything you want to look at more closely?',
              'Mark what matters to your judgement. It is also fine if you do not notice a concern yet.') +
            '<details class="yi-context">' +
              '<summary>Your prompt &amp; intention</summary>' +
              '<div class="yi-context__grid">' +
                '<div><span class="yi-context__label">Prompt</span><p>' + escapeHtml(state.prompt || '—') + '</p></div>' +
                '<div><span class="yi-context__label">What it should do</span><p>' + escapeHtml(state.intention || '—') + '</p></div>' +
                '<div><span class="yi-context__label">How you used AI</span><p>' + escapeHtml(cap) + '</p></div>' +
              '</div>' +
            '</details>' +
            '<div class="yi-work">' +
              '<div class="yi-stage-col">' +
                toolbarHtml() +
                '<div class="yi-wrap" id="yi-wrap">' +
                  '<div class="yi-stage" id="yi-stage">' +
                    '<img class="yi-img" id="yi-img" alt="Your uploaded image">' +
                    '<canvas class="yi-canvas" id="yi-canvas"></canvas>' +
                  '</div>' +
                '</div>' +
                '<p class="yi-hint">Each mark gets a number. Marks just record where you looked — they do not confirm a problem.</p>' +
              '</div>' +
              '<div class="yi-side">' +
                '<h3 class="yi-side__title">Your notes</h3>' +
                noteListHtml() +
                '<div class="yi-note-form">' +
                  '<span class="yi-field__label">Add a note</span>' +
                  '<textarea class="yi-input" rows="3" data-note-text placeholder="What did you notice here?"></textarea>' +
                  '<div class="yi-link" data-link>' + linkChipsHtml() + '</div>' +
                  '<select class="yi-input" data-note-card>' +
                    '<option value="">Related card (optional)</option>' +
                    CARDS.map(function (c) { return '<option value="' + c.id + '">' + escapeHtml(c.title) + '</option>'; }).join('') +
                  '</select>' +
                  '<button type="button" class="btn btn--outline btn--sm" data-action="save-note">Save note</button>' +
                  '<span class="yi-form-err u-hidden" data-note-err>Add a short note first.</span>' +
                '</div>' +
                '<button type="button" class="yi-noconcern' + (state.noConcern ? ' is-on' : '') + '" data-action="no-concern">' +
                  '<span class="yi-noconcern__box">' + (state.noConcern ? '✓' : '') + '</span>' +
                  'I do not notice a concern at this stage.' +
                '</button>' +
                '<div class="yi-actions">' +
                  '<button type="button" class="btn btn--primary btn--lg" data-action="submit-review">Submit My First Review</button>' +
                  '<button type="button" class="btn btn--outline btn--lg" data-action="back-step">Back</button>' +
                  '<button type="button" class="btn btn--outline btn--lg" data-action="restart">Start over</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</section>';
      setupCanvas();
    }

    function resizeCanvas() {
      var stage = $('#yi-stage', container);
      var canvas = $('#yi-canvas', container);
      if (!stage || !canvas) return;
      var w = Math.max(1, Math.round(natural.w * zoom));
      var h = Math.max(1, Math.round(natural.h * zoom));
      stage.style.width = w + 'px';
      stage.style.height = h + 'px';
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
    }
    function repaintCanvas() {
      var canvas = $('#yi-canvas', container);
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawAnnotationsOn(ctx, canvas.width, canvas.height, state.annotations);
      if (draft) drawAnnotationsOn(ctx, canvas.width, canvas.height, [draft]);
    }

    function setupCanvas() {
      var img = $('#yi-img', container);
      var stage = $('#yi-stage', container);
      var canvas = $('#yi-canvas', container);
      if (!img || !stage || !canvas) return;

      function ready() {
        if (loadedSrc !== state.image) {
          natural.w = img.naturalWidth;
          natural.h = img.naturalHeight;
          zoom = fitZoom();
          loadedSrc = state.image;
        }
        resizeCanvas();
        repaintCanvas();
      }
      img.onload = ready;
      img.src = state.image;
      if (img.complete && img.naturalWidth) ready();

      function pt(e) {
        var rect = stage.getBoundingClientRect();
        var x = (e.clientX - rect.left) / zoom;
        var y = (e.clientY - rect.top) / zoom;
        return { x: x / natural.w, y: y / natural.h };
      }
      function hitTest(p) {
        for (var i = state.annotations.length - 1; i >= 0; i--) {
          var a = state.annotations[i];
          if (a.type === 'ellipse') {
            var cx = (a.x0 + a.x1) / 2, cy = (a.y0 + a.y1) / 2;
            var rx = Math.max(Math.abs(a.x1 - a.x0) / 2, 0.02);
            var ry = Math.max(Math.abs(a.y1 - a.y0) / 2, 0.02);
            var d = Math.pow((p.x - cx) / rx, 2) + Math.pow((p.y - cy) / ry, 2);
            if (d <= 1.6) return i;
          } else if (a.type === 'freehand' && a.points) {
            for (var k = 0; k < a.points.length - 1; k++) {
              if (YI_distToSeg(p, a.points[k], a.points[k + 1]) < 0.03) return i;
            }
          }
        }
        return -1;
      }
      function down(e) {
        e.preventDefault();
        var p = pt(e);
        if (drawTool === 'erase') {
          var i = hitTest(p);
          if (i >= 0) { state.annotations.splice(i, 1); YI_save(); refreshLinkChips(); repaintCanvas(); }
          return;
        }
        if (drawTool === 'ellipse') {
          draft = { id: uid(), type: 'ellipse', x0: p.x, y0: p.y, x1: p.x, y1: p.y };
        } else if (drawTool === 'freehand') {
          draft = { id: uid(), type: 'freehand', points: [[p.x, p.y]] };
        } else { return; }
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
      }
      function move(e) {
        var p = pt(e);
        if (draft.type === 'ellipse') { draft.x1 = p.x; draft.y1 = p.y; }
        else if (draft.type === 'freehand') { draft.points.push([p.x, p.y]); }
        repaintCanvas();
      }
      function up() {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
        var ok = false;
        if (draft && draft.type === 'ellipse') {
          ok = Math.abs(draft.x1 - draft.x0) > 0.012 || Math.abs(draft.y1 - draft.y0) > 0.012;
        } else if (draft && draft.type === 'freehand') {
          ok = draft.points.length > 2;
        }
        if (ok) state.annotations.push(draft);
        draft = null;
        YI_save();
        refreshLinkChips();
        repaintCanvas();
      }
      canvas.addEventListener('mousedown', down);
    }

    function refreshLinkChips() {
      var linkEl = $('[data-link]', container);
      if (linkEl) linkEl.innerHTML = linkChipsHtml();
      var notesEl = $('.yi-notes', container);
      if (notesEl) notesEl.outerHTML = noteListHtml();
    }

    /* ---- Step 3 ---- */
    function aiDecisionsMade() {
      return state.ai.questions.every(function (q) { return q.decision; });
    }

    function paintStep3() {
      var body;
      if (state.ai.status === 'loading') {
        body =
          '<div class="yi-ai yi-ai--loading">' +
            '<div class="yi-ai__spinner"></div>' +
            '<p class="yi-ai__loading-text">Reading your prompt and intention for a few questions worth checking…</p>' +
          '</div>';
      } else if (state.ai.status === 'error') {
        body =
          '<div class="yi-ai yi-ai--error">' +
            '<p class="yi-ai__error-text">' + escapeHtml(state.ai.error) + '</p>' +
            '<p class="yi-ai__error-hint">Tip: to enable AI suggestions, run the local server with <code>node server.js</code> and open this page through it. You can still create your record from your own notes only.</p>' +
            '<div class="yi-actions"><button type="button" class="btn btn--outline btn--lg" data-action="ai-retry">Try again</button></div>' +
          '</div>';
      } else if (state.ai.status === 'done' && !state.ai.questions.length) {
        body =
          '<div class="yi-ai yi-ai--empty">' +
            '<p class="yi-ai__empty-text">No additional question could be grounded in the information provided.</p>' +
          '</div>';
      } else {
        body = '<div class="yi-ai">' + state.ai.questions.map(function (q, i) {
          return '<div class="yi-q' + (q.decision === 'include' ? ' is-included' : q.decision === 'reject' ? ' is-rejected' : '') + '">' +
            '<p class="yi-q__question">' + escapeHtml(q.question) + '</p>' +
            '<p class="yi-q__basis"><span class="yi-q__basis-label">Why it was raised</span>' + escapeHtml(q.basis) + '</p>' +
            '<span class="yi-q__lens">' + escapeHtml(q.relatedCard || 'No direct card match') + '</span>' +
            '<div class="yi-q__actions">' +
              '<button type="button" class="btn btn--sm ' + (q.decision === 'include' ? 'btn--primary' : 'btn--outline') + '" data-action="ai-decide" data-i="' + i + '" data-d="include">Include in My Record</button>' +
              '<button type="button" class="btn btn--sm ' + (q.decision === 'reject' ? 'btn--primary' : 'btn--ghost') + '" data-action="ai-decide" data-i="' + i + '" data-d="reject">This Does Not Apply</button>' +
            '</div>' +
          '</div>';
        }).join('') + '</div>';
      }

      container.innerHTML =
        '<section class="yi">' +
          '<div class="container">' +
            headerHtml('Your Image · Step 3 of 3', 'Here are a few additional questions that may be worth considering.',
              'These are suggestions, not confirmed problems. Keep only those that feel relevant to your image and intention.') +
            '<p class="yi-ai-note">The AI is a second reader and can miss things or be wrong. You keep the final call on every suggestion.</p>' +
            body +
            '<div class="yi-actions yi-actions--inline">' +
              '<button type="button" class="btn btn--primary btn--lg" data-action="create-record">Create My Review Record</button>' +
              '<button type="button" class="btn btn--outline btn--lg" data-action="back-step">Back to my notes</button>' +
              '<button type="button" class="btn btn--outline btn--lg" data-action="restart">Start a new review</button>' +
            '</div>' +
          '</div>' +
        '</section>';
    }

    /* ---- Result ---- */
    function includedQuestions() {
      return state.ai.questions.filter(function (q) { return q.decision === 'include'; });
    }

    function paintResult() {
      var obs = state.observations;
      var inc = includedQuestions();

      var obsHtml;
      if (!obs.length) {
        obsHtml = '<p class="yi-record__empty">No concern was recorded during the user\'s first review.</p>';
      } else {
        obsHtml = '<ol class="yi-record__list">' + obs.map(function (o, i) {
          var marks = (o.annotationIds || []).map(function (id) {
            var idx = annIndexOf(id);
            return idx >= 0 ? 'Mark ' + (idx + 1) : '';
          }).filter(Boolean).join(', ');
          return '<li><span class="yi-record__num">' + (i + 1) + '</span><div><p class="yi-record__text">' + escapeHtml(o.text) + '</p>' +
            (marks ? '<span class="yi-record__meta">' + escapeHtml(marks) + '</span>' : '') +
            (o.card ? '<span class="yi-record__card">' + escapeHtml(cardTitle(o.card)) + '</span>' : '') +
          '</div></li>';
        }).join('') + '</ol>';
      }

      var aiHtml;
      if (!inc.length) {
        aiHtml = '<p class="yi-record__empty">No AI follow-up question was included in the final record.</p>';
      } else {
        aiHtml = '<ul class="yi-record__list">' + inc.map(function (q) {
          return '<li><p class="yi-record__text">' + escapeHtml(q.question) + '</p>' +
            '<span class="yi-record__card">' + escapeHtml(q.relatedCard || 'No direct card match') + '</span></li>';
        }).join('') + '</ul>';
      }

      var legend = obs.filter(function (o) { return (o.annotationIds || []).length; });
      var legendHtml = legend.length
        ? '<div class="yi-legend">' + legend.map(function (o, i) {
            return '<div class="yi-legend__row"><span class="yi-note__badge">' + (i + 1) + '</span><span>' + escapeHtml(o.text) + '</span></div>';
          }).join('') + '</div>'
        : '';

      var annoHtml = state.annotations.length
        ? '<canvas id="yi-result-canvas" class="yi-result-canvas"></canvas>'
        : '<img class="yi-result-canvas" src="' + state.image + '" alt="Your uploaded image">';

      var cap = state.capability || 'Not specified';

      container.innerHTML =
        '<section class="yi">' +
          '<div class="container">' +
            headerHtml('Your Image · Review Record', 'Your Review Record',
              'This record brings together what you noticed and the AI questions you chose to keep. It does not certify that the image is correct, usable, safe or feasible.') +
            '<div class="yi-record">' +
              '<section class="yi-record__section">' +
                '<h3 class="yi-record__heading">Image and Original Intention</h3>' +
                '<div class="yi-record__grid">' +
                  '<img class="yi-record__thumb" src="' + state.image + '" alt="Your uploaded image">' +
                  '<dl class="yi-record__meta-list">' +
                    '<dt>Prompt</dt><dd>' + escapeHtml(state.prompt || '—') + '</dd>' +
                    '<dt>What it should do</dt><dd>' + escapeHtml(state.intention || '—') + '</dd>' +
                    '<dt>How you used AI</dt><dd>' + escapeHtml(cap) + '</dd>' +
                  '</dl>' +
                '</div>' +
              '</section>' +
              '<section class="yi-record__section">' +
                '<h3 class="yi-record__heading">Annotated Review Image</h3>' +
                annoHtml +
                '<p class="yi-anno-note">Marks show your review, not verified defects.</p>' +
                legendHtml +
              '</section>' +
              '<section class="yi-record__section">' +
                '<h3 class="yi-record__heading">My Observations</h3>' + obsHtml +
              '</section>' +
              '<section class="yi-record__section">' +
                '<h3 class="yi-record__heading">AI Questions I Included</h3>' + aiHtml +
              '</section>' +
              '<section class="yi-record__section yi-boundary">' +
                '<h3 class="yi-record__heading">Review Boundary</h3>' +
                '<ul class="yi-boundary__list">' +
                  '<li>No visible concern recorded does not mean that no problem exists.</li>' +
                  '<li>Unverified claims still require appropriate evidence.</li>' +
                '</ul>' +
              '</section>' +
              '<div class="yi-record__actions">' +
                (state.annotations.length ? '<button type="button" class="btn btn--primary" data-action="download">Download Annotated Image</button>' : '') +
                '<button type="button" class="btn btn--ghost" data-action="back">Back to my notes</button>' +
                '<button type="button" class="btn btn--outline" data-action="restart">Review Another Image</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</section>';
      if (state.annotations.length) renderResultCanvas();
    }

    function renderResultCanvas() {
      var canvas = $('#yi-result-canvas', container);
      if (!canvas) return;
      var img = new Image();
      img.onload = function () {
        var W = img.naturalWidth, H = img.naturalHeight;
        canvas.width = W; canvas.height = H;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, W, H);
        drawAnnotationsOn(ctx, W, H, state.annotations);
      };
      img.src = state.image;
    }

    function downloadAnnotated() {
      var canvas = $('#yi-result-canvas', container);
      if (!canvas) return;
      var a = document.createElement('a');
      a.download = 'annotated-review.png';
      a.href = canvas.toDataURL('image/png');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    /* ---- AI call ---- */
    function runAI() {
      state.ai.status = 'loading';
      state.ai.error = '';
      YI_save();
      paint();
      var payload = {
        prompt: state.prompt,
        intention: state.intention,
        capability: state.capability || 'Not specified',
        observations: state.observations.map(function (o) {
          return { text: o.text, card: o.card ? cardTitle(o.card) : null };
        }),
        cards: CARDS.map(function (c) { return c.title; })
      };
      fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).then(function (res) {
        if (res && res.questions) {
          state.ai.questions = res.questions.map(function (q) {
            return { question: q.question, basis: q.basis, relatedCard: q.relatedCard, decision: null };
          });
          state.ai.status = 'done';
        } else {
          state.ai.status = 'error';
          state.ai.error = 'The AI did not return a usable response. You can still create your record from your own notes.';
        }
        paint();
      }).catch(function () {
        state.ai.status = 'error';
        state.ai.error = 'Could not reach the AI helper. You can still create your record with only your own notes.';
        paint();
      });
    }

    /* ---- events ---- */
    function onClick(e) {
      var el = e.target.closest('[data-action]');
      if (!el) return;
      var action = el.getAttribute('data-action');

      if (action === 'upload' || action === 'change-image') {
        var fileInput = $('[data-file]', container);
        if (fileInput) fileInput.click();
        return;
      }
      if (action === 'capability') {
        var val = el.getAttribute('data-val');
        state.capability = state.capability === val ? '' : val;
        YI_save(); paint();
        return;
      }
      if (action === 'start') {
        if (!state.image || !state.prompt.trim() || !state.intention.trim()) {
          var err = $('[data-err]', container);
          if (err) err.classList.remove('u-hidden');
          return;
        }
        state.step = 2; YI_save(); paint();
        return;
      }
      if (action === 'tool') {
        drawTool = el.getAttribute('data-tool');
        var activeBtns = $$('.yi-tool[data-action="tool"]', container);
        activeBtns.forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-tool') === drawTool); });
        return;
      }
      if (action === 'undo') {
        if (state.annotations.length) { state.annotations.pop(); draft = null; YI_save(); refreshLinkChips(); repaintCanvas(); }
        return;
      }
      if (action === 'clear') {
        if (!state.annotations.length) return;
        if (window.confirm('Remove all marks on this image?')) { state.annotations = []; draft = null; YI_save(); refreshLinkChips(); repaintCanvas(); }
        return;
      }
      if (action === 'zoom-in') { zoom = Math.min(4, zoom * 1.25); resizeCanvas(); repaintCanvas(); return; }
      if (action === 'zoom-out') { zoom = Math.max(0.12, zoom / 1.25); resizeCanvas(); repaintCanvas(); return; }
      if (action === 'zoom-reset') { zoom = fitZoom(); resizeCanvas(); repaintCanvas(); return; }

      if (action === 'link') {
        var id = el.getAttribute('data-id');
        var pos = noteLinks.indexOf(id);
        if (pos >= 0) noteLinks.splice(pos, 1); else noteLinks.push(id);
        refreshLinkChips();
        return;
      }
      if (action === 'save-note') {
        var ta = $('[data-note-text]', container);
        var sel = $('[data-note-card]', container);
        var text = ta ? ta.value.trim() : '';
        if (!text) {
          var errEl = $('[data-note-err]', container);
          if (errEl) errEl.classList.remove('u-hidden');
          return;
        }
        state.observations.push({
          id: uid(),
          text: text,
          card: sel && sel.value ? sel.value : null,
          annotationIds: noteLinks.slice()
        });
        noteLinks = [];
        YI_save(); paint();
        return;
      }
      if (action === 'remove-note') {
        var rid = el.getAttribute('data-id');
        state.observations = state.observations.filter(function (o) { return o.id !== rid; });
        YI_save(); paint();
        return;
      }
      if (action === 'no-concern') {
        state.noConcern = !state.noConcern;
        YI_save();
        el.classList.toggle('is-on', state.noConcern);
        var box = $('.yi-noconcern__box', el);
        if (box) box.textContent = state.noConcern ? '✓' : '';
        return;
      }
      if (action === 'submit-review') {
        state.step = 3;
        YI_save();
        runAI();
        return;
      }
      if (action === 'ai-retry') {
        runAI();
        return;
      }
      if (action === 'ai-decide') {
        var idx = parseInt(el.getAttribute('data-i'), 10);
        var d = el.getAttribute('data-d');
        if (state.ai.questions[idx]) state.ai.questions[idx].decision = d;
        YI_save(); paint();
        return;
      }
      if (action === 'create-record') {
        state.step = 4; YI_save(); paint();
        return;
      }
      if (action === 'download') {
        downloadAnnotated();
        return;
      }
      if (action === 'back') {
        state.step = 2; YI_save(); paint();
        return;
      }
      if (action === 'back-step') {
        state.step = Math.max(1, state.step - 1); YI_save(); paint();
        return;
      }
      if (action === 'restart') {
        if (!window.confirm('Start a new review? Your current image, notes and AI questions will be cleared.')) return;
        YI_reset(); paint();
        return;
      }
    }

    function onInput(e) {
      var el = e.target;
      if (el.hasAttribute('data-field')) {
        state[el.getAttribute('data-field')] = el.value;
        YI_save();
      }
    }
    function onChange(e) {
      var el = e.target;
      if (el.hasAttribute('data-file')) {
        var f = el.files && el.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
          state.image = reader.result;
          state.imageName = f.name;
          state.annotations = [];
          state.observations = [];
          state.noConcern = false;
          state.ai = { status: 'idle', questions: [], error: '' };
          loadedSrc = null; zoom = 1; natural = { w: 0, h: 0 };
          YI_save(); paint();
        };
        reader.readAsDataURL(f);
      }
    }

    function paint() {
      if (state.step === 1) paintStep1();
      else if (state.step === 2) paintStep2();
      else if (state.step === 3) paintStep3();
      else paintResult();
      YI_save();
    }

    container.addEventListener('click', onClick);
    container.addEventListener('input', onInput);
    container.addEventListener('change', onChange);

    paint();

    return {
      destroy: function () {
        container.removeEventListener('click', onClick);
        container.removeEventListener('input', onInput);
        container.removeEventListener('change', onChange);
      }
    };
  }

  function YI_distToSeg(p, a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1];
    var len2 = dx * dx + dy * dy;
    var t = 0;
    if (len2 > 0) t = Math.max(0, Math.min(1, ((p.x - a[0]) * dx + (p.y - a[1]) * dy) / len2));
    var cx = a[0] + t * dx, cy = a[1] + t * dy;
    return Math.sqrt((p.x - cx) * (p.x - cx) + (p.y - cy) * (p.y - cy));
  }

  /* ===================================================================
     Placeholder pages (sections 2–6, to be built in later phases)
     =================================================================== */

  function placeholderPage(title, desc) {
    return function (container) {
      container.innerHTML =
        '<section class="placeholder-page">' +
          '<div class="container container--narrow">' +
            '<div class="placeholder-page__icon">' +
              iconSvg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', 32) +
            '</div>' +
            '<h1 class="placeholder-page__title">' + escapeHtml(title) + '</h1>' +
            '<p class="placeholder-page__desc">' + escapeHtml(desc) + '</p>' +
          '</div>' +
        '</section>';
      return {};
    };
  }

  /* ===================================================================
     Onboarding tour
     =================================================================== */

  var TOUR = [
    { target: null,             title: 'Welcome',                  body: "This toolkit helps you look beyond the polished surface of AI-generated product images. Explore what AI can do, recognise what may be wrong or uncertain, and practise reviewing your own images." },
    { target: '#/capabilities', title: 'AI Capability Cards',      body: "First, meet AI's capabilities. These cards show how AI can support early product design, as well as what its images cannot confirm. Start here to build a more realistic understanding of the tool." },
    { target: '#/read',         title: 'Error & Uncertainty Cards', body: "Learn what to look for. AI images may contain visible errors, hidden logic gaps or claims that still need evidence. These cards give you simple terms for describing what you notice." },
    { target: '#/cases',        title: 'Case Challenges',          body: "Ready for a quick challenge? Review an AI-generated concept, mark anything questionable and explain your reasoning. You can then compare your reading with a reference analysis." },
    { target: '#/your-image',   title: 'Apply to Your Image',      body: "Now bring in your own image. Upload an AI-generated product image and use the cards to examine it. Mark what you can see, what you are assuming and what still needs to be checked." }
  ];

  function startTour() {
    var index = 0;
    var root = null;

    function clearHighlight() {
      $$('.header__link.tour-target').forEach(function (el) { el.classList.remove('tour-target'); });
    }

    function hideHeroBox() {
      document.body.classList.add('tour-active');
    }
    function showHeroBox() {
      document.body.classList.remove('tour-active');
    }

    function highlight(step) {
      clearHighlight();
      if (step.target) {
        var el = $('.header__link[data-nav="' + step.target + '"]');
        if (el) el.classList.add('tour-target');
      }
    }

    function render() {
      var step = TOUR[index];
      highlight(step);

      var centered = !step.target;
      root.innerHTML =
        '<div class="tour-backdrop' + (centered ? ' is-centered' : '') + '">' +
          '<div class="tour-card" role="dialog" aria-label="' + escapeHtml(step.title) + '">' +
            '<div class="tour-card__avatar"><img src="assets/c5.png" alt="" aria-hidden="true"></div>' +
            '<div class="tour-card__body">' +
              '<div class="tour-card__meta">' +
                '<span class="tour-card__badge">' + (index + 1) + '</span>' +
                '<span class="tour-card__title">' + escapeHtml(step.title) + '</span>' +
              '</div>' +
              '<p class="tour-card__text">' + escapeHtml(step.body) + '</p>' +
              '<div class="tour-card__actions">' +
                '<button type="button" class="btn btn--primary" data-tour="primary">' + escapeHtml(index === TOUR.length - 1 ? 'Finish' : 'Next') + '</button>' +
                '<button type="button" class="btn btn--ghost" data-tour="secondary">Skip</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    function next() {
      if (index < TOUR.length - 1) {
        index++;
        render();
      } else {
        close();
      }
    }

    function close() {
      clearHighlight();
      showHeroBox();
      if (root) {
        root.innerHTML = '';
        if (root.parentNode) root.parentNode.removeChild(root);
      }
      root = null;
    }

    function onClick(e) {
      var btn = e.target.closest('[data-tour]');
      if (!btn) return;
      if (btn.getAttribute('data-tour') === 'secondary') close();
      else next();
    }

    root = document.createElement('div');
    root.id = 'tour-root';
    document.body.appendChild(root);
    root.addEventListener('click', onClick);
    hideHeroBox();
    render();
  }

  /* ===================================================================
     Boot
     =================================================================== */

  function boot() {
    renderHeader();
    renderFooter();

    var routes = {
      '#/overview': renderOverview,
      '#/capabilities': renderCapabilities,
      '#/read': renderRead,
      '#/cases': renderCases,
      '#/your-image': renderYourImage,
      '#/about': renderAbout
    };

    var router = new Router(routes, $('#site-main'), updateActiveNav);
    router.start();

    startTour();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
