# Case Challenge — Extracted Source

A standalone extract of the **Case Challenge** feature from the "AI Debias Kit"
single-page app (pure front-end, hash-routed, no build step). This file bundles the
three pieces that make up the feature so it can be reviewed independently.

## What it is

`#/cases` renders an interactive practice flow. A "case" is a preset AI product image
plus a brief; the learner works through 7 steps:

1. **Case Brief** — context, focus, intro
2. **Read the Intention** — design background + baseline check
3. **First Look** — first impression before cards appear
4. **Mark the Evidence** — click the image to place markers + describe what is visible
5. **Choose the Cards** — link each marker to an error/uncertainty card
6. **Set the Evidence Boundary** — how far can the image confirm each claim + conclusion
7. **Choose the Next Action** — then lock the reading and compare against a reference analysis

State is persisted per-case in `localStorage` under the key `crbc:<caseId>`.

---

## 1. Data — `CASES` (`js/data.js`, lines 109-220)

```js
  var CASES = [
    {
      id: 'case-01',
      number: '01',
      title: 'Finished Too Soon',
      subtitle: 'Can you separate visible image evidence from what the image merely suggests?',
      category: 'Handheld health device',
      time: '5–7 minutes',
      focus: 'Observable Error',
      focusIcon: 'error',
      images: {
        sketch: 'assets/A3.jpg',
        challenge: 'assets/A1.jpg',
        corrected: 'assets/A2.jpg'
      },
      intro: 'Inspect what is visibly present in the image. Do not assess comfort, safety or manufacturability yet.',
      designBackground: {
        en: 'A design student is developing a handheld health scanner for home use. The user places the circular sensing head against the skin, presses one physical button, and reads a simple status light. The product should be compact, calm and easy to hold.',
        cn: '一名设计学生正在设计一款家用手持健康扫描器。用户将圆形感应头贴近皮肤，按下一个实体按钮，并通过简单的状态灯读取反馈。产品应紧凑、平静且便于握持。'
      },
      intention: [
        'One-piece handheld body',
        'One circular sensing head at the front',
        'One physical button on the side',
        'One continuous, complete outer shell',
        'Feedback through one small status light'
      ],
      prompt: 'A compact handheld health scanner for home use, with one circular sensing head at the front, one physical button on the side, a small status light, and a continuous matte white outer shell. Calm, approachable industrial design, three-quarter product view, clean studio background.',
      baseline: {
        question: 'Which three details are explicitly required by the design intention?',
        options: [
          { label: 'One circular sensing head', stated: true },
          { label: 'One physical side button', stated: true },
          { label: 'A continuous outer shell', stated: true },
          { label: 'Proven medical accuracy', stated: false },
          { label: 'Confirmed ergonomic comfort', stated: false },
          { label: 'Injection-moulding feasibility', stated: false }
        ],
        feedback: 'These stated requirements will be your comparison baseline. The brief does not provide evidence of medical accuracy, comfort or manufacturability.'
      },
      firstLook: {
        question: 'What is the first area you would inspect more closely?',
        options: [
          'Sensing head and body connection',
          'Side controls',
          'Outer shell continuity',
          'Another area',
          'I do not notice a specific area yet'
        ]
      },
      regionChoices: ['Sensing head and body connection', 'Side controls', 'Outer shell continuity'],
      maxMarkers: 3,
      evidenceNote: 'Describe only what is visible. Avoid explaining why it happened or whether the product would work.',
      evidencePrompt: 'I can see __________ in this area.',
      interpretationHint: 'This may be an interpretation or claim. Can you first state the visible feature that led you to it?',
      cardPrompt: 'What visible detail supports this card choice?',
      nextAction: {
        question: 'What would you do before accepting this image as a design direction?',
        max: 2,
        options: [
          'Regenerate the affected area with clearer constraints',
          'Return to the sketch and redraw the connection',
          'Generate another view for comparison',
          'Compare the image against the original brief',
          'Keep the issue explicitly unresolved',
          'Build a quick physical or digital model',
          'Seek engineering validation',
          'Reject the entire concept immediately'
        ],
        reasonTemplate: 'Before accepting this direction, I would __________ because the image shows __________.'
      },
      conclusions: [
        { label: 'The image shows an unresolved visual issue I can see directly.', responsible: true },
        { label: 'The product cannot be manufactured.', responsible: false },
        { label: 'The product is unsafe to use.', responsible: false },
        { label: 'The AI model always produces this error.', responsible: false }
      ],
      reference: {
        intro: 'Compare your reading with a reference analysis. This is not a score — focus on whether your evidence statements are defensible.',
        findings: [
          {
            region: 'Sensing head and body connection',
            card: 'Colliding Parts',
            evidence: 'The sensing head crosses the visible boundary of the main body and the two surfaces merge without a coherent connection.',
            boundary: 'The visual overlap can be observed directly. The image alone does not prove that the proposed product is unmanufacturable or unsafe.',
            action: 'Redraw or regenerate the connection area and compare it with the intended geometry.'
          },
          {
            region: 'Side controls',
            card: 'Component Count',
            evidence: 'Two similar physical controls appear on the side of the product.',
            boundary: 'The mismatch is established by comparing the image with the brief, which specifies one physical button.',
            action: 'Return to the brief and remove or explain the additional control before continuing.'
          },
          {
            region: 'Outer shell continuity',
            card: 'Broken Surfaces',
            evidence: 'A shell edge terminates abruptly and resumes with no clearly defined opening or part boundary.',
            boundary: 'The discontinuity is visible, but its cause cannot be inferred from the image.',
            action: 'Inspect another generated view or redraw the surface transition.'
          }
        ],
        partialMessage: 'Your reading focused on one defensible issue. The reference analysis also examines other regions. Review what evidence makes those readings possible.',
        differentCardMessage: 'A different card can be appropriate when the evidence statement is clear. Compare the inspection question and evidence boundary of both cards.'
      },
      keyReminder: 'A polished image can contain visible geometric errors. Describe the evidence before making a broader design claim.',
      available: true
    },
    { id: 'case-02', number: '02', title: 'Use Context & Design Logic', category: 'Coming soon', focus: 'Observable Error', focusIcon: 'error', available: false },
    { id: 'case-03', number: '03', title: 'Cross-View Consistency', category: 'Coming soon', focus: 'Mixed levels', focusIcon: 'gap', available: false },
    { id: 'case-04', number: '04', title: 'Mixed Evidence Levels', category: 'Coming soon', focus: 'Mixed levels', focusIcon: 'claim', available: false }
  ];
```

## 2. Logic — `renderCases` + helpers (`js/bundle.js`, lines 600-1395)

