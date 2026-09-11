import type { CaseStudyContent } from '../types';

/* ─── Camber ──────────────────────────────────────────────────────────────────
   Filled in from what the page already contains, so the model is exercised
   against real content rather than left as an abstraction.

   The honest state: Camber is the most distinctive build in the portfolio and
   the only one that ships with both a repo and a live link, but it had the
   thinnest hard evidence of the four. The three `stats` below are real — they
   were already written into the Execution prose as design values — and the
   verdicts on Options 01/02 are drawn from rationale that was already there.

   What is genuinely still missing is listed in `evidenceGaps`, and it is all
   owner-blocked: GitHub counts, a redacted DM screenshot, and a before/after.
   ───────────────────────────────────────────────────────────────────────────── */

export const camber: CaseStudyContent = {
  slug: 'camber',
  name: 'Camber',
  kicker: 'Case Study · macOS App · 2026',
  tagline: 'Every task manager promises to reduce friction, then buries itself three clicks deep.',

  meta: [
    { k: 'Role', v: 'Solo | Design & Engineering' },
    { k: 'Platform', v: 'macOS Universal' },
    { k: 'Stack', v: 'Electron · React · sql.js' },
    { k: 'Status', v: 'Shipped · Open Source' },
    { k: 'Site', v: 'camber-app.vercel.app' },
  ],

  navSections: ['Problem', 'Thinking', 'Solution', 'Execution', 'Impact', 'Learned'],

  links: [
    { kind: 'repo', label: 'GitHub Repository', href: 'https://github.com/puneetk0/camber' },
    { kind: 'live', label: 'Live Website', href: 'https://camber-app.vercel.app/' },
  ],

  tradeoffs: [
    {
      id: 'Option 01',
      title: 'Dashboard app',
      rationale:
        'Requires full context switching. Gets buried behind VS Code the moment you actually start working. Adds to the problem it claims to solve.',
      verdict: 'Rejected: it reproduces the exact failure mode I was trying to remove.',
      status: 'rejected',
    },
    {
      id: 'Option 02',
      title: 'Menu bar dropdown',
      rationale:
        'Better proximity, but still needs a click, dense navigation, and competes with every other menu bar squatter you already have.',
      verdict: 'Rejected: closer, but a click is still a decision, and the menu bar is already contested space.',
      status: 'rejected',
    },
    {
      id: 'Option 03',
      title: 'The MacBook notch',
      rationale:
        'Dead real estate on every modern MacBook. A hover could surface tasks instantly — no click, no navigation, no app switch.',
      verdict: 'Tasks become one motion away, always. The display itself becomes the interface.',
      status: 'chosen',
    },
  ],

  /* The interaction budget. "One motion away, always" is a latency claim, so
     these are the numbers the thesis actually rests on. */
  stats: [
    {
      value: '100ms',
      label: 'Cursor poll',
      sub: 'Interval of the mouse-position loop standing in for the notch API macOS does not expose.',
    },
    {
      value: '200×25',
      label: 'Hit zone, px',
      sub: 'The dead strip beside the camera housing — the entire interactive surface.',
    },
    {
      value: '300ms',
      label: 'Grace period',
      sub: 'Below this the popover flickered on every pass-through. The difference between a prototype and something usable.',
    },
  ],

  quote: {
    text: 'The execution deserved a star.',
    attribution: 'GitHub user',
    source: 'unsolicited DM',
    // evidenceHref: TODO — a redacted screenshot turns this from a claim into proof
  },

  media: [
    { src: '/assets/camber/camber-notch-demo.mp4', alt: 'The Camber popover dropping out of the MacBook notch on hover', width: 1280, height: 800 },
    { src: '/assets/camber/camber-track-view.png', alt: 'Tasks rendered as cars on an F1 track inside the notch popover', width: 3024, height: 1964 },
    { src: '/assets/camber/camber-constructor-select.png', alt: 'Choosing an F1 constructor as a project category', width: 3024, height: 1964 },
    { src: '/assets/camber/camber-website.png', alt: 'The Camber marketing site', width: 3024, height: 1964 },
  ],

  /* Owner-blocked, and specific:
     - stats:       GitHub stars / clones / release download counts (verifiable
                    from the API), universal binary size, measured CPU cost of
                    the 100ms loop. The three stats above are design values;
                    these would be outcomes.
     - beforeAfter: "three clicks deep" versus "one hover" — needs no new assets,
                    two text panels and a delta would do it.
     - quote:       present, but `evidenceHref` is empty, so it remains a claim. */
  evidenceGaps: ['beforeAfter'],
};
