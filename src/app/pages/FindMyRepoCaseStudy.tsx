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

        target.current = window.scrollY;
        current.current = window.scrollY;
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
const BG = '#141414';

const LBL: React.CSSProperties = {
    fontSize: '0.68rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.22em',
    color: '#666',
    ...figtree,
    margin: 0,
};

function SL({ children }: { children: React.ReactNode }) {
    return (
        <p style={{ ...LBL, margin: '0 0 3rem' }}>
            <span style={{ ...serifItalic, color: '#555', fontSize: '1.3em', marginRight: '6px' }}>//</span>
            {children}
        </p>
    );
}

function HR() {
    return <div style={{ width: '100%', height: '1px', background: '#1e1e1e' }} />;
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────
// Renamed sections to reflect the technical nature of this case study
const NAV_SECTIONS = ['Problem', 'Approach', 'Architecture', 'Execution', 'Impact', 'Learned'];

function SideNav({ active, onNav }: { active: number; onNav: (i: number) => void }) {
    return (
        <div style={{
            position: 'fixed', right: '36px', top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', gap: '20px',
            zIndex: 50, alignItems: 'flex-end',
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
                            opacity: isActive ? 1 : 0.5,
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

// ─── Media ────────────────────────────────────────────────────────────────────
function Media({ filename, aspect = '16/9', hint, objectFit = 'cover', padding, bgColor = '#0a0a0a' }: {
    filename: string; aspect?: string; hint?: string; objectFit?: 'cover' | 'contain' | 'fill';
    padding?: string; bgColor?: string;
}) {
    const isVideo = filename.endsWith('.mp4') || filename.endsWith('.webm');
    const path = `/assets/find-my-repo/${filename}`;
    const [loaded, setLoaded] = useState(false);

    return (
        <div style={{
            width: '100%',
            aspectRatio: aspect === 'auto' ? 'auto' : aspect,
            background: bgColor,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            padding: padding || '0',
            boxSizing: 'border-box' as const,
        }}>
            {isVideo ? (
                <video
                    src={path}
                    autoPlay muted loop playsInline
                    onLoadedData={() => setLoaded(true)}
                    style={{
                        width: '100%',
                        height: aspect === 'auto' ? 'auto' : '100%',
                        objectFit, display: 'block',
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
                        objectFit, display: 'block',
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 0.4s ease',
                    }}
                />
            )}
            {!loaded && (
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    pointerEvents: 'none',
                }}>
                    <p style={{ ...LBL, fontSize: '0.55rem', letterSpacing: '0.18em', color: '#222', margin: 0 }}>
                        {filename}
                    </p>
                </div>
            )}
        </div>
    );
}

// ─── Inline code ──────────────────────────────────────────────────────────────
function Code({ children }: { children: React.ReactNode }) {
    return (
        <code style={{
            color: '#bbb', fontSize: '0.875em',
            background: '#1c1c1c', padding: '2px 7px', borderRadius: '3px',
        }}>
            {children}
        </code>
    );
}

// ─── Pipeline step — unique to this case study ────────────────────────────────
function PipelineStep({ number, title, detail, metric }: {
    number: string; title: string; detail: string; metric?: string;
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div style={{
                width: '100%',
                border: '1px solid #222',
                padding: '2rem 1.5rem',
                background: '#0f0f0f',
                position: 'relative',
            }}>
                <p style={{ ...LBL, fontSize: '0.5rem', color: '#2a2a2a', margin: '0 0 0.85rem' }}>{number}</p>
                <p style={{ ...figtree, fontWeight: 600, fontSize: '0.85rem', color: '#eaeaea', margin: '0 0 0.6rem', lineHeight: 1.3 }}>
                    {title}
                </p>
                <p style={{ ...figtree, fontSize: '0.74rem', color: '#555', lineHeight: 1.65, margin: 0 }}>
                    {detail}
                </p>
                {metric && (
                    <p style={{
                        ...figtree, fontSize: '0.72rem', color: '#444',
                        margin: '1rem 0 0', paddingTop: '1rem',
                        borderTop: '1px solid #1a1a1a',
                        fontVariantNumeric: 'tabular-nums',
                    }}>
                        {metric}
                    </p>
                )}
            </div>
        </div>
    );
}

// ─── Stat block — unique to this case study ───────────────────────────────────
function StatBlock({ value, label, sub }: { value: string; label: string; sub?: string }) {
    return (
        <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '2rem' }}>
            <p style={{
                fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 700,
                color: '#ffffff', margin: '0 0 0.5rem',
                letterSpacing: '-0.03em', lineHeight: 1,
                ...figtree,
            }}>
                {value}
            </p>
            <p style={{ ...figtree, fontSize: '0.9rem', fontWeight: 600, color: '#888', margin: '0 0 0.4rem' }}>
                {label}
            </p>
            {sub && (
                <p style={{ ...figtree, fontSize: '0.78rem', color: '#444', margin: 0, lineHeight: 1.6 }}>
                    {sub}
                </p>
            )}
        </div>
    );
}

// ─── Attempt card — for the architecture evolution ────────────────────────────
function AttemptCard({ number, title, body, verdict, chosen }: {
    number: string; title: string; body: string; verdict: string; chosen?: boolean;
}) {
    return (
        <div style={{
            padding: '3rem 2.5rem',
            border: '1px solid #1e1e1e',
            borderTop: chosen ? '1px solid #383838' : '1px solid #1a1a1a',
            background: chosen ? 'rgba(255,255,255,0.018)' : 'transparent',
            position: 'relative',
            height: '100%', boxSizing: 'border-box' as const,
        }}>
            {chosen && (
                <span style={{ ...LBL, fontSize: '0.5rem', position: 'absolute', top: '3rem', right: '2.5rem', color: '#555' }}>
                    CHOSEN
                </span>
            )}
            <p style={{ ...LBL, fontSize: '0.54rem', margin: '0 0 1.25rem', color: chosen ? '#555' : '#333' }}>
                {number}
            </p>
            <p style={{
                ...figtree, fontSize: '1.05rem', fontWeight: 600,
                color: chosen ? '#ffffff' : '#888',
                margin: '0 0 1.5rem', lineHeight: 1.25, letterSpacing: '-0.01em',
            }}>
                {title}
            </p>
            <p style={{ ...figtree, fontSize: '0.9rem', color: chosen ? '#999' : '#555', lineHeight: 1.82, margin: '0 0 1.5rem' }}>
                {body}
            </p>
            <p style={{
                ...figtree, fontSize: '0.78rem',
                color: chosen ? '#666' : '#383838',
                lineHeight: 1.65, margin: 0,
                paddingTop: '1.25rem', borderTop: '1px solid #1e1e1e',
                fontStyle: chosen ? 'normal' : 'normal',
            }}>
                {chosen ? `→ ${verdict}` : `✕ ${verdict}`}
            </p>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function FindMyRepoCaseStudy() {
    const navigate = useNavigate();
    const { scrollTo } = useSmoothScroll();
    const [scrollY, setScrollY] = useState(0);
    const [activeNav, setActiveNav] = useState(0);

    const sectionRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null, null]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const onScroll = () => {
            const y = window.scrollY;
            setScrollY(y);
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

            <SideNav active={activeNav} onNav={handleNav} />

            {/* ══════════════════════════════════════════════════
                HERO — text-only, typographic weight carries it
            ══════════════════════════════════════════════════ */}
            <div style={{
                height: '100vh',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                padding: `0 ${PAD} min(80px, 7vh)`,
                position: 'relative',
                opacity: heroFade,
                transition: 'opacity 0.06s linear',
            }}>
                {/* Glow — bottom-right, distinct from Camber and Voca */}
                <div style={{
                    position: 'absolute', bottom: '0', right: '0',
                    width: '55vw', height: '60vh',
                    background: 'radial-gradient(ellipse at bottom right, rgba(255,255,255,0.016) 0%, transparent 65%)',
                    pointerEvents: 'none',
                }} />

                <p style={{ ...LBL, margin: '0 0 2.5rem', animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
                    <span style={{ ...serifItalic, color: '#555', fontSize: '1.3em', marginRight: '6px' }}>//</span>
                    Case Study · AI Search · Full Stack · 2024
                </p>

                {/* Two-line title — breaks intentionally for drama */}
                <h1 style={{
                    fontSize: 'clamp(3.2rem, 8vw, 7.5rem)',
                    fontWeight: 700, lineHeight: 0.92,
                    letterSpacing: '-0.03em',
                    margin: '0 0 3rem', color: '#ffffff',
                    animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.2s both',
                }}>
                    Find My<br />
                    <span style={{ color: '#333' }}>Repo</span>
                </h1>

                <p style={{
                    fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                    color: '#888', maxWidth: '44ch',
                    lineHeight: 1.65, margin: 0, fontWeight: 400,
                    animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.32s both',
                }}>
                    Finding the right open-source project to contribute to should not be harder than actually writing the code.
                </p>

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
                META STRIP — includes team credits
            ══════════════════════════════════════════════════ */}
            <HR />
            <Reveal>
                <div style={{ display: 'flex', padding: `1.5rem ${PAD}`, overflowX: 'auto', gap: 0 }}>
                    {[
                        { k: 'My Role', v: 'Design · Dev' },
                        { k: 'Backend', v: 'Abhinav & Satvik' },
                        { k: 'Stack', v: 'FastAPI · MongoDB · Vector' },
                        { k: 'Index', v: '43k+ repos' },
                        { k: 'Status', v: 'Shipped' },
                    ].map(({ k, v }, i, arr) => (
                        <div key={k} style={{
                            flex: '1 0 auto',
                            paddingRight: i < arr.length - 1 ? '1.5rem' : '0',
                            paddingLeft: i > 0 ? '1.5rem' : '0',
                            borderRight: i < arr.length - 1 ? '1px solid #1a1a1a' : 'none',
                        }}>
                            <p style={{ ...LBL, fontSize: '0.52rem', margin: '0 0 0.25rem' }}>{k}</p>
                            <p style={{ ...figtree, fontSize: '0.76rem', color: '#aaa', margin: 0 }}>{v}</p>
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
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'clamp(5rem, 10vw, 12rem)',
                    alignItems: 'start',
                }}>
                    <Reveal delay={60}>
                        <h2 style={{
                            fontSize: 'clamp(1.8rem, 3.5vw, 2.9rem)',
                            fontWeight: 700, lineHeight: 1.1,
                            color: '#ffffff', margin: 0,
                            letterSpacing: '-0.02em',
                        }}>
                            The problem wasn't a lack of repositories. It was a lack of semantic understanding.
                        </h2>
                    </Reveal>

                    <Reveal delay={130}>
                        <div>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: '#aaa', lineHeight: 1.9, margin: '0 0 1.5rem' }}>
                                GitHub's native search is powerful but fundamentally relies on exact keyword matching and rigid topic tags. If a developer doesn't know the precise terminology a maintainer used, they find nothing. The search returns silence not because the repository doesn't exist, but because the words don't match.
                            </p>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: '#aaa', lineHeight: 1.9, margin: 0 }}>
                                Trending pages compound the problem. They surface massive, intimidating frameworks, not the smaller, actively maintained projects that actually need contributors. Beginners especially hit this wall: they want to help, they have a skill set, and the platform gives them no useful bridge between the two.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* MEDIA 1 — search UI, the hero product shot */}
            <Reveal y={10}>
                <div style={{ padding: `0 ${PAD}` }}>
                    {/*
                      MEDIA HINT:
                      Main search interface — ideally showing a natural language query
                      like "React to-do list for beginners" returning rich results.
                      Ideal: find-my-repo-search.png or find-my-repo-search.mp4
                    */}
                    <Media
                        filename="find-my-repo-search.gif"
                        aspect="auto"
                        objectFit="contain"
                        padding="4rem"
                        bgColor="#080808"
                        hint="Search interface — natural language query returning results"
                    />
                </div>
            </Reveal>

            {/* ══════════════════════════════════════════════════
                APPROACH — replaces "My Thinking"
                Shows the architecture evolution as two attempts
            ══════════════════════════════════════════════════ */}
            <div ref={setRef(1)} style={{ padding: `8rem ${PAD} 0` }}>
                <Reveal><SL>The Approach</SL></Reveal>

                <Reveal delay={60}>
                    <p style={{
                        ...figtree, fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                        color: '#aaa', maxWidth: '54ch', lineHeight: 1.8,
                        margin: '0 0 1.5rem',
                    }}>
                        The system needed to understand meaning, not just match words. Getting there took two distinct attempts, and the gap between them taught me more than both combined.
                    </p>
                    <p style={{
                        ...figtree, fontSize: '0.78rem', color: '#555',
                        letterSpacing: '0.06em', margin: '0 0 5rem',
                    }}>
                        I set a hard rule early: LLMs are for reasoning. Vector search is for retrieval. Never conflate the two.
                    </p>
                </Reveal>
            </div>

            {/* Attempt cards — 2 col, full bleed between HRs */}
            <Reveal y={8}>
                <HR />
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    padding: `0 calc(${PAD} - 2.5rem)`,
                }}>
                    <div style={{ borderRight: '1px solid #1e1e1e' }}>
                        <AttemptCard
                            number="Attempt 01"
                            title="LLM-Generated Database Filters"
                            body="Used Gemini to translate a user's plain-English query into a strict MongoDB filter object. The idea was clean: describe what you want, get a structured query back. In practice, it was brittle. The LLM occasionally hallucinated field names. More critically, it relied entirely on exact topic tags maintainers had set: a search across 43,000 repos sometimes returned only 28 results."
                            verdict="Abandoned. Exact-match dependency defeats the entire purpose of semantic search."
                        />
                    </div>
                    <div>
                        <AttemptCard
                            number="Attempt 02"
                            title="Vector Embeddings + HNSW Index"
                            body="Instead of asking an LLM to guess filters, I mapped both the user's query and every repository into mathematical space. Semantic closeness becomes a distance calculation: no vocabulary overlap required. A search for 'React to-do list for beginners' finds repositories even if they've never used those exact words."
                            verdict="Consistently returns 60–100 highly relevant results. Sub-100ms query time. No hallucination possible in the retrieval path."
                            chosen
                        />
                    </div>
                </div>
                <HR />
            </Reveal>

            {/* The boundary decision */}
            <div style={{ padding: `6rem ${PAD}` }}>
                <Reveal>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '160px 1fr',
                        gap: '5rem', alignItems: 'start',
                    }}>
                        <p style={{ ...LBL, fontSize: '0.58rem', margin: '4px 0 0', lineHeight: 1.7, color: '#666' }}>
                            The boundary<br />decision
                        </p>
                        <p style={{ ...figtree, fontSize: 'clamp(0.95rem, 1.5vw, 1.08rem)', color: '#aaa', lineHeight: 1.88, margin: 0 }}>
                            Once vector search was solving retrieval, I isolated Gemini to a single endpoint: <Code>/userpreferences</Code>. At onboarding, the LLM maps a user's stated role and skills into a personalized recommendation seed. It never touches the live search path. This boundary is not just an architectural preference, it's what makes the system both smarter and faster than a pure LLM approach. Heavy reasoning happens once, at setup. Lightweight embeddings handle everything at query time.
                        </p>
                    </div>
                </Reveal>
            </div>

            {/* ══════════════════════════════════════════════════
                ARCHITECTURE — replaces "Solution"
                Pipeline visualization + four key decisions
            ══════════════════════════════════════════════════ */}
            <HR />
            <div ref={setRef(2)} style={{ padding: `8rem ${PAD}` }}>
                <Reveal><SL>The Architecture</SL></Reveal>

                <Reveal delay={60}>
                    <h2 style={{
                        fontSize: 'clamp(1.8rem, 4vw, 3.4rem)',
                        fontWeight: 700, lineHeight: 1.05,
                        color: '#ffffff', margin: '0 0 5rem',
                        letterSpacing: '-0.025em', maxWidth: '22ch',
                    }}>
                        A semantic discovery engine built on a strict separation of concerns.
                    </h2>
                </Reveal>

                {/* Pipeline visualization */}
                <Reveal delay={80}>
                    <p style={{ ...LBL, fontSize: '0.54rem', margin: '0 0 2rem', color: '#333' }}>
                        Query pipeline : end to end
                    </p>
                    <div style={{ display: 'flex', gap: '0', marginBottom: '6rem', alignItems: 'stretch' }}>
                        {[
                            {
                                number: '01',
                                title: 'User Query',
                                detail: 'Plain English input. No boolean operators, no tags required.',
                                metric: 'e.g. "React to-do list for beginners"',
                            },
                            {
                                number: '02',
                                title: 'Embed Query',
                                detail: 'all-MiniLM-L6-v2 maps query to a 384-dimensional vector on CPU.',
                                metric: '< 100ms embedding time',
                            },
                            {
                                number: '03',
                                title: 'HNSW Vector Search',
                                detail: 'Atlas Vector Search finds nearest neighbours by cosine similarity across 43k embedded repos.',
                                metric: 'Cosine similarity · HNSW index',
                            },
                            {
                                number: '04',
                                title: 'Score Filter',
                                detail: 'React frontend drops results below 0.6 similarity. Feed ends naturally — no irrelevant tail.',
                                metric: 'Cutoff: 0.6 · Returns 60–100 results',
                            },
                            {
                                number: '05',
                                title: 'Ranked Results',
                                detail: 'Sorted by relevance. "Hidden Gems" feed separately surfaces repos under 1k stars.',
                                metric: '< 1k ★ · Active · Well-documented',
                            },
                        ].map((step, i, arr) => (
                            <React.Fragment key={step.number}>
                                <PipelineStep {...step} />
                                {i < arr.length - 1 && (
                                    <div style={{
                                        display: 'flex', alignItems: 'center',
                                        padding: '0 0.35rem', flexShrink: 0,
                                        marginTop: '-1rem',
                                        opacity: 0.1,
                                    }}>
                                        <span style={{ color: '#fff', fontSize: '0.75rem' }}>→</span>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </Reveal>

                {/* Four decisions as a vertical list */}
                <Reveal delay={60}>
                    <p style={{ ...LBL, fontSize: '0.56rem', margin: '0 0 0', color: '#333' }}>
                        Key decisions
                    </p>
                    <div style={{ borderTop: '1px solid #1e1e1e', marginTop: '1.5rem' }}>
                        {[
                            {
                                n: '01',
                                decision: 'Atlas Vector Search (HNSW) over 384-dim embeddings',
                                why: 'Bypasses the limitations of exact-match topic tags entirely.',
                                result: 'Repo title, language, topics, and README are concatenated and embedded. Cosine similarity finds intent, not keywords.',
                            },
                            {
                                n: '02',
                                decision: 'Isolating Gemini to /userpreferences only',
                                why: 'LLM latency and hallucination risk must never sit in the active search path.',
                                result: 'Gemini runs once at onboarding to build a personalized seed. Search is pure vector retrieval — fast and deterministic.',
                            },
                            {
                                n: '03',
                                decision: 'Organic cutoff at 0.6 similarity score',
                                why: 'Infinite scroll should not surface increasingly irrelevant results just to appear comprehensive.',
                                result: 'The feed ends naturally when relevance drops. Users trust the results because there is no garbage tail.',
                            },
                            {
                                n: '04',
                                decision: 'The "Hidden Gems" feed',
                                why: 'Trending pages are dominated by massive frameworks that are intimidating and don\'t need contributors.',
                                result: 'A dedicated feed surfaces under-1k-star repos that are actively maintained and well-documented.',
                            },
                        ].map(({ n, decision, why, result }) => (
                            <div key={n} style={{
                                display: 'grid',
                                gridTemplateColumns: '2rem 1fr 1fr 1fr',
                                gap: '3rem',
                                padding: '2.25rem 0',
                                borderBottom: '1px solid #1a1a1a',
                                alignItems: 'start',
                            }}>
                                <p style={{ ...LBL, fontSize: '0.5rem', color: '#2e2e2e', margin: '3px 0 0' }}>{n}</p>
                                <p style={{ ...figtree, fontWeight: 600, fontSize: '0.875rem', color: '#eaeaea', margin: 0, lineHeight: 1.45 }}>
                                    {decision}
                                </p>
                                <p style={{ ...figtree, fontSize: '0.82rem', color: '#666', lineHeight: 1.8, margin: 0 }}>
                                    {why}
                                </p>
                                <p style={{ ...figtree, fontSize: '0.82rem', color: '#888', lineHeight: 1.8, margin: 0 }}>
                                    → {result}
                                </p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>

            {/* MEDIA 2 — results / hidden gems feed */}
            <Reveal y={10}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', padding: `0 ${PAD}` }}>
                    {/*
                      MEDIA HINT (left):
                      Results page — showing semantic search output with relevance scores.
                      Ideal: find-my-repo-results.png
                    */}
                    <Media
                        filename="find-my-repo-results.png"
                        aspect="auto"
                        objectFit="contain"
                        padding="3rem"
                        bgColor="#080808"
                        hint="Results page — semantic search output"
                    />
                    {/*
                      MEDIA HINT (right):
                      Hidden Gems feed — smaller repos surfaced by the algorithmic feed.
                      Ideal: find-my-repo-gems.png
                    */}
                    <Media
                        filename="find-my-repo-gems.png"
                        aspect="auto"
                        objectFit="contain"
                        padding="3rem"
                        bgColor="#080808"
                        hint="Hidden Gems feed — under-1k-star repos"
                    />
                </div>
            </Reveal>

            {/* ══════════════════════════════════════════════════
                EXECUTION — engineering + team split
            ══════════════════════════════════════════════════ */}
            <div ref={setRef(3)} style={{ padding: `8rem ${PAD}` }}>
                <Reveal><SL>Execution</SL></Reveal>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'clamp(5rem, 10vw, 10rem)',
                    alignItems: 'start',
                    marginBottom: '6rem',
                }}>
                    <Reveal delay={60}>
                        <div>
                            <p style={{ ...LBL, fontSize: '0.54rem', color: '#333', margin: '0 0 1.5rem' }}>
                                My contribution
                            </p>
                            <h3 style={{
                                ...figtree, fontSize: 'clamp(1.1rem, 2vw, 1.45rem)',
                                fontWeight: 600, color: '#ffffff',
                                lineHeight: 1.3, margin: '0 0 2rem',
                                letterSpacing: '-0.015em',
                            }}>
                                Ideation, the search UX, and a frontend that makes the data feel instant.
                            </h3>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: '#bbb', lineHeight: 1.9, margin: '0 0 1.5rem' }}>
                                I conceived the core insight — semantic intent matching over keyword filtering — and designed the search experience around it. The React 18 frontend is built for perceived speed: results appear progressively, the similarity cutoff fires client-side so there's no loading state for the filter, and the "Hidden Gems" feed surfaces in a separate tab with its own scroll context.
                            </p>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: '#bbb', lineHeight: 1.9, margin: 0 }}>
                                The user preference onboarding was also my design — a short flow that maps a developer's role and stack into a personalized seed, which Gemini then structures into the initial recommendation set before they've typed a single search.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal delay={100}>
                        <div>
                            <p style={{ ...LBL, fontSize: '0.54rem', color: '#333', margin: '0 0 1.5rem' }}>
                                Abhinav & Satvik — backend
                            </p>
                            <h3 style={{
                                ...figtree, fontSize: 'clamp(1.1rem, 2vw, 1.45rem)',
                                fontWeight: 600, color: '#ffffff',
                                lineHeight: 1.3, margin: '0 0 2rem',
                                letterSpacing: '-0.015em',
                            }}>
                                43,000 repositories ingested, cleaned, embedded, and indexed.
                            </h3>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: '#bbb', lineHeight: 1.9, margin: 0 }}>
                                Abhinav and Satvik built the FastAPI service and the Python ingestion pipeline — fetching repos from the GitHub API, stripping and cleaning READMEs, running them through <Code>all-MiniLM-L6-v2</Code> to generate 384-dimensional embeddings, and loading them into MongoDB Atlas with the HNSW index configured for cosine similarity. The model choice was deliberate: fast enough on CPU to embed user queries in under 100ms at query time.
                            </p>
                        </div>
                    </Reveal>
                </div>

                {/* Stack table */}
                <Reveal delay={80}>
                    <HR />
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        marginTop: 0,
                    }}>
                        {[
                            { layer: 'Frontend', items: ['React 18', 'Vite', 'Tailwind CSS'] },
                            { layer: 'Backend', items: ['FastAPI', 'Python', 'GitHub REST API'] },
                            { layer: 'AI / ML', items: ['all-MiniLM-L6-v2', 'Google Gemini', 'sentence-transformers'] },
                            { layer: 'Database', items: ['MongoDB Atlas', 'Atlas Vector Search', 'HNSW Index · 384-dim · Cosine'] },
                        ].map(({ layer, items }, i, arr) => (
                            <div key={layer} style={{
                                padding: '2rem 2rem 2rem 0',
                                paddingLeft: i > 0 ? '2rem' : '0',
                                borderRight: i < arr.length - 1 ? '1px solid #1a1a1a' : 'none',
                                borderBottom: 'none',
                            }}>
                                <p style={{ ...LBL, fontSize: '0.54rem', color: '#333', margin: '0 0 1.25rem' }}>{layer}</p>
                                {items.map(item => (
                                    <p key={item} style={{ ...figtree, fontSize: '0.82rem', color: '#777', margin: '0 0 0.4rem', lineHeight: 1.5 }}>
                                        {item}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </div>
                    <HR />
                </Reveal>
            </div>

            {/* MEDIA 3 — onboarding / preferences flow */}
            <Reveal y={10}>
                <div style={{ padding: `0 ${PAD}` }}>
                    {/*
                      MEDIA HINT:
                      User preference onboarding screen — where developers input
                      their role and tech stack to get personalized results.
                      Ideal: find-my-repo-onboarding.png or find-my-repo-onboarding.mp4
                    */}
                    <Media
                        filename="find-my-repo-dashboard.png"
                        aspect="auto"
                        objectFit="contain"
                        padding="5rem"
                        bgColor="#080808"
                        hint="User onboarding — role and stack preference input"
                    />
                </div>
            </Reveal>

            {/* ══════════════════════════════════════════════════
                IMPACT — numbers as the hero moment
            ══════════════════════════════════════════════════ */}
            <div ref={setRef(4)} style={{ padding: `8rem ${PAD}` }}>
                <Reveal><SL>Impact</SL></Reveal>

                {/* Stat grid — numbers carry the story */}
                <Reveal delay={60}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '4rem 3rem',
                        marginBottom: '6rem',
                    }}>
                        <StatBlock
                            value="43k+"
                            label="Repositories"
                            sub="Fetched, cleaned, and embedded searchable by intent."
                        />
                        <StatBlock
                            value="< 100ms"
                            label="Query time"
                            sub="End-to-end from search input to ranked results."
                        />
                        <StatBlock
                            value="60–100"
                            label="Results"
                            sub="vs. 28 results from the LLM-filter approach."
                        />
                        <StatBlock
                            value="0.6"
                            label="Similarity"
                            sub="Feed ends cleanly with no irrelevant tail."
                        />
                    </div>
                </Reveal>

                <Reveal delay={80}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 'clamp(3rem, 6vw, 7rem)',
                    }}>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: '#aaa', lineHeight: 1.9, margin: 0 }}>
                            Find My Repo transforms a massive, unsearchable catalog into a semantically mapped graph. By decoupling LLM reasoning from search retrieval, the platform achieves sub-100ms query times while returning dramatically better results than the keyword-based alternative.
                        </p>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: '#aaa', lineHeight: 1.9, margin: 0 }}>
                            The "Hidden Gems" feed directly solves the intimidation problem that keeps beginners out of open source. Smaller, maintainable projects that actually need contributors are surfaced, not buried under trending frameworks. It removes the blank-page syndrome from the contribution workflow.
                        </p>
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
                        Reaching for an LLM first is a habit. Knowing when not to is a skill.
                    </p>
                </Reveal>

                <Reveal delay={100}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 'clamp(3rem, 6vw, 7rem)',
                        marginBottom: '8rem',
                    }}>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: '#bbb', lineHeight: 1.9, margin: 0 }}>
                            The first attempt — Gemini generating MongoDB filters — felt elegant on paper. The LLM understands language, the database stores repos, let them talk. The failure mode only appeared under real queries: 28 results from 43,000 repos isn't a minor issue. It's the entire problem recreated in a different format. Switching to vector embeddings wasn't a refinement. It was a paradigm shift.
                        </p>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: '#bbb', lineHeight: 1.9, margin: 0 }}>
                            Working with Abhinav and Satvik on the backend boundary taught me something I'll carry into every system I design: the interface between components matters as much as the components themselves. The decision to keep Gemini out of the search path — and only in onboarding — made the whole system faster and more trustworthy. Constraints at the seams produce better architectures than constraints inside the parts.
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
                        <p style={{ ...LBL, fontSize: '0.56rem', margin: '0 0 0.6rem', color: '#333' }}>Next project</p>
                        {/*
                          UPDATE: Change label and slug to your next case study.
                        */}
                        <button
                            onClick={() => navigate('/case-study/visual-vortex')}
                            style={{
                                background: 'transparent', border: 'none',
                                color: '#ffffff',
                                fontSize: 'clamp(1.4rem, 3vw, 2.4rem)', fontWeight: 700,
                                cursor: 'pointer', padding: 0, ...figtree,
                                letterSpacing: '-0.02em',
                                transition: 'opacity 0.25s ease',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.3')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        >
                            Visual Vortex →
                        </button>
                    </div>
                </Reveal>

                <Reveal delay={60}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'transparent', border: '1px solid #1e1e1e',
                            color: '#555', padding: '10px 24px', cursor: 'pointer',
                            ...figtree, fontSize: '0.8rem',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#555'; }}
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