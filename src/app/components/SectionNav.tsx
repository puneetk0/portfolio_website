import React, { useState } from 'react';
import { geist } from '../utils/constants';
import { SECTIONS } from '../../data/portfolio';

/* ─── SectionNav ──────────────────────────────────────────────────────────────
   Replaces ProgressIndicator + MobileIndicator, which were two components
   rendering the same list with two different sets of markup and two copies of
   the label data.

   Now one <nav> of real anchors. Real anchors give deep-linking, middle-click,
   copy-link, and a correct screen-reader announcement for free — the previous
   <button>s gave none of that. The desktop right-rail and the mobile top pills
   are the same DOM, switched by CSS.
   ───────────────────────────────────────────────────────────────────────────── */

export function SectionNav({
  active,
  onNavigate,
}: {
  active: number;
  onNavigate: (i: number) => void;
}) {
  const [hov, setHov] = useState<number | null>(null);

  return (
    <nav className="section-nav" aria-label="Sections">
      <ol className="section-nav__list">
        {SECTIONS.map((section, i) => {
          const isActive = i === active;
          const isHov = i === hov;
          return (
            <li key={section.id} className="section-nav__item">
              <a
                href={`#${section.id}`}
                data-magnetic="true"
                aria-current={isActive ? 'true' : undefined}
                /* aria-label rather than a visually-hidden sibling: the
                   stylized label is still in the a11y tree even at opacity 0,
                   so a duplicate made screen readers announce "intro Intro". */
                aria-label={section.name}
                className="section-nav__link"
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
                onFocus={() => setHov(i)}
                onBlur={() => setHov(null)}
                onClick={e => {
                  // Keep the anchor semantics but drive the scroll ourselves so
                  // reduced-motion is honoured and no history entry is pushed.
                  e.preventDefault();
                  onNavigate(i);
                  window.history.replaceState(null, '', `#${section.id}`);
                }}
              >
                <span
                  className="section-nav__label"
                  aria-hidden="true"
                  style={{
                    ...geist,
                    opacity: isHov ? 1 : 0,
                    transform: isHov ? 'translateX(0)' : 'translateX(6px)',
                  }}
                >
                  {section.nav}
                </span>
                <span className="section-nav__dot" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
