import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useIsMobile } from './hooks/useIsMobile';
import { NoiseOverlay } from './components/NoiseOverlay';
import { CustomCursor } from './components/CustomCursor';
import { ChromeFooter } from './components/ChromeFooter';
import { SectionNav } from './components/SectionNav';
import { CaseStudyRoute } from './pages/CaseStudyRoute';
import { NotFound } from './pages/NotFound';
import { Hero } from './sections/Hero';
import { Projects } from './sections/Projects';
import { AndWhat } from './sections/AndWhat';
import { HERO_LAYOUTS, PROJECT_LAYOUTS, PORTRAIT, CATEGORIES, SECTIONS } from '../data/portfolio';
import { useActiveSection, useHashLanding, useHashSync } from './hooks/useActiveSection';
import { applyTheme, currentTheme } from './theme';

function Home({ isMobile }: { isMobile: boolean }) {
  const { active, observing, setRef, goTo } = useActiveSection(SECTIONS.length);

  useHashLanding(true);
  useHashSync(SECTIONS[active]?.id, true);

  useEffect(() => {
    document.title = 'Puneet Kathuria | Product Designer & Engineer';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Portfolio of Puneet Kathuria, a product-minded Full-Stack Engineer and AI undergrad. Designing and building high-performance macOS apps, voice interfaces, and fintech solutions.'
      );
    }
  }, []);

  // Preload only what the ADJACENT section needs, and never on a metered or
  // touch connection. The previous implementation eagerly `new Image()`d all 21
  // assets on mount — including on phones, where none of them render.
  useEffect(() => {
    if (isMobile) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return;

    const perSection: string[][] = [
      [PORTRAIT.src, ...HERO_LAYOUTS.flat().map(i => i.src)],
      PROJECT_LAYOUTS.flat().map(i => i.src),
      CATEGORIES.flatMap(c => c.cards).map(c => c.src),
    ];
    const wanted = new Set([...(perSection[active] ?? []), ...(perSection[active + 1] ?? [])]);
    wanted.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [active, isMobile]);

  const sections = [
    (isActive: boolean) => <Hero isMobile={isMobile} isActive={isActive} navigate={goTo} />,
    (isActive: boolean) => <Projects isMobile={isMobile} isActive={isActive} />,
    (isActive: boolean) => <AndWhat isActive={isActive} />,
  ];

  return (
    <div className={observing ? 'home home--observing' : 'home'}>
      <div className="home__boot">
        <main id="home">
          {SECTIONS.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              ref={setRef(i)}
              className="home__section"
              data-active={i === active ? 'true' : 'false'}
              aria-label={section.name}
              tabIndex={-1}
            >
              {sections[i](i === active)}
            </section>
          ))}
        </main>
      </div>

      <SectionNav active={active} onNavigate={goTo} />
    </div>
  );
}

export default function App() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isHome = location.pathname === '/';

  // The pre-paint script in index.html already resolved the theme onto <html>.
  // This only mirrors it onto <body> for the legacy override block below.
  useEffect(() => {
    applyTheme(currentTheme());
  }, []);

  return (
    <>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home isMobile={isMobile} />} />
        <Route path="/case-study/:slug" element={<CaseStudyRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <NoiseOverlay />
      {!isMobile && <CustomCursor />}
      <ChromeFooter showLinks={isHome} />
    </>
  );
}

