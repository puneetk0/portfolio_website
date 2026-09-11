import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ls, serifItalic } from '../utils/constants';
import { useParallax } from '../hooks/useParallax';
import { ImageCluster } from '../components/ImageCluster';
import { RowMedia } from '../components/RowMedia';
import { PERSONAL_INFO, BUILDING_PROJECTS, HERO_LAYOUTS, PORTRAIT, SOCIAL_LINKS } from '../../data/portfolio';

export function Hero({ isMobile, isActive, navigate }: { isMobile: boolean; isActive: boolean; navigate: (to: number) => void }) {
  const [hoveredBuild, setHoveredBuild] = useState<number | null>(null);
  /* Hovering the name lifts the portrait. It does not *reveal* it — the photo
     is always on screen, which is what was asked for. Hover acknowledges. */
  const [attend, setAttend] = useState(false);
  const { sectionRef, groupRef, onMouseMove, onMouseLeave } = useParallax(isMobile);
  const resume = SOCIAL_LINKS.find(l => l.id === 'Resume');

  return (
    <>
      {/* Hovering "Voca Form" now flies its screens in, the same way the
          project rows do. The reported bug was that this row showed nothing at
          all: its media existed in the data and was never rendered, and the
          desktop strip was `display: none` anyway.

          What is deliberately NOT here is the old group of three personal
          photographs that appeared when you hovered your own name — that is the
          one you asked to remove, and the name is no longer a hover target. */}
      {!isMobile && (
        <div className="section-decor" ref={sectionRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
          <ImageCluster layouts={HERO_LAYOUTS} activeGroup={hoveredBuild} groupRef={groupRef} />
        </div>
      )}

      <div className="home__inner">
      <div className="section-content">
        {/* The site's single <h1>. Both lines sit inside it so the page has one
            heading carrying the name — the home route previously had no heading
            of any level at all. */}
        <h1
          className="hero__title"
          data-attend={attend ? 'true' : 'false'}
          onMouseEnter={() => setAttend(true)}
          onMouseLeave={() => setAttend(false)}
        >
          {/* Always on screen, one photograph, set in the line that introduces
              him. Sized in px rather than em so the chip drives the line's
              height instead of inheriting it — at 2.1em it came out 35x47 and
              read as a smudge, because the subject is about a seventh of a
              960x1280 frame. At 68px, cropped onto the subject, the same source
              is legible. */}
          <span className="hero__greeting" style={ls(0)}>
            <span className="hero__portrait">
              <img
                src={PORTRAIT.src}
                alt="Puneet Kathuria"
                width={PORTRAIT.w}
                height={PORTRAIT.h}
                /* Zoom onto the subject. See PORTRAIT in portfolio.ts: the
                   source and the chip are both 3:4, so `object-position` is
                   inert and a transform is the only thing that can crop. */
                style={{
                  transformOrigin: PORTRAIT.focus,
                  transform: `scale(${PORTRAIT.zoom})`,
                }}
                draggable={false}
              />
            </span>
            {/* The trailing space is inside the text node on purpose: without
                it the accessible name came out as
                "Hi, I'm Puneet.I design and build products…" */}
            {PERSONAL_INFO.greeting} <span className="hero__name">{PERSONAL_INFO.name}</span>.{' '}
          </span>
          <span className="t-h1" style={ls(1)}>{PERSONAL_INFO.tagline}</span>
        </h1>

        <h2 className="t-eyebrow section-label" style={ls(2)}>
          <span aria-hidden="true" className="section-label__slash" style={serifItalic}>//</span>
          What I&rsquo;m building
        </h2>

        <ol className="row-list">
          {BUILDING_PROJECTS.map((item, i) => {
            const isHovered = hoveredBuild === i;
            return (
              <li key={item.name} style={ls(i + 3)}>
                <Link
                  to={`/case-study/${item.slug}`}
                  className="row"
                  data-dim={hoveredBuild !== null && !isHovered ? 'true' : 'false'}
                  data-on={isHovered ? 'true' : 'false'}
                  onMouseEnter={() => setHoveredBuild(i)}
                  onMouseLeave={() => setHoveredBuild(null)}
                  onFocus={() => setHoveredBuild(i)}
                  onBlur={() => setHoveredBuild(null)}
                >
                  <span className="row__inner">
                    <span className="t-row row__name">{item.name}</span>
                    <span className="t-desc row__desc">{item.desc}</span>
                  </span>
                </Link>

                {/* The reported bug: this row's media existed in the data and
                    was never rendered, while `.row-media` was `display: none`
                    on desktop anyway — so hovering "Voca Form" did nothing at
                    all. Now the same always-visible treatment the projects
                    rows use. */}
                {/* Mobile only; the cluster covers desktop. */}
                {item.media && <RowMedia media={item.media} active={isHovered} />}
              </li>
            );
          })}
        </ol>

        <div className="hero__cta" style={ls(5)}>
          <button type="button" onClick={() => navigate(1)} className="cta-link">
            Show more projects <span aria-hidden="true" className="cta-link__arrow">&rarr;</span>
          </button>
          {/* Promoted out of the 11px footer row: it is the most
              recruiter-relevant link on the site and was the fifth item in a
              wrapping line of tiny text. */}
          {resume && (
            <a href={resume.href} target="_blank" rel="noopener noreferrer" className="cta-link cta-link--ghost">
              Resume <span aria-hidden="true" className="cta-link__arrow">&#8599;</span>
            </a>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
