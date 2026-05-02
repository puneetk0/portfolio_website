import React, { useState } from 'react';
import { figtree, CONTENT_LEFT, T, ls } from '../utils/constants';
import { useParallax } from '../hooks/useParallax';
import { ImageCluster } from '../components/ImageCluster';
import { PERSONAL_INFO, BUILDING_PROJECTS, HERO_LAYOUTS } from '../../data/portfolio';

export function Hero({ ek, isMobile, isActive }: { ek: number; isMobile: boolean; isActive: boolean }) {
  const [greetingHover, setGreetingHover] = useState(false);
  const [hoveredBuild, setHoveredBuild] = useState<number | null>(null);
  const { sectionRef, groupRef, onMouseMove, onMouseLeave } = useParallax(isMobile);

  const activeGroup = greetingHover ? 0 : hoveredBuild !== null ? hoveredBuild + 1 : null;

  return (
    <div
      ref={sectionRef}
      style={{ width: '100%', height: '100%', position: 'relative' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
    >
      {!isMobile && <ImageCluster layouts={HERO_LAYOUTS} activeGroup={activeGroup} groupRef={groupRef} />}

      <div key={ek} style={{
        position: 'absolute', left: CONTENT_LEFT,
        top: isMobile ? 'calc(50% - 145px)' : 'calc(50% - 204px)',
        maxWidth: isMobile ? 'calc(100vw - 80px)' : undefined,
        ...figtree, color: 'white', zIndex: 2,
      }}>
        <div
          data-cursor="greeting"
          onMouseEnter={() => setGreetingHover(true)}
          onMouseLeave={() => setGreetingHover(false)}
        >
          <p style={{ fontWeight: 600, ...T.name, color: '#888', lineHeight: isMobile ? 1.5 : 1.8, margin: 0, ...ls(0) }}>
            {PERSONAL_INFO.greeting}
          </p>
          <p style={{ fontWeight: 600, ...T.hero, color: 'white', lineHeight: isMobile ? 1.5 : 1.8, margin: 0, ...ls(1) }}>
            {PERSONAL_INFO.tagline}
          </p>
        </div>

        <div style={{ height: isMobile ? '12px' : 'clamp(14px, 2vw, 28px)' }} />

        <p style={{ fontWeight: 400, ...T.label, color: '#888', lineHeight: 'normal', margin: isMobile ? '0 0 8px' : '0 0 12px', ...ls(2) }}>
          <span style={{ color: '#555' }}>//</span>
          <span style={{ color: '#888' }}>&nbsp;What I'm building</span>
        </p>

        {BUILDING_PROJECTS.map((item, i) => (
          <div
            key={item.name}
            onMouseEnter={() => setHoveredBuild(i)}
            onMouseLeave={() => setHoveredBuild(null)}
            style={{ opacity: hoveredBuild !== null && hoveredBuild !== i ? 0.12 : 1, transition: 'opacity 280ms ease', margin: i === 0 ? '0 0 2px' : 0 }}
          >
            <div style={{ lineHeight: isMobile ? 1.65 : 2, ...ls(i + 3) }}>
              <span style={{ fontWeight: 600, ...T.name }}>{item.name}</span>
              <span style={{ fontWeight: 400, ...T.desc, color: '#888' }}>&nbsp;{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
