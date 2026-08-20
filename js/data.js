/**
 * Critical Reading Before Commitment — Content Data (mock, replaceable)
 * Content is separated from components so wording, categories and cases
 * can be edited without touching page code.
 */
(function () {
  'use strict';

  /* ===================================================================
     Axes for the Error & Uncertainty dual-axis matrix
     =================================================================== */

  var INSPECTION_FOCUSES = [
    { id: 'physical', label: 'Physical Integrity' },
    { id: 'attributes', label: 'Attributes & Relationships' },
    { id: 'human', label: 'Human & Use' }
  ];

  var JUDGEMENT_LEVELS = [
    { id: 'error', label: 'Observable Error' },
    { id: 'gap', label: 'Potential Logic Gap' },
    { id: 'claim', label: 'Unverified Claim' }
  ];

  /* ===================================================================
     Capability Cards (5)
     =================================================================== */

    var CAPABILITIES = [
    {
      id: 'capability-01',
      letter: 'A',
      title: 'Make an Idea Visible',
      front: 'assets/cap-a-front.png',
      back: 'assets/cap-a-back.png',
      useCases: [
        { title: 'From Words to a Product Image', image: 'assets/example-a-1.png' }
      ]
    },
    {
      id: 'capability-02',
      letter: 'B',
      title: 'Open Up Possibilities',
      front: 'assets/cap-b-front.png',
      back: 'assets/cap-b-back.png',
      useCases: [
        { title: 'From Sketch to Materialised Concept', image: 'assets/example-b-1.png' }
      ]
    },
    {
      id: 'capability-03',
      letter: 'C',
      title: 'Develop a Starting Point',
      front: 'assets/cap-c-front.png',
      back: 'assets/cap-c-back.png',
      useCases: [
        { title: 'From Sketch to Materialised Concept', image: 'assets/example-c-1.png' },
        { title: 'Developing an Annotated Sketch', image: 'assets/example-c-2.png' }
      ]
    },
    {
      id: 'capability-04',
      letter: 'D',
      title: 'Explore Visual Variables',
      front: 'assets/cap-d-front.png',
      back: 'assets/cap-d-back.png',
      useCases: [
        { title: 'Exploring Different Colour Options', image: 'assets/example-d-1.png' },
        { title: 'Exploring Different Materials', image: 'assets/example-d-2.png' }
      ]
    },
    {
      id: 'capability-05',
      letter: 'E',
      title: 'Contextualise a Concept',
      front: 'assets/cap-e-front.png',
      back: 'assets/cap-e-back.png',
      useCases: [
        { title: 'Place the Product in an Actual Scenario', image: 'assets/example-e-1.png' },
        { title: 'Seeing a Product in Use', image: 'assets/example-e-2.png' }
      ]
    }
  ];


  /* ===================================================================
     Error & Uncertainty Cards (12)
     =================================================================== */

    var ERROR_CARDS = [
    { id: 'error-01', title: 'Colliding Parts', helperTitle: '部件冲突', inspectionFocus: 'Physical Integrity', judgementLevel: 'Observable Error', image: 'assets/error-01.png' },
    { id: 'error-02', title: 'Component Count', helperTitle: '部件数量', inspectionFocus: 'Physical Integrity', judgementLevel: 'Potential Logic Gap', image: 'assets/error-02.png' },
    { id: 'error-03', title: 'Broken Surfaces', helperTitle: '破面', inspectionFocus: 'Physical Integrity', judgementLevel: 'Observable Error', image: 'assets/error-03.png' },
    { id: 'error-04', title: 'Unsupported Parts', helperTitle: '无支撑部件', inspectionFocus: 'Physical Integrity', judgementLevel: 'Observable Error', image: 'assets/error-04.png' },
    { id: 'error-05', title: 'Unreadable Interface', helperTitle: '界面不可读', inspectionFocus: 'Attributes & Relationships', judgementLevel: 'Observable Error', image: 'assets/error-05.png' },
    { id: 'error-06', title: 'Misplaced Attributes', helperTitle: '属性错位', inspectionFocus: 'Attributes & Relationships', judgementLevel: 'Potential Logic Gap', image: 'assets/error-06.png' },
    { id: 'error-07', title: 'Broken Relationships', helperTitle: '关系断裂', inspectionFocus: 'Attributes & Relationships', judgementLevel: 'Potential Logic Gap', image: 'assets/error-07.png' },
    { id: 'error-08', title: 'Unstable Scale', helperTitle: '尺度不稳', inspectionFocus: 'Attributes & Relationships', judgementLevel: 'Observable Error', image: 'assets/error-08.png' },
    { id: 'error-09', title: 'Changing Identity', helperTitle: '身份变化', inspectionFocus: 'Attributes & Relationships', judgementLevel: 'Potential Logic Gap', image: 'assets/error-09.png' },
    { id: 'error-10', title: 'Broken Contact', helperTitle: '接触断裂', inspectionFocus: 'Human & Use', judgementLevel: 'Observable Error', image: 'assets/error-10.png' },
    { id: 'error-11', title: 'Impossible Action', helperTitle: '不可能动作', inspectionFocus: 'Human & Use', judgementLevel: 'Observable Error', image: 'assets/error-11.png' },
    { id: 'error-12', title: 'Unclear Response', helperTitle: '响应不清', inspectionFocus: 'Human & Use', judgementLevel: 'Unverified Claim', image: 'assets/error-12.png' }
  ];

  /* ===================================================================
     Case Challenges (interactive practice)
     =================================================================== */

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
      suggestedCards: ['Colliding Parts', 'Component Count', 'Broken Surfaces', 'Unsupported Parts'],
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
        ]
      },
      keyReminder: 'A polished image can contain visible geometric errors. Describe the evidence before making a broader design claim.',
      available: true
    },
    { id: 'case-02', number: '02', title: 'Use Context & Design Logic', category: 'Coming soon', focus: 'Observable Error', focusIcon: 'error', available: false },
    { id: 'case-03', number: '03', title: 'Cross-View Consistency', category: 'Coming soon', focus: 'Mixed levels', focusIcon: 'gap', available: false },
    { id: 'case-04', number: '04', title: 'Mixed Evidence Levels', category: 'Coming soon', focus: 'Mixed levels', focusIcon: 'claim', available: false }
  ];

  /* ===================================================================
     Expose globals
     =================================================================== */

  window.CRBC_DATA = {
    INSPECTION_FOCUSES: INSPECTION_FOCUSES,
    JUDGEMENT_LEVELS: JUDGEMENT_LEVELS,
    CAPABILITIES: CAPABILITIES,
    ERROR_CARDS: ERROR_CARDS,
    CASES: CASES
  };

})();
