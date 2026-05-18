import React, { useRef, useState } from 'react';
import { EASE_TEXT, caveat } from '../utils/constants';
import type { PolaroidDef } from '../../data/portfolio';

export function Polaroid({ card, isVisible, cancelLeave, scheduleLeave }: {
  card: PolaroidDef;
  isVisible: boolean;
  cancelLeave: () => void;
  scheduleLeave: () => void;
}) {
  const dur = isVisible ? 280 : 180;
  const delay = isVisible ? card.delay : 0;
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [glare, setGlare] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlare({ x, y, active: true });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={(e) => {
        cancelLeave();
        setGlare({ x: 50, y: 50, active: true });
      }}
      onMouseLeave={() => {
        scheduleLeave();
        setGlare(prev => ({ ...prev, active: false }));
      }}
      onMouseMove={handleMouseMove}
      style={{
        width: 260, // Scaled up further
        backgroundColor: '#f9f8f4', 
        boxShadow: [
          '0 2px 4px rgba(0,0,0,0.4)',
          '0 8px 16px rgba(0,0,0,0.3)',
          '0 16px 32px rgba(0,0,0,0.3)',
          '0 32px 64px rgba(0,0,0,0.4)',
        ].join(', '),
        padding: '16px 16px 70px 16px', 
        opacity: isVisible ? 1 : 0,
        transform: `scale(${isVisible ? 1 : 0.85}) translateY(${isVisible ? 0 : 20}px)`,
        transition: `opacity ${dur}ms ${EASE_TEXT} ${delay}ms, transform ${dur}ms ${EASE_TEXT} ${delay}ms`,
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")`
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)`,
        opacity: glare.active ? 1 : 0,
        transition: 'opacity 300ms ease',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', width: 228, height: 228, background: '#111' }}>
        <img
          src={card.src}
          alt={card.caption}
          draggable={false}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block', userSelect: 'none',
            filter: 'contrast(1.1) saturate(0.85) sepia(0.15)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4), inset 0 0 1px rgba(255,255,255,0.2)',
          pointerEvents: 'none',
        }} />
      </div>

      <div style={{
        position: 'absolute',
        bottom: 12,
        left: 0, right: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 0,
      }}>
        <div style={{ ...caveat, fontSize: '28px', fontWeight: 700, color: '#1a1816', lineHeight: 1 }}>
          {card.caption}
        </div>
        <div style={{ ...caveat, fontSize: '20px', fontWeight: 500, color: '#6a625b', lineHeight: 1 }}>
          {card.subtitle}
        </div>
      </div>
    </div>
  );
}
