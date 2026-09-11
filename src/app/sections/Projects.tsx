import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ls, serifItalic } from '../utils/constants';
import { useParallax } from '../hooks/useParallax';
import { ImageCluster } from '../components/ImageCluster';
import { RowMedia } from '../components/RowMedia';
import { SELECTED_PROJECTS, PROJECT_LAYOUTS } from '../../data/portfolio';

export function Projects({ isMobile, isActive }: { isMobile: boolean; isActive: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const { sectionRef, groupRef, onMouseMove, onMouseLeave } = useParallax(isMobile);

  /* Default-active row. A recruiter's first pass is 30-60 seconds, and this
     list previously rendered as three bare lines with no signal that hovering
     did anything — so the work was invisible during exactly the pass that
     decides whether they keep reading. Row 0 is active on entry and releases
     on the first real pointer movement. */
  const released = useRef(false);
  useEffect(() => {
    if (!isActive || isMobile) return;
    if (!released.current) setHovered(0);
    const release = () => {
      released.current = true;
      setHovered(null);
      window.removeEventListener('pointermove', release);
    };
    window.addEventListener('pointermove', release, { once: true });
    return () => window.removeEventListener('pointermove', release);
  }, [isActive, isMobile]);

  return (
    <>
      {/* The hover cluster. This is the interaction the section is built around
          — a row lights up and its work flies in, parallaxing with the pointer.
          It was briefly replaced with an always-visible inline strip; that was
          the wrong call and it is back. */}
      {!isMobile && (
        <div className="section-decor" ref={sectionRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
          <ImageCluster layouts={PROJECT_LAYOUTS} activeGroup={hovered} groupRef={groupRef} />
        </div>
      )}

      <div className="home__inner">
        <div className="section-content">
          <h2 className="t-eyebrow section-label" style={ls(0)}>
            <span aria-hidden="true" className="section-label__slash" style={serifItalic}>//</span>
            Selected Projects
          </h2>

          <ol className="row-list">
            {SELECTED_PROJECTS.map((p, i) => {
              const isHovered = hovered === i;
              return (
                <li key={p.name} style={ls(i + 1)}>
                  <Link
                    to={`/case-study/${p.slug}`}
                    className="row"
                    data-dim={hovered !== null && !isHovered ? 'true' : 'false'}
                    data-on={isHovered ? 'true' : 'false'}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                  >
                    <span className="t-eyebrow t-num row__index" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span data-magnetic="true" className="row__inner">
                      <span className="t-row row__name">{p.name}</span>
                      <span className="t-desc row__desc">{p.desc}</span>
                    </span>
                  </Link>

                  {/* Mobile only — there is no hover to reveal the cluster
                      with, and before this mobile visitors saw no work at all.
                      Hidden above 900px by CSS, where the cluster takes over. */}
                  {p.media && <RowMedia media={p.media} active={isHovered} />}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
}
