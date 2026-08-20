# AI 产品概念图工具包网站需求

> 范围说明：本文档只定义网站的内容、信息架构、功能、交互、数据、隐私、无障碍和评估要求。视觉风格与 CSS 实现由 `AIDeBias-Design-System.md` 单独规定，本文不重复相关内容。

## 1. 项目概述

### 暂定名称

**Critical Reading Before Commitment**  
面向 AI 生成产品概念图批判性解读的教育工具包。

### 网站目的

网站是实体卡片工具包的数字配套部分，帮助设计学生和早期从业者：

1. 理解 AI 图像可以支持哪些设计活动；
2. 识别明显错误、潜在设计逻辑缺口和未经验证的主张；
3. 通过案例练习批判性解读；
4. 把框架应用到自己的 AI 产品概念图；
5. 记录有证据意识的设计决定和下一步行动。

网站不是 AI 生图平台、提示词工具、工程检查器或自动设计评分器。它应独立于具体模型，并能配合不同 AI 工具和个人工作习惯使用。

### 主要目标用户

- 工业设计和产品设计学生；
- 刚开始使用生成式图像的早期设计从业者；
- 尚未形成稳定图像审查习惯的设计者；
- 在课程中教授 AI 图像批判性素养的教育者。

### 核心主张

> 在接受完成度很高的 AI 图像作为设计方向前，先区分图像实际支持的可见证据、它诱导用户相信的设计主张，以及仍未解决的决定。

---

## 2. 总体信息架构

网站包含七个主要部分：

| 编号 | 部分 | 作用 |
|---|---|---|
| 01 | 项目概述 | 介绍项目和实体工具包 |
| 02 | AI Capability Cards | 校准对 AI 图像能力的期待 |
| 03 | Error and Uncertainty Cards | 提供批判性阅读分类与提示 |
| 04 | Case Challenges | 通过预设案例进行练习 |
| 05 | Apply to Your Image | 分析用户自己的 AI 概念图 |
| 06 | Decision and Next Action | 将反思转化为设计决定 |
| 07 | 创作者与项目信息 | 展示作者、研究背景和来源 |

### 推荐导航名称

```text
Overview
Capabilities
Read the Image
Cases
Your Image
Decision
About
```

五个工具包部分应形成清楚的学习顺序：

```text
能力校准
   ↓
错误与不确定性识别
   ↓
案例练习
   ↓
应用到个人图像
   ↓
决定与下一步行动
```

用户可以自由浏览卡片，但第一次使用时应推荐以上顺序。

---

## 3. 第一部分：项目概述

### 目的

简洁介绍研究问题、目标用户、工具包结构和实体产出。

### 首页首屏内容

首屏需要立即提供：

- 项目名称；
- 一句话项目主张；
- 目标用户；
- 进入工具包的主要入口；
- 实体工具包作为明确的项目产出。

建议介绍文字：

> AI 生成产品图可能在设计真正解决之前就显得已经完成。本工具包帮助设计者在接受方向前区分可见证据、隐含设计主张和未决问题。

### 实体工具包摄影图

在项目简介之后展示一张完整、高清的实体工具包摄影图，内容应包括：

- 完整卡片组；
- 部分正面与背面；
- 包装或收纳形式；
- 能说明真实尺寸和使用方式的场景；
- 不同设备使用所需的图片裁切版本；
- 对应替代文字。

### 补充内容

- 简要的问题背景；
- 工具介入时机：接受 AI 图像为方向之前；
- 五部分工具包结构图；
- 实体与数字组件的关系；
- 限制声明：工具支持判断，但不验证设计正确性。

### 主要操作

- `Start with Capabilities`
- `Browse the Toolkit`
- 可选：`View the Physical Toolkit`

---

## 4. 第二部分：AI Capability Cards

### 目的

帮助用户理解 AI 图像可以支持哪些设计目的，以及每种能力不能证明什么。

### 五项能力

1. **Externalise an Idea**
2. **Open Up Possibilities**
3. **Develop a Starting Point**
4. **Explore Visual Variables**
5. **Contextualise a Concept**

