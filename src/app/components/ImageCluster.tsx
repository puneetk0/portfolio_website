import React from 'react';
import { EASE_TEXT } from '../utils/constants';
import type { ImgDef } from '../../data/portfolio';

export function ImageCluster({ layouts, activeGroup, groupRef }: {
  layouts: ImgDef[][];
  activeGroup: number | null;
  groupRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div ref={groupRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      {layouts.map((layout, groupIdx) =>
        layout.map((img, imgIdx) => {
          const isVisible = activeGroup === groupIdx;
          const d = isVisible ? img.delay : 0;
          const dur = isVisible ? 380 : 220;
          return (
            <div key={`${groupIdx}-${imgIdx}`} style={{ 
              position: 'absolute', 
              left: `calc(50% + ${img.x}px)`, 
              top: `calc(50% + ${img.y}px)`, 
              width: img.w, 
              height: img.h, 
              transform: `rotate(${img.r}deg)`, 
              transformOrigin: 'center center',
              zIndex: isVisible ? 10 : 1,
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                opacity: isVisible ? 1 : 0, 
                transform: `translateY(${isVisible ? 0 : 30}px) scale(${isVisible ? 1 : 0.94})`, 
                transition: `opacity ${dur}ms ${EASE_TEXT} ${d}ms, transform ${dur}ms ${EASE_TEXT} ${d}ms, filter 600ms ease`, 
                filter: isVisible ? 'grayscale(0%) brightness(1) contrast(1.05)' : 'grayscale(100%) brightness(0.5) contrast(0.8)',
              }}>
                <img 
                  src={img.src} 
                  alt="" 
                  draggable={false} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain', 
                    display: 'block', 
                    userSelect: 'none',
                  }} 
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
