# Case Challenge 01：完成得太早

## 1. 案例定位

### 教学目标

本案例是用户完成 Error and Uncertainty Cards 学习后的第一个练习。它训练用户：

1. 先阅读设计意图，再检查 AI 图像；
2. 用中性语言记录直接可见的证据；
3. 使用少量卡片对问题进行分类；
4. 区分图像错误、对错误原因的推测和仍需验证的设计问题；
5. 将识别结果转化为具体的下一步行动。

本案例只聚焦 **Observable Error**。不要求用户判断产品是否舒适、可制造或商业可行。

### 案例产品

**产品：** 家用手持式智能健康扫描器  
**主要问题：** AI 图像整体完成度较高，但局部几何关系并未真正解决。

### 预设设计背景

> A design student is developing a handheld health scanner for home use. The user places the circular sensing head against the skin, presses one physical button, and reads a simple status light. The product should be compact, calm and easy to hold.

中文辅助说明：

> 一名设计学生正在设计一款家用手持健康扫描器。用户将圆形感应头贴近皮肤，按下一个实体按钮，并通过简单的状态灯读取反馈。产品应紧凑、平静且便于握持。

### 原始设计意图

- 一体式手持主体；
- 前端只有一个圆形感应头；
- 侧面只有一个实体按钮；
- 一条连续、完整的外壳表面；
- 通过一个小型状态灯提供反馈。

### 原始生成提示词

> A compact handheld health scanner for home use, with one circular sensing head at the front, one physical button on the side, a small status light, and a continuous matte white outer shell. Calm, approachable industrial design, three-quarter product view, clean studio background.

### AI 图像中预设的三个问题

这些内容只用于制作者准备案例图，不在用户提交前显示：

| 图像区域 | 预设现象 | 对应卡片 | 判断等级 |
|---|---|---|---|
| 前端感应头与主体连接处 | 圆形感应头穿入外壳，边界异常融合 | Colliding Parts | Observable Error |
| 侧面控制区 | 出现两个形态相似的实体按钮，与“一个按钮”的意图不符 | Component Count | Observable Error |
| 握持区域外壳 | 表面轮廓突然断开，出现不连续的接缝或缺口 | Broken Surfaces | Observable Error |

案例图不应再加入明显文字乱码、人体工学问题或制造问题，以免一次练习承载过多目标。

---

## 2. 总体闯关结构

```text
Case Brief
   ↓
Read the Intention
   ↓
First Look
   ↓
Mark the Evidence
   ↓
Choose the Cards
   ↓
Set the Evidence Boundary
   ↓
Choose the Next Action
   ↓
Reference Analysis
```

界面顶部持续显示：

```text
Case 01 of 04    Step 1 of 7    Observable Error
```

用户可以返回已完成步骤修改答案，但在首次提交前不能查看 Reference Analysis。系统不显示分数、正确率、倒计时或排行榜。

### User Journey Map

This journey is not designed to test how many errors a user can find. It progressively builds a transferable reasoning process. Each stage introduces one necessary cognitive task so that the brief, image, cards and reference analysis are not presented simultaneously.