`Communicate a Direction` 作为跨能力用途显示，不再作为独立能力。

### 浏览功能

用户应能够：

- 浏览全部五张数字卡；
- 打开正面、背面或扩展信息；
- 查看真实或研究案例的输入—输出关系；
- 快速理解能力目的；
- 查看证据边界；
- 进入相关 Case Challenge。

### 单张数字卡内容

**正面**

- 能力名称；
- 一句用途说明；
- 输入 → 输出案例；
- 能力图标；
- 可选的跨能力用途标签。

**背面或扩展信息**

- `It can support`；
- `It cannot prove`；
- `Notice what changed`；
- 一个实际检查问题；
- 案例来源或署名。

### 所需内容

- 五张能力卡的电子内容；
- 五项能力图标；
- 每项至少一个输入—输出案例；
- 实体卡正反面素材；
- 简洁英文卡片文案；
- 研究案例来源链接。

---

## 5. 第三部分：Error and Uncertainty Cards

### 目的

为解读 AI 产品概念图提供结构化词汇，同时避免把所有不确定性都武断地称为 AI 错误。

### 双轴框架

网站应清楚但不过度复杂地展示双轴逻辑。

**轴一：用户正在检查什么？**

- Physical Integrity
- Attributes and Relationships
- Human and Use
- Design Logic
- Evidence Claims

**轴二：根据现有信息可以确定到什么程度？**

- Observable Error
- Potential Logic Gap
- Unverified Claim

双轴矩阵同时承担解释和筛选功能。用户选择行、列或矩阵单元格后，应看到对应卡片。

### 第一版卡片

1. Colliding Parts
2. Component Count
3. Broken Surfaces
4. Unsupported Parts
5. Unreadable Interface
6. Misplaced Attributes
7. Broken Relationships
8. Unstable Scale
9. Changing Identity
10. Broken Contact
11. Impossible Action
12. Unclear Response
13. Form Without Function
14. Lost Intention
15. Assumed Comfort
16. Assumed Feasibility
17. False Resolution

### 筛选与浏览

用户应能够按照以下条件筛选：

- 检查对象；
- 判断等级；
- 关键词；
- 与当前案例或用户图像的相关性。

界面应明确显示当前筛选条件，并提供重置操作。

### 单张数字卡内容

**正面**

- 卡片名称；
- 可选中文辅助名称；
- 简短识别问题；
- 带少量标注的案例图；
- `Look for` 提示；
- 检查对象与判断等级标签。

**背面或扩展信息**

- `What it means`；
- `Evidence boundary`；
- `What to do next`；
- 相关案例；
- 研究依据或来源。

### 判断等级图标

需要提供三个一致的类别图标：

- Observable Error；
- Potential Logic Gap；
- Unverified Claim。

其视觉处理由 `AIDeBias-Design-System.md` 规定。

---

## 6. 第四部分：Case Challenges

### 目的

让用户先在预设案例中练习，再分析自己的图像。

### 单个案例内容

- 简短设计 brief 或意图；
- 原始 prompt、草图或参考输入；
- AI 生成产品图；
- 任务问题；
- 可选择的 Error and Uncertainty Cards；
- 可选图像标注；
- 用户判断理由；
- 可展开的参考分析。

### 推荐交互顺序

1. 阅读 brief 或设计意图。
2. 在没有答案的情况下检查图像。
3. 选择最多三张相关卡片。
4. 标注一个或多个图像区域。
5. 将观察归类为可见错误、潜在缺口或未经验证的主张。
6. 选择或写出下一步行动。
7. 展开参考分析。
8. 对比判断理由，而不是只获得数字分数。

### 反馈要求

反馈应解释：

- 哪些内容可以直接观察；
- 哪些判断依赖 prompt 或 brief；
- 哪些内容无法仅凭图像确定；
- 下一步需要什么证据或设计活动。

### 案例库最低范围

- 明显生成缺陷；
- prompt 或属性不匹配；
- 跨视图不一致；
- 不现实的用户动作；
- 形态与功能不匹配；
- 未经验证的人体工学或可行性主张；
- 同时涉及多个判断等级的混合案例。

