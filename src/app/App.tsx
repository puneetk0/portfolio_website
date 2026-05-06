import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { TOTAL, DURATION, EASE_PAGE } from './utils/constants';
import { useIsMobile } from './hooks/useIsMobile';
import { NoiseOverlay } from './components/NoiseOverlay';
import { BackgroundGlow } from './components/BackgroundGlow';
import { CustomCursor } from './components/CustomCursor';
import { SocialLinks } from './components/SocialLinks';
import { ProgressIndicator } from './components/ProgressIndicator';
import { MobileIndicator } from './components/MobileIndicator';
import { Hero } from './sections/Hero';
import { Projects } from './sections/Projects';
import { AndWhat } from './sections/AndWhat';
import { CaseStudy } from './pages/CaseStudy';
import { CamberCaseStudy } from './pages/CamberCaseStudy';
import { VocaCaseStudy } from './pages/VocaCaseStudy';
import { FindMyRepoCaseStudy } from './pages/FindMyRepoCaseStudy';
import { HERO_LAYOUTS, PROJECT_LAYOUTS, CATEGORIES } from '../data/portfolio';

function Home({ isMobile }: { isMobile: boolean }) {
  const [current, setCurrent] = useState(0);
  const [target, setTarget] = useState<number | null>(null);
  const [isTrans, setIsTrans] = useState(false);
  const [dir, setDir] = useState<'down' | 'up'>('down');
  const [entryKeys, setEntryKeys] = useState([1, 0, 0]);

  const transiting = useRef(false);
  const navLock = useRef(0);
  const wheelAccum = useRef(0);
  const lastWheelT = useRef(0);
  const touchY = useRef(0);
  const touchX = useRef(0);

  const WHEEL_THRESHOLD = 120;
  const activeSection = target !== null ? target : current;

  useEffect(() => {
    const imagesToPreload: string[] = [];
    HERO_LAYOUTS.flat().forEach(img => imagesToPreload.push(img.src));
    PROJECT_LAYOUTS.flat().forEach(img => imagesToPreload.push(img.src));
    CATEGORIES.flatMap(cat => cat.cards).forEach(card => imagesToPreload.push(card.src));
    
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const navigate = useCallback((to: number) => {
    if (transiting.current || to === current || to < 0 || to >= TOTAL) return;
    navLock.current = Date.now();
    wheelAccum.current = 0;
    const d: 'down' | 'up' = to > current ? 'down' : 'up';
    setDir(d); setTarget(to); setIsTrans(true);
    transiting.current = true;
    setEntryKeys(prev => { const n = [...prev]; n[to]++; return n; });
    setTimeout(() => { setCurrent(to); setTarget(null); setIsTrans(false); transiting.current = false; }, DURATION);
  }, [current]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - navLock.current < DURATION + 250) { wheelAccum.current = 0; return; }
      if (now - lastWheelT.current > 150) wheelAccum.current = 0;
      lastWheelT.current = now;
      wheelAccum.current += e.deltaY;
      
      if (Math.abs(wheelAccum.current) >= WHEEL_THRESHOLD) {
        const direction = wheelAccum.current > 0 ? 1 : -1;
        wheelAccum.current = 0;
        navLock.current = now;
        navigate(current + direction);
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [current, navigate]);

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchY.current = e.touches[0].clientY;
      touchX.current = e.touches[0].clientX;
    };
    const onMove = (e: TouchEvent) => {
      const dy = Math.abs(e.touches[0].clientY - touchY.current);
      const dx = Math.abs(e.touches[0].clientX - touchX.current);
      if (dy > dx && dy > 8) e.preventDefault();
    };
    const onEnd = (e: TouchEvent) => {
      const delta = touchY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 40) { if (delta > 0) navigate(current + 1); else navigate(current - 1); }
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [current, navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') navigate(current + 1);
      if (e.key === 'ArrowUp' || e.key === 'PageUp') navigate(current - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, navigate]);

  const getStyle = (i: number): React.CSSProperties => {
    const isCurrent = i === current, isTarget = i === target;
    const maxActive = target !== null ? Math.max(current, target) : current;
    if (isCurrent && isTrans) return { position: 'absolute', inset: 0, transform: dir === 'down' ? 'translateY(-6%) scale(0.98)' : 'translateY(6%) scale(0.98)', opacity: 0, filter: 'blur(8px)', transition: `transform ${DURATION}ms ${EASE_PAGE}, opacity ${DURATION}ms ${EASE_PAGE}, filter ${DURATION}ms ${EASE_PAGE}`, zIndex: 1, pointerEvents: 'none' };
    if (isCurrent) return { position: 'absolute', inset: 0, transform: 'translateY(0) scale(1)', opacity: 1, filter: 'blur(0px)', transition: `filter 300ms ease`, zIndex: 2 };
    if (isTarget && isTrans) return { position: 'absolute', inset: 0, transform: 'translateY(0) scale(1)', opacity: 1, filter: 'blur(0px)', transition: `transform ${DURATION}ms ${EASE_PAGE}, opacity ${DURATION}ms ${EASE_PAGE}, filter ${DURATION}ms ${EASE_PAGE}`, zIndex: 1, pointerEvents: 'none' };
    if (i > maxActive) return { position: 'absolute', inset: 0, transform: 'translateY(100%)', opacity: 1, filter: 'blur(8px)', zIndex: 0, pointerEvents: 'none' };
    return { position: 'absolute', inset: 0, transform: 'translateY(-100%)', opacity: 1, filter: 'blur(8px)', zIndex: 0, pointerEvents: 'none' };
  };

  const sections = [
    <Hero ek={entryKeys[0]} isMobile={isMobile} isActive={activeSection === 0} />,
    <Projects ek={entryKeys[1]} isMobile={isMobile} isActive={activeSection === 1} />,
    <AndWhat ek={entryKeys[2]} isMobile={isMobile} isActive={activeSection === 2} />,
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#141414', overflow: 'hidden', touchAction: 'none', animation: 'bootSequence 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {sections.map((section, i) => <div key={i} style={getStyle(i)}>{section}</div>)}
      </div>
      {isMobile
        ? <MobileIndicator active={activeSection} navigate={navigate} />
        : <ProgressIndicator active={activeSection} navigate={navigate} />
      }
      <SocialLinks />
    </div>
  );
}

export default function App() {
  const isMobile = useIsMobile();
  const location = useLocation();

  return (
    <>
      <style>{`
        html, body { 
          overscroll-behavior: none; 
          min-height: 100%; 
          background: #141414; 
          cursor: none !important; 
          margin: 0; padding: 0; 
          /* Hide scrollbar for Chrome, Safari and Opera */
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
        *, *::before, *::after { cursor: none !important; }
        @keyframes lineUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes bootSequence {
          0% { opacity: 0; filter: blur(12px); transform: scale(1.02); }
          100% { opacity: 1; filter: blur(0px); transform: scale(1); }
        }
        @media (max-width: 640px) {
          body { -webkit-text-size-adjust: 100%; }
        }
      `}</style>

      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home isMobile={isMobile} />} />
        <Route path="/case-study/camber" element={<CamberCaseStudy />} />
        <Route path="/case-study/voca" element={<VocaCaseStudy />} />
        <Route path="/case-study/vocaforms" element={<VocaCaseStudy />} />
        <Route path="/case-study/voca-form" element={<VocaCaseStudy />} />
        <Route path="/case-study/find-my-repo" element={<FindMyRepoCaseStudy />} />
        <Route path="/case-study/findmyrepo" element={<FindMyRepoCaseStudy />} />
        <Route path="/case-study/gitrepo" element={<FindMyRepoCaseStudy />} />
        <Route path="/case-study/:slug" element={<CaseStudy />} />
      </Routes>

      <BackgroundGlow />
      <NoiseOverlay />
      {!isMobile && <CustomCursor />}
    </>
  );
}

