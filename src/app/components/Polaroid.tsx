import React from 'react';
import { EASE_TEXT, geist } from '../utils/constants';
import type { PolaroidDef } from '../../data/portfolio';

export function Polaroid({ card, isVisible, cancelLeave, scheduleLeave }: {
  card: PolaroidDef;
  isVisible: boolean;
  cancelLeave: () => void;
  scheduleLeave: () => void;
}) {
  const dur = isVisible ? 260 : 150;
  const delay = isVisible ? card.delay : 0;

  return (
    <div
      onMouseEnter={cancelLeave}
      onMouseLeave={scheduleLeave}
      style={{
        width: 154,
        background: '#f0ebe3',
        boxShadow: [
          '0 1px 2px rgba(0,0,0,0.28)',
          '0 4px 10px rgba(0,0,0,0.20)',
          '0 14px 32px rgba(0,0,0,0.22)',
          '0 28px 56px rgba(0,0,0,0.28)',
        ].join(', '),
        outline: '1px solid rgba(0,0,0,0.07)',
        opacity: isVisible ? 1 : 0,
        transform: `scale(${isVisible ? 1 : 0.88}) translateY(${isVisible ? 0 : 10}px)`,
        transition: `opacity ${dur}ms ${EASE_TEXT} ${delay}ms, transform ${dur}ms ${EASE_TEXT} ${delay}ms`,
      }}
    >
      <div style={{ padding: '12px 12px 6px 12px', lineHeight: 0, position: 'relative' }}>
        <img
          src={card.src}
          alt={card.caption}
          draggable={false}
          style={{
            width: 130, height: 130,
            objectFit: 'cover', display: 'block', userSelect: 'none',
            filter: 'contrast(1.05) saturate(0.82) sepia(0.07)',
          }}
        />
        <div style={{
          position: 'absolute', inset: '12px 12px 6px 12px',
          boxShadow: 'inset 0 0 14px rgba(0,0,0,0.18)', pointerEvents: 'none',
        }} />
      </div>
      <div style={{
        height: 46,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 4, overflow: 'hidden',
      }}>
        <div style={{ ...geist, fontSize: '11px', fontWeight: 500, color: '#2a2018', letterSpacing: '0.07em', lineHeight: 1, whiteSpace: 'nowrap' }}>
          {card.caption}
        </div>
        <div style={{ ...geist, fontSize: '9.5px', fontWeight: 400, color: '#8a7d74', letterSpacing: '0.05em', lineHeight: 1, whiteSpace: 'nowrap' }}>
          {card.subtitle}
        </div>
      </div>
    </div>
  );
}
