# AIDeBias Toolkit — Design System & Style Guide

> 本文档精确描述当前网页（index.html + css/main.css + js/bundle.js）的视觉设计系统，用于生成**相同风格、不同内容**的新页面。所有值均取自现有 CSS 设计令牌，可直接复用。

---

## 1. 品牌与气质

- **产品名**：AIDeBias Toolkit
- **标语**：Design with AI, not by AI.
- **定位**：面向初级工业设计师的"思考辅助工具"，不是效率工具
- **设计基调**：现代、专业、克制、通透，带一点温暖与鼓励感
- **视觉关键词**：玻璃质感（glassmorphism）、薰衣草灰、靛蓝、大圆角、柔和阴影、大量留白、细腻微交互
- **参考风格**：Dribbble / Pinterest 上的现代 SaaS 工具与设计工具界面

---

## 2. 配色系统（Design Tokens）

### 品牌色（靛蓝）
| Token | 值 | 用途 |
|-------|-----|------|
| `--color-primary` | `#4F46E5` | 主色：按钮、链接、激活态、logo |
| `--color-primary-hover` | `#4338CA` | 主色悬停 |
| `--color-primary-active` | `#3730A3` | 主色按下 |
| `--color-primary-light` | `#EEF2FF` | 极浅靛蓝：焦点环、选中光环 |
| `--color-primary-muted` | `#C7D2FE` | 浅靛蓝：边框、装饰 |
| `--color-primary-subtle` | `#F0F2FF` | 极浅底：选中卡片背景、banner |

### 中性色（薰衣草灰调）
| Token | 值 | 用途 |
|-------|-----|------|
| `--color-neutral-50` | `#F0EFF5` | 页面底色 |
| `--color-neutral-100` | `#E8E6F0` | 浅底：分段控件底、hover |
| `--color-neutral-200` | `#DDDAE5` | 边框、分隔线、禁用态 |
| `--color-neutral-300` | `#C5C1D2` | 更深的边框 |
| `--color-neutral-400` | `#A3A3A3` | 次要文字、placeholder |
| `--color-neutral-500` | `#737373` | 说明文字 |
| `--color-neutral-600` | `#525252` | 正文次要 |
| `--color-neutral-700` | `#404040` | 正文 |
| `--color-neutral-800` | `#262626` | 标题、强调 |
| `--color-neutral-900` | `#171717` | 最大标题 |

### 语义色
| Token | 值 | 用途 |
|-------|-----|------|
| `--color-white` | `#FFFFFF` | 卡片、按钮文字 |
| `--color-error` | `#DC2626` | 错误 |
| `--color-error-bg` | `#FEF2F2` | 错误背景 |
| `--color-success` | `#16A34A` | 成功、已完成 |
| `--color-success-bg` | `#F0FDF4` | 成功背景 |
| `--color-warning` | `#F59E0B` | 警告、冲突、置信度 |

### 背景渐变（页面底色）
```
background: linear-gradient(180deg, #F4F3F8 0%, #EFEEF4 30%, #F0EFF5 100%);
```
从上到下的极浅薰衣草渐变，不是纯平色。

---

## 3. 字体排版

- **字体族**：`'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif`
- **字重档**：400（normal）/ 500（medium）/ 600（semibold）/ 700（bold）/ 800（用于品牌名、大标题）

### 字号阶梯
| Token | 值 | 用途 |
|-------|-----|------|
| `xs` | 12px | 标签、辅助、徽章 |
| `sm` | 14px | 正文、按钮、提示 |
| `base` | 16px | 默认正文 |
| `lg` | 18px | 区域标题 |
| `xl` | 20px | banner 标题 |
| `2xl` | 24px | 页面标题、阶段标题 |
| `3xl` | 30px | splash 标题 |

### 行高
- `tight: 1.25`（标题）
- `normal: 1.5`（正文）
- `relaxed: 1.75`（长文本、说明）

### 标题风格
- 大标题用 **700–800 字重 + 负字距**（`letter-spacing: -0.03em`）
- 标题颜色用 `neutral-900`，正文用 `neutral-600~800`

---

## 4. 间距（4px 网格）

| Token | 值 |
|-------|-----|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 32px |
| `2xl` | 48px |
| `3xl` | 64px |

- 卡片内边距通常 `lg`（24px）或 `xl`（32px）
- 区块之间间距 `xl`（32px），营造呼吸感

---

## 5. 圆角

