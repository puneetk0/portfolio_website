import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { figtree, serifItalic } from '../utils/constants';

// ─── Smooth lerp scroll ───────────────────────────────────────────────────────
function useSmoothScroll() {
    const current = useRef(0);
    const target = useRef(0);
    const raf = useRef<number>(0);
    const EASE = 0.08;

    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            target.current = Math.max(0, Math.min(
                target.current + e.deltaY * 0.9,
                document.body.scrollHeight - window.innerHeight
            ));
        };

        const onTouch = (() => {
            let startY = 0;
            return {
                start: (e: TouchEvent) => { startY = e.touches[0].clientY; },
                move: (e: TouchEvent) => {
                    e.preventDefault();
                    const delta = (startY - e.touches[0].clientY) * 1.5;
                    startY = e.touches[0].clientY;
                    target.current = Math.max(0, Math.min(
                        target.current + delta,
                        document.body.scrollHeight - window.innerHeight
                    ));
                },
            };
        })();

        function loop() {
            const diff = target.current - current.current;
            if (Math.abs(diff) > 0.1) {
                current.current += diff * EASE;
                window.scrollTo(0, current.current);
            }
            raf.current = requestAnimationFrame(loop);
        }

        window.scrollTo(0, 0);
        target.current = 0;
        current.current = 0;
        raf.current = requestAnimationFrame(loop);

        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('touchstart', onTouch.start, { passive: true });
        window.addEventListener('touchmove', onTouch.move, { passive: false });

        return () => {
            cancelAnimationFrame(raf.current);
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('touchstart', onTouch.start);
            window.removeEventListener('touchmove', onTouch.move);
        };
    }, []);

    const scrollTo = useCallback((y: number) => {
        target.current = Math.max(0, Math.min(y - 80, document.body.scrollHeight - window.innerHeight));
    }, []);

    return { scrollTo };
}

// ─── Scroll reveal ────────────────────────────────────────────────────────────
function useReveal(threshold = 0.08) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, visible };
}

