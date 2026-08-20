# Your Image：用户自有图像审查界面设计

## 1. 页面定位

`Your Image` 位于 Case Challenges 之后。案例练习帮助用户理解如何阅读 AI 产品概念图；本页面让用户将方法应用到自己的图片。

页面不负责证明图片正确，也不要求用户必须找到错误。用户先完成独立观察，随后 AI 根据设计意图、原始 prompt、图片和卡片体系，友善地提出最多四个可能被忽略的问题。用户保留最终判断权。

### 核心原则

- 用户自己的观察始终优先；
- AI 必须在用户提交初次观察后出现；
- AI 只提出候选问题，不宣布设计结论；
- AI 重点补充不容易一眼发现的设计逻辑问题；
- 用户对每条 AI 建议只需选择“纳入记录”或“建议不成立”；
- AI 建议审阅结束后直接生成 Review Record，不增加额外任务。

### 用户流程（最基础的框架）

```text
1. Add Your Image and Intention
             ↓
2. Make Your Own Observations
             ↓
3. Review AI Follow-up Questions
             ↓
Result: Review Record
```

界面顶部只显示 `Step 1 of 3`。结果页不是第四个任务步骤。

---

## 2. Step 1 — Add Your Image and Intention

### 页面问题

> What were you trying to create?

### 页面目的

先建立图像的比较基准，使后续判断能够区分用户明确要求的内容和 AI 自行补充的内容。

### 必填内容

| 字段 | 英文界面文案 | 规则 |
|---|---|---|
| AI 图片 | `Upload your AI-generated image` | 上传一张 JPG、PNG 或 WebP |
| 原始 prompt | `What did you ask the AI to create?` | 粘贴用于生成该图的主要 prompt |
| 设计意图 | `What is this concept intended to do?` | 用一句话说明产品及预期用途 |

### 可选内容

| 字段 | 英文界面文案 | 规则 |
|---|---|---|
| 关键要求 | `What must remain true?` | 最多三项，不要求填写完整 brief |
| 原始草图 | `Add your starting sketch (optional)` | 用于比较 AI 是否偏离原始方向 |
| AI 使用目的 | `How did you use AI for this image?` | 从五种 Capability Cards 中选择一项 |

### AI 使用目的选项

- Make an Idea Visible
- Open Up Possibilities
- Develop a Starting Point
- Explore Visual Variables
- Contextualise a Concept
- I am not sure

这项选择用于确定哪些审查视角更相关，不表示某种能力必然造成某种错误，也不用于计算风险概率。

主按钮：**Start My Review**

### 设计理由

- prompt 提供明确的文字比较依据；
- 设计意图补充 prompt 中可能没有说明的使用目标；
- Capability 选择用于调整 AI 后续问题的相关性，而不是预测错误；
- 草图保持可选，以兼容不同的 AI 绘图方法。

---

## 3. Step 2 — Make Your Own Observations

### 页面问题

> Before receiving any suggestions, is there anything you want to look at more closely?

辅助文字：

> Mark what matters to your judgement. It is also acceptable if you do not notice a concern yet.

### 页面目的

保留用户在 AI 介入前的独立判断，避免 AI 的问题成为用户第一眼观察的锚点。

### 页面布局

- 主区域：可缩放的用户图片；
- 顶部：可折叠查看 prompt、设计意图和关键要求；
- 侧栏：用户已经添加的观察；
- 图片侧边：轻量标注工具栏；
- 工具栏下方：撤销、重做和恢复视图。

此时不显示 AI 分析结果，也不主动推荐错误卡。

### 图片标注工具

用户可以像在审阅图纸一样，直接圈出或画出值得关注的位置。标注完全可选，不画图也可以继续。

工具栏只保留以下常用工具：

