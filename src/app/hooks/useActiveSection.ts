import { useCallback, useEffect, useRef, useState } from 'react';

/* ─── useActiveSection ────────────────────────────────────────────────────────
   Reports which section currently crosses the viewport midline, and scrolls to
   a section on request.

   Replaces the previous timer-driven paging engine (a wheel-delta accumulator,
   a 900ms nav lock, a `setTimeout(650)` and five refs of transition state).
   Scrolling is now the browser's job; this hook only *observes* it.

   `rootMargin: -45% 0/-45%` collapses the observer root to a thin band across
   the middle of the viewport. That is deliberately not a `threshold` — a
   threshold-based observer misreports whenever a section is taller than the
   viewport, which is exactly what happens on mobile once sections carry real
   content.
   ───────────────────────────────────────────────────────────────────────────── */

export function useActiveSection(count: number) {
  const [active, setActive] = useState(0);
  /** Only true once the observer is actually attached and has reported.
   *  Gates the cross-fade so a failure to observe can never leave the page
   *  dimmed and blurred with no way to recover. */
  const [observing, setObserving] = useState(false);
  const els = useRef<(HTMLElement | null)[]>([]);

  const setRef = useCallback(
    (i: number) => (el: HTMLElement | null) => {
      els.current[i] = el;
    },
    []
  );

  useEffect(() => {
    const nodes = els.current.filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0) return;
    if (typeof IntersectionObserver === 'undefined') return; // stays undimmed

    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = nodes.indexOf(entry.target as HTMLElement);
          // Hysteresis: only the section holding the midline band sets state,
          // and identical values are dropped by React, so this settles rather
          // than oscillating at the boundary.
          if (i !== -1) {
            setActive(i);
            setObserving(true);
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    nodes.forEach(n => io.observe(n));
    return () => {
      io.disconnect();
      setObserving(false);
    };
  }, [count]);

  const goTo = useCallback((i: number) => {
    const el = els.current[i];
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }, []);

  return { active, observing, setRef, goTo };
}

/** Scrolls to `#hash` on first paint, before the browser's own scroll
 *  restoration can fight it. Instant on purpose — watching a 600ms animated
 *  jump on load reads as a bug, not as polish. */
export function useHashLanding(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const id = window.location.hash.slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
  }, [enabled]);
}

/** Keeps the URL fragment in step with the active section.
 *  `replaceState`, never `pushState` — pushing would make the Back button walk
 *  backwards through sections instead of leaving the page. */
export function useHashSync(id: string | undefined, enabled: boolean) {
  useEffect(() => {
    if (!enabled || !id) return;
    if (window.location.hash === `#${id}`) return;
    window.history.replaceState(null, '', `#${id}`);
  }, [id, enabled]);
}
