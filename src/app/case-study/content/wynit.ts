import type { CaseStudyContent } from '../types';

/* ─── Wynit / CompeteIQ ───────────────────────────────────────────────────────
   SCAFFOLD — not routed yet. It is intentionally absent from
   `src/app/pages/registry.ts` so nothing half-written can reach a visitor.

   This is the acceptance test for the kit: if filling this in and adding one
   registry line takes more than a day, the data/JSX seam is in the wrong place.

   Wynit is the one project with real numbers, which is why it matters. Research
   is unambiguous that case study #1 gets 5-10 minutes of a recruiter's
   attention while #3 gets 1-2, and that unquantified impact is a top rejection
   reason — so the project with verifiable figures should lead. Final ordering
   was deliberately deferred until the evidence pass is done.

   Every `TODO` below is a real blocker, not a placeholder to ship around.
   `auditEvidence()` will report anything still missing, and the tuple-shaped
   requirements in types.ts mean the compiler catches an empty `links` or a
   single tradeoff.
   ───────────────────────────────────────────────────────────────────────────── */

export const wynit: CaseStudyContent = {
  slug: 'wynit',
  name: 'Wynit',
  kicker: 'Case Study · TODO domain · TODO year',
  tagline: 'TODO — one sentence stating the problem, not the product.',

  meta: [
    { k: 'Role', v: 'TODO — and state scope explicitly if there was a team' },
    { k: 'Timeline', v: 'TODO' },
    { k: 'Stack', v: 'TODO' },
    { k: 'Status', v: 'TODO — shipped / in progress' },
    { k: 'Also known as', v: 'CompeteIQ' },
  ],

  navSections: ['Problem', 'Thinking', 'Solution', 'Execution', 'Impact', 'Learned'],

  // At least one. A demo video is the honest substitute for a live link on
  // unshipped work — that is what `kind: 'demo'` is for.
  links: [
    // { kind: 'repo', label: 'GitHub Repository', href: 'TODO' },
    // { kind: 'live', label: 'Live Site', href: 'TODO' },
  ],

  // At least two, and at least one with status 'rejected' carrying the reason.
  // This is the single highest-value section — it is what demonstrates judgment
  // rather than taste.
  tradeoffs: [
    // { id: 'Option 01', title: 'TODO', rationale: 'TODO',
    //   verdict: 'Rejected: TODO — the actual reason', status: 'rejected' },
    // { id: 'Option 02', title: 'TODO', rationale: 'TODO',
    //   verdict: 'TODO — what choosing this produced', status: 'chosen' },
  ],

  // At least three. This is the project's whole advantage — small and true
  // beats large and invented.
  stats: [
    // { value: 'TODO', label: 'TODO', sub: 'TODO — what it measures and over what period' },
  ],

  // quote:       TODO — one attributed quote, ideally with evidenceHref to a screenshot
  // beforeAfter: TODO — two text panels plus a delta is enough; needs no new assets

  // At least three, spread across problem / solution / execution rather than
  // collected in one grid. Real pixel dimensions, real alt text.
  media: [
    // { src: '/assets/wynit/TODO.png', alt: 'TODO', width: 0, height: 0 },
  ],

  // Everything still outstanding, declared rather than silently absent.
  // Remove each key as it is filled in; the list should reach empty.
  evidenceGaps: ['links', 'tradeoffs', 'stats', 'quote', 'beforeAfter', 'media'],
};