每个案例尽可能保存来源、模型、生成日期、prompt 和后期编辑记录。

---

## 7. 第五部分：Apply to Your Image

### 目的

将案例中学习的框架迁移到用户自己的 AI 产品概念图。

### 核心流程

1. 上传或拖入图片。
2. 可选填写简短设计意图。
3. 选择一至三张相关卡片。
4. 在图像上添加标注。
5. 使用三类标签记录判断。
6. 记录仍需要的证据或设计工作。

### 三类标注

#### Visible Evidence

图像中可以直接观察到什么？

#### Implied Design Claim

图像促使观看者相信了什么？

#### Unresolved Decision

哪些内容仍缺乏支持、尚未决定或需要进一步设计？

### 标注功能

用户应能够：

- 缩放和平移图像；
- 添加、移动、编辑和删除标记；
- 将标记关联到一张 Error and Uncertainty Card；
- 修改判断等级；
- 添加简短说明；
- 显示或隐藏不同标注类别；
- 确认后重置活动；
- 选择 `Cannot determine from this image`。

### 隐私要求

第一版原型默认在浏览器本地处理用户图片，并明确说明图片不会被上传或外部保存。未来若增加服务器存储，必须提供明确同意、用途说明和数据保存期限。

### 异常与空状态

- 未选择图片；
- 不支持的文件格式；
- 图片过大；
- 未保存时离开页面；
- 找不到相关卡片；
- 无法从图像判断。

---

## 8. 第六部分：Decision and Next Action

### 目的

把批判性反思转化为明确设计决定，而不是以问题清单结束。

### 决定选项

- Continue exploring
- Keep with conditions
- Modify the concept
- Compare another direction
- Return to the brief
- Return to sketching
- Generate another view
- Build a prototype
- Gather user evidence
- Seek engineering validation
- Keep the issue unresolved
- Reject this direction

### 最终记录内容

- 选择的决定；
- 简短判断理由；
- 最高优先级的未决问题；
- 所需证据或下一步活动；
- 使用过的卡片；
- 可选的标注图片；
- 日期和项目名称。

建议句式：

> I will **[keep / modify / compare / reject]** this direction because **[reason]**. Before proceeding, I need **[evidence or next action]**.

### 输出功能

第一版可支持：

- 适合打印的总结；
- 在技术允许时导出图片或 PDF；
- 可复制的文字总结；
- 返回标注图继续修改；
- 重新开始。

结果不能被呈现为 AI 质量分数或正式设计批准。

---

## 9. 第七部分：创作者与项目信息

### 目的

提供作者信息、学术背景、研究透明度和联系方式。

### 必要内容

- 创作者：Jianyi Wang；
- 专业与学校；
- 项目名称；
- 导师和项目背景（适用时）；
- 简短个人介绍；
- 项目动机；
- 项目演变或过程材料；
- 对形成性研究参与者的匿名致谢；
- AI 使用声明；
- 联系方式或作品集链接；
- 网站版本和更新时间。

### 研究透明度

提供以下内容的独立入口或展开区域：

- 研究依据；
- 参考文献；
- 项目局限；
- 伦理与参与者研究说明；
- 图片和案例署名；
- 生成式 AI 使用声明。

### 核心限制声明

> 工具包支持批判性解读，但不验证可用性、人体工学、安全性、可制造性或整体设计质量。

---

## 10. 设备支持与无障碍要求

### 设备支持

- 七个部分和核心流程应在桌面、平板和手机上可用；
- 卡片浏览、筛选、图片上传、标注和决策记录在支持的屏幕尺寸下均不能缺失；
- 重要内容和操作不能只依赖 hover；
- 屏幕方向或窗口大小改变后，标注数据不能丢失。

### 无障碍

- 卡片、筛选器和标注工具支持键盘操作；
- 提供可见焦点状态；
- 实体工具包照片和案例图具有替代文字；
- 图标和不熟悉的控件具有文字标签；
- 支持 reduced motion；
- 使用语义化标题和页面区域；
- 类别含义不能只依赖颜色；
- 错误和验证信息应与相应控件建立程序关联。

