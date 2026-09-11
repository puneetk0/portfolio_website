import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { figtree, serifItalic } from '../utils/constants';

/* ─── Case-study kit ──────────────────────────────────────────────────────────
   These helpers were duplicated byte-for-byte across all four case-study pages
   (verified by md5 on lines 1-151). One definition each, imported instead.

   PAD also diverged: three files used `min(300px, 15vw)` and Sportfolio used
   `min(142px, 9.4vw)`, giving visibly different gutters between projects. The
   real difference was the *measure*, not the gutter — at 1440px that was 1008px
   of content versus 1170px — so this now centres a measure instead of picking
   one of the two vw values, which also fixes ultra-wide behaviour and gives
   phones a sane 20-24px gutter rather than 9vw.
   ───────────────────────────────────────────────────────────────────────────── */

export const PAD = 'var(--cs-gutter)';
export const BG = 'var(--cs-surface)';

export const LBL: React.CSSProperties = {
  fontSize: '0.68rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.22em',
  color: 'var(--cs-fg-3)',
  ...figtree,
  margin: 0,
};

export function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // No IntersectionObserver (or reduced motion) must never leave content
    // hidden at opacity 0 — reveal-on-scroll is an enhancement, not a gate.
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function Reveal({ children, delay = 0, y = 28 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0px)' : `translateY(${y}px)`,
      transition: `opacity 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/** Section eyebrow. The `//` is decorative and hidden from assistive tech —
 *  it was previously announced as "slash slash". */
export function SL({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ ...LBL, margin: '0 0 3rem' }}>
      <span aria-hidden="true" style={{ ...serifItalic, color: 'var(--cs-fg-faint)', fontSize: '1.3em', marginRight: '6px' }}>//</span>
      {children}
    </p>
  );
}

export function HR() {
  return <div style={{ width: '100%', height: '1px', background: 'var(--cs-line-faint)' }} />;
}

/** Repo / live / demo link. Defined in three of the four pages and rendered in
 *  exactly one, which is why three case studies exposed no links at all. */
export function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '0.65rem 1.25rem',
        /* Measured 171x41 and 137x41 — under the 44px WCAG 2.5.8 floor. */
        minHeight: '44px',
        border: '1px solid var(--cs-line)', borderRadius: '4px',
        textDecoration: 'none', color: 'var(--cs-fg)',
        fontSize: '0.75rem', letterSpacing: '0.04em', ...figtree,
        transition: 'background 0.2s ease, border-color 0.2s ease',
        background: 'var(--cs-wash)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--cs-wash-3)';
        e.currentTarget.style.borderColor = 'var(--cs-fg-strong)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--cs-wash)';
        e.currentTarget.style.borderColor = 'var(--cs-line)';
      }}
    >
      {label} <span aria-hidden="true">↗</span>
    </a>
  );
}

/* ─── CaseStudyChrome ─────────────────────────────────────────────────────────
   The page's navigation, at both sizes, from one definition.

   Two things were missing rather than broken. On mobile `.cs-sidenav` was
   `display: none` with NO replacement, so an 800-1500 word article had no
   section navigation and no reading progress at all. And the back control was
   `position: absolute; top: 36px` with `padding: 0` — it measured 43x19 and
   scrolled off the top of the page, so once you were reading there was no way
   back.

   The desktop rail's states are now pure CSS. It used to write
   `style.opacity` imperatively on mouseenter/mouseleave, and the two paths
   disagreed: inactive items rendered at 0.6 but `onMouseLeave` restored 0.3,
   and their labels 0.5 -> 0.15. So every item you hovered stayed permanently
   dimmer than it started. Deriving from `aria-current` and `:hover` makes that
   class of drift impossible.

   Items are real anchors, so deep links, copy-link, middle-click and
   find-in-page all work; the click handler only exists to honour
   reduced-motion and to avoid pushing a history entry per section. */
export function CaseStudyChrome({ name, sections, ids, active, onNav }: {
  name: string;
  sections: readonly string[];
  ids: readonly string[];
  active: number | null;
  onNav: (i: number) => void;
}) {
  const navigate = useNavigate();

  const items = sections.map((label, i) => (
    <li key={label} className="cs-nav__item">
      <a
        className="cs-nav__link"
        href={`#${ids[i]}`}
        aria-current={active === i ? 'true' : undefined}
        onClick={e => {
          e.preventDefault();
          onNav(i);
          window.history.replaceState(null, '', `#${ids[i]}`);
        }}
      >
        <span className="cs-nav__label">{label}</span>
        <span aria-hidden="true" className="cs-nav__tick" />
      </a>
    </li>
  ));

  return (
    <>
      {/* Sticky mobile bar: back, project name, progress, section list. */}
      <div className="cs-bar">
        <button type="button" className="cs-bar__back" onClick={() => navigate('/')}>
          <span aria-hidden="true">&larr;</span> Back
        </button>
        <span className="cs-bar__name">{name}</span>
        {/* <details> rather than JS state: keyboard-operable, screen-reader
            correct and closed by default with no script at all. */}
        <details className="cs-bar__menu">
          <summary aria-label="Jump to a section">Sections</summary>
          <ol className="cs-bar__list">{items}</ol>
        </details>
        {/* Driven by --cs-progress, which useScrollVars writes on <html>, so
            this never re-renders on scroll. */}
        <span aria-hidden="true" className="cs-bar__progress" />
      </div>

      {/* Desktop right rail. */}
      <nav className="cs-nav" aria-label={`${name} sections`}>
        <ol className="cs-nav__list">{items}</ol>
      </nav>
    </>
  );
}
