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
        
        // Calculate circle styles (reverted to the hollow circlet design)
        let size = '4px';
        let bg = 'rgba(255,255,255,0.25)';
        let border = '0px solid white';
        
        if (isActive) {
          size = '6px';
          bg = 'white';
        } else if (isHov) {
          size = '14px';
          bg = 'transparent';
          border = '1.5px solid rgba(255,255,255,0.8)';
        }

        return (
          <div
            key={i}
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
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
                width: '30px', 
                height: '30px',
              }}
            >
              <div style={{
                width: size,
                height: size,
                borderRadius: '50%',
                flexShrink: 0,
                background: bg,
                border: border,
                transition: 'width 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94), height 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94), background 250ms ease, border 250ms ease',
                pointerEvents: 'none',
                boxSizing: 'border-box'
              }} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
