import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { figtree, serifItalic } from '../utils/constants';

// ─── Scroll reveal hook ───────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, visible };
}

// ─── Reveal wrapper ───────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 32 }: { children: React.ReactNode; delay?: number; y?: number }) {
    const { ref, visible } = useReveal();
    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0px)' : `translateY(${y}px)`,
                transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p style={{
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: '#444',
            margin: '0 0 2rem',
            ...figtree,
        }}>
            <span style={{ ...serifItalic, color: '#333', fontSize: '1.3em', marginRight: '6px' }}>//</span>
            {children}
        </p>
    );
}

// ─── Horizontal rule ─────────────────────────────────────────────────────────
function HR() {
    return <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, #2a2a2a 0%, transparent 100%)', margin: '6rem 0' }} />;
}

// ─── Decision card ────────────────────────────────────────────────────────────
function DecisionCard({ option, label, rationale, outcome, chosen }: {
    option: string; label: string; rationale: string; outcome: string; chosen?: boolean;
}) {
    return (
        <div style={{
            border: chosen ? '1px solid #2f2f2f' : '1px solid #1e1e1e',
            padding: '2rem',
            position: 'relative',
            background: chosen ? 'rgba(255,255,255,0.02)' : 'transparent',
            transition: 'border-color 0.3s ease',
        }}>
            {chosen && (
                <span style={{
                    position: 'absolute', top: '-1px', right: '1.5rem',
                    background: '#e8e8e8', color: '#141414',
                    fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                    padding: '3px 10px', ...figtree, fontWeight: 600,
                }}>
                    chosen
                </span>
            )}
            <p style={{ fontSize: '0.7rem', color: '#444', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 0.5rem', ...figtree }}>
                {option}
            </p>
            <p style={{ fontSize: '1.05rem', color: chosen ? '#eaeaea' : '#666', fontWeight: 600, margin: '0 0 1.25rem', ...figtree }}>
                {label}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.65, margin: '0 0 1rem', ...figtree }}>
                {rationale}
            </p>
            {chosen && (
                <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: 1.6, borderTop: '1px solid #222', paddingTop: '1rem', margin: 0, ...figtree }}>
                    → {outcome}
                </p>
            )}
        </div>
    );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ borderTop: '1px solid #222', paddingTop: '1.25rem' }}>
            <p style={{ fontSize: '0.7rem', color: '#444', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 0.4rem', ...figtree }}>{label}</p>
            <p style={{ fontSize: '1rem', color: '#aaa', margin: 0, ...figtree, fontWeight: 500 }}>{value}</p>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function CamberCaseStudy() {
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);
    const [heroOpacity, setHeroOpacity] = useState(1);

    // Parallax fade on hero scroll
    useEffect(() => {
        window.scrollTo(0, 0);
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const fade = Math.max(0, 1 - scrollY / 500);
            setHeroOpacity(fade);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#141414', color: 'white', ...figtree, overflowX: 'hidden' }}>

            {/* ── Back button ── */}
            <button
                onClick={() => navigate('/')}
                style={{
                    position: 'fixed', top: '36px', left: 'min(142px, 9.4vw)',
                    background: 'transparent', border: 'none', color: '#555',
                    cursor: 'pointer', ...figtree, fontSize: '0.85rem', zIndex: 100,
                    display: 'flex', alignItems: 'center', gap: '8px',
                    transition: 'color 0.25s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#555')}
            >
                <span style={{ fontSize: '1.1rem' }}>←</span> back
            </button>

            {/* ══════════════════════════════════════════════════════
          HERO — Full viewport, video behind, text over
      ══════════════════════════════════════════════════════ */}
            <div
                ref={heroRef}
                style={{
                    position: 'relative', height: '100vh', width: '100%',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    overflow: 'hidden',
                }}
            >
                {/* Hero media — replace src with actual video */}
                {/*
          MEDIA HINT:
          Replace the div below with:
          <video
            src="/assets/camber/camber-hero.mp4"   ← your hero demo video
            autoPlay muted loop playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35)' }}
          />
          If using a static image instead:
          <img src="/assets/camber/camber-hero.jpg" alt="Camber hero" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35)' }} />
        */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0f0f0f 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    {/* Logo placeholder */}
                    {/*
            MEDIA HINT: Replace this div with:
            <img src="/assets/camber/camber-logo.svg" alt="Camber logo" style={{ width: '80px', opacity: 0.15 }} />
          */}
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '20px',
                        border: '1px solid #2a2a2a', opacity: 0.3,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#555', fontSize: '0.7rem', letterSpacing: '0.1em',
                    }}>
                        LOGO
                    </div>
                </div>

                {/* Bottom gradient fade */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
                    background: 'linear-gradient(to top, #141414 0%, transparent 100%)',
                    pointerEvents: 'none',
                }} />

                {/* Hero text */}
                <div
                    style={{
                        position: 'relative', zIndex: 2,
                        padding: '0 min(142px, 9.4vw) min(80px, 7vh)',
                        opacity: heroOpacity,
                        transition: 'opacity 0.1s linear',
                    }}
                >
                    <p style={{
                        fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.22em',
                        color: '#555', margin: '0 0 1.5rem', ...figtree,
                    }}>
                        <span style={{ ...serifItalic, color: '#444', fontSize: '1.3em', marginRight: '6px' }}>//</span>
                        Case Study · macOS App
                    </p>

                    <h1 style={{
                        fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 700,
                        lineHeight: 1.0, margin: '0 0 1.5rem', letterSpacing: '-0.02em',
                        maxWidth: '14ch',
                    }}>
                        Camber
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1rem, 1.6vw, 1.3rem)', color: '#888',
                        maxWidth: '52ch', lineHeight: 1.6, margin: 0, fontWeight: 400,
                    }}>
                        Traditional to-do lists are productivity traps — opening an app to track your work becomes a task itself.
                    </p>
                </div>

                {/* Scroll indicator */}
                <div style={{
                    position: 'absolute', bottom: '2rem', right: 'min(142px, 9.4vw)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                    opacity: heroOpacity,
                }}>
                    <div style={{
                        width: '1px', height: '48px',
                        background: 'linear-gradient(to bottom, transparent, #444)',
                        animation: 'scrollPulse 2s ease-in-out infinite',
                    }} />
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
          CONTENT — padded container
      ══════════════════════════════════════════════════════ */}
            <div style={{ padding: '8rem min(142px, 9.4vw) 0' }}>

                {/* ── At a Glance ── */}
                <Reveal>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: '2.5rem',
                        marginBottom: '8rem',
                    }}>
                        <StatPill label="Role" value="Solo — Design & Engineering" />
                        <StatPill label="Platform" value="macOS (Universal)" />
                        <StatPill label="Stack" value="Electron · React · sql.js" />
                        <StatPill label="Status" value="Shipped · Open Source" />
                        <StatPill label="Available at" value="camberapp.com" />
                    </div>
                </Reveal>

                <HR />

                {/* ── The Problem ── */}
                <section style={{ marginBottom: '8rem' }}>
                    <Reveal>
                        <SectionLabel>The Problem</SectionLabel>
                    </Reveal>

                    <Reveal delay={80}>
                        <p style={{
                            fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', fontWeight: 600,
                            lineHeight: 1.25, color: '#eaeaea', maxWidth: '22ch',
                            margin: '0 0 3rem', letterSpacing: '-0.01em',
                        }}>
                            The problem wasn't a lack of task managers. It was the psychological barrier of accessing them.
                        </p>
                    </Reveal>

                    <Reveal delay={120}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', maxWidth: '860px' }}>
                            <p style={{ fontSize: '1.05rem', color: '#888', lineHeight: 1.75, margin: 0 }}>
                                Opening an app, finding a list, opening a task, checking a subtask — four steps just to record five seconds of progress. That distance between thought and action breeds procrastination.
                            </p>
                            <p style={{ fontSize: '1.05rem', color: '#888', lineHeight: 1.75, margin: 0 }}>
                                Standard lists are also emotionally flat. When the tool feels like work, you avoid the tool. Existing solutions treated productivity as data entry rather than an engaging loop.
                            </p>
                        </div>
                    </Reveal>
                </section>

                <HR />

                {/* ── My Thinking ── */}
                <section style={{ marginBottom: '8rem' }}>
                    <Reveal>
                        <SectionLabel>My Thinking</SectionLabel>
                    </Reveal>

                    <Reveal delay={80}>
                        <p style={{
                            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: '#aaa',
                            maxWidth: '60ch', lineHeight: 1.7, margin: '0 0 4rem',
                        }}>
                            I needed tasks to be inescapable but unobtrusive. I explored three directions before landing on something no one had used before.
                        </p>
                    </Reveal>

                    <Reveal delay={100}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#1e1e1e', marginBottom: '5rem' }}>
                            <DecisionCard
                                option="Option 01"
                                label="Standard dashboard app"
                                rationale="Requires context switching. Gets buried under VS Code or browser windows the moment you start actually working."
                                outcome=""
                            />
                            <DecisionCard
                                option="Option 02"
                                label="Menu bar dropdown"
                                rationale="Better, but still requires clicking, navigating tiny text, and adds to the existing menu bar clutter most developers already have."
                                outcome=""
                            />
                            <DecisionCard
                                option="Option 03"
                                label="The MacBook Notch"
                                rationale="Dead space on every modern MacBook display. A hover could reveal tasks instantly — no click, no navigation, no friction."
                                outcome="Tasks are always exactly one motion away. Hovering drops the track; moving away hides it."
                                chosen
                            />
                        </div>
                    </Reveal>

                    <Reveal delay={80}>
                        <div style={{
                            borderLeft: '1px solid #2a2a2a', paddingLeft: '2.5rem',
                            maxWidth: '65ch',
                        }}>
                            <p style={{ fontSize: '0.7rem', color: '#444', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 1rem', ...figtree }}>
                                The motivation problem
                            </p>
                            <p style={{ fontSize: '1.1rem', color: '#888', lineHeight: 1.75, margin: 0 }}>
                                Solving friction wasn't enough. The tool still had to feel rewarding. I leaned into a psychological lever: competition. Instead of checking boxes, what if completing tasks felt like a race? By applying a Formula 1 metaphor, the mundane act of finishing a subtask transforms into physical, visible momentum — a car approaching a chequered flag.
                            </p>
                        </div>
                    </Reveal>
                </section>

                <HR />

                {/* ── The Solution ── */}
                <section style={{ marginBottom: '0' }}>
                    <Reveal>
                        <SectionLabel>The Solution</SectionLabel>
                    </Reveal>

                    <Reveal delay={80}>
                        <h2 style={{
                            fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', fontWeight: 700,
                            lineHeight: 1.1, color: '#eaeaea', margin: '0 0 6rem',
                            letterSpacing: '-0.02em', maxWidth: '18ch',
                        }}>
                            A task manager that lives inside your display.
                        </h2>
                    </Reveal>
                </section>
            </div>

            {/* ── Full-bleed media 1 — App in action ── */}
            <Reveal y={16}>
                <div style={{ width: '100%', margin: '0 0 2px', position: 'relative', overflow: 'hidden' }}>
                    {/*
            MEDIA HINT: Replace this placeholder with:
            <video
              src="/assets/camber/camber-notch-demo.mp4"   ← video showing notch hover interaction
              autoPlay muted loop playsInline
              style={{ width: '100%', height: 'auto', display: 'block', filter: 'brightness(0.88)' }}
            />
            OR:
            <img src="/assets/camber/camber-notch-open.jpg" alt="Camber notch open state" style={{ width: '100%', height: 'auto', display: 'block' }} />
          */}
                    <div style={{
                        width: '100%', aspectRatio: '16/9',
                        background: 'linear-gradient(160deg, #1a1a1a 0%, #111 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#333', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', ...figtree,
                    }}>
                        [ camber-notch-demo.mp4 — notch hover interaction video ]
                    </div>
                </div>
            </Reveal>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginBottom: '2px' }}>
                <Reveal y={16}>
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                        {/*
              MEDIA HINT:
              <img src="/assets/camber/camber-track-view.jpg" alt="Camber F1 track view" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            */}
                        <div style={{
                            width: '100%', aspectRatio: '4/3',
                            background: '#111',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#2a2a2a', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', ...figtree,
                        }}>
                            [ camber-track-view.jpg — F1 track UI ]
                        </div>
                    </div>
                </Reveal>
                <Reveal y={16} delay={80}>
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                        {/*
              MEDIA HINT:
              <img src="/assets/camber/camber-constructor-select.jpg" alt="Constructor selection screen" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            */}
                        <div style={{
                            width: '100%', aspectRatio: '4/3',
                            background: '#0f0f0f',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#2a2a2a', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', ...figtree,
                        }}>
                            [ camber-constructor-select.jpg — team/constructor picker ]
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* ── Execution ── */}
            <div style={{ padding: '8rem min(142px, 9.4vw)' }}>
                <section style={{ marginBottom: '8rem' }}>
                    <Reveal>
                        <SectionLabel>Execution</SectionLabel>
                    </Reveal>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'start' }}>
                        <Reveal delay={60}>
                            <div>
                                <p style={{
                                    fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 600,
                                    color: '#eaeaea', lineHeight: 1.3, margin: '0 0 2rem',
                                    letterSpacing: '-0.01em',
                                }}>
                                    The notch problem macOS doesn't want you to solve.
                                </p>
                                <p style={{ fontSize: '1rem', color: '#777', lineHeight: 1.8, margin: 0 }}>
                                    macOS exposes no public API for notch interaction. To bypass this, I engineered a mouse polling loop using Electron's <code style={{ color: '#aaa', fontSize: '0.9em', background: '#1e1e1e', padding: '2px 6px' }}>screen.getCursorScreenPoint()</code> — checking global cursor position every 100ms. When it enters a precise 200×25px hit zone, it triggers a frameless, transparent BrowserWindow anchored to the display top, with a 300ms grace period to prevent flickering.
                                </p>
                            </div>
                        </Reveal>

                        <Reveal delay={120}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {[
                                    { k: 'Framework', v: 'Electron + React (HTM — no build step for JSX)' },
                                    { k: 'Data Layer', v: 'sql.js · in-memory SQLite via WebAssembly. 100% local, zero server.' },
                                    { k: 'Notch Trigger', v: '100ms polling loop · 200×25px hit zone · 300ms grace period' },
                                    { k: 'Window type', v: 'Frameless transparent BrowserWindow · top-anchored' },
                                    { k: 'Distribution', v: 'GitHub Releases · Universal binary (Intel + Apple Silicon)' },
                                ].map(({ k, v }) => (
                                    <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1rem', borderBottom: '1px solid #1e1e1e', paddingBottom: '1.5rem' }}>
                                        <p style={{ fontSize: '0.78rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0, ...figtree }}>{k}</p>
                                        <p style={{ fontSize: '0.9rem', color: '#888', margin: 0, lineHeight: 1.55 }}>{v}</p>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </div>
                </section>

                <HR />

                {/* ── Impact ── */}
                <section style={{ marginBottom: '8rem' }}>
                    <Reveal>
                        <SectionLabel>Impact</SectionLabel>
                    </Reveal>

                    <Reveal delay={60}>
                        {/* Pull quote */}
                        <div style={{
                            borderLeft: '2px solid #eaeaea', paddingLeft: '2.5rem',
                            margin: '0 0 5rem', maxWidth: '55ch',
                        }}>
                            <p style={{
                                fontSize: 'clamp(1.2rem, 2.2vw, 1.7rem)',
                                ...serifItalic, color: '#ccc', lineHeight: 1.5, margin: '0 0 1rem',
                            }}>
                                "The execution deserved a star."
                            </p>
                            <p style={{ fontSize: '0.8rem', color: '#444', margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase', ...figtree }}>
                                — GitHub user, unsolicited DM
                            </p>
                        </div>
                    </Reveal>

                    <Reveal delay={80}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', maxWidth: '860px' }}>
                            <div>
                                <p style={{ fontSize: '2.5rem', fontWeight: 700, color: '#eaeaea', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
                                    Open source
                                </p>
                                <p style={{ fontSize: '0.9rem', color: '#666', margin: 0, lineHeight: 1.6 }}>
                                    Published on GitHub. Qualitative feedback over vanity metrics — users reached out directly.
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '2.5rem', fontWeight: 700, color: '#eaeaea', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
                                    Daily use
                                </p>
                                <p style={{ fontSize: '0.9rem', color: '#666', margin: 0, lineHeight: 1.6 }}>
                                    I use it every day. It solved the problem it was built for — procrastination habits visibly shifted.
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '2.5rem', fontWeight: 700, color: '#eaeaea', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
                                    Gamification
                                </p>
                                <p style={{ fontSize: '0.9rem', color: '#666', margin: 0, lineHeight: 1.6 }}>
                                    Users explicitly reported the F1 metaphor actively helped them get things done.
                                </p>
                            </div>
                        </div>
                    </Reveal>
                </section>

                {/* ── Full-bleed media 2 — website / download page ── */}
            </div>

            <Reveal y={16}>
                <div style={{ width: '100%', marginBottom: '2px' }}>
                    {/*
            MEDIA HINT:
            <img
              src="/assets/camber/camber-website.jpg"    ← screenshot of camberapp.com
              alt="Camber download website"
              style={{ width: '100%', height: 'auto', display: 'block', filter: 'brightness(0.85)' }}
            />
          */}
                    <div style={{
                        width: '100%', aspectRatio: '16/7',
                        background: 'linear-gradient(160deg, #111 0%, #0d0d0d 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#222', fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', ...figtree,
                    }}>
                        [ camber-website.jpg — camberapp.com screenshot ]
                    </div>
                </div>
            </Reveal>

            {/* ── Reflection ── */}
            <div style={{ padding: '8rem min(142px, 9.4vw) 0' }}>
                <section style={{ marginBottom: '10rem' }}>
                    <Reveal>
                        <SectionLabel>What I Learned</SectionLabel>
                    </Reveal>

                    <Reveal delay={80}>
                        <p style={{
                            fontSize: 'clamp(1.3rem, 2.8vw, 2.2rem)', fontWeight: 500,
                            color: '#aaa', lineHeight: 1.45, maxWidth: '28ch',
                            letterSpacing: '-0.01em',
                        }}>
                            The best interfaces sometimes shouldn't look like interfaces at all.
                        </p>
                    </Reveal>

                    <Reveal delay={120}>
                        <p style={{
                            fontSize: '1.05rem', color: '#666', lineHeight: 1.8,
                            maxWidth: '60ch', marginTop: '2rem',
                        }}>
                            Reducing friction isn't just about minimizing clicks — it's about completely changing the user's emotional response to doing the work. By turning a boring utility into a physical race and placing it in an unconventional hardware space, I proved that the container matters as much as the content.
                        </p>
                    </Reveal>
                </section>

                <HR />

                {/* ── Next Project ── */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                    paddingBottom: '8rem',
                }}>
                    <Reveal>
                        <div>
                            <p style={{ fontSize: '0.72rem', color: '#444', letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 1rem', ...figtree }}>
                                Next project
                            </p>
                            {/* 
                Update the name below and the onClick to navigate to your next case study slug 
              */}
                            <button
                                onClick={() => navigate('/case-study/vocaforms')}
                                style={{
                                    background: 'transparent', border: 'none', color: '#eaeaea',
                                    fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700,
                                    cursor: 'pointer', padding: 0, ...figtree,
                                    letterSpacing: '-0.02em',
                                    transition: 'opacity 0.3s ease',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')}
                                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                            >
                                Vocaforms →
                            </button>
                        </div>
                    </Reveal>

                    <Reveal delay={80}>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                background: 'transparent', border: '1px solid #2a2a2a', color: '#666',
                                padding: '12px 28px', cursor: 'pointer', ...figtree, fontSize: '0.85rem',
                                transition: 'all 0.25s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#666'; }}
                        >
                            All projects
                        </button>
                    </Reveal>
                </div>
            </div>

            {/* Scroll pulse animation */}
            <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.2; transform: scaleY(1); }
          50% { opacity: 0.8; transform: scaleY(1.2); }
        }
      `}</style>

        </div>
    );
}