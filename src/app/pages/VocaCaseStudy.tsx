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
    color: '#383838',
    ...figtree,
    margin: 0,
};

function SL({ children }: { children: React.ReactNode }) {
    return (
        <p style={{ ...LBL, margin: '0 0 3rem' }}>
            <span style={{ ...serifItalic, color: '#303030', fontSize: '1.3em', marginRight: '6px' }}>//</span>
            {children}
        </p>
    );
}

function HR() {
    return <div style={{ width: '100%', height: '1px', background: '#1e1e1e' }} />;
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────
const NAV_SECTIONS = ['Problem', 'Thinking', 'Solution', 'Execution', 'Impact', 'Learned'];

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
                        title={label}
                        style={{
                            background: 'transparent', border: 'none',
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            gap: '10px', padding: 0,
                            opacity: isActive ? 1 : 0.3,
                            transition: 'opacity 0.3s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = isActive ? '1' : '0.3')}
                    >
                        <span style={{
                            ...LBL, fontSize: '0.58rem', letterSpacing: '0.18em',
                            color: isActive ? '#aaa' : '#555',
                            transition: 'color 0.3s ease', whiteSpace: 'nowrap' as const,
                        }}>
                            {label}
                        </span>
                        <span style={{
                            width: isActive ? '20px' : '6px', height: '1px',
                            background: isActive ? '#aaa' : '#333', display: 'block',
                            transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)', flexShrink: 0,
                        }} />
                    </button>
                );
            })}
        </div>
    );
}