| 工具 | 英文 tooltip | 用途 |
|---|---|---|
| 选择／移动 | `Select or move` | 选择、移动或调整已有标注 |
| 圈选 | `Circle an area` | 用椭圆圈出一个局部区域，作为默认推荐工具 |
| 画笔 | `Draw freely` | 用自由线标出不规则轮廓、连接关系或运动路径 |
| 擦除 | `Erase a mark` | 擦除局部线条或删除一个标注对象 |
| 撤销／重做 | `Undo` / `Redo` | 恢复最近的编辑操作 |
| 清除 | `Clear annotations` | 经二次确认后清除当前图片上的全部标注 |

缩放和拖动画布必须与画笔模式明确区分，避免用户在查看细节时误画。标注线条保持单一高对比度视觉样式，并使用编号辅助识别，不能只依赖颜色传递信息。

### 添加自己的观察

用户可以先圈画图片区域，也可以先点击添加观察。每个标注自动获得编号，并与侧栏中的一条观察相连。用户选择标注后只填写一项：

> What did you notice here?

示例：

> Two button-like components are visible, although I intended to use one control.

用户可以从卡片库中关联一张 Error and Uncertainty Card，但这是可选操作。允许选择 `No card fits`。

用户也可以：

- 为一条观察关联多个圈画区域，例如同时指出手部与控制按钮；
- 只写观察而不在图中标注；
- 只圈出区域后再补充文字；
- 删除标注，但保留文字观察；
- 点击侧栏中的观察，让图片自动定位到对应区域。

编号关系示例：

```text
Image annotation 01
        ↕
Observation 01: Two button-like components are visible.
        ↕
Optional card: Component Count
```

标注只是用户注意区域的视觉记录，不代表系统已经确认这里存在错误。

### 没有发现问题

用户可以不添加任何标记，并选择：

> I do not notice a concern at this stage.

这不是“图片正确”的结论，只表示用户在 AI 建议出现前没有记录问题。

### 操作限制

- 建议添加 0–4 条自己的观察；
- 一条观察可以包含一个或多个标注区域；
- 不要求检查全部卡片；
- 不显示错误数量、正确率、风险分数或倒计时；
- 不使用“请找出图片错误”之类的强制性文案。

主按钮：**Submit My First Review**

点击后，用户的初次观察暂时锁定并记录；用户仍可在最终记录中查看，但 AI 不能重写这些内容。

### 设计理由

- 先观察、后提供 AI 建议，保护用户的独立判断；
- 允许零标记，避免预设每张图片一定存在错误；
- 圈画和编号帮助用户将模糊感受转化为可定位、可回看的视觉证据；
- 卡片作为可选表达支架，而不是强制清单。

---

## 4. Step 3 — Review AI Follow-up Questions

### 页面问题

> Here are a few additional questions that may be worth considering.

辅助文字：

> These are suggestions, not confirmed problems. Keep only those that are relevant to your image and intention.

### AI 的角色

AI 是一个可能出错的第二观察者。它结合以下信息生成候选问题：

- 用户上传的图片；
- 原始 prompt；
- 用户填写的设计意图和关键要求；
- 用户选择的 AI Capability；
- Error and Uncertainty Cards 的分类；
- 用户已经记录的问题，避免简单重复。

AI 不判断图片是否“合理”“通过”或“没有问题”。

### AI 输出数量与重点

- 最多四条；
- 可以少于四条；
- 不为了凑数制造问题；
- 优先提出用户可能难以一眼发现的逻辑问题；
- 明显穿模、乱码等可见错误只在用户未发现且证据较清楚时补充；
- 如果没有足够依据，显示 `No additional question could be grounded in the information provided.`。

### 允许的建议类型

#### 1. Prompt–Image Mismatch

比较 prompt 或关键要求与图片中的表现。

> Your prompt specifies one physical control, but two button-like forms may be visible. Are both intentional?

#### 2. Internal Image Inconsistency

指出图片内部可以观察到、但可能被忽略的不一致。

> The connection between the head and body appears visually ambiguous. Is this the intended joint or a generated overlap?