function Reveal({ children, delay = 0, y = 28 }: { children: React.ReactNode; delay?: number; y?: number }) {
    const { ref, visible } = useReveal();
    return (
        <div ref={ref} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0px)' : `translateY(${y}px)`,
            transition: `opacity 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        }}>
            {children}
        </div>
    );
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const PAD = 'min(300px, 15vw)';
const BG = 'var(--bg-color)';

const LBL: React.CSSProperties = {
    fontSize: '0.68rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.22em',
    color: 'var(--text-muted)',
    ...figtree,
    margin: 0,
};

function SL({ children }: { children: React.ReactNode }) {
    return (
        <p style={{ ...LBL, margin: '0 0 3rem' }}>
            <span style={{ ...serifItalic, color: 'var(--label-color)', fontSize: '1.3em', marginRight: '6px' }}>//</span>
            {children}
        </p>
    );
}

function HR() {
    return <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }} />;
}

function ActionLink({ href, label }: { href: string; label: string }) {
    return (
        <a
            href={href} target="_blank" rel="noreferrer"
            style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '0.65rem 1.25rem',
                border: '1px solid var(--border-color)', borderRadius: '4px',
                textDecoration: 'none', color: 'var(--link-color)',
                fontSize: '0.75rem', letterSpacing: '0.04em', ...figtree,
                transition: 'all 0.2s ease',
                background: 'rgba(255,255,255,0.015)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'var(--text-color)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.015)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
        >
            {label} ↗
        </a>
    );
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────
const NAV_SECTIONS = ['Problem', 'Thinking', 'Solution', 'Execution', 'Impact', 'Learned'];

function SideNav({
    active,
    onNav,
}: {
    active: number;
    onNav: (i: number) => void;
}) {
    return (
        <div className="cs-sidenav" style={{
            position: 'fixed',
            right: '36px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            zIndex: 50,
            alignItems: 'flex-end',
        }}>
            {NAV_SECTIONS.map((label, i) => {
                const isActive = active === i;
                return (
                    <button
                        key={label}
                        onClick={() => onNav(i)}
                        style={{
                            background: 'transparent', border: 'none',
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            gap: '12px', padding: 0,
                            opacity: isActive ? 1 : 0.6,
                            transition: 'opacity 0.3s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.opacity = '1';
                            const labelEl = e.currentTarget.querySelector('.nav-label') as HTMLElement;
                            if (labelEl) labelEl.style.opacity = '1';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.opacity = isActive ? '1' : '0.3';
                            const labelEl = e.currentTarget.querySelector('.nav-label') as HTMLElement;
                            if (labelEl && !isActive) labelEl.style.opacity = '0.15';
                        }}
                    >
                        <span
                            className="nav-label"
                            style={{
                                ...LBL, fontSize: '0.52rem', letterSpacing: '0.18em',
                                color: isActive ? '#fff' : '#666',
                                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                                whiteSpace: 'nowrap' as const,
                                opacity: isActive ? 1 : 0.5,
                                transform: isActive ? 'translateX(0)' : 'translateX(8px)',
                                pointerEvents: 'none',
                            }}
                        >
                            {label}
                        </span>
                        <span style={{
                            width: isActive ? '24px' : '8px', height: '1px',
                            background: isActive ? '#fff' : '#666',
                            opacity: isActive ? 1 : 0.4,
                            display: 'block',
                            transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)', flexShrink: 0,
                        }} />
                    </button>
                );
            })}
        </div>
    );
}

// ─── Media placeholder ────────────────────────────────────────────────────────
function Media({ filename, aspect = '16/9', hint, objectFit = 'cover', padding, bgColor = '#0a0a0a' }: {
    filename: string; aspect?: string; hint?: string; objectFit?: 'cover' | 'contain' | 'fill';
    padding?: string; bgColor?: string;
}) {
    const isVideo = filename.endsWith('.mp4') || filename.endsWith('.webm');
    const path = `/assets/camber/${filename}`;
    const [loaded, setLoaded] = React.useState(false);

    return (
        <div style={{
            width: '100%',
            aspectRatio: aspect === 'auto' ? 'auto' : aspect,
            background: bgColor,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            padding: padding || '0',
            boxSizing: 'border-box',
        }}>
            {isVideo ? (
                <video
                    src={path}
                    autoPlay muted loop playsInline
                    onLoadedData={() => setLoaded(true)}
                    style={{
                        width: '100%',
                        height: aspect === 'auto' ? 'auto' : '100%',
                        objectFit: objectFit,
                        display: 'block',
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 0.4s ease',
                    }}
                />
            ) : (
                <img
                    src={path}
                    alt={hint || filename}
                    onLoad={() => setLoaded(true)}
                    style={{
                        width: '100%',
                        height: aspect === 'auto' ? 'auto' : '100%',
                        objectFit: objectFit,
                        display: 'block',
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 0.4s ease',
                    }}
                />
            )}

            {!loaded && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    pointerEvents: 'none', zIndex: 0,
                }}>
                    <p style={{ ...LBL, fontSize: '0.55rem', letterSpacing: '0.18em', color: '#222', margin: 0 }}>
                        {filename}
                    </p>
                </div>
            )}
        </div>
    );
}

// ─── Decision card ────────────────────────────────────────────────────────────
function DCard({ index, label, rationale, outcome, chosen }: {
    index: string; label: string; rationale: string; outcome?: string; chosen?: boolean;
}) {
    return (
        <div style={{
            padding: '3.5rem 2.5rem',
            position: 'relative',
            background: 'transparent',
            borderTop: chosen ? '1px solid #333' : '1px solid transparent',
            height: '100%',
            boxSizing: 'border-box' as const,
        }}>
            {chosen && (
                <span style={{ ...LBL, fontSize: '0.5rem', position: 'absolute', top: '3.5rem', right: '2.5rem', color: '#888' }}>
                    CHOSEN
                </span>
            )}
            <p style={{ ...LBL, fontSize: '0.55rem', margin: '0 0 1.25rem', color: chosen ? '#888' : '#666' }}>
                {index}
            </p>
            <p style={{
                ...figtree, fontSize: '1.05rem', fontWeight: 500,
                color: chosen ? '#ffffff' : '#aaa',
                margin: '0 0 1.5rem', lineHeight: 1.3, letterSpacing: '-0.01em'
            }}>
                {label}
            </p>
            <p style={{ ...figtree, fontSize: '0.9rem', color: chosen ? '#aaa' : '#777', lineHeight: 1.8, margin: 0 }}>
                {rationale}
            </p>
            {chosen && outcome && (
                <p style={{
                    ...figtree, fontSize: '0.85rem', color: '#666', lineHeight: 1.75,
                    marginTop: '1.75rem', paddingTop: '1.75rem',
                    borderTop: '1px solid #222', marginBottom: 0,
                }}>
                    → {outcome}
                </p>
            )}
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function CamberCaseStudy() {
    const navigate = useNavigate();
    const { scrollTo } = useSmoothScroll();
    const [scrollY, setScrollY] = useState(0);
    const [activeNav, setActiveNav] = useState(0);

    // Section refs for nav
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null, null]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const onScroll = () => {
            const y = window.scrollY;
            setScrollY(y);

            // Determine active section
            const offsets = sectionRefs.current.map(el => el ? el.getBoundingClientRect().top : Infinity);
            let active = 0;
            offsets.forEach((top, i) => { if (top < window.innerHeight * 0.5) active = i; });
            setActiveNav(active);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const heroFade = Math.max(0, 1 - scrollY / 500);

    const handleNav = (i: number) => {
        const el = sectionRefs.current[i];
        if (el) scrollTo(el.getBoundingClientRect().top + window.scrollY);
    };

    const setRef = (i: number) => (el: HTMLDivElement | null) => { sectionRefs.current[i] = el; };

    return (
        <div style={{ minHeight: '100vh', background: BG, color: 'white', ...figtree, overflowX: 'hidden' }}>
            <style>{`
                @media (max-width: 900px) {
                    .cs-sidenav { display: none !important; }
                    .cs-2col { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
                    .cs-3col { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
                    .cs-4col { grid-template-columns: 1fr 1fr !important; gap: 1rem !important; }
                    .cs-section { padding-top: 5rem !important; padding-bottom: 5rem !important; }
                    .cs-hero { height: auto !important; min-height: 100svh !important; }
                    .cs-pipeline { flex-direction: column !important; gap: 0 !important; }
                    .cs-pipeline-arrow { display: none !important; }
                    .cs-media-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
                }
                @media (max-width: 540px) {
                    .cs-4col { grid-template-columns: 1fr !important; }
                    .cs-hero h1 { font-size: clamp(3.5rem, 15vw, 6rem) !important; }
                }
            `}</style>

            {/* ── Back ── */}
            <button
                onClick={() => navigate('/')}
                style={{
                    position: 'absolute', top: '36px', left: PAD,
                    background: 'transparent', border: 'none', color: '#888',
                    cursor: 'pointer', ...figtree, fontSize: '0.8rem', zIndex: 100,
                    display: 'flex', alignItems: 'center', gap: '8px',
                    transition: 'color 0.2s ease', padding: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}
            >
                ← back
            </button>

            {/* ── Sidebar nav ── */}
            <SideNav active={activeNav} onNav={handleNav} />

            {/* ══════════════════════════════════════════════════
                HERO
            ══════════════════════════════════════════════════ */}
            <div style={{
                height: '100vh',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                padding: `0 ${PAD} min(80px, 7vh)`,
                position: 'relative',
                opacity: heroFade,
                transition: 'opacity 0.06s linear',
            }}>
                <div style={{
                    position: 'absolute', top: '-5%', right: '-5%',
                    width: '45vw', height: '55vh',
                    background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.02) 0%, transparent 60%)',
                    pointerEvents: 'none',
                }} />

                <p style={{ ...LBL, margin: '0 0 2.5rem', animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
                    <span style={{ ...serifItalic, color: '#555', fontSize: '1.3em', marginRight: '6px' }}>//</span>
                    Case Study · macOS App · 2026
                </p>

                <h1 style={{
                    fontSize: 'clamp(4rem, 9.5vw, 8.5rem)',
                    fontWeight: 700, lineHeight: 0.9,
                    letterSpacing: '-0.03em',
                    margin: '0 0 2.5rem', color: '#ffffff',
                    animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.2s both',
                }}>
                    Camber
                </h1>

                <p style={{
                    fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                    color: '#888', maxWidth: '44ch',
                    lineHeight: 1.65, margin: '0 0 2.5rem', fontWeight: 400,
                    animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.32s both',
                }}>
                    Every task manager promises to reduce friction, then buries itself three clicks deep.
                </p>

                <div style={{
                    display: 'flex', gap: '1rem',
                    animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.4s both',
                }}>
                    <ActionLink href="https://github.com/puneetk0/camber" label="GitHub Repository" />
                    <ActionLink href="https://camber-app.vercel.app/" label="Live Website" />
                </div>

                <div style={{
                    position: 'absolute', bottom: '2.5rem', right: PAD,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                    opacity: Math.min(heroFade * 1.5, 0.5),
                }}>
                    <p style={{ ...LBL, fontSize: '0.54rem', writingMode: 'vertical-rl', color: '#555' }}>scroll</p>
                    <div style={{
                        width: '1px', height: '44px',
                        background: 'linear-gradient(to bottom, #262626, transparent)',
                        animation: 'pulse 2.4s ease-in-out infinite',
                    }} />
                </div>
            </div>

            {/* ══════════════════════════════════════════════════
                META STRIP
            ══════════════════════════════════════════════════ */}
            <HR />
            <Reveal>
                <div style={{ display: 'flex', padding: `1.75rem ${PAD}`, overflowX: 'auto', gap: 0 }}>
                    {[
                        { k: 'Role', v: 'Solo | Design & Engineering' },
                        { k: 'Platform', v: 'macOS Universal' },
                        { k: 'Stack', v: 'Electron · React · sql.js' },
                        { k: 'Status', v: 'Shipped · Open Source' },
                        { k: 'Site', v: 'camberapp.com' },
                    ].map(({ k, v }, i, arr) => (
                        <div key={k} style={{
                            flex: '1 0 auto',
                            paddingRight: i < arr.length - 1 ? '3rem' : '0',
                            paddingLeft: i > 0 ? '3rem' : '0',
                            borderRight: i < arr.length - 1 ? '1px solid #1a1a1a' : 'none',
                        }}>
                            <p style={{ ...LBL, fontSize: '0.56rem', margin: '0 0 0.35rem' }}>{k}</p>
                            <p style={{ ...figtree, fontSize: '0.82rem', color: '#aaa', margin: 0 }}>{v}</p>
                        </div>
                    ))}
                </div>
            </Reveal>
            <HR />

            {/* ══════════════════════════════════════════════════
                PROBLEM
            ══════════════════════════════════════════════════ */}
            <div ref={setRef(0)} style={{ padding: `8rem ${PAD}` }}>
                <Reveal><SL>The Problem</SL></Reveal>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.1fr 0.9fr',
                    gap: 'clamp(4rem, 8vw, 9rem)',
                    alignItems: 'start',
                }}>
                    <Reveal delay={60}>
                        <h2 style={{
                            fontSize: 'clamp(1.8rem, 3.5vw, 2.9rem)',
                            fontWeight: 700, lineHeight: 1.1,
                            color: '#ffffff', margin: 0,
                            letterSpacing: '-0.02em',
                        }}>
                            The problem was never a missing feature. It was the psychological cost of opening the app.
                        </h2>
                    </Reveal>

                    <Reveal delay={130}>
                        <div>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: '#bbb', lineHeight: 1.9, margin: '0 0 1.5rem' }}>
                                I've tried every task manager. They all share the same failure mode: they live somewhere else. You're mid-thought, need to log something, and suddenly you're navigating: switching apps, finding the right project, expanding the right list. The thought dulls. Your flow is gone.
                            </p>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: '#bbb', lineHeight: 1.9, margin: 0 }}>
                                The deeper problem is emotional. When accessing the tool feels like a chore, you avoid it. Then avoid it more. It becomes a graveyard of tasks you entered optimistically two weeks ago. The tool stops reflecting reality. You stop trusting it. That loop is what most productivity apps never break.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* MEDIA 1 */}
            <Reveal y={10}>
                <div style={{ padding: `0 ${PAD}` }}>
                    <Media filename="camber-notch-demo.mp4" aspect="auto" objectFit="contain" />
                </div>
            </Reveal>

            {/* ══════════════════════════════════════════════════
                THINKING
            ══════════════════════════════════════════════════ */}
            <div ref={setRef(1)} style={{ padding: `8rem ${PAD} 0` }}>
                <Reveal><SL>My Thinking</SL></Reveal>

                <Reveal delay={60}>
                    <p style={{
                        ...figtree, fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                        color: '#aaa', maxWidth: '54ch', lineHeight: 1.8,
                        margin: '0 0 5rem',
                    }}>
                        The constraint I set: tasks had to be reachable without switching apps, clicking anything, or breaking flow. And they had to feel good to complete — not just useful.
                    </p>
                </Reveal>
            </div>

            {/* Decision cards — full-bleed, inside HR border */}
            <Reveal y={8}>
                <HR />
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    padding: `0 calc(${PAD} - 2.5rem)`
                }}>
                    {([
                        {
                            index: 'Option 01',
                            label: 'Dashboard app',
                            rationale: 'Requires full context switching. Gets buried behind VS Code the moment you actually start working. Adds to the problem it claims to solve.',
                        },
                        {
                            index: 'Option 02',
                            label: 'Menu bar dropdown',
                            rationale: 'Better proximity, but still needs a click, dense navigation, and competes with every other menu bar squatter you already have.',
                        },
                        {
                            index: 'Option 03',
                            label: 'The MacBook notch',
                            rationale: 'Dead real estate on every modern MacBook. A hover could surface tasks instantly — no click, no navigation, no app switch.',
                            outcome: 'Tasks become one motion away, always. The display itself becomes the interface.',
                            chosen: true,
                        },
                    ] as const).map((card, i) => (
                        <div key={i} style={{
                            borderRight: i < 2 ? '1px solid #1e1e1e' : 'none',
                        }}>
                            <DCard {...card} />
                        </div>
                    ))}
                </div>
                <HR />
            </Reveal>

            {/* Motivation aside */}
            <div style={{ padding: `6rem ${PAD}` }}>
                <Reveal>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '160px 1fr',
                        gap: '5rem',
                        alignItems: 'start',
                    }}>
                        <p style={{ ...LBL, fontSize: '0.58rem', margin: '4px 0 0', lineHeight: 1.7, color: '#666' }}>
                            The second problem:<br />motivation
                        </p>
                        <p style={{ ...figtree, fontSize: 'clamp(0.95rem, 1.5vw, 1.08rem)', color: '#bbb', lineHeight: 1.88, margin: 0 }}>
                            Solving friction wasn't enough. An accessible task list is still just a list. I thought about what actually makes you want to finish something, not obligation, but momentum. Formula 1 has that in every lap. By mapping tasks onto a race, completing a subtask stops being an admin action and starts being physical forward motion. The car moves. The flag gets closer. That loop is motivating in a way a checkbox never is.
                        </p>
                    </div>
                </Reveal>
            </div>

            {/* MEDIA 2 */}
            <Reveal y={10}>
                <div className="cs-2col cs-media-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', padding: `0 ${PAD}` }}>
                    <Media filename="camber-track-view.png" aspect="auto" objectFit="contain" />
                    <Media filename="camber-constructor-select.png" aspect="auto" objectFit="contain" />
                </div>
            </Reveal>

            {/* ══════════════════════════════════════════════════
                SOLUTION
            ══════════════════════════════════════════════════ */}
            <div ref={setRef(2)} style={{ padding: `8rem ${PAD}` }}>
                <Reveal><SL>The Solution</SL></Reveal>

                <Reveal delay={60}>
                    <h2 style={{
                        fontSize: 'clamp(2.2rem, 5.5vw, 4.8rem)',
                        fontWeight: 700, lineHeight: 0.95,
                        color: '#ffffff', margin: '0 0 5rem',
                        letterSpacing: '-0.028em', maxWidth: '16ch',
                    }}>
                        A task manager that lives inside your display.
                    </h2>
                </Reveal>

                <Reveal delay={100}>
                    <div className="cs-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem, 6vw, 7rem)' }}>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: '#bbb', lineHeight: 1.9, margin: 0 }}>
                            Hover over the MacBook notch and Camber drops down: an F1 race track rendered inside a minimal popover, with your tasks mapped as cars on constructor-themed lanes. Each subtask you complete advances the car. Finish everything and the car crosses the line.
                        </p>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: '#bbb', lineHeight: 1.9, margin: 0 }}>
                            Move your cursor away and it disappears. No close button, no minimize. It doesn't need to be managed: it just appears when you need it and vanishes when you don't. Constructors serve as project categories. Choosing one isn't just labeling a project, it's a small act of identity.
                        </p>
                    </div>
                </Reveal>
            </div>

            {/* ══════════════════════════════════════════════════
                EXECUTION
            ══════════════════════════════════════════════════ */}
            <HR />
            <div ref={setRef(3)} style={{ padding: `6rem ${PAD}` }}>
                <Reveal><SL>Execution</SL></Reveal>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 300px',
                    gap: 'clamp(4rem, 6vw, 7rem)',
                    alignItems: 'start',
                }}>
                    <Reveal delay={60}>
                        <div>
                            <h3 style={{
                                ...figtree, fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                                fontWeight: 600, color: '#ffffff',
                                lineHeight: 1.3, margin: '0 0 2rem',
                                letterSpacing: '-0.01em',
                            }}>
                                The notch problem macOS doesn't want you to solve.
                            </h3>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: '#999', lineHeight: 1.9, margin: '0 0 1.5rem' }}>
                                Apple exposes no public API for notch interaction. To work around this, I built a mouse polling loop using Electron's{' '}
                                <code style={{ color: '#bbb', fontSize: '0.875em', background: '#1c1c1c', padding: '2px 7px', borderRadius: '3px' }}>
                                    screen.getCursorScreenPoint()
                                </code>
                                {' '}running every 100ms. When the cursor enters a 200×25px hit zone, it triggers a frameless, transparent{' '}
                                <code style={{ color: '#bbb', fontSize: '0.875em', background: '#1c1c1c', padding: '2px 7px', borderRadius: '3px' }}>
                                    BrowserWindow
                                </code>
                                {' '}anchored to the display top.
                            </p>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: '#999', lineHeight: 1.9, margin: 0 }}>
                                The trickiest part was the 300ms grace period — without it, the popover flickered every time the cursor passed through. That single timing tweak was the difference between a prototype and something actually usable.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal delay={140}>
                        <div style={{ borderTop: '1px solid #1e1e1e' }}>
                            {[
                                { k: 'Framework', v: 'Electron + React' },
                                { k: 'JSX', v: 'HTM — no build step' },
                                { k: 'Data', v: 'sql.js · WASM SQLite · local' },
                                { k: 'Trigger', v: '100ms · 200×25px · 300ms grace' },
                                { k: 'Window', v: 'Frameless transparent, top-anchored' },
                                { k: 'Ships as', v: 'Universal binary · GitHub Releases' },
                            ].map(({ k, v }) => (
                                <div key={k} style={{
                                    display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem',
                                    padding: '1.1rem 0', borderBottom: '1px solid #1a1a1a',
                                }}>
                                    <p style={{ ...LBL, fontSize: '0.56rem', margin: 0 }}>{k}</p>
                                    <p style={{ ...figtree, fontSize: '0.82rem', color: '#aaa', margin: 0, lineHeight: 1.55 }}>{v}</p>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </div>
            <HR />

            {/* MEDIA 3 */}
            <Reveal y={10}>
                <div style={{ padding: `0 ${PAD}` }}>
                    <Media filename="camber-website.png" aspect="auto" objectFit="contain" />
                </div>
            </Reveal>

            {/* ══════════════════════════════════════════════════
                IMPACT
            ══════════════════════════════════════════════════ */}
            <div ref={setRef(4)} style={{ padding: `8rem ${PAD}` }}>
                <Reveal><SL>Impact</SL></Reveal>

                {/* Big pull quote */}
                <Reveal delay={60}>
                    <div style={{ margin: '0 0 7rem' }}>
                        <p style={{
                            fontSize: 'clamp(1.8rem, 4.5vw, 3.8rem)',
                            ...serifItalic, color: '#e0e0e0',
                            lineHeight: 1.1, margin: '0 0 1.5rem',
                            letterSpacing: '-0.01em', maxWidth: '22ch',
                        }}>
                            "The execution deserved a star."
                        </p>
                        <p style={{ ...LBL, fontSize: '0.58rem', color: '#666' }}>
                            GitHub user: unsolicited DM
                        </p>
                    </div>
                </Reveal>

                {/* 3 outcomes */}
                <Reveal delay={80}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        borderTop: '1px solid #1e1e1e',
                    }}>
                        {[
                            { head: 'Open source', body: 'Published on GitHub. Qualitative feedback over vanity metrics — users reached out directly with unsolicited praise.' },
                            { head: 'Daily use', body: "I use it every day. It solved the problem it was built for — my procrastination habits around tasks visibly shifted." },
                            { head: 'Motivation works', body: 'Users explicitly reported the F1 metaphor helped them finish things, not just log them.' },
                        ].map(({ head, body }, i) => (
                            <div key={head} style={{
                                padding: '2.5rem 2.5rem 2.5rem 0',
                                paddingLeft: i > 0 ? '2.5rem' : '0',
                                borderRight: i < 2 ? '1px solid #1e1e1e' : 'none',
                            }}>
                                <p style={{ ...figtree, fontSize: '1rem', fontWeight: 600, color: '#ffffff', margin: '0 0 0.9rem' }}>{head}</p>
                                <p style={{ ...figtree, fontSize: '0.875rem', color: '#aaa', lineHeight: 1.8, margin: 0 }}>{body}</p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>

            {/* ══════════════════════════════════════════════════
                REFLECTION
            ══════════════════════════════════════════════════ */}
            <HR />
            <div ref={setRef(5)} style={{ padding: `8rem ${PAD} 0` }}>
                <Reveal><SL>What I Learned</SL></Reveal>

                <Reveal delay={60}>
                    <p style={{
                        fontSize: 'clamp(1.4rem, 2.8vw, 2.3rem)',
                        fontWeight: 600, color: '#e8e8e8',
                        lineHeight: 1.25, margin: '0 0 3.5rem',
                        letterSpacing: '-0.015em', maxWidth: '28ch',
                    }}>
                        Constraints you invent are more interesting than constraints you inherit.
                    </p>
                </Reveal>

                <Reveal delay={100}>
                    <div className="cs-2col" style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 'clamp(3rem, 6vw, 7rem)',
                        marginBottom: '8rem',
                    }}>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: '#bbb', lineHeight: 1.9, margin: 0 }}>
                            Every app I'd built before Camber lived inside the rules macOS hands you: windows, menus, sidebars. Camber taught me that the most interesting design decisions happen when you ask where the interface <em>doesn't</em> have to live, not where it should. The notch wasn't in any list of valid surfaces: I only found it because I gave myself permission to be unreasonable first.
                        </p>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: '#bbb', lineHeight: 1.9, margin: 0 }}>
                            Gamification gets a bad reputation because most implementations are cynical: badges nobody wants, streaks that punish you. The F1 metaphor works because it maps onto something real. Progress is spatial. Finishing is physical. If I build another tool with a motivation problem, I'll look for a metaphor that earns its place instead of one that decorates the surface.
                        </p>
                    </div>
                </Reveal>
            </div>

            {/* ══════════════════════════════════════════════════
                FOOTER
            ══════════════════════════════════════════════════ */}
            <HR />
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: `3rem ${PAD}`,
            }}>
                <Reveal>
                    <div>
                        <p style={{ ...LBL, fontSize: '0.56rem', margin: '0 0 0.6rem', color: 'var(--text-muted)' }}>Next project</p>
                        <button
                            onClick={() => navigate('/case-study/findmyrepo')}
                            style={{
                                background: 'transparent', border: 'none',
                                color: 'var(--text-color)',
                                fontSize: 'clamp(1.4rem, 3vw, 2.4rem)', fontWeight: 700,
                                cursor: 'pointer', padding: 0, ...figtree,
                                letterSpacing: '-0.02em',
                                transition: 'opacity 0.25s ease',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.3')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        >
                            FindMyRepo →
                        </button>
                    </div>
                </Reveal>

                <Reveal delay={60}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'transparent', border: '1px solid var(--border-color)',
                            color: 'var(--text-muted)', padding: '10px 24px', cursor: 'pointer',
                            ...figtree, fontSize: '0.8rem',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-color)'; e.currentTarget.style.color = 'var(--text-color)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                        All projects
                    </button>
                </Reveal>
            </div>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.15; }
                    50%       { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}