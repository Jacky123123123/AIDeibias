# AIDeBias Toolkit — Functional Specification

> **Tagline:** Design with AI, not by AI.
>
> A lightweight web-based design assistant that helps novice industrial designers debias AI-assisted styling exploration. The toolkit forces designers to make their own decisions *before* seeing AI-generated images, preventing the first pretty AI rendering from anchoring their thinking.

---

## 1. Application Overview

- **Type:** Pure frontend Single Page Application (SPA)
- **Persistence:** Browser localStorage (no server required)
- **Routing:** Hash-based (`#/anchor`, `#/compare`, `#/reflect`)
- **API Integration:** ModelScope Z-Image-Turbo for AI image generation (via local CORS proxy on port 3099)
- **Language:** English (all UI text)

---

## 2. Splash Screen

**Trigger:** On first visit each browser session.

**Content:**
- App logo/icon
- App name: "AIDeBias Toolkit"
- Tagline: "Design with AI, not by AI."
- Friendly reminder paragraph:
  > "Friendly reminder: this toolkit is not designed to speed up your workflow. It is here to help you **think more clearly** and **collaborate with AI intentionally** — on your own terms."
- Button: "I understand — let's begin"
- Dismissal is remembered via sessionStorage for the current browser session

---

## 3. Navigation

A top navigation bar containing:
- **Brand name + tagline** (left side)
- **Step indicators:** Anchor → Compare → Reflection (Compare and Reflection are marked "Coming soon")
- **Project selector dropdown** (for managing multiple design projects)
- **Settings button** (for API token configuration)

---

## 4. Anchor Card Workflow (Main Feature)

The anchor card is a multi-phase workflow. Progress is tracked by a 4-dot stepper at the top. The designer cannot skip phases — decisions build on each other.

### Data Model

Each anchor card stores:
- `designIntent` — free-text description
- `styleKeywords` — array of keyword strings
- `referenceImages` — up to 3 base64-encoded image data URIs
- `designDirection` — `{ id, name, reason }` — which of 3 design philosophies was chosen and why
- `productType` — selected product category ID
- `selectedMaterial` — `{ id, name }` of the chosen material
- `processDecisions` — `{ decisionId: optionId }` map of manufacturing choices
- `constraints` — array of constraint objects with `confirmed`/`skipped`/`adjusted` status
- `resolvedConflicts` — array of `{ conflictId, resolutionId, rebuttalText? }` records

### Phase 1: Expand Your View

**Purpose:** Define the design direction before seeing any AI-generated images. This prevents anchoring bias.

**Banner heading:** "Expand Your View"
**Banner subtext:** "Before looking at any AI-generated styling, define your design direction. This prevents being anchored to the first pretty image you see."

**Sections (no enforced order, all visible at once):**

#### a) Design Intent
- Free-text textarea (max 1000 characters)
- Placeholder: "e.g., A portable coffee cup for young professionals. One-hand operation, easy to clean, fits car cup holders, keeps drinks warm for 2+ hours..."
- Character counter displayed below

#### b) Style Keywords
- Keyword input component: type a word, press Enter or comma to add it as a tag
- Each keyword appears as a removable tag/chip
- Max 20 keywords, each max 30 characters