```js
  /* ===================================================================
     Cases page — case hub + interactive 7-step case flow
     =================================================================== */

  var CASE_STEP_LABELS = [
    'Case Brief',
    'Read the Intention',
    'First Look',
    'Mark the Evidence',
    'Choose the Cards',
    'Set the Evidence Boundary',
    'Choose the Next Action'
  ];

  var CASE_BOUNDARY_LEVELS = [
    'Visible in the image',
    'Depends on the brief or prompt',
    'Cannot be determined from this image'
  ];

  var INTERPRET_WORDS = ['because the ai', 'impossible to manufacture', 'unsafe', 'uncomfortable'];

  var LEVEL_ICON_MAP = { 'Observable Error': 'error', 'Potential Logic Gap': 'gap', 'Unverified Claim': 'claim' };

  /* Case image (real asset) with alt text. */
  function caseImage(src, alt) {
    return '<img class="case-image__img" src="' + src + '" alt="' + escapeHtml(alt) + '">';
  }

  function renderCases(container) {
    var data = window.CRBC_DATA || {};
    var cases = data.CASES || [];
    var errorCards = data.ERROR_CARDS || [];
    var focuses = data.INSPECTION_FOCUSES || [];
    var esc = escapeHtml;

    var view = 'hub';                 // 'hub' | 'case'
    var currentCase = null;
    var state = null;
    var lsKey = null;
    var flashError = null;
    var cardFocus = 'Physical Integrity';

    function freshState() {
      return {
        step: 0,
        maxStep: 0,
        seq: 0,
        baseline: [],
        baselineConfirmed: false,
        firstLook: null,
        markers: [],
        cardChoices: {},
        boundaries: {},
        nextActions: [],
        reason: '',
        hintLevel: 0,
        referenceUnlocked: false,
        showReference: false,
        completed: false
      };
    }

    function save() {
      if (state && lsKey) { try { localStorage.setItem(lsKey, JSON.stringify(state)); } catch (e) {} }
    }

    function clearSaved() {
      if (lsKey) { try { localStorage.removeItem(lsKey); } catch (e) {} }
    }

    function readSaved(id) {
      try { return JSON.parse(localStorage.getItem('crbc:' + id)); } catch (e) { return null; }
    }

    function findMarker(id) {
      for (var i = 0; i < state.markers.length; i++) if (state.markers[i].id === id) return state.markers[i];
      return null;
    }

    function goStep(n) {
      state.step = n;
      state.showReference = false;
      if (n > state.maxStep) state.maxStep = n;
      save();
      paint();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ----- small option/rendering helpers ----- */

    function opt(action, value, labelHtml, selected, extraClass) {
      return '<button type="button" class="opt' + (extraClass ? ' ' + extraClass : '') + (selected ? ' is-selected' : '') + '" data-action="' + action + '" data-value="' + esc(value) + '">' + labelHtml + '</button>';
    }

    function errBanner(msg) {
      return '<div class="case-error" role="alert">' + esc(msg) + '</div>';
    }

    function levelIcon(l) { return LEVEL_ICON_MAP[l] || 'error'; }

    /* ----- hub ----- */

    function hubHtml() {
      var rows = cases.map(function (c) {
        var saved = readSaved(c.id);
        var status, cta;
        if (c.available) {
          if (saved && saved.completed) status = '<span class="case-card__status is-done">Completed</span>';
          else if (saved && saved.step !== undefined) status = '<span class="case-card__status is-progress">In progress — Step ' + (saved.step + 1) + ' of 7</span>';
          else status = '<span class="case-card__status">Not started</span>';
          cta = '<button type="button" class="btn btn--primary" data-action="start-case" data-value="' + esc(c.id) + '">' + (saved && !saved.completed ? 'Resume Case' : 'Start Case') + '</button>';
        } else {
          status = '<span class="case-card__status is-locked">Coming soon</span>';
          cta = '<button type="button" class="btn btn--outline" disabled>Locked</button>';
        }
        var meta = c.available
          ? '<div class="case-card__meta"><span>' + esc(c.category) + '</span><span>' + esc(c.time) + '</span><span class="case-card__focus">' + esc(c.focus) + '</span></div>'
          : '<div class="case-card__meta"><span>' + esc(c.category) + '</span><span>' + esc(c.focus) + '</span></div>';

        return '<article class="case-card' + (c.available ? '' : ' case-card--locked') + '">' +
          '<div class="case-card__top"><span class="case-card__number">Case ' + esc(c.number) + '</span>' + status + '</div>' +
          '<h3 class="case-card__title">' + esc(c.title) + '</h3>' +
          (c.subtitle ? '<p class="case-card__subtitle">' + esc(c.subtitle) + '</p>' : '') +
          meta +
          '<div class="case-card__cta">' + cta + '</div>' +
        '</article>';
      }).join('');

      return '<section class="section" style="padding-top: calc(var(--header-height) + var(--spacing-4xl))">' +
        '<div class="container">' +
          '<div class="section__header">' +
            sectionEyebrow('Part 4 · Cases') +
            '<h1 class="section__title">Practice before your own image.</h1>' +
            '<p class="section__lead">Work through preset cases before analysing your own AI concept image. Each case walks you through reading a brief, marking visible evidence, choosing cards, and setting evidence boundaries — with a reference analysis to compare against, never a score.</p>' +
          '</div>' +
          '<div class="grid grid--2" style="align-items: stretch">' + rows + '</div>' +
        '</div>' +
      '</section>';
    }

    /* ----- progress bar ----- */

    function progressHtml() {
      var c = currentCase;
      var total = cases.length;
      var inReference = state.showReference;
      var stepNum = inReference ? 7 : state.step;
      var stepLabel = inReference ? 'Reference Analysis' : CASE_STEP_LABELS[state.step];

      var chips = CASE_STEP_LABELS.map(function (label, i) {
        var cls = 'case-progress__chip';
        if (i < state.step) cls += ' is-done';
        if (i === state.step && !inReference) cls += ' is-current';
        var clickable = i <= state.maxStep;
        var inner = '<span class="case-progress__num">' + (i + 1) + '</span><span class="case-progress__name">' + esc(label) + '</span>';
        return '<li class="' + cls + '">' +
          (clickable ? '<button type="button" data-action="goto-step" data-value="' + i + '">' + inner + '</button>' : '<span>' + inner + '</span>') +
        '</li>';
      }).join('');

      var viewRef = (state.referenceUnlocked && !inReference)
        ? '<button type="button" class="case-progress__viewref" data-action="view-reference">View my reading →</button>' : '';

      return '<div class="case-progress">' +
        '<div class="container">' +
          '<div class="case-progress__bar">' +
            '<span class="case-progress__meta">Case ' + esc(c.number) + ' of 0' + total + ' <span class="case-progress__dot">·</span> Step ' + stepNum + ' of 7 <span class="case-progress__dot">·</span> ' + esc(c.focus) + '</span>' +
            viewRef +
          '</div>' +
          '<ol class="case-progress__chips">' + chips + '</ol>' +
        '</div>' +
      '</div>';
    }

    /* ----- step bodies ----- */

    function briefHtml() {
      var c = currentCase;
      return '<div class="case-step">' +
        '<div class="case-step__head">' +
          '<h2 class="case-step__title">Case ' + esc(c.number) + ' — ' + esc(c.title) + '</h2>' +
          '<p class="case-step__subtitle">' + esc(c.subtitle) + '</p>' +
        '</div>' +
        '<div class="case-meta">' +
          '<span class="case-meta__item"><strong>Product</strong>' + esc(c.category) + '</span>' +
          '<span class="case-meta__item"><strong>Time</strong>' + esc(c.time) + '</span>' +
          '<span class="case-meta__item"><strong>Focus</strong><span class="case-meta__icon">' + iconFor(c.focusIcon, 14) + '</span>' + esc(c.focus) + '</span>' +
        '</div>' +
        '<div class="case-note">' + esc(c.intro) + '</div>' +
        '<div class="case-step__actions">' +
          '<button type="button" class="btn btn--primary btn--lg" data-action="next-step">Start Case</button>' +
        '</div>' +
      '</div>';
    }

    function intentionHtml() {
      var c = currentCase;
      var opts = c.baseline.options.map(function (o) {
        return opt('baseline-opt', o.label, esc(o.label), state.baseline.indexOf(o.label) >= 0);
      }).join('');

      var confirmArea = state.baselineConfirmed
        ? '<div class="case-feedback">' + esc(c.baseline.feedback) + '</div>' +
          '<div class="case-step__actions"><button type="button" class="btn btn--primary btn--lg" data-action="next-step">Continue</button></div>'
        : '<div class="case-step__actions"><button type="button" class="btn btn--primary" data-action="confirm-baseline">Confirm Baseline</button></div>';

      return '<div class="case-step">' +
        '<h2 class="case-step__title">Read the intention.</h2>' +
        '<p class="case-step__lead">Understand the brief before seeing the image, so the image does not pre-set your reading.</p>' +
        '<div class="case-panel">' +
          '<div class="case-panel__label">Design Background</div>' +
          '<p class="case-panel__text">' + esc(c.designBackground.en) + '</p>' +
          '<p class="case-panel__text case-panel__text--cn">' + esc(c.designBackground.cn) + '</p>' +
        '</div>' +
        '<div class="case-panel">' +
          '<div class="case-panel__label">Original Design Intention</div>' +
          '<ul class="case-list">' + c.intention.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>' +
        '</div>' +
        '<div class="case-panel">' +
          '<div class="case-panel__label">Initial Concept Sketch</div>' +
          '<div class="image-stage image-stage--readonly">' + caseImage(c.images.sketch, 'Initial concept sketch of the handheld health scanner') + '</div>' +
        '</div>' +
        '<div class="case-panel">' +
          '<div class="case-panel__label">Original Prompt</div>' +
          '<p class="case-panel__text case-panel__text--prompt">' + esc(c.prompt) + '</p>' +
        '</div>' +
        '<div class="case-task">' +
          '<div class="case-task__label">Baseline check</div>' +
          '<p class="case-task__question">' + esc(c.baseline.question) + '</p>' +
          '<div class="opt-list">' + opts + '</div>' +
          confirmArea +
        '</div>' +
      '</div>';
    }

    function firstLookHtml() {
      var c = currentCase;
      var opts = c.firstLook.options.map(function (o) {
        return opt('firstlook-opt', o, esc(o), state.firstLook === o);
      }).join('');
      return '<div class="case-step">' +
        '<h2 class="case-step__title">First look.</h2>' +
        '<p class="case-step__lead">Look at the image before any cards or hints appear, and keep your own first impression.</p>' +
        '<div class="image-stage image-stage--readonly">' + caseImage(c.images.challenge, 'AI concept render of the handheld health scanner — inspect closely') + '</div>' +
        '<div class="case-panel case-panel--muted">' +
          '<div class="case-panel__label">Brief (for reference)</div>' +
          '<p class="case-panel__text">' + esc(c.designBackground.en) + '</p>' +
        '</div>' +
        '<div class="case-task">' +
          '<p class="case-task__question">' + esc(c.firstLook.question) + '</p>' +
          '<div class="opt-list">' + opts + '</div>' +
          '<div class="case-step__actions"><button type="button" class="btn btn--primary" data-action="next-step">Continue</button></div>' +
        '</div>' +
      '</div>';
    }

    function pinHtml(m, i) {
      return '<div class="marker-pin" style="left:' + m.x + '%; top:' + m.y + '%">' + (i + 1) + '</div>';
    }

    function markerHtml(m, i) {
      return '<div class="marker">' +
        '<div class="marker__head">' +
          '<span class="marker__badge">' + (i + 1) + '</span>' +
          '<label class="marker__region">' +
            '<span class="marker__field-label">Region</span>' +
            '<select data-marker-region="' + m.id + '">' +
              '<option value=""' + (m.region ? '' : ' selected') + '>Choose a region…</option>' +
              currentCase.regionChoices.map(function (r) {
                return '<option value="' + esc(r) + '"' + (m.region === r ? ' selected' : '') + '>' + esc(r) + '</option>';
              }).join('') +
              '<option value="Other area">Other area</option>' +
            '</select>' +
          '</label>' +
          '<button type="button" class="marker__remove" data-action="marker-remove" data-value="' + m.id + '">Remove</button>' +
        '</div>' +
        '<label class="marker__note">' +
          '<span class="marker__field-label">Visible observation</span>' +
          '<textarea rows="2" data-marker-note="' + m.id + '" placeholder="I can see …">' + esc(m.note) + '</textarea>' +
        '</label>' +
        '<div class="marker-hint">' + esc(currentCase.interpretationHint) + '</div>' +
      '</div>';
    }

    function hintHtml() {
      var hints = [
        'Look closely at where separate parts meet.',
        'Focus on the connection between the sensing head and the body, the side controls, and the continuity of the outer shell.',
        'Relevant cards include Colliding Parts, Component Count and Broken Surfaces — plus a distractor.'
      ];
      var items = '';
      for (var i = 0; i < state.hintLevel; i++) {
        items += '<div class="hint-item"><span class="hint-item__n">Prompt ' + (i + 1) + '</span>' + esc(hints[i]) + '</div>';
      }
      return '<div class="hint">' + items +
        (state.hintLevel < 3 ? '<button type="button" class="hint__btn" data-action="hint">' + (state.hintLevel === 0 ? 'I need a hint' : 'Show the next hint') + '</button>' : '') +
      '</div>';
    }

    function markHtml() {
      var c = currentCase;
      var markersHtml = state.markers.length
        ? '<div class="marker-list">' + state.markers.map(markerHtml).join('') + '</div>'
        : '<div class="case-empty">Click anywhere on the image to place a marker, then describe what is visible.</div>';

      return '<div class="case-step">' +
        '<h2 class="case-step__title">Mark the evidence.</h2>' +
        '<p class="case-step__lead">' + esc(c.evidenceNote) + '</p>' +
        '<div class="case-task__label">Sentence starter: <em>' + esc(c.evidencePrompt) + '</em></div>' +
        '<div class="image-stage" data-action="mark-stage">' +
          caseImage(c.images.challenge, 'AI concept render of the handheld health scanner — inspect closely') +
          state.markers.map(pinHtml).join('') +
          '<div class="image-stage__hint">Click to place a marker (' + state.markers.length + '/' + c.maxMarkers + ')</div>' +
        '</div>' +
        hintHtml() +
        markersHtml +
        '<div class="case-step__actions">' +
          '<button type="button" class="btn btn--outline" data-action="back-step">Back</button>' +
          '<button type="button" class="btn btn--primary" data-action="next-step">Continue</button>' +
        '</div>' +
      '</div>';
    }

    function evidenceValue(mid) {
      var c = state.cardChoices[mid];
      var m = findMarker(mid);
      return (c && c.evidence) || (m ? m.note : '') || '';
    }

    function cardMarkerHtml(m, i, focusCards) {
      var choice = state.cardChoices[m.id] || {};
      var chips = focusCards.map(function (ec) {
        var sel = choice.cardTitle === ec.title;
        return '<button type="button" class="opt opt--card' + (sel ? ' is-selected' : '') + '" data-action="card-opt" data-marker="' + m.id + '" data-value="' + esc(ec.title) + '">' +
          '<span class="opt__icon">' + iconFor(levelIcon(ec.judgementLevel), 14) + '</span>' +
          '<span class="opt__text"><strong>' + esc(ec.title) + '</strong><small>' + esc(ec.question) + '</small></span>' +
        '</button>';
      }).join('');
      chips += '<button type="button" class="opt opt--card' + (choice.cardTitle === 'No card fits' ? ' is-selected' : '') + '" data-action="card-opt" data-marker="' + m.id + '" data-value="No card fits">' +
        '<span class="opt__text"><strong>No card fits this observation</strong></span>' +
      '</button>';

      return '<div class="marker marker--card">' +
        '<div class="marker__head">' +
          '<span class="marker__badge">' + (i + 1) + '</span>' +
          '<span class="marker__region-name">' + esc(m.region || 'Unlabelled area') + '</span>' +
          (choice.cardTitle ? '<span class="marker__chosen">→ ' + esc(choice.cardTitle) + '</span>' : '') +
        '</div>' +
        '<label class="marker__note">' +
          '<span class="marker__field-label">' + esc(currentCase.cardPrompt) + '</span>' +
          '<textarea rows="2" data-card-evidence="' + m.id + '" placeholder="What visible detail supports this card?">' + esc(evidenceValue(m.id)) + '</textarea>' +
        '</label>' +
        '<div class="opt-list opt-list--cards">' + chips + '</div>' +
      '</div>';
    }

    function cardsHtml() {
      var focusTabs = focuses.map(function (f) {
        return '<button type="button" class="case-tab' + (cardFocus === f.label ? ' is-active' : '') + '" data-action="card-focus" data-value="' + esc(f.label) + '">' + esc(f.label) + '</button>';
      }).join('');

      var focusCards = errorCards.filter(function (ec) { return ec.inspectionFocus === cardFocus; });

      var markersHtml = state.markers.length
        ? state.markers.map(function (m, i) { return cardMarkerHtml(m, i, focusCards); }).join('')
        : '<div class="case-empty">No markers yet — go back to add one.</div>';

      return '<div class="case-step">' +
        '<h2 class="case-step__title">Choose the cards.</h2>' +
        '<p class="case-step__lead">Link each observation to the most relevant card. Physical Integrity cards are shown first — switch focus to browse others.</p>' +
        '<div class="case-tabs">' + focusTabs + '</div>' +
        markersHtml +
        '<div class="case-step__actions">' +
          '<button type="button" class="btn btn--outline" data-action="back-step">Back</button>' +
          '<button type="button" class="btn btn--primary" data-action="next-step">Continue</button>' +
        '</div>' +
      '</div>';
    }

    function boundaryHtml() {
      var withCards = state.markers.filter(function (m) {
        var c = state.cardChoices[m.id];
        return c && c.cardTitle && c.cardTitle !== 'No card fits';
      });

      if (!withCards.length) {
        return '<div class="case-step"><h2 class="case-step__title">Set the evidence boundary.</h2>' +
          '<div class="case-empty">No marker is linked to a card yet — go back and choose a card.</div>' +
          '<div class="case-step__actions"><button type="button" class="btn btn--outline" data-action="back-step">Back</button></div></div>';
      }

      var items = withCards.map(function (m, i) {
        var b = state.boundaries[m.id] || {};
        var cardTitle = state.cardChoices[m.id].cardTitle;
        var levelOpts = CASE_BOUNDARY_LEVELS.map(function (l) {
          return opt('boundary-opt', l, esc(l), b.level === l);
        }).join('');
        var conclOpts = currentCase.conclusions.map(function (o) {
          return opt('conclusion-opt', o.label, esc(o.label), b.conclusion === o.label);
        }).join('');
        var chosen = currentCase.conclusions.filter(function (o) { return o.label === b.conclusion; })[0];
        var conclNote = (chosen && !chosen.responsible)
          ? '<div class="boundary-note">This conclusion needs evidence beyond the image — check it against manufacturing, use or model behaviour before asserting it.</div>' : '';

        return '<div class="marker marker--boundary">' +
          '<div class="marker__head">' +
            '<span class="marker__badge">' + (i + 1) + '</span>' +
            '<span class="marker__region-name">' + esc(m.region || 'Area') + '</span>' +
            '<span class="marker__chosen">' + esc(cardTitle) + '</span>' +
          '</div>' +
          '<div class="boundary-group">' +
            '<div class="boundary-group__label">How certain can you be from this image?</div>' +
            '<div class="opt-list">' + levelOpts + '</div>' +
          '</div>' +
          '<div class="boundary-group">' +
            '<div class="boundary-group__label">What can you responsibly conclude?</div>' +
            '<div class="opt-list">' + conclOpts + '</div>' +
            conclNote +
          '</div>' +
        '</div>';
      }).join('');

      return '<div class="case-step">' +
        '<h2 class="case-step__title">Set the evidence boundary.</h2>' +
        '<p class="case-step__lead">Decide how far each observation can be confirmed from the image alone, and pick the most responsible conclusion.</p>' +
        items +
        '<div class="case-step__actions">' +
          '<button type="button" class="btn btn--outline" data-action="back-step">Back</button>' +
          '<button type="button" class="btn btn--primary" data-action="next-step">Continue</button>' +
        '</div>' +
      '</div>';
    }

    function actionHtml() {
      var c = currentCase;
      var opts = c.nextAction.options.map(function (o) {
        return '<button type="button" class="chip' + (state.nextActions.indexOf(o) >= 0 ? ' is-selected' : '') + '" data-action="action-opt" data-value="' + esc(o) + '">' + esc(o) + '</button>';
      }).join('');
      return '<div class="case-step">' +
        '<h2 class="case-step__title">Choose the next action.</h2>' +
        '<p class="case-step__lead">' + esc(c.nextAction.question) + ' <span class="case-task__hint">(choose up to ' + c.nextAction.max + ')</span></p>' +
        '<div class="chip-list">' + opts + '</div>' +
        '<div class="case-panel">' +
          '<div class="case-panel__label">Your reason</div>' +
          '<p class="case-panel__text case-panel__text--muted">' + esc(c.nextAction.reasonTemplate) + '</p>' +
          '<textarea rows="3" class="case-reason" data-action-reason placeholder="Before accepting this direction, I would … because the image shows …">' + esc(state.reason) + '</textarea>' +
        '</div>' +
        '<div class="case-step__actions">' +
          '<button type="button" class="btn btn--outline" data-action="back-step">Back</button>' +
          '<button type="button" class="btn btn--primary btn--lg" data-action="lock-reading">Lock My Reading</button>' +
        '</div>' +
      '</div>';
    }

    function referenceHtml() {
      var c = currentCase;

      var usedCards = state.markers.map(function (m) {
        var ch = state.cardChoices[m.id];
        return (ch && ch.cardTitle && ch.cardTitle !== 'No card fits') ? ch.cardTitle : null;
      }).filter(Boolean);
      var usedLevels = state.markers.map(function (m) {
        var b = state.boundaries[m.id];
        return b ? b.level : null;
      }).filter(Boolean);

      var summary =
        '<div class="case-summary">' +
          '<div class="case-summary__title">Case ' + esc(c.number) + ' completed</div>' +
          '<div class="case-summary__row"><span>Areas inspected</span><strong>' + state.markers.length + '</strong></div>' +
          '<div class="case-summary__row"><span>Cards used</span><strong>' + (usedCards.length ? esc(usedCards.join(', ')) : '—') + '</strong></div>' +
          '<div class="case-summary__row"><span>Evidence boundary used</span><strong>' + (usedLevels.length ? esc([...new Set(usedLevels)].join(', ')) : '—') + '</strong></div>' +
          '<div class="case-summary__row"><span>Chosen next action</span><strong>' + (state.nextActions.length ? esc(state.nextActions.join(', ')) : '—') + '</strong></div>' +
        '</div>';

      var yourItems = state.markers.map(function (m, i) {
        var ch = state.cardChoices[m.id] || {};
        var b = state.boundaries[m.id] || {};
        return '<div class="compare-row">' +
          '<div class="compare-row__num">' + (i + 1) + '</div>' +
          '<div class="compare-row__body">' +
            '<div class="compare-row__region">' + esc(m.region || 'Unlabelled area') + '</div>' +
            '<p class="compare-row__text">' + esc(m.note || '—') + '</p>' +
            '<div class="compare-row__meta">' +
              (ch.cardTitle ? '<span class="tag">' + esc(ch.cardTitle) + '</span>' : '') +
              (b.level ? '<span class="tag tag--level">' + esc(b.level) + '</span>' : '') +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('') || '<p class="case-empty">No markers recorded.</p>';

      var refItems = c.reference.findings.map(function (f, i) {
        return '<div class="ref-finding">' +
          '<div class="ref-finding__head"><span class="ref-finding__num">' + (i + 1) + '</span><span class="ref-finding__region">' + esc(f.region) + '</span><span class="tag">' + esc(f.card) + '</span></div>' +
          '<div class="ref-finding__block"><span class="ref-finding__label">Visible Evidence</span><p>' + esc(f.evidence) + '</p></div>' +
          '<div class="ref-finding__block"><span class="ref-finding__label">Evidence Boundary</span><p>' + esc(f.boundary) + '</p></div>' +
          '<div class="ref-finding__block"><span class="ref-finding__label">Possible Next Action</span><p>' + esc(f.action) + '</p></div>' +
        '</div>';
      }).join('');

      var nextActions = state.nextActions.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');

      var refCards = c.reference.findings.map(function (f) { return f.card; });
      var hasDifferent = state.markers.some(function (m) {
        var ch = state.cardChoices[m.id];
        return ch && ch.cardTitle && ch.cardTitle !== 'No card fits' && refCards.indexOf(ch.cardTitle) === -1;
      });
      var notes = '';
      if (state.markers.length < c.reference.findings.length) {
        notes += '<div class="case-feedback">' + esc(c.reference.partialMessage) + '</div>';
      }
      if (hasDifferent) {
        notes += '<div class="case-feedback">' + esc(c.reference.differentCardMessage) + '</div>';
      }

      return '<div class="case-step">' +
        '<div class="case-step__head">' +
          '<h2 class="case-step__title">Compare your reading.</h2>' +
          '<p class="case-step__subtitle">' + esc(c.reference.intro) + '</p>' +
        '</div>' +
        summary +
        '<div class="case-panel">' +
          '<div class="case-panel__label">Corrected comparison image</div>' +
          '<div class="image-stage image-stage--readonly">' + caseImage(c.images.corrected, 'Corrected comparison render of the handheld health scanner') + '</div>' +
          '<p class="case-panel__text case-panel__text--muted">A visually corrected image still does not verify ergonomics, safety, technical feasibility or medical performance.</p>' +
        '</div>' +
        '<div class="compare">' +
          '<div class="compare__col">' +
            '<h3 class="compare__heading">Your Reading</h3>' +
            yourItems +
            '<div class="compare__block"><h4 class="compare__subhead">Your next actions</h4>' +
              (nextActions ? '<ul class="case-list">' + nextActions + '</ul>' : '<p class="case-empty">None recorded.</p>') +
            '</div>' +
          '</div>' +
          '<div class="compare__col">' +
            '<h3 class="compare__heading">Reference Analysis</h3>' +
            refItems +
          '</div>' +
        '</div>' +
        notes +
        '<div class="case-feedback case-feedback--key">' + esc(c.keyReminder) + '</div>' +
        '<div class="compare-actions">' +
          '<a class="btn btn--outline" href="#/read">Review Selected Cards</a>' +
          '<a class="btn btn--outline" href="#/your-image">Apply to Your Image</a>' +
          '<button type="button" class="btn btn--ghost" data-action="restart-case">Restart Case</button>' +
          '<span class="compare-actions__next">Case 02 — coming soon</span>' +
        '</div>' +
      '</div>';
    }

    function stepHtml(i) {
      switch (i) {
        case 0: return briefHtml();
        case 1: return intentionHtml();
        case 2: return firstLookHtml();
        case 3: return markHtml();
        case 4: return cardsHtml();
        case 5: return boundaryHtml();
        case 6: return actionHtml();
        default: return briefHtml();
      }
    }

    function caseHtml(err) {
      var body = state.showReference ? referenceHtml() : stepHtml(state.step);
      return '<section class="case">' +
        progressHtml() +
        '<div class="container container--narrow">' +
          (err ? errBanner(err) : '') +
          body +
        '</div>' +
      '</section>';
    }

    /* ----- actions ----- */

    function startCase(id) {
      currentCase = null;
      for (var i = 0; i < cases.length; i++) if (cases[i].id === id) currentCase = cases[i];
      if (!currentCase || !currentCase.available) return;
      lsKey = 'crbc:' + id;
      var saved = readSaved(id);
      state = (saved && saved.step !== undefined) ? saved : freshState();
      cardFocus = 'Physical Integrity';
      view = 'case';
      paint();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function addMarker(e, stage) {
      if (state.markers.length >= currentCase.maxMarkers) {
        flashError = 'You can add up to ' + currentCase.maxMarkers + ' markers.';
        paint(); return;
      }
      var rect = stage.getBoundingClientRect();
      var x = Math.max(0, Math.min(100, Math.round((e.clientX - rect.left) / rect.width * 1000) / 10));
      var y = Math.max(0, Math.min(100, Math.round((e.clientY - rect.top) / rect.height * 1000) / 10));
      state.seq = (state.seq || 0) + 1;
      state.markers.push({ id: 'm' + state.seq, x: x, y: y, region: '', note: '' });
      save(); paint();
    }

    function removeMarker(id) {
      state.markers = state.markers.filter(function (m) { return m.id !== id; });
      delete state.cardChoices[id];
      delete state.boundaries[id];
      save(); paint();
    }

    function toggleBaseline(val) {
      var i = state.baseline.indexOf(val);
      if (i >= 0) { state.baseline.splice(i, 1); }
      else if (state.baseline.length < 3) { state.baseline.push(val); }
      else { flashError = 'Select exactly three stated requirements.'; }
      save(); paint();
    }

    function confirmBaseline() {
      if (state.baseline.length !== 3) { flashError = 'Select three stated requirements.'; paint(); return; }
      state.baselineConfirmed = true;
      save(); paint();
    }

    function chooseCard(mid, val) {
      if (!state.cardChoices[mid]) state.cardChoices[mid] = { cardTitle: null, evidence: '' };
      state.cardChoices[mid].cardTitle = val;
      save(); paint();
    }

    function chooseBoundary(mid, val) {
      if (!state.boundaries[mid]) state.boundaries[mid] = { level: null, conclusion: null };
      state.boundaries[mid].level = val;
      save(); paint();
    }

    function chooseConclusion(mid, val) {
      if (!state.boundaries[mid]) state.boundaries[mid] = { level: null, conclusion: null };
      state.boundaries[mid].conclusion = val;
      save(); paint();
    }

    function toggleAction(val) {
      var i = state.nextActions.indexOf(val);
      if (i >= 0) { state.nextActions.splice(i, 1); }
      else if (state.nextActions.length < currentCase.nextAction.max) { state.nextActions.push(val); }
      else { flashError = 'Choose up to ' + currentCase.nextAction.max + ' actions.'; }
      save(); paint();
    }

    function lockReading() {
      if (!state.nextActions.length) { flashError = 'Choose at least one next action.'; paint(); return; }
      if (!state.reason || !state.reason.trim()) { flashError = 'Write your reason before locking your reading.'; paint(); return; }
      state.referenceUnlocked = true;
      state.showReference = true;
      state.completed = true;
      save(); paint();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function confirmRestart() {
      if (window.confirm('Clear your answers and restart this case?')) {
        clearSaved();
        state = freshState();
        cardFocus = 'Physical Integrity';
        flashError = null;
        paint();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    function validateMarkers() {
      if (!state.markers.some(function (m) { return m.note && m.note.trim(); })) {
        flashError = 'Add at least one marker and describe what is visible.';
        paint(); return false;
      }
      return true;
    }

    function validateCards() {
      if (!state.markers.some(function (m) {
        var c = state.cardChoices[m.id];
        return c && c.cardTitle && c.evidence && c.evidence.trim();
      })) {
        flashError = 'Link at least one marker to a card and keep an evidence statement.';
        paint(); return false;
      }
      return true;
    }

    function validateBoundaries() {
      var withCards = state.markers.filter(function (m) {
        var c = state.cardChoices[m.id];
        return c && c.cardTitle && c.cardTitle !== 'No card fits';
      });
      if (!withCards.length) { flashError = 'Choose a card for at least one marker first.'; paint(); return false; }
      if (!withCards.every(function (m) {
        var b = state.boundaries[m.id];
        return b && b.level && b.conclusion;
      })) {
        flashError = 'Set an evidence level and a conclusion for each card you chose.';
        paint(); return false;
      }
      return true;
    }

    function nextStep() {
      var s = state.step;
      if (s === 0) { goStep(1); return; }
      if (s === 1) { if (!state.baselineConfirmed) { flashError = 'Confirm your baseline first.'; paint(); return; } goStep(2); return; }
      if (s === 2) { if (!state.firstLook) { flashError = 'Select one area to continue.'; paint(); return; } goStep(3); return; }
      if (s === 3) { if (!validateMarkers()) return; goStep(4); return; }
      if (s === 4) { if (!validateCards()) return; goStep(5); return; }
      if (s === 5) { if (!validateBoundaries()) return; goStep(6); return; }
    }

    function onClick(e) {
      var t = e.target.closest('[data-action]');
      if (!t) return;
      var action = t.dataset.action;
      var val = t.dataset.value;
      var mid = t.dataset.marker;

      switch (action) {
        case 'start-case': startCase(val); break;
        case 'goto-step': goStep(parseInt(val, 10)); break;
        case 'back-step': goStep(Math.max(0, state.step - 1)); break;
        case 'next-step': nextStep(); break;
        case 'baseline-opt': toggleBaseline(val); break;
        case 'confirm-baseline': confirmBaseline(); break;
        case 'firstlook-opt': state.firstLook = val; save(); paint(); break;
        case 'mark-stage': addMarker(e, t); break;
        case 'marker-remove': removeMarker(val); break;
        case 'hint': state.hintLevel = Math.min(3, state.hintLevel + 1); save(); paint(); break;
        case 'card-focus': cardFocus = val; paint(); break;
        case 'card-opt': chooseCard(mid, val); break;
        case 'boundary-opt': chooseBoundary(mid, val); break;
        case 'conclusion-opt': chooseConclusion(mid, val); break;
        case 'action-opt': toggleAction(val); break;
        case 'lock-reading': lockReading(); break;
        case 'restart-case': confirmRestart(); break;
        case 'view-reference': state.showReference = true; paint(); window.scrollTo({ top: 0, behavior: 'smooth' }); break;
      }
    }

    function updateInterpretHint(inputEl, note) {
      var wrap = inputEl.closest('.marker');
      var hintEl = wrap && wrap.querySelector('.marker-hint');
      if (!hintEl) return;
      var text = (note || '').toLowerCase();
      var hit = INTERPRET_WORDS.some(function (w) { return text.indexOf(w) !== -1; });
      hintEl.classList.toggle('is-visible', hit);
    }

    function onInput(e) {
      var t = e.target;
      if (!t || !t.dataset) return;
      if (t.dataset.markerNote !== undefined) {
        var m = findMarker(t.dataset.markerNote);
        if (m) { m.note = t.value; save(); updateInterpretHint(t, m.note); }
      } else if (t.dataset.cardEvidence !== undefined) {
        var id = t.dataset.cardEvidence;
        if (!state.cardChoices[id]) state.cardChoices[id] = { cardTitle: null, evidence: '' };
        state.cardChoices[id].evidence = t.value; save();
      } else if (t.dataset.actionReason !== undefined) {
        state.reason = t.value; save();
      }
    }

    function onChange(e) {
      var t = e.target;
      if (!t || !t.dataset) return;
      if (t.dataset.markerRegion !== undefined) {
        var m = findMarker(t.dataset.markerRegion);
        if (m) { m.region = t.value; save(); }
      }
    }

    function paint() {
      var err = flashError; flashError = null;
      container.innerHTML = (view === 'hub') ? hubHtml() : caseHtml(err);
    }

    paint();
    container.addEventListener('click', onClick);
    container.addEventListener('input', onInput);
    container.addEventListener('change', onChange);

    return {
      destroy: function () {
        container.removeEventListener('click', onClick);
        container.removeEventListener('input', onInput);
        container.removeEventListener('change', onChange);
      }
    };
  }
```