| Stage | User's question | User goal | User actions | System support and touchpoints | Stage output | Progress condition |
|---|---|---|---|---|---|---|
| **Case Brief** | “What is this task, and what am I being asked to judge?” | Understand the scope and focus without treating the task as an evaluation of the whole product | Read the case title, product category, expected duration and focus; confirm that this challenge concerns Observable Error; select Start Case | Show the task scope, progress and limitation statement; withhold the AI image, cards and answers | Started case record | The user actively starts the case |
| **Read the Intention** | “What did the designer explicitly require?” | Extract stated requirements that can be used as a comparison baseline | Read the background, design intention, prompt and optional sketch; select the three requirements explicitly stated in the brief; confirm the baseline | Separate stated design information from unverified claims; explain which options fall outside the evidence provided by the brief | Three-item comparison baseline | The required number of explicit requirements is identified and Confirm Baseline is selected |
| **First Look** | “What attracts my attention before I receive any prompts?” | Preserve an independent first reading before card labels direct attention | Inspect and zoom the complete AI image; observe freely; select the first area to inspect more closely, or state that no specific area is yet apparent | Reveal the complete image for the first time; retain a collapsible brief; withhold card recommendations and problem locations | First-attention record | The user submits one independent attention choice |
| **Mark the Evidence** | “What can I directly see in this area?” | Convert a visual impression into locatable and describable evidence | Click or draw a region; write one neutral observation; add up to two further markers if needed; revise statements containing unsupported interpretation | Provide zoom, region annotation and sentence prompts; when overreaching language is detected, ask for the visible feature first | Image coordinates + Visible Evidence statement | At least one region and one visible-evidence statement are recorded |
| **Choose the Cards** | “Which card best helps me inspect this observation?” | Use the cards as shared inspection language without turning all 17 cards into a mandatory checklist | Browse the relevant inspection focus; assign one card to each marker; read its question; explain the choice; use No card fits when appropriate | Show the most relevant inspection focus first; support search, filtering, replacement and marker merging; limit the case to three cards | Link between marker, evidence and selected card | At least one marker is linked to a card or explicitly marked as having no suitable card |
| **Set the Evidence Boundary** | “How certain can I be from the information available?” | Distinguish what is directly visible, what depends on the brief and what cannot be established from one image | Review each judgement; select its evidence level; choose the conclusion supported by current evidence; withdraw or retain interpretations that exceed it | Present the marker, observation and card together; explain why safety or manufacturability claims require further evidence; provide Cannot be determined from this image | Evidence boundary for every judgement | Every recorded judgement has an evidence-level selection |
| **Choose the Next Action** | “What should I do before accepting this image as a direction?” | Translate critical reading into a design action or evidence requirement | Select one or two actions; complete a reason linking the action to visible evidence; lock the current reading | Offer redraw, local regeneration, another view, return to the brief, modelling, validation or retain as unresolved; do not select on the user's behalf | Selected action + evidence-based rationale | At least one action and rationale are recorded, followed by Lock My Reading |
| **Reference Analysis** | “How does my reasoning compare with an evidence-based reference reading?” | Calibrate observation and certainty while recognising that more than one interpretation may be defensible | Compare personal markers with reference regions; expand each explanation; inspect overlooked areas; compare alternative card choices; record one takeaway | Present Your Reading and Reference Analysis side by side; explain evidence and acceptable alternatives; avoid scores and error counts | Completion summary + transferable reminder | The user reviews the reference analysis and completes the case summary |

### Cognitive Progression

| Stage | Intended cognitive state | Role of the intervention | What the design should prevent |
|---|---|---|---|
| Case Brief | Orientation | Bound the task | Treating the activity as a judgement of overall product quality |
| Read the Intention | Baseline formation | Ground later judgement in the brief | Reconstructing the design intention after seeing the AI image |
| First Look | Independent attention | Preserve unprompted observation | Letting card labels determine where the user looks |
| Mark the Evidence | Deliberate inspection | Turn “something looks wrong” into visible evidence | Jumping directly to claims such as unsafe or unmanufacturable |
| Choose the Cards | Structured interpretation | Give observations a shared inspection language | Treating all 17 cards as a compulsory checklist |
| Set the Evidence Boundary | Calibrated certainty | Separate evidence, inference and the unknown | Presenting a potential gap as a confirmed error |
| Choose the Next Action | Designer agency | Connect reflection to practical action | Ending with only the generic conclusion that AI can make mistakes |
| Reference Analysis | Reflection and transfer | Compare reasoning rather than answer matching | Evaluating ability through accuracy scores or error counts |

### Evidence Trail Produced by the Journey

