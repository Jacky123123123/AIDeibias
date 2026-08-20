# AI Concept Image Toolkit Website Requirements

> Scope note: this document defines content, information architecture, functionality, interaction, data, privacy, accessibility and evaluation requirements. Visual styling and CSS implementation are defined separately in `AIDeBias-Design-System.md` and are intentionally excluded here.

## 1. Project Summary

### Working title

**Critical Reading Before Commitment**  
An educational toolkit for critically interpreting AI-generated product concept images.

### Website purpose

The website is the digital companion to a physical card-based toolkit. It should help design students and early-career designers:

1. understand what AI-generated images can support;
2. recognise visible errors, potential design-logic gaps and unverified claims;
3. practise critical interpretation through worked cases;
4. apply the framework to their own AI-generated product image;
5. record an evidence-aware decision and next action.

The website is **not** an AI image generator, prompt platform, engineering checker or automatic design-quality evaluator. It should remain model-independent and usable alongside different AI image tools and personal workflows.

### Primary audience

- industrial-design and product-design students;
- early-career designers beginning to use generative imagery;
- designers who use polished AI outputs before developing a stable image-review routine;
- educators introducing critical AI-image literacy in design courses.

### Core proposition

> Before accepting a polished AI image as a design direction, identify what the image visibly supports, what it encourages you to assume, and what remains unresolved.

---

## 2. Overall Information Architecture

The website contains **seven main sections** presented through a persistent navigation system.

| No. | Section | Toolkit role |
|---|---|---|
| 01 | Project Overview | Introduce the project and physical toolkit |
| 02 | AI Capability Cards | Calibrate expectations of AI-image capabilities |
| 03 | Error and Uncertainty Cards | Provide critical-reading categories and prompts |
| 04 | Case Challenges | Practise recognising issues in prepared examples |
| 05 | Apply to Your Image | Annotate and analyse a personal AI concept image |
| 06 | Decision and Next Action | Convert reflection into a recorded design decision |
| 07 | Creator and Project Information | Present authorship, research context and sources |

### Recommended website structure

Use one coherent website with seven clear sections or routes. A desktop user should be able to move between sections using a persistent top or side navigation. On mobile, use a compact menu and a visible progress indicator.

Recommended navigation labels:

```text
Overview
Capabilities
Read the Image
Cases
Your Image
Decision
About
```

The five toolkit components should also form a visible learning sequence:

```text
Capability Calibration
        ↓
Error and Uncertainty Recognition
        ↓
Case-based Practice
        ↓
Application to a Personal Image
        ↓
Decision and Next Action
```

Users may browse cards freely, but the website should recommend this sequence to first-time users.

---

## 3. Section 01 — Project Overview

### Purpose

Introduce the research problem, intended audience, toolkit structure and physical outcome without turning the first screen into a marketing landing page.

### First viewport

The first viewport should immediately communicate:

- project title;
- one-sentence proposition;
- target users;
- a direct entry to the toolkit;
- the physical toolkit as a visible project outcome.

Suggested opening copy:

> AI-generated product images can look resolved before the design is resolved. This toolkit helps designers distinguish visible evidence, implied design claims and unresolved decisions before committing to a direction.

### Physical toolkit photography

Place one high-resolution photograph of the complete physical toolkit directly after the opening project summary, or allow part of it to remain visible at the bottom of the first viewport.

The photograph should show:

- the complete card set;
- card fronts and backs where possible;
- packaging or storage format;
- the cards at a realistic usable scale;
- a clean working context without excessive decorative props.

Required image versions:

- wide desktop image;
- portrait/mobile crop;
- close-up image showing print and card details;
- descriptive alt text.

### Supporting overview content

- concise problem framing;
- intended use moment: before accepting an AI image as a direction;
- five-part toolkit diagram;
- physical and digital components;
- clear limitation statement: the toolkit supports judgement but does not verify design correctness.

### Main actions

- `Start with Capabilities`
- `Browse the Toolkit`
- optional: `View the Physical Toolkit`

---

## 4. Section 02 — AI Capability Cards

### Purpose

Help users understand what AI-generated imagery can support in design and what each capability cannot establish as evidence.

### Capability set

1. **Externalise an Idea**
2. **Open Up Possibilities**
3. **Develop a Starting Point**
4. **Explore Visual Variables**
5. **Contextualise a Concept**

`Communicate a Direction` should appear as a cross-cutting use label rather than a separate capability.

### Card browsing interface

Each digital card should use the same content identity as the corresponding physical card. Users should be able to:

