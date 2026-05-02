import React from 'react';
import { EASE_TEXT } from '../utils/constants';
import type { ImgDef } from '../../data/portfolio';

export function ImageCluster({ layouts, activeGroup, groupRef }: {
  layouts: ImgDef[][];
  activeGroup: number | null;
  groupRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={groupRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      {layouts.map((layout, groupIdx) =>
        layout.map((img, imgIdx) => {
          const isVisible = activeGroup === groupIdx;
          const d = isVisible ? img.delay : 0;
          const dur = isVisible ? 380 : 220;
          return (
            <div key={`${groupIdx}-${imgIdx}`} style={{ position: 'absolute', left: `calc(50% + ${img.x}px)`, top: `calc(50% + ${img.y}px)`, width: img.w, height: img.h, transform: `rotate(${img.r}deg)`, transformOrigin: 'center center' }}>
              <img src={img.src} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', userSelect: 'none', opacity: isVisible ? 1 : 0, transform: `translateY(${isVisible ? 0 : 18}px)`, transition: `opacity ${dur}ms ${EASE_TEXT} ${d}ms, transform ${dur}ms ${EASE_TEXT} ${d}ms, filter 500ms ease`, filter: isVisible ? 'grayscale(0%) brightness(1)' : 'grayscale(100%) brightness(0.6)' }} />
            </div>
          );
        })
      )}
    </div>
  );
}
