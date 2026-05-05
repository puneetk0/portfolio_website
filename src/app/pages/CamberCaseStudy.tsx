import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { figtree, serifItalic } from '../utils/constants';

// ─── Scroll reveal ────────────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
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

function Reveal({
    children,
    delay = 0,
    y = 24,
}: {
    children: React.ReactNode;
    delay?: number;
    y?: number;
}) {
    const { ref, visible } = useReveal();
    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0px)' : `translateY(${y}px)`,
                transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

// ─── Shared tokens ────────────────────────────────────────────────────────────
const CONTENT_WIDTH = 'min(680px, calc(100vw - min(284px, 18.8vw)))';
const CONTENT_LEFT = 'min(142px, 9.4vw)';

const label: React.CSSProperties = {
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    letterSpacing: '0.22em',
    color: '#444',
    margin: '0 0 2.5rem',
    ...figtree,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p style={label}>
            <span style={{ ...serifItalic, color: '#333', fontSize: '1.3em', marginRight: '6px' }}>//</span>
            {children}
        </p>
    );
}

function HR() {
    return (
        <div style={{
            width: '100%',
            height: '1px',
            background: 'linear-gradient(90deg, #2a2a2a 0%, transparent 70%)',
            margin: '7rem 0',
        }} />
    );
}

