
/** A hover-revealed cluster image: absolute x/y from the section centre, an
 *  explicit box, a small rotation and a stagger delay. */
export interface ImgDef {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  delay: number;
}

/** One darkroom-print card in a "Beyond the screen" deck.
 *
 *  `w`/`h` are the source pixel dimensions and they are REQUIRED, because the
 *  print's image well takes the photograph's own aspect ratio instead of a
 *  forced square. That is the honest thing for a contact print and it is also a
 *  real fix: the old `aspect-ratio: 1/1` + `cover` cut the top off the
 *  Cognizance group shot and gutted the Visual Vortex auditorium shot, which is
 *  the single image that actually evidences "400+ attendees".
 *
 *  `tilt` is the deck rotation in degrees. There is deliberately no x/y any
 *  more: the old hardcoded pixel scatter was measured from the section's top
 *  edge and stopped meaning anything the moment sections became grid-centred
 *  flow. Deck geometry is derived from position in the deck instead.
 *
 *  `note` is the single handwritten mark, and it is optional ON PURPOSE.
 *  Handwriting reads as authentic when it is rare and as clip-art when it is
 *  the default — so it is filled in only where a real date or remark exists,
 *  never invented to fill the slot. */
export interface PrintDef {
  src: string;
  alt: string;
  w: number;
  h: number;
  /** Set in the print's rebate in tracked caps. */
  title: string;
  /** Below the title, in tabular figures so years and counts align. */
  meta: string;
  /** The one handwritten annotation. Omit rather than invent. */
  note?: string;
  tilt: number;
  /** Only for frames where the subject is not centred — a wide environment
   *  shot cropped to a person, for instance. Omitted means centred. */
  objectPosition?: string;
}

export interface CategoryDef {
  name: string;
  cards: PrintDef[];
}

/** The band a frame's aspect ratio is clamped into before it is laid out.
 *  Mirrors `--ar-fit` in print.css and must stay in agreement with it: the
 *  stylesheet uses it to size one frame, this is used to sum a whole strip. */
export const AR_MIN = 0.8;
export const AR_MAX = 1.35;

/** Total width of a laid-out strip, in frame-heights. The stylesheet solves the
 *  frame height from the room beside the text column divided by this, so it has
 *  to be exact — guarding a worst case instead would shrink every strip to fit
 *  a deck none of them actually are. */
export function sumAspect(cards: readonly PrintDef[]) {
  return cards.reduce((t, c) => t + Math.min(AR_MAX, Math.max(AR_MIN, c.w / c.h)), 0);
}

export interface RowMedia {
  src: string;
  alt: string;
  w: number;
  h: number;
}

export interface ProjectDef {
  name: string;
  desc: string;
  slug: string;
  /** Rendered inline in the project row on every platform. The first entry is
   *  the primary image; the rest become a thumbnail filmstrip. */
  media?: RowMedia[];
}

export const PERSONAL_INFO = {
  /* Split so the name can carry full ink while the greeting around it sits
     back. It used to be one string set entirely in 11px label type — the
     smallest, faintest type on the page was carrying the site owner's name. */
  greeting: "Hi, I'm",
  name: 'Puneet',
  tagline: 'I design and build products that people actually use.',
};

/** One registry for the three home sections.
 *
 *  `nav` is the stylized visible label; `name` is the accessible name used for
 *  the section landmark and the nav link. Previously the nav said "and ?" while
 *  the section itself was headed "Beyond the screen", so a screen reader heard
 *  two unrelated names for the same place. */
export interface SectionDef {
  id: string;
  nav: string;
  name: string;
}

export const SECTIONS: SectionDef[] = [
  { id: 'intro', nav: 'intro', name: 'Intro' },
  { id: 'projects', nav: 'projects', name: 'Selected projects' },
  { id: 'beyond', nav: 'and ?', name: 'Beyond the screen' },
];

/** @deprecated use SECTIONS */
export const SECTION_LABELS = SECTIONS.map(s => s.nav);

export const SOCIAL_LINKS = [
  { id: 'mail', label: 'mail', href: 'mailto:puneetkathuria2525@gmail.com' },
  { id: 'linkedin', label: 'linkedin', href: 'https://www.linkedin.com/in/puneet-kathuria-33a296220/' },
  { id: 'instagram', label: 'instagram', href: 'https://instagram.com/puneet.25_' },
  { id: 'github', label: 'github', href: 'https://github.com/puneetk0' },
  { id: "Resume", label: "Resume", href: "https://drive.google.com/file/d/1d7C1dxbENGdrzsumzRkZ5LFrHBmSmW7h/view?usp=sharing" }
];

