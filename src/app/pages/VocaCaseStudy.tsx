import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { figtree, serifItalic } from '../utils/constants';
import { useSectionSpy, useScrollVars } from '../case-study/useSectionSpy';
import { PAD, BG, LBL, Reveal, useReveal, SL, HR, ActionLink , CaseStudyChrome } from '../case-study/kit';






// ─── Sidebar Nav ──────────────────────────────────────────────────────────────
const NAV_SECTIONS = ['Problem', 'Thinking', 'Solution', 'Execution', 'Impact', 'Learned'];


// ─── Media placeholder ────────────────────────────────────────────────────────
function Media({ filename, aspect = '16/9', hint, objectFit = 'cover', padding, bgColor = 'var(--cs-media-bg)' }: {
    filename: string; aspect?: string; hint?: string; objectFit?: 'cover' | 'contain' | 'fill';
    padding?: string; bgColor?: string;
}) {
    const isVideo = filename.endsWith('.mp4') || filename.endsWith('.webm');
    const path = `/assets/voca/${filename}`;
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

            {/* Debug/Placeholder Label — only visible while loading or if it fails */}
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
            height: '100%', boxSizing: 'border-box' as const,
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
                color: chosen ? 'var(--cs-fg-strong)' : 'var(--cs-fg-2)', margin: '0 0 1.5rem', lineHeight: 1.3, letterSpacing: '-0.01em'
            }}>
                {label}
            </p>
            <p style={{ ...figtree, fontSize: '0.9rem', color: chosen ? 'var(--cs-fg-2)' : 'var(--cs-fg-faint)', lineHeight: 1.8, margin: 0 }}>
                {rationale}
            </p>
            {chosen && outcome && (
                <p style={{
                    ...figtree, fontSize: '0.85rem', color: 'var(--cs-fg-faint)', lineHeight: 1.75,
                    marginTop: '1.75rem', paddingTop: '1.75rem',
                    borderTop: '1px solid var(--cs-line)', marginBottom: 0,
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
            color: 'var(--cs-fg-2)', fontSize: '0.875em',
            background: 'var(--cs-surface-raised)', padding: '2px 7px', borderRadius: '3px',
        }}>
            {children}
        </code>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function VocaCaseStudy() {
    const navigate = useNavigate();
    const { active: activeNav, setRef, scrollToSection, ids } = useSectionSpy(NAV_SECTIONS);
    useScrollVars();

    const sectionRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null, null]);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Voca | Voice AI Storytelling Platform";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Case study of Voca, an audio-first conversational voice AI that turns standard input into engaging storytelling records.");
        }

    }, []);

    const handleNav = (i: number) => scrollToSection(i);

    return (
        <div style={{ minHeight: '100vh', background: BG, color: 'var(--cs-fg)', ...figtree, overflowX: 'hidden' }}>

            {/* ── Back ── */}
            <CaseStudyChrome name="Voca Form" sections={NAV_SECTIONS} ids={ids} active={activeNav} onNav={handleNav} />

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
                <p style={{ ...LBL, margin: '0 0 2.5rem', animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
                    <span style={{ ...serifItalic, color: 'var(--cs-fg-faint)', fontSize: '1.3em', marginRight: '6px' }}>//</span>
                    Case Study : Voice AI : Web App : 2026
                </p>

                <h1 style={{
                    fontSize: 'clamp(4.5rem, 10vw, 9.5rem)',
                    fontWeight: 500, lineHeight: 0.9,
                    letterSpacing: '-0.04em',
                    margin: '0 0 2.5rem', color: 'var(--cs-fg-strong)',
                    animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.2s both',
                }}>
                    Voca
                </h1>

                <p style={{
                    fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                    color: 'var(--cs-fg-2)', maxWidth: '44ch',
                    lineHeight: 1.65, margin: '0 0 2.5rem', fontWeight: 400,
                    animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.32s both',
                }}>
                    Forms treat users like data-entry clerks, stripping the nuance out of how answers are actually spoken.
                </p>



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
                        { k: 'Role', v: 'Solo : Design & Engineering' },
                        { k: 'Platform', v: 'Web (Next.js 14)' },
                        { k: 'Stack', v: 'Gemini : Groq Whisper : Supabase' },
                        { k: 'Also known as', v: 'Vocaforms' },
                        { k: 'Status', v: 'Building' },
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
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'clamp(5rem, 10vw, 12rem)',
                    alignItems: 'start',
                }}>
                    <Reveal delay={60}>
                        <h2 style={{
                            fontSize: 'clamp(1.8rem, 3.5vw, 2.9rem)',
                            fontWeight: 500, lineHeight: 1.15,
                            color: 'var(--cs-fg-strong)', margin: 0,
                            letterSpacing: '-0.03em',
                        }}>
                            Existing data collection has two separate failure modes: one for users, one for creators.
                        </h2>
                    </Reveal>

                    <Reveal delay={130}>
                        <div>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-2)', lineHeight: 1.9, margin: '0 0 1.5rem' }}>
                                For the user: static HTML forms are rigid, friction-heavy, and assume a baseline of digital literacy that excludes many people, especially on mobile. A person who could give you a fluent, confident verbal answer gets stuck on a text box.
                            </p>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-2)', lineHeight: 1.9, margin: 0 }}>
                                For the creator: text boxes strip vital qualitative context. You cannot gauge a candidate's confidence, clarity, or tone from a polished paragraph, especially one that may have been rewritten by an AI. The audio of the answer is as critical as the words. Every existing tool discards it entirely.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* MEDIA 1 */}
            <Reveal y={10}>
                <div style={{ padding: `0 ${PAD}` }}>
                    <Media
                        filename="voca-desktop.png"
                        aspect="auto"
                        objectFit="contain"
                        bgColor="transparent"
                        hint="Desktop view : voca interface"
                    />
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
                        The shift I needed to make was not a UI improvement: it was a paradigm change. From filling out a form to conducting an interview.
                    </p>
                </Reveal>
            </div>

            {/* Decision cards */}
            <Reveal y={8}>
                <HR />
                <div data-cols="2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', padding: `0 calc(${PAD} - 2.5rem)` }}>
                    {([
                        {
                            index: 'Option 01',
                            label: 'Voice-to-text on standard forms',
                            rationale: 'A band-aid. The user still has to navigate a rigid visual UI : the friction just shifts from typing to microphone management. The mental model does not change.',
                        },
                        {
                            index: 'Option 02',
                            label: 'Purely conversational AI agent',
                            rationale: 'The user speaks naturally. The agent guides them through a narrative flow: no rigid fields, no sequence to manage. It extracts structured data from natural speech.',
                            outcome: 'A user can say "Um, my email is john doe at gmail... oh wait, yahoo" and the AI extracts johndoe@yahoo.com into the database perfectly, without ever making them feel like they answered wrong.',
                            chosen: true,
                        },
                    ] as const).map((card, i) => (
                        <div key={i} style={{ borderRight: i < 1 ? '1px solid var(--cs-line-faint)' : 'none' }}>
                            <DCard {...card} />
                        </div>
                    ))}
                </div>
                <HR />
            </Reveal>

            {/* The forgiveness problem */}
            <div style={{ padding: `6rem ${PAD}` }}>
                <Reveal>
                    <div data-cols="2" style={{
                        display: 'grid',
                        gridTemplateColumns: '160px 1fr',
                        gap: '5rem', alignItems: 'start',
                    }}>
                        <p style={{ ...LBL, fontSize: '0.58rem', margin: '4px 0 0', lineHeight: 1.7, color: 'var(--cs-fg-faint)' }}>
                            The forgiving<br />AI problem
                        </p>
                        <p style={{ ...figtree, fontSize: 'clamp(0.95rem, 1.5vw, 1.08rem)', color: 'var(--cs-fg-2)', lineHeight: 1.88, margin: 0 }}>
                            For this to work, the AI had to be genuinely forgiving. Not just of spelling or grammar, but of how people actually talk: colloquial speech, mid-sentence corrections, code-switching between languages. My audience included Hinglish speakers. The agent had to handle a mix of Hindi and English naturally, extract perfectly structured JSON, and never once make the user feel like they had answered incorrectly. That is a much harder brief than just transcribing speech.
                        </p>
                    </div>
                </Reveal>
            </div>

            {/* MEDIA 2 */}
            <Reveal y={10}>
                <div data-cols="2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 280px))', justifyContent: 'center', gap: '16rem', padding: `0 ${PAD}` }}>
                    <Media
                        filename="voca-form-builder.png"
                        aspect="auto"
                        objectFit="contain"
                        bgColor="transparent"
                        hint="Form builder : creator interface"
                    />
                    <Media
                        filename="voca-admin-dashboard.png"
                        aspect="auto"
                        objectFit="contain"
                        bgColor="transparent"
                        hint="Admin dashboard : audio + structured response"
                    />
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
                        fontWeight: 500, lineHeight: 1.0,
                        color: 'var(--cs-fg-strong)', margin: '0 0 6rem',
                        letterSpacing: '-0.035em', maxWidth: '18ch',
                    }}>
                        A form engine that listens instead of waits.
                    </h2>
                </Reveal>

                <Reveal delay={100}>
                    <div data-cols="2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(4rem, 8vw, 10rem)', marginBottom: '6rem' }}>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-2)', lineHeight: 1.9, margin: 0 }}>
                            The user speaks to an AI agent that guides them through the form as a natural conversation. No fields, no next buttons, no mandatory format. The agent extracts structured data from whatever they say and stores it, alongside the original audio, in real time.
                        </p>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-2)', lineHeight: 1.9, margin: 0 }}>
                            Form creators get a dashboard where every response renders as both a clean data table and a native audio player. The structure is there for analysis. The audio is there for everything a text box cannot capture: confidence, hesitation, tone, authenticity.
                        </p>
                    </div>
                </Reveal>

                {/* Three decisions as a column list */}
                <Reveal delay={80}>
                    <div style={{ borderTop: '1px solid var(--cs-line-faint)' }}>
                        {[
                            {
                                decision: 'Conversational data extraction',
                                rationale: 'Eliminates manual typing and complex regex validation.',
                                outcome: 'Natural speech, corrections, fillers, and all, maps cleanly to structured database fields.',
                            },
                            {
                                decision: 'Retaining the source audio',
                                rationale: 'Captures tonal nuance and confidence the transcript cannot convey.',
                                outcome: 'Every response in the admin dashboard pairs structured text with a native audio player.',
                            },
                            {
                                decision: 'Optimistic UI with local TTS fallbacks',
                                rationale: 'Awkward silence while waiting for an LLM breaks the conversational illusion immediately.',
                                outcome: 'The app plays local filler audio (Hmm..., Let me see...) while querying Gemini in the background, latency becomes invisible.',
                            },
                        ].map(({ decision, rationale, outcome }, i) => (
                            <div data-cols="3" key={decision} style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                gap: '4rem',
                                padding: '2.5rem 0',
                                borderBottom: '1px solid var(--cs-line-faint)',
                                alignItems: 'start',
                            }}>
                                <p style={{ ...figtree, fontWeight: 600, fontSize: '0.9rem', color: 'var(--cs-fg)', margin: 0, lineHeight: 1.45 }}>
                                    <span style={{ ...LBL, fontSize: '0.54rem', display: 'block', margin: '0 0 0.6rem', color: 'var(--cs-fg-faint)' }}>
                                        Decision {String(i + 1).padStart(2, '0')}
                                    </span>
                                    {decision}
                                </p>
                                <p style={{ ...figtree, fontSize: '0.875rem', color: 'var(--cs-fg-2)', lineHeight: 1.8, margin: 0 }}>
                                    {rationale}
                                </p>
                                <p style={{ ...figtree, fontSize: '0.875rem', color: 'var(--cs-fg-2)', lineHeight: 1.8, margin: 0 }}>
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
                                ...figtree, fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)',
                                fontWeight: 500, color: 'var(--cs-fg-strong)',
                                lineHeight: 1.35, margin: '0 0 2.5rem',
                                letterSpacing: '-0.02em',
                            }}>
                                The hardest problem was not AI, it was binary data crossing the Next.js boundary.
                            </h3>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-2)', lineHeight: 1.9, margin: '0 0 1.5rem' }}>
                                My first approach was Base64 JSON encoding for audio transport. It bloated memory instantly, blocked the main thread, and caused severe browser lag on recordings longer than thirty seconds. Not viable.
                            </p>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-2)', lineHeight: 1.9, margin: '0 0 1.5rem' }}>
                                I re-architected the submission pipeline around native <Code>FormData</Code>, directly piping binary objects to array buffers on the server and straight into Supabase Storage, bypassing the JSON layer entirely. The lag disappeared.
                            </p>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-2)', lineHeight: 1.9, margin: 0 }}>
                                For speech recognition, I combined Google Cloud STT as the primary with an immediate Groq Whisper fallback for accent robustness and zero-downtime failover. Neither the user nor the form creator ever sees the switch happen.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal delay={140}>
                        <div style={{ borderTop: '1px solid var(--cs-line-faint)' }}>
                            {[
                                { k: 'Framework', v: 'Next.js 14 (App Router)' },
                                { k: 'AI / LLM', v: 'Gemini 2.5 Flash' },
                                { k: 'STT Primary', v: 'Google Cloud Speech-to-Text' },
                                { k: 'STT Fallback', v: 'Groq Whisper' },
                                { k: 'Database', v: 'Supabase (Postgres + Storage)' },
                                { k: 'Audio transport', v: 'FormData → ArrayBuffer → Supabase' },
                                { k: 'Latency masking', v: 'Local TTS filler + optimistic UI' },
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



            {/* ══════════════════════════════════════════════════
                IMPACT
            ══════════════════════════════════════════════════ */}
            <div ref={setRef(4)} data-cs-section="" style={{ padding: `8rem ${PAD}` }}>
                <Reveal><SL>Impact</SL></Reveal>

                {/* Pull quote : the paradigm shift framing */}
                <Reveal delay={60}>
                    <div style={{ margin: '0 0 7rem' }}>
                        <p style={{
                            fontSize: 'clamp(1.8rem, 4.5vw, 3.8rem)',
                            ...serifItalic, color: 'var(--cs-fg)',
                            lineHeight: 1.1, margin: '0 0 1.5rem',
                            letterSpacing: '-0.01em', maxWidth: '24ch',
                        }}>
                            "What was written" is no longer the whole answer.
                        </p>
                        <p style={{ ...LBL, fontSize: '0.58rem', color: 'var(--cs-fg-faint)' }}>
                            Form admins now receive structured data alongside source audio, for every response
                        </p>
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
                            {
                                head: 'Accessible by design',
                                body: 'Replaces a typing interface with a conversation. Users who struggle with forms on mobile, or with text input generally, are fully included.',
                            },
                            {
                                head: 'Richer data for creators',
                                body: 'Every response includes both structured JSON and the original audio recording. Context that text boxes permanently destroy is now preserved.',
                            },
                            {
                                head: 'Latency made invisible',
                                body: 'The optimistic UI system means users experience the agent as responsive and human, regardless of backend processing time.',
                            },
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
                        fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)',
                        fontWeight: 500, color: 'var(--cs-fg)',
                        lineHeight: 1.3, margin: '0 0 4.5rem',
                        letterSpacing: '-0.025em', maxWidth: '30ch',
                    }}>
                        Managing state in a conversational UI is as much about psychology as it is about technology.
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
                            The latency-masking system was the most revealing part of this build. Users don't need instant backend processing — they need the immediate, human-like signal that they're being heard. A well-timed "Hmm..." does more for trust than a 200ms API response that arrives in silence. The perception of responsiveness matters more than the reality of it.
                        </p>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-2)', lineHeight: 1.9, margin: 0 }}>
                            The audio retention decision started as a feature, but ended up reframing the entire product. Once I committed to keeping the source recording, Voca stopped being "a better form" and became something closer to an asynchronous interview tool. The data model changed, the admin UI changed, the value proposition changed. One decision can restructure everything downstream.
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
                            onClick={() => navigate('/case-study/sportfolio')}
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
                            Sportfolio →
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