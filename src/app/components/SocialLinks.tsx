import React from 'react';
import { geist, CONTENT_LEFT } from '../utils/constants';
import { SOCIAL_LINKS } from '../../data/portfolio';

export function SocialLinks() {
  return (
    <>
      <style>{`
        .social-link {
          position: relative;
          display: inline-block;
          padding: 8px 6px; /* Larger magnetic hit area */
          margin: -8px -6px;
        }
        .social-text {
          position: relative;
          color: rgba(255, 255, 255, 0.4);
          transition: color 200ms ease;
        }
        .social-link:hover .social-text {
          color: rgba(255, 255, 255, 1);
        }
        .social-text::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 1px;
          bottom: -2px;
          left: 0;
          background-color: white;
          transform: scaleX(0);
          transform-origin: bottom right;
          transition: transform 450ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .social-link:hover .social-text::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
      `}</style>
      <div style={{
        position: 'fixed', bottom: '36px', left: CONTENT_LEFT,
        zIndex: 1000, display: 'flex', alignItems: 'center', gap: '28px',
      }}>
        {SOCIAL_LINKS.map(link => (
          <a
            key={link.id}
            href={link.href}
            data-magnetic="true"
            target={link.id !== 'mail' ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="social-link"
            style={{ ...geist, fontSize: '11px', letterSpacing: '0.07em', textDecoration: 'none' }}
          >
            <span className="social-text">{link.label}</span>
          </a>
        ))}
      </div>
    </>
  );
}
