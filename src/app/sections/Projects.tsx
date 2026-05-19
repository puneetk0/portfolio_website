import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { figtree, CONTENT_LEFT, T, ls, serifItalic } from '../utils/constants';
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
        ...figtree, color: 'var(--text-color)', zIndex: 2,
      }}>
        <p style={{ fontWeight: 400, ...T.label, color: 'var(--text-muted)', lineHeight: 'normal', margin: isMobile ? '0 0 10px' : '0 0 14px', ...ls(0) }}>
          <span style={{ ...serifItalic, color: 'var(--label-color)', fontSize: '1.2em', marginRight: '6px' }}>//</span>
          <span style={{ color: 'var(--text-muted)' }}>&nbsp;Selected Projects</span>
        </p>
        {SELECTED_PROJECTS.map((p, i) => {
          const isHovered = hovered === i;
          return (
            <Link 
              key={p.name}
              to={`/case-study/${p.slug}`}
              onMouseEnter={() => setHovered(i)} 
              onMouseLeave={() => setHovered(null)}
              style={{ 
                display: 'block',
                textDecoration: 'none',
                opacity: hovered !== null && !isHovered ? 0.25 : 1, 
                transform: isHovered ? 'translateX(10px)' : 'translateX(0px)',
                transition: 'opacity 300ms ease, transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                padding: '4px 0',
                cursor: 'pointer'
              }}
            >
              <div data-magnetic="true" style={{ display: 'inline-block', lineHeight: isMobile ? 1.65 : 2, ...ls(i + 1) }}>
                <span style={{ fontWeight: 600, ...T.name, color: isHovered ? 'var(--text-color)' : 'var(--text-secondary)', transition: 'color 300ms ease' }}>{p.name}</span>
                <span style={{ fontWeight: 400, ...T.desc, color: 'var(--text-muted)' }}>&nbsp;&nbsp;—&nbsp;&nbsp;{p.desc}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
