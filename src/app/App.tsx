import React, { useState, useEffect, useRef, useCallback } from 'react';

const TOTAL = 3;
const DURATION = 650;
const EASE_PAGE = 'cubic-bezier(0.76, 0, 0.24, 1)';
const EASE_TEXT = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

const geist: React.CSSProperties   = { fontFamily: "'Geist', sans-serif" };
const figtree: React.CSSProperties = { fontFamily: "'Figtree', sans-serif" };
const CONTENT_LEFT = 'min(142px, 9.4vw)';

const T = {
  label: { fontSize: 'clamp(12px, 1.05vw, 14px)' } as React.CSSProperties,
  name:  { fontSize: 'clamp(15px, 1.3vw, 18px)'  } as React.CSSProperties,
  desc:  { fontSize: 'clamp(13px, 1.15vw, 16px)' } as React.CSSProperties,
  hero:  { fontSize: 'clamp(16px, 1.4vw, 20px)'  } as React.CSSProperties,
} as const;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function ls(i: number): React.CSSProperties {
  return { opacity: 0, animation: `lineUp 420ms ${EASE_TEXT} ${80 + i * 55}ms forwards` };
}

// ─── Mobile detection ──────────────────────────────────────────────────────

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return mobile;
}

// ─── Image layout types ────────────────────────────────────────────────────

interface ImgDef { src: string; x: number; y: number; w: number; h: number; r: number; delay: number; }

