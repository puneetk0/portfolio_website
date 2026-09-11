import type { ComponentType } from 'react';
import { CamberCaseStudy } from './CamberCaseStudy';
import { VocaCaseStudy } from './VocaCaseStudy';
import { FindMyRepoCaseStudy } from './FindMyRepoCaseStudy';
import { SportfolioCaseStudy } from './SportfolioCaseStudy';

/* ─── Case study registry ─────────────────────────────────────────────────────
   Replaces nine hand-written <Route> lines (four canonical slugs plus five
   aliases). The aliases stay as *redirects* rather than being deleted — they may
   already be in a résumé PDF, a DM, or a submitted application, and silently
   404ing those is worse than a redirect.

   The footer "next project" order is derived from ORDER here, which structurally
   prevents the previous situation where footers linked to non-canonical aliases
   that only worked because a duplicate route happened to exist.
   ───────────────────────────────────────────────────────────────────────────── */

export interface CaseStudyEntry {
  slug: string;
  name: string;
  Component: ComponentType;
}

export const CASE_STUDIES: CaseStudyEntry[] = [
  { slug: 'camber', name: 'Camber', Component: CamberCaseStudy },
  { slug: 'find-my-repo', name: 'FindMyRepo', Component: FindMyRepoCaseStudy },
  { slug: 'voca-form', name: 'Voca Form', Component: VocaCaseStudy },
  { slug: 'sportfolio', name: 'Sportfolio', Component: SportfolioCaseStudy },
];

/** Legacy slugs kept alive as 301-style client redirects. */
export const ALIASES: Record<string, string> = {
  voca: 'voca-form',
  vocaforms: 'voca-form',
  findmyrepo: 'find-my-repo',
  gitrepo: 'find-my-repo',
  sportsolio: 'sportfolio',
};

export function resolveSlug(slug: string | undefined) {
  if (!slug) return { entry: undefined, redirectTo: undefined };
  const entry = CASE_STUDIES.find(c => c.slug === slug);
  if (entry) return { entry, redirectTo: undefined };
  const target = ALIASES[slug];
  return { entry: undefined, redirectTo: target };
}

/** The next project in the loop, derived rather than hardcoded per page. */
export function nextCaseStudy(slug: string): CaseStudyEntry {
  const i = CASE_STUDIES.findIndex(c => c.slug === slug);
  return CASE_STUDIES[(i + 1 + CASE_STUDIES.length) % CASE_STUDIES.length];
}
