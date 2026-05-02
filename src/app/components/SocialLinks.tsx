import React from 'react';
import { geist, CONTENT_LEFT } from '../utils/constants';
import { SOCIAL_LINKS } from '../../data/portfolio';

export function SocialLinks() {
  return (
    <div style={{
      position: 'fixed', bottom: '36px', left: CONTENT_LEFT,
      zIndex: 1000, display: 'flex', alignItems: 'center', gap: '20px',
    }}>
      {SOCIAL_LINKS.map(link => (
        <a
          key={link.id}
          href={link.href}
          data-magnetic="true"
          target={link.id !== 'mail' ? '_blank' : undefined}
          rel="noopener noreferrer"
          style={{
            ...geist, fontSize: '11px', letterSpacing: '0.07em',
            textDecoration: 'none', color: 'rgba(255,255,255,0.22)',
            transition: 'color 200ms ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.textDecoration = 'underline';
            e.currentTarget.style.textUnderlineOffset = '4px';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.22)';
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
