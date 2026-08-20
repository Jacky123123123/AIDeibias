/**
 * localStorage 数据层 + 简易 Pub/Sub
 *
 * 键命名规则：ae:<entity>
 * 所有读写都经由此模块，其他地方不直接操作 localStorage。
 */

import { generateId } from './utils.js';

const PREFIX = 'ae:';
const KEYS = {
  settings: 'ae:settings',
  projects: 'ae:projects'
};

function anchorKey(projectId) {
  return `ae:project:${projectId}:anchor`;
}

class Store {
  constructor() {
    this._listeners = {};
  }

  // ==================== 底层读写 ====================

  _get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  _set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('localStorage write failed:', e);
      this._emit('storage:error', { key, error: e });
    }
  }

  _remove(key) {
    localStorage.removeItem(key);
  }

  // ==================== Pub/Sub ====================

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

  // ==================== 设置 ====================

  getSettings() {
    let s = this._get(KEYS.settings);
    if (!s) {
      s = { activeProjectId: null, lastVisitedRoute: '#/anchor', version: 1 };
      this._set(KEYS.settings, s);
    }
    return s;
  }

  saveSettings(partial) {
    const s = { ...this.getSettings(), ...partial };
    this._set(KEYS.settings, s);
    this._emit('settings:updated', s);
  }

  // ==================== 项目 ====================

  getProjects() {
    return this._get(KEYS.projects) || [];
  }

  getActiveProject() {
    let projects = this.getProjects();
    let settings = this.getSettings();

    if (settings.activeProjectId) {
      const found = projects.find(p => p.id === settings.activeProjectId);
      if (found) return found;
    }

    // 无有效活跃项目 → 创建默认项目
    if (projects.length === 0) {
      const project = {
        id: generateId('proj'),
        name: '默认项目',
        status: 'anchoring',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      projects = [project];
      this._set(KEYS.projects, projects);
      this.saveSettings({ activeProjectId: project.id });
      return project;
    }

    // 回退到第一个项目
    this.saveSettings({ activeProjectId: projects[0].id });
    return projects[0];
  }

  saveProject(project) {
    const projects = this.getProjects();
    const idx = projects.findIndex(p => p.id === project.id);
    const now = new Date().toISOString();
    const updated = { ...project, updatedAt: now };

    if (idx >= 0) {
      projects[idx] = updated;
    } else {
      updated.createdAt = now;
      projects.push(updated);
    }
    this._set(KEYS.projects, projects);
    this._emit('projects:updated', projects);
    return updated;
  }

  // ==================== 锚定卡 ====================

  getAnchorCard(projectId) {
    const key = anchorKey(projectId);
    const card = this._get(key);
    if (!card) {
      return {
        projectId,
        styleKeywords: [],
        designIntent: '',
        referenceImages: [],
        constraints: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    return card;
  }

  saveAnchorCard(projectId, partial) {
    const key = anchorKey(projectId);
    const existing = this.getAnchorCard(projectId);
    const merged = {
      ...existing,
      ...partial,
      projectId,
      updatedAt: new Date().toISOString()
    };
    this._set(key, merged);
    this._emit('anchor:updated', merged);
    return merged;
  }

  // ==================== 自定义约束（存储层面，仅锚定卡使用） ====================

  getCustomConstraints() {
    return this._get('ae:custom_constraints') || [];
  }

  addCustomConstraint(constraint) {
    const list = this.getCustomConstraints();
    list.push(constraint);
    this._set('ae:custom_constraints', list);
    this._emit('custom_constraints:updated', list);
    return list;
  }

  removeCustomConstraint(id) {
    const list = this.getCustomConstraints().filter(c => c.id !== id);
    this._set('ae:custom_constraints', list);
    this._emit('custom_constraints:updated', list);
    return list;
  }
}

export const store = new Store();