## 3. Styles — cases (`css/main.css`, "SECTION 16", lines 1232-1829)

```css
/* ===================================================================
   SECTION 16: CASES — HUB + INTERACTIVE CASE FLOW
   =================================================================== */

/* ---- Case hub cards ---- */

.case-card {
  background: var(--color-white);
  border: 1.5px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.case-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-muted);
}
.case-card--locked { opacity: 0.72; }
.case-card--locked:hover {
  transform: none;
  box-shadow: var(--shadow-md);
  border-color: rgba(0,0,0,0.06);
}
.case-card__top { display: flex; align-items: center; justify-content: space-between; gap: var(--spacing-md); }
.case-card__number {
  font-size: var(--font-size-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-primary);
}
.case-card__status {
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: var(--color-neutral-100);
  color: var(--color-neutral-500);
}
.case-card__status.is-progress { background: #FFFBEB; color: #B45309; }
.case-card__status.is-done { background: var(--color-success-bg); color: #15803D; }
.case-card__status.is-locked { background: var(--color-neutral-100); color: var(--color-neutral-400); }
.case-card__title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-neutral-900);
  letter-spacing: -0.02em;
}
.case-card__subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-500);
  line-height: var(--line-height-relaxed);
}
.case-card__meta { display: flex; flex-wrap: wrap; gap: 8px; font-size: var(--font-size-xs); color: var(--color-neutral-500); }
.case-card__meta span { padding: 4px 10px; background: var(--color-neutral-50); border-radius: var(--radius-full); }
.case-card__meta .case-card__focus { background: var(--color-primary-subtle); color: var(--color-primary); font-weight: 600; }
.case-card__cta { margin-top: auto; padding-top: var(--spacing-md); }
.case-card__cta .btn[disabled] { opacity: 0.5; cursor: not-allowed; }

/* ---- Case shell & progress ---- */

.case { padding-top: var(--header-height); padding-bottom: var(--spacing-5xl); }

.case-progress {
  position: sticky;
  top: var(--header-height);
  z-index: 40;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  padding: var(--spacing-md) 0;
}
.case-progress__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}
.case-progress__meta {
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-neutral-500);
}
.case-progress__dot { color: var(--color-neutral-300); }
.case-progress__viewref { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-primary); cursor: pointer; white-space: nowrap; }
.case-progress__viewref:hover { text-decoration: underline; }

.case-progress__chips { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px; }
.case-progress__chip { flex: 0 0 auto; }
.case-progress__chip button,
.case-progress__chip > span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 11px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--color-neutral-400);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.case-progress__chip button:hover { color: var(--color-primary); }
.case-progress__chip.is-done button,
.case-progress__chip.is-done > span { color: var(--color-primary); background: var(--color-primary-subtle); }
.case-progress__chip.is-current button,
.case-progress__chip.is-current > span { color: var(--color-white); background: var(--color-primary); }
.case-progress__num { font-weight: 700; }
.case-progress__name { white-space: nowrap; }

/* ---- Step layout ---- */

.case-step { padding-top: var(--spacing-2xl); }
.case-step__head { margin-bottom: var(--spacing-xl); }
.case-step__title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: -0.03em;
  color: var(--color-neutral-900);
  margin-bottom: var(--spacing-sm);
}
.case-step__subtitle { font-size: var(--font-size-lg); color: var(--color-neutral-500); line-height: var(--line-height-relaxed); }
.case-step__lead {
  font-size: var(--font-size-base);
  color: var(--color-neutral-600);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-lg);
  max-width: 65ch;
}
.case-step__actions { display: flex; flex-wrap: wrap; gap: var(--spacing-md); align-items: center; margin-top: var(--spacing-xl); }

.case-meta { display: flex; flex-wrap: wrap; gap: var(--spacing-md); margin-bottom: var(--spacing-xl); }
.case-meta__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--color-white);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-neutral-600);
}
.case-meta__item strong { color: var(--color-neutral-400); font-weight: 600; }
.case-meta__icon { display: inline-flex; color: var(--color-primary); }

.case-note {
  padding: var(--spacing-lg) var(--spacing-xl);
  background: var(--color-primary-subtle);
  border: 1px solid var(--color-primary-muted);
  border-radius: var(--radius-xl);
  color: var(--color-neutral-700);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-xl);
}

/* ---- Panels, tasks, feedback ---- */

.case-panel {
  background: var(--color-white);
  border: 1.5px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg) var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
}
.case-panel--muted { background: var(--color-neutral-50); }
.case-panel__label {
  font-size: var(--font-size-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}
.case-panel__text { color: var(--color-neutral-600); line-height: var(--line-height-relaxed); font-size: var(--font-size-base); }
.case-panel__text--cn { color: var(--color-neutral-500); font-size: var(--font-size-sm); margin-top: var(--spacing-sm); }
.case-panel__text--prompt {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-500);
  font-style: italic;
  background: var(--color-neutral-50);
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
}
.case-panel__text--muted { color: var(--color-neutral-500); font-size: var(--font-size-sm); font-style: italic; }

.case-list { display: flex; flex-direction: column; gap: var(--spacing-sm); }
.case-list li { position: relative; padding-left: 24px; color: var(--color-neutral-600); }
.case-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
}

.case-task {
  background: var(--color-white);
  border: 1.5px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg) var(--spacing-xl);
}
.case-task__label {
  font-size: var(--font-size-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-neutral-400);
  margin-bottom: var(--spacing-md);
}
.case-task__label em { text-transform: none; letter-spacing: 0; font-style: italic; color: var(--color-neutral-500); }
.case-task__question { font-size: var(--font-size-base); font-weight: 600; color: var(--color-neutral-800); margin-bottom: var(--spacing-md); }
.case-task__hint { font-size: var(--font-size-sm); color: var(--color-neutral-400); font-weight: 400; }

.case-feedback {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-success-bg);
  border: 1px solid rgba(22,163,74,0.25);
  color: #15803D;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-lg);
}
.case-feedback--key { background: var(--color-primary-subtle); border-color: var(--color-primary-muted); color: var(--color-primary-hover); font-weight: 500; }

.case-error {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-error-bg);
  border: 1px solid rgba(220,38,38,0.2);
  color: #B91C1C;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-lg);
}

.case-empty {
  padding: var(--spacing-lg);
  background: var(--color-neutral-50);
  border: 1.5px dashed rgba(0,0,0,0.12);
  border-radius: var(--radius-lg);
  color: var(--color-neutral-500);
  font-size: var(--font-size-sm);
  text-align: center;
  line-height: var(--line-height-relaxed);
}

/* ---- Selectable options & chips ---- */

.opt {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--radius-lg);
  background: var(--color-white);
  border: 1.5px solid rgba(0,0,0,0.08);
  color: var(--color-neutral-700);
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.opt:hover { border-color: var(--color-primary-muted); }
.opt.is-selected {
  border-color: var(--color-primary);
  background: var(--color-primary-subtle);
  color: var(--color-primary);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}
.opt-list { display: flex; flex-wrap: wrap; gap: 10px; }
.opt-list--cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.opt--card { flex-direction: column; align-items: flex-start; gap: 4px; }
.opt--card .opt__icon { display: inline-flex; color: var(--color-primary); }
.opt__text { display: flex; flex-direction: column; gap: 2px; }
.opt__text small { color: var(--color-neutral-500); font-weight: 400; font-size: var(--font-size-xs); line-height: var(--line-height-normal); }
.opt--card.is-selected .opt__text small { color: var(--color-primary-muted); }

.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--radius-full);
  background: var(--color-white);
  border: 1.5px solid rgba(0,0,0,0.08);
  color: var(--color-neutral-600);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.chip:hover { border-color: var(--color-primary-muted); }
.chip.is-selected { background: var(--color-primary); border-color: var(--color-primary); color: var(--color-white); }
.chip-list { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: var(--spacing-lg); }

.case-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: var(--spacing-lg); }
.case-tab {
  padding: 8px 14px;
  border-radius: var(--radius-full);
  background: var(--color-white);
  border: 1.5px solid rgba(0,0,0,0.08);
  color: var(--color-neutral-500);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.case-tab:hover { border-color: var(--color-primary-muted); }
.case-tab.is-active { background: var(--color-primary); border-color: var(--color-primary); color: var(--color-white); }

/* ---- Image stage & markers ---- */

.image-stage {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  background: linear-gradient(160deg, #EFEDF6 0%, #E4E1EE 100%);
  border: 1.5px solid rgba(0,0,0,0.06);
  box-shadow: var(--shadow-md);
  cursor: crosshair;
  margin-bottom: var(--spacing-lg);
}
.image-stage--readonly { cursor: default; }
.case-image__svg { width: 100%; height: 100%; display: block; }
.case-image__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.case-panel .image-stage { margin-bottom: 0; }
.image-stage__hint {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 14px;
  background: rgba(255,255,255,0.92);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: var(--color-neutral-500);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  pointer-events: none;
  white-space: nowrap;
}
.marker-pin {
  position: absolute;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-white);
  font-size: var(--font-size-sm);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  border: 2px solid #fff;
  box-shadow: 0 4px 12px rgba(79,70,229,0.4);
  pointer-events: none;
}

/* ---- Markers (evidence entries) ---- */

.marker-list { display: flex; flex-direction: column; gap: var(--spacing-lg); }
.marker {
  background: var(--color-white);
  border: 1.5px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}
.marker:last-child { margin-bottom: 0; }
.marker__head { display: flex; align-items: center; flex-wrap: wrap; gap: var(--spacing-sm); margin-bottom: var(--spacing-md); }
.marker__badge {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  font-size: var(--font-size-sm);
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}
.marker__region { display: inline-flex; align-items: center; gap: 8px; }
.marker__region select {
  padding: 6px 10px;
  border-radius: var(--radius-md);
  border: 1.5px solid rgba(0,0,0,0.1);
  background: var(--color-white);
  color: var(--color-neutral-700);
  font-size: var(--font-size-sm);
}
.marker__region-name { font-weight: 600; color: var(--color-neutral-700); }
.marker__chosen { margin-left: auto; font-size: var(--font-size-sm); color: var(--color-primary); font-weight: 600; }
.marker__remove { margin-left: auto; font-size: var(--font-size-xs); color: var(--color-error); font-weight: 600; cursor: pointer; }
.marker__remove:hover { text-decoration: underline; }
.marker__note { display: flex; flex-direction: column; gap: 6px; }
.marker__field-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-neutral-400);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.marker__note textarea,
.case-reason {
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  border: 1.5px solid rgba(0,0,0,0.1);
  background: var(--color-neutral-50);
  color: var(--color-neutral-800);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  resize: vertical;
}
.marker__note textarea:focus,
.case-reason:focus { outline: none; border-color: var(--color-primary); background: #fff; box-shadow: 0 0 0 3px var(--color-primary-light); }
.case-reason { margin-top: var(--spacing-md); }
.marker-hint {
  display: none;
  margin-top: 6px;
  font-size: var(--font-size-xs);
  color: #B45309;
  background: #FFFBEB;
  border: 1px solid rgba(245,158,11,0.25);
  padding: 6px 10px;
  border-radius: var(--radius-md);
  line-height: var(--line-height-relaxed);
}
.marker-hint.is-visible { display: block; }

/* ---- Hints ---- */

.hint { margin-bottom: var(--spacing-lg); }
.hint-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 10px 14px;
  background: #FFFBEB;
  border: 1px solid rgba(245,158,11,0.2);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: #92400E;
  margin-bottom: 6px;
  line-height: var(--line-height-relaxed);
}
.hint-item__n { font-weight: 700; white-space: nowrap; }
.hint__btn { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-primary); cursor: pointer; padding: 4px 0; }
.hint__btn:hover { text-decoration: underline; }

/* ---- Evidence boundary ---- */

.boundary-group { margin-bottom: var(--spacing-lg); }
.boundary-group__label { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-neutral-700); margin-bottom: var(--spacing-sm); }
.boundary-note {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: #B45309;
  background: #FFFBEB;
  border: 1px solid rgba(245,158,11,0.25);
  padding: 8px 12px;
  border-radius: var(--radius-md);
  line-height: var(--line-height-relaxed);
}

/* ---- Reference / comparison ---- */

.case-summary {
  background: var(--color-white);
  border: 1.5px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg) var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}
.case-summary__title { font-size: var(--font-size-lg); font-weight: 700; color: var(--color-neutral-900); margin-bottom: var(--spacing-md); }
.case-summary__row {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding: 8px 0;
  border-top: 1px solid rgba(0,0,0,0.05);
  font-size: var(--font-size-sm);
  color: var(--color-neutral-500);
}
.case-summary__row strong { color: var(--color-neutral-800); text-align: right; }

.compare { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-xl); margin-bottom: var(--spacing-xl); }
.compare__col { min-width: 0; }
.compare__heading {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-primary-light);
}
.compare__block { margin-top: var(--spacing-lg); }
.compare__subhead { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-neutral-700); margin-bottom: var(--spacing-sm); }
.compare-row {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-white);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-sm);
}
.compare-row__num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary-subtle);
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}
.compare-row__region { font-weight: 600; color: var(--color-neutral-800); font-size: var(--font-size-sm); }
.compare-row__text { color: var(--color-neutral-500); font-size: var(--font-size-sm); line-height: var(--line-height-relaxed); margin: 4px 0; }
.compare-row__meta { display: flex; flex-wrap: wrap; gap: 6px; }

.tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: var(--color-primary-subtle);
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: 600;
}
.tag--level { background: var(--color-neutral-100); color: var(--color-neutral-600); }

.ref-finding {
  background: var(--color-white);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}
.ref-finding__head { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: var(--spacing-md); }
.ref-finding__num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  font-size: var(--font-size-xs);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ref-finding__region { font-weight: 700; color: var(--color-neutral-800); }
.ref-finding__block { margin-bottom: var(--spacing-sm); }
.ref-finding__block:last-child { margin-bottom: 0; }
.ref-finding__label { font-size: var(--font-size-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-neutral-400); }
.ref-finding__block p { color: var(--color-neutral-600); font-size: var(--font-size-sm); line-height: var(--line-height-relaxed); margin-top: 2px; }

.compare-actions { display: flex; flex-wrap: wrap; gap: var(--spacing-md); align-items: center; }
.compare-actions__next { font-size: var(--font-size-sm); color: var(--color-neutral-400); }

/* ---- Cases responsive ---- */

@media (max-width: 900px) {
  .compare { grid-template-columns: 1fr; }
  .opt-list--cards { grid-template-columns: 1fr; }
  .case-progress__name { display: none; }
}
```