| Token | 值 | 用途 |
|-------|-----|------|
| `sm` | 6px | 小元素、标签 |
| `md` | 10px | 按钮、小卡片、导航标签 |
| `lg` | 16px | 输入框、卡片 |
| `xl` | 20px | 主卡片、大区块 |
| `full` | 9999px | 胶囊按钮、圆形 |

**原则**：大圆角是核心特征，卡片用 `xl`（20px），按钮用 `full`（胶囊形）。

---

## 6. 阴影（玻璃悬浮感）

| Token | 值 | 用途 |
|-------|-----|------|
| `sm` | `0 1px 3px rgba(0,0,0,0.04)` | 轻微分层 |
| `md` | `0 4px 20px -2px rgba(0,0,0,0.05)` | 卡片默认 |
| `lg` | `0 8px 30px -4px rgba(0,0,0,0.06), 0 2px 8px -2px rgba(0,0,0,0.03)` | 主卡片 |
| `xl` | `0 16px 40px -8px rgba(0,0,0,0.08), 0 4px 12px -4px rgba(0,0,0,0.04)` | 弹窗、浮层 |

**特点**：阴影极淡、扩散大、几乎只靠阴影分层，不靠边框。

---

## 7. 过渡与动画

| Token | 值 | 用途 |
|-------|-----|------|
| `fast` | 150ms ease | 颜色、边框等微反馈 |
| `normal` | 250ms ease | 常规过渡 |
| `slow` | 350ms ease | 展开、折叠 |

**常用微交互**：
- 按钮 hover：`translateY(-1px ~ -2px)` + 阴影加深
- 卡片 hover：`translateY(-3px)` + 阴影从 `md` 升到 `lg`
- 选中态：`0 0 0 2px` 光环 + 阴影
- 激活进度点：呼吸脉冲动画（`box-shadow` 光环 2.5s 循环）
- 提示文字切换：`opacity` 淡入淡出（120ms）

---

## 8. 组件规范

### 8.1 按钮（.btn）

| 变体 | 样式 |
|------|------|
| **基础** | 胶囊形（`radius-full`），`semibold`，`padding: sm + xl`，`border: 1.5px solid transparent` |
| **primary** | 靛蓝底 + 白字 + 品牌色阴影 `0 4px 14px rgba(79,70,229,0.25)` |
| **primary:hover** | 变深 + 上浮 1px + 阴影加深 |
| **outline** | 白底 + 靛蓝字 + 浅靛蓝边框 |
| **ghost** | 透明底 + 灰字 |
| **sm** | `padding: xs + md`（小按钮） |

### 8.2 卡片

- 白底 `#FFFFFF`
- 边框：`1.5px solid rgba(0,0,0,0.06)`（几乎隐形）
- 圆角：`radius-xl`（20px）
- 阴影：`shadow-lg`
- hover 时上浮 `translateY(-3px)` + 边框变浅靛蓝

### 8.3 输入框

- 边框：`1.5px solid rgba(0,0,0,0.08)`
- 圆角：`radius-lg`（16px）
- 焦点：边框变靛蓝 + 光环 `0 0 0 3px rgba(79,70,229,0.12)`
- placeholder：`neutral-400`

### 8.4 顶部导航栏

- **位置**：`fixed` 顶部，高 68px
- **背景**：`rgba(255,255,255,0.85)` + `backdrop-filter: blur(12px)`（毛玻璃）
- **底边框**：`1px solid rgba(0,0,0,0.06)`
- **布局**：左品牌名 + 中间分段控件 + 右侧操作
- **品牌名**：`1.25rem`，`800` 字重，靛蓝，负字距
- **分段控件**：灰色底（`neutral-100`）圆角容器 + 4px 内边距，当前项是白色凸起标签（`bg-white` + 微阴影 + 靛蓝字）

### 8.5 左侧图标导航栏

- 宽度 **72px**，半透明毛玻璃底 `rgba(255,255,255,0.7)` + blur
- 右分隔线 `1px solid rgba(0,0,0,0.06)`
- **顶部**：40px 蓝色圆角 logo 方块（12px 圆角）
- **中间**：图标按钮（44px，12px 圆角）
  - 默认：灰图标
  - hover：白底 + 靛蓝 + 微阴影
  - 激活：白底 + 靛蓝 + 阴影
  - 完成：绿色
- **底部**：设置图标（`margin-top: auto`）

