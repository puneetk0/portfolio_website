import React, { useState, useRef, useCallback, useEffect } from 'react';
import { figtree, CONTENT_LEFT, T, ls, serifItalic } from '../utils/constants';
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
          ...figtree, color: 'var(--text-color)', zIndex: 3,
        }}
      >
        <p style={{ fontWeight: 400, ...T.label, color: 'var(--text-muted)', lineHeight: 'normal', margin: isMobile ? '0 0 10px' : '0 0 14px', ...ls(0) }}>
          <span style={{ ...serifItalic, color: 'var(--label-color)', fontSize: '1.2em', marginRight: '6px' }}>//</span>
          <span style={{ color: 'var(--text-muted)' }}>&nbsp;Beyond the screen</span>
        </p>

        {CATEGORIES.map((cat, i) => {
          const isHovered = active === i;
          return (
            <div
              key={cat.name}
              onMouseEnter={() => activateRow(i)}
              onMouseLeave={scheduleLeave}
              style={{
                lineHeight: isMobile ? 1.65 : 2,
                opacity: active !== null && !isHovered ? 0.28 : 1,
                transform: isHovered ? 'translateX(10px)' : 'translateX(0px)',
                transition: 'opacity 250ms ease, transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                padding: '4px 0',
                cursor: 'pointer',
                ...ls(i + 1),
              }}
            >
              <div data-magnetic="true" style={{ display: 'inline-block' }}>
                <span style={{ fontWeight: 600, ...T.name, color: isHovered ? 'var(--text-color)' : 'var(--text-secondary)', transition: 'color 200ms ease' }}>
                  {cat.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