- browse all five cards in a stable grid or horizontal card browser;
- open or flip a card without changing the surrounding layout;
- view a real or research-based input–output example;
- understand the capability in one short statement;
- reveal the evidence boundary;
- move directly to a relevant case challenge.

### Digital card content

**Front**

- capability name;
- one-sentence purpose;
- input → output visual;
- capability icon;
- optional cross-cutting use label.

**Back / expanded view**

- `It can support`;
- `It cannot prove`;
- `Notice what changed`;
- one practical question;
- example source or attribution.

### Required content and assets

- five capability icons;
- five primary input–output examples;
- optional secondary examples;
- front and back card artwork;
- concise English card text;
- source links for research examples.

---

## 5. Section 03 — Error and Uncertainty Cards

### Purpose

Provide a structured vocabulary for reading AI-generated product images without treating every uncertainty as a confirmed AI error.

### Dual-axis framework

The website should make the two-axis logic visible but easy to understand.

**Axis 1 — What is being inspected?**

- Physical Integrity
- Attributes and Relationships
- Human and Use
- Design Logic
- Evidence Claims

**Axis 2 — How certain can the judgement be?**

- Observable Error
- Potential Logic Gap
- Unverified Claim

The matrix should function as both an explanation and a filter. Selecting a row, column or matrix cell should reveal the relevant cards.

### Initial card set

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

### Filtering and browsing

Users should be able to filter cards by:

- inspection focus;
- judgement level;
- keyword;
- relevance to the current case or uploaded image.

The interface should show active filters clearly and provide an obvious reset action.

### Digital card content

**Front**

- memorable card title;
- Chinese helper name if bilingual presentation is retained;
- short recognition question;
- example image with one or two annotations;
- `Look for` cues;
- inspection-focus and judgement-level labels.

**Back / expanded view**

- `What it means`;
- `Evidence boundary`;
- `What to do next`;
- related case challenges;
- research basis or source note.

### Judgement-level icons

Provide three consistent category icons:

- Observable Error;
- Potential Logic Gap;
- Unverified Claim.

Their visual treatment is governed by `AIDeBias-Design-System.md`.

---

## 6. Section 04 — Case Challenges

### Purpose

Allow users to practise the framework on prepared examples before analysing their own work.

### Case structure

Each case should contain:

- short design brief or intention;
- original prompt, sketch or reference input where available;
- AI-generated product image;
- task question;
- selectable Error and Uncertainty Cards;
- optional image annotation;
- user reasoning field;
- revealable reference analysis.

### Recommended interaction

1. Read the brief or intention.
2. Inspect the image without seeing the answer.
3. Select up to three relevant cards.
4. Mark one or more image regions.
5. classify each observation as visible evidence, a potential gap or an unverified claim.
6. Write or select a next action.
7. Reveal the reference analysis.
8. Compare reasoning rather than receiving only a numerical score.

### Feedback design

Do not reduce the task to correct/incorrect scoring. Feedback should explain:

- what is directly observable;
- what depends on the prompt or brief;
- what cannot be determined from the image;
- what evidence or design activity would be needed next.

### Case library requirements

Include cases of varied difficulty:

- obvious visual defect;
- prompt or attribute mismatch;
- cross-view inconsistency;
- unrealistic user action;
- form–function mismatch;
- polished image containing an unverified ergonomic or feasibility claim;
- mixed case containing more than one judgement level.

Each case should retain source, model, generation date, prompt and editing history where possible.

---

## 7. Section 05 — Apply to Your Image

### Purpose

Transfer the learning framework from prepared cases to the user's own AI-generated product concept image.

### Core workflow

1. Upload or drag in an image.
2. Add a brief optional intention anchor.
3. Select one to three relevant cards.
4. Place annotations on the image.
5. classify each annotation using the three-part reasoning framework.
6. record what evidence is still required.

### Three annotation labels

#### Visible Evidence

What can be directly observed in the image?

#### Implied Design Claim

What does the image encourage the viewer to believe?

#### Unresolved Decision

What remains unsupported, undecided or in need of further design work?

### Annotation behaviour

Users should be able to:

- zoom and pan without losing annotations;
- add, move, edit and delete markers;
- connect a marker to an Error and Uncertainty Card;
- change the judgement level;
- add a short note;
- hide and show annotation categories;
- reset the activity after confirmation.

### Privacy requirement

The default prototype should process uploaded images locally in the browser and clearly state that images are not uploaded or stored externally. If server storage is later introduced, explicit consent and a retention policy will be required.

### Empty and failure states

- no image selected;
- unsupported image format;
- image too large;
- accidental navigation with unsaved analysis;
- no relevant card found;
- `Cannot determine from this image` option.

---

## 8. Section 06 — Decision and Next Action

