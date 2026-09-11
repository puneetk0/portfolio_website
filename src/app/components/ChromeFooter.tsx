import React, { useState } from 'react';
import { geist } from '../utils/constants';
import { SOCIAL_LINKS } from '../../data/portfolio';
import { applyTheme, currentTheme, type Theme } from '../theme';

/* ─── ChromeFooter ────────────────────────────────────────────────────────────
   SocialLinks and ThemeToggle were two independent `position: fixed` elements
   both anchored at `bottom: 28px` — one from the left at the content gutter,
   one from the right. At 375px their boxes overlapped by roughly 52px, and
   because only `bottom` was set, the social row's second line grew *upward*
   into the content when it wrapped.

   Merging them into a single flow container makes that overlap structurally
   impossible at any width, and the wrap now pushes the bar's own height
   instead of colliding with the page.
   ───────────────────────────────────────────────────────────────────────────── */

export function ChromeFooter({ showLinks = true }: { showLinks?: boolean }) {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document === 'undefined' ? 'dark' : currentTheme()
  );

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setTheme(next);
  };

  const nextLabel = theme === 'dark' ? 'light' : 'dark';

  return (
    <div className={showLinks ? 'chrome-footer' : 'chrome-footer chrome-footer--toggle-only'}>
      {showLinks && (
      <ul className="chrome-footer__links">
        {SOCIAL_LINKS.filter(l => l.id !== 'Resume').map(link => (
          <li key={link.id}>
            <a
              href={link.href}
              data-magnetic="true"
              target={link.id !== 'mail' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="link-underline"
              style={{ ...geist, fontSize: '11px', letterSpacing: '0.07em' }}
            >
              <span className="link-underline__text">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
      )}

      <button
        type="button"
        onClick={toggle}
        data-magnetic="true"
        className="link-underline"
        /* The bare "light"/"dark" text is ambiguous out of context — it reads
           as the current theme rather than the action. */
        aria-label={`Switch to ${nextLabel} theme`}
        aria-pressed={theme === 'light'}
        style={{ ...geist, fontSize: '11px', letterSpacing: '0.07em', textTransform: 'uppercase' }}
      >
        <span className="link-underline__text">{nextLabel}</span>
      </button>
    </div>
  );
}
