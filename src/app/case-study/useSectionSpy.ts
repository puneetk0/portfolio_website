import { useCallback, useEffect, useRef, useState } from 'react';

/* ─── useSectionSpy ───────────────────────────────────────────────────────────
   Replaces `useSmoothScroll`, which was duplicated byte-for-byte in all four
   case-study pages and carried a family of defects that all followed from one
   decision — driving position with `window.scrollTo` from a rAF loop:

   - It wrote scroll position every frame, and each write fired the page's own
     `scroll` listener, which called setScrollY AND setActiveNav — re-rendering
     an 800-1000 line JSX tree at 60fps for the duration of every scroll, plus
     getBoundingClientRect() on six refs per frame.
   - Its target/current refs were only updated by wheel and touchmove, so
     keyboard, scrollbar drag and find-in-page moved the real scroll position
     without updating them, and the next wheel tick jumped back.
   - It clamped against document.body.scrollHeight (should be documentElement),
     re-read on every event, never recomputed on resize, and read before images
     with `aspect: auto` had settled — so the ceiling was stale-low on load.
   - touchmove was passive:false with an unconditional preventDefault and no
     touchend, killing momentum, overscroll and pinch-zoom — while the desktop
     sidenav it powered was display:none below 900px.

   Native scroll needs none of it. This hook only observes.
   ───────────────────────────────────────────────────────────────────────────── */

/** Stable element id for a section, so the nav can be real anchors. */
export const sectionId = (name: string) =>
  'cs-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function useSectionSpy(sections: readonly string[]) {
  const count = sections.length;
  /** `null` while the hero is on screen. The previous implementation
   *  initialised to 0 and could only increase, so the sidenav highlighted
   *  "Problem" while the reader was still looking at the title. */
  const [active, setActive] = useState<number | null>(null);
  const els = useRef<(HTMLElement | null)[]>([]);
  const programmatic = useRef(false);

  const ids = sections.map(sectionId);

  /* The ref also stamps the id. Sections previously had refs but no ids, so the
     nav had to be buttons driving an imperative scroll — which meant no
     deep-linking, no copy-link, no middle-click, and nothing for find-in-page
     or a screen reader to land on. Stamping here keeps the ids derived from the
     same list the nav renders from, so the two cannot drift. */
  const setRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      els.current[i] = el;
      if (el && ids[i] && !el.id) el.id = ids[i];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ids.join('|')]
  );

  useEffect(() => {
    const nodes = els.current.filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      entries => {
        if (programmatic.current) return;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = nodes.indexOf(entry.target as HTMLElement);
          if (i !== -1) setActive(i);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    nodes.forEach(n => io.observe(n));
    return () => io.disconnect();
  }, [count]);

  /** Scrolls to a section. `scroll-margin-top` on the target handles the offset,
   *  which also makes native anchor links and find-in-page land correctly —
   *  the old hook hardcoded a magic `-80` that did neither. */
  const scrollToSection = useCallback((i: number) => {
    const el = els.current[i];
    if (!el) return;
    programmatic.current = true;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    window.setTimeout(() => { programmatic.current = false; }, 700);
  }, []);

  return { active, setRef, scrollToSection, ids };
}

/** Writes scroll progress to CSS custom properties on <html> instead of React
 *  state, so consumers can use `opacity: var(--cs-hero-fade)` without any
 *  component re-rendering on scroll. */
export function useScrollVars() {
  useEffect(() => {
    const root = document.documentElement;
    /* Cached so the scroll handler performs ZERO layout reads and can write
       directly instead of deferring to requestAnimationFrame. Two custom
       property writes per scroll event are cheap; a `scrollHeight` read per
       event is what actually costs (forced layout), and that was the reason the
       old implementation reached for rAF in the first place. Not depending on
       rAF also means the values can't go stale while frames are throttled. */
    let max = 0;

    const measure = () => {
      max = root.scrollHeight - window.innerHeight;
    };

    const write = () => {
      const y = window.scrollY;
      root.style.setProperty('--cs-hero-fade', String(Math.max(0, 1 - y / 500)));
      root.style.setProperty('--cs-progress', max > 0 ? String(Math.min(1, y / max)) : '0');
    };

    const onResize = () => { measure(); write(); };

    measure();
    write();

    window.addEventListener('scroll', write, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    /* The page grows as images with `aspect-ratio: auto` decode, so a height
       measured at mount is stale-low — the same root cause as the old hook's
       broken scroll clamp. Re-measure as content settles. */
    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => onResize())
      : null;
    ro?.observe(document.body);

    return () => {
      window.removeEventListener('scroll', write);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
      root.style.removeProperty('--cs-hero-fade');
      root.style.removeProperty('--cs-progress');
    };
  }, []);
}
