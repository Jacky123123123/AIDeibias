/**
 * AI Design Explorer — Complete Bundle
 * No ES modules required. Open index.html directly in browser.
 */
(function () {
  'use strict';

  /* ===================================================================
     Splash Screen
     =================================================================== */
  (function initSplash() {
    var splash = document.getElementById('splash');
    var btn = document.getElementById('splash-confirm');
    if (!splash || !btn) return;

    // Check if already dismissed this session
    if (sessionStorage.getItem('ae:splash-dismissed')) {
      splash.remove();
      return;
    }

    btn.addEventListener('click', function () {
      splash.classList.add('is-dismissed');
      sessionStorage.setItem('ae:splash-dismissed', '1');
      setTimeout(function () { splash.remove(); }, 400); // match CSS animation duration
    });
  })();

  /* ===================================================================
     utils.js
     =================================================================== */

  function generateId(prefix = 'ae') {
    const id = crypto.randomUUID().slice(0, 8);
    return `${prefix}_${id}`;
  }

  function debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function escapeHtml(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(str).replace(/[&<>"']/g, c => map[c]);
  }

  function $(selector, parent = document) {
    return parent.querySelector(selector);
  }

  function $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  }

  /* ===================================================================
     data/constraints.js
     =================================================================== */

  const DEFAULT_CONSTRAINTS = [
    // Structure
    { id: 'const_s001', category: 'structure', subcategory: 'Dimensions & Form', label: 'Maximum overall dimensions', description: 'Max length, width, height (mm), constrained by usage scenario or storage space', inputType: 'text', options: null, defaultValue: '' },
    { id: 'const_s002', category: 'structure', subcategory: 'Dimensions & Form', label: 'Wall thickness range', description: 'Recommended shell wall thickness (mm). Too thin compromises strength; too thick causes sink marks', inputType: 'text', options: null, defaultValue: '' },
    { id: 'const_s003', category: 'structure', subcategory: 'Mold Structure', label: 'Parting line position', description: 'Location of top/bottom shell split, affects surface integrity and mold cost', inputType: 'text', options: null, defaultValue: '' },
    { id: 'const_s004', category: 'structure', subcategory: 'Mold Structure', label: 'Snap-fits / screw bosses', description: 'Requires snap-fit or screw boss features for shell assembly', inputType: 'checkbox', options: null, defaultValue: false },
    { id: 'const_s005', category: 'structure', subcategory: 'Internal Structure', label: 'Internal cavity reserved', description: 'Space must be reserved for battery, PCB, motor, and other internal components', inputType: 'checkbox', options: null, defaultValue: false },
    { id: 'const_s006', category: 'structure', subcategory: 'Water & Dust Protection', label: 'IP rating', description: 'Ingress protection level (e.g., IPX4 splash-proof, IP67 waterproof), affects sealing design', inputType: 'select', options: ['None', 'IPX4 (Splash)', 'IPX5 (Jet)', 'IPX7 (Immersion)', 'IP54 (Dust+Splash)', 'IP67 (Dust+Immersion)'], defaultValue: 'None' },
    // Process
    { id: 'const_p001', category: 'process', subcategory: 'Molding', label: 'Injection molding', description: 'Uses injection molding process — must consider draft, runner, and gate design', inputType: 'checkbox', options: null, defaultValue: false },
    { id: 'const_p002', category: 'process', subcategory: 'Molding', label: 'Draft angle', description: 'Minimum draft angle required for mold release', inputType: 'select', options: ['0.5°', '1°', '1.5°', '2°', '3°'], defaultValue: '1°' },
    { id: 'const_p003', category: 'process', subcategory: 'Surface Finish', label: 'Surface finish', description: 'Product exterior surface treatment selection', inputType: 'select', options: ['Matte', 'High Gloss', 'Rubberized', 'IMD (In-Mold Decoration)', 'Spray Paint', 'Texture/Etching'], defaultValue: 'Matte' },
    { id: 'const_p004', category: 'process', subcategory: 'Material', label: 'Primary material', description: 'Main body material — affects strength, feel, and cost', inputType: 'select', options: ['ABS', 'PC', 'PP', 'PA (Nylon)', 'PC+ABS', 'PMMA (Acrylic)', 'Silicone'], defaultValue: 'ABS' },
    { id: 'const_p005', category: 'process', subcategory: 'Secondary Operations', label: 'Secondary processing', description: 'Requires silk-screening, laser engraving, electroplating, or other post-processing', inputType: 'checkbox', options: null, defaultValue: false },
    // Ergonomics
    { id: 'const_e001', category: 'ergonomics', subcategory: 'Grip & Handling', label: 'Grip comfort', description: 'Handheld grip requirements — palm contour fit and long-duration comfort', inputType: 'checkbox', options: null, defaultValue: false },
    { id: 'const_e002', category: 'ergonomics', subcategory: 'Grip & Handling', label: 'One-hand operation', description: 'Product must be operable with one hand for primary actions', inputType: 'checkbox', options: null, defaultValue: false },
    { id: 'const_e003', category: 'ergonomics', subcategory: 'Grip & Handling', label: 'Button tactile feedback', description: 'Buttons must provide clear tactile confirmation (detent / click feel)', inputType: 'checkbox', options: null, defaultValue: false },
    { id: 'const_e004', category: 'ergonomics', subcategory: 'Safety & Comfort', label: 'Anti-slip design', description: 'Contact surfaces require anti-slip texture or material to reduce drop risk', inputType: 'checkbox', options: null, defaultValue: false },
    { id: 'const_e005', category: 'ergonomics', subcategory: 'Safety & Comfort', label: 'Rounded edges', description: 'All exposed edges must be filleted, R ≥ 0.5mm, to prevent sharp-edge injury', inputType: 'checkbox', options: null, defaultValue: false },
    { id: 'const_e006', category: 'ergonomics', subcategory: 'Safety & Comfort', label: 'Weight limit', description: 'Maximum total product weight (g). Handheld devices typically recommended < 500g', inputType: 'text', options: null, defaultValue: '' }
  ];

  function getFullConstraintLibrary(customConstraints = []) {
    const builtIn = DEFAULT_CONSTRAINTS.map(c => ({ ...c, isCustom: false, source: 'library' }));
    const custom = customConstraints.map(c => ({ ...c, category: 'custom', isCustom: true, source: 'custom' }));
    return [...builtIn, ...custom];
  }

  function groupConstraints(constraints) {
    const groups = {};
    for (const c of constraints) {
      if (!groups[c.category]) {
        const labels = { structure: { label: 'Structure', icon: '🏗️' }, process: { label: 'Process', icon: '⚙️' }, ergonomics: { label: 'Ergonomics', icon: '✋' }, custom: { label: 'Custom', icon: '📝' }, ai_recommended: { label: 'AI Recommended', icon: '🤖' } };
        groups[c.category] = { label: labels[c.category]?.label || c.category, icon: labels[c.category]?.icon || '', items: [] };
      }
      groups[c.category].items.push(c);
    }
    return groups;
  }

  /* ===================================================================
     store.js
     =================================================================== */

  const PREFIX = 'ae:';
  const KEYS = { settings: 'ae:settings', projects: 'ae:projects' };
  function anchorKey(projectId) { return `ae:project:${projectId}:anchor`; }

  class Store {
    constructor() { this._listeners = {}; }

    _get(key) {
      try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }
      catch { return null; }
    }
    _set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); }
      catch (e) { console.error('localStorage write failed:', e); this._emit('storage:error', { key, error: e }); }
    }
    _remove(key) { localStorage.removeItem(key); }

    on(event, callback) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(callback);
    }
    off(event, callback) {
      if (!this._listeners[event]) return;
      this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
    }
    _emit(event, data) {
      if (!this._listeners[event]) return;
      this._listeners[event].forEach(cb => { try { cb(data); } catch (e) { console.error(e); } });
    }

    getSettings() {
      let s = this._get(KEYS.settings);
      if (!s) { s = { activeProjectId: null, lastVisitedRoute: '#/anchor', version: 1, apiKey: '' }; this._set(KEYS.settings, s); }
      return s;
    }
    saveSettings(partial) {
      const s = { ...this.getSettings(), ...partial };
      this._set(KEYS.settings, s);
      this._emit('settings:updated', s);
    }

    getApiToken() { return this.getSettings().apiKey || ''; }
    setApiToken(token) { this.saveSettings({ apiKey: token }); }

    getProjects() { return this._get(KEYS.projects) || []; }

    getActiveProject() {
      let projects = this.getProjects();
      let settings = this.getSettings();
      if (settings.activeProjectId) {
        const found = projects.find(p => p.id === settings.activeProjectId);
        if (found) return found;
      }
      if (projects.length === 0) {
        const project = { id: generateId('proj'), name: 'Default Project', status: 'anchoring', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        projects = [project];
        this._set(KEYS.projects, projects);
        this.saveSettings({ activeProjectId: project.id });
        return project;
      }
      this.saveSettings({ activeProjectId: projects[0].id });
      return projects[0];
    }

    saveProject(project) {
      const projects = this.getProjects();
      const idx = projects.findIndex(p => p.id === project.id);
      const now = new Date().toISOString();
      const updated = { ...project, updatedAt: now };
      if (idx >= 0) { projects[idx] = updated; }
      else { updated.createdAt = now; projects.push(updated); }
      this._set(KEYS.projects, projects);
      this._emit('projects:updated', projects);
      return updated;
    }

    createProject(name) {
      const project = {
        id: generateId('proj'),
        name: name || 'Untitled Project',
        status: 'anchoring',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const projects = this.getProjects();
      projects.push(project);
      this._set(KEYS.projects, projects);
      this.saveSettings({ activeProjectId: project.id });
      this._emit('projects:updated', projects);
      this._emit('project:switched', project);
      return project;
    }

    deleteProject(projectId) {
      let projects = this.getProjects();
      if (projects.length <= 1) return false;
      const deleted = projects.find(p => p.id === projectId);
      projects = projects.filter(p => p.id !== projectId);
      this._set(KEYS.projects, projects);
      this._remove(anchorKey(projectId));
      const settings = this.getSettings();
      if (settings.activeProjectId === projectId) {
        this.saveSettings({ activeProjectId: projects[0].id });
        this._emit('project:switched', projects[0]);
      }
      this._emit('projects:updated', projects);
      return true;
    }

    setActiveProject(projectId) {
      const projects = this.getProjects();
      const project = projects.find(p => p.id === projectId);
      if (!project) return false;
      this.saveSettings({ activeProjectId: projectId });
      this._emit('project:switched', project);
      return true;
    }

    getAnchorCard(projectId) {
      const key = anchorKey(projectId);
      const card = this._get(key);
      if (!card) {
        return { projectId, styleKeywords: [], designIntent: '', referenceImages: [], constraints: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      }
      return card;
    }

    saveAnchorCard(projectId, partial) {
      const key = anchorKey(projectId);
      const existing = this.getAnchorCard(projectId);
      const merged = { ...existing, ...partial, projectId, updatedAt: new Date().toISOString() };
      this._set(key, merged);
      this._emit('anchor:updated', merged);
      return merged;
    }

    getCustomConstraints() { return this._get('ae:custom_constraints') || []; }
    addCustomConstraint(constraint) {
      const list = this.getCustomConstraints();
      list.push(constraint);
      this._set('ae:custom_constraints', list);
      this._emit('custom_constraints:updated', list);
      return list;
    }
  }

  const store = new Store();

  /* ===================================================================
     ai-service.js — DeepSeek API Integration
     =================================================================== */

  const AI_SYSTEM_PROMPT = `You are an industrial design engineering consultant specializing in manufacturing constraints for consumer products.

Given a product description, material preference, and design intent, recommend specific, actionable design constraints covering structure, process, and ergonomics.

Return ONLY a valid JSON array — no markdown, no extra text. Each item must have:
{
  "category": "structure" | "process" | "ergonomics",
  "label": "Short constraint name",
  "description": "One sentence explaining why this matters",
  "inputType": "checkbox" | "text" | "select",
  "value": default value (boolean for checkbox, string for text/select),
  "options": ["option1", "option2"] (only for select type, omit for others)
}

Guidelines:
- Recommend 6-10 constraints total across all categories
- Be specific with measurements (e.g., "0.5-1mm" not "appropriate thickness")
- For checkbox constraints, value should be true or false
- For text constraints, value should be the recommended string
- Match constraint type to the product category and material`;

  function buildAIPrompt(context) {
    return `Product: ${context.productType || '(not specified)'}
Material preference: ${context.material || '(not specified)'}
Design intent: ${context.designIntent || '(not specified)'}
Style keywords: ${context.styleKeywords?.join(', ') || '(none)'}
---
Recommend manufacturing and design constraints for this product. Return JSON array only.`;
  }

  async function callDeepSeek(context) {
    const settings = store.getSettings();
    if (!settings.apiKey) {
      throw new Error('NO_API_KEY');
    }

    const userPrompt = buildAIPrompt(context);

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: AI_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      if (response.status === 401) throw new Error('INVALID_API_KEY');
      throw new Error(`API error (${response.status}): ${errBody.slice(0, 200)}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    return parseAIResponse(content);
  }

  function parseAIResponse(content) {
    // Strip markdown code fences if present
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```\s*$/, '');
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      // Try to extract JSON array from mixed text
      const match = jsonStr.match(/\[[\s\S]*\]/);
      if (match) {
        try { parsed = JSON.parse(match[0]); } catch { /* fall through */ }
      }
      if (!parsed) throw new Error('Could not parse AI response as JSON');
    }

    if (!Array.isArray(parsed)) {
      throw new Error('AI response is not an array');
    }

    // Normalize and validate each constraint
    return parsed.map((item, i) => ({
      id: generateId('ai'),
      category: ['structure', 'process', 'ergonomics'].includes(item.category) ? item.category : 'structure',
      subcategory: 'AI Recommended',
      label: String(item.label || 'Unnamed constraint').slice(0, 80),
      description: String(item.description || '').slice(0, 200),
      inputType: ['checkbox', 'text', 'select'].includes(item.inputType) ? item.inputType : 'checkbox',
      value: item.value !== undefined ? item.value : (item.inputType === 'checkbox' ? true : ''),
      options: Array.isArray(item.options) ? item.options.map(String) : null,
      source: 'ai',
      isCustom: false,
      sortOrder: i
    }));
  }

  /* ===================================================================
     components/modal.js
     =================================================================== */

  let currentModal = null;

  function openModal(options = {}) {
    if (currentModal) closeModal();
    const root = $('#modal-root');
    if (!root) return null;

    const { title, content, width, onClose } = options;
    const maxWidth = width || '680px';

    const wrapper = document.createElement('div');
    wrapper.className = 'modal';
    wrapper.innerHTML =
      `<div class="modal__backdrop"></div>
       <div class="modal__container" style="max-width:${maxWidth}" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
         <div class="modal__header">
           <h2 class="modal__title">${escapeHtml(title)}</h2>
           <button class="modal__close" aria-label="Close">&times;</button>
         </div>
         <div class="modal__body"></div>
       </div>`;

    const bodyEl = wrapper.querySelector('.modal__body');
    if (typeof content === 'string') { bodyEl.innerHTML = content; }
    else if (content instanceof HTMLElement) { bodyEl.appendChild(content); }

    root.appendChild(wrapper);
    document.body.classList.add('body--modal-open');

    const backdrop = wrapper.querySelector('.modal__backdrop');
    const closeBtn = wrapper.querySelector('.modal__close');

    const handleClose = () => { if (onClose) onClose(); closeModal(); };

    backdrop.addEventListener('click', handleClose);
    closeBtn.addEventListener('click', handleClose);

    const handleKey = (e) => {
      if (e.key === 'Escape') { handleClose(); }
      if (e.key === 'Tab') {
        const container = wrapper.querySelector('.modal__container');
        const focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener('keydown', handleKey);

    requestAnimationFrame(() => {
      const firstFocus = wrapper.querySelector('button, input, select, textarea');
      if (firstFocus) firstFocus.focus();
    });

    currentModal = {
      wrapper, bodyEl, handleClose, handleKey,
      setContent(newContent) {
        bodyEl.innerHTML = '';
        if (typeof newContent === 'string') bodyEl.innerHTML = newContent;
        else if (newContent instanceof HTMLElement) bodyEl.appendChild(newContent);
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

  function closeModal() {
    if (!currentModal) return;
    const { wrapper, handleKey } = currentModal;
    document.removeEventListener('keydown', handleKey);
    if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
    document.body.classList.remove('body--modal-open');
    currentModal = null;
  }

  /* ===================================================================
     components/settings.js
     =================================================================== */

  const MATERIALS = [
    { id: 'matte-plastic', name: 'Matte Plastic', cssClass: 'swatch--matte-plastic' },
    { id: 'glossy-plastic', name: 'Glossy Plastic', cssClass: 'swatch--glossy-plastic' },
    { id: 'rubberized', name: 'Rubberized', cssClass: 'swatch--rubberized' },
    { id: 'brushed-metal', name: 'Brushed Metal', cssClass: 'swatch--brushed-metal' },
    { id: 'silicone', name: 'Silicone', cssClass: 'swatch--silicone' },
    { id: 'wood-texture', name: 'Wood Texture', cssClass: 'swatch--wood-texture' }
  ];

  function openSettingsModal() {
    const settings = store.getSettings();
    const wrapper = document.createElement('div');
    wrapper.className = 'settings-panel';
    wrapper.innerHTML =
      `<div class="settings-panel__group">
         <label class="settings-panel__label" for="settings-apikey">DeepSeek API Key</label>
         <p class="settings-panel__hint">Your key is stored locally and never sent anywhere except to DeepSeek.</p>
         <div class="settings-panel__input-row">
           <input id="settings-apikey" class="form-input" type="password" value="${escapeHtml(settings.apiKey || '')}" placeholder="sk-..." autocomplete="off">
           <button class="settings-panel__toggle-vis" type="button" aria-label="Toggle visibility" title="Show/hide">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
           </button>
         </div>
         <p class="settings-panel__hint">
           <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener">Get a key from DeepSeek →</a>
         </p>
         <div class="settings-panel__status" style="display:none"></div>
       </div>
       <div class="settings-panel__actions">
         <button class="btn btn--ghost settings-panel__cancel" type="button">Cancel</button>
         <button class="btn btn--primary settings-panel__save" type="button">Save</button>
       </div>`;

    const apiKeyInput = wrapper.querySelector('#settings-apikey');
    const toggleBtn = wrapper.querySelector('.settings-panel__toggle-vis');
    const statusEl = wrapper.querySelector('.settings-panel__status');
    const saveBtn = wrapper.querySelector('.settings-panel__save');
    const cancelBtn = wrapper.querySelector('.settings-panel__cancel');

    toggleBtn.addEventListener('click', () => {
      const isPass = apiKeyInput.type === 'password';
      apiKeyInput.type = isPass ? 'text' : 'password';
      toggleBtn.innerHTML = isPass
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    });

    function showStatus(msg, isError) {
      statusEl.textContent = msg;
      statusEl.className = 'settings-panel__status settings-panel__status--' + (isError ? 'error' : 'success');
      statusEl.style.display = 'block';
      setTimeout(() => { statusEl.style.display = 'none'; }, 3000);
    }

    function handleSave() {
      store.saveSettings({ apiKey: apiKeyInput.value.trim() });
      showStatus('API key saved.', false);
    }

    saveBtn.addEventListener('click', handleSave);
    cancelBtn.addEventListener('click', closeModal);

    openModal({
      title: 'Settings',
      content: wrapper,
      width: '480px',
      onClose: () => {}
    });
  }

  /* ---- Project Manager Modal ---- */

  function openProjectManagerModal() {
    const activeProject = store.getActiveProject();
    const projects = store.getProjects();

    function buildContent() {
      const currentActive = store.getActiveProject();
      const allProjects = store.getProjects();
      const wrapper = document.createElement('div');

      wrapper.innerHTML = `
        <div class="pm-header">
          <button class="btn btn--outline pm-new-btn" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Project
          </button>
        </div>
        <div class="pm-new-form is-hidden">
          <input class="form-input pm-new-form__input" type="text" placeholder="Project name..." maxlength="60">
          <button class="btn btn--primary btn--sm pm-create-btn" type="button">Create</button>
          <button class="btn btn--ghost btn--sm pm-cancel-btn" type="button">Cancel</button>
        </div>
        <div class="pm-project-list">
          ${allProjects.length <= 1 ? '' : allProjects.filter(p => p.id !== currentActive.id).map(p => `
            <div class="pm-project-item">
              <div class="pm-project-item__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div class="pm-project-item__info">
                <span class="pm-project-item__name">${escapeHtml(p.name)}</span>
                <span class="pm-project-item__meta">Created ${formatDate(p.createdAt)}</span>
              </div>
              <div class="pm-project-item__actions">
                <button class="btn btn--primary btn--sm pm-switch-btn" data-id="${p.id}" type="button">Switch</button>
                <button class="btn btn--ghost btn--sm pm-delete-btn" data-id="${p.id}" type="button">Delete</button>
              </div>
            </div>
          `).join('')}
        </div>
        ${allProjects.length <= 1 ? '<div class="pm-empty">No other projects yet. Create a new one to get started.</div>' : ''}
        <div class="pm-footer">
          <button class="pm-footer__clear" type="button">Start fresh (delete all projects)</button>
        </div>
      `;

      // Active project row
      const list = wrapper.querySelector('.pm-project-list');
      const activeRow = document.createElement('div');
      activeRow.className = 'pm-project-item pm-project-item--active';
      activeRow.innerHTML = `
        <div class="pm-project-item__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div class="pm-project-item__info">
          <span class="pm-project-item__name">${escapeHtml(currentActive.name)}<span class="pm-project-item__badge">Active</span></span>
          <span class="pm-project-item__meta">Created ${formatDate(currentActive.createdAt)}</span>
        </div>
        <div class="pm-project-item__actions">
          ${allProjects.length > 1 ? `<button class="btn btn--ghost btn--sm pm-delete-btn" data-id="${currentActive.id}" type="button" disabled title="Cannot delete the active project. Switch first.">Delete</button>` : `<button class="btn btn--ghost btn--sm" type="button" disabled title="Cannot delete the only project">Delete</button>`}
        </div>
      `;
      list.insertBefore(activeRow, list.firstChild);

      return wrapper;
    }

    let wrapper = buildContent();
    let deleteTimer = null;

    const modal = openModal({
      title: 'Projects',
      content: wrapper,
      width: '520px',
      onClose: () => { if (deleteTimer) clearTimeout(deleteTimer); }
    });

    function refresh() {
      const newWrapper = buildContent();
      wrapper.replaceWith(newWrapper);
      wrapper = newWrapper;
      bindEvents();
    }

    function bindEvents() {
      // New project button
      const newBtn = wrapper.querySelector('.pm-new-btn');
      const newForm = wrapper.querySelector('.pm-new-form');
      const nameInput = wrapper.querySelector('.pm-new-form__input');
      const createBtn = wrapper.querySelector('.pm-create-btn');
      const cancelBtn = wrapper.querySelector('.pm-cancel-btn');

      newBtn.addEventListener('click', () => {
        newBtn.classList.add('is-hidden');
        newForm.classList.remove('is-hidden');
        nameInput.focus();
      });

      cancelBtn.addEventListener('click', () => {
        newBtn.classList.remove('is-hidden');
        newForm.classList.add('is-hidden');
        nameInput.value = '';
      });

      function doCreate() {
        const name = nameInput.value.trim();
        if (!name) return;
        store.createProject(name);
        if (modal && modal.close) modal.close();
        window.location.reload();
      }
      createBtn.addEventListener('click', doCreate);
      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doCreate();
        if (e.key === 'Escape') { cancelBtn.click(); }
      });

      // Switch buttons
      wrapper.querySelectorAll('.pm-switch-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const projectId = btn.dataset.id;
          store.setActiveProject(projectId);
          if (modal && modal.close) modal.close();
          window.location.reload();
        });
      });

      // Delete buttons (two-click confirm)
      wrapper.querySelectorAll('.pm-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.disabled) return;
          if (btn.textContent === 'Delete') {
            if (deleteTimer) clearTimeout(deleteTimer);
            btn.textContent = 'Confirm?';
            btn.style.color = 'var(--color-error)';
            btn.style.borderColor = 'var(--color-error)';
            deleteTimer = setTimeout(() => {
              btn.textContent = 'Delete';
              btn.style.color = '';
              btn.style.borderColor = '';
              deleteTimer = null;
            }, 2500);
          } else {
            if (deleteTimer) clearTimeout(deleteTimer);
            deleteTimer = null;
            const projectId = btn.dataset.id;
            store.deleteProject(projectId);
            refresh();
          }
        });
      });

      // Start fresh
      const clearBtn = wrapper.querySelector('.pm-footer__clear');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (clearBtn.textContent.includes('Confirm')) {
            const projects = store.getProjects();
            projects.forEach(p => {
              const key = `ae:project:${p.id}:anchor`;
              try { localStorage.removeItem(key); } catch(e) {}
            });
            localStorage.removeItem('ae:projects');
            localStorage.removeItem('ae:settings');
            store.getActiveProject(); // auto-creates new default
            if (modal && modal.close) modal.close();
            window.location.reload();
          } else {
            clearBtn.textContent = 'Confirm: delete ALL projects?';
            clearBtn.style.color = 'var(--color-error)';
            setTimeout(() => {
              if (clearBtn) {
                clearBtn.textContent = 'Start fresh (delete all projects)';
                clearBtn.style.color = '';
              }
            }, 3000);
          }
        });
      }
    }

    bindEvents();
  }

  function formatDate(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  function renderMaterialSwatches(selectedId, onChange) {
    const container = document.createElement('div');
    container.className = 'cl-ai__materials';

    MATERIALS.forEach(m => {
      const swatch = document.createElement('button');
      swatch.type = 'button';
      swatch.className = `material-swatch ${m.cssClass} ${selectedId === m.id ? 'material-swatch--selected' : ''}`;
      swatch.title = m.name;
      swatch.dataset.materialId = m.id;
      swatch.innerHTML = `<span class="material-swatch__name">${escapeHtml(m.name)}</span>`;
      swatch.addEventListener('click', () => {
        container.querySelectorAll('.material-swatch').forEach(s => s.classList.remove('material-swatch--selected'));
        swatch.classList.add('material-swatch--selected');
        if (onChange) onChange(m.id, m.name);
      });
      container.appendChild(swatch);
    });

    return container;
  }

  /* ===================================================================
     components/keyword-input.js
     =================================================================== */

  function createKeywordInput(options = {}) {
    const { container, keywords = [], placeholder = 'Type a keyword and press Enter or comma', maxItems = 20, onChange = null } = options;
    if (!container) throw new Error('keyword-input: container is required');

    let _keywords = [...keywords];
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

    function renderTags() {
      tagsArea.innerHTML = '';
      _keywords.forEach((kw, idx) => {
        const tag = document.createElement('span');
        tag.className = 'keyword-input__tag';
        tag.innerHTML = `<span class="keyword-input__tag-text">${escapeHtml(kw)}</span><button class="keyword-input__tag-remove" data-index="${idx}" type="button" aria-label="Remove ${escapeHtml(kw)}">&times;</button>`;
        tagsArea.appendChild(tag);
      });
    }

    function addKeyword(raw) {
      const trimmed = raw.trim().replace(/[，,]+$/, '').trim();
      if (!trimmed || _keywords.length >= maxItems || _keywords.includes(trimmed)) return;
      _keywords.push(trimmed);
      renderTags();
      if (onChange) onChange([..._keywords]);
    }

    function removeKeyword(index) {
      if (index < 0 || index >= _keywords.length) return;
      _keywords.splice(index, 1);
      renderTags();
      if (onChange) onChange([..._keywords]);
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addKeyword(input.value);
        input.value = '';
      } else if (e.key === 'Backspace' && input.value === '' && _keywords.length > 0) {
        removeKeyword(_keywords.length - 1);
      }
    });

    input.addEventListener('blur', () => {
      if (input.value.trim()) { addKeyword(input.value); input.value = ''; }
    });

    tagsArea.addEventListener('click', (e) => {
      const btn = e.target.closest('.keyword-input__tag-remove');
      if (btn) { removeKeyword(parseInt(btn.dataset.index, 10)); }
    });

    wrapper.addEventListener('click', (e) => {
      if (e.target === wrapper || e.target === tagsArea) input.focus();
    });

    renderTags();

    return {
      getKeywords() { return [..._keywords]; },
      setKeywords(newKeywords) { _keywords = [...newKeywords]; renderTags(); if (onChange) onChange([..._keywords]); },
      addKeyword, removeKeyword,
      destroy() { wrapper.remove(); }
    };
  }

  /* ===================================================================
     components/constraint-library.js (with AI section)
     =================================================================== */

  function createConstraintLibrary(options = {}) {
    const {
      selectedIds = new Set(),
      constraintValues = {},
      anchorContext = null,
      onToggle = null,
      onCustomAdd = null,
      onConfirm = null
    } = options;

    const wrapper = document.createElement('div');
    wrapper.className = 'constraint-library';

    let _selected = new Set(selectedIds);
    let _customConstraints = store.getCustomConstraints();
    let _aiConstraints = [];
    let _aiLoading = false;
    let _aiError = null;

    // Track values during session
    const _values = { ...constraintValues };

    // Build shell
    wrapper.innerHTML =
      `<div class="cl-search">
         <svg class="cl-search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
         <input class="cl-search__input" type="text" placeholder="Search constraints..." autocomplete="off">
       </div>
       <div class="cl-ai">
         <button class="cl-ai__header" type="button">
           <span class="cl-ai__header-icon">🤖</span>
           <span class="cl-ai__header-label">AI Recommendations</span>
           <svg class="cl-ai__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
         </button>
         <div class="cl-ai__body is-collapsed">
           <div class="cl-ai__fields">
             <div>
               <label class="cl-ai__field-label">Product type</label>
               <input class="cl-ai__field-input" type="text" placeholder="e.g., smart water bottle, wearable..." maxlength="60">
             </div>
             <div>
               <label class="cl-ai__field-label">Material preference</label>
               <select class="cl-ai__field-select">
                 <option value="">— Select —</option>
                 <option value="ABS Plastic">ABS Plastic</option>
                 <option value="PC Plastic">PC Plastic</option>
                 <option value="PC+ABS">PC+ABS</option>
                 <option value="PP Plastic">PP Plastic</option>
                 <option value="PA Nylon">PA Nylon</option>
                 <option value="PMMA Acrylic">PMMA Acrylic</option>
                 <option value="Silicone">Silicone</option>
                 <option value="Aluminum">Aluminum</option>
                 <option value="Stainless Steel">Stainless Steel</option>
                 <option value="Wood">Wood</option>
               </select>
             </div>
           </div>
           <div>
             <p class="cl-ai__materials-label">Quick material reference</p>
             <div class="cl-ai__materials-container"></div>
           </div>
           <div class="cl-ai__generate">
             <button class="btn btn--primary cl-ai__gen-btn" type="button">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
               Generate Recommendations
             </button>
           </div>
           <div class="cl-ai__results-area"></div>
         </div>
       </div>
       <div class="cl-categories"></div>
       <div class="cl-custom">
         <h3 class="cl-custom__title">Add Custom Constraint</h3>
         <div class="cl-custom__form">
           <input class="cl-custom__input" type="text" placeholder="Enter custom constraint name..." maxlength="40">
           <button class="btn btn--primary btn--sm cl-custom__btn" type="button">Add</button>
         </div>
       </div>
       <div class="cl-footer">
         <span class="cl-footer__count">Selected: <strong>${_selected.size}</strong></span>
         <button class="btn btn--primary cl-footer__confirm" type="button">Confirm Selection</button>
       </div>`;

    // DOM refs
    const searchInput = wrapper.querySelector('.cl-search__input');
    const categoriesEl = wrapper.querySelector('.cl-categories');
    const aiHeader = wrapper.querySelector('.cl-ai__header');
    const aiBody = wrapper.querySelector('.cl-ai__body');
    const productTypeInput = wrapper.querySelector('.cl-ai__field-input');
    const materialSelect = wrapper.querySelector('.cl-ai__field-select');
    const materialsContainer = wrapper.querySelector('.cl-ai__materials-container');
    const genBtn = wrapper.querySelector('.cl-ai__gen-btn');
    const aiResultsArea = wrapper.querySelector('.cl-ai__results-area');
    const customInput = wrapper.querySelector('.cl-custom__input');
    const customBtn = wrapper.querySelector('.cl-custom__btn');
    const countEl = wrapper.querySelector('.cl-footer__count strong');
    const confirmBtn = wrapper.querySelector('.cl-footer__confirm');

    let _selectedMaterialId = null;

    // Material swatches
    const swatchesEl = renderMaterialSwatches(null, (id, name) => {
      _selectedMaterialId = id;
      // Auto-select matching material in dropdown
      const match = [...materialSelect.options].find(o => o.value.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(o.value.toLowerCase()));
      if (match) materialSelect.value = match.value;
    });
    materialsContainer.appendChild(swatchesEl);

    // AI accordion toggle
    aiHeader.addEventListener('click', () => {
      const isExpanded = aiHeader.classList.toggle('is-expanded');
      aiBody.classList.toggle('is-collapsed', !isExpanded);
    });

    // ---- Render library categories ----
    function render(query = '') {
      const fullLibrary = getFullConstraintLibrary(_customConstraints);
      // Merge AI constraints into the library
      const allConstraints = [...fullLibrary, ..._aiConstraints];
      const q = query.toLowerCase().trim();
      const filtered = q
        ? allConstraints.filter(c => c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.subcategory.toLowerCase().includes(q))
        : allConstraints;
      const grouped = groupConstraints(filtered);
      categoriesEl.innerHTML = '';

      for (const [key, group] of Object.entries(grouped)) {
        if (group.items.length === 0) continue;
        const section = document.createElement('div');
        section.className = 'cl-category';
        const isExpanded = q ? true : (key === 'ai_recommended' || key === 'structure');
        section.innerHTML =
          `<button class="cl-category__header ${isExpanded ? 'is-expanded' : ''}" type="button" data-category="${key}">
             <span class="cl-category__icon">${group.icon}</span>
             <span class="cl-category__label">${group.label}</span>
             <span class="cl-category__count">${group.items.length} items</span>
             <svg class="cl-category__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
           </button>
           <div class="cl-category__body ${isExpanded ? '' : 'is-collapsed'}">
             <div class="cl-items"></div>
           </div>`;

        const bodyEl = section.querySelector('.cl-category__body');
        const itemsEl = section.querySelector('.cl-items');

        group.items.forEach(c => {
          const isChecked = _selected.has(c.id);
          const isAI = c.source === 'ai';
          const item = document.createElement('div');
          item.className = `cl-item ${isChecked ? 'cl-item--checked' : ''} ${isAI ? 'cl-item--ai' : ''}`;

          if (c.inputType === 'checkbox') {
            item.innerHTML =
              `<label class="cl-item__row">
                 <input class="cl-item__checkbox" type="checkbox" ${isChecked ? 'checked' : ''} data-id="${c.id}">
                 <span class="cl-item__label">${escapeHtml(c.label)}</span>
                 ${isAI ? '<span class="badge--ai">AI</span>' : ''}
                 <span class="cl-item__subcategory" style="${isAI ? 'display:none' : ''}">${escapeHtml(c.subcategory)}</span>
               </label>
               ${c.description ? `<p class="cl-item__desc">${escapeHtml(c.description)}</p>` : ''}`;
          } else if (c.inputType === 'text') {
            const val = _values[c.id] ?? (c.defaultValue || '');
            item.innerHTML =
              `<label class="cl-item__row">
                 <input class="cl-item__checkbox" type="checkbox" ${isChecked ? 'checked' : ''} data-id="${c.id}">
                 <span class="cl-item__label">${escapeHtml(c.label)}</span>
                 ${isAI ? '<span class="badge--ai">AI</span>' : ''}
                 <span class="cl-item__subcategory" style="${isAI ? 'display:none' : ''}">${escapeHtml(c.subcategory)}</span>
               </label>
               ${c.description ? `<p class="cl-item__desc">${escapeHtml(c.description)}</p>` : ''}
               <div class="cl-item__value ${isChecked ? '' : 'is-hidden'}">
                 <input class="cl-item__text-input" type="text" placeholder="Enter value..." value="${escapeHtml(val)}" data-id="${c.id}">
               </div>`;
          } else if (c.inputType === 'select') {
            const val = _values[c.id] ?? c.defaultValue ?? '';
            const optionsHtml = (c.options || []).map(o => `<option value="${escapeHtml(o)}" ${o === val ? 'selected' : ''}>${escapeHtml(o)}</option>`).join('');
            item.innerHTML =
              `<label class="cl-item__row">
                 <input class="cl-item__checkbox" type="checkbox" ${isChecked ? 'checked' : ''} data-id="${c.id}">
                 <span class="cl-item__label">${escapeHtml(c.label)}</span>
                 ${isAI ? '<span class="badge--ai">AI</span>' : ''}
                 <span class="cl-item__subcategory" style="${isAI ? 'display:none' : ''}">${escapeHtml(c.subcategory)}</span>
               </label>
               ${c.description ? `<p class="cl-item__desc">${escapeHtml(c.description)}</p>` : ''}
               <div class="cl-item__value ${isChecked ? '' : 'is-hidden'}">
                 <select class="cl-item__select" data-id="${c.id}">${optionsHtml}</select>
               </div>`;
          }
          itemsEl.appendChild(item);
        });

        const header = section.querySelector('.cl-category__header');
        header.addEventListener('click', () => {
          header.classList.toggle('is-expanded');
          bodyEl.classList.toggle('is-collapsed');
        });
        categoriesEl.appendChild(section);
      }
    }

    // ---- Checkbox change ----
    categoriesEl.addEventListener('change', (e) => {
      if (e.target.classList.contains('cl-item__checkbox')) {
        const id = e.target.dataset.id;
        const isChecked = e.target.checked;
        if (isChecked) _selected.add(id); else _selected.delete(id);
        const item = e.target.closest('.cl-item');
        if (item) { item.classList.toggle('cl-item--checked', isChecked); const vr = item.querySelector('.cl-item__value'); if (vr) vr.classList.toggle('is-hidden', !isChecked); }
        // Find constraint from either library or AI list
        const allLib = getFullConstraintLibrary(_customConstraints);
        const constraint = [...allLib, ..._aiConstraints].find(c => c.id === id);
        if (constraint) { constraint._value = _values[id] ?? constraint.defaultValue; }
        updateCount();
        if (onToggle && constraint) onToggle(constraint, isChecked);
      }
    });

    // ---- Value input ----
    categoriesEl.addEventListener('input', (e) => {
      if (e.target.classList.contains('cl-item__text-input') || e.target.classList.contains('cl-item__select')) {
        const id = e.target.dataset.id;
        _values[id] = e.target.value;
        const allLib = getFullConstraintLibrary(_customConstraints);
        const constraint = [...allLib, ..._aiConstraints].find(c => c.id === id);
        if (constraint) { constraint._value = _values[id]; }
        if (constraint && onToggle) onToggle(constraint, true);
      }
    });

    // ---- Search ----
    searchInput.addEventListener('input', (e) => render(e.target.value));

    // ---- AI Generate ----
    function renderAIResults() {
      aiResultsArea.innerHTML = '';

      if (_aiLoading) {
        aiResultsArea.innerHTML =
          `<div class="cl-ai__loading">
             <div class="cl-ai__spinner"></div>
             <span>Analyzing design requirements...</span>
           </div>`;
        return;
      }

      if (_aiError) {
        aiResultsArea.innerHTML =
          `<div class="cl-ai__no-key">
             <p>${escapeHtml(_aiError)}</p>
             ${_aiError.includes('API key') ? '<button class="btn btn--primary btn--sm cl-ai__open-settings" type="button">Open Settings</button>' : ''}
           </div>`;
        const settingsBtn = aiResultsArea.querySelector('.cl-ai__open-settings');
        if (settingsBtn) {
          settingsBtn.addEventListener('click', () => {
            closeModal();
            openSettingsModal();
          });
        }
        return;
      }

      if (_aiConstraints.length > 0) {
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'cl-ai__results';
        resultsDiv.innerHTML =
          `<div class="cl-ai__results-header">
             <span>AI Recommended Constraints (${_aiConstraints.length})</span>
             <div class="cl-ai__results-actions">
               <button class="btn btn--ghost btn--sm cl-ai__select-all" type="button">Select All</button>
               <button class="btn btn--ghost btn--sm cl-ai__deselect-all" type="button">Deselect All</button>
               <button class="btn btn--ghost btn--sm cl-ai__clear" type="button">Clear</button>
             </div>
           </div>
           <div class="cl-items"></div>`;

        const itemsContainer = resultsDiv.querySelector('.cl-items');

        _aiConstraints.forEach(c => {
          const isChecked = _selected.has(c.id);
          const item = document.createElement('div');
          item.className = `cl-item ${isChecked ? 'cl-item--checked' : ''} cl-item--ai`;

          if (c.inputType === 'checkbox') {
            item.innerHTML =
              `<label class="cl-item__row">
                 <input class="cl-item__checkbox" type="checkbox" ${isChecked ? 'checked' : ''} data-id="${c.id}">
                 <span class="cl-item__label">${escapeHtml(c.label)}</span>
                 <span class="badge--ai">AI</span>
               </label>
               ${c.description ? `<p class="cl-item__desc">${escapeHtml(c.description)}</p>` : ''}`;
          } else if (c.inputType === 'text') {
            const val = _values[c.id] ?? c.value ?? c.defaultValue ?? '';
            item.innerHTML =
              `<label class="cl-item__row">
                 <input class="cl-item__checkbox" type="checkbox" ${isChecked ? 'checked' : ''} data-id="${c.id}">
                 <span class="cl-item__label">${escapeHtml(c.label)}</span>
                 <span class="badge--ai">AI</span>
               </label>
               ${c.description ? `<p class="cl-item__desc">${escapeHtml(c.description)}</p>` : ''}
               <div class="cl-item__value ${isChecked ? '' : 'is-hidden'}">
                 <input class="cl-item__text-input" type="text" placeholder="Enter value..." value="${escapeHtml(val)}" data-id="${c.id}">
               </div>`;
          } else if (c.inputType === 'select') {
            const val = _values[c.id] ?? c.value ?? c.defaultValue ?? '';
            const optionsHtml = (c.options || []).map(o => `<option value="${escapeHtml(o)}" ${o === val ? 'selected' : ''}>${escapeHtml(o)}</option>`).join('');
            item.innerHTML =
              `<label class="cl-item__row">
                 <input class="cl-item__checkbox" type="checkbox" ${isChecked ? 'checked' : ''} data-id="${c.id}">
                 <span class="cl-item__label">${escapeHtml(c.label)}</span>
                 <span class="badge--ai">AI</span>
               </label>
               ${c.description ? `<p class="cl-item__desc">${escapeHtml(c.description)}</p>` : ''}
               <div class="cl-item__value ${isChecked ? '' : 'is-hidden'}">
                 <select class="cl-item__select" data-id="${c.id}">${optionsHtml}</select>
               </div>`;
          }
          itemsContainer.appendChild(item);
        });

        // Select All / Deselect All / Clear buttons
        resultsDiv.querySelector('.cl-ai__select-all').addEventListener('click', () => {
          _aiConstraints.forEach(c => { _selected.add(c.id); if (!_values[c.id]) _values[c.id] = c.value ?? c.defaultValue ?? true; });
          render(searchInput.value);
          renderAIResults();
          updateCount();
        });
        resultsDiv.querySelector('.cl-ai__deselect-all').addEventListener('click', () => {
          _aiConstraints.forEach(c => { _selected.delete(c.id); });
          render(searchInput.value);
          renderAIResults();
          updateCount();
        });
        resultsDiv.querySelector('.cl-ai__clear').addEventListener('click', () => {
          _aiConstraints.forEach(c => { _selected.delete(c.id); });
          _aiConstraints = [];
          _aiError = null;
          render(searchInput.value);
          renderAIResults();
          updateCount();
        });

        // Delegate events for checkboxes inside AI results
        itemsContainer.addEventListener('change', (e) => {
          if (e.target.classList.contains('cl-item__checkbox')) {
            const id = e.target.dataset.id;
            const isChecked = e.target.checked;
            if (isChecked) _selected.add(id); else _selected.delete(id);
            const item = e.target.closest('.cl-item');
            if (item) { item.classList.toggle('cl-item--checked', isChecked); const vr = item.querySelector('.cl-item__value'); if (vr) vr.classList.toggle('is-hidden', !isChecked); }
            const constraint = _aiConstraints.find(c => c.id === id) || getFullConstraintLibrary(_customConstraints).find(c => c.id === id);
            if (constraint) { constraint._value = _values[id] ?? constraint.defaultValue; }
            updateCount();
            if (onToggle && constraint) onToggle(constraint, isChecked);
            // Also update main categories view
            render(searchInput.value);
          }
        });

        itemsContainer.addEventListener('input', (e) => {
          if (e.target.classList.contains('cl-item__text-input') || e.target.classList.contains('cl-item__select')) {
            const id = e.target.dataset.id;
            _values[id] = e.target.value;
            const constraint = _aiConstraints.find(c => c.id === id);
            if (constraint) {
              constraint._value = _values[id];
              if (onToggle) onToggle(constraint, true);
            }
          }
        });

        aiResultsArea.appendChild(resultsDiv);

        // Auto-expand AI category and scroll to it
        if (!aiHeader.classList.contains('is-expanded')) {
          aiHeader.classList.add('is-expanded');
          aiBody.classList.remove('is-collapsed');
        }
      }
    }

    genBtn.addEventListener('click', async () => {
      const settings = store.getSettings();
      if (!settings.apiKey) {
        _aiError = 'No API key configured. Please add your DeepSeek API key in Settings.';
        _aiLoading = false;
        renderAIResults();
        return;
      }

      const productType = productTypeInput.value.trim();
      if (!productType) {
        _aiError = 'Please enter a product type first.';
        _aiLoading = false;
        renderAIResults();
        return;
      }

      const context = {
        productType,
        material: materialSelect.value,
        designIntent: anchorContext?.designIntent || '',
        styleKeywords: anchorContext?.styleKeywords || []
      };

      _aiLoading = true;
      _aiError = null;
      _aiConstraints = [];
      renderAIResults();
      genBtn.disabled = true;
      genBtn.textContent = 'Analyzing...';

      try {
        _aiConstraints = await callDeepSeek(context);
      } catch (err) {
        if (err.message === 'NO_API_KEY') {
          _aiError = 'No API key configured. Please add your DeepSeek API key in Settings.';
        } else if (err.message === 'INVALID_API_KEY') {
          _aiError = 'Invalid API key. Please check your key in Settings.';
        } else {
          _aiError = err.message || 'AI analysis failed. Please try again.';
        }
      } finally {
        _aiLoading = false;
        genBtn.disabled = false;
        genBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Generate Recommendations`;
        renderAIResults();
        render(searchInput.value);
      }
    });

    // ---- Custom constraint add ----
    function addCustom() {
      const label = customInput.value.trim();
      if (!label) return;
      const custom = { id: generateId('cstm'), category: 'custom', subcategory: 'Custom Constraint', label, description: '', inputType: 'checkbox', options: null, defaultValue: false, isCustom: true, source: 'custom' };
      _customConstraints = store.addCustomConstraint(custom);
      _selected.add(custom.id);
      customInput.value = '';
      render(searchInput.value);
      updateCount();
      if (onCustomAdd) onCustomAdd(custom);
    }

    customBtn.addEventListener('click', addCustom);
    customInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } });

    // ---- Confirm ----
    confirmBtn.addEventListener('click', () => {
      if (onConfirm) onConfirm(new Set(_selected));
    });

    function updateCount() { countEl.textContent = _selected.size; }

    // ---- Public API ----
    const api = {
      getElement() { return wrapper; },
      getSelected() { return new Set(_selected); },
      getAIResults() { return [..._aiConstraints]; },
      refresh() {
        _customConstraints = store.getCustomConstraints();
        render(searchInput.value);
        renderAIResults();
      },
      destroy() { wrapper.remove(); }
    };

    // Pre-fill product type from design intent if available
    if (anchorContext?.designIntent) {
      // Attempt to infer product type from design intent (simple heuristic)
      const intent = anchorContext.designIntent.toLowerCase();
      const productHints = [
        { kw: 'cup|bottle|mug|tumbler|drink', type: 'Water bottle / Tumbler' },
        { kw: 'wearable|watch|band|ring|glasses', type: 'Wearable device' },
        { kw: 'phone|mobile|smartphone', type: 'Smartphone' },
        { kw: 'lamp|light|luminaire', type: 'Lamp / Luminaire' },
        { kw: 'speaker|audio|headphone|earbud', type: 'Audio device' },
        { kw: 'kettle|coffee|tea|brew', type: 'Kettle / Brewer' },
        { kw: 'fan|heater|cool|purifier', type: 'Home appliance' }
      ];
      for (const hint of productHints) {
        if (new RegExp(hint.kw, 'i').test(intent)) {
          productTypeInput.value = hint.type;
          break;
        }
      }
    }

    render();
    return api;
  }

  /* ===================================================================
     data/rules-engine.js — Built-in Rule Engine
     No AI dependency. All recommendations are deterministic.
     =================================================================== */

  // ---- Design Directions (Phase 1) ----
  const DESIGN_DIRECTIONS = [
    {
      id: 'organic',
      name: 'Organic Flow',
      keywords: ['rounded', 'seamless', 'soft', 'natural', 'ergonomic', 'biomorphic'],
      suitable: ['Home appliances', 'Wearables', 'Kitchenware', 'Personal care'],
      notSuitable: ['Precision tools', 'Heavy machinery', 'Server equipment'],
      visualDesc: 'Flowing curves, continuous surfaces, nature-inspired forms',
      svgPath: 'M20,80 Q30,30 60,25 Q90,20 100,40 Q110,60 100,80 Q90,100 70,95 Q50,90 40,80 Q25,85 20,80Z',
      svgViewBox: '0 0 120 120'
    },
    {
      id: 'geometric',
      name: 'Geometric Precision',
      keywords: ['sharp', 'angular', 'clean', 'structured', 'rational', 'technical'],
      suitable: ['Electronics', 'Tools', 'Office equipment', 'Automotive'],
      notSuitable: ['Children products', 'Medical wearables', 'Soft goods'],
      visualDesc: 'Defined edges, planar surfaces, systematic proportions',
      svgPath: 'M15,25 L55,20 L105,35 L100,80 L60,95 L20,75 L15,25Z',
      svgViewBox: '0 0 120 120'
    },
    {
      id: 'contrast',
      name: 'Contrast Fusion',
      keywords: ['tension', 'contrast', 'playful', 'sculptural', 'expressive', 'dynamic'],
      suitable: ['Fashion tech', 'Concept products', 'Premium goods', 'Exhibition pieces'],
      notSuitable: ['Mass-market basics', 'Budget items', 'Medical devices'],
      visualDesc: 'Juxtaposition of curves and edges, unexpected transitions',
      svgPath: 'M20,30 Q60,20 80,25 L100,30 Q105,60 90,80 Q60,95 40,85 L25,80 Q15,60 20,30Z',
      svgViewBox: '0 0 120 120'
    }
  ];

  // ---- Product → Material Mapping (Phase 2) ----
  const PRODUCT_MATERIAL_MAP = {
    small_appliance: ['abs', 'pc', 'pc_abs'],
    wearable: ['silicone', 'abs', 'pa_nylon'],
    container: ['pp', 'abs', 'silicone'],
    electronic: ['pc', 'pc_abs', 'aluminum'],
    tool: ['pa_nylon', 'abs', 'pc'],
    furniture: ['abs', 'pp', 'wood'],
    lighting: ['pc', 'aluminum', 'abs'],
    kitchenware: ['pp', 'silicone', 'abs']
  };

  const PRODUCT_CATEGORIES = [
    { id: 'small_appliance', label: 'Small Appliance', examples: 'kettle, fan, humidifier' },
    { id: 'wearable', label: 'Wearable Device', examples: 'smartwatch, ring, band' },
    { id: 'container', label: 'Container / Bottle', examples: 'water bottle, lunch box' },
    { id: 'electronic', label: 'Consumer Electronic', examples: 'speaker, charger, hub' },
    { id: 'tool', label: 'Hand Tool / Gadget', examples: 'screwdriver, measuring tool' },
    { id: 'furniture', label: 'Furniture / Home', examples: 'lamp base, shelf bracket' },
    { id: 'lighting', label: 'Lighting', examples: 'desk lamp, pendant light' },
    { id: 'kitchenware', label: 'Kitchenware', examples: 'utensil, measuring cup' }
  ];

  // ---- Materials Database (Phase 2) ----
  const MATERIALS_DB = {
    abs: {
      id: 'abs', name: 'ABS Plastic', texture: 'swatch--matte-plastic',
      advantages: ['Low material cost', 'Excellent colorability', 'Good impact resistance', 'Easy to process'],
      disadvantages: ['Visible parting line', 'Poor heat resistance (<80°C)', 'Prone to surface scratching', 'Not UV stable'],
      constraints: [
        { id: 'c_abs_001', category: 'structure', label: 'Wall thickness', value: '2-3mm', why: 'Below 1.5mm risks short shots (incomplete filling). Above 4mm causes sink marks and extends cycle time.', alternatives: 'If thinner is needed, consider PC (flows better in thin sections).', scale: { min: 0.5, optimal: 2.5, max: 5, unit: 'mm', lowLabel: 'Short shots', highLabel: 'Sink marks' } },
        { id: 'c_abs_002', category: 'structure', label: 'Rib-to-wall ratio', value: '≤60%', why: 'Ribs thicker than 60% of the wall cause visible sink marks on the opposite surface.', alternatives: 'Use multiple thinner ribs instead of one thick one.', scale: { min: 30, optimal: 50, max: 80, unit: '%', lowLabel: 'Too weak', highLabel: 'Sink risk' } },
        { id: 'c_abs_003', category: 'process', label: 'Draft angle', value: '1-1.5°', why: 'Required for clean mold release. Insufficient draft causes drag marks and increases ejection force.', alternatives: 'Textured surfaces need 1° extra draft per 0.025mm texture depth.', scale: { min: 0.5, optimal: 1.25, max: 3, unit: '°', lowLabel: 'Drag marks', highLabel: 'Visible taper' } },
        { id: 'c_abs_004', category: 'process', label: 'Melt temperature', value: '220-250°C', why: 'Too low: incomplete fill. Too high: material degradation and burning.', alternatives: 'Glass-filled ABS needs 10-20°C higher.', scale: { min: 200, optimal: 235, max: 270, unit: '°C', lowLabel: 'Short shots', highLabel: 'Burnt material' } },
        { id: 'c_abs_005', category: 'ergonomics', label: 'Edge radius', value: 'R ≥ 0.5mm', why: 'Sharp edges are unsafe for handling and can crack during demolding.', alternatives: 'For visible exterior edges, R ≥ 1mm looks more premium.', scale: { min: 0.2, optimal: 0.75, max: 3, unit: 'mm', lowLabel: 'Sharp/crack', highLabel: 'Over-rounded' } }
      ],
      processDecisions: ['parting_line', 'surface_texture', 'gate_location']
    },
    pc: {
      id: 'pc', name: 'PC Plastic', texture: 'swatch--glossy-plastic',
      advantages: ['High strength & stiffness', 'Excellent transparency', 'Good heat resistance (>120°C)', 'UV stable options'],
      disadvantages: ['Higher material cost', 'Poor flow (thick walls needed)', 'Scratches easily', 'Needs drying before molding'],
      constraints: [
        { id: 'c_pc_001', category: 'structure', label: 'Wall thickness', value: '2.5-4mm', why: 'PC has higher viscosity than ABS — needs thicker sections for complete filling.', alternatives: 'If transparency is not required, consider PC+ABS for better flow.', scale: { min: 1, optimal: 3, max: 6, unit: 'mm', lowLabel: 'Fill failure', highLabel: 'Bubbles' } },
        { id: 'c_pc_002', category: 'process', label: 'Draft angle', value: '1.5-2°', why: 'PC shrinks less than ABS but is stiffer — needs more draft for clean ejection.', alternatives: 'Polished mold surfaces can reduce draft requirement by ~0.5°.', scale: { min: 0.5, optimal: 1.75, max: 3, unit: '°', lowLabel: 'Ejection marks', highLabel: 'Visible taper' } },
        { id: 'c_pc_003', category: 'process', label: 'Drying required', value: '4h at 120°C', why: 'PC is hygroscopic — moisture causes bubbles and silver streaks in the part.', alternatives: 'Use a desiccant dryer. Skipping drying will result in visible defects.', scale: null },
        { id: 'c_pc_004', category: 'ergonomics', label: 'Edge radius', value: 'R ≥ 0.5mm', why: 'PC is notch-sensitive — sharp internal corners can initiate cracks under load.', alternatives: 'Add R ≥ 1mm at all internal corners for structural parts.', scale: { min: 0.2, optimal: 0.75, max: 3, unit: 'mm', lowLabel: 'Crack risk', highLabel: 'Over-rounded' } }
      ],
      processDecisions: ['parting_line', 'surface_texture', 'transparency_tradeoff']
    },
    pc_abs: {
      id: 'pc_abs', name: 'PC+ABS Blend', texture: 'swatch--matte-plastic',
      advantages: ['Balanced cost-performance', 'Better flow than pure PC', 'Good impact + heat resistance', 'Widely available'],
      disadvantages: ['Opaque only', 'Still has parting line', 'Paint adhesion varies', 'Moderate UV resistance'],
      constraints: [
        { id: 'c_pca_001', category: 'structure', label: 'Wall thickness', value: '2-3.5mm', why: 'Blend flows better than pure PC but still needs adequate thickness for strength.', alternatives: 'For cosmetic parts, 1.8mm minimum is acceptable with good mold design.', scale: { min: 1, optimal: 2.5, max: 5, unit: 'mm', lowLabel: 'Fill failure', highLabel: 'Sink marks' } },
        { id: 'c_pca_002', category: 'process', label: 'Draft angle', value: '1-1.5°', why: 'Similar to ABS but slightly stiffer — moderate draft required.', alternatives: 'Textured finish needs additional 1° per 0.025mm depth.', scale: { min: 0.5, optimal: 1.25, max: 3, unit: '°', lowLabel: 'Drag marks', highLabel: 'Visible taper' } },
        { id: 'c_pca_003', category: 'ergonomics', label: 'Edge radius', value: 'R ≥ 0.5mm', why: 'Standard safety and mold-release requirement for blended plastics.', alternatives: 'Exterior visible edges should be R ≥ 1mm for premium feel.', scale: { min: 0.2, optimal: 0.75, max: 3, unit: 'mm', lowLabel: 'Sharp/crack', highLabel: 'Over-rounded' } }
      ],
      processDecisions: ['parting_line', 'surface_texture', 'gate_location']
    },
    pp: {
      id: 'pp', name: 'PP Plastic', texture: 'swatch--matte-plastic',
      advantages: ['Very low cost', 'Excellent chemical resistance', 'Flexible (living hinge possible)', 'Food-safe grades available'],
      disadvantages: ['Soft surface (scratches easily)', 'Poor paint adhesion', 'Lower stiffness', 'Warping in large parts'],
      constraints: [
        { id: 'c_pp_001', category: 'structure', label: 'Wall thickness', value: '1.5-3mm', why: 'PP flows very well — can fill thin sections. But too thin loses stiffness.', alternatives: 'For living hinges, hinge area should be 0.25-0.5mm.', scale: { min: 0.5, optimal: 2, max: 5, unit: 'mm', lowLabel: 'Too flexible', highLabel: 'Warp risk' } },
        { id: 'c_pp_002', category: 'process', label: 'Draft angle', value: '1-2°', why: 'PP shrinks significantly during cooling — needs adequate draft for release.', alternatives: 'Use uniform wall thickness to minimize differential shrinkage.', scale: { min: 0.5, optimal: 1.5, max: 3, unit: '°', lowLabel: 'Sticking', highLabel: 'Visible taper' } },
        { id: 'c_pp_003', category: 'ergonomics', label: 'Surface finish feel', value: 'Matte or textured', why: 'Glossy PP feels cheap and shows fingerprints. Texture improves perceived quality.', alternatives: 'Consider overmolding with TPE for soft-touch areas.', scale: null }
      ],
      processDecisions: ['parting_line', 'living_hinge', 'surface_texture']
    },
    silicone: {
      id: 'silicone', name: 'Silicone', texture: 'swatch--silicone',
      advantages: ['Soft, skin-friendly touch', 'Excellent heat resistance', 'Flexible and compressible', 'Biocompatible grades'],
      disadvantages: ['Higher unit cost', 'Limited structural strength', 'Attracts dust/lint', 'Harder to color consistently'],
      constraints: [
        { id: 'c_sil_001', category: 'structure', label: 'Wall thickness', value: '1-3mm', why: 'Silicone is flexible — thin sections tear; thick sections are hard to cure evenly.', alternatives: 'For structural areas, overmold silicone onto a rigid plastic core.', scale: { min: 0.5, optimal: 2, max: 5, unit: 'mm', lowLabel: 'Tear risk', highLabel: 'Uneven cure' } },
        { id: 'c_sil_002', category: 'process', label: 'Cure temperature', value: '150-200°C', why: 'Compression molding requires heat for crosslinking. Undercure = sticky surface.', alternatives: 'LSR (liquid silicone rubber) injection uses 120-180°C.', scale: null },
        { id: 'c_sil_003', category: 'ergonomics', label: 'Shore hardness', value: '40-60A', why: '40A = very soft (baby products). 60A = firm grip (sport equipment).', alternatives: 'For wearable bands, 50-55A is the comfort sweet spot.', scale: { min: 20, optimal: 50, max: 80, unit: 'A', lowLabel: 'Too soft', highLabel: 'Too hard' } }
      ],
      processDecisions: ['overmolding', 'surface_texture']
    },
    pa_nylon: {
      id: 'pa_nylon', name: 'PA Nylon', texture: 'swatch--matte-plastic',
      advantages: ['High strength & toughness', 'Good wear resistance', 'Heat resistant (>150°C)', 'Chemical resistant'],
      disadvantages: ['Absorbs moisture (dimensional change)', 'Higher cost than ABS', 'Needs thorough drying', 'Limited color options'],
      constraints: [
        { id: 'c_pa_001', category: 'structure', label: 'Wall thickness', value: '2-4mm', why: 'Nylon is tough but needs adequate thickness for mold filling due to fast crystallization.', alternatives: 'Glass-filled nylon can go thinner (1.5mm) but is more brittle.', scale: { min: 1, optimal: 3, max: 6, unit: 'mm', lowLabel: 'Fill failure', highLabel: 'Warp risk' } },
        { id: 'c_pa_002', category: 'process', label: 'Draft angle', value: '1-2°', why: 'Nylon shrinks significantly and sticks to mold — generous draft prevents damage.', alternatives: 'Mold release coating can reduce draft by ~0.5°.', scale: { min: 0.5, optimal: 1.5, max: 3, unit: '°', lowLabel: 'Sticking', highLabel: 'Visible taper' } }
      ],
      processDecisions: ['parting_line', 'moisture_conditioning']
    },
    aluminum: {
      id: 'aluminum', name: 'Aluminum', texture: 'swatch--brushed-metal',
      advantages: ['Premium look & feel', 'High strength-to-weight', 'Excellent thermal conductivity', 'Anodizable (colors)'],
      disadvantages: ['Much higher cost than plastic', 'Limited to simpler geometries', 'Heavier than plastic', 'Cold to touch'],
      constraints: [
        { id: 'c_alu_001', category: 'structure', label: 'Minimum wall thickness', value: '1.5-3mm (CNC)', why: 'CNC machined: 1.5mm min. Die-cast: 2mm min with draft. Thinner = higher scrap rate.', alternatives: 'Extruded aluminum profiles can achieve 1mm wall sections.', scale: { min: 0.5, optimal: 2, max: 5, unit: 'mm', lowLabel: 'Break risk', highLabel: 'Heavy/costly' } },
        { id: 'c_alu_002', category: 'process', label: 'Surface finish', value: 'Anodized or brushed', why: 'Raw aluminum oxidizes unevenly. Anodizing protects and enables color customization.', alternatives: 'Bead-blasted + anodized gives a premium matte finish.', scale: null },
        { id: 'c_alu_003', category: 'ergonomics', label: 'Edge treatment', value: 'Chamfer ≥ 0.5mm', why: 'Bare aluminum edges are sharper than plastic — chamfering is a safety requirement.', alternatives: 'For handheld parts, bead-blasted finish + 1mm chamfer feels premium.', scale: { min: 0.2, optimal: 0.75, max: 2, unit: 'mm', lowLabel: 'Cut risk', highLabel: 'Over-chamfered' } }
      ],
      processDecisions: ['cnc_vs_diecast', 'anodize_color']
    },
    wood: {
      id: 'wood', name: 'Wood', texture: 'swatch--wood-texture',
      advantages: ['Natural, warm aesthetic', 'Unique grain per piece', 'Sustainable perception', 'Good acoustic properties'],
      disadvantages: ['Inconsistent material properties', 'Moisture-sensitive (warps)', 'Limited complex geometry', 'Higher labor cost'],
      constraints: [
        { id: 'c_wd_001', category: 'structure', label: 'Minimum wall thickness', value: '4-6mm', why: 'Wood below 4mm is fragile and warps easily. Grain direction affects strength significantly.', alternatives: 'Plywood/veneer can go to 1.5mm over a substructure.', scale: { min: 2, optimal: 5, max: 10, unit: 'mm', lowLabel: 'Break/warp', highLabel: 'Bulky' } },
        { id: 'c_wd_002', category: 'process', label: 'Grain direction', value: 'Along length', why: 'Wood is 10-20x stronger along grain than across. Design parts so stress follows grain.', alternatives: 'Cross-laminated construction for multi-directional strength.', scale: null },
        { id: 'c_wd_003', category: 'ergonomics', label: 'Surface finish', value: 'Oil or wax seal', why: 'Unsealed wood stains from skin oils. Food-safe oils for kitchen contact.', alternatives: 'Lacquer for high-gloss; oil for natural touch.', scale: null }
      ],
      processDecisions: ['grain_orientation', 'sealant_type']
    }
  };

  // Material visual descriptions for AI image prompts — describes how each material actually looks
  const MATERIAL_VISUAL_DESC = {
    abs: 'injection-molded ABS thermoplastic, uniform matte surface with subtle mold texture, opaque solid color with soft diffuse reflections, professional consumer-product finish, slightly softened edges from mold flow',
    pc: 'polycarbonate, glass-like glossy clarity with crisp specular highlights, transparent depth revealing internal volume, precision polished mold finish, jewel-like light refraction at edges',
    pc_abs: 'PC+ABS blend, satin-matte surface with smooth semi-gloss sheen, opaque uniform coloration, balanced between matte warmth and subtle reflectivity, premium consumer-electronics grade finish',
    pp: 'semi-crystalline PP with characteristic soft waxy matte surface, slightly translucent in thin sections revealing subtle light transmission, uniform pastel coloration, clean utilitarian finish',
    silicone: 'soft-touch LSR silicone elastomer with velvety matte surface, fine pebbled micro-texture that absorbs light, seamless compression-molded appearance, warm skin-friendly tactile quality',
    pa_nylon: 'PA nylon with tough industrial matte surface, subtle natural off-white or grey undertone, visible glass-fiber reinforcement texture if reinforced, high-performance engineering finish with slight surface grain',
    aluminum: '6061 anodized aluminum with fine bead-blasted matte or linear brushed metallic surface, cool silver-grey tones with subtle specular highlights, precision CNC-machined edges showing fine tool path marks, premium heft and cool-to-touch appearance',
    wood: 'natural solid hardwood with organic cathedral grain pattern, warm amber to cognac brown tones, hand-finished surface with subtle oil or wax sheen that deepens the grain contrast, artisanal tactile quality with visible medullary rays'
  };

  // ---- Process Decisions (Phase 2) ----
  const PROCESS_DECISIONS = {
    parting_line: {
      id: 'parting_line',
      question: 'How will you handle the parting line?',
      options: [
        { id: 'hide_bottom', label: 'Hide on bottom', desc: 'Place the parting line where users rarely look', diagram: 'parting_hide' },
        { id: 'make_feature', label: 'Make it a feature', desc: 'Incorporate the line as an intentional design element', diagram: 'parting_feature' },
        { id: 'accept_visible', label: 'Accept visible line', desc: 'Acknowledge the line will be visible and plan for it', diagram: 'parting_visible' }
      ]
    },
    surface_texture: {
      id: 'surface_texture',
      question: 'What surface finish do you need?',
      options: [
        { id: 'matte', label: 'Matte / Satin', desc: 'Hides fingerprints, professional look. Adds ~1° draft requirement.' },
        { id: 'gloss', label: 'High Gloss', desc: 'Premium look but shows every scratch and fingerprint.' },
        { id: 'textured', label: 'Textured (MT-11000+)', desc: 'Industrial texture hides defects. Adds 1-3° extra draft.' }
      ]
    },
    gate_location: {
      id: 'gate_location',
      question: 'Where can the injection gate be placed?',
      options: [
        { id: 'hidden', label: 'Hidden surface', desc: 'Gate mark on non-visible face (bottom/inside)', diagram: 'gate_hidden' },
        { id: 'visible_postprocess', label: 'Visible + post-process', desc: 'Accept gate mark then trim/sand it', diagram: 'gate_visible' }
      ]
    },
    transparency_tradeoff: {
      id: 'transparency_tradeoff',
      question: 'Do you need optical transparency?',
      options: [
        { id: 'transparent', label: 'Yes — clear PC', desc: 'Higher cost, needs polished mold, shows all internal defects' },
        { id: 'translucent', label: 'Translucent is enough', desc: 'Frosted/semi-transparent hides internal structure, more forgiving' },
        { id: 'opaque', label: 'No — opaque is fine', desc: 'Widest material choice, lowest cost, hides everything' }
      ]
    },
    living_hinge: {
      id: 'living_hinge',
      question: 'Does your design need an integral hinge?',
      options: [
        { id: 'yes_hinge', label: 'Yes — living hinge', desc: 'PP can do 0.25-0.5mm hinge section. Requires specific gate placement.' },
        { id: 'no_hinge', label: 'No hinge needed', desc: 'Simpler mold, wider material choice.' }
      ]
    },
    overmolding: {
      id: 'overmolding',
      question: 'Will you overmold onto a rigid substrate?',
      options: [
        { id: 'yes_overmold', label: 'Yes — 2-shot or insert mold', desc: 'Silicone over ABS/PC core. Combines soft touch with structure.' },
        { id: 'no_overmold', label: 'Silicone-only part', desc: 'Simpler tool but limited structural capability.' }
      ]
    },
    cnc_vs_diecast: {
      id: 'cnc_vs_diecast',
      question: 'Production method?',
      options: [
        { id: 'cnc', label: 'CNC machining', desc: 'Lower tooling cost, better precision, higher per-part cost. Good for <1000 units.' },
        { id: 'diecast', label: 'Die casting', desc: 'High tooling cost, low per-part cost. Minimum 2mm wall + 2° draft.' }
      ]
    },
    anodize_color: {
      id: 'anodize_color',
      question: 'Color treatment?',
      options: [
        { id: 'natural_anodize', label: 'Natural / Clear anodize', desc: 'Silver-metallic. Most durable. Hard to match across batches.' },
        { id: 'color_anodize', label: 'Color anodize', desc: 'Wide color range. Slight batch variation. Fades under strong UV.' },
        { id: 'raw_finish', label: 'Brushed / Bead-blast (no anodize)', desc: 'Raw metal look. Will patina over time. Requires maintenance.' }
      ]
    },
    grain_orientation: {
      id: 'grain_orientation',
      question: 'How will you use wood grain?',
      options: [
        { id: 'along_length', label: 'Grain along length', desc: 'Strongest orientation. Use for structural parts.' },
        { id: 'decorative', label: 'Decorative orientation', desc: 'Choose grain for visual effect. Add structural support elsewhere.' }
      ]
    },
    sealant_type: {
      id: 'sealant_type',
      question: 'What surface protection?',
      options: [
        { id: 'oil_wax', label: 'Natural oil/wax', desc: 'Warm touch, repairable, needs reapplication. Food-safe options.', isDefault: true },
        { id: 'lacquer', label: 'Lacquer / Varnish', desc: 'Durable, high gloss option, harder to repair. Not food-safe.' }
      ]
    },
    moisture_conditioning: {
      id: 'moisture_conditioning',
      question: 'Will the part be exposed to moisture?',
      options: [
        { id: 'dry_use', label: 'Dry environment only', desc: 'Standard nylon is fine. Dimensionally stable indoors.' },
        { id: 'wet_use', label: 'Humid / wet environment', desc: 'Use conditioned or glass-filled nylon. Account for 1-2% dimensional swelling.' }
      ]
    }
  };

  // Process decision visual descriptions — how each decision manifests visually in the product image
  const PROCESS_VISUAL_DESC = {
    // Parting line
    hide_bottom: 'mold parting line discretely concealed along the bottom edge creating a clean uninterrupted silhouette with no visible seam on top or sides',
    make_feature: 'parting line expressed as a deliberate design accent — a precise hairline groove wrapping around the body as an intentional geometric detail',
    accept_visible: 'subtle visible parting line accepted as honest manufacturing character, a fine seam line running along the product midsection',
    // Surface texture
    matte: 'fine matte bead-blasted VDI 24 surface texture diffusing light softly with zero hotspots, fingerprint-resistant velvety touch, professional understated quality',
    gloss: 'high-gloss polished SPI A1 piano-black surface with crisp mirror-like specular reflections, deep wet-look shine that accentuates every surface contour',
    textured: 'industrial MT-11000 mold texture with fine geometric grain pattern that catches directional light subtly, masks fingerprints and minor surface variations',
    // Gate location
    hidden: 'injection gate mark positioned on a non-visible underside surface for pristine exterior appearance',
    visible_postprocess: 'gate vestige trimmed and post-processed flush with surrounding surface leaving a barely perceptible circular witness mark',
    // Transparency
    transparent: 'optically transparent with water-clear glass-like clarity, internal ribs and bosses faintly visible beneath the surface creating visual depth',
    translucent: 'frosted translucent finish with soft internal light diffusion and glow, partially obscuring internal structure for a refined mysterious depth',
    opaque: 'solid fully opaque coloration hiding all internal structure for a clean monolithic exterior appearance',
    // Living hinge
    yes_hinge: 'integral living hinge with a thin 0.3-0.5mm flexible section seamlessly connecting two rigid halves, showing subtle material thinning at the flex point',
    no_hinge: 'solid rigid one-piece construction without hinges, uniform wall sections throughout',
    // Overmolding
    yes_overmold: 'dual-material construction with soft-touch TPE overmolded grip areas creating visible two-tone material contrast and seamless material transition',
    no_overmold: 'single material monolithic construction with consistent surface finish throughout',
    // CNC vs die-cast
    cnc: 'precision CNC-machined from billet aluminum with visible fine circular tool path marks on flat surfaces, crisp sharp edges, and consistent surface finish',
    diecast: 'die-cast aluminum with characteristic fine grain structure, subtle material flow lines, slight draft taper on vertical walls, and uniform matte surface',
    // Anodize
    natural_anodize: 'Type II natural clear anodized surface with cool silver-metallic tone and subtle matte sheen beneath the transparent oxide layer',
    color_anodize: 'Type II color anodized surface in rich uniform hue with metallic undertone showing through the dyed oxide layer, slightly matte finish',
    raw_finish: 'raw brushed or bead-blasted aluminum surface without anodizing, natural metallic luster with visible grain texture, will develop patina over time',
    // Wood grain
    along_length: 'straight wood grain oriented along the longest dimension creating visual continuity and structural integrity, medullary rays visible as fine flecks',
    decorative: 'featured wood grain with cathedral figure and natural character marks, grain pattern chosen as a deliberate decorative focal point',
    // Wood sealant
    oil_wax: 'hand-rubbed natural oil and wax finish with warm low-luster tactile sheen that saturates and deepens the wood grain, organic matte glow',
    lacquer: 'gloss lacquer finish with glass-smooth sealed surface, deep amber tone enhancement, high-build mirror shine with durable protective coating',
    // Moisture
    dry_use: 'clean matte surface optimized for dry indoor environments, no sealing required',
    wet_use: 'moisture-resistant sealed surface with subtle water-beading matte texture, dimensionally stable for humid or wet environments'
  };

  // Material-specific negative prompts — prevents AI from using wrong materials
  const MATERIAL_NEGATIVE_PROMPTS = {
    abs: 'metal, aluminum, steel, chrome, wood grain, wood, glass, transparent, see-through, brushed metal, marble, stone, concrete, fabric, leather, ceramic, carbon fiber, rubber',
    pc: 'opaque plastic, frosted glass, wood, metal, aluminum, stone, concrete, ceramic, fabric, leather, rubber, cardboard',
    pc_abs: 'metal, aluminum, steel, wood, glass, transparent, leather, stone, marble, fabric, ceramic, carbon fiber',
    pp: 'metal, aluminum, glass, wood, high-gloss, glossy, polished, premium material, stone, ceramic, leather, carbon fiber, brushed metal',
    silicone: 'hard plastic, rigid, metal, aluminum, glass, wood, shiny surface, glossy, polished, ceramic, stone, carbon fiber, sharp edges',
    pa_nylon: 'wood, glass, transparent, stone, ceramic, low-quality plastic, cheap material, cardboard, fabric, leather, rubber, glossy, polished',
    aluminum: 'plastic texture, injection mold artifacts, parting lines, wood, cheap materials, rust, corrosion, paint peeling, fabric, leather, silicone, rubber, cardboard',
    wood: 'plastic, metal, aluminum, steel, glass, synthetic materials, artificial grain, uniform texture, MDF, plywood edge, paint, ceramic, carbon fiber'
  };

  // ---- Conflict Rules (Phase 3) ----
  const CONFLICT_RULES = [
    {
      id: 'cf_seamless_vs_parting',
      designKeywords: ['seamless', 'unibody', 'monolithic', 'smooth', 'continuous'],
      materialIds: ['abs', 'pc', 'pp', 'pa_nylon', 'pc_abs'],
      title: 'Seamless design vs. Parting line reality',
      description: 'Your design language calls for seamless, continuous surfaces — but injection-molded plastics always have a visible parting line where mold halves meet.',
      source: 'Injection molding requires at least two mold halves that separate to eject the part. Where they meet, a parting line is physically unavoidable — this is a fundamental constraint of the molding process, not a design flaw.',
      confidence: 95,
      leftLabel: 'Your Design Intent',
      rightLabel: 'Manufacturing Reality',
      resolutions: [
        { id: 'hide_line', label: 'Hide parting line on bottom/rear', desc: 'Place the parting line where users rarely look. Most common solution.' },
        { id: 'switch_silicone', label: 'Switch to silicone overmolding', desc: 'Silicone parts can be seamless but have different aesthetics and structural limits.' },
        { id: 'make_feature', label: 'Make the line a design feature', desc: 'Embrace the parting line — use it as a deliberate surface break or accent.' },
        { id: 'accept_line', label: 'Accept the visible line', desc: 'I understand the limitation and accept the aesthetic compromise.' }
      ]
    },
    {
      id: 'cf_sharp_vs_draft',
      designKeywords: ['sharp', 'angular', 'geometric', 'crisp', 'precise', 'defined'],
      materialIds: ['abs', 'pc', 'pp', 'pa_nylon', 'pc_abs'],
      title: 'Sharp geometry vs. Draft angle requirements',
      description: 'Your design language emphasizes sharp, defined edges — but injection molding requires draft angles (tapered walls) for clean mold release, which softens sharp geometry.',
      source: 'Molded parts must release cleanly from the mold cavity. Without draft angles (typically 1–2°), the part drags against mold walls during ejection, causing scratches, stress marks, or stuck parts. This is a well-established mold design rule.',
      confidence: 90,
      leftLabel: 'Your Design Intent',
      rightLabel: 'Manufacturing Reality',
      resolutions: [
        { id: 'add_draft', label: 'Add 1-2° draft, keep overall look', desc: 'Small draft angles are barely visible but enable clean production. Design the visible face to be the non-drafted side.' },
        { id: 'cnc_option', label: 'Switch to CNC aluminum', desc: 'CNC machining can achieve true sharp edges. Higher cost per part but zero draft needed.' },
        { id: 'design_for_draft', label: 'Design draft into the aesthetic', desc: 'Use the taper as a deliberate visual element — angular facets can look intentional.' },
        { id: 'accept_draft', label: 'Accept slight softening', desc: '0.5-1° draft on a 20mm wall is ~0.2-0.4mm — barely perceptible.' }
      ]
    },
    {
      id: 'cf_thin_vs_fill',
      designKeywords: ['slim', 'thin', 'lightweight', 'minimal', 'compact', 'delicate'],
      materialIds: ['abs', 'pc', 'pc_abs', 'pa_nylon'],
      title: 'Ultra-thin design vs. Mold filling limits',
      description: 'Your design language aims for slim, lightweight forms — but each material has a minimum wall thickness below which the mold cavity cannot fill completely.',
      source: 'Molten plastic cools and solidifies as it flows into the mold. Below a material-specific minimum wall thickness, the plastic freezes before filling the entire cavity, causing short shots or structurally weak sections. The exact limit depends on flow length and part geometry.',
      confidence: 70,
      leftLabel: 'Your Design Intent',
      rightLabel: 'Manufacturing Reality',
      resolutions: [
        { id: 'minimum_wall', label: 'Accept minimum wall thickness', desc: 'Use the recommended minimum for your material. Most thin designs achieve the look at 2mm.' },
        { id: 'switch_material', label: 'Switch to better-flowing material', desc: 'PP flows exceptionally well in thin sections. Consider if its properties work for your product.' },
        { id: 'redesign_thick', label: 'Adjust design for thicker sections', desc: 'Slightly thicker walls can be disguised with undercuts or shadow lines.' }
      ]
    },
    {
      id: 'cf_organic_vs_flat',
      designKeywords: ['organic', 'curved', 'flowing', 'biomorphic', 'natural', 'sculptural'],
      materialIds: ['aluminum'],
      title: 'Organic forms vs. Metal machining limits',
      description: 'Your design explores organic, flowing forms — but CNC machining aluminum works best with planar surfaces and defined radii. Deep organic contours require 5-axis machining (much more expensive).',
      source: 'Standard 3-axis CNC milling approaches the workpiece from a single direction. Deep organic contours with undercuts require either 5-axis machines (3–5× cost) or multiple setup flips (reduced precision). The more sculptural the form, the more complex the toolpath.',
      confidence: 85,
      leftLabel: 'Your Design Intent',
      rightLabel: 'Manufacturing Reality',
      resolutions: [
        { id: 'simplify', label: 'Simplify to 3-axis machinable', desc: 'Keep organic feel but limit to surfaces reachable from one direction. Use corner radii to soften.' },
        { id: 'switch_plastic', label: 'Switch to injection-molded plastic', desc: 'Injection molding handles organic forms freely. Choose PC+ABS for a premium feel.' },
        { id: 'accept_cost', label: 'Accept 5-axis machining cost', desc: '5-axis CNC can do organic forms in aluminum. Expect 3-5x cost vs 3-axis.' }
      ]
    },
    {
      id: 'cf_glossy_vs_scratch',
      designKeywords: ['glossy', 'polished', 'mirror', 'refined', 'luxury'],
      materialIds: ['pc', 'abs', 'pc_abs'],
      title: 'High-gloss finish vs. Scratch sensitivity',
      description: 'Your design aims for a glossy, polished look — but high-gloss plastic surfaces show every fingerprint, scratch, and molding defect.',
      source: 'High-gloss surfaces have no micro-texture to scatter light and hide imperfections. Plastics (especially PC and ABS) are softer than glass or metal, making them prone to visible micro-scratches from daily handling. This is an aesthetic trade-off rather than a hard manufacturing limit.',
      confidence: 60,
      leftLabel: 'Your Design Intent',
      rightLabel: 'Manufacturing Reality',
      resolutions: [
        { id: 'matte_alternative', label: 'Switch to premium matte/satin', desc: 'A fine matte texture (MT-11010) reads as premium and hides wear. Popular in high-end electronics.' },
        { id: 'hardcoat', label: 'Apply hard coating', desc: 'UV-cured hard coat adds scratch resistance to glossy PC. Adds ~$0.50-1.00 per part.' },
        { id: 'accept_wear', label: 'Accept the patina of use', desc: 'Some products look better with age. Embrace the worn-in look as part of the product story.' }
      ]
    }
  ];

  function detectConflicts(directionId, materialId) {
    const direction = DESIGN_DIRECTIONS.find(d => d.id === directionId);
    if (!direction) return [];
    const keywords = direction.keywords;
    return CONFLICT_RULES.filter(rule => {
      const kwMatch = rule.designKeywords.some(kw => keywords.includes(kw));
      const matMatch = rule.materialIds.includes(materialId);
      return kwMatch && matMatch;
    });
  }

  function getRecommendedMaterials(productTypeId) {
    const materialIds = PRODUCT_MATERIAL_MAP[productTypeId] || ['abs', 'pc', 'pc_abs'];
    return materialIds.map(id => MATERIALS_DB[id]).filter(Boolean);
  }

  /* ===================================================================
     components/anchor-card.js — Three-Phase Debiasing Workflow
     =================================================================== */

  let _destroyFns = [];

  function initAnchorPage(container) {
    const project = store.getActiveProject();
    const card = store.getAnchorCard(project.id);

    const save = debounce((partial) => {
      store.saveAnchorCard(project.id, partial);
    }, 500);

    // Auto-save indicator
    let saveTimer = null;
    function showSaved(el) {
      if (!el) return;
      el.classList.add('is-visible');
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => el.classList.remove('is-visible'), 1500);
    }

    // --- Determine which phase to show on load ---
    let currentPhase = 1;
    if (card.resolvedConflicts && card.resolvedConflicts.length > 0) currentPhase = 4; // completed
    else if (card.selectedMaterial && card.constraints && card.constraints.length > 0) currentPhase = 3;
    else if (card.designDirection && card.designDirection.id) currentPhase = 2;

    // --- Zone-based contextual hints ---
    var ZONE_HINTS = {
      'p1_intent':    "Describe what you want to design and why. Don't overthink it — just write what comes to mind. This is your raw creative space, no judgment.",
      'p1_keywords':  "Add words that capture the feeling of your design. Think about mood, style, era, or visual language. Press Enter or comma after each word.",
      'p1_images':    "Reference images are totally optional — use them to communicate a vibe or aesthetic. Skip this if you don't have any on hand.",
      'p1_directions': "Browse the three design directions. Each one represents a different philosophy. Pick whichever resonates — there's no \"best\" choice here.",
      'p1_reason':    "Why did this direction speak to you? Your intuition matters — jot down your reasoning. There are no wrong answers.",
      'p2_category':  "Pick the closest product type to ground your concept in reality. Not an exact match? No worries — just choose the nearest one.",
      'p2_material':  "Each material has unique aesthetics and manufacturing implications. Think about what your product would actually be made from. Trade-offs are normal!",
      'p2_process':   "Manufacturing choices affect how your product will look and feel. Each option leaves different visible traces on the final surface.",
      'p2_constraints': "Review each constraint one at a time. Accept, skip, or adjust — these real-world limits make design interesting, not restrictive.",
      'p3_conflicts': "Design conflicts happen when vision meets reality. That's a good sign — it means you're thinking deeply. Choose what best serves your concept.",
      'p3_none':      "Your design direction and material choices are well aligned. Nice work thinking through the details! You're ready to visualize your concept.",
      'p4_summary':   "You've done the hard work — defining your design on your own terms before AI influenced you. Now let's turn your anchor into a visual concept.",
      'p4_prompt':    "This prompt was generated from your anchor decisions. Edit it to fine-tune what you want the AI to render. You're in control.",
      'p4_generate':  "Ready to see your design? Click Generate and your carefully-made decisions will be turned into a visual concept rendering."
    };

    function setHint(zone) {
      var hintEl = document.querySelector('.ac-hint-sidebar__text');
      if (!hintEl) return;
      var text = ZONE_HINTS[zone] || '';
      if (!text) return;
      if (hintEl.textContent === text) return; // no change
      hintEl.style.opacity = '0';
      setTimeout(function () {
        hintEl.textContent = text;
        hintEl.style.opacity = '1';
      }, 120);
    }

    function detectZone(el) {
      if (!el) return null;
      if (el.closest('.ac-textarea')) return 'p1_intent';
      if (el.closest('.ac-kw-container') || el.closest('.ac-kw-input')) return 'p1_keywords';
      if (el.closest('.ac-image-zone')) return 'p1_images';
      if (el.closest('.ac-reason-input')) return 'p1_reason';
      if (el.closest('.ac-directions') && !el.closest('.ac-direction-reason')) return 'p1_directions';
      if (el.closest('.ac-product-select')) return 'p2_category';
      if (el.closest('.ac-material-cards')) return 'p2_material';
      if (el.closest('.ac-process-questions') || el.closest('.ac-process-opt')) return 'p2_process';
      if (el.closest('.ac-constraint-list') || el.closest('.ac-constraint-item')) return 'p2_constraints';
      if (el.closest('.ac-conflict-card') || el.closest('.ac-resolution-btn')) return 'p3_conflicts';
      if (el.closest('.ac-no-conflicts')) return 'p3_none';
      if (el.closest('.ac-prompt__textarea')) return 'p4_prompt';
      if (el.closest('.ac-generate-btn') || el.closest('.ac-regenerate-btn') || el.closest('.ac-prompt__controls')) return 'p4_generate';
      if (el.closest('.ac-complete')) return 'p4_summary';
      // Fallback: detect by visible phase
      var visiblePhase = container.querySelector('.ac-phase:not(.is-hidden)');
      if (visiblePhase) {
        var p = visiblePhase.dataset.phase;
        if (p === '1') return 'p1_intent';
        if (p === '2') return 'p2_category';
        if (p === '3') return 'p3_conflicts';
        if (p === '4') return 'p4_summary';
      }
      return 'p1_intent';
    }

    // Delegated focus/click → hint update
    container.addEventListener('focusin', function (e) {
      var zone = detectZone(e.target);
      if (zone) setHint(zone);
    });
    container.addEventListener('click', function (e) {
      // Only for non-focusable elements (cards, buttons, etc.)
      var tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return; // focusin handles these
      var zone = detectZone(e.target);
      if (zone) setHint(zone);
    });

    // --- Build Phase 1 Shell ---
    container.innerHTML = `
      <div class="ac-layout">
        <div class="ac-layout__main">
          <div class="anchor-card">
        <!-- Progress -->
        <div class="ac-progress">
          <div class="ac-progress__step ${currentPhase >= 1 ? 'is-active' : ''} ${currentPhase > 1 ? 'is-done' : ''}">
            <span class="ac-progress__dot">1</span>
            <span class="ac-progress__label">Expand View</span>
          </div>
          <div class="ac-progress__line ${currentPhase >= 2 ? 'is-done' : ''}"></div>
          <div class="ac-progress__step ${currentPhase >= 2 ? 'is-active' : ''} ${currentPhase > 2 ? 'is-done' : ''}">
            <span class="ac-progress__dot">2</span>
            <span class="ac-progress__label">Ground in Reality</span>
          </div>
          <div class="ac-progress__line ${currentPhase >= 3 ? 'is-done' : ''}"></div>
          <div class="ac-progress__step ${currentPhase >= 3 ? 'is-active' : ''} ${currentPhase > 3 ? 'is-done' : ''}">
            <span class="ac-progress__dot">3</span>
            <span class="ac-progress__label">Resolve Conflicts</span>
          </div>
        </div>

        <!-- Phase 1: Expand Your View -->
        <div class="ac-phase ${currentPhase === 1 ? '' : 'is-hidden'}" data-phase="1">
          <div class="ac-phase__banner">
            <h2>Expand Your View</h2>
            <p>Before looking at any AI-generated styling, define your design direction. This prevents being anchored to the first pretty image you see.</p>
          </div>

          <section class="ac-section">
            <div class="ac-section__header">
              <h3>Design Intent</h3>
              <span>Describe what you want to design and why</span>
            </div>
            <textarea class="ac-textarea form-textarea" placeholder="e.g., A portable coffee cup for young professionals. One-hand operation, easy to clean, fits car cup holders, keeps drinks warm for 2+ hours..." maxlength="1000"></textarea>
            <span class="ac-char-count">0 / 1000</span>
          </section>

          <section class="ac-section">
            <div class="ac-section__header">
              <h3>Style Keywords</h3>
              <span>Enter / comma to add</span>
            </div>
            <div class="ac-kw-container"></div>
          </section>

          <section class="ac-section">
            <div class="ac-section__header">
              <h3>Reference Images</h3>
              <span>Optional, up to 3</span>
            </div>
            <div class="ac-image-zone">
              <div class="ac-image-list"></div>
              ${(card.referenceImages || []).length < 3 ? `<label class="ac-image-add"><input type="file" accept="image/*" hidden class="ac-image-input"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>Add Image</span></label>` : ''}
            </div>
          </section>

          <section class="ac-section">
            <div class="ac-section__header">
              <h3>Explore Design Directions</h3>
              <span>Compare all three before choosing — there is no "best" option</span>
            </div>
            <div class="ac-directions"></div>
            <div class="ac-direction-reason is-hidden">
              <label class="ac-reason-label">Why did you choose this direction? <small>(required, min 10 characters)</small></label>
              <textarea class="ac-reason-input form-textarea" placeholder="I chose this direction because..." maxlength="300"></textarea>
            </div>
            <button class="btn btn--primary ac-confirm-direction" type="button" disabled>Confirm Direction →</button>
          </section>
        </div>

        <!-- Phase 2: Ground in Reality -->
        <div class="ac-phase ${currentPhase === 2 ? '' : 'is-hidden'}" data-phase="2">
          <div class="ac-phase__banner">
            <h2>Ground in Reality</h2>
            <p>Beautiful forms only matter if they can be manufactured. Each material has trade-offs — understand them before you commit.</p>
          </div>
          <div class="ac-phase2-content"></div>
        </div>

        <!-- Phase 3: Resolve Conflicts -->
        <div class="ac-phase ${currentPhase === 3 ? '' : 'is-hidden'}" data-phase="3">
          <div class="ac-phase__banner">
            <h2>Resolve Conflicts</h2>
            <p>Your design vision and manufacturing reality may not align perfectly. Let's find the gaps and address them.</p>
          </div>
          <div class="ac-phase3-content"></div>
        </div>

        <!-- Completion -->
        <div class="ac-phase ac-complete ${currentPhase === 4 ? '' : 'is-hidden'}" data-phase="4">
          <div class="ac-complete__icon">✓</div>
          <h2>Anchor Complete</h2>
          <p>Your design direction is defined and grounded in reality. Ready for AI styling exploration.</p>
          <div class="ac-complete__summary"></div>
          <button class="btn btn--outline ac-edit-anchor" type="button">Edit Anchor</button>

          <section class="ac-section ac-prompt-section">
            <div class="ac-section__header">
              <h3>AI Image Generation</h3>
              <span>Powered by ModelScope Z-Image-Turbo — free, ~2000 images/day</span>
            </div>
            <p class="ac-prompt__hint">Your anchor data has been turned into an AI image prompt. Edit it to refine, then generate.</p>
            <textarea class="ac-prompt__textarea form-textarea" rows="6" maxlength="2000"></textarea>
            <div class="ac-prompt__settings">
              <label class="ac-api-label" for="ac-api-token">ModelScope API Token</label>
              <input type="password" id="ac-api-token" class="ac-api-input form-input" placeholder="ms-..." autocomplete="off">
              <button class="btn btn--sm btn--outline ac-api-save" type="button">Save</button>
            </div>
            <div class="ac-prompt__controls">
              <button class="btn btn--primary ac-generate-btn" type="button">Generate Image</button>
              <button class="btn btn--outline ac-regenerate-btn" type="button">Regenerate</button>
              <span class="ac-prompt__seed">Seed: <span class="ac-seed-value">42</span></span>
            </div>
            <div class="ac-image-result is-hidden">
              <div class="ac-image-result__loading">
                <div class="spinner"></div>
                <span>Generating... this may take 5-15 seconds</span>
              </div>
              <div class="ac-image-result__error is-hidden"></div>
              <img class="ac-image-result__img" src="" alt="AI generated design concept">
            </div>
          </section>
        </div>
      </div><!-- .anchor-card -->
    </div><!-- .ac-layout__main -->
    <aside class="ac-hint-sidebar">
      <div class="ac-hint-sidebar__inner">
        <div class="ac-hint-sidebar__icon" aria-hidden="true">
          <span class="ac-hint-sidebar__emoji">💡</span>
        </div>
        <span class="ac-hint-sidebar__label">Tip</span>
        <p class="ac-hint-sidebar__text">Test hint — sidebar is working!</p>
        <div class="ac-hint-sidebar__dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    </aside>
  </div><!-- .ac-layout -->`;

    // Set initial hint
    var initialZone = detectZone(container);
    if (initialZone) setHint(initialZone);

    // Initial sidebar state
    if (window.__updateSidebar) window.__updateSidebar(currentPhase);

    // Listen for sidebar navigation events
    document.addEventListener('sidebar:navigate', function(e) {
      var targetPhase = e.detail && e.detail.phase;
      if (targetPhase && targetPhase <= currentPhase) {
        transitionToPhase(targetPhase);
      }
    });

    // ---- Shared refs ----
    const textarea = container.querySelector('.ac-textarea');
    const charCount = container.querySelector('.ac-char-count');
    const kwContainer = container.querySelector('.ac-kw-container');
    const imageList = container.querySelector('.ac-image-list');
    const imageInput = container.querySelector('.ac-image-input');
    const imageAdd = container.querySelector('.ac-image-add');
    const directionsEl = container.querySelector('.ac-directions');
    const reasonWrap = container.querySelector('.ac-direction-reason');
    const reasonInput = container.querySelector('.ac-reason-input');
    const confirmDirBtn = container.querySelector('.ac-confirm-direction');
    const phase2Content = container.querySelector('.ac-phase2-content');
    const phase3Content = container.querySelector('.ac-phase3-content');

    let _selectedDirection = card.designDirection || null;
    let _selectedMaterial = card.selectedMaterial || null;
    let _productType = card.productType || '';
    let _processDecisions = card.processDecisions || {};
    let _constraints = card.constraints ? [...card.constraints] : [];
    let _resolvedConflicts = card.resolvedConflicts || [];

    // ---- Keyword Input ----
    const kw = createKeywordInput({
      container: kwContainer,
      keywords: card.styleKeywords || [],
      placeholder: 'e.g., minimal, organic, futuristic, warm...',
      maxItems: 20,
      onChange: (keywords) => { save({ styleKeywords: keywords }); }
    });
    _destroyFns.push(() => kw.destroy());

    // ---- Design Intent ----
    textarea.value = card.designIntent || '';
    charCount.textContent = `${textarea.value.length} / 1000`;
    textarea.addEventListener('input', () => {
      charCount.textContent = `${textarea.value.length} / 1000`;
      save({ designIntent: textarea.value });
    });

    // ---- Reference Images ----
    let _images = [...(card.referenceImages || [])];
    function renderImages() {
      imageList.innerHTML = '';
      _images.forEach((dataUrl, idx) => {
        const thumb = document.createElement('div');
        thumb.className = 'ac-image-thumb';
        thumb.innerHTML = `<img src="${dataUrl}" alt="Ref ${idx + 1}"><button class="ac-image-remove" data-index="${idx}" type="button">&times;</button>`;
        imageList.appendChild(thumb);
      });
      if (imageAdd) imageAdd.style.display = _images.length >= 3 ? 'none' : '';
    }
    function addImage(file) {
      if (_images.length >= 3) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let dataUrl = e.target.result;
          if (img.width > 800) {
            const canvas = document.createElement('canvas');
            const ratio = 800 / img.width;
            canvas.width = 800; canvas.height = img.height * ratio;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          }
          _images.push(dataUrl); renderImages(); save({ referenceImages: _images });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
    if (imageInput) { imageInput.addEventListener('change', (e) => { const file = e.target.files[0]; if (file) addImage(file); imageInput.value = ''; }); }
    imageList.addEventListener('click', (e) => { const btn = e.target.closest('.ac-image-remove'); if (btn) { _images.splice(parseInt(btn.dataset.index, 10), 1); renderImages(); save({ referenceImages: _images }); } });
    renderImages();

    // ---- Phase 1: Design Directions ----
    function renderDirections() {
      directionsEl.innerHTML = DESIGN_DIRECTIONS.map(d => `
        <button class="ac-dir-card ${_selectedDirection && _selectedDirection.id === d.id ? 'is-selected' : ''}" data-dir="${d.id}" type="button">
          <div class="ac-dir-visual">
            <svg viewBox="${d.svgViewBox}" width="100" height="100"><path d="${d.svgPath}" fill="var(--color-primary-muted)" opacity="0.6"/></svg>
          </div>
          <div class="ac-dir-info">
            <h4 class="ac-dir-name">${d.name}</h4>
            <p class="ac-dir-desc">${d.visualDesc}</p>
            <div class="ac-dir-tags">
              ${d.keywords.slice(0, 4).map(k => `<span class="ac-dir-tag">${k}</span>`).join('')}
            </div>
            <div class="ac-dir-meta">
              <span class="ac-dir-suitable" title="Suitable for">✓ ${d.suitable.slice(0, 2).join(', ')}</span>
            </div>
          </div>
        </button>
      `).join('');
    }

    directionsEl.addEventListener('click', (e) => {
      const card = e.target.closest('.ac-dir-card');
      if (!card) return;
      const dirId = card.dataset.dir;
      _selectedDirection = DESIGN_DIRECTIONS.find(d => d.id === dirId);
      renderDirections();
      reasonWrap.classList.remove('is-hidden');
      reasonInput.value = _selectedDirection._reason || '';
      reasonInput.focus();
      updateConfirmBtn();
    });

    reasonInput.addEventListener('input', () => {
      if (_selectedDirection) _selectedDirection._reason = reasonInput.value;
      updateConfirmBtn();
    });

    function updateConfirmBtn() {
      const valid = _selectedDirection && reasonInput.value.trim().length >= 10;
      confirmDirBtn.disabled = !valid;
    }

    confirmDirBtn.addEventListener('click', () => {
      if (!_selectedDirection || reasonInput.value.trim().length < 10) return;
      _selectedDirection.reason = reasonInput.value.trim();
      save({ designDirection: { id: _selectedDirection.id, name: _selectedDirection.name, reason: _selectedDirection.reason } });
      transitionToPhase(2);
    });

    renderDirections();
    if (_selectedDirection) {
      reasonWrap.classList.remove('is-hidden');
      reasonInput.value = _selectedDirection.reason || _selectedDirection._reason || '';
      updateConfirmBtn();
    }
    if (!_selectedDirection) {
      // Restore from saved
      if (card.designDirection) {
        _selectedDirection = { ...card.designDirection, _reason: card.designDirection.reason };
        reasonWrap.classList.remove('is-hidden');
        reasonInput.value = _selectedDirection.reason || '';
        renderDirections();
        updateConfirmBtn();
      }
    }

    // ---- Phase 2: Ground in Reality ----
    function renderPhase2() {
      if (!phase2Content) return;

      const savedConstraints = _constraints;
      const confirmedCount = savedConstraints.filter(c => c.confirmed).length;

      phase2Content.innerHTML = `
        <section class="ac-section">
          <div class="ac-section__header">
            <h3>Product Category</h3>
            <span>Select the closest match</span>
          </div>
          <select class="form-input ac-product-select">
            <option value="">— Select product category —</option>
            ${PRODUCT_CATEGORIES.map(c => `<option value="${c.id}" ${_productType === c.id ? 'selected' : ''}>${c.label} (${c.examples})</option>`).join('')}
          </select>
        </section>

        <div class="ac-materials-area ${_productType ? '' : 'is-hidden'}">
          <section class="ac-section">
            <div class="ac-section__header">
              <h3>Material Options</h3>
              <span>Each material has trade-offs — there is no perfect choice</span>
            </div>
            <div class="ac-material-cards"></div>
          </section>
        </div>

        <div class="ac-process-area ${_selectedMaterial ? '' : 'is-hidden'}">
          <section class="ac-section">
            <div class="ac-section__header">
              <h3>Process Decisions</h3>
              <span>Your material choice requires these decisions</span>
            </div>
            <div class="ac-process-questions"></div>
          </section>
        </div>

        <div class="ac-constraint-area ${confirmedCount > 0 || _selectedMaterial ? '' : 'is-hidden'}">
          <section class="ac-section">
            <div class="ac-section__header">
              <h3>Constraint Review</h3>
              <span>Review each constraint individually. There is no "Accept All" button.</span>
            </div>
            <div class="ac-constraint-list"></div>
          </section>

          <section class="ac-section">
            <button class="btn btn--outline ac-open-library" type="button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/></svg>
              Browse Full Constraint Library (Optional)
            </button>
          </section>

          <div class="ac-phase2-footer">
            <span class="ac-confirmed-count">${confirmedCount} of ${savedConstraints.length || '?'} constraints reviewed</span>
            <button class="btn btn--primary ac-confirm-phase2" type="button" ${savedConstraints.length === 0 ? 'disabled' : ''}>Confirm & Check Conflicts →</button>
          </div>
        </div>
      `;

      // Product type change → show materials
      const productSelect = phase2Content.querySelector('.ac-product-select');
      productSelect.addEventListener('change', () => {
        _productType = productSelect.value;
        save({ productType: _productType });
        _selectedMaterial = null;
        _processDecisions = {};
        _constraints = [];
        renderPhase2();
      });

      // Render material cards
      if (_productType) {
        const matCards = phase2Content.querySelector('.ac-material-cards');
        const materials = getRecommendedMaterials(_productType);
        matCards.innerHTML = materials.map(m => `
          <button class="ac-mat-card ${_selectedMaterial && _selectedMaterial.id === m.id ? 'is-selected' : ''}" data-mat="${m.id}" type="button">
            <div class="ac-mat-visual">
              <div class="material-swatch ${m.texture}" style="width:64px;height:64px;border-radius:8px"></div>
            </div>
            <div class="ac-mat-info">
              <h4>${m.name}</h4>
              <div class="ac-mat-pros">${m.advantages.map(a => `<span class="ac-mat-pro">✓ ${a}</span>`).join('')}</div>
              <div class="ac-mat-cons">${m.disadvantages.map(d => `<span class="ac-mat-con">✗ ${d}</span>`).join('')}</div>
            </div>
          </button>
        `).join('');

        matCards.addEventListener('click', (e) => {
          const card = e.target.closest('.ac-mat-card');
          if (!card) return;
          const matId = card.dataset.mat;
          _selectedMaterial = { id: matId, name: MATERIALS_DB[matId].name };
          _processDecisions = {};
          _constraints = [];
          save({ selectedMaterial: _selectedMaterial });
          renderPhase2();
        });
      }

      // Render process decisions
      if (_selectedMaterial) {
        const matData = MATERIALS_DB[_selectedMaterial.id];
        const processQs = phase2Content.querySelector('.ac-process-questions');

        if (matData.processDecisions.length > 0) {
          processQs.innerHTML = matData.processDecisions.map(decId => {
            const dec = PROCESS_DECISIONS[decId];
            if (!dec) return '';
            const selected = _processDecisions[decId];
            return `
              <div class="ac-process-q">
                <p class="ac-process-q__title">${dec.question}</p>
                <div class="ac-process-opts">
                  ${dec.options.map(opt => `
                    <button class="ac-process-opt ${selected === opt.id ? 'is-selected' : ''}" data-q="${decId}" data-opt="${opt.id}" type="button">
                      ${opt.diagram ? `<svg class="ac-process-diagram" viewBox="0 0 60 40" width="60" height="40">${getProcessDiagram(decId, opt.id)}</svg>` : ''}
                      <span class="ac-process-opt__label">${opt.label}</span>
                      <span class="ac-process-opt__desc">${opt.desc}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('');
        }

        processQs.addEventListener('click', (e) => {
          const opt = e.target.closest('.ac-process-opt');
          if (!opt) return;
          const qId = opt.dataset.q;
          const optId = opt.dataset.opt;
          _processDecisions[qId] = optId;
          save({ processDecisions: _processDecisions });
          renderPhase2();
        });
      }

      // Render constraints
      if (_selectedMaterial) {
        const matData = MATERIALS_DB[_selectedMaterial.id];
        const constraintListEl = phase2Content.querySelector('.ac-constraint-list');

        // Initialize constraints from material defaults if empty
        if (_constraints.length === 0 || !_constraints[0]._fromMaterial) {
          _constraints = matData.constraints.map(c => ({
            ...c,
            _fromMaterial: true,
            confirmed: false,
            source: 'rule_engine'
          }));
        }

        constraintListEl.innerHTML = _constraints.map((c, idx) => `
          <div class="ac-constraint-item ${c.confirmed ? 'is-confirmed' : ''} ${c.skipped ? 'is-skipped' : ''}">
            <div class="ac-constraint-header">
              <span class="ac-constraint-label">${c.label}: <strong>${c.value}</strong></span>
              <span class="badge--ai" style="font-size:8px">RULE</span>
            </div>
            ${c.scale ? `
              <div class="ac-scale">
                <span class="ac-scale__low">${c.scale.lowLabel}</span>
                <div class="ac-scale__track">
                  <div class="ac-scale__fill" style="width:${((c.scale.optimal - c.scale.min) / (c.scale.max - c.scale.min)) * 100}%"></div>
                  <div class="ac-scale__marker" style="left:${((c.scale.optimal - c.scale.min) / (c.scale.max - c.scale.min)) * 100}%"></div>
                </div>
                <span class="ac-scale__high">${c.scale.highLabel}</span>
              </div>
            ` : ''}
            <p class="ac-constraint-why"><strong>Why:</strong> ${c.why}</p>
            ${c.alternatives ? `<p class="ac-constraint-alt"><strong>Alternative:</strong> ${c.alternatives}</p>` : ''}
            <div class="ac-constraint-actions">
              <button class="btn btn--primary btn--sm ac-c-accept" data-idx="${idx}" type="button" ${c.confirmed ? 'disabled' : ''}>${c.confirmed ? 'Accepted ✓' : 'Accept'}</button>
              <div class="ac-c-adjust ${c.adjusted ? '' : 'is-hidden'}">
                <input class="ac-c-adjust-input" type="text" value="${escapeHtml(c.value)}" data-idx="${idx}" placeholder="Adjust value...">
                <button class="btn btn--sm btn--outline ac-c-adjust-apply" data-idx="${idx}" type="button">Apply</button>
              </div>
              <button class="btn btn--ghost btn--sm ac-c-adjust-btn" data-idx="${idx}" type="button" ${c.confirmed ? 'disabled' : ''}>Adjust</button>
              <button class="btn btn--ghost btn--sm ac-c-skip" data-idx="${idx}" type="button">${c.skipped ? 'Skipped' : 'Skip'}</button>
            </div>
          </div>
        `).join('');

        // Constraint actions
        constraintListEl.addEventListener('click', (e) => {
          const idx = parseInt(e.target.dataset.idx, 10);
          if (isNaN(idx)) return;

          if (e.target.classList.contains('ac-c-accept')) {
            _constraints[idx].confirmed = true;
            _constraints[idx].skipped = false;
            save({ constraints: _constraints });
            renderPhase2();
          } else if (e.target.classList.contains('ac-c-skip')) {
            _constraints[idx].skipped = true;
            _constraints[idx].confirmed = false;
            save({ constraints: _constraints });
            renderPhase2();
          } else if (e.target.classList.contains('ac-c-adjust-btn')) {
            // Show adjust input
            const item = e.target.closest('.ac-constraint-item');
            const adjustRow = item.querySelector('.ac-c-adjust');
            adjustRow.classList.remove('is-hidden');
            adjustRow.querySelector('input').focus();
          } else if (e.target.classList.contains('ac-c-adjust-apply')) {
            const item = e.target.closest('.ac-constraint-item');
            const input = item.querySelector('.ac-c-adjust-input');
            _constraints[idx].value = input.value;
            _constraints[idx].adjusted = true;
            _constraints[idx].confirmed = true;
            save({ constraints: _constraints });
            renderPhase2();
          }
        });

        constraintListEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && e.target.classList.contains('ac-c-adjust-input')) {
            const idx = parseInt(e.target.dataset.idx, 10);
            _constraints[idx].value = e.target.value;
            _constraints[idx].adjusted = true;
            _constraints[idx].confirmed = true;
            save({ constraints: _constraints });
            renderPhase2();
          }
        });
      }

      // Confirm Phase 2 → Phase 3
      const confirmBtn = phase2Content.querySelector('.ac-confirm-phase2');
      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          save({ constraints: _constraints, selectedMaterial: _selectedMaterial, productType: _productType, processDecisions: _processDecisions });
          transitionToPhase(3);
        });
      }

      // Open full constraint library
      const libBtn = phase2Content.querySelector('.ac-open-library');
      if (libBtn) {
        libBtn.addEventListener('click', () => {
          const selectedIds = new Set(_constraints.filter(c => c.confirmed).map(c => c.id));
          const valueMap = {};
          _constraints.forEach(c => { if (c.value !== undefined) valueMap[c.id] = c.value; });

          const lib = createConstraintLibrary({
            selectedIds,
            constraintValues: valueMap,
            anchorContext: { designIntent: textarea.value, styleKeywords: kw.getKeywords() },
            onToggle: (constraint, isSelected) => {
              if (isSelected) { valueMap[constraint.id] = constraint._value ?? constraint.defaultValue ?? true; }
              else { delete valueMap[constraint.id]; }
            },
            onConfirm: (newSelected) => {
              const fullLib = getFullConstraintLibrary(store.getCustomConstraints());
              const aiResults = lib.getAIResults();
              newSelected.forEach(id => {
                const c = [...fullLib, ...aiResults].find(item => item.id === id);
                if (c && !_constraints.find(ec => ec.id === c.id)) {
                  _constraints.push({
                    id: c.id, category: c.category, label: c.label,
                    value: valueMap[id] ?? c.value ?? c.defaultValue ?? true,
                    source: c.source || 'library', confirmed: true
                  });
                }
              });
              save({ constraints: _constraints });
              closeModal();
              renderPhase2();
            }
          });
          openModal({ title: 'Constraint Library', content: lib.getElement(), onClose: () => { lib.destroy(); } });
        });
      }
    }

    // ---- Phase 3: Resolve Conflicts (Enhanced) ----
    var _analysisShown = false;

    function confidenceLabel(pct) {
      if (pct >= 90) return 'Very High';
      if (pct >= 75) return 'High';
      if (pct >= 50) return 'Moderate';
      return 'Low';
    }

    function renderPhase3() {
      if (!phase3Content) return;
      var dirId = _selectedDirection ? _selectedDirection.id : (card.designDirection ? card.designDirection.id : null);
      var matId = _selectedMaterial ? _selectedMaterial.id : (card.selectedMaterial ? card.selectedMaterial.id : null);
      if (!dirId || !matId) return;

      var conflicts = detectConflicts(dirId, matId);
      var confirmedCount = _constraints.filter(function(c) { return c.confirmed || c.skipped; }).length;

      // Count resolved (including rebuttals)
      var resolvedCount = _resolvedConflicts.filter(function(rc) {
        return conflicts.some(function(cf) { return cf.id === rc.conflictId; });
      }).length;

      // First entry: show AI analysis animation
      if (!_analysisShown && conflicts.length > 0) {
        _analysisShown = true;
        phase3Content.innerHTML = `
          <div class="ac-analysis">
            <div class="ac-analysis__inner">
              <div class="ac-analysis__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <p class="ac-analysis__title">Analyzing your design decisions...</p>
              <p class="ac-analysis__sub">Cross-referencing design language with material capabilities</p>
              <div class="ac-analysis__bar-track">
                <div class="ac-analysis__bar-fill"></div>
              </div>
              <div class="ac-analysis__steps">
                <span class="ac-analysis__step is-done">Mapping design keywords</span>
                <span class="ac-analysis__step ${conflicts.length > 0 ? 'is-done' : ''}">Checking material constraints</span>
                <span class="ac-analysis__step">Detecting conflicts</span>
              </div>
            </div>
          </div>
        `;
        setTimeout(function () {
          renderPhase3Content(conflicts, confirmedCount, resolvedCount);
        }, 3000);
        return;
      }

      renderPhase3Content(conflicts, confirmedCount, resolvedCount);
    }

    function renderPhase3Content(conflicts, confirmedCount, resolvedCount) {
      var rebuttals = {};
      _resolvedConflicts.forEach(function(rc) {
        if (rc.resolutionId === 'rebuttal') rebuttals[rc.conflictId] = rc.rebuttalText || '';
      });

      phase3Content.innerHTML = `
        ${conflicts.length === 0 ? `
          <div class="ac-no-conflicts">
            <div class="ac-no-conflicts__icon">✓</div>
            <h3>No major conflicts detected</h3>
            <p>Your design direction and material choice are compatible. You can proceed with confidence.</p>
          </div>
        ` : conflicts.map(function(cf, i) {
          var confidencePct = cf.confidence || 50;
          var cLabel = confidenceLabel(confidencePct);
          var resolved = _resolvedConflicts.find(function(rc) { return rc.conflictId === cf.id; });
          var isOverruled = resolved && resolved.resolutionId === 'rebuttal';
          var rebuttalText = rebuttals[cf.id] || '';
          return `
          <section class="ac-section">
            <div class="ac-conflict-card ${isOverruled ? 'is-overruled' : ''}">
              <span class="ac-conflict-num">Conflict ${i + 1} of ${conflicts.length}</span>
              <h3>${cf.title}</h3>
              <p>${cf.description}</p>

              <!-- Source explanation -->
              <div class="ac-conflict-source">
                <span class="ac-conflict-source__label">Why this conflict exists</span>
                <p>${cf.source}</p>
              </div>

              <!-- Confidence bar -->
              <div class="ac-confidence">
                <div class="ac-confidence__header">
                  <span class="ac-confidence__label">AI Confidence</span>
                  <span class="ac-confidence__pct">${confidencePct}% &mdash; ${cLabel}</span>
                </div>
                <div class="ac-confidence__bar">
                  <div class="ac-confidence__fill" style="width:${confidencePct}%"></div>
                </div>
              </div>

              <div class="ac-conflict-compare">
                <div class="ac-conflict-side ac-conflict-side--want">
                  <span class="ac-conflict-side__label">${cf.leftLabel}</span>
                  <div class="ac-conflict-side__icon">
                    <svg viewBox="0 0 80 60" width="80" height="60"><rect x="5" y="5" width="70" height="50" rx="20" fill="var(--color-primary-light)" stroke="var(--color-primary)" stroke-width="1.5" stroke-dasharray="4 2"/></svg>
                  </div>
                </div>
                <div class="ac-conflict-vs">⚠</div>
                <div class="ac-conflict-side ac-conflict-side--real">
                  <span class="ac-conflict-side__label">${cf.rightLabel}</span>
                  <div class="ac-conflict-side__icon">
                    <svg viewBox="0 0 80 60" width="80" height="60"><rect x="5" y="5" width="70" height="50" rx="20" fill="var(--color-neutral-100)" stroke="var(--color-neutral-500)" stroke-width="2"/><line x1="5" y1="30" x2="75" y2="30" stroke="var(--color-neutral-600)" stroke-width="1.5"/></svg>
                  </div>
                </div>
              </div>

              ${isOverruled ? `
                <!-- Overruled by user -->
                <div class="ac-rebuttal-resolved">
                  <span class="ac-rebuttal-resolved__check">✓</span>
                  <div>
                    <strong>Resolved — you overruled this conflict</strong>
                    ${rebuttalText ? '<p class="ac-rebuttal-resolved__reason">\"' + escapeHtml(rebuttalText) + '\"</p>' : ''}
                  </div>
                </div>
              ` : `
                <div class="ac-conflict-resolutions">
                  <p class="ac-conflict-resolutions__prompt">How do you want to handle this?</p>
                  ${cf.resolutions.map(function(r) {
                    var isSelected = resolved && resolved.resolutionId === r.id;
                    return `
                      <button class="ac-resolution-btn ${isSelected ? 'is-selected' : ''}" data-cf="${cf.id}" data-res="${r.id}" type="button">
                        <span class="ac-resolution-btn__label">${r.label}</span>
                        <span class="ac-resolution-btn__desc">${r.desc}</span>
                        ${isSelected ? '<span class="ac-resolution-btn__check">✓</span>' : ''}
                      </button>
                    `;
                  }).join('')}

                  <!-- Rebuttal area -->
                  <div class="ac-rebuttal">
                    <div class="ac-rebuttal__divider"><span>or</span></div>
                    <p class="ac-rebuttal__prompt">This conflict doesn't apply to my design:</p>
                    <textarea class="ac-rebuttal__textarea form-textarea" data-cf="${cf.id}" rows="2" placeholder="Explain why this conflict is not relevant to your specific design..."></textarea>
                    <button class="btn btn--outline btn--sm ac-rebuttal-submit" data-cf="${cf.id}" type="button">Submit Rebuttal</button>
                  </div>
                </div>
              `}
            </div>
          </section>
        `;}).join('')}

        <div class="ac-phase3-footer">
          <div class="ac-phase3-summary">
            <span>✓ ${confirmedCount} constraints reviewed</span>
            <span>⚠ ${conflicts.length} conflict${conflicts.length !== 1 ? 's' : ''} ${resolvedCount > 0 ? '(' + resolvedCount + ' resolved)' : ''}</span>
          </div>
          <button class="btn btn--primary ac-complete-anchor" type="button" ${resolvedCount < conflicts.length ? 'disabled' : ''}>
            ${resolvedCount >= conflicts.length ? 'Complete Anchor →' : 'Resolve all conflicts to continue'}
          </button>
        </div>
      `;

      // Resolution button clicks
      phase3Content.addEventListener('click', function(e) {
        var btn = e.target.closest('.ac-resolution-btn');
        if (btn) {
          var cfId = btn.dataset.cf;
          var resId = btn.dataset.res;
          _resolvedConflicts = _resolvedConflicts.filter(function(rc) { return rc.conflictId !== cfId; });
          _resolvedConflicts.push({ conflictId: cfId, resolutionId: resId });
          save({ resolvedConflicts: _resolvedConflicts });
          renderPhase3();
        }

        // Rebuttal submit (demo: auto-accept)
        var rebuttalBtn = e.target.closest('.ac-rebuttal-submit');
        if (rebuttalBtn) {
          var cfId2 = rebuttalBtn.dataset.cf;
          var textarea = phase3Content.querySelector('.ac-rebuttal__textarea[data-cf="' + cfId2 + '"]');
          var reason = textarea ? textarea.value.trim() : '';
          if (!reason) return; // require non-empty reason
          _resolvedConflicts = _resolvedConflicts.filter(function(rc) { return rc.conflictId !== cfId2; });
          _resolvedConflicts.push({ conflictId: cfId2, resolutionId: 'rebuttal', rebuttalText: reason });
          save({ resolvedConflicts: _resolvedConflicts });
          renderPhase3();
        }
      });

      // Complete anchor
      var completeBtn = phase3Content.querySelector('.ac-complete-anchor');
      if (completeBtn) {
        completeBtn.addEventListener('click', function() {
          save({
            resolvedConflicts: _resolvedConflicts,
            designDirection: _selectedDirection ? { id: _selectedDirection.id, name: _selectedDirection.name, reason: _selectedDirection.reason || _selectedDirection._reason } : card.designDirection,
            selectedMaterial: _selectedMaterial,
            productType: _productType,
            processDecisions: _processDecisions,
            constraints: _constraints
          });
          transitionToPhase(4);
        });
      }
    }

    // ---- Phase transitions ----
    function transitionToPhase(phase) {
      currentPhase = phase;
      container.querySelectorAll('.ac-phase').forEach(el => el.classList.add('is-hidden'));
      const target = container.querySelector(`.ac-phase[data-phase="${phase}"]`);
      if (target) target.classList.remove('is-hidden');

      // Update progress
      container.querySelectorAll('.ac-progress__step').forEach((step, i) => {
        step.classList.toggle('is-active', i + 1 === phase || (phase === 4 && i === 2));
        step.classList.toggle('is-done', i + 1 < phase || phase === 4);
      });
      container.querySelectorAll('.ac-progress__line').forEach((line, i) => {
        line.classList.toggle('is-done', i + 1 < phase || phase === 4);
      });

      // Scroll to top of card
      container.querySelector('.anchor-card').scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Render phase content
      if (phase === 2) renderPhase2();
      if (phase === 3) renderPhase3();
      if (phase === 4) renderCompletion();

      // Update sidebar
      if (window.__updateSidebar) window.__updateSidebar(phase);
    }

    // ---- Completion view ----
    // ---- Prompt Generator ----
    function generateDesignPrompt() {
      const dirRaw = _selectedDirection || card.designDirection;
      const mat = _selectedMaterial || card.selectedMaterial;
      const intent = textarea.value || card.designIntent || '';
      const keywords = kw.getKeywords ? kw.getKeywords() : (card.styleKeywords || []);
      const confirmedConstraints = _constraints.filter(c => c.confirmed);
      const productTypeLabel = _productType ? (PRODUCT_CATEGORIES.find(c => c.id === _productType)?.label || _productType) : '';

      // Look up full direction data (saved card only stores id/name/reason, not visualDesc/keywords)
      const dir = dirRaw ? (DESIGN_DIRECTIONS.find(d => d.id === dirRaw.id) || dirRaw) : null;

      // Look up full material data for visual descriptors
      const matData = mat ? MATERIALS_DB[mat.id] : null;
      const matVisualDesc = matData && MATERIAL_VISUAL_DESC[mat.id]
        ? MATERIAL_VISUAL_DESC[mat.id]
        : 'high-quality injection-molded thermoplastic';

      // Process decision visual descriptions — how each manufacturing choice is visible
      const processVisuals = [];
      if (_processDecisions) {
        Object.values(_processDecisions).forEach((optId) => {
          const desc = PROCESS_VISUAL_DESC[optId];
          if (desc) processVisuals.push(desc);
        });
      }

      // Constraints as visual details
      const constraintVisuals = confirmedConstraints.slice(0, 5).map(c => {
        return `${c.label.toLowerCase()} of ${c.value}`;
      });

      // Build comprehensive prompt sections
      const parts = [];

      // === 1. Core identity: what this is ===
      if (productTypeLabel && intent) {
        parts.push(`Professional industrial design concept rendering of a ${productTypeLabel.toLowerCase()} — ${intent.trim()}`);
      } else if (intent) {
        parts.push(`Professional industrial design concept rendering — ${intent.trim()}`);
      } else if (productTypeLabel) {
        parts.push(`Professional industrial design concept rendering of a ${productTypeLabel.toLowerCase()}`);
      } else {
        parts.push('Professional industrial design concept rendering');
      }

      // === 2. Design language ===
      if (dir) {
        const dirKeywords = (dir.keywords || []).slice(0, 4).join(' and ');
        parts.push(`Design language: ${dir.name} — ${dir.visualDesc || ''}, expressing ${dirKeywords} aesthetics throughout the form`);
      }
      if (keywords.length > 0) {
        const kwStr = keywords.slice(0, 10).join(', ');
        parts.push(`Styling cues and visual atmosphere: ${kwStr}`);
      }

      // === 3. CMF — detailed material and manufacturing description ===
      const cmfParts = [`The product housing is constructed from ${matVisualDesc}`];
      if (processVisuals.length > 0) {
        cmfParts.push(`Manufacturing details: ${processVisuals.join('. ')}`);
      }
      if (constraintVisuals.length > 0) {
        cmfParts.push(`The design respects these manufacturing constraints which are visibly evident: ${constraintVisuals.join('; ')}`);
      }
      parts.push(cmfParts.join('. '));

      // === 4. Rendering specification ===
      parts.push(
        'Rendered as a professional product photograph: 85mm tilt-shift lens, f/8 aperture for full product sharpness, ' +
        'three-point studio strobe lighting with large softbox key light from top-left creating gentle shadow definition, ' +
        'subtle white fill card from right, rim light separating product from background, ' +
        'shot on seamless white infinity cove cyclorama background, ' +
        'hero 3/4 perspective angle slightly above eye level, ' +
        '8k resolution, industrial design portfolio photography, high-end product catalog quality'
      );

      return parts.join('. ');
    }

    function renderCompletion() {
      const dir = _selectedDirection || card.designDirection;
      const mat = _selectedMaterial || card.selectedMaterial;
      const summaryEl = container.querySelector('.ac-complete__summary');
      if (summaryEl) {
        const confirmedConstraints = _constraints.filter(c => c.confirmed);
        summaryEl.innerHTML = `
          <div class="ac-summary-grid">
            <div class="ac-summary-item"><strong>Design Direction:</strong> ${dir ? dir.name : '—'}</div>
            <div class="ac-summary-item"><strong>Material:</strong> ${mat ? mat.name : '—'}</div>
            <div class="ac-summary-item"><strong>Constraints:</strong> ${confirmedConstraints.length} confirmed</div>
            <div class="ac-summary-item"><strong>Conflicts Resolved:</strong> ${_resolvedConflicts.length}</div>
          </div>
          <div class="ac-summary-reason">
            <strong>Why this direction:</strong>
            <p>${dir ? escapeHtml(dir.reason || dir._reason || '') : ''}</p>
          </div>
        `;
      }

      // Edit button
      const editBtn = container.querySelector('.ac-edit-anchor');
      if (editBtn) {
        editBtn.addEventListener('click', () => { transitionToPhase(1); });
      }

      // ---- Prompt & Image Generation (ModelScope Z-Image-Turbo) ----
      console.log('[renderCompletion] looking for elements...');
      const promptTextarea = container.querySelector('.ac-prompt__textarea');
      const generateBtn = container.querySelector('.ac-generate-btn');
      const regenerateBtn = container.querySelector('.ac-regenerate-btn');
      const seedEl = container.querySelector('.ac-seed-value');
      const imageResult = container.querySelector('.ac-image-result');
      const loadingEl = container.querySelector('.ac-image-result__loading');
      const errorEl = container.querySelector('.ac-image-result__error');
      const resultImg = container.querySelector('.ac-image-result__img');

      console.log('[renderCompletion] promptTextarea:', !!promptTextarea, 'generateBtn:', !!generateBtn);

      if (!promptTextarea || !generateBtn) {
        console.error('[renderCompletion] Missing elements — aborting prompt/image setup');
        return;
      }

      // Populate initial prompt
      console.log('[renderCompletion] generating prompt...');
      var initialPrompt;
      try {
        initialPrompt = generateDesignPrompt();
        console.log('[renderCompletion] prompt generated, length:', initialPrompt.length);
      } catch (e) {
        console.error('[renderCompletion] generateDesignPrompt error:', e);
        initialPrompt = '';
      }
      promptTextarea.value = initialPrompt;

      // API config
      var API_TOKEN = store.getApiToken() || 'ms-20923d1f-20bf-4dd3-a9c3-969f860b7b9b';
      var API_BASE = 'http://localhost:3099/api';
      var MODEL_NAME = 'Tongyi-MAI/Z-Image-Turbo';

      // Token input
      var tokenInput = container.querySelector('#ac-api-token');
      var tokenSaveBtn = container.querySelector('.ac-api-save');
      if (tokenInput) {
        tokenInput.value = API_TOKEN;
        tokenSaveBtn.addEventListener('click', function () {
          var newToken = tokenInput.value.trim();
          if (newToken) {
            API_TOKEN = newToken;
            store.setApiToken(newToken);
            tokenSaveBtn.textContent = 'Saved!';
            setTimeout(function () { tokenSaveBtn.textContent = 'Save'; }, 1500);
          }
        });
      }

      // Seed is not directly supported, use random seed for regenerate
      var currentSeed = Math.floor(Math.random() * 99999) + 1;
      seedEl.textContent = currentSeed;

      function showLoading() {
        imageResult.classList.remove('is-hidden');
        loadingEl.classList.remove('is-hidden');
        errorEl.classList.add('is-hidden');
        resultImg.style.display = 'none';
        generateBtn.disabled = true;
        regenerateBtn.disabled = true;
        // Update loading text to show status
        loadingEl.querySelector('span').textContent = 'Generating... this may take 30-120 seconds';
      }

      function showImage() {
        loadingEl.classList.add('is-hidden');
        errorEl.classList.add('is-hidden');
        resultImg.style.display = 'block';
        generateBtn.disabled = false;
        regenerateBtn.disabled = false;
      }

      function showError(msg) {
        loadingEl.classList.add('is-hidden');
        errorEl.classList.remove('is-hidden');
        errorEl.innerHTML = '<span>' + escapeHtml(msg) + '</span> <button class="btn btn--sm btn--outline ac-retry-btn" type="button">Retry</button>';
        resultImg.style.display = 'none';
        generateBtn.disabled = false;
        regenerateBtn.disabled = false;
        var retryBtn = errorEl.querySelector('.ac-retry-btn');
        if (retryBtn) retryBtn.addEventListener('click', function () { generateImage(); });
      }

      var pollingTimer = null;

      function generateImage() {
        console.log('[generateImage] clicked!');
        var prompt = promptTextarea.value.trim();
        console.log('[generateImage] prompt length:', prompt.length);
        if (!prompt) {
          showError('Please enter a prompt first.');
          return;
        }

        showLoading();
        seedEl.textContent = currentSeed;
        console.log('[generateImage] submitting to API...');

        // Clean up previous polling
        if (pollingTimer) { clearTimeout(pollingTimer); pollingTimer = null; }

        // Step 1: Submit to ModelScope
        fetch(API_BASE + '/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + API_TOKEN,
            'Content-Type': 'application/json',
            'X-ModelScope-Async-Mode': 'true'
          },
          body: JSON.stringify({
            model: MODEL_NAME,
            prompt: prompt,
            size: '1024x1024',
            num_inference_steps: 20,
            guidance_scale: 3.5,
            seed: currentSeed
          })
        })
        .then(function (resp) {
          if (!resp.ok) {
            return resp.text().then(function (text) {
              throw new Error('API error (' + resp.status + '): ' + (text || resp.statusText));
            });
          }
          return resp.json();
        })
        .then(function (data) {
          console.log('[generateImage] submit response:', JSON.stringify(data).slice(0, 300));
          var taskId = data.task_id;
          if (!taskId) {
            throw new Error('No task ID returned from API. Response: ' + JSON.stringify(data));
          }
          // Step 2: Poll for result
          pollTask(taskId);
        })
        .catch(function (err) {
          console.error('ModelScope API error:', err);
          if (err.message.indexOf('401') !== -1) {
            showError('API token invalid or expired. Please update your ModelScope token.');
          } else if (err.message.indexOf('429') !== -1) {
            showError('Too many requests. Please wait a moment and try again.');
          } else {
            showError('Generation failed: ' + err.message);
          }
        });
      }

      function pollTask(taskId) {
        var attempts = 0;
        var maxAttempts = 60; // ~5 minutes max

        function check() {
          if (attempts >= maxAttempts) {
            showError('Image generation timed out. Please try again.');
            return;
          }
          attempts++;

          fetch(API_BASE + '/tasks/' + taskId, {
            headers: {
              'Authorization': 'Bearer ' + API_TOKEN,
              'X-ModelScope-Task-Type': 'image_generation'
            }
          })
          .then(function (resp) {
            if (!resp.ok) throw new Error('Status check failed (' + resp.status + ')');
            return resp.json();
          })
          .then(function (data) {
            console.log('[pollTask] attempt', attempts, 'status:', data.task_status, 'full:', JSON.stringify(data).slice(0, 500));
            if (data.task_status === 'SUCCESS' || data.task_status === 'SUCCEED') {
              var images = data.output && data.output.images;
              var imageUrl = images && images[0];
              if (imageUrl) {
                // Image URL may be base64 data URI or URL
                resultImg.src = imageUrl;
                resultImg.style.display = 'block';
                showImage();
              } else {
                showError('Generation completed but no image returned.');
              }
              return;
            }

            if (data.task_status === 'FAILED') {
              showError('Image generation failed on the server. Try adjusting your prompt.');
              return;
            }

            // Still PENDING or RUNNING — update loading text and poll again
            loadingEl.querySelector('span').textContent = 'Generating... (' + data.task_status.toLowerCase() + ', attempt ' + attempts + ')';
            pollingTimer = setTimeout(check, 5000);
          })
          .catch(function (err) {
            console.error('Poll error:', err);
            showError('Error checking generation status: ' + err.message);
          });
        }

        check();
      }

      generateBtn.addEventListener('click', generateImage);
      console.log('[renderCompletion] generate button listener attached');

      regenerateBtn.addEventListener('click', function () {
        currentSeed = Math.floor(Math.random() * 99999) + 1;
        seedEl.textContent = currentSeed;
        generateImage();
      });
      console.log('[renderCompletion] all listeners attached, setup complete');
    }

    // ---- Init ----
    if (currentPhase >= 2) renderPhase2();
    if (currentPhase >= 3) renderPhase3();
    if (currentPhase >= 4) renderCompletion();

    return {
      destroy() { _destroyFns.forEach(fn => fn()); _destroyFns = []; },
      hasUnsavedChanges() { return false; }
    };
  }

  /* ===================================================================
     SVG Process Diagrams (simple inline SVGs)
     =================================================================== */

  function getProcessDiagram(decisionId, optionId) {
    const diagrams = {
      parting_hide: '<rect x="5" y="5" width="50" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="27" x2="55" y2="27" stroke="var(--color-primary)" stroke-width="1.5" stroke-dasharray="3 1"/><text x="30" y="22" text-anchor="middle" font-size="4" fill="var(--color-neutral-600)">visible</text>',
      parting_feature: '<rect x="5" y="5" width="50" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="18" x2="55" y2="18" stroke="var(--color-primary)" stroke-width="2"/><text x="30" y="28" text-anchor="middle" font-size="4" fill="var(--color-neutral-600)">accent</text>',
      parting_visible: '<rect x="5" y="5" width="50" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="22" x2="55" y2="22" stroke="var(--color-neutral-500)" stroke-width="1"/><text x="30" y="28" text-anchor="middle" font-size="4" fill="var(--color-neutral-400)">accept</text>',
      gate_hidden: '<rect x="5" y="5" width="50" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="30" cy="33" r="2" fill="var(--color-primary)"/><text x="30" y="22" text-anchor="middle" font-size="4" fill="var(--color-neutral-600)">gate</text>',
      gate_visible: '<rect x="5" y="5" width="50" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="30" cy="8" r="2.5" fill="var(--color-primary)"/><text x="30" y="28" text-anchor="middle" font-size="4" fill="var(--color-neutral-600)">gate</text>'
    };
    return diagrams[optionId] || '';
  }

  /* ===================================================================
     components/navbar.js
     =================================================================== */

  function initNavbar(container, { onProjectClick = null } = {}) {
    const steps = [
      { hash: '#/anchor', label: 'Anchor', available: true },
      { hash: '#/compare', label: 'Compare', available: false },
      { hash: '#/reflect', label: 'Reflection', available: false }
    ];

    const project = store.getActiveProject();

    container.innerHTML =
      `<div class="navbar__inner">
         <div class="navbar__brand-group">
           <a class="navbar__brand" href="#/anchor">AIDeBias Toolkit</a>
           <span class="navbar__subtitle">Design with AI, not by AI.</span>
         </div>
         <div class="navbar__stepper">
           ${steps.map(s =>
             `<a class="navbar__step ${s.available ? 'navbar__step--active' : 'navbar__step--disabled'}" href="${s.available ? s.hash : '#'}" data-step="${s.label}" ${!s.available ? 'data-tooltip="Coming soon"' : ''}>${s.label}</a>`
           ).join('')}
         </div>
         <div class="navbar__actions">
           <button class="navbar__project-btn" type="button" title="Manage Projects">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
             <span class="navbar__project-name">${escapeHtml(project.name)}</span>
             <svg class="navbar__project-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
           </button>
           <button class="navbar__settings" type="button" aria-label="Settings" title="Settings">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
           </button>
         </div>
       </div>`;

    const projectBtn = container.querySelector('.navbar__project-btn');
    projectBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (onProjectClick) onProjectClick();
    });

    const settingsBtn = container.querySelector('.navbar__settings');
    settingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openSettingsModal();
    });

    container.addEventListener('click', (e) => {
      const step = e.target.closest('.navbar__step--disabled');
      if (step) {
        e.preventDefault();
        const existing = container.querySelector('.navbar__tooltip');
        if (existing) existing.remove();
        const tip = document.createElement('span');
        tip.className = 'navbar__tooltip';
        tip.textContent = 'Coming soon';
        step.appendChild(tip);
        setTimeout(() => tip.remove(), 2000);
      }
    });

    return {
      updateActiveStep(hash) {
        container.querySelectorAll('.navbar__step').forEach(el => {
          var label = el.dataset.step;
          var step = steps.find(function(s) { return s.label === label; });
          if (step && step.hash === hash) { el.classList.add('navbar__step--active'); el.classList.remove('navbar__step--disabled'); }
          else if (step && !step.available) { el.classList.remove('navbar__step--active'); el.classList.add('navbar__step--disabled'); }
          else { el.classList.remove('navbar__step--active', 'navbar__step--disabled'); }
        });
      },
      updateProjectName(name) {
        const nameEl = container.querySelector('.navbar__project-name');
        if (nameEl) nameEl.textContent = name;
      },
      destroy() { container.innerHTML = ''; }
    };
  }

  /* ===================================================================
     router.js
     =================================================================== */

  class Router {
    constructor(routes, container, { onBeforeChange = null } = {}) {
      this._routes = routes;
      this._container = container;
      this._onBeforeChange = onBeforeChange;
      this._currentDestroy = null;
      this._boundOnHashChange = this._onHashChange.bind(this);
    }

    start() {
      window.addEventListener('hashchange', this._boundOnHashChange);
      if (!window.location.hash) { window.location.hash = '#/anchor'; }
      else { this._handleRoute(window.location.hash); }
    }

    stop() { window.removeEventListener('hashchange', this._boundOnHashChange); this._cleanup(); }
    navigate(hash) { window.location.hash = hash; }

    _onHashChange() { this._handleRoute(window.location.hash); }

    _handleRoute(hash) {
      const rawHash = hash || '#/anchor';
      let handler = this._routes[rawHash];
      let routeKey = rawHash;
      if (!handler) {
        const qIdx = rawHash.indexOf('?');
        const base = qIdx > 0 ? rawHash.substring(0, qIdx) : rawHash;
        handler = this._routes[base];
        routeKey = base;
      }
      if (!handler) { this.navigate('#/anchor'); return; }
      if (this._onBeforeChange) this._onBeforeChange(routeKey);
      this._cleanup();
      const result = handler(this._container);
      if (result && typeof result.destroy === 'function') this._currentDestroy = result.destroy;
    }

    _cleanup() {
      if (this._currentDestroy) { try { this._currentDestroy(); } catch (e) { console.error(e); } this._currentDestroy = null; }
      this._container.innerHTML = '';
    }
  }

  /* ===================================================================
     app.js (Entry Point)
     =================================================================== */

  function boot() {
    store.getActiveProject();

    const navbarEl = $('#navbar');
    const navbar = initNavbar(navbarEl, {
      onProjectClick: openProjectManagerModal
    });

    store.on('project:switched', (project) => {
      navbar.updateProjectName(project.name);
    });

    // ---- Sidebar ----
    var sidebarEl = document.getElementById('sidebar');
    var sidebarBtns = sidebarEl ? sidebarEl.querySelectorAll('.sidebar__btn[data-phase]') : [];
    var sidebarSettings = sidebarEl ? sidebarEl.querySelector('.sidebar__settings') : null;
    var _sidebarPhase = 1;

    function updateSidebar(phase) {
      _sidebarPhase = phase || 1;
      sidebarBtns.forEach(function(btn) {
        var p = parseInt(btn.dataset.phase, 10);
        btn.classList.remove('is-active', 'is-done');
        if (p === _sidebarPhase) btn.classList.add('is-active');
        else if (p < _sidebarPhase) btn.classList.add('is-done');
      });
    }

    // Sidebar phase button clicks — scroll to phase in anchor card
    sidebarBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var targetPhase = parseInt(btn.dataset.phase, 10);
        // Only navigate to reached or current phases
        if (targetPhase <= _sidebarPhase) {
          // Dispatch custom event for anchor card to handle
          var evt = new CustomEvent('sidebar:navigate', { detail: { phase: targetPhase } });
          document.dispatchEvent(evt);
        }
      });
    });

    // Settings button
    if (sidebarSettings) {
      sidebarSettings.addEventListener('click', function() {
        // Trigger the navbar settings click
        var navbarSettingsBtn = document.querySelector('.navbar__settings');
        if (navbarSettingsBtn) navbarSettingsBtn.click();
      });
    }

    // Expose for anchor card
    window.__updateSidebar = updateSidebar;

    function placeholderPage(label) {
      return (container) => {
        container.innerHTML =
          `<div class="placeholder-page">
             <div class="placeholder-page__icon">
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
             </div>
             <h2 class="placeholder-page__title">${label}</h2>
             <p class="placeholder-page__desc">Under development</p>
           </div>`;
        return { destroy() {} };
      };
    }

    const router = new Router(
      {
        '#/anchor': initAnchorPage,
        '#/compare': placeholderPage('Design Comparison'),
        '#/reflect': placeholderPage('Reflection Journal')
      },
      $('#app-main'),
      { onBeforeChange(hash) { navbar.updateActiveStep(hash); } }
    );

    router.start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
