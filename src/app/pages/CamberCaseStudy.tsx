import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { figtree, serifItalic } from '../utils/constants';
import { useSectionSpy, useScrollVars } from '../case-study/useSectionSpy';
import { PAD, BG, LBL, Reveal, useReveal, SL, HR, ActionLink , CaseStudyChrome } from '../case-study/kit';
import { StatRow, BeforeAfter } from '../case-study/evidence';
import { EvidenceAudit } from '../case-study/EvidenceAudit';
import { camber } from '../case-study/content/camber';






// ─── Sidebar Nav ──────────────────────────────────────────────────────────────
const NAV_SECTIONS = ['Problem', 'Thinking', 'Solution', 'Execution', 'Impact', 'Learned'];


// ─── Media placeholder ────────────────────────────────────────────────────────
function Media({ filename, aspect = '16/9', hint, objectFit = 'cover', padding, bgColor = 'var(--cs-media-bg)' }: {
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
                    <p style={{ ...LBL, fontSize: '0.55rem', letterSpacing: '0.18em', color: 'var(--cs-line-strong)', margin: 0 }}>
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
            borderTop: chosen ? '1px solid var(--cs-line-strong)' : '1px solid transparent',
            height: '100%',
            boxSizing: 'border-box' as const,
        }}>
            {chosen && (
                <span style={{ ...LBL, fontSize: '0.5rem', position: 'absolute', top: '3.5rem', right: '2.5rem', color: 'var(--cs-fg-3)' }}>
                    CHOSEN
                </span>
            )}
            <p style={{ ...LBL, fontSize: '0.55rem', margin: '0 0 1.25rem', color: chosen ? 'var(--cs-fg-3)' : 'var(--cs-fg-faint)' }}>
                {index}
            </p>
            <p style={{
                ...figtree, fontSize: '1.05rem', fontWeight: 500,
                color: chosen ? 'var(--cs-fg-strong)' : 'var(--cs-fg-2)',
                margin: '0 0 1.5rem', lineHeight: 1.3, letterSpacing: '-0.01em'
            }}>
                {label}
            </p>
            <p style={{ ...figtree, fontSize: '0.9rem', color: chosen ? 'var(--cs-fg-2)' : 'var(--cs-fg-faint)', lineHeight: 1.8, margin: 0 }}>
                {rationale}
            </p>
            {outcome && (
                <p style={{
                    ...figtree, fontSize: '0.85rem', color: 'var(--cs-fg-faint)', lineHeight: 1.75,
                    marginTop: '1.75rem', paddingTop: '1.75rem',
                    borderTop: '1px solid var(--cs-line)', marginBottom: 0,
                }}>
                    <span aria-hidden="true">{chosen ? '→' : '✕'}</span> {outcome}
                </p>
            )}
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function CamberCaseStudy() {
    const navigate = useNavigate();
    const { active: activeNav, setRef, scrollToSection, ids } = useSectionSpy(NAV_SECTIONS);
    useScrollVars();


    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Camber | Minimal macOS Task Manager";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Case study of Camber, a keyboard-driven task manager for macOS designed for extreme speed and a native-like experience.");
        }

    }, []);


    const handleNav = (i: number) => scrollToSection(i);


    return (
        <div style={{ minHeight: '100vh', background: BG, color: 'var(--cs-fg)', ...figtree, overflowX: 'hidden' }}>

            <EvidenceAudit content={camber} />

            {/* ── Back ── */}
            <CaseStudyChrome name="Camber" sections={NAV_SECTIONS} ids={ids} active={activeNav} onNav={handleNav} />

            {/* ══════════════════════════════════════════════════
                HERO
            ══════════════════════════════════════════════════ */}
            <div className="cs-hero" style={{
                height: '100vh',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                padding: `0 ${PAD} min(80px, 7vh)`,
                position: 'relative',
                opacity: 'var(--cs-hero-fade, 1)' as unknown as number,
                transition: 'opacity 0.06s linear',
            }}>
                <div style={{
                    position: 'absolute', top: '-5%', right: '-5%',
                    width: '45vw', height: '55vh',
                    background: 'radial-gradient(ellipse at top right, var(--cs-wash-2) 0%, transparent 60%)',
                    pointerEvents: 'none',
                }} />

                <p style={{ ...LBL, margin: '0 0 2.5rem', animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
                    <span style={{ ...serifItalic, color: 'var(--cs-fg-faint)', fontSize: '1.3em', marginRight: '6px' }}>//</span>
                    Case Study · macOS App · 2026
                </p>

                <h1 style={{
                    fontSize: 'clamp(4rem, 9.5vw, 8.5rem)',
                    fontWeight: 700, lineHeight: 0.9,
                    letterSpacing: '-0.03em',
                    margin: '0 0 2.5rem', color: 'var(--cs-fg-strong)',
                    animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.2s both',
                }}>
                    Camber
                </h1>

                <p style={{
                    fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                    color: 'var(--cs-fg-3)', maxWidth: '44ch',
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
                    opacity: 'calc(var(--cs-hero-fade, 1) * 0.5)' as unknown as number,
                }}>
                    <p className="cs-scroll-hint" style={{ ...LBL, fontSize: '0.54rem', writingMode: 'vertical-rl', color: 'var(--cs-fg-faint)' }}>scroll</p>
                    <div style={{
                        width: '1px', height: '44px',
                        background: 'linear-gradient(to bottom, var(--cs-surface-raised), transparent)',
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
                        { k: 'Site', v: 'camber-app.vercel.app' },
                    ].map(({ k, v }, i, arr) => (
                        <div key={k} style={{
                            flex: '1 0 auto',
                            paddingRight: i < arr.length - 1 ? '3rem' : '0',
                            paddingLeft: i > 0 ? '3rem' : '0',
                            borderRight: i < arr.length - 1 ? '1px solid var(--cs-line-faint)' : 'none',
                        }}>
                            <p style={{ ...LBL, fontSize: '0.56rem', margin: '0 0 0.35rem' }}>{k}</p>
                            <p style={{ ...figtree, fontSize: '0.82rem', color: 'var(--cs-fg-2)', margin: 0 }}>{v}</p>
                        </div>
                    ))}
                </div>
            </Reveal>
            <HR />

            {/* ══════════════════════════════════════════════════
                PROBLEM
            ══════════════════════════════════════════════════ */}
            <div ref={setRef(0)} data-cs-section="" style={{ padding: `8rem ${PAD}` }}>
                <Reveal><SL>The Problem</SL></Reveal>

                <div data-cols="2" style={{
                    display: 'grid',
                    gridTemplateColumns: '1.1fr 0.9fr',
                    gap: 'clamp(4rem, 8vw, 9rem)',
                    alignItems: 'start',
                }}>
                    <Reveal delay={60}>
                        <h2 style={{
                            fontSize: 'clamp(1.8rem, 3.5vw, 2.9rem)',
                            fontWeight: 700, lineHeight: 1.1,
                            color: 'var(--cs-fg-strong)', margin: 0,
                            letterSpacing: '-0.02em',
                        }}>
                            The problem was never a missing feature. It was the psychological cost of opening the app.
                        </h2>
                    </Reveal>

                    <Reveal delay={130}>
                        <div>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-2)', lineHeight: 1.9, margin: '0 0 1.5rem' }}>
                                I've tried every task manager. They all share the same failure mode: they live somewhere else. You're mid-thought, need to log something, and suddenly you're navigating: switching apps, finding the right project, expanding the right list. The thought dulls. Your flow is gone.
                            </p>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-2)', lineHeight: 1.9, margin: 0 }}>
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
            <div ref={setRef(1)} data-cs-section="" style={{ padding: `8rem ${PAD} 0` }}>
                <Reveal><SL>My Thinking</SL></Reveal>

                <Reveal delay={60}>
                    <p style={{
                        ...figtree, fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                        color: 'var(--cs-fg-2)', maxWidth: '54ch', lineHeight: 1.8,
                        margin: '0 0 5rem',
                    }}>
                        The constraint I set: tasks had to be reachable without switching apps, clicking anything, or breaking flow. And they had to feel good to complete — not just useful.
                    </p>
                </Reveal>
            </div>

            {/* Decision cards — full-bleed, inside HR border */}
            <Reveal y={8}>
                <HR />
                <div data-cols="3" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    padding: `0 calc(${PAD} - 2.5rem)`
                }}>
                    {([
                        {
                            index: 'Option 01',
                            label: 'Dashboard app',
                            rationale: 'Requires full context switching. Gets buried behind VS Code the moment you actually start working. Adds to the problem it claims to solve.',
                            outcome: 'Rejected: it reproduces the exact failure mode I was trying to remove.',
                        },
                        {
                            index: 'Option 02',
                            label: 'Menu bar dropdown',
                            rationale: 'Better proximity, but still needs a click, dense navigation, and competes with every other menu bar squatter you already have.',
                            outcome: 'Rejected: closer, but a click is still a decision, and the menu bar is already contested space.',
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
                            borderRight: i < 2 ? '1px solid var(--cs-line-faint)' : 'none',
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
                    <div data-cols="2" style={{
                        display: 'grid',
                        gridTemplateColumns: '160px 1fr',
                        gap: '5rem',
                        alignItems: 'start',
                    }}>
                        <p style={{ ...LBL, fontSize: '0.58rem', margin: '4px 0 0', lineHeight: 1.7, color: 'var(--cs-fg-faint)' }}>
                            The second problem:<br />motivation
                        </p>
                        <p style={{ ...figtree, fontSize: 'clamp(0.95rem, 1.5vw, 1.08rem)', color: 'var(--cs-fg-2)', lineHeight: 1.88, margin: 0 }}>
                            Solving friction wasn't enough. An accessible task list is still just a list. I thought about what actually makes you want to finish something, not obligation, but momentum. Formula 1 has that in every lap. By mapping tasks onto a race, completing a subtask stops being an admin action and starts being physical forward motion. The car moves. The flag gets closer. That loop is motivating in a way a checkbox never is.
                        </p>
                    </div>
                </Reveal>
            </div>

            {/* MEDIA 2 */}
            <Reveal y={10}>
                <div data-cols="2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', padding: `0 ${PAD}` }}>
                    <Media filename="camber-track-view.png" aspect="auto" objectFit="contain" />
                    <Media filename="camber-constructor-select.png" aspect="auto" objectFit="contain" />
                </div>
            </Reveal>

            {/* ══════════════════════════════════════════════════
                SOLUTION
            ══════════════════════════════════════════════════ */}
            <div ref={setRef(2)} data-cs-section="" style={{ padding: `8rem ${PAD}` }}>
                <Reveal><SL>The Solution</SL></Reveal>

                <Reveal delay={60}>
                    <h2 style={{
                        fontSize: 'clamp(2.2rem, 5.5vw, 4.8rem)',
                        fontWeight: 700, lineHeight: 0.95,
                        color: 'var(--cs-fg-strong)', margin: '0 0 5rem',
                        letterSpacing: '-0.028em', maxWidth: '16ch',
                    }}>
                        A task manager that lives inside your display.
                    </h2>
                </Reveal>

                <Reveal delay={100}>
                    <div data-cols="2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem, 6vw, 7rem)' }}>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-2)', lineHeight: 1.9, margin: 0 }}>
                            Hover over the MacBook notch and Camber drops down: an F1 race track rendered inside a minimal popover, with your tasks mapped as cars on constructor-themed lanes. Each subtask you complete advances the car. Finish everything and the car crosses the line.
                        </p>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-2)', lineHeight: 1.9, margin: 0 }}>
                            Move your cursor away and it disappears. No close button, no minimize. It doesn't need to be managed: it just appears when you need it and vanishes when you don't. Constructors serve as project categories. Choosing one isn't just labeling a project, it's a small act of identity.
                        </p>
                    </div>
                </Reveal>
            </div>

            {/* ══════════════════════════════════════════════════
                EXECUTION
            ══════════════════════════════════════════════════ */}
            <HR />
            <div ref={setRef(3)} data-cs-section="" style={{ padding: `6rem ${PAD}` }}>
                <Reveal><SL>Execution</SL></Reveal>

                <div data-cols="2" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 300px',
                    gap: 'clamp(4rem, 6vw, 7rem)',
                    alignItems: 'start',
                }}>
                    <Reveal delay={60}>
                        <div>
                            <h3 style={{
                                ...figtree, fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                                fontWeight: 600, color: 'var(--cs-fg-strong)',
                                lineHeight: 1.3, margin: '0 0 2rem',
                                letterSpacing: '-0.01em',
                            }}>
                                The notch problem macOS doesn't want you to solve.
                            </h3>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-3)', lineHeight: 1.9, margin: '0 0 1.5rem' }}>
                                Apple exposes no public API for notch interaction. To work around this, I built a mouse polling loop using Electron's{' '}
                                <code style={{ color: 'var(--cs-fg-2)', fontSize: '0.875em', background: 'var(--cs-surface-raised)', padding: '2px 7px', borderRadius: '3px' }}>
                                    screen.getCursorScreenPoint()
                                </code>
                                {' '}running every 100ms. When the cursor enters a 200×25px hit zone, it triggers a frameless, transparent{' '}
                                <code style={{ color: 'var(--cs-fg-2)', fontSize: '0.875em', background: 'var(--cs-surface-raised)', padding: '2px 7px', borderRadius: '3px' }}>
                                    BrowserWindow
                                </code>
                                {' '}anchored to the display top.
                            </p>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-3)', lineHeight: 1.9, margin: 0 }}>
                                The trickiest part was the 300ms grace period — without it, the popover flickered every time the cursor passed through. That single timing tweak was the difference between a prototype and something actually usable.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal delay={140}>
                        <div style={{ borderTop: '1px solid var(--cs-line-faint)' }}>
                            {[
                                { k: 'Framework', v: 'Electron + React' },
                                { k: 'JSX', v: 'HTM — no build step' },
                                { k: 'Data', v: 'sql.js · WASM SQLite · local' },
                                { k: 'Trigger', v: '100ms · 200×25px · 300ms grace' },
                                { k: 'Window', v: 'Frameless transparent, top-anchored' },
                                { k: 'Ships as', v: 'Universal binary · GitHub Releases' },
                            ].map(({ k, v }) => (
                                <div data-cols="2" key={k} style={{
                                    display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem',
                                    padding: '1.1rem 0', borderBottom: '1px solid var(--cs-line-faint)',
                                }}>
                                    <p style={{ ...LBL, fontSize: '0.56rem', margin: 0 }}>{k}</p>
                                    <p style={{ ...figtree, fontSize: '0.82rem', color: 'var(--cs-fg-2)', margin: 0, lineHeight: 1.55 }}>{v}</p>
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
            <div ref={setRef(4)} data-cs-section="" style={{ padding: `8rem ${PAD}` }}>
                <Reveal><SL>Impact</SL></Reveal>

                {/* Big pull quote */}
                <Reveal delay={60}>
                    <div style={{ margin: '0 0 7rem' }}>
                        <p style={{
                            fontSize: 'clamp(1.8rem, 4.5vw, 3.8rem)',
                            ...serifItalic, color: 'var(--cs-fg)',
                            lineHeight: 1.1, margin: '0 0 1.5rem',
                            letterSpacing: '-0.01em', maxWidth: '22ch',
                        }}>
                            "The execution deserved a star."
                        </p>
                        <p style={{ ...LBL, fontSize: '0.58rem', color: 'var(--cs-fg-faint)' }}>
                            GitHub user: unsolicited DM
                        </p>
                    </div>
                </Reveal>

                {/* The interaction budget, promoted out of the Execution prose.
                    These three numbers ARE the product thesis — "one motion
                    away, always" is a latency claim — but they were buried in a
                    paragraph while the Impact section carried no figures at all.
                    Surfacing existing facts, not adding new ones. */}
                <Reveal delay={70}>
                    <div style={{ margin: '0 0 5rem' }}>
                        <StatRow stats={[
                            { value: '100ms', label: 'Cursor poll', sub: 'Interval of the mouse-position loop that stands in for the notch API macOS does not expose.' },
                            { value: '200×25', label: 'Hit zone, px', sub: 'The dead strip beside the camera housing — the entire interactive surface.' },
                            { value: '300ms', label: 'Grace period', sub: 'Below this the popover flickered on every pass-through. The difference between a prototype and something usable.' },
                        ]} />
                    </div>
                </Reveal>

                {/* 3 outcomes */}
                <Reveal delay={80}>
                    <div data-cols="3" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        borderTop: '1px solid var(--cs-line-faint)',
                    }}>
                        {[
                            { head: 'Open source', body: 'Published on GitHub. Qualitative feedback over vanity metrics — users reached out directly with unsolicited praise.' },
                            { head: 'Daily use', body: "I use it every day. It solved the problem it was built for — my procrastination habits around tasks visibly shifted." },
                            { head: 'Motivation works', body: 'Users explicitly reported the F1 metaphor helped them finish things, not just log them.' },
                        ].map(({ head, body }, i) => (
                            <div key={head} style={{
                                padding: '2.5rem 2.5rem 2.5rem 0',
                                paddingLeft: i > 0 ? '2.5rem' : '0',
                                borderRight: i < 2 ? '1px solid var(--cs-line-faint)' : 'none',
                            }}>
                                <p style={{ ...figtree, fontSize: '1rem', fontWeight: 600, color: 'var(--cs-fg-strong)', margin: '0 0 0.9rem' }}>{head}</p>
                                <p style={{ ...figtree, fontSize: '0.875rem', color: 'var(--cs-fg-2)', lineHeight: 1.8, margin: 0 }}>{body}</p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>

            {/* ══════════════════════════════════════════════════
                REFLECTION
            ══════════════════════════════════════════════════ */}
            <HR />
            <div ref={setRef(5)} data-cs-section="" style={{ padding: `8rem ${PAD} 0` }}>
                <Reveal><SL>What I Learned</SL></Reveal>

                <Reveal delay={60}>
                    <p style={{
                        fontSize: 'clamp(1.4rem, 2.8vw, 2.3rem)',
                        fontWeight: 600, color: 'var(--cs-fg)',
                        lineHeight: 1.25, margin: '0 0 3.5rem',
                        letterSpacing: '-0.015em', maxWidth: '28ch',
                    }}>
                        Constraints you invent are more interesting than constraints you inherit.
                    </p>
                </Reveal>

                <Reveal delay={100}>
                    <div data-cols="2" style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 'clamp(3rem, 6vw, 7rem)',
                        marginBottom: '8rem',
                    }}>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-2)', lineHeight: 1.9, margin: 0 }}>
                            Every app I'd built before Camber lived inside the rules macOS hands you: windows, menus, sidebars. Camber taught me that the most interesting design decisions happen when you ask where the interface <em>doesn't</em> have to live, not where it should. The notch wasn't in any list of valid surfaces: I only found it because I gave myself permission to be unreasonable first.
                        </p>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-2)', lineHeight: 1.9, margin: 0 }}>
                            Gamification gets a bad reputation because most implementations are cynical: badges nobody wants, streaks that punish you. The F1 metaphor works because it maps onto something real. Progress is spatial. Finishing is physical. If I build another tool with a motivation problem, I'll look for a metaphor that earns its place instead of one that decorates the surface.
                        </p>
                    </div>
                </Reveal>
            </div>

            {/* ══════════════════════════════════════════════════
                FOOTER
            ══════════════════════════════════════════════════ */}
            <HR />
            <div data-cs-footer style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: `3rem ${PAD}`,
            }}>
                <Reveal>
                    <div>
                        <p style={{ ...LBL, fontSize: '0.56rem', margin: '0 0 0.6rem', color: 'var(--text-muted)' }}>Next project</p>
                        <button
                            onClick={() => navigate('/case-study/find-my-repo')}
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
        </div>
    );
}