import React, { useState } from 'react';
import { geist } from '../utils/constants';
import { SECTION_LABELS } from '../../data/portfolio';

export function ProgressIndicator({ active, navigate }: { active: number; navigate: (n: number) => void }) {
  const [hov, setHov] = useState<number | null>(null);
  return (
    <div style={{
      position: 'fixed', right: '36px', top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1000,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px',
    }}>
      {SECTION_LABELS.map((label, i) => {
        const isActive = i === active;
        const isHov = i === hov;
        return (
          <div
            key={i}
            style={{ display: 'flex', alignItems: 'center', gap: '9px' }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
          >
            <span style={{
              ...geist, fontSize: '11px', letterSpacing: '0.06em', whiteSpace: 'nowrap',
              color: 'rgba(255,255,255,0.65)', pointerEvents: 'none',
              opacity: isHov ? 1 : 0,
              transform: isHov ? 'translateX(0)' : 'translateX(6px)',
              transition: 'opacity 160ms ease, transform 160ms ease',
            }}>
              {label}
            </span>
            <button
              data-magnetic="true"
              onClick={() => navigate(i)}
              aria-label={`Go to ${label} section`}
              style={{
                background: 'none', border: 'none', padding: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                lineHeight: 0,
              }}
            >
              <div style={{
                width: isActive ? '5px' : isHov ? '5px' : '3px',
                height: isActive ? '5px' : isHov ? '5px' : '3px',
                borderRadius: '50%', flexShrink: 0,
                background: isActive ? 'white' : isHov ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.20)',
                transition: 'width 220ms ease, height 220ms ease, background 220ms ease',
                pointerEvents: 'none',
              }} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
