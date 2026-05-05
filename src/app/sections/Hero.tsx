import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { figtree, CONTENT_LEFT, T, ls, serifItalic } from '../utils/constants';
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
          <span style={{ ...serifItalic, color: '#555', fontSize: '1.2em', marginRight: '6px' }}>//</span>
          <span style={{ color: '#888' }}>&nbsp;What I'm building</span>
        </p>

        {BUILDING_PROJECTS.map((item, i) => {
          const isHovered = hoveredBuild === i;
          return (
            <Link
              key={item.name}
              to={`/case-study/${item.slug}`}
              onMouseEnter={() => setHoveredBuild(i)}
              onMouseLeave={() => setHoveredBuild(null)}
              style={{
                display: 'block',
                textDecoration: 'none',
                opacity: hoveredBuild !== null && !isHovered ? 0.12 : 1,
                transform: isHovered ? 'translateX(10px)' : 'translateX(0px)',
                transition: 'opacity 280ms ease, transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                margin: i === 0 ? '0 0 2px' : 0,
                padding: '4px 0',
                cursor: 'pointer'
              }}
            >
              <div data-magnetic="true" style={{ display: 'inline-block', lineHeight: isMobile ? 1.65 : 2, ...ls(i + 3) }}>
                <span style={{ fontWeight: 600, ...T.name, color: isHovered ? '#fff' : '#eaeaea', transition: 'color 300ms ease' }}>{item.name}</span>
                <span style={{ fontWeight: 400, ...T.desc, color: '#888' }}>&nbsp;&nbsp;—&nbsp;&nbsp;{item.desc}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
