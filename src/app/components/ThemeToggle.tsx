import React, { useEffect, useState } from 'react';
import { geist } from '../utils/constants';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved === 'light') return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const toggle = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <style>{`
        .theme-toggle-btn {
          position: relative;
          display: inline-block;
          padding: 8px 6px;
          margin: -8px -6px;
          background: none;
          border: none;
          cursor: pointer;
        }
        .theme-toggle-text {
          position: relative;
          color: var(--text-muted);
          opacity: 0.6;
          transition: color 200ms ease, opacity 200ms ease;
        }
        .theme-toggle-btn:hover .theme-toggle-text {
          color: var(--text-color);
          opacity: 1;
        }
        .theme-toggle-text::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 1px;
          bottom: -2px;
          left: 0;
          background-color: var(--text-color);
          transform: scaleX(0);
          transform-origin: bottom right;
          transition: transform 450ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .theme-toggle-btn:hover .theme-toggle-text::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
      `}</style>
      <div style={{
        position: 'fixed', bottom: '28px', right: '36px',
        zIndex: 1000, display: 'flex', alignItems: 'center',
      }}>
        <button
          onClick={toggle}
          data-magnetic="true"
          className="theme-toggle-btn"
          style={{ ...geist, fontSize: '11px', letterSpacing: '0.07em', textTransform: 'uppercase' }}
        >
          <span className="theme-toggle-text">{theme === 'dark' ? 'light' : 'dark'}</span>
        </button>
      </div>
    </>
  );
}