#### 3. Design Logic to Verify

指出图片暗示已经解决，但仅凭当前图片不能确认的问题。

> The control appears reachable in this view, but the image does not show whether it can be operated while holding the product. Does this need another view or a simple use check?

第三类是 AI 输出的重点。AI 必须使用 `may`、`appears`、`could`、`needs verification` 等审慎措辞，不能将舒适性、安全性、交互合理性或可制造性宣布为已确认错误。

### 每条 AI 建议的界面结构

```text
Question
Could this part affect how the product is held and operated?

Why it was raised
The control position and the intended one-handed use may need to be considered together.

Related lens
Human & Use · Impossible Action

[Include in My Record]    [This Does Not Apply]
```

其中：

- `Question` 使用友善、开放的疑问句；
- `Why it was raised` 说明依据来自图片、prompt 或设计意图；
- `Related lens` 显示相关卡片或检查类别；
- 没有合适卡片时显示 `No direct card match`，不强行归类。

### 用户操作

每条建议只提供两个主要选择：

- **Include in My Record**：用户认为该问题值得纳入最终记录；
- **This Does Not Apply**：用户认为建议不成立、不相关或无需考虑。

不要求用户填写驳回理由，不增加额外负担。两个选项均不默认选中。用户完成所有 AI 建议的选择后，直接进入结果页。

主按钮：**Create My Review Record**

### 避免第二层自动化偏差

- AI 在用户初次观察完成后才出现；
- 所有建议均以问题而非结论呈现；
- 每条建议说明提出依据；
- 用户必须主动纳入，不能默认接受；
- 用户可以驳回全部建议；
- 页面持续提示 AI 可能遗漏或误判；
- 不显示 AI 置信度分数或总体风险等级。

---

## 5. Result — Review Record

AI 建议审阅完成后，系统直接生成记录，不再要求用户选择下一步行动或填写额外表单。

### 页面标题

> Your Review Record

### 结果说明

> This record brings together what you noticed and the AI questions you chose to keep. It does not certify that the image is correct, usable, safe or feasible.

### 记录结构

```text
Image and Original Intention
- Uploaded image
- Original prompt
- Intended purpose
- Selected AI capability

Annotated Review Image
- Original image with the user's numbered circles and drawn marks
- Matching legend for each numbered observation

My Observations
- User annotation number, observation and optional card

AI Questions I Included
- Accepted AI question, reason raised and related lens

Review Boundary
- No visible concern recorded does not mean that no problem exists
- Unverified claims still require appropriate evidence
```

如果用户没有添加自己的观察，应显示：

> No concern was recorded during the user's first review.

如果用户没有纳入任何 AI 建议，应显示：

> No AI follow-up question was included in the final record.

这两种状态都不能显示为“通过”。

### Annotated Review Image

结果页首先呈现一张类似设计审阅图的可视化摘要：

- 保留原始图片，不覆盖或修改原文件；
- 在副本上叠加用户圈选、自由线和编号；
- 图片旁边以相同编号列出对应观察；
- 用户没有画图时，显示原始图片和文字观察，不生成空白标注层；
- 图下注明 `Annotations show the user's review, not verified defects.`。

建议将其称为 **Annotated Review Image** 或 **Visual Review Map**，而不是 `Diagnostic Result`。视觉上可以接近诊断图，但名称应避免暗示系统已经完成专业诊断。

AI 后续建议默认不自动画在该图上，避免 AI 推测与用户自己的视觉证据混在一起。被纳入的 AI 问题放在图片下方的独立列表中；未来只有在区域定位可靠且用户主动确认后，才可增加不同样式的 AI 标记。

### 可用操作

- **Download Review Record**
- **Download Annotated Image**
- **Return to My Image**
- **Review Another Image**
- **Delete This Review**