export const BUILDING_PROJECTS: ProjectDef[] = [
  {
    name: 'Voca Form',
    desc: 'Conversational AI that turns forms into stories',
    slug: 'voca-form',
    media: [
      { src: '/assets/row/voca-voca-desktop.jpg', alt: 'Voca Form conversational form on desktop', w: 640, h: 387 },
      { src: '/assets/row/voca-voca-form-builder.jpg', alt: 'The Voca form builder', w: 312, h: 640 },
      { src: '/assets/row/voca-voca-admin-dashboard.jpg', alt: 'Voca admin dashboard of collected responses', w: 312, h: 640 },
    ],
  },
];

/* ─── The hero portrait: not currently rendered ───────────────────────────────
   Kept as data, with the reasoning, because the slot is meant to be filled.

   Three treatments were tried and all three came out:
     - A hover-revealed scatter of three images. Hover-gated content is
       invisible during the 30-60s scan a portfolio gets.
     - A single large framed print beside the headline. It read as a Polaroid
       marooned in dead space with nothing anchoring it to the grid.
     - An inline chip in the greeting line. Right idea, wrong asset: it renders
       35x47px, and in this photograph the subject is about a seventh of a
       960x1280 frame, so at chip scale it was a grey smudge next to the name.

   The blocker is the asset, not the layout. Of the three files in
   /assets/home: hero-02 is a photograph OF a camera's rear LCD and is roughly
   four-fifths black, hero-03 is the same workshop talk already shown in
   "Beyond the screen", and this one is a wide café mirror shot.

   A head-and-shoulders portrait on a plain background makes the inline chip
   work immediately — it is about five lines of CSS and one JSX span. */
export const PORTRAIT = {
  src: '/assets/home/hero-01.jpeg',
  w: 960,
  h: 1280,

  /* `objectPosition` alone did nothing here, which is worth recording because
     it looks like it should work. The source is 960x1280 — exactly 3:4 — and
     the chip is also 3:4, so `object-fit: cover` has nothing to crop and
     `object-position` has nothing to move. The whole café frame was being
     scaled into 51x68px, which is why the chip read as a brown smudge rather
     than as a person.

     A real crop therefore needs a zoom. `focus` is the subject's centre as a
     percentage of the source and `zoom` is the magnification; together they
     become `transform-origin` and `scale`, so the visible window is 1/zoom of
     the frame centred on `focus`. At 3x that is the middle third: x 24-58%,
     y 43-77% — head and shoulders, and nothing else. */
  focus: '41% 60%',
  zoom: 3,
} as const;

export const SELECTED_PROJECTS: ProjectDef[] = [
  {
    name: 'Sportfolio',
    desc: 'Trade emerging players like stocks',
    slug: 'sportfolio',
    media: [
      { src: '/assets/row/sportfolio-dashboard.jpg', alt: 'Sportfolio dashboard showing player price movements', w: 312, h: 640 },
      { src: '/assets/row/sportfolio-marketplace.jpg', alt: 'Sportfolio marketplace listing tradable players', w: 312, h: 640 },
      { src: '/assets/row/sportfolio-portfolio.jpg', alt: 'A fan portfolio of held players', w: 312, h: 640 },
    ],
  },
  {
    name: 'findMyRepo',
    desc: 'Find open source repos by chatting with AI',
    slug: 'find-my-repo',
    media: [
      { src: '/assets/row/find-my-repo-home.jpg', alt: 'findMyRepo home screen with a natural-language search box', w: 640, h: 415 },
      { src: '/assets/row/find-my-repo-hidden-gems.jpg', alt: 'Hidden gems view surfacing low-star repositories', w: 640, h: 415 },
      { src: '/assets/row/find-my-repo-search.jpg', alt: 'Semantic search results for a project description', w: 640, h: 415 },
    ],
  },
  {
    name: 'Camber',
    desc: "F1-themed task manager that lives in your Mac's notch",
    slug: 'camber',
    media: [
      { src: '/assets/row/camber-camber-track-view.jpg', alt: 'Camber race-track task view rendered in the MacBook notch', w: 640, h: 415 },
      { src: '/assets/row/camber-camber-constructor-select.jpg', alt: 'Choosing an F1 constructor as a project category', w: 640, h: 415 },
      { src: '/assets/row/camber-camber-website.jpg', alt: 'The Camber marketing site', w: 640, h: 415 },
    ],
  },
];



