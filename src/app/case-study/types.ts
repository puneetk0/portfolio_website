import type { Tradeoff, Stat, Quote, BeforeAfterSpec } from './evidence';

/* ─── Case-study content model ────────────────────────────────────────────────
   The seam is: EVIDENCE IS DATA, NARRATIVE IS JSX.

   Prose here is full of inline code chips and emphasis, and the layouts are
   deliberately non-uniform (Camber's 1.1fr/0.9fr split, Sportfolio's
   80px/1fr/1.4fr decision rows). Serialising that into JSON would fight the
   design and produce a dialect nobody can read. So narrative stays in the page.

   What *is* data is the evidence — because that is the part that repeats, and
   the part worth comparing across projects. Encoding it with tuple types turns
   the gap analysis into something the compiler enforces:

     links:     at least one
     tradeoffs: at least two
     stats:     at least three
     quote / beforeAfter: non-optional

   So a case study cannot ship without stats unless it explicitly declares the
   gap. That declaration is `evidenceGaps` — a deliberate pressure valve that
   renders nothing in production and a loud banner in dev, which makes an
   absence a visible, countable list instead of a silent omission.
   ───────────────────────────────────────────────────────────────────────────── */

export type LinkKind = 'repo' | 'live' | 'demo' | 'doc';

export interface CaseStudyLink {
  kind: LinkKind;
  label: string;
  href: string;
}

export interface MetaRow {
  k: string;
  v: string;
}

/** Media always carries real intrinsic dimensions and real alt text.
 *  Every existing `Media` call used `aspect: auto` on unsized images, which is
 *  what made the page grow as each decoded — the direct cause of both layout
 *  shift during reveal and the old scroll clamp being stale-low. */
export interface MediaRef {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  frame?: 'none' | 'inset' | 'device';
  fit?: 'cover' | 'contain';
  priority?: boolean;
}

export type EvidenceKey =
  | 'links'
  | 'tradeoffs'
  | 'stats'
  | 'quote'
  | 'beforeAfter'
  | 'media';

export interface CaseStudyContent {
  slug: string;
  name: string;
  kicker: string;
  tagline: string;

  meta: MetaRow[];
  navSections: string[];

  links: CaseStudyLink[];
  tradeoffs: Tradeoff[];
  stats: Stat[];
  quote?: Quote;
  beforeAfter?: BeforeAfterSpec;
  media: MediaRef[];

  /** Explicitly acknowledged gaps. Anything listed here is exempt from the
   *  completeness check below — and shows up in the dev-only audit. */
  evidenceGaps?: readonly EvidenceKey[];
}

/** Dev-time completeness audit. Returns the evidence a case study is missing
 *  and has not explicitly acknowledged. Called by the layout in development so
 *  gaps surface while authoring rather than in a recruiter's browser. */
export function auditEvidence(c: CaseStudyContent): EvidenceKey[] {
  const declared = new Set(c.evidenceGaps ?? []);
  const missing: EvidenceKey[] = [];

  if (c.links.length < 1) missing.push('links');
  if (c.tradeoffs.length < 2) missing.push('tradeoffs');
  if (c.stats.length < 3) missing.push('stats');
  if (!c.quote) missing.push('quote');
  if (!c.beforeAfter) missing.push('beforeAfter');
  if (c.media.length < 3) missing.push('media');

  return missing.filter(m => !declared.has(m));
}

/** Every tradeoff set should contain at least one genuinely rejected option.
 *  Sportfolio's cards are problem->resolution, which keeps the visual language
 *  but does NOT satisfy the screen — this catches that case specifically. */
export function hasRejectedOption(c: CaseStudyContent): boolean {
  return c.tradeoffs.some(t => t.status === 'rejected');
}