## 4. External dependencies (defined elsewhere in the app)

- `escapeHtml(str)`, `iconFor(key, size)`, `sectionEyebrow(text)` — shared helpers in `js/bundle.js`.
- `window.CRBC_DATA` — set by `js/data.js`; the feature reads `CRBC_DATA.CASES`,
  `CRBC_DATA.ERROR_CARDS`, and `CRBC_DATA.INSPECTION_FOCUSES`.
- Design tokens (CSS custom properties, defined at the top of `css/main.css`):
  `--color-primary` and the `--color-*`, `--spacing-*`, `--radius-*`, `--font-size-*`,
  `--shadow-*`, `--transition-fast`, and `--header-height` series.
- Shared component classes: `.btn`, `.btn--primary`, `.btn--outline`, `.btn--ghost`,
  `.btn--lg`, `.container`, `.container--narrow`, `.section`, `.grid`, `.grid--2`.
- Image assets (in `web/assets/`): `A3.jpg` (initial sketch), `A1.jpg` (flawed concept),
  `A2.jpg` (corrected comparison). Mapping: `images.sketch` = A3, `images.challenge` = A1,
  `images.corrected` = A2.

> Note for the reviewer: in "Choose the Cards", each card option renders `ec.question`
> as its subtitle. The current `ERROR_CARDS` schema is image-based (`title`, `helperTitle`,
> `inspectionFocus`, `judgementLevel`, `image`) and no longer has a `question` field, so
> that subtitle currently renders empty.