// ─── Decision card ─────────────────────────────────────────────────────────
function DecisionCard({
    index,
    label: cardLabel,
    rationale,
    outcome,
    chosen,
}: {
    index: string;
    label: string;
    rationale: string;
    outcome?: string;
    chosen?: boolean;
}) {
    return (
        <div style={{
            border: chosen ? '1px solid #303030' : '1px solid #1e1e1e',
            padding: '1.75rem',
            position: 'relative',
            background: chosen ? 'rgba(255,255,255,0.018)' : 'transparent',
        }}>
            {chosen && (
                <span style={{
                    position: 'absolute', top: '-1px', right: '1.25rem',
                    background: '#e8e8e8', color: '#141414',
                    fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                    padding: '3px 10px', ...figtree, fontWeight: 600,
                }}>
                    chosen
                </span>
            )}
            <p style={{ fontSize: '0.65rem', color: '#3a3a3a', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 0.4rem', ...figtree }}>
                {index}
            </p>
            <p style={{
                fontSize: '0.95rem', fontWeight: 600,
                color: chosen ? '#ddd' : '#555',
                margin: '0 0 1rem', ...figtree,
            }}>
                {cardLabel}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#555', lineHeight: 1.7, margin: 0, ...figtree }}>
                {rationale}
            </p>
            {chosen && outcome && (
                <p style={{
                    fontSize: '0.82rem', color: '#777', lineHeight: 1.65,
                    borderTop: '1px solid #222', paddingTop: '1rem', margin: '1.25rem 0 0', ...figtree,
                }}>
                    → {outcome}
                </p>
            )}
        </div>
    );
}

// ─── Inline stat row ──────────────────────────────────────────────────────────
function MetaRow({ items }: { items: { k: string; v: string }[] }) {
    return (
        <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '0',
            borderTop: '1px solid #1e1e1e', borderBottom: '1px solid #1e1e1e',
        }}>
            {items.map(({ k, v }, i) => (
                <div key={k} style={{
                    flex: '1 1 160px',
                    padding: '1.5rem 0',
                    borderRight: i < items.length - 1 ? '1px solid #1e1e1e' : 'none',
                    paddingRight: '2rem',
                    paddingLeft: i > 0 ? '2rem' : '0',
                }}>
                    <p style={{ fontSize: '0.65rem', color: '#3a3a3a', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 0.5rem', ...figtree }}>{k}</p>
                    <p style={{ fontSize: '0.9rem', color: '#888', margin: 0, ...figtree }}>{v}</p>
                </div>
            ))}
        </div>
    );
}

// ─── Pull quote ───────────────────────────────────────────────────────────────
function PullQuote({ quote, attribution }: { quote: string; attribution: string }) {
    return (
        <div style={{ borderLeft: '2px solid #eaeaea', paddingLeft: '2rem', margin: '4rem 0' }}>
            <p style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                ...serifItalic, color: '#bbb', lineHeight: 1.55, margin: '0 0 0.75rem',
            }}>
                "{quote}"
            </p>
            <p style={{ fontSize: '0.72rem', color: '#3a3a3a', margin: 0, letterSpacing: '0.15em', textTransform: 'uppercase', ...figtree }}>
                — {attribution}
            </p>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function CamberCaseStudy() {
    const navigate = useNavigate();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const heroOpacity = Math.max(0, 1 - scrollY / 420);

    return (
        <div style={{ minHeight: '100vh', background: '#141414', color: 'white', ...figtree, overflowX: 'hidden' }}>

            {/* ── Back ── */}
            <button
                onClick={() => navigate('/')}
                style={{
                    position: 'fixed', top: '36px', left: CONTENT_LEFT,
                    background: 'transparent', border: 'none', color: '#444',
                    cursor: 'pointer', ...figtree, fontSize: '0.82rem', zIndex: 100,
                    display: 'flex', alignItems: 'center', gap: '8px',
                    transition: 'color 0.25s ease', padding: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#444')}
            >
                ← back
            </button>

            {/* ══════════════════════════════════════════════════
                HERO — typography only, no fake media
            ══════════════════════════════════════════════════ */}
            <div style={{
                height: '100vh', display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-end', padding: `0 ${CONTENT_LEFT} min(88px, 8vh)`,
                position: 'relative',
                opacity: heroOpacity,
                transition: 'opacity 0.08s linear',
            }}>
                {/* Subtle top-left ambient */}
                <div style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '40vw', height: '40vh',
                    background: 'radial-gradient(ellipse at top left, rgba(255,255,255,0.025) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <p style={{
                    ...label, margin: '0 0 2rem',
                    animation: 'lineUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both',
                }}>
                    <span style={{ ...serifItalic, color: '#333', fontSize: '1.3em', marginRight: '6px' }}>//</span>
                    Case Study · macOS App
                </p>

                <h1 style={{
                    fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                    fontWeight: 700, lineHeight: 0.95,
                    margin: '0 0 2rem', letterSpacing: '-0.03em',
                    maxWidth: '12ch',
                    animation: 'lineUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both',
                }}>
                    Camber
                </h1>

                <p style={{
                    fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                    color: '#666', maxWidth: '48ch', lineHeight: 1.65,
                    margin: 0, fontWeight: 400,
                    animation: 'lineUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s both',
                }}>
                    Every task manager promises to reduce friction — then buries itself three clicks deep.
                </p>

                {/* Scroll line */}
                <div style={{
                    position: 'absolute', bottom: '2.5rem', right: CONTENT_LEFT,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                    opacity: heroOpacity,
                }}>
                    <p style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#333', margin: 0, writingMode: 'vertical-rl', ...figtree }}>scroll</p>
                    <div style={{
                        width: '1px', height: '40px',
                        background: 'linear-gradient(to bottom, #333, transparent)',
                        animation: 'scrollPulse 2.2s ease-in-out infinite',
                    }} />
                </div>
            </div>

            {/* ══════════════════════════════════════════════════
                CONTENT
            ══════════════════════════════════════════════════ */}
            <div style={{ padding: `7rem ${CONTENT_LEFT} 0` }}>

                {/* ── Meta ── */}
                <Reveal>
                    <MetaRow items={[
                        { k: 'Role', v: 'Solo — Design & Engineering' },
                        { k: 'Platform', v: 'macOS (Universal)' },
                        { k: 'Stack', v: 'Electron · React · sql.js' },
                        { k: 'Status', v: 'Shipped · Open Source' },
                    ]} />
                </Reveal>

                <HR />

                {/* ── The Problem ── */}
                <section style={{ maxWidth: CONTENT_WIDTH, marginBottom: '8rem' }}>
                    <Reveal>
                        <SectionLabel>The Problem</SectionLabel>
                    </Reveal>

                    <Reveal delay={80}>
                        <h2 style={{
                            fontSize: 'clamp(1.7rem, 3.2vw, 2.6rem)',
                            fontWeight: 600, lineHeight: 1.2,
                            color: '#eaeaea', margin: '0 0 2.5rem',
                            letterSpacing: '-0.015em',
                        }}>
                            The problem was never a missing feature. It was the psychological cost of opening the app in the first place.
                        </h2>
                    </Reveal>

                    <Reveal delay={120}>
                        <p style={{ fontSize: '1rem', color: '#777', lineHeight: 1.85, margin: '0 0 1.5rem' }}>
                            I've tried every task manager. Notion, Things 3, Linear, plain text files. They all share the same failure mode: they live somewhere else. You're in the middle of a thought, you need to log a task, and suddenly you're navigating — switching apps, finding the right project, expanding the right list. By the time you've done that, the thought is less sharp and you've broken your flow.
                        </p>
                        <p style={{ fontSize: '1rem', color: '#777', lineHeight: 1.85, margin: 0 }}>
                            The deeper problem is emotional, not mechanical. When accessing the tool feels like a chore, you subconsciously avoid it. Then you avoid it more. Then it becomes a graveyard of tasks you entered optimistically two weeks ago. The tool stops reflecting reality, and you stop trusting it. That's the loop most productivity apps never break.
                        </p>
                    </Reveal>
                </section>

                <HR />

                {/* ── My Thinking ── */}
                <section style={{ marginBottom: '8rem' }}>
                    <Reveal>
                        <SectionLabel>My Thinking</SectionLabel>
                    </Reveal>

                    <Reveal delay={60}>
                        <p style={{
                            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
                            color: '#999', maxWidth: CONTENT_WIDTH,
                            lineHeight: 1.75, margin: '0 0 4rem',
                        }}>
                            The constraint I set for myself: tasks had to be reachable without switching apps, clicking anything, or breaking focus. And they had to feel good to complete — not just useful.
                        </p>
                    </Reveal>

                    <Reveal delay={80}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '1px',
                            background: '#1a1a1a',
                            marginBottom: '5rem',
                        }}>
                            <DecisionCard
                                index="Option 01"
                                label="Dashboard app"
                                rationale="Requires full context switching. Gets buried behind VS Code the moment you actually start working. Adds to the problem it claims to solve."
                            />
                            <DecisionCard
                                index="Option 02"
                                label="Menu bar dropdown"
                                rationale="Better proximity, but still requires a click, involves navigating dense text, and competes with Spotify, CleanMyMac, and every other menu bar squatter."
                            />
                            <DecisionCard
                                index="Option 03"
                                label="The MacBook notch"
                                rationale="Dead real estate on every modern MacBook. A hover could surface tasks instantly — no click, no navigation, no app switch."
                                outcome="Tasks become one motion away, always. The display itself becomes the interface."
                                chosen
                            />
                        </div>
                    </Reveal>

                    <Reveal delay={60}>
                        <div style={{
                            maxWidth: CONTENT_WIDTH,
                            borderLeft: '1px solid #252525',
                            paddingLeft: '2rem',
                        }}>
                            <p style={{ fontSize: '0.65rem', color: '#3a3a3a', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 1rem', ...figtree }}>
                                The second problem — motivation
                            </p>
                            <p style={{ fontSize: '1rem', color: '#777', lineHeight: 1.85, margin: 0 }}>
                                Solving friction wasn't enough. An accessible task list is still just a list. I thought about what actually makes you want to finish something — not obligation, but momentum. The feeling that progress is visible and the end is near. Formula 1 has that in every single lap. By mapping tasks onto a race, completing a subtask stops being an admin action and starts being physical, forward motion. The car moves. The flag gets closer. That loop is genuinely motivating in a way that a checkbox never is.
                            </p>
                        </div>
                    </Reveal>
                </section>

                <HR />

                {/* ── The Solution ── */}
                <section style={{ maxWidth: CONTENT_WIDTH, marginBottom: '8rem' }}>
                    <Reveal>
                        <SectionLabel>The Solution</SectionLabel>
                    </Reveal>

                    <Reveal delay={60}>
                        <h2 style={{
                            fontSize: 'clamp(1.7rem, 3.2vw, 2.6rem)',
                            fontWeight: 600, lineHeight: 1.2,
                            color: '#eaeaea', margin: '0 0 2.5rem',
                            letterSpacing: '-0.015em',
                        }}>
                            A task manager that lives inside your display — not beside it.
                        </h2>
                    </Reveal>

                    <Reveal delay={100}>
                        <p style={{ fontSize: '1rem', color: '#777', lineHeight: 1.85, margin: '0 0 1.5rem' }}>
                            Hover over the MacBook notch and Camber drops down: an F1 race track rendered inside a minimal popover, with your active tasks mapped as cars on constructor-themed lanes. Each subtask you complete advances the car. Finish everything and the car crosses the line.
                        </p>
                        <p style={{ fontSize: '1rem', color: '#777', lineHeight: 1.85, margin: '0 0 1.5rem' }}>
                            Move your cursor away and it disappears. No close button. No minimize. It doesn't need to be managed — it just appears when you need it and vanishes when you don't. The decision was deliberate: an interface you don't have to maintain is one you'll actually keep using.
                        </p>
                        <p style={{ fontSize: '1rem', color: '#777', lineHeight: 1.85, margin: 0 }}>
                            Constructors (teams) serve as project categories — Ferrari for design work, Mercedes for engineering, Williams for whatever you throw in last minute. Choosing a constructor isn't just labeling a project; it's a small act of identity that makes the whole system feel personal.
                        </p>
                    </Reveal>
                </section>

                <HR />

                {/* ── Execution ── */}
                <section style={{ marginBottom: '8rem' }}>
                    <Reveal>
                        <SectionLabel>Execution</SectionLabel>
                    </Reveal>

                    <div style={{ display: 'grid', gridTemplateColumns: `${CONTENT_WIDTH} 1fr`, gap: '6rem', alignItems: 'start', maxWidth: 'calc(100vw - min(284px, 18.8vw))' }}>
                        <Reveal delay={60}>
                            <div>
                                <h3 style={{
                                    fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)',
                                    fontWeight: 600, color: '#ccc', lineHeight: 1.35,
                                    margin: '0 0 1.5rem', letterSpacing: '-0.01em',
                                }}>
                                    The notch problem macOS doesn't want you to solve.
                                </h3>
                                <p style={{ fontSize: '1rem', color: '#777', lineHeight: 1.85, margin: '0 0 1.5rem' }}>
                                    Apple exposes no public API for notch interaction — it's display real estate the system treats as off-limits. To work around this, I built a mouse polling loop using Electron's <code style={{ color: '#999', fontSize: '0.88em', background: '#1c1c1c', padding: '2px 7px', borderRadius: '3px' }}>screen.getCursorScreenPoint()</code>, running every 100ms. When the cursor enters a 200×25px hit zone mapped exactly to the notch position, it triggers a frameless, transparent <code style={{ color: '#999', fontSize: '0.88em', background: '#1c1c1c', padding: '2px 7px', borderRadius: '3px' }}>BrowserWindow</code> anchored to the top of the display.
                                </p>
                                <p style={{ fontSize: '1rem', color: '#777', lineHeight: 1.85, margin: 0 }}>
                                    The trickiest part was the 300ms grace period — without it, the popover flickered aggressively every time the cursor passed through on its way somewhere else. The grace period holds the window open briefly after the cursor leaves, which makes the whole interaction feel intentional rather than janky. That single timing tweak was the difference between a prototype and something usable.
                                </p>
                            </div>
                        </Reveal>

                        <Reveal delay={120}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                {[
                                    { k: 'Framework', v: 'Electron + React' },
                                    { k: 'JSX Strategy', v: 'HTM — no build step' },
                                    { k: 'Data', v: 'sql.js · in-memory SQLite via WASM · 100% local' },
                                    { k: 'Notch trigger', v: '100ms poll · 200×25px zone · 300ms grace' },
                                    { k: 'Window', v: 'Frameless transparent BrowserWindow, top-anchored' },
                                    { k: 'Distribution', v: 'GitHub Releases · Universal binary' },
                                ].map(({ k, v }, i, arr) => (
                                    <div key={k} style={{
                                        display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '1rem',
                                        padding: '1.25rem 0',
                                        borderBottom: i < arr.length - 1 ? '1px solid #1a1a1a' : 'none',
                                    }}>
                                        <p style={{ fontSize: '0.7rem', color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '0.14em', margin: 0, ...figtree }}>{k}</p>
                                        <p style={{ fontSize: '0.875rem', color: '#777', margin: 0, lineHeight: 1.55 }}>{v}</p>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </div>
                </section>

                <HR />

                {/* ── Impact ── */}
                <section style={{ maxWidth: CONTENT_WIDTH, marginBottom: '8rem' }}>
                    <Reveal>
                        <SectionLabel>Impact</SectionLabel>
                    </Reveal>

                    <Reveal delay={60}>
                        <PullQuote
                            quote="The execution deserved a star."
                            attribution="GitHub user, unsolicited DM"
                        />
                    </Reveal>

                    <Reveal delay={80}>
                        <p style={{ fontSize: '1rem', color: '#777', lineHeight: 1.85, margin: '0 0 1.5rem' }}>
                            Camber is open source and I haven't chased metrics for it. The feedback that mattered came in unsolicited — a DM here, a GitHub comment there, people saying the F1 angle actually made them finish things. That's the signal I cared about: not stars, but whether the core bet (that motivation matters as much as friction) was right.
                        </p>
                        <p style={{ fontSize: '1rem', color: '#777', lineHeight: 1.85, margin: 0 }}>
                            I use Camber every day. That's not me being precious about it — it's the most honest impact metric I have. It solved the problem it was built for. My open tabs are less chaotic. The tasks I log actually get done because checking them off feels like something, not nothing.
                        </p>
                    </Reveal>
                </section>

                <HR />

                {/* ── What I Learned ── */}
                <section style={{ maxWidth: CONTENT_WIDTH, marginBottom: '10rem' }}>
                    <Reveal>
                        <SectionLabel>What I Learned</SectionLabel>
                    </Reveal>

                    <Reveal delay={60}>
                        <h2 style={{
                            fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
                            fontWeight: 500, color: '#999',
                            lineHeight: 1.35, margin: '0 0 2.5rem',
                            letterSpacing: '-0.01em',
                        }}>
                            Constraints you invent are more interesting than constraints you inherit.
                        </h2>
                    </Reveal>

                    <Reveal delay={100}>
                        <p style={{ fontSize: '1rem', color: '#777', lineHeight: 1.85, margin: '0 0 1.5rem' }}>
                            Every app I'd built before Camber lived inside the rules macOS hands you. Windows, menus, sidebars. Camber taught me that the most interesting design decisions happen when you ask where the interface doesn't have to live, not where it should. The notch wasn't in any list of "valid" surfaces. I only considered it because I gave myself permission to be unreasonable about the constraint first.
                        </p>
                        <p style={{ fontSize: '1rem', color: '#777', lineHeight: 1.85, margin: 0 }}>
                            The other thing: gamification gets a bad reputation because most implementations are cynical — badges nobody wants, streaks that punish you for living your life. The F1 metaphor works in Camber because it maps onto something real. Progress is spatial. Finishing is physical. It doesn't feel grafted on. If I build another tool that has a motivation problem, I'll look for a metaphor that earns its place instead of one that decorates the surface.
                        </p>
                    </Reveal>
                </section>

                <HR />

                {/* ── Next / All ── */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                    paddingBottom: '8rem',
                }}>
                    <Reveal>
                        <div>
                            <p style={{ ...label, margin: '0 0 0.75rem' }}>
                                Next project
                            </p>
                            <button
                                onClick={() => navigate('/case-study/vocaforms')}
                                style={{
                                    background: 'transparent', border: 'none', color: '#eaeaea',
                                    fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', fontWeight: 700,
                                    cursor: 'pointer', padding: 0, ...figtree,
                                    letterSpacing: '-0.02em',
                                    transition: 'opacity 0.3s ease',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.opacity = '0.4')}
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
                                background: 'transparent', border: '1px solid #222', color: '#555',
                                padding: '11px 26px', cursor: 'pointer', ...figtree, fontSize: '0.82rem',
                                transition: 'all 0.25s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#eee'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#555'; }}
                        >
                            All projects
                        </button>
                    </Reveal>
                </div>

            </div>

            <style>{`
                @keyframes lineUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes scrollPulse {
                    0%, 100% { opacity: 0.2; }
                    50%       { opacity: 0.7; }
                }
            `}</style>
        </div>
    );
}