### Purpose

Convert critical reflection into an explicit design decision rather than ending with a list of problems.

### Decision options

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

### Decision record

The final record should include:

- selected decision;
- short rationale;
- highest-priority unresolved issue;
- evidence or activity required next;
- cards used;
- optional screenshot of the annotated image;
- date and project name.

Suggested sentence structure:

> I will **[keep / modify / compare / reject]** this direction because **[reason]**. Before proceeding, I need **[evidence or next action]**.

### Output options

For the prototype, support:

- print-friendly summary;
- export as image or PDF if technically feasible;
- copyable text summary;
- restart or return to the annotated image.

Do not present the result as an AI-generated quality score or formal design approval.

---

## 9. Section 07 — Creator and Project Information

### Purpose

Provide concise authorship, academic context, transparency and contact information.

### Required content

- creator name: Jianyi Wang;
- programme and institution;
- project title;
- supervisor and project context where appropriate;
- short creator biography;
- project motivation;
- development timeline or selected process images;
- acknowledgement of formative participants without identifying them;
- AI-use statement;
- contact or portfolio link;
- version number and last-updated date.

### Research transparency

Include separate, readable links or expandable sections for:

- research basis;
- references;
- limitations;
- ethics and participant-research statement;
- image and case-study attributions;
- generative-AI disclosure.

### Key limitation statement

> The toolkit supports critical interpretation. It does not verify usability, ergonomics, safety, manufacturability or overall design quality.

---

## 10. Device Support and Accessibility Requirements

### Device support

- all seven sections and core workflows must remain usable on desktop, tablet and mobile;
- card browsing, filtering, image upload, annotation and decision recording must remain available on supported screen sizes;
- no essential content or action may depend only on hover;
- annotation data must remain stable when orientation or viewport size changes.

### Accessibility

- keyboard-operable cards, filters and annotation controls;
- visible focus states;
- alt text for physical-toolkit photography and case images;
- labels for icons and unfamiliar controls;
- reduced-motion support;
- semantic headings and landmark navigation.
- category meaning must not depend on colour alone;
- errors and validation messages must be programmatically associated with the relevant control.

---

## 11. Content and Data Structure

Store card and case content separately from page layout so categories and wording can be revised after testing.

### Suggested capability-card fields

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

### Suggested error-card fields

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

### Suggested case fields

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

## 12. Prototype Scope and Priorities

### Must-have for the first complete version

- all seven sections;
- physical toolkit photograph;
- five digital Capability Cards;
- searchable/filterable Error and Uncertainty Cards;
- visible dual-axis matrix;
- at least three complete Case Challenges;
- local image upload;
- three annotation types;
- selection of next action;
- printable or copyable decision summary;
- About, references and limitations.

### Should-have

- card-to-case cross-links;
- progress indicator;
- save session locally;
- export annotated image;
- bilingual helper labels;
- complete mobile access to the core workflow.

### Later or optional

- educator mode;
- larger case library;
- delayed transfer exercise;
- anonymised research logging after ethics approval;
- account system or cloud saving;
- integration with external AI image tools.

### Explicitly out of scope

- built-in AI image generation;
- automatic defect detection;
- automated design-quality score;
- manufacturing certification;
- mandatory universal design workflow;
- replacing sketching, user research or engineering validation.

---

## 13. Required Asset Checklist

- [ ] project title and final one-sentence proposition
- [ ] high-resolution physical toolkit photography
- [ ] toolkit component diagram
- [ ] five Capability Card front designs
- [ ] five Capability Card back designs
- [ ] five capability icons
- [ ] 17 Error and Uncertainty Card fronts
- [ ] 17 Error and Uncertainty Card backs
- [ ] three judgement-level icons
- [ ] at least three complete case-image sets
- [ ] case prompts, briefs and reference analyses
- [ ] creator portrait or appropriate profile image
- [ ] creator biography and contact details
- [ ] references and image attributions
- [ ] AI-use and limitation statements
- [ ] privacy statement for uploaded images
- [ ] mobile crops and alt text for major images

---

## 14. Evaluation Questions for the Website

The website prototype should later be evaluated against the following questions:

1. Can users understand the five-part toolkit structure?
2. Can users distinguish Observable Error, Potential Logic Gap and Unverified Claim?
3. Can users find a relevant card without reading all 17 cards?
4. Do the case challenges prepare users to analyse an unseen image?
5. Can users distinguish visible evidence from an implied design claim?
6. Does the final decision record contain a concrete next action or evidence need?
7. Does the website support reflection without becoming a burdensome checklist?
8. Do users understand that the toolkit does not verify design correctness?