const PROJECT_LAYOUTS: ImgDef[][] = [
  [
    { src: 'https://images.unsplash.com/photo-1764050359179-517599dab87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', x: 55,  y: -155, w: 360, h: 240, r: -1.5, delay: 0   },
    { src: 'https://images.unsplash.com/photo-1759694542153-ad02551b15b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 335, y:  -35, w: 195, h: 265, r:  2.0, delay: 80  },
    { src: 'https://images.unsplash.com/photo-1642692704130-2f50860c15ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 72,  y:  118, w: 208, h: 162, r: -0.5, delay: 160 },
  ],
  [
    { src: 'https://images.unsplash.com/photo-1753998943619-b9cd910887e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', x: 28,  y: -128, w: 348, h: 238, r:  1.0, delay: 0   },
    { src: 'https://images.unsplash.com/photo-1588686031323-ec683d066691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 352, y:    8, w: 182, h: 252, r: -2.0, delay: 80  },
    { src: 'https://images.unsplash.com/photo-1749006590475-4592a5dbf99f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 38,  y:  138, w: 228, h: 172, r:  1.5, delay: 160 },
  ],
  [
    { src: 'https://images.unsplash.com/photo-1728467459756-211f3c738697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', x: 92,  y: -178, w: 312, h: 288, r: -2.0, delay: 0   },
    { src: 'https://images.unsplash.com/photo-1770581939371-326fc1537f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 362, y:   28, w: 232, h: 172, r:  1.0, delay: 80  },
    { src: 'https://images.unsplash.com/photo-1742440710402-721332ea7898?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 42,  y:  148, w: 178, h: 178, r:  2.5, delay: 160 },
  ],
  [
    { src: 'https://images.unsplash.com/photo-1557734864-c78b6dfef1b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', x: 38,  y: -152, w: 338, h: 258, r:  1.5, delay: 0   },
    { src: 'https://images.unsplash.com/photo-1574962325789-fbe9cbcfacf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 358, y:   22, w: 252, h: 175, r: -1.0, delay: 80  },
    { src: 'https://images.unsplash.com/photo-1710596220294-3f88dfe02fd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 48,  y:  128, w: 188, h: 248, r: -2.0, delay: 160 },
  ],
];

const HERO_LAYOUTS: ImgDef[][] = [
  [
    { src: 'https://images.unsplash.com/photo-1755157161839-0b0fbd5fef74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', x: 70,  y: -195, w: 248, h: 338, r: -1.5, delay: 0   },
    { src: 'https://images.unsplash.com/photo-1771873437314-9dbadc707dcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', x: 298, y:  -55, w: 215, h: 285, r:  2.0, delay: 80  },
    { src: 'https://images.unsplash.com/photo-1752952952773-80378cefc23d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', x: 108, y:  165, w: 215, h: 198, r: -2.0, delay: 160 },
  ],
  [
    { src: 'https://images.unsplash.com/photo-1662974770404-468fd9660389?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', x: 55,  y: -148, w: 352, h: 235, r: -1.0, delay: 0   },
    { src: 'https://images.unsplash.com/photo-1561446289-4112a4f79116?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 342, y:  -22, w: 188, h: 258, r:  2.0, delay: 80  },
    { src: 'https://images.unsplash.com/photo-1749006590475-4592a5dbf99f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 65,  y:  118, w: 218, h: 168, r: -0.5, delay: 160 },
  ],
  [
    { src: 'https://images.unsplash.com/photo-1774487671620-b9174d206849?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', x: 45,  y: -162, w: 368, h: 248, r:  1.0, delay: 0   },
    { src: 'https://images.unsplash.com/photo-1771216596227-f17c69f33912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 360, y:    5, w: 202, h: 268, r: -2.0, delay: 80  },
    { src: 'https://images.unsplash.com/photo-1762921006421-8b6ae0c17e44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', x: 78,  y:  108, w: 228, h: 172, r:  1.5, delay: 160 },
  ],
];

// ─── Noise Overlay ─────────────────────────────────────────────────────────

function NoiseOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(256, 256);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    if (ref.current) ref.current.style.backgroundImage = `url(${canvas.toDataURL()})`;
  }, []);
  return <div ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 500, pointerEvents: 'none', opacity: 0.04, backgroundRepeat: 'repeat' }} />;
}

// ─── Custom Cursor ─────────────────────────────────────────────────────────
// Modes:
//   default  — 8px white circle, follows mouse exactly
//   ring     — 22px hollow ring, for general buttons/links
//   greeting — "hello." pill, for the name zone
//   magnetic — 5px circle, lerps to data-magnetic element center (nav dots + socials)

function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -200, y: -200 });
  const curPos   = useRef({ x: -200, y: -200 });
  const magnetEl = useRef<HTMLElement | null>(null);
  const modeRef  = useRef<'default' | 'ring' | 'greeting' | 'magnetic'>('default');

  useEffect(() => {
    const dot   = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label) return;

    const appear = (m: typeof modeRef.current) => {
      if (m === 'greeting') {
        dot.style.opacity = '0';
        label.style.opacity = '1';
        label.style.transform = 'translate(-50%, -50%) scale(1)';
        return;
      }
      label.style.opacity = '0';
      label.style.transform = 'translate(-50%, -50%) scale(0.85)';
      dot.style.opacity = '1';
      switch (m) {
        case 'default':
          dot.style.width  = '8px';  dot.style.height = '8px';
          dot.style.borderRadius = '50%';
          dot.style.backgroundColor = 'white';
          dot.style.border = 'none';
          break;
        case 'ring':
          dot.style.width  = '22px'; dot.style.height = '22px';
          dot.style.borderRadius = '50%';
          dot.style.backgroundColor = 'transparent';
          dot.style.border = '1px solid rgba(255,255,255,0.75)';
          break;
        case 'magnetic':
          // Shrinks to match nav dot / merge with social link target
          dot.style.width  = '5px';  dot.style.height = '5px';
          dot.style.borderRadius = '50%';
          dot.style.backgroundColor = 'white';
          dot.style.border = 'none';
          break;
      }
    };

    let rafId: number;
    const tick = () => {
      if (modeRef.current === 'magnetic' && magnetEl.current) {
        const r  = magnetEl.current.getBoundingClientRect();
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;
        curPos.current.x = lerp(curPos.current.x, cx, 0.14);
        curPos.current.y = lerp(curPos.current.y, cy, 0.14);
      } else {
        curPos.current.x = mousePos.current.x;
        curPos.current.y = mousePos.current.y;
      }
      dot.style.left   = `${curPos.current.x}px`;
      dot.style.top    = `${curPos.current.y}px`;
      label.style.left = `${curPos.current.x}px`;
      label.style.top  = `${curPos.current.y}px`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => { mousePos.current = { x: e.clientX, y: e.clientY }; };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const mag = t.closest('[data-magnetic]') as HTMLElement | null;
      if (t.closest('[data-cursor="greeting"]')) {
        modeRef.current = 'greeting'; magnetEl.current = null; appear('greeting');
      } else if (mag) {
        modeRef.current = 'magnetic'; magnetEl.current = mag; appear('magnetic');
      } else if (t.closest('a, button')) {
        modeRef.current = 'ring'; magnetEl.current = null; appear('ring');
      } else {
        modeRef.current = 'default'; magnetEl.current = null; appear('default');
      }
    };

    const onOut = (e: MouseEvent) => {
      const to = e.relatedTarget as HTMLElement | null;
      const leaving = !to || (
        !to.closest('[data-cursor="greeting"]') &&
        !to.closest('[data-magnetic]') &&
        !to.closest('a, button')
      );
      if (leaving) {
        modeRef.current = 'default'; magnetEl.current = null;
        curPos.current = { ...mousePos.current };
        appear('default');
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout',  onOut);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout',  onOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 99999,
        width: '8px', height: '8px', borderRadius: '50%',
        backgroundColor: 'white', border: 'none',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none',
        transition: 'width 140ms ease, height 140ms ease, background-color 140ms ease, border 140ms ease, opacity 140ms ease, border-radius 140ms ease',
      }} />
      <div ref={labelRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 99999,
        transform: 'translate(-50%, -50%) scale(0.85)',
        pointerEvents: 'none', opacity: 0,
        transition: 'opacity 180ms ease, transform 180ms ease',
        backgroundColor: 'white', color: '#141414',
        padding: '7px 13px', borderRadius: '4px',
        ...geist, fontSize: '12px', fontWeight: 500,
        letterSpacing: '0.04em', whiteSpace: 'nowrap', userSelect: 'none',
      }}>
        hello.
      </div>
    </>
  );
}

// ─── Social Links ─────────────────────────────────────────────────────────
// data-magnetic on each link: cursor snaps to center of hovered word.
// White + underline on hover gives clear semantic affordance for text links.

function SocialLinks() {
  const links = [
    { id: 'mail',      label: 'mail',      href: 'mailto:hi@puneet.xyz' },
    { id: 'linkedin',  label: 'linkedin',  href: 'https://linkedin.com/in/puneet' },
    { id: 'instagram', label: 'instagram', href: 'https://instagram.com/puneet' },
  ];
  return (
    <div style={{
      position: 'fixed', bottom: '36px', left: CONTENT_LEFT,
      zIndex: 1000, display: 'flex', alignItems: 'center', gap: '20px',
    }}>
      {links.map(link => (
        <a
          key={link.id}
          href={link.href}
          data-magnetic="true"
          target={link.id !== 'mail' ? '_blank' : undefined}
          rel="noopener noreferrer"
          style={{
            ...geist, fontSize: '11px', letterSpacing: '0.07em',
            textDecoration: 'none', color: 'rgba(255,255,255,0.22)',
            transition: 'color 200ms ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.textDecoration = 'underline';
            e.currentTarget.style.textUnderlineOffset = '4px';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.22)';
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

// ─── Progress Indicator — desktop, vertical right ─────────────────────────
// Button wraps the dot ONLY — getBoundingClientRect() centers on the dot.
// Label is a flex sibling with pointerEvents:none so it doesn't steal events.

const SECTION_LABELS = ['intro', 'projects', 'and ?'];

function ProgressIndicator({ active, navigate }: { active: number; navigate: (n: number) => void }) {
  const [hov, setHov] = useState<number | null>(null);
  return (
    <div style={{
      position: 'fixed', right: '36px', top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1000,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px',
    }}>
      {SECTION_LABELS.map((label, i) => {
        const isActive = i === active;
        const isHov    = i === hov;
        return (
          <div
            key={i}
            style={{ display: 'flex', alignItems: 'center', gap: '9px' }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
          >
            <span style={{
              ...geist, fontSize: '11px', letterSpacing: '0.06em', whiteSpace: 'nowrap',
              color: 'rgba(255,255,255,0.65)', pointerEvents: 'none',
              opacity: isHov ? 1 : 0,
              transform: isHov ? 'translateX(0)' : 'translateX(6px)',
              transition: 'opacity 160ms ease, transform 160ms ease',
            }}>
              {label}
            </span>
            <button
              data-magnetic="true"
              onClick={() => navigate(i)}
              style={{
                background: 'none', border: 'none', padding: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                lineHeight: 0,
              }}
            >
              <div style={{
                width:        isActive ? '5px' : isHov ? '5px' : '3px',
                height:       isActive ? '5px' : isHov ? '5px' : '3px',
                borderRadius: '50%', flexShrink: 0,
                background:   isActive ? 'white' : isHov ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.20)',
                transition: 'width 220ms ease, height 220ms ease, background 220ms ease',
                pointerEvents: 'none',
              }} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Mobile Indicator — horizontal pill dots, top-center ──────────────────
// Active dot expands into a pill (18×4px). No labels — hover is unavailable
// on touch. Each button has a generous 10px hit target padding.

function MobileIndicator({ active, navigate }: { active: number; navigate: (n: number) => void }) {
  return (
    <div style={{
      position: 'fixed', top: '22px', left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      display: 'flex', alignItems: 'center', gap: '4px',
    }}>
      {SECTION_LABELS.map((_, i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            onClick={() => navigate(i)}
            style={{
              background: 'none', border: 'none',
              padding: '10px 8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 0,
            }}
          >
            <div style={{
              width:        isActive ? '18px' : '4px',
              height:       '4px',
              borderRadius: isActive ? '2px' : '50%',
              background:   isActive ? 'white' : 'rgba(255,255,255,0.28)',
              transition:   'width 280ms cubic-bezier(0.76, 0, 0.24, 1), background 220ms ease, border-radius 280ms ease',
            }} />
          </button>
        );
      })}
    </div>
  );
}

// ─── Image cluster renderer ────────────────────────────────────────────────

function ImageCluster({ layouts, activeGroup, groupRef }: {
  layouts: ImgDef[][];
  activeGroup: number | null;
  groupRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={groupRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      {layouts.map((layout, groupIdx) =>
        layout.map((img, imgIdx) => {
          const isVisible = activeGroup === groupIdx;
          const d   = isVisible ? img.delay : 0;
          const dur = isVisible ? 380 : 220;
          return (
            <div key={`${groupIdx}-${imgIdx}`} style={{ position: 'absolute', left: `calc(50% + ${img.x}px)`, top: `calc(50% + ${img.y}px)`, width: img.w, height: img.h, transform: `rotate(${img.r}deg)`, transformOrigin: 'center center' }}>
              <img src={img.src} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', userSelect: 'none', opacity: isVisible ? 1 : 0, transform: `translateY(${isVisible ? 0 : 18}px)`, transition: `opacity ${dur}ms ${EASE_TEXT} ${d}ms, transform ${dur}ms ${EASE_TEXT} ${d}ms` }} />
            </div>
          );
        })
      )}
    </div>
  );
}

// ─── Parallax hook ─────────────────────────────────────────────────────────

function useParallax(disabled = false) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const groupRef   = useRef<HTMLDivElement>(null);
  const targetPos  = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafId      = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      if (!disabled) {
        currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.07);
        currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.07);
        if (groupRef.current)
          groupRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px)`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [disabled]);

  const onMouseMove = disabled ? undefined : (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    targetPos.current = {
      x: ((e.clientX - r.left  - r.width  / 2) / (r.width  / 2)) * 14,
      y: ((e.clientY - r.top   - r.height / 2) / (r.height / 2)) * 9,
    };
  };
  const onMouseLeave = disabled ? undefined : () => { targetPos.current = { x: 0, y: 0 }; };

  return { sectionRef, groupRef, onMouseMove, onMouseLeave };
}

// ─── Section 0 — Hero ─────────────────────────────────────────────────────

function Hero({ ek, isMobile }: { ek: number; isMobile: boolean }) {
  const [greetingHover, setGreetingHover] = useState(false);
  const [hoveredBuild,  setHoveredBuild]  = useState<number | null>(null);
  const { sectionRef, groupRef, onMouseMove, onMouseLeave } = useParallax(isMobile);

  const activeGroup = greetingHover ? 0 : hoveredBuild !== null ? hoveredBuild + 1 : null;

  return (
    <div ref={sectionRef} style={{ width: '100%', height: '100%', position: 'relative' }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
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
          <p style={{ fontWeight: 600, ...T.name, color: '#666', lineHeight: isMobile ? 1.5 : 1.8, margin: 0, ...ls(0) }}>
            Hi, I'm Puneet.
          </p>
          <p style={{ fontWeight: 600, ...T.hero, color: 'white', lineHeight: isMobile ? 1.5 : 1.8, margin: 0, ...ls(1) }}>
            I design and build products that people actually use.
          </p>
        </div>

        <div style={{ height: isMobile ? '12px' : 'clamp(14px, 2vw, 28px)' }} />

        <p style={{ fontWeight: 400, ...T.label, color: '#555', lineHeight: 'normal', margin: isMobile ? '0 0 8px' : '0 0 12px', ...ls(2) }}>
          <span style={{ color: '#3a3a3a' }}>//</span>
          <span style={{ color: '#666' }}>&nbsp;What I'm building</span>
        </p>

        {[
          { name: 'Voca Form', desc: 'Conversational AI that turns forms into stories' },
          { name: 'Camber',    desc: "F1-themed task manager that lives in your Mac's notch" },
        ].map((item, i) => (
          <div
            key={item.name}
            onMouseEnter={() => setHoveredBuild(i)}
            onMouseLeave={() => setHoveredBuild(null)}
            style={{ opacity: hoveredBuild !== null && hoveredBuild !== i ? 0.12 : 1, transition: 'opacity 280ms ease', margin: i === 0 ? '0 0 2px' : 0 }}
          >
            <div style={{ lineHeight: isMobile ? 1.65 : 2, ...ls(i + 3) }}>
              <span style={{ fontWeight: 600, ...T.name }}>{item.name}</span>
              <span style={{ fontWeight: 400, ...T.desc, color: '#666' }}>&nbsp;{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section 1 — Projects ─────────────────────────────────────────────────

const PROJECTS = [
  { name: 'Sportsolio',    desc: 'Trade emerging players like stocks' },
  { name: 'GitRepo',       desc: 'Find open source repos by chatting with AI' },
  { name: 'Visual Vortex', desc: 'Brand identity — theme, social, web, mailers' },
  { name: 'HiGrow',        desc: 'Marketplace for hosting and joining workshops' },
];

function Projects({ ek, isMobile }: { ek: number; isMobile: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const { sectionRef, groupRef, onMouseMove, onMouseLeave } = useParallax(isMobile);

  return (
    <div ref={sectionRef} style={{ width: '100%', height: '100%', position: 'relative' }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      {!isMobile && <ImageCluster layouts={PROJECT_LAYOUTS} activeGroup={hovered} groupRef={groupRef} />}

      <div key={ek} style={{
        position: 'absolute', left: CONTENT_LEFT,
        top: isMobile ? 'calc(50% - 145px)' : 'calc(50% - 204px)',
        maxWidth: isMobile ? 'calc(100vw - 80px)' : undefined,
        ...figtree, color: 'white', zIndex: 2,
      }}>
        <p style={{ fontWeight: 400, ...T.label, color: '#666', lineHeight: 'normal', margin: isMobile ? '0 0 10px' : '0 0 14px', ...ls(0) }}>
          <span style={{ color: '#3a3a3a' }}>//</span>
          <span style={{ color: '#666' }}>&nbsp;Selected Projects</span>
        </p>
        {PROJECTS.map((p, i) => (
          <div key={p.name} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
            style={{ opacity: hovered !== null && hovered !== i ? 0.12 : 1, transition: 'opacity 280ms ease' }}>
            <div style={{ lineHeight: isMobile ? 1.65 : 2, ...ls(i + 1) }}>
              <span style={{ fontWeight: 600, ...T.name }}>{p.name}</span>
              <span style={{ fontWeight: 400, ...T.desc, color: '#666' }}>&nbsp;{p.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section 2 — And ? ────────────────────────────────────────────────────
// Polaroid spec: 154×206px card, 130×130px photo, 12px frame, 6px gap, 46px caption band.

interface PolaroidDef {
  src:      string;
  caption:  string;
  subtitle: string;
  x: number; y: number; r: number; delay: number;
}

interface CategoryDef { name: string; cards: PolaroidDef[]; }

const CATEGORIES: CategoryDef[] = [
  {
    name: "I've won things",
    cards: [
      { src: 'https://images.unsplash.com/photo-1756273421509-054de38d1016?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: 'Cognizance — 2025', subtitle: 'Prod-G winner',          x: 28,  y: 88,  r: -5, delay: 0   },
      { src: 'https://images.unsplash.com/photo-1772971919868-6aaaa5c5afb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: 'DCode — 2025',      subtitle: 'Best UI/UX award',    x: 218, y: 236, r:  3, delay: 65  },
      { src: 'https://images.unsplash.com/photo-1624201986343-2766c0ebe7df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: 'DesignX — 2026',    subtitle: 'Designathon finalist', x: 78,  y: 384, r: -2, delay: 130 },
    ],
  },
  {
    name: "I've built rooms full of people",
    cards: [
      { src: 'https://images.unsplash.com/photo-1763962274119-1a0a0d418520?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: 'Visual Vortex',  subtitle: '2000+ attendees',    x: 36,  y: 74,  r:  4, delay: 0   },
      { src: 'https://images.unsplash.com/photo-1557734864-c78b6dfef1b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: 'UI/UX Workshop', subtitle: 'taught design',         x: 228, y: 220, r: -6, delay: 65  },
      { src: 'https://images.unsplash.com/photo-1539017367106-9b247d897964?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: "Neutron '25",    subtitle: 'North India',          x: 64,  y: 366, r:  2, delay: 130 },
    ],
  },
  {
    name: 'and everything else',
    cards: [
      { src: 'https://images.unsplash.com/photo-1742144897663-6c8c6faaf1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: '12M views',  subtitle: 'most viewed Figma vid', x: 32,  y: 96,  r: -3, delay: 0   },
      { src: 'https://images.unsplash.com/photo-1776239979769-ab5672b094f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: '14 cities',  subtitle: 'I collect airports',    x: 228, y: 246, r:  5, delay: 65  },
      { src: 'https://images.unsplash.com/photo-1768370771259-db3fa0d34be5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500', caption: 'Tifosi.',    subtitle: 'F1 & snooker',          x: 54,  y: 394, r: -4, delay: 130 },
    ],
  },
];

function Polaroid({ card, isVisible, cancelLeave, scheduleLeave }: {
  card: PolaroidDef;
  isVisible: boolean;
  cancelLeave: () => void;
  scheduleLeave: () => void;
}) {
  const dur   = isVisible ? 260 : 150;
  const delay = isVisible ? card.delay : 0;

  return (
    <div
      onMouseEnter={cancelLeave}
      onMouseLeave={scheduleLeave}
      style={{
        width: 154,
        background: '#f0ebe3',
        boxShadow: [
          '0 1px 2px rgba(0,0,0,0.28)',
          '0 4px 10px rgba(0,0,0,0.20)',
          '0 14px 32px rgba(0,0,0,0.22)',
          '0 28px 56px rgba(0,0,0,0.28)',
        ].join(', '),
        outline: '1px solid rgba(0,0,0,0.07)',
        opacity: isVisible ? 1 : 0,
        transform: `scale(${isVisible ? 1 : 0.88}) translateY(${isVisible ? 0 : 10}px)`,
        transition: `opacity ${dur}ms ${EASE_TEXT} ${delay}ms, transform ${dur}ms ${EASE_TEXT} ${delay}ms`,
      }}
    >
      <div style={{ padding: '12px 12px 6px 12px', lineHeight: 0, position: 'relative' }}>
        <img
          src={card.src}
          alt={card.caption}
          draggable={false}
          style={{
            width: 130, height: 130,
            objectFit: 'cover', display: 'block', userSelect: 'none',
            filter: 'contrast(1.05) saturate(0.82) sepia(0.07)',
          }}
        />
        <div style={{
          position: 'absolute', inset: '12px 12px 6px 12px',
          boxShadow: 'inset 0 0 14px rgba(0,0,0,0.18)', pointerEvents: 'none',
        }} />
      </div>
      <div style={{
        height: 46,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 4, overflow: 'hidden',
      }}>
        <div style={{ ...geist, fontSize: '11px', fontWeight: 500, color: '#2a2018', letterSpacing: '0.07em', lineHeight: 1, whiteSpace: 'nowrap' }}>
          {card.caption}
        </div>
        <div style={{ ...geist, fontSize: '9.5px', fontWeight: 400, color: '#8a7d74', letterSpacing: '0.05em', lineHeight: 1, whiteSpace: 'nowrap' }}>
          {card.subtitle}
        </div>
      </div>
    </div>
  );
}

function AndWhat({ ek, isMobile }: { ek: number; isMobile: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelLeave = useCallback(() => {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
  }, []);
  const scheduleLeave = useCallback(() => {
    cancelLeave();
    leaveTimer.current = setTimeout(() => setActive(null), 300);
  }, [cancelLeave]);
  const activateRow = useCallback((i: number) => { cancelLeave(); setActive(i); }, [cancelLeave]);

  useEffect(() => () => { if (leaveTimer.current) clearTimeout(leaveTimer.current); }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>

      {!isMobile && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
          {CATEGORIES.map((cat, catIdx) =>
            cat.cards.map((card, cardIdx) => {
              const isVisible = active === catIdx;
              return (
                <div
                  key={`${catIdx}-${cardIdx}`}
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${card.x}px)`,
                    top: card.y,
                    transform: `rotate(${card.r}deg)`,
                    transformOrigin: 'center center',
                    pointerEvents: isVisible ? 'auto' : 'none',
                  }}
                >
                  <Polaroid card={card} isVisible={isVisible} cancelLeave={cancelLeave} scheduleLeave={scheduleLeave} />
                </div>
              );
            })
          )}
        </div>
      )}

      <div
        key={ek}
        style={{
          position: 'absolute', left: CONTENT_LEFT,
          top: isMobile ? 'calc(50% - 145px)' : 'calc(50% - 204px)',
          maxWidth: isMobile ? 'calc(100vw - 80px)' : undefined,
          ...figtree, color: 'white', zIndex: 3,
        }}
      >
        <p style={{ fontWeight: 400, ...T.label, color: '#666', lineHeight: 'normal', margin: isMobile ? '0 0 10px' : '0 0 14px', ...ls(0) }}>
          <span style={{ color: '#3a3a3a' }}>//</span>
          <span style={{ color: '#666' }}>&nbsp;Beyond the screen</span>
        </p>

        {CATEGORIES.map((cat, i) => (
          <div
            key={cat.name}
            onMouseEnter={() => activateRow(i)}
            onMouseLeave={scheduleLeave}
            style={{
              lineHeight: isMobile ? 1.65 : 2,
              opacity: active !== null && active !== i ? 0.28 : 1,
              transition: 'opacity 250ms ease',
              ...ls(i + 1),
            }}
          >
            <span style={{ color: '#555', fontWeight: 400, ...T.name }}>&amp;&nbsp;</span>
            <span style={{ fontWeight: 600, ...T.name, color: active === i ? '#ffffff' : '#cccccc', transition: 'color 200ms ease' }}>
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────

export default function App() {
  const isMobile = useIsMobile();

  const [current,   setCurrent]   = useState(0);
  const [target,    setTarget]    = useState<number | null>(null);
  const [isTrans,   setIsTrans]   = useState(false);
  const [dir,       setDir]       = useState<'down' | 'up'>('down');
  const [entryKeys, setEntryKeys] = useState([1, 0, 0]);

  const transiting = useRef(false);
  const navLock    = useRef(0);
  const wheelAccum = useRef(0);
  const lastWheelT = useRef(0);
  const touchY     = useRef(0);
  const touchX     = useRef(0);

  const WHEEL_THRESHOLD = 80;
  const activeSection = target !== null ? target : current;

  const navigate = useCallback((to: number) => {
    if (transiting.current || to === current || to < 0 || to >= TOTAL) return;
    navLock.current    = Date.now();
    wheelAccum.current = 0;
    const d: 'down' | 'up' = to > current ? 'down' : 'up';
    setDir(d); setTarget(to); setIsTrans(true);
    transiting.current = true;
    setEntryKeys(prev => { const n = [...prev]; n[to]++; return n; });
    setTimeout(() => { setCurrent(to); setTarget(null); setIsTrans(false); transiting.current = false; }, DURATION);
  }, [current]);

  // Desktop wheel scroll
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - navLock.current < DURATION + 150) { wheelAccum.current = 0; return; }
      if (now - lastWheelT.current > 250) wheelAccum.current = 0;
      lastWheelT.current = now;
      wheelAccum.current += e.deltaY;
      if (Math.abs(wheelAccum.current) >= WHEEL_THRESHOLD) {
        const direction = wheelAccum.current > 0 ? 1 : -1;
        wheelAccum.current = 0;
        navigate(current + direction);
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [current, navigate]);

  // Touch scroll — touchmove with passive:false intercepts vertical swipes
  // BEFORE the browser can scroll, which was the bug causing the "whole screen moves" issue.
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchY.current = e.touches[0].clientY;
      touchX.current = e.touches[0].clientX;
    };
    const onMove = (e: TouchEvent) => {
      // If this is a vertical swipe, cancel browser scroll immediately.
      // passive: false on the listener is required for preventDefault() to work.
      const dy = Math.abs(e.touches[0].clientY - touchY.current);
      const dx = Math.abs(e.touches[0].clientX - touchX.current);
      if (dy > dx && dy > 8) e.preventDefault();
    };
    const onEnd = (e: TouchEvent) => {
      const delta = touchY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 40) { if (delta > 0) navigate(current + 1); else navigate(current - 1); }
    };
    window.addEventListener('touchstart', onStart, { passive: true  });
    window.addEventListener('touchmove',  onMove,  { passive: false }); // non-passive — needs preventDefault
    window.addEventListener('touchend',   onEnd,   { passive: true  });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove',  onMove);
      window.removeEventListener('touchend',   onEnd);
    };
  }, [current, navigate]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') navigate(current + 1);
      if (e.key === 'ArrowUp'   || e.key === 'PageUp')   navigate(current - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, navigate]);

  const getStyle = (i: number): React.CSSProperties => {
    const isCurrent = i === current, isTarget = i === target;
    const maxActive = target !== null ? Math.max(current, target) : current;
    if (isCurrent && isTrans) return { position: 'absolute', inset: 0, transform: dir === 'down' ? 'translateY(-6%)' : 'translateY(6%)', opacity: 0, transition: `transform ${DURATION}ms ${EASE_PAGE}, opacity ${DURATION}ms ${EASE_PAGE}`, zIndex: 1, pointerEvents: 'none' };
    if (isCurrent)             return { position: 'absolute', inset: 0, transform: 'translateY(0)', opacity: 1, zIndex: 2 };
    if (isTarget && isTrans)   return { position: 'absolute', inset: 0, transform: 'translateY(0)', opacity: 1, transition: `transform ${DURATION}ms ${EASE_PAGE}, opacity ${DURATION}ms ${EASE_PAGE}`, zIndex: 1, pointerEvents: 'none' };
    if (i > maxActive)         return { position: 'absolute', inset: 0, transform: 'translateY(100%)', opacity: 1, zIndex: 0, pointerEvents: 'none' };
    return                            { position: 'absolute', inset: 0, transform: 'translateY(-100%)', opacity: 1, zIndex: 0, pointerEvents: 'none' };
  };

  const sections = [
    <Hero     ek={entryKeys[0]} isMobile={isMobile} />,
    <Projects ek={entryKeys[1]} isMobile={isMobile} />,
    <AndWhat  ek={entryKeys[2]} isMobile={isMobile} />,
  ];

  return (
    <>
      <style>{`
        /* Kill document-level scroll completely — our custom scroll handles navigation.
           Without this, mobile browsers would scroll the body in addition to our section transitions. */
        html, body { overflow: hidden; overscroll-behavior: none; height: 100%; }
        /* Cursor: hide native only on hover-capable devices (desktop). Mobile keeps default. */
        @media (hover: hover) {
          *, *::before, *::after { cursor: none !important; }
        }
        @keyframes lineUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @media (max-width: 640px) {
          body { -webkit-text-size-adjust: 100%; }
        }
      `}</style>
      {/* touch-action: none tells the browser we're handling all touch ourselves */}
      <div style={{ position: 'fixed', inset: 0, background: '#141414', overflow: 'hidden', touchAction: 'none' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {sections.map((section, i) => <div key={i} style={getStyle(i)}>{section}</div>)}
        </div>
        {isMobile
          ? <MobileIndicator active={activeSection} navigate={navigate} />
          : <ProgressIndicator active={activeSection} navigate={navigate} />
        }
        <SocialLinks />
      </div>
      <NoiseOverlay />
      {!isMobile && <CustomCursor />}
    </>
  );
}