```text
Explicit Intention
   ↓
First Attention
   ↓
Marked Region + Visible Evidence
   ↓
Selected Card + Reason
   ↓
Evidence Boundary
   ↓
Next Action + Evidence Needed
   ↓
Comparison with Reference Analysis
```

At the end of the case, this evidence trail should generate a concise summary. It allows the user to review their reasoning and, following ethics approval, could provide a structure for behavioural research data. By default, all records remain stored locally on the user's device.

---

## 3. 完整使用流程

## Step 1：进入案例

### 页面目的

让用户知道本次练习的范围，避免一开始就无边界地评价产品好坏。

### 页面内容

- 标题：**Case 01 — Finished Too Soon**
- 副标题：**Can you separate visible image evidence from what the image merely suggests?**
- 产品类别：Handheld health device
- 预计完成时间：5–7 minutes
- 本关重点：Observable Error
- 本关说明：

> Inspect what is visibly present in the image. Do not assess comfort, safety or manufacturability yet.

### 用户操作

点击 **Start Case**。

### 解锁条件

无。进入后开始在本地记录案例进度。

---

## Step 2：阅读设计背景与意图

### 页面布局内容

页面先展示：

1. Design Background；
2. Original Design Intention；
3. Original Prompt；
4. 可选的初始草图或轮廓参考图。

AI 生成图像此时不显示，避免图像先入为主地影响用户对 brief 的理解。

### 微任务：确认检查基准

问题：

> Which three details are explicitly required by the design intention?

用户从以下项目中选择三项：

- One circular sensing head
- One physical side button
- A continuous outer shell
- Proven medical accuracy
- Confirmed ergonomic comfort
- Injection-moulding feasibility

### 反馈方式

用户确认后，系统只提示：

> These stated requirements will be your comparison baseline. The brief does not provide evidence of medical accuracy, comfort or manufacturability.

这里的目的不是考记忆，而是建立后续判断所需的证据边界。

### 解锁条件

用户选择三项后点击 **Confirm Baseline**。若选择数量不符，提示“Select three stated requirements”。

---

## Step 3：第一次查看 AI 图像

### 页面目的

在卡片和提示出现前，保留用户的独立观察结果，避免卡片直接替用户寻找问题。

### 页面内容

- 大尺寸 AI 生成产品图；
- brief 的折叠入口；
- 放大、缩小和恢复视图；
- 按钮：**Begin Inspection**。

图像出现后先不展示卡片库。用户可以自由查看，不设置强制倒计时。

### 独立观察

用户点击 **Begin Inspection** 后回答：

> What is the first area you would inspect more closely?

选择：

- Sensing head and body connection
- Side controls
- Outer shell continuity
- Another area
- I do not notice a specific area yet

该回答不判定正误，只记录用户在获得提示前首先关注的位置。

### 解锁条件

完成一次选择后点击 **Continue**。

---

## Step 4：标记可见证据

### 页面目的

要求用户先说明“看见了什么”，再选择错误类别。

### 用户操作

1. 点击或拖拽框选图像区域；
2. 为每个标记输入一句观察；
3. 最多建立三个标记。

### 输入提示

> Describe only what is visible. Avoid explaining why it happened or whether the product would work.

可使用句式：

> I can see __________ in this area.

### 合格示例

- “The circular head overlaps the body boundary.”
- “Two similar side buttons are visible.”
- “The shell edge stops and restarts.”

### 需要提醒的表达

当用户输入包含 “because the AI”, “impossible to manufacture”, “unsafe” 或 “uncomfortable” 等超出现有图像证据的表达时，系统不删除答案，而是提示：

> This may be an interpretation or claim. Can you first state the visible feature that led you to it?

### 解锁条件

至少建立一个图像标记，并填写一条可见观察。用户不必找出全部三个预设问题。

---

## Step 5：选择 Error and Uncertainty Cards

### 页面目的

将用户自己的观察与卡片分类连接起来，而不是让用户浏览全部 17 张卡后机械检查。

### 卡片呈现方式

