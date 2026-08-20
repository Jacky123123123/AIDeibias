# AIDeBias Toolkit — Compact Spec

> "Design with AI, not by AI." — A debiasing tool for novice industrial designers.

---

## What It Is

Single-page web app. Designer defines their own decisions FIRST, then generates AI images. Prevents AI from anchoring their thinking.

**Tech:** Pure frontend, localStorage, hash routing. No build step.

---

## Splash Screen

Shows once per browser session. Reminds the user this is a thinking tool, not a speed tool. Click to dismiss.

---

## Navigation

Top bar: brand name + tagline ("Design with AI, not by AI.") | step stepper (Anchor / Compare / Reflection) | project switcher | settings

---

## Anchor Card — 4 Phase Workflow

### Phase 1: Expand Your View
*Define direction before seeing AI images.*

- **Design Intent** — free textarea (1000 char max). Describe what and why.
- **Style Keywords** — type + Enter to add tags (max 20, 30 char each).
- **Reference Images** — optional, up to 3 uploads.
- **Explore Design Directions** — 3 direction cards:
  1. **Organic Flow** — sculptural, fluid, nature-inspired
  2. **Technical Precision** — sharp, geometric, engineered
  3. **Minimalist Essential** — reduced, clean, understated
- Selecting a direction reveals a **reason textarea** (min 10 chars required).
- "Confirm Direction →" proceeds to Phase 2.

### Phase 2: Ground in Reality
*Make manufacturing decisions.*

- **Product Category** — dropdown (Electronics, Kitchen, Personal Care, Home, Tools, Toys, Furniture).
- **Material** — cards appear after category selected. 10 materials (ABS, PC, PP, Aluminum, etc.), each with pros/cons.
- **Process Decisions** — surface finish, parting line, wall thickness, color method, joining. Visual option buttons.
- **Constraint Review** — rules engine generates constraints. Per constraint: accept / skip / adjust. Optional full constraint library modal.
- "Confirm & Check Conflicts →" proceeds to Phase 3.

### Phase 3: Resolve Conflicts
*Detect mismatches between vision and reality.*

- **First entry only:** 3-second AI analysis animation, then conflicts appear.
- **5 conflict rules** match design keywords against materials:

| # | Conflict | Confidence |
|---|----------|------------|
| 1 | Seamless vs. Parting line | 95% |
| 2 | Sharp geometry vs. Draft angles | 90% |
| 3 | Ultra-thin vs. Mold filling | 70% |
| 4 | Organic forms vs. CNC limits | 85% |
| 5 | High-gloss vs. Scratches | 60% |

- **Each conflict card:** title, description, *source explanation* (why this exists), *confidence bar* (%), visual comparison (intent vs. reality), preset resolution buttons, PLUS a **rebuttal area** ("This conflict doesn't apply to my design").
- **Rebutting:** Write reason → auto-accepted (demo mode). Card greys out, shows "✓ Resolved — you overruled this."
- **Preset resolution:** Click a button → highlighted with ✓.
- "Complete Anchor →" when all conflicts resolved.

### Phase 4: Completion
*Review and generate AI images.*

- Summary grid: intent, direction, material, constraints count, conflicts resolved, reason.
- "Edit Anchor" to go back.
- **AI Image Generation:** Auto-generated prompt (synthesized from all anchor data) in editable textarea. API token input. Generate / Regenerate buttons. Seed display. Loading spinner. Result image. Error + retry.
- Calls ModelScope Z-Image-Turbo via local CORS proxy (port 3099).

---

## Contextual Hint Sidebar

Always visible next to the anchor card. Hint text changes based on which field/zone the user is interacting with (focus or click). 14 zones, each with a friendly, encouraging hint in conversational English.

---

## Supporting Features

- **Multi-project** — create/rename/delete projects, each with own anchor data.
- **Auto-save** — 500ms debounce to localStorage.
- **Constraint library modal** — browse all constraints beyond material defaults.
- **Toast notifications** — non-blocking status messages.

---

## Data (localStorage, `ae:` prefix)

- `ae:projects[]` — project list
- `ae:anchorCard:{id}` — per-project anchor data
- `ae:apiToken` — ModelScope token
- `ae:customConstraints` — user-defined constraints

**Anchor card object:** designIntent, styleKeywords[], referenceImages[], designDirection{id,name,reason}, productType, selectedMaterial{id,name}, processDecisions{}, constraints[], resolvedConflicts[{conflictId, resolutionId, rebuttalText?}]

---

## Limitations

- Compare and Reflection pages not yet built
- ModelScope free tier may be unreliable
- CORS proxy must run separately
- No server-side persistence
- Demo mode: all rebuttals auto-accepted

---

## Design Tone

Warm, encouraging, designer-led. Not cold efficiency. The designer decides; AI assists. Progressive disclosure of complexity. Trustful, never condescending.