被用户判定为不成立的 AI 建议不进入主要 Review Record。系统可以仅在当前本地会话中保留其状态，用于返回修改；除非研究获得伦理审批和参与者同意，否则不得默认上传或收集这些数据。

---

## 6. AI 分析约束

### AI 应该做

- 对照 prompt、意图和图片提出具体问题；
- 指向相关区域或要求；
- 优先发现意图偏离、关系问题、使用逻辑和未经验证的主张；
- 避免重复用户已经记录的观察；
- 允许输出少于四条或零条建议；
- 为每条建议关联相关的 Error and Uncertainty Card。

### AI 不应该做

- 宣布图片正确或错误；
- 输出总体质量分数或风险概率；
- 将“无法验证”表述成“设计不成立”；
- 在没有尺寸、测试或专业信息时判断舒适、安全和可制造性；
- 为满足数量要求而编造问题；
- 修改用户自己的观察；
- 自动把建议纳入最终记录。

### 建议的结构化输出字段

```text
id
question
basis
source: image | prompt | intention | combined
region_hint
suggestion_type
related_card
evidence_limit
```

该结构用于保证网页能够稳定显示建议，也使 AI 输出更容易被检查和追溯。

### 标注数据要求

用户标注应保存为独立叠加层，而不是直接修改上传的图片。每个标注至少记录：

```text
annotation_id
observation_id
tool_type: ellipse | freehand
normalised_coordinates
stroke_points
created_by: user
```

坐标应相对于原图宽高归一化，使标注在缩放、移动端显示和下载结果中仍能对应正确区域。原始图、标注层和文字记录应当可以分别删除。

---

## 7. 理论原则与界面对应

| 理论原则 | 界面体现 | 设计边界 |
|---|---|---|
| 用户独立判断 | AI 出现在用户提交首次观察之后 | 不要求用户必须先找到问题 |
| 轻量认知摩擦 | 用户需停下来标记观察，并逐项决定是否纳入 AI 建议 | 不设置长表单或完整卡片清单 |
| 元认知支架 | 图片标记、卡片词汇和 AI 的开放问题帮助用户表达判断 | 不声称能够补足全部专业能力 |
| 判断校准 | AI 区分可见不一致、意图不符和需要验证的逻辑问题 | 不把图片表现当作事实证明 |
| 可质疑的 AI | 所有 AI 建议均需用户主动接受或驳回 | AI 分析不是 ground truth |
| 设计师能动性 | 用户观察优先，AI 不能重写或自动纳入内容 | 最终记录由用户选择共同构成 |

理论关系可概括为：

```text
User's independent observation
             ↓
AI-generated candidate questions
             ↓
User adjudication
             ↓
Combined Review Record
```

---

## 8. 最小可行版本

第一版只需实现：

1. 上传一张图片；
2. 输入 prompt 和一句设计意图；
3. 可选选择一项 AI Capability；
4. 用户使用圈选、画笔和擦除工具添加可选标注；
5. 用户添加 0–4 条观察，并将其与标注区域关联；
6. 调用一次多模态 AI，返回最多四条结构化候选问题；
7. 用户对每条建议选择纳入或不成立；
8. 自动生成 Review Record 和 Annotated Review Image；
9. 全部数据优先保存在浏览器本地。

暂不需要实现：

- AI 自动评分；
- 专业可行性认证；
- 多轮 AI 对话；
- 用户解释每次驳回的原因；
- 强制选择下一步行动；
- 多人实时协作；
- 云端项目账户。

---

## 9. 与 Case Challenges 的衔接

Case Challenge 完成页：

> You have practised reviewing an AI-generated concept with a known case. Now begin with your own observations, then use AI as a second reader to raise a few additional questions.

按钮：**Review My Own Image**

Your Image 起始页：

> Your observations come first. AI suggestions will only appear after your initial review, and you decide what belongs in the final record.

这句文案应持续构成页面的核心承诺：AI 扩展用户的观察范围，但不接管用户的最终判断。