---

## 11. 内容与数据结构

卡片和案例内容应与页面组件分开保存，以便用户测试后修改分类、措辞和案例，而不需要重写页面。

### Capability Card 建议字段

```json
{
  "id": "capability-01",
  "title": "Externalise an Idea",
  "purpose": "",
  "inputType": "",
  "outputType": "",
  "canSupport": "",
  "cannotProve": "",
  "noticeWhatChanged": "",
  "exampleImages": [],
  "source": ""
}
```

### Error Card 建议字段

```json
{
  "id": "error-01",
  "title": "Colliding Parts",
  "helperTitle": "部件冲突",
  "inspectionFocus": "Physical Integrity",
  "judgementLevel": "Observable Error",
  "question": "",
  "lookFor": [],
  "meaning": "",
  "evidenceBoundary": "",
  "nextAction": "",
  "exampleImages": [],
  "sources": []
}
```

### Case 建议字段

```json
{
  "id": "case-01",
  "title": "",
  "difficulty": "introductory",
  "brief": "",
  "prompt": "",
  "inputImages": [],
  "aiOutput": "",
  "relevantCards": [],
  "referenceObservations": [],
  "evidenceBoundaries": [],
  "recommendedActions": [],
  "model": "",
  "generationDate": "",
  "source": ""
}
```

---

## 12. 原型范围与优先级

### 第一版必须完成

- 七个网站部分；
- 实体工具包高清摄影图；
- 五张完整 Capability Cards；
- 可搜索和筛选的 Error and Uncertainty Cards；
- 可交互的双轴矩阵；
- 至少三个完整 Case Challenges；
- 本地图片上传；
- 三类图像标注；
- 下一步行动选择；
- 可打印或复制的决定总结；
- About、参考文献和限制声明。

### 应当完成

- 卡片和案例之间的关联链接；
- 进度提示；
- 本地保存当前活动；
- 导出标注图片；
- 中英文辅助标签；
- 在手机上完整访问核心流程。

### 后续或可选

- 教师模式；
- 更大的案例库；
- 延迟迁移练习；
- 通过伦理审批后的匿名研究记录；
- 账号和云端保存；
- 与外部 AI 图像工具连接。

### 明确不在范围内

- 内置 AI 图像生成；
- 自动图像缺陷检测；
- 自动设计质量评分；
- 制造或安全认证；
- 强制性的统一设计工作流；
- 取代草图、用户研究或工程验证。

---

## 13. 所需内容与素材清单

- [ ] 最终项目名称和一句话主张
- [ ] 实体工具包高清摄影图
- [ ] 工具包五部分结构图
- [ ] 五张 Capability Card 正面内容
- [ ] 五张 Capability Card 背面内容
- [ ] 五项能力图标
- [ ] 17 张 Error and Uncertainty Card 正面内容
- [ ] 17 张 Error and Uncertainty Card 背面内容
- [ ] 三个判断等级图标
- [ ] 至少三套完整案例图
- [ ] 案例 prompt、brief 和参考分析
- [ ] 创作者照片或合适的个人图片
- [ ] 创作者简介与联系方式
- [ ] 参考文献和图像署名
- [ ] AI 使用声明和项目限制声明
- [ ] 用户上传图片隐私说明
- [ ] 主要图片的替代文字

---

## 14. 网站评估问题

1. 用户能否理解五部分工具包结构？
2. 用户能否区分 Observable Error、Potential Logic Gap 和 Unverified Claim？
3. 用户能否在不阅读全部 17 张卡的情况下找到相关卡片？
4. Case Challenges 是否能帮助用户分析未见过的图像？
5. 用户能否区分 Visible Evidence 和 Implied Design Claim？
6. 最终决定记录是否包含具体下一步行动或证据需求？
7. 网站是否支持反思，同时没有变成负担过重的检查表？
8. 用户是否理解工具包不能验证设计正确性？