// ─── Media placeholder ────────────────────────────────────────────────────────
function Media({ filename, aspect = '16/9', hint }: { filename: string; aspect?: string; hint?: string }) {
    /*
     * ── SWAP INSTRUCTIONS ───────────────────────────────────────────────────
     * Video:
     *   <video src={`/assets/voca/${filename}`} autoPlay muted loop playsInline
     *     style={{ width:'100%', aspectRatio:aspect, objectFit:'cover', display:'block' }} />
     * Image:
     *   <img src={`/assets/voca/${filename}`} alt={hint ?? ''}
     *     style={{ width:'100%', aspectRatio:aspect, objectFit:'cover', display:'block' }} />
     * ────────────────────────────────────────────────────────────────────────
     */
    return (
        <div style={{
            width: '100%', aspectRatio: aspect,
            background: '#0a0a0a', border: '1px solid #141414',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '8px',
            position: 'relative', overflow: 'hidden',
        }}>
            <p style={{ ...LBL, fontSize: '0.55rem', letterSpacing: '0.18em', color: '#333', position: 'relative', margin: 0 }}>
                {filename}
            </p>
            {hint && (
                <p style={{ ...LBL, fontSize: '0.48rem', letterSpacing: '0.12em', color: '#222', position: 'relative', margin: 0, textTransform: 'none' as const }}>
                    {hint}
                </p>
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
            height: '100%', boxSizing: 'border-box' as const,
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
                color: chosen ? '#ffffff' : '#aaa', margin: '0 0 1.5rem', lineHeight: 1.3, letterSpacing: '-0.01em'
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

// ─── Main ─────────────────────────────────────────────────────────────────────
export function VocaCaseStudy() {
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
                    background: 'transparent', border: 'none', color: '#555',
                    cursor: 'pointer', ...figtree, fontSize: '0.8rem', zIndex: 100,
                    display: 'flex', alignItems: 'center', gap: '8px',
                    transition: 'color 0.2s ease', padding: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#555')}
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
                <p style={{ ...LBL, margin: '0 0 2.5rem', animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
                    <span style={{ ...serifItalic, color: '#282828', fontSize: '1.3em', marginRight: '6px' }}>//</span>
                    Case Study · Voice AI · Web App · 2024
                </p>

                <h1 style={{
                    fontSize: 'clamp(4.5rem, 10vw, 9.5rem)',
                    fontWeight: 500, lineHeight: 0.9,
                    letterSpacing: '-0.04em',
                    margin: '0 0 2.5rem', color: '#ffffff',
                    animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.2s both',
                }}>
                    Voca
                </h1>

                <p style={{
                    fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                    color: '#555', maxWidth: '44ch',
                    lineHeight: 1.65, margin: 0, fontWeight: 400,
                    animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.32s both',
                }}>
                    Forms treat users like data-entry clerks — stripping the nuance out of how answers are actually spoken.
                </p>

                <div style={{
                    position: 'absolute', bottom: '2.5rem', right: PAD,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                    opacity: Math.min(heroFade * 1.5, 0.5),
                }}>
                    <p style={{ ...LBL, fontSize: '0.54rem', writingMode: 'vertical-rl', color: '#242424' }}>scroll</p>
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
                        { k: 'Role', v: 'Solo — Design & Engineering' },
                        { k: 'Platform', v: 'Web (Next.js 14)' },
                        { k: 'Stack', v: 'Gemini · Groq Whisper · Supabase' },
                        { k: 'Also known as', v: 'Vocaforms' },
                        { k: 'Status', v: 'Shipped · MVP' },
                    ].map(({ k, v }, i, arr) => (
                        <div key={k} style={{
                            flex: '1 0 auto',
                            paddingRight: i < arr.length - 1 ? '3rem' : '0',
                            paddingLeft: i > 0 ? '3rem' : '0',
                            borderRight: i < arr.length - 1 ? '1px solid #1a1a1a' : 'none',
                        }}>
                            <p style={{ ...LBL, fontSize: '0.56rem', margin: '0 0 0.35rem' }}>{k}</p>
                            <p style={{ ...figtree, fontSize: '0.82rem', color: '#888', margin: 0 }}>{v}</p>
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
                            fontWeight: 500, lineHeight: 1.15,
                            color: '#ffffff', margin: 0,
                            letterSpacing: '-0.03em',
                        }}>
                            Existing data collection has two separate failure modes — one for users, one for creators.
                        </h2>
                    </Reveal>

                    <Reveal delay={130}>
                        <div>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: '#999', lineHeight: 1.9, margin: '0 0 1.5rem' }}>
                                For the user: static HTML forms are rigid, friction-heavy, and assume a baseline of digital literacy that excludes many people — especially on mobile. A person who could give you a fluent, confident verbal answer gets stuck on a text box.
                            </p>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: '#999', lineHeight: 1.9, margin: 0 }}>
                                For the creator: text boxes strip vital qualitative context. You can't gauge a candidate's confidence, clarity, or tone from a polished paragraph — especially one that may have been rewritten by an AI. The audio of the answer is as critical as the words. Every existing tool discards it entirely.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* FULL-BLEED MEDIA 1 — Hero demo of the conversation UI */}
            <Reveal y={10}>
                {/*
                  MEDIA HINT:
                  This should be a screen recording or demo of Voca's conversational flow —
                  the voice agent speaking, the waveform animating, the transcript appearing.
                  Ideal: voca-conversation-demo.mp4
                */}
                <Media
                    filename="voca-conversation-demo.mp4"
                    aspect="16/9"
                    hint="Screen recording — voice agent conversation flow"
                />
            </Reveal>

            {/* ══════════════════════════════════════════════════
                THINKING
            ══════════════════════════════════════════════════ */}
            <div ref={setRef(1)} style={{ padding: `8rem ${PAD} 0` }}>
                <Reveal><SL>My Thinking</SL></Reveal>

                <Reveal delay={60}>
                    <p style={{
                        ...figtree, fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                        color: '#888', maxWidth: '54ch', lineHeight: 1.8,
                        margin: '0 0 5rem',
                    }}>
                        The shift I needed to make wasn't a UI improvement — it was a paradigm change. From "filling out a form" to "conducting an interview."
                    </p>
                </Reveal>
            </div>

            {/* Decision cards */}
            <Reveal y={8}>
                <HR />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', padding: `0 calc(${PAD} - 2.5rem)` }}>
                    {([
                        {
                            index: 'Option 01',
                            label: 'Voice-to-text on standard forms',
                            rationale: 'A band-aid. The user still has to navigate a rigid visual UI — the friction just shifts from typing to microphone management. The mental model doesn\'t change.',
                        },
                        {
                            index: 'Option 02',
                            label: 'Purely conversational AI agent',
                            rationale: 'The user speaks naturally. The agent guides them through a narrative flow — no rigid fields, no sequence to manage. It extracts structured data from natural speech.',
                            outcome: 'A user can say "Um, my email is john doe at gmail... oh wait, yahoo" and the AI extracts johndoe@yahoo.com into the database perfectly, without ever making them feel like they answered wrong.',
                            chosen: true,
                        },
                    ] as const).map((card, i) => (
                        <div key={i} style={{ borderRight: i < 1 ? '1px solid #1e1e1e' : 'none' }}>
                            <DCard {...card} />
                        </div>
                    ))}
                </div>
                <HR />
            </Reveal>

            {/* The forgiveness problem */}
            <div style={{ padding: `6rem ${PAD}` }}>
                <Reveal>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '160px 1fr',
                        gap: '5rem', alignItems: 'start',
                    }}>
                        <p style={{ ...LBL, fontSize: '0.58rem', margin: '4px 0 0', lineHeight: 1.7, color: '#2a2a2a' }}>
                            The forgiving<br />AI problem
                        </p>
                        <p style={{ ...figtree, fontSize: 'clamp(0.95rem, 1.5vw, 1.08rem)', color: '#999', lineHeight: 1.88, margin: 0 }}>
                            For this to work, the AI had to be genuinely forgiving. Not just of spelling or grammar, but of how people actually talk — colloquial speech, mid-sentence corrections, code-switching between languages. My audience included Hinglish speakers. The agent had to handle a mix of Hindi and English naturally, extract perfectly structured JSON, and never once make the user feel like they'd answered incorrectly. That's a much harder brief than just "transcribe speech."
                        </p>
                    </div>
                </Reveal>
            </div>

            {/* FULL-BLEED MEDIA 2 — split: form builder + admin dashboard */}
            <Reveal y={10}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                    {/*
                      MEDIA HINT (left):
                      Form builder / creator interface — where someone designs a Voca form.
                      Ideal: voca-form-builder.jpg or voca-form-builder.mp4
                    */}
                    <Media
                        filename="voca-form-builder.jpg"
                        aspect="4/3"
                        hint="Form builder — creator interface"
                    />
                    {/*
                      MEDIA HINT (right):
                      Admin dashboard — showing a response with the audio player and structured data side-by-side.
                      Ideal: voca-admin-dashboard.jpg
                    */}
                    <Media
                        filename="voca-admin-dashboard.jpg"
                        aspect="4/3"
                        hint="Admin dashboard — audio + structured response"
                    />
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
                        fontWeight: 500, lineHeight: 1.0,
                        color: '#ffffff', margin: '0 0 6rem',
                        letterSpacing: '-0.035em', maxWidth: '18ch',
                    }}>
                        A form engine that listens instead of waits.
                    </h2>
                </Reveal>

                <Reveal delay={100}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(4rem, 8vw, 10rem)', marginBottom: '6rem' }}>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: '#999', lineHeight: 1.9, margin: 0 }}>
                            The user speaks to an AI agent that guides them through the form as a natural conversation. No fields, no next buttons, no mandatory format. The agent extracts structured data from whatever they say and stores it — alongside the original audio — in real time.
                        </p>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: '#999', lineHeight: 1.9, margin: 0 }}>
                            Form creators get a dashboard where every response renders as both a clean data table and a native audio player. The structure is there for analysis. The audio is there for everything a text box can't capture — confidence, hesitation, tone, authenticity.
                        </p>
                    </div>
                </Reveal>

                {/* Three decisions as a column list */}
                <Reveal delay={80}>
                    <div style={{ borderTop: '1px solid #1e1e1e' }}>
                        {[
                            {
                                decision: 'Conversational data extraction',
                                rationale: 'Eliminates manual typing and complex regex validation.',
                                outcome: 'Natural speech — corrections, fillers, and all — maps cleanly to structured database fields.',
                            },
                            {
                                decision: 'Retaining the source audio',
                                rationale: 'Captures tonal nuance and confidence the transcript can\'t convey.',
                                outcome: 'Every response in the admin dashboard pairs structured text with a native audio player.',
                            },
                            {
                                decision: 'Optimistic UI with local TTS fallbacks',
                                rationale: 'Awkward silence while waiting for an LLM breaks the conversational illusion immediately.',
                                outcome: 'The app plays local filler audio ("Hmm...", "Let me see...") while querying Gemini in the background — latency becomes invisible.',
                            },
                        ].map(({ decision, rationale, outcome }, i) => (
                            <div key={decision} style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                gap: '4rem',
                                padding: '2.5rem 0',
                                borderBottom: '1px solid #1a1a1a',
                                alignItems: 'start',
                            }}>
                                <p style={{ ...figtree, fontWeight: 600, fontSize: '0.9rem', color: '#eaeaea', margin: 0, lineHeight: 1.45 }}>
                                    <span style={{ ...LBL, fontSize: '0.54rem', display: 'block', margin: '0 0 0.6rem', color: '#2e2e2e' }}>
                                        Decision {String(i + 1).padStart(2, '0')}
                                    </span>
                                    {decision}
                                </p>
                                <p style={{ ...figtree, fontSize: '0.875rem', color: '#666', lineHeight: 1.8, margin: 0 }}>
                                    {rationale}
                                </p>
                                <p style={{ ...figtree, fontSize: '0.875rem', color: '#888', lineHeight: 1.8, margin: 0 }}>
                                    → {outcome}
                                </p>
                            </div>
                        ))}
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
                                ...figtree, fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)',
                                fontWeight: 500, color: '#ffffff',
                                lineHeight: 1.35, margin: '0 0 2.5rem',
                                letterSpacing: '-0.02em',
                            }}>
                                The hardest problem wasn't AI — it was binary data crossing the Next.js boundary.
                            </h3>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: '#999', lineHeight: 1.9, margin: '0 0 1.5rem' }}>
                                My first approach was Base64 JSON encoding for audio transport. It bloated memory instantly, blocked the main thread, and caused severe browser lag on recordings longer than thirty seconds. Not viable.
                            </p>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: '#999', lineHeight: 1.9, margin: '0 0 1.5rem' }}>
                                I re-architected the submission pipeline around native <Code>FormData</Code>, directly piping binary objects to array buffers on the server and straight into Supabase Storage — bypassing the JSON layer entirely. The lag disappeared.
                            </p>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: '#999', lineHeight: 1.9, margin: 0 }}>
                                For speech recognition, I combined Google Cloud STT as the primary with an immediate Groq Whisper fallback for accent robustness and zero-downtime failover. Neither the user nor the form creator ever sees the switch happen.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal delay={140}>
                        <div style={{ borderTop: '1px solid #1e1e1e' }}>
                            {[
                                { k: 'Framework', v: 'Next.js 14 (App Router)' },
                                { k: 'AI / LLM', v: 'Gemini 2.5 Flash' },
                                { k: 'STT Primary', v: 'Google Cloud Speech-to-Text' },
                                { k: 'STT Fallback', v: 'Groq Whisper' },
                                { k: 'Database', v: 'Supabase (Postgres + Storage)' },
                                { k: 'Audio transport', v: 'FormData → ArrayBuffer → Supabase' },
                                { k: 'Latency masking', v: 'Local TTS filler + optimistic UI' },
                            ].map(({ k, v }) => (
                                <div key={k} style={{
                                    display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem',
                                    padding: '1.1rem 0', borderBottom: '1px solid #1a1a1a',
                                }}>
                                    <p style={{ ...LBL, fontSize: '0.56rem', margin: 0 }}>{k}</p>
                                    <p style={{ ...figtree, fontSize: '0.82rem', color: '#888', margin: 0, lineHeight: 1.55 }}>{v}</p>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </div>
            <HR />

            {/* FULL-BLEED MEDIA 3 — mobile view or accessibility angle */}
            <Reveal y={10}>
                {/*
                  MEDIA HINT:
                  Show Voca on mobile — the accessibility angle is strong here.
                  A user speaking into their phone, the transcript appearing in real time.
                  Ideal: voca-mobile-view.mp4 or voca-mobile.jpg
                */}
                <Media
                    filename="voca-mobile-view.mp4"
                    aspect="16/7"
                    hint="Mobile view — voice interaction on device"
                />
            </Reveal>

            {/* ══════════════════════════════════════════════════
                IMPACT
            ══════════════════════════════════════════════════ */}
            <div ref={setRef(4)} style={{ padding: `8rem ${PAD}` }}>
                <Reveal><SL>Impact</SL></Reveal>

                {/* Pull quote — the paradigm shift framing */}
                <Reveal delay={60}>
                    <div style={{ margin: '0 0 7rem' }}>
                        <p style={{
                            fontSize: 'clamp(1.8rem, 4.5vw, 3.8rem)',
                            ...serifItalic, color: '#e0e0e0',
                            lineHeight: 1.1, margin: '0 0 1.5rem',
                            letterSpacing: '-0.01em', maxWidth: '24ch',
                        }}>
                            "What was written" is no longer the whole answer.
                        </p>
                        <p style={{ ...LBL, fontSize: '0.58rem', color: '#282828' }}>
                            Form admins now receive structured data alongside source audio — for every response
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
                            {
                                head: 'Accessible by design',
                                body: 'Replaces a typing interface with a conversation. Users who struggle with forms on mobile — or with text input generally — are fully included.',
                            },
                            {
                                head: 'Richer data for creators',
                                body: 'Every response includes both structured JSON and the original audio recording. Context that text boxes permanently destroy is now preserved.',
                            },
                            {
                                head: 'Latency made invisible',
                                body: 'The optimistic UI system means users experience the agent as responsive and human — regardless of backend processing time.',
                            },
                        ].map(({ head, body }, i) => (
                            <div key={head} style={{
                                padding: '2.5rem 2.5rem 2.5rem 0',
                                paddingLeft: i > 0 ? '2.5rem' : '0',
                                borderRight: i < 2 ? '1px solid #1e1e1e' : 'none',
                            }}>
                                <p style={{ ...figtree, fontSize: '1rem', fontWeight: 600, color: '#ffffff', margin: '0 0 0.9rem' }}>{head}</p>
                                <p style={{ ...figtree, fontSize: '0.875rem', color: '#666', lineHeight: 1.8, margin: 0 }}>{body}</p>
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
                        fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)',
                        fontWeight: 500, color: '#e8e8e8',
                        lineHeight: 1.3, margin: '0 0 4.5rem',
                        letterSpacing: '-0.025em', maxWidth: '30ch',
                    }}>
                        Managing state in a conversational UI is as much about psychology as it is about technology.
                    </p>
                </Reveal>

                <Reveal delay={100}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 'clamp(3rem, 6vw, 7rem)',
                        marginBottom: '8rem',
                    }}>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: '#999', lineHeight: 1.9, margin: 0 }}>
                            The latency-masking system was the most revealing part of this build. Users don't need instant backend processing — they need the immediate, human-like signal that they're being heard. A well-timed "Hmm..." does more for trust than a 200ms API response that arrives in silence. The perception of responsiveness matters more than the reality of it.
                        </p>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: '#999', lineHeight: 1.9, margin: 0 }}>
                            The audio retention decision started as a feature, but ended up reframing the entire product. Once I committed to keeping the source recording, Voca stopped being "a better form" and became something closer to an asynchronous interview tool. The data model changed, the admin UI changed, the value proposition changed. One decision can restructure everything downstream.
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
                        <p style={{ ...LBL, fontSize: '0.56rem', margin: '0 0 0.6rem', color: '#262626' }}>Next project</p>
                        {/*
                          UPDATE: Change the label and slug below to your next case study.
                          navigate('/case-study/YOUR_NEXT_SLUG')
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