/* ─── Hover clusters ─────────────────────────────────────────────────────────
   Restored verbatim. These drive the parallax cluster that appears when a
   project row is hovered, which is the interaction this site was built around.

   The one group deliberately NOT restored is the old HERO_LAYOUTS[0] — the
   three personal photographs that appeared when you hovered the name. That is
   the one you asked to remove, and the name is no longer a hover target at all.
   What is left here is the project imagery, keyed by row index. */
export const HERO_LAYOUTS: ImgDef[][] = [
  [
    { src: '/assets/voca/voca-desktop.png', x: 10, y: -260, w: 480, h: 320, r: -0.5, delay: 0 },
    { src: '/assets/voca/voca-form-builder.png', x: 380, y: -100, w: 190, h: 400, r: 2.5, delay: 80 },
    { src: '/assets/voca/voca-admin-dashboard.png', x: 40, y: -40, w: 190, h: 400, r: -1.5, delay: 160 },
  ],
];

export const PROJECT_LAYOUTS: ImgDef[][] = [
  [
    { src: '/assets/sportfolio/dashboard.png', x: 20, y: -280, w: 210, h: 440, r: -2.5, delay: 0 },
    { src: '/assets/sportfolio/marketplace.png', x: 380, y: -100, w: 210, h: 440, r: 3.5, delay: 80 },
    { src: '/assets/sportfolio/portfolio.png', x: 180, y: -40, w: 210, h: 440, r: -1.5, delay: 160 },
  ],
  [
    { src: '/assets/find-my-repo/home.jpeg', x: 30, y: -270, w: 420, h: 270, r: -1.5, delay: 0 },
    { src: '/assets/find-my-repo/hidden-gems.jpeg', x: 10, y: 60, w: 420, h: 270, r: -1.0, delay: 160 },
    { src: '/assets/find-my-repo/find-my-repo-search.gif', x: 240, y: -60, w: 420, h: 270, r: 2.5, delay: 80 },
  ],
  [
    { src: '/assets/camber/camber-website.png', x: 30, y: -250, w: 480, h: 320, r: -1.0, delay: 0 },
    { src: '/assets/camber/camber-track-view.png', x: 160, y: 20, w: 480, h: 320, r: 2.0, delay: 80 },
  ],
];

export const CATEGORIES: CategoryDef[] = [
  {
    name: "I've won things",
    cards: [
      {
        src: '/assets/and-what/cognizance.jpeg',
        alt: 'Five of us standing outside the main building at Cognizance 2025, conference lanyards on.',
        w: 525, h: 700,
        title: 'Cognizance', meta: '2025 \u00b7 Prod-G winner', note: "won it", tilt: -2.5,
      },
      {
        src: '/assets/and-what/dcode.jpeg',
        alt: 'Five of us at night holding the mechanical keyboards we won at DCode 2025.',
        w: 525, h: 700,
        title: 'DCode', meta: '2025 \u00b7 Runner-up', tilt: 3,
      },
      {
        src: '/assets/and-what/designx.jpeg',
        alt: 'Three of us holding DesignX certificates outside the venue.',
        w: 700, h: 525,
        title: 'DesignX', meta: '2026 \u00b7 Designathon finalist', tilt: -1.5,
      },
    ],
  },
  {
    name: "I've built rooms full of people",
    cards: [
      {
        src: '/assets/and-what/visual-vortex.png',
        alt: 'Speaking with a microphone to a full auditorium at Visual Vortex.',
        w: 700, h: 394,
        title: 'Visual Vortex', meta: '400+ attendees', note: 'my room', tilt: -2,
      },
      {
        src: '/assets/and-what/workshop.jpeg',
        alt: "Presenting the 'Problem' slide to a classroom of students with laptops open, at the UI/UX workshop.",
        w: 525, h: 700,
        title: 'UI/UX workshop', meta: 'Taught design', tilt: 2.5,
      },
    ],
  },
  {
    name: 'and everything else',
    cards: [
      {
        src: '/assets/and-what/youtube.png',
        alt: "The Figma tutorial's YouTube page, showing 626,292 views.",
        w: 700, h: 516,
        title: 'Figma tutorial', meta: '626,292 views', tilt: -2,
      },
      {
        src: '/assets/and-what/travel.jpg',
        alt: 'Crouched next to a husky on a hillside trail.',
        w: 525, h: 700,
        title: 'Travel', meta: 'Exploring new places', tilt: 2, note: 'off-screen',
      },
    ],
  },
];