默认先显示 **Physical Integrity** 分类下的卡片，并提供搜索和切换检查对象的入口。每张卡显示：

- 卡名；
- 一句检查问题；
- 判断等级；
- 简洁图标。

### 用户操作

1. 为每个图像标记选择一张最相关的卡；
2. 整个案例最多选择三张卡；
3. 可以选择 **No card fits this observation**；
4. 可以更换卡片或合并重复标记。

### 系统追问

每次关联卡片后显示：

> What visible detail supports this card choice?

系统自动带入上一步的观察，用户可以修改，但不能只保留卡名而没有证据说明。

### 解锁条件

至少一个标记已关联卡片或选择“No card fits”，并保留一条证据说明。

---

## Step 6：确定证据边界

### 页面目的

阻止用户把“看起来异常”扩大成无法由单张图片支持的工程或使用结论。

### 逐项判断

系统逐条展示用户的“标记 + 观察 + 卡片”，要求选择：

- **Visible in the image** — 可直接从图像确认；
- **Depends on the brief or prompt** — 需要与设计意图对照；
- **Cannot be determined from this image** — 需要其他证据。

随后出现限制式问题：

> What can you responsibly conclude?

以 Colliding Parts 为例：

- The image contains an unresolved visual overlap.
- The product cannot be manufactured.
- The product is unsafe to use.
- The AI model always produces this error.

用户可选择第一项。其他选项被选择时，系统说明它们需要制造、使用或模型层面的额外证据。

### 关键原则

系统只在结论明显越过证据边界时提供纠正，不把开放的设计判断包装成唯一标准答案。

### 解锁条件

所有已建立标记均完成证据等级选择。

---

## Step 7：选择下一步行动

### 页面目的

让错误识别形成设计行动，而不是停留在“AI 可能出错”的一般提醒。

### 问题

> What would you do before accepting this image as a design direction?

用户最多选择两项：

- Regenerate the affected area with clearer constraints
- Return to the sketch and redraw the connection
- Generate another view for comparison
- Compare the image against the original brief
- Keep the issue explicitly unresolved
- Build a quick physical or digital model
- Seek engineering validation
- Reject the entire concept immediately

### 针对案例一的合理行动范围

对于直接可见的图像缺陷，优先行动通常是局部重绘、重新生成、回到草图或生成另一视角。工程验证不是错误，但不应被描述为确认像素层面穿插所必需的第一步。

### 理由记录

用户完成一句限制式陈述：

> Before accepting this direction, I would __________ because the image shows __________.

### 解锁条件

选择至少一项行动并填写理由后，点击 **Lock My Reading**。确认后解锁 Reference Analysis。

---

## 4. Reference Analysis 页面

### 反馈原则

页面标题使用 **Compare Your Reading**，不使用 Score、Correct Answers 或 Test Result。

页面左右对照：

| Your Reading | Reference Analysis |
|---|---|
| 用户标记的位置 | 案例预设问题区域 |
| 用户的观察文字 | 中性的参考观察 |
| 用户选择的卡片 | 主要相关卡片及可接受的相邻卡片 |
| 用户的证据边界 | 参考证据边界 |
| 用户选择的行动 | 可行的下一步行动及理由 |

### 参考分析内容

#### 发现一：感应头与主体发生冲突

- **Visible Evidence:** The sensing head crosses the visible boundary of the main body and the two surfaces merge without a coherent connection.
- **Relevant Card:** Colliding Parts
- **Evidence Boundary:** The visual overlap can be observed directly. The image alone does not prove that the proposed product is unmanufacturable or unsafe.
- **Possible Next Action:** Redraw or regenerate the connection area and compare it with the intended geometry.

#### 发现二：控制部件数量不一致

- **Visible Evidence:** Two similar physical controls appear on the side of the product.
- **Relevant Card:** Component Count
- **Evidence Boundary:** The mismatch is established by comparing the image with the brief, which specifies one physical button.
- **Possible Next Action:** Return to the brief and remove or explain the additional control before continuing.

