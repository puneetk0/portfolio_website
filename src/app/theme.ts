/* ─── Theme: single owner ─────────────────────────────────────────────────────
   Previously two independent owners wrote localStorage['portfolio-theme'] and
   both applied a class to documentElement *and* body — while only the body
   class matched any rule, leaving the html class inert and <html> stuck dark.

   Now: one owner, one attribute (`data-theme` on <html>), read pre-paint by an
   inline script in index.html so there is no flash.
   ───────────────────────────────────────────────────────────────────────────── */

export type Theme = 'dark' | 'light';

const KEY = 'portfolio-theme';

/** The site is designed dark-first, and light mode is not yet correct inside
 *  the case studies. Until that lands, an unset preference resolves to dark
 *  rather than following `prefers-color-scheme`. */
export const DEFAULT_THEME: Theme = 'dark';

export function readStoredTheme(): Theme {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* private mode / blocked storage — fall through to the default */
  }
  return DEFAULT_THEME;
}

/** Reads what the pre-paint script already resolved, so React never disagrees
 *  with the DOM on first render. */
export function currentTheme(): Theme {
  const attr = document.documentElement.dataset.theme;
  return attr === 'light' || attr === 'dark' ? attr : readStoredTheme();
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.dataset.theme = theme;

  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* non-fatal: the theme still applies for this session */
  }
}
