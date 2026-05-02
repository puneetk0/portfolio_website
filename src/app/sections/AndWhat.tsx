import React, { useState, useRef, useCallback, useEffect } from 'react';
import { figtree, CONTENT_LEFT, T, ls } from '../utils/constants';
import { Polaroid } from '../components/Polaroid';
import { CATEGORIES } from '../../data/portfolio';

export function AndWhat({ ek, isMobile, isActive }: { ek: number; isMobile: boolean; isActive: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelLeave = useCallback(() => {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
  }, []);
  const scheduleLeave = useCallback(() => {
    cancelLeave();
    leaveTimer.current = setTimeout(() => setActive(null), 300);
  }, [cancelLeave]);
  const activateRow = useCallback((i: number) => { cancelLeave(); setActive(i); }, [cancelLeave]);

  useEffect(() => () => { if (leaveTimer.current) clearTimeout(leaveTimer.current); }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} aria-hidden={!isActive} tabIndex={isActive ? 0 : -1}>
      {!isMobile && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
          {CATEGORIES.map((cat, catIdx) =>
            cat.cards.map((card, cardIdx) => {
              const isVisible = active === catIdx;
              return (
                <div
                  key={`${catIdx}-${cardIdx}`}
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${card.x}px)`,
                    top: card.y,
                    transform: `rotate(${card.r}deg)`,
                    transformOrigin: 'center center',
                    pointerEvents: isVisible ? 'auto' : 'none',
                  }}
                >
                  <Polaroid card={card} isVisible={isVisible} cancelLeave={cancelLeave} scheduleLeave={scheduleLeave} />
                </div>
              );
            })
          )}
        </div>
      )}

      <div
        key={ek}
        style={{
          position: 'absolute', left: CONTENT_LEFT,
          top: isMobile ? 'calc(50% - 145px)' : 'calc(50% - 204px)',
          maxWidth: isMobile ? 'calc(100vw - 80px)' : undefined,
          ...figtree, color: 'white', zIndex: 3,
        }}
      >
        <p style={{ fontWeight: 400, ...T.label, color: '#888', lineHeight: 'normal', margin: isMobile ? '0 0 10px' : '0 0 14px', ...ls(0) }}>
          <span style={{ color: '#555' }}>//</span>
          <span style={{ color: '#888' }}>&nbsp;Beyond the screen</span>
        </p>

        {CATEGORIES.map((cat, i) => (
          <div
            key={cat.name}
            onMouseEnter={() => activateRow(i)}
            onMouseLeave={scheduleLeave}
            style={{
              lineHeight: isMobile ? 1.65 : 2,
              opacity: active !== null && active !== i ? 0.28 : 1,
              transition: 'opacity 250ms ease',
              ...ls(i + 1),
            }}
          >
            <span style={{ color: '#666', fontWeight: 400, ...T.name }}>&amp;&nbsp;</span>
            <span style={{ fontWeight: 600, ...T.name, color: active === i ? '#ffffff' : '#cccccc', transition: 'color 200ms ease' }}>
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
