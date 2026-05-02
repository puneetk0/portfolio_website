import React, { useState } from 'react';
import { figtree, CONTENT_LEFT, T, ls } from '../utils/constants';
import { useParallax } from '../hooks/useParallax';
import { ImageCluster } from '../components/ImageCluster';
import { SELECTED_PROJECTS, PROJECT_LAYOUTS } from '../../data/portfolio';

export function Projects({ ek, isMobile, isActive }: { ek: number; isMobile: boolean; isActive: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const { sectionRef, groupRef, onMouseMove, onMouseLeave } = useParallax(isMobile);

  return (
    <div
      ref={sectionRef}
      style={{ width: '100%', height: '100%', position: 'relative' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
    >
      {!isMobile && <ImageCluster layouts={PROJECT_LAYOUTS} activeGroup={hovered} groupRef={groupRef} />}

      <div key={ek} style={{
        position: 'absolute', left: CONTENT_LEFT,
        top: isMobile ? 'calc(50% - 145px)' : 'calc(50% - 204px)',
        maxWidth: isMobile ? 'calc(100vw - 80px)' : undefined,
        ...figtree, color: 'white', zIndex: 2,
      }}>
        <p style={{ fontWeight: 400, ...T.label, color: '#888', lineHeight: 'normal', margin: isMobile ? '0 0 10px' : '0 0 14px', ...ls(0) }}>
          <span style={{ color: '#555' }}>//</span>
          <span style={{ color: '#888' }}>&nbsp;Selected Projects</span>
        </p>
        {SELECTED_PROJECTS.map((p, i) => (
          <div key={p.name} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
            style={{ opacity: hovered !== null && hovered !== i ? 0.12 : 1, transition: 'opacity 280ms ease' }}>
            <div style={{ lineHeight: isMobile ? 1.65 : 2, ...ls(i + 1) }}>
              <span style={{ fontWeight: 600, ...T.name }}>{p.name}</span>
              <span style={{ fontWeight: 400, ...T.desc, color: '#888' }}>&nbsp;{p.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