#### c) Reference Images (Optional)
- Up to 3 image uploads
- Each uploaded image shows as a thumbnail with a remove button
- "Add Image" button opens file picker (accepts image/*)

#### d) Explore Design Directions
- Subtitle: "Compare all three before choosing — there is no 'best' option"
- Three design direction cards displayed in a grid. Each card shows:
  - A simple SVG icon/illustration representing the design philosophy
  - Direction name
  - Visual description (what designs in this direction look like)
  - Up to 4 style keyword tags
  - Suitable product types indicator

  **The three design directions:**

  1. **Organic Flow** — Continuous, sculptural surfaces inspired by nature. Fluid transitions, no sharp corners. Suitable for: consumer goods, furniture, personal care products.
  2. **Technical Precision** — Sharp, geometric, defined. Crisp edges, planar surfaces, engineered aesthetic. Suitable for: tools, electronics, professional equipment.
  3. **Minimalist Essential** — Reduced to the necessary. Clean silhouettes, hidden complexity, understated elegance. Suitable for: home goods, lifestyle accessories, premium packaging.

- Clicking a direction card selects it and reveals a **reason textarea**:
  - Label: "Why did you choose this direction? (required, min 10 characters)"
  - Placeholder: "I chose this direction because..."
- "Confirm Direction →" button (disabled until reason ≥ 10 characters, and a direction is selected)

### Phase 2: Ground in Reality

**Purpose:** Translate the design vision into real-world manufacturing decisions. Beautiful forms only matter if they can be made.

**Banner heading:** "Ground in Reality"
**Banner subtext:** "Beautiful forms only matter if they can be manufactured. Each material has trade-offs — understand them before you commit."

**Sequential sub-steps (each revealed after previous is completed):**

#### a) Product Category
- Dropdown select with options like:
  - Consumer Electronics (phones, headphones, speakers)
  - Kitchen & Dining (cups, bottles, containers)
  - Personal Care (trimmers, brushes, dispensers)
  - Home & Office (lamps, organizers, stationery)
  - Tools & Hardware (drills, measuring tools, handles)
  - Toys & Recreation (building blocks, puzzles, game accessories)
  - Furniture & Lighting (chairs, tabletop items, lamps)

#### b) Material Options
- Appears after product category is selected
- Shows material cards for recommended materials based on the product type
- Materials database includes: ABS, Polycarbonate (PC), PC+ABS blend, Polypropylene (PP), PA Nylon, Aluminum, Stainless Steel, Silicone, Wood, Glass
- Each material card shows:
  - Visual swatch (texture/color hint)
  - Material name
  - Advantages (✓ list)
  - Disadvantages (✗ list)
  - Process decisions required (revealed after selection)

#### c) Process Decisions
- Appears after a material is selected
- Manufacturing decisions specific to the chosen material, e.g.:
  - Surface finish (matte, gloss, textured, soft-touch)
  - Parting line placement (bottom, side, hidden, feature)
  - Wall thickness (thin, standard, thick)
  - Color strategy (in-mold, painted, anodized, natural)
  - Joining method (snap-fit, screws, adhesive, overmold)
- Each decision presented as a question with visual option buttons
- Selected options highlighted

#### d) Constraint Review
- Rules engine generates constraints based on material + product type
- Each constraint shows:
  - Category + value (e.g., "Min Wall Thickness: 2mm")
  - "RULE" badge indicating it comes from the rules engine
  - Optional scale visualization for numerical constraints
  - **Why** explanation
  - **Alternative** suggestion (if applicable)
- Three actions per constraint:
  - **Accept** — confirms the constraint
  - **Skip** — marks as acknowledged but not applicable
  - **Adjust** — allows the user to modify the constraint value
- "Browse Full Constraint Library (Optional)" button opens a modal with additional constraints
- Counter: "X of Y constraints reviewed"
- "Confirm & Check Conflicts →" button (enabled when constraints have been reviewed)

### Phase 3: Resolve Conflicts

**Purpose:** Detect mismatches between design vision and manufacturing reality, then let the designer decide how to handle them.

**Banner heading:** "Resolve Conflicts"
**Banner subtext:** "Your design vision and manufacturing reality may not align perfectly. Let's find the gaps and address them."

**Entry:** On first visit to Phase 3, a 3-second loading animation plays:
- Animated icon (rotating clock)
- "Analyzing your design decisions..." heading
- "Cross-referencing design language with material capabilities" subtext
- Animated progress bar filling from left to right
- Step indicators: "Mapping design keywords" → "Checking material constraints" → "Detecting conflicts"
- After 3 seconds, conflicts appear. The animation does not replay on subsequent visits to Phase 3.

#### Conflict Rules Engine

Conflicts are detected by matching:
- Design direction keywords (e.g., "seamless", "sharp", "organic")
- Material ID (e.g., "abs", "aluminum")

**The five conflict rules:**

| # | Conflict | Trigger Keywords | Trigger Materials | Confidence |
|---|----------|-----------------|-------------------|------------|
| 1 | Seamless design vs. Parting line reality | seamless, unibody, monolithic, smooth, continuous | ABS, PC, PP, PA Nylon, PC+ABS | 95% |
| 2 | Sharp geometry vs. Draft angle requirements | sharp, angular, geometric, crisp, precise, defined | ABS, PC, PP, PA Nylon, PC+ABS | 90% |
| 3 | Ultra-thin design vs. Mold filling limits | slim, thin, lightweight, minimal, compact, delicate | ABS, PC, PC+ABS, PA Nylon | 70% |
| 4 | Organic forms vs. Metal machining limits | organic, curved, flowing, biomorphic, natural, sculptural | Aluminum | 85% |
| 5 | High-gloss finish vs. Scratch sensitivity | glossy, polished, mirror, refined, luxury | PC, ABS, PC+ABS | 60% |

#### Each Conflict Card Shows:

1. **Conflict number** (e.g., "Conflict 1 of 3")
2. **Title** (e.g., "Seamless design vs. Parting line reality")
3. **Brief description** of the conflict
4. **Source explanation** — a detailed paragraph explaining *why* this conflict exists, in educational, non-technical language
5. **Confidence indicator** — a progress bar + percentage + label:
   - ≥90%: "Very High"
   - ≥75%: "High"
   - ≥50%: "Moderate"
   - <50%: "Low"
6. **Visual comparison** — two side-by-side icons: "Your Design Intent" (dashed creative box) vs. "Manufacturing Reality" (solid constrained box)
7. **Resolution options** — preset buttons for handling the conflict (e.g., "Hide parting line on bottom/rear", "Switch to silicone overmolding", "Make the line a design feature", "Accept the visible line")
8. **Rebuttal area** (below a "── or ──" divider):
   - Prompt: "This conflict doesn't apply to my design:"
   - Textarea for the user to explain why
   - "Submit Rebuttal" button
   - In the demo version, any non-empty rebuttal text is automatically accepted as valid

#### Resolution States:

- **Preset resolution selected:** Button highlighted with ✓ checkmark
- **Rebutted:** The entire conflict card becomes greyed out. A green "✓ Resolved — you overruled this conflict" message appears, showing the user's reason in italics.
- A conflict is considered "resolved" if it has either a preset resolution OR a rebuttal

#### Footer:
- Summary line: "✓ X constraints reviewed  ⚠ Y conflicts (Z resolved)"
- "Complete Anchor →" button (enabled only when ALL conflicts are resolved)

### Phase 4: Completion

**Purpose:** Review the completed anchor and generate AI concept images based on the designer's own decisions.

**View when entering:**
- Large ✓ icon
- "Anchor Complete" heading
- Subtext: "Your design direction is defined and grounded in reality. Ready for AI styling exploration."
- Summary grid showing:
  - Design Intent excerpt
  - Design Direction name
  - Material name
  - Number of confirmed constraints
  - Number of conflicts resolved
  - "Why this direction:" — the user's reason text
- "Edit Anchor" button (returns to Phase 1)

#### AI Image Generation Section:

- Heading: "AI Image Generation"
- Subtitle: "Powered by ModelScope Z-Image-Turbo"
- **Auto-generated prompt** — a textarea pre-filled with a prompt synthesized from all anchor card data:
  - Product type + design intent
  - Design direction name + style keywords
  - Material visual description (rich CMF details)
  - Manufacturing process visual descriptions
  - Negative prompts for the material (to prevent wrong material appearance)
  - Rendering specifications (product photography, white background, studio lighting, 3/4 angle)
- The prompt is editable — the designer can refine it
- **API Token input** — password field for ModelScope API token, with "Save" button (stored in localStorage)
- **Generate Image** button
- **Regenerate** button (randomizes seed)
- Seed display (current seed number)
- **Loading state:** Spinner + "Generating... this may take 5-15 seconds"
- **Result:** Generated image displayed at 1024×1024
- **Error state:** Error message with retry option

#### Image Generation Technical Flow:
1. POST to ModelScope API with async mode (`X-ModelScope-Async-Mode: true`)
2. Receive `task_id`
3. Poll `GET /v1/images/generations/{task_id}` every 2 seconds
4. Handle states: PENDING → RUNNING → SUCCEED (show image) / FAILED (show error)
5. Uses local CORS proxy (localhost:3099) because ModelScope doesn't support browser CORS

---

## 5. Contextual Hint Sidebar

A sidebar panel that shows helpful, encouraging tips to the novice designer. The hint updates based on **which area the user is currently interacting with** (not based on phase alone).

- The sidebar is always visible alongside the anchor card
- Hint text updates when the user focuses on or clicks a different zone
- Text transition uses a brief fade animation
- All hints are in warm, encouraging, conversational English — not technical or intimidating

**Hint text by interaction zone:**

| Zone | Hint |
|------|------|
| **Design Intent textarea** | "Describe what you want to design and why. Don't overthink it — just write what comes to mind. This is your raw creative space, no judgment." |
| **Style Keywords input** | "Add words that capture the feeling of your design. Think about mood, style, era, or visual language. Press Enter or comma after each word." |
| **Reference Images area** | "Reference images are totally optional — use them to communicate a vibe or aesthetic. Skip this if you don't have any on hand." |
| **Design Directions cards** | "Browse the three design directions. Each one represents a different philosophy. Pick whichever resonates — there's no 'best' choice here." |
| **Direction Reason textarea** | "Why did this direction speak to you? Your intuition matters — jot down your reasoning. There are no wrong answers." |
| **Product Category select** | "Pick the closest product type to ground your concept in reality. Not an exact match? No worries — just choose the nearest one." |
| **Material cards** | "Each material has unique aesthetics and manufacturing implications. Think about what your product would actually be made from. Trade-offs are normal!" |
| **Process Decisions** | "Manufacturing choices affect how your product will look and feel. Each option leaves different visible traces on the final surface." |
| **Constraint items** | "Review each constraint one at a time. Accept, skip, or adjust — these real-world limits make design interesting, not restrictive." |
| **Conflict cards** | "Design conflicts happen when vision meets reality. That's a good sign — it means you're thinking deeply. Choose what best serves your concept." |
| **No conflicts view** | "Your design direction and material choices are well aligned. Nice work thinking through the details! You're ready to visualize your concept." |
| **Completion / Summary** | "You've done the hard work — defining your design on your own terms before AI influenced you. Now let's turn your anchor into a visual concept." |
| **Prompt textarea** | "This prompt was generated from your anchor decisions. Edit it to fine-tune what you want the AI to render. You're in control." |
| **Generate button area** | "Ready to see your design? Click Generate and your carefully-made decisions will be turned into a visual concept rendering." |

---

## 6. Supporting Features

### Project Management
- Multiple named projects stored in localStorage
- Create, rename, delete projects
- Each project has its own anchor card data
- Active project shown in navbar dropdown

### Constraint Library (Modal)
- Full browsable library of design/manufacturing constraints beyond material defaults
- AI-powered constraint suggestions (in complete version)
- Toggle constraints on/off
- Search/filter by category
- Confirm selection to add to anchor card

### Auto-Save
- All anchor card changes auto-saved to localStorage after 500ms debounce
- Brief "Saved" indicator appears on each save

### Toast Notifications
- Non-blocking notifications for save confirmations, errors, etc.

---

## 7. Data Architecture

### localStorage Keys (prefixed with `ae:`)
- `ae:projects` — array of project objects
- `ae:activeProjectId` — currently selected project
- `ae:anchorCard:{projectId}` — anchor card data per project
- `ae:customConstraints` — user-defined constraints
- `ae:apiToken` — ModelScope API token (saved from settings)

### Key Data Structures (Conceptual)

**Material entry:**
```
id, name, advantages[], disadvantages[], processDecisions[], constraints[]
```

**Constraint entry:**
```
id, category, label, value, why, alternatives?, scale{min, max, optimal, lowLabel, highLabel}
```

**Design Direction:**
```
id, name, visualDesc, keywords[], suitable[], svgPath, svgViewBox
```

---

## 8. Current Limitations

- **Compare** and **Reflection** pages are stubs (Coming soon)
- AI image generation depends on ModelScope API availability (free tier, may be unreliable)
- No real AI backend for constraint suggestions or rebuttal evaluation (demo-mode accepts all rebuttals)
- No server-side persistence — all data in browser localStorage
- CORS proxy must be running separately (`node proxy.js` on port 3099) for image generation

---

## 9. Design Philosophy Notes

The entire UI should communicate:
- **Warmth, not cold efficiency** — this is a thinking tool, not a productivity tool
- **Encouragement, not judgment** — the designer is learning, not being evaluated
- **Agency, not automation** — the designer makes choices; AI assists, never replaces
- **Clarity, not clutter** — each step has a clear purpose; complexity is revealed progressively
- **Trust, not skepticism** — the tone is supportive, never condescending

The sidebar hints, splash screen reminder, and conflict rebuttal feature are all expressions of this philosophy.
