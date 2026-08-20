/**
 * 约束库种子数据
 *
 * 三大类：结构约束、工艺约束、人机约束
 * inputType: "checkbox" | "text" | "select"
 * 用户自定义的约束运行时追加到 custom 分类下
 */

export const DEFAULT_CONSTRAINTS = [

  // ============================
  // 结构约束 structure
  // ============================
  {
    id: 'const_s001',
    category: 'structure',
    subcategory: '尺寸与外形',
    label: '最大外形尺寸',
    description: '产品的长、宽、高最大尺寸限制（mm），受使用场景或收纳空间约束',
    inputType: 'text',
    options: null,
    defaultValue: ''
  },
  {
    id: 'const_s002',
    category: 'structure',
    subcategory: '尺寸与外形',
    label: '壁厚范围',
    description: '壳体壁厚建议范围（mm），过薄影响强度，过厚导致缩水',
    inputType: 'text',
    options: null,
    defaultValue: ''
  },
  {
    id: 'const_s003',
    category: 'structure',
    subcategory: '模具结构',
    label: '分模线位置',
    description: '上下壳分模位置说明，影响外观面完整性和模具成本',
    inputType: 'text',
    options: null,
    defaultValue: ''
  },
  {
    id: 'const_s004',
    category: 'structure',
    subcategory: '模具结构',
    label: '卡扣/螺丝柱',
    description: '需预留卡扣或螺丝柱结构，用于壳体装配固定',
    inputType: 'checkbox',
    options: null,
    defaultValue: false
  },
  {
    id: 'const_s005',
    category: 'structure',
    subcategory: '内部结构',
    label: '内部腔体预留',
    description: '需为电池、PCB、电机等内部元件预留安装空间',
    inputType: 'checkbox',
    options: null,
    defaultValue: false
  },
  {
    id: 'const_s006',
    category: 'structure',
    subcategory: '防水防尘',
    label: '防水防尘等级',
    description: 'IP防护等级要求（如IPX4防溅水、IP67防浸水），影响密封结构设计',
    inputType: 'select',
    options: ['无要求', 'IPX4（防溅）', 'IPX5（防喷）', 'IPX7（防浸）', 'IP54（防尘防溅）', 'IP67（防尘防浸）'],
    defaultValue: '无要求'
  },

  // ============================
  // 工艺约束 process
  // ============================
  {
    id: 'const_p001',
    category: 'process',
    subcategory: '成型工艺',
    label: '注塑成型',
    description: '采用注塑成型工艺，需考虑脱模、流道、浇口设计',
    inputType: 'checkbox',
    options: null,
    defaultValue: false
  },
  {
    id: 'const_p002',
    category: 'process',
    subcategory: '成型工艺',
    label: '脱模斜度',
    description: '模具脱模所需的最小拔模角度',
    inputType: 'select',
    options: ['0.5°', '1°', '1.5°', '2°', '3°'],
    defaultValue: '1°'
  },
  {
    id: 'const_p003',
    category: 'process',
    subcategory: '表面处理',
    label: '表面处理',
    description: '产品外观表面处理工艺选择',
    inputType: 'select',
    options: ['磨砂', '高光', '橡胶漆', 'IMD模内装饰', '喷涂', '咬花/蚀纹'],
    defaultValue: '磨砂'
  },
  {
    id: 'const_p004',
    category: 'process',
    subcategory: '材料',
    label: '主体材料',
    description: '产品主体用料选择，影响强度、手感、成本',
    inputType: 'select',
    options: ['ABS', 'PC', 'PP', 'PA（尼龙）', 'PC+ABS', 'PMMA（亚克力）', '硅胶'],
    defaultValue: 'ABS'
  },
  {
    id: 'const_p005',
    category: 'process',
    subcategory: '二次加工',
    label: '二次加工需求',
    description: '是否需要丝印、镭雕、电镀等后处理工序',
    inputType: 'checkbox',
    options: null,
    defaultValue: false
  },

  // ============================
  // 人机约束 ergonomics
  // ============================
  {
    id: 'const_e001',
    category: 'ergonomics',
    subcategory: '握持与操作',
    label: '握持舒适度',
    description: '手持产品的握感要求，需考虑掌心贴合度和长时间握持的疲劳度',
    inputType: 'checkbox',
    options: null,
    defaultValue: false
  },
  {
    id: 'const_e002',
    category: 'ergonomics',
    subcategory: '握持与操作',
    label: '单手操作',
    description: '要求产品可单手完成主要操作动作',
    inputType: 'checkbox',
    options: null,
    defaultValue: false
  },
  {
    id: 'const_e003',
    category: 'ergonomics',
    subcategory: '握持与操作',
    label: '按钮触觉反馈',
    description: '按钮按压需提供清晰的触觉确认（段落感/咔哒声）',
    inputType: 'checkbox',
    options: null,
    defaultValue: false
  },
  {
    id: 'const_e004',
    category: 'ergonomics',
    subcategory: '安全与舒适',
    label: '防滑设计',
    description: '接触面需具备防滑纹理或材质，降低滑落风险',
    inputType: 'checkbox',
    options: null,
    defaultValue: false
  },
  {
    id: 'const_e005',
    category: 'ergonomics',
    subcategory: '安全与舒适',
    label: '边角圆滑处理',
    description: '所有外露边角需倒圆角处理，R角 ≥ 0.5mm，避免锐边伤人',
    inputType: 'checkbox',
    options: null,
    defaultValue: false
  },
  {
    id: 'const_e006',
    category: 'ergonomics',
    subcategory: '安全与舒适',
    label: '重量上限',
    description: '产品总重量上限（g），手持设备通常建议 < 500g',
    inputType: 'text',
    options: null,
    defaultValue: ''
  }
];

/**
 * 获取约束库（合并用户自定义约束）
 */
export function getFullConstraintLibrary(customConstraints = []) {
  const builtIn = DEFAULT_CONSTRAINTS.map(c => ({
    ...c,
    isCustom: false
  }));
  const custom = customConstraints.map(c => ({
    ...c,
    category: 'custom',
    isCustom: true
  }));
  return [...builtIn, ...custom];
}

/**
 * 按分类整理约束
 */
export function groupConstraints(constraints) {
  const groups = {
    structure: { label: '结构约束', icon: '🏗️', items: [] },
    process: { label: '工艺约束', icon: '⚙️', items: [] },
    ergonomics: { label: '人机约束', icon: '✋', items: [] },
    custom: { label: '自定义', icon: '📝', items: [] }
  };
  for (const c of constraints) {
    if (groups[c.category]) {
      groups[c.category].items.push(c);
    }
  }
  return groups;
}