#### 发现三：外壳表面不连续

- **Visible Evidence:** A shell edge terminates abruptly and resumes with no clearly defined opening or part boundary.
- **Relevant Card:** Broken Surfaces
- **Evidence Boundary:** The discontinuity is visible, but its cause cannot be inferred from the image.
- **Possible Next Action:** Inspect another generated view or redraw the surface transition.

### 未识别全部问题时

不显示“遗漏两个错误”。改为：

> Your reading focused on one defensible issue. The reference analysis also examines two other regions. Review what evidence makes those readings possible.

### 使用不同卡片时

如果用户对同一区域选择了不同但可以合理解释的卡片，系统显示：

> A different card can be appropriate when the evidence statement is clear. Compare the inspection question and evidence boundary of both cards.

---

## 5. 关卡结束与迁移

### Completion Summary

系统生成一份简短记录：

```text
Case 01 completed

Areas inspected: [用户标记数量]
Cards used: [卡片名称]
Evidence boundary used: [三类判断记录]
Chosen next action: [行动]

Key reminder:
A polished image can contain visible geometric errors. Describe the evidence before making a broader design claim.
```

### 后续入口

- **Try Case 02** — 进入使用情境与设计逻辑案例；
- **Review Selected Cards** — 查看本案例使用过的卡片；
- **Apply to Your Image** — 将同一流程应用到个人图像；
- **Restart Case** — 清除本案例答案并重新练习。

---

## 6. 提示系统

为保持轻量认知摩擦，提示分三层逐步开放：

1. **Prompt 1 — Inspection focus**  
   “Look closely at where separate parts meet.”
2. **Prompt 2 — Region cue**  
   在图像附近显示非精确区域提示，但不圈出答案。
3. **Prompt 3 — Card shortlist**  
   显示 Colliding Parts、Component Count、Broken Surfaces 和一个干扰项。

用户主动点击 **I need a hint** 才显示提示。系统记录提示层级，但不因此扣分。

---

## 7. 功能与数据要求

### 必须保存的用户输入

- 基准选择；
- 首次关注区域；
- 图像标记坐标；
- 每条 Visible Evidence；
- 所选卡片；
- 证据边界；
- 下一步行动及理由；
- 使用的提示层级；
- 完成状态。

默认只保存在浏览器本地。除非另行获得伦理批准和明确同意，不上传个人练习数据。

### 状态要求

- 未开始；
- 进行中；
- 已完成；
- 已查看参考分析；
- 已重置。

刷新页面后应恢复到最近完成的步骤。重置前必须二次确认。

### 无障碍要求

- 图像标注除鼠标操作外，应提供键盘可访问的区域选择方式；
- 所有卡片和按钮具有清楚的文本标签；
- AI 图像提供不泄露答案的基础替代文字；
- 参考分析中的问题区域提供文字位置描述；
- 不能仅依靠颜色区分三个判断等级。

---

## 8. 本案例不应做的事情

- 不自动识别图像错误；
- 不宣称可以验证医学、安全或制造可行性；
- 不要求用户检查全部 17 张卡片；
- 不用发现数量代表设计判断能力；
- 不把参考分析描述为唯一正确解读；
- 不因用户使用提示而扣分；
- 不把明显生成缺陷与潜在设计逻辑问题混为一谈；
- 不在用户独立观察前展示答案区域或推荐卡片。

---

## 9. 案例完成标准

用户完成以下行为即视为完成关卡：

1. 阅读并确认设计意图；
2. 在无卡片提示下完成一次独立观察；
3. 标记至少一个图像区域；
4. 用可见证据支持至少一个卡片选择；
5. 对每条判断说明证据边界；
6. 选择至少一个具体下一步行动；
7. 将个人判断与参考分析进行比较。

完成标准衡量的是流程参与，而不是用问题数量或任意数字评价用户能力。
