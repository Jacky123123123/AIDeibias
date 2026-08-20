# Case Challenge 01 Image Prompts

## Asset Set

The case requires three generated source images:

1. an initial concept sketch shown with the design intention;
2. one polished but deliberately flawed AI concept image used in the challenge;
3. one corrected comparison image revealed only after the user submits their reading.

The three defect close-ups used in the reference analysis should be cropped from Image 2. They should not be generated separately, because regenerated close-ups may introduce different geometry and weaken the evidential link to the challenge image.

Use the same product proportions, three-quarter viewpoint, white background and restrained white-and-grey colour scheme across all three images. A fixed seed or image-reference workflow is recommended where available.

---

## Image 1 — Initial Concept Sketch

### Purpose

This image establishes the designer's starting intention before the polished AI rendering appears. It must clearly show one sensing head, one side button and a continuous body, without looking like a resolved final product.

### Prompt

```text
Create an early-stage industrial design concept sketch of a compact handheld health scanner for home use. Show a single continuous handheld body, one circular sensing head at the front, exactly one physical button on the side, and one small status-light indicator. Use a three-quarter front view on a clean white sketchbook background. Draw with loose but intentional black pencil and grey marker lines, including a few light construction lines and small exploratory contour variations. The form should be calm, approachable and easy to hold, but still visibly unresolved and preliminary. Keep the sketch readable and modest rather than presentation-perfect. No hands, no user, no annotations, no written labels, no logos, no dimensions, no exploded view, no extra buttons, no duplicated parts and no photorealistic rendering.
```

### Why this image is needed

It gives the user a visual baseline for the original design intention and makes it possible to compare the later AI image against something more concrete than a written prompt alone.

---

## Image 2 — Main Challenge Image: Polished but Structurally Inconsistent

### Purpose

This is the image the user must inspect. It should appear persuasive and professionally rendered at first glance while containing three local, directly observable defects. The defects must be noticeable under close inspection but should not turn the whole image into an obvious parody.

### Prompt

```text
Create a highly polished photorealistic industrial design concept render of a compact handheld health scanner for home use. Show the product alone in a three-quarter front view against a clean light-grey studio background. The intended product has a calm matte-white continuous shell, a soft-grey circular sensing head at the front, a small status light, and a compact ergonomic handheld proportion. Use soft professional studio lighting, crisp product-photography detail and a convincing premium design presentation.

Deliberately include exactly three visible generative-design defects while keeping the overall image attractive and apparently finished:

1. COLLIDING PARTS: where the circular sensing head meets the main body, make part of the circular head visibly penetrate through and fuse into the outer shell. The two surfaces must overlap with an impossible, incoherent boundary rather than forming a clean joint. Keep this defect local to the front connection area.

2. COMPONENT COUNT: place two nearly identical physical buttons next to each other on the same side of the body, even though the intended design requires exactly one side button. Both buttons must be clearly visible and look like unintended duplicates, not a deliberate plus-and-minus control pair.

3. BROKEN SURFACE: on the lower grip area, interrupt the otherwise continuous shell with an abrupt broken contour. Include a short edge that stops, leaves an unexplained narrow gap or torn seam, and then resumes without forming a legitimate opening, panel or part boundary.

These three defects are intentional evidence for a critical-reading exercise. Do not correct, conceal or rationalise them. Do not add any other major defect. The product must remain recognisable as one coherent health scanner, with normal scale and a plausible overall silhouette. No hands, no person, no medical claims, no readable interface text, no brand logo, no labels, no arrows, no annotations, no exploded view, no multiple products and no dramatic background.
```

### Why each defect is needed

#### Colliding Parts

This defect trains the user to identify a directly visible geometric conflict without immediately turning it into an unsupported claim about manufacturing or safety. It corresponds to the **Colliding Parts** card and the judgement level **Observable Error**.

#### Component Count

This defect can only be established fully by comparing the image with the stated design intention of one physical button. It demonstrates that some observable mismatches depend on a brief or prompt as a comparison baseline. It corresponds to **Component Count**.

#### Broken Surface

This defect trains close inspection of a polished shell. The user can state that the surface is visually discontinuous, but cannot infer why it happened from the image alone. It corresponds to **Broken Surfaces**.

### Optional negative prompt

```text
cartoon, illustration, rough sketch, low resolution, blurry image, distorted entire product, extra products, extra sensing heads, deliberate dual-button control system, plus and minus symbols, readable text, labels, annotations, arrows, hands, people, hospital scene, transparent body, exploded view, exposed electronics, extreme damage, cracked product, manufacturing diagram, logo, watermark
```

### Generation note

If the model keeps correcting the defects, generate the clean product first and use local inpainting for the three regions. Preserve the rest of the product between edits. The duplicated buttons should be edited first, followed by the front overlap and then the broken grip surface.

---

## Image 3 — Corrected Comparison Image

### Purpose

This image appears only in the reference-analysis or completion screen. It demonstrates what resolving the three image-level defects could look like. It is not presented as the final or objectively correct product design.

### Prompt

```text
Create a corrected photorealistic industrial design concept render of the same compact handheld health scanner shown in the reference image. Preserve the same product identity, proportions, three-quarter front viewpoint, matte-white and soft-grey colour scheme, studio lighting and clean light-grey background.

Resolve only the three local image defects: connect the circular sensing head to the main body with a clear and coherent joint with no penetration or fused surfaces; show exactly one physical side button; and make the lower grip shell continuous and intact with no abrupt gap, torn seam or broken contour. Keep one small status light. The result should remain a concept image rather than proof of comfort, safety, medical accuracy or manufacturability. No hands, no person, no text, no labels, no arrows, no logo, no exploded view and no additional controls.
```

### Why this image is needed

It helps the user see the difference between correcting visible image evidence and validating the wider product proposition. The interface should state that a visually corrected image still does not verify ergonomics, safety, technical feasibility or medical performance.

---

## Reference-Analysis Crops

Create three crops from Image 2 after the main image is final:

| Crop | Source area | Recommended content |
|---|---|---|
| A | Front sensing-head connection | Include both the circular head edge and enough main-body surface to make the overlap legible. |
| B | Side control area | Include both duplicated buttons and enough surrounding shell to establish that they belong to the same product side. |
| C | Lower grip | Include the complete interrupted edge, the unexplained gap and the point where the surface resumes. |

Do not draw red circles, arrows or labels directly onto the source crops. The website can add removable overlays after the user opens the reference analysis.

---

## Consistency Checklist

Before using the images in the case, confirm that:

- the same product identity is maintained across all source images;
- the sketch contains one sensing head, one button and a continuous shell;
- the flawed render contains exactly the three intended defects;
- each defect is visible at normal desktop viewing size or after one level of zoom;
- the duplicated controls cannot be mistaken for an intentional plus/minus pair;
- the broken surface cannot be mistaken for a designed charging port or panel line;
- the collision is local and does not make the entire product look melted;
- no extra defect competes with the three intended observations;
- the corrected image removes the visible defects without implying that the product has been technically validated.