### 8.6 进度指示器

- 圆点 **40px**，圆形
- 激活态：靛蓝底白字 + 呼吸脉冲光环
- 完成态：绿色
- 连接线：56px × 2.5px，圆角，完成变绿色
- 标签：12px，激活靛蓝、完成绿色、未完成灰

### 8.7 阶段 Banner

- 背景：`primary-subtle`（极浅靛蓝）
- 边框：`1px solid rgba(0,0,0,0.03)`
- 圆角：`radius-xl`
- 标题：`2xl`，`800` 字重，靛蓝
- 正文：`sm`，`neutral-500`

### 8.8 右侧提示栏（Hint Sidebar）

- 宽度 **260px**
- `position: sticky` 顶部固定
- 卡片：暖色渐变 `linear-gradient(160deg, #FFF8F0 0%, #FFFAF5 40%, #FFFFFF 100%)` + 暖色边框 `#FDE8D0` + 20px 圆角
- 灯泡 emoji 💡 + 弹跳动画
- "TIP" 标签：琥珀色 `#E5A050`，大写，字距 0.08em
- 提示文字：居中，`neutral-600`
- 底部三个暖色圆点 + 呼吸动画

### 8.9 Splash 欢迎屏

- 遮罩：`rgba(15,15,20,0.45)` + `backdrop-filter: blur(20px)`
- 卡片：`rgba(255,255,255,0.92)` + blur + 28px 圆角 + `0 24px 64px rgba(0,0,0,0.12)` 阴影
- 图标：72px 圆角方块（20px），靛蓝渐变底 + 线性 SVG 图标
- 标题：`1.75rem`，`800` 字重
- 背景装饰：缓慢移动的径向渐变光晕

### 8.10 冲突卡片

- 白底，边框 `1.5px solid rgba(245,158,11,0.3)`（暖黄半透明）
- 圆角 `radius-xl`
- 含：来源解释框（暖黄底 `#FFFBEB` + `#FDE68A` 边框）、置信度进度条（黄→红渐变）、视觉对比、解决方案按钮、反驳输入区

---

## 9. 布局结构

```
<div id="app">                          ← flex column, min-height 100vh
  <nav id="navbar">                     ← fixed 顶部
  <div class="app-body">                ← flex row
    <aside id="sidebar">                ← 72px 图标栏
    <main id="app-main">                ← 主内容区，居中，max-width 880px
      <div class="ac-layout">           ← flex row（主内容 + 提示栏）
        <div class="ac-layout__main">   ← 主卡片
        <aside class="ac-hint-sidebar"> ← 260px 提示栏
```

- 主内容最大宽度 880px，居中
- 含提示栏时整体最大宽度 1180px
- 页面顶部内边距 `2xl`（48px）

---

## 10. 图标风格

- **线性风格**（Lucide / Feather 风格）：`stroke-width: 1.5~2`，`stroke-linecap: round`，`stroke-linejoin: round`
- 尺寸：导航 20px，标题装饰 40px，小图标 16px
- 颜色：默认灰，激活靛蓝，成功绿色
- 用内联 SVG，`stroke="currentColor"` 跟随文字色

---

## 11. 设计原则（Tone & Voice）

1. **通透** — 大量留白、毛玻璃、柔和阴影，不要拥挤
2. **克制** — 颜色克制，主色只用靛蓝，语义色只在必要时出现
3. **细腻** — 所有交互都有过渡，hover 有上浮，选中有光环
4. **现代** — 大圆角、胶囊按钮、负字距标题
5. **温暖** — 提示文案友好鼓励，暖色点缀（提示栏的琥珀色）不冷冰冰
6. **渐进** — 复杂信息逐层揭示，不一次性堆砌

---

## 12. 复用清单（快速上手）

生成新页面时，直接复制以下内容：

1. **`:root` 设计令牌**（第 2~7 节所有变量）
2. **body 背景渐变** + Inter 字体
3. **按钮三件套**：`.btn` + `.btn--primary` + `.btn--outline`
4. **卡片样式**：白底 + `1.5px rgba(0,0,0,0.06)` 边框 + `radius-xl` + `shadow-lg`
5. **输入框**：`1.5px rgba(0,0,0,0.08)` + 焦点光环
6. **导航栏**：毛玻璃 + 分段控件
7. **左侧图标栏**（如需）
8. **进度指示器**（如为多步流程）
9. **内联 SVG 线性图标**
