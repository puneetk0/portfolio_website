import React from 'react';
import { SECTION_LABELS } from '../../data/portfolio';

export function MobileIndicator({ active, navigate }: { active: number; navigate: (n: number) => void }) {
  return (
    <div style={{
      position: 'fixed', top: '22px', left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      display: 'flex', alignItems: 'center', gap: '4px',
    }}>
      {SECTION_LABELS.map((label, i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            onClick={() => navigate(i)}
            aria-label={`Go to ${label} section`}
            style={{
              background: 'none', border: 'none',
              padding: '10px 8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 0,
            }}
          >
            <div style={{
              width: isActive ? '18px' : '4px',
              height: '4px',
              borderRadius: isActive ? '2px' : '50%',
              background: isActive ? 'var(--indicator-active)' : 'var(--indicator-inactive)',
              transition: 'width 280ms cubic-bezier(0.76, 0, 0.24, 1), background 220ms ease, border-radius 280ms ease',
            }} />
          </button>
        );
      })}
    </div>
  );
}
