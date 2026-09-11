import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { figtree, serifItalic } from '../utils/constants';
import { useSectionSpy, useScrollVars } from '../case-study/useSectionSpy';
import { PAD, BG, LBL, Reveal, useReveal, SL, HR, ActionLink , CaseStudyChrome } from '../case-study/kit';
import { ArchTiers } from '../case-study/diagrams/ArchTiers';
import { ARCH_DESCRIPTION } from '../case-study/diagrams/sportfolio-arch';


// ─── Tokens ───────────────────────────────────────────────────────────────────



function Code({ children }: { children: React.ReactNode }) {
    return (
        <code style={{
            color: 'var(--text-secondary)', fontSize: '0.875em',
            background: 'var(--border-color)', padding: '2px 7px', borderRadius: '3px',
            fontFamily: 'monospace',
        }}>
            {children}
        </code>
    );
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────
const NAV_SECTIONS = ['Problem', 'Thinking', 'Design', 'Execution', 'Impact', 'Learned'];


// ─── Media ────────────────────────────────────────────────────────────────────
function Media({ filename, aspect = '9/19.5', tall = false }: {
    filename: string; aspect?: string; tall?: boolean;
}) {
    const path = `/assets/sportfolio/${filename}`;
    const isVideo = filename.endsWith('.mp4');

    return (
        <div style={{
            width: '100%',
            aspectRatio: tall ? 'auto' : aspect,
            minHeight: tall ? '520px' : 'auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
        }}>
            {isVideo ? (
                <video src={path} autoPlay muted loop playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
            ) : (
                <img src={path} alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
            )}
        </div>
    );
}

// ─── Design problem card ──────────────────────────────────────────────────────
function ProblemCard({ index, title, body, resolution }: {
    index: string; title: string; body: string; resolution: string;
}) {
    return (
        <div style={{ paddingTop: '2.5rem' }}>
            <p style={{ ...LBL, fontSize: '0.58rem', margin: '0 0 1.25rem', color: 'var(--cs-fg-3)' }}>{index}</p>
            <p style={{ ...figtree, fontSize: '1rem', fontWeight: 600, color: 'var(--cs-fg-strong)', margin: '0 0 1rem', lineHeight: 1.3 }}>
                {title}
            </p>
            <p style={{ ...figtree, fontSize: '0.9rem', color: 'var(--cs-fg-2)', lineHeight: 1.82, margin: '0 0 1.5rem' }}>
                {body}
            </p>
            <p style={{ ...figtree, fontSize: '0.82rem', color: 'var(--cs-fg-3)', lineHeight: 1.75, margin: 0 }}>
                → {resolution}
            </p>
        </div>
    );
}

// ─── Screen label ─────────────────────────────────────────────────────────────
function ScreenLabel({ name, note }: { name: string; note: string }) {
    return (
        <div style={{ padding: '1.5rem 0 0' }}>
            <p style={{ ...figtree, fontSize: '0.82rem', fontWeight: 600, color: 'var(--cs-fg)', margin: '0 0 0.3rem' }}>{name}</p>
            <p style={{ ...LBL, fontSize: '0.58rem', color: 'var(--cs-fg-3)' }}>{note}</p>
        </div>
    );
}

// ─── Architecture SVG diagram ─────────────────────────────────────────────────
function ArchDiagram() {
    // Monochrome, minimal; colours come from the --cs-* token layer
    // Layout: Client tier left, Gateway center, Services right column, DB bottom-right
    const font = "'Figtree', sans-serif";
    const mono = "monospace";

    return (
        <>
                        <div className="cs-diagram"><svg
            role="img" aria-label="Sportfolio system architecture" viewBox="0 0 960 480"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: 'auto', display: 'block' }}
        >
                            <title>Sportfolio system architecture</title>
                            <desc>{ARCH_DESCRIPTION}</desc>
            {/* ── Defs ── */}
            <defs>
                <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="var(--cs-fg-faint)" />
                </marker>
                <marker id="arr-active" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="var(--cs-fg-3)" />
                </marker>
                {/* Glow for the WebSocket pulse */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>

            {/* ── Background grid — very subtle ── */}
            <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--cs-line-faint)" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect width="960" height="480" fill="url(#grid)" />

            {/* ════════════════════════════════════════
                TIER LABELS
            ════════════════════════════════════════ */}
            <text x="90" y="32" fontFamily={font} fontSize="8" fill="var(--cs-fg-faint)" letterSpacing="3" textAnchor="middle">CLIENT</text>
            <text x="340" y="32" fontFamily={font} fontSize="8" fill="var(--cs-fg-faint)" letterSpacing="3" textAnchor="middle">GATEWAY</text>
            <text x="640" y="32" fontFamily={font} fontSize="8" fill="var(--cs-fg-faint)" letterSpacing="3" textAnchor="middle">SERVICES</text>
            <text x="870" y="32" fontFamily={font} fontSize="8" fill="var(--cs-fg-faint)" letterSpacing="3" textAnchor="middle">PERSISTENCE</text>

            {/* Tier dividers */}
            <line x1="185" y1="20" x2="185" y2="460" stroke="var(--cs-line-faint)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="470" y1="20" x2="470" y2="460" stroke="var(--cs-line-faint)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="770" y1="20" x2="770" y2="460" stroke="var(--cs-line-faint)" strokeWidth="1" strokeDasharray="4 4" />

            {/* ════════════════════════════════════════
                CLIENT — React SPA
            ════════════════════════════════════════ */}
            {/* Main React box */}
            <rect x="20" y="60" width="140" height="52" rx="2" fill="var(--cs-media-bg)" stroke="var(--cs-line)" strokeWidth="1" />
            <text x="90" y="82" fontFamily={font} fontSize="9.5" fontWeight="600" fill="var(--cs-fg)" textAnchor="middle">React 18 SPA</text>
            <text x="90" y="98" fontFamily={mono} fontSize="7.5" fill="var(--cs-fg-3)" textAnchor="middle">TypeScript · Tailwind · RHF</text>

            {/* Sub-boxes: Price Context, TanStack Query */}
            <rect x="20" y="130" width="66" height="36" rx="2" fill="var(--cs-media-bg)" stroke="var(--cs-line-faint)" strokeWidth="1" />
            <text x="53" y="145" fontFamily={font} fontSize="7.5" fill="var(--cs-fg-3)" textAnchor="middle">Price Context</text>
            <text x="53" y="158" fontFamily={mono} fontSize="6.5" fill="var(--cs-fg-faint)" textAnchor="middle">rAF batching</text>

            <rect x="94" y="130" width="66" height="36" rx="2" fill="var(--cs-media-bg)" stroke="var(--cs-line-faint)" strokeWidth="1" />
            <text x="127" y="145" fontFamily={font} fontSize="7.5" fill="var(--cs-fg-3)" textAnchor="middle">TanStack Query</text>
            <text x="127" y="158" fontFamily={mono} fontSize="6.5" fill="var(--cs-line-strong)" textAnchor="middle">server state</text>

            {/* Charts */}
            <rect x="20" y="182" width="140" height="36" rx="2" fill="var(--cs-media-bg)" stroke="var(--cs-line-faint)" strokeWidth="1" />
            <text x="90" y="197" fontFamily={font} fontSize="7.5" fill="var(--cs-fg-3)" textAnchor="middle">Recharts + D3.js</text>
            <text x="90" y="210" fontFamily={mono} fontSize="6.5" fill="var(--cs-fg-faint)" textAnchor="middle">price charts · sparklines</text>

            {/* WebSocket client */}
            <rect x="20" y="234" width="140" height="36" rx="2" fill="var(--cs-media-bg)" stroke="var(--cs-line)" strokeWidth="1" />
            <text x="90" y="249" fontFamily={font} fontSize="7.5" fill="var(--cs-fg-2)" textAnchor="middle" filter="url(#glow)">WS Client</text>
            <text x="90" y="262" fontFamily={mono} fontSize="6.5" fill="var(--cs-fg-3)" textAnchor="middle">live price subscriptions</text>

            {/* Connector: React to sub-boxes */}
            <line x1="90" y1="112" x2="53" y2="130" stroke="var(--cs-line-faint)" strokeWidth="1" markerEnd="url(#arr)" />
            <line x1="90" y1="112" x2="127" y2="130" stroke="var(--cs-line-faint)" strokeWidth="1" markerEnd="url(#arr)" />
            <line x1="90" y1="112" x2="90" y2="182" stroke="var(--cs-line-faint)" strokeWidth="1" markerEnd="url(#arr)" />
            <line x1="90" y1="112" x2="90" y2="234" stroke="var(--cs-line-faint)" strokeWidth="1" markerEnd="url(#arr)" />

            {/* ════════════════════════════════════════
                GATEWAY — FastAPI
            ════════════════════════════════════════ */}
            <rect x="210" y="60" width="240" height="52" rx="2" fill="var(--cs-media-bg)" stroke="var(--cs-line)" strokeWidth="1" />
            <text x="330" y="82" fontFamily={font} fontSize="9.5" fontWeight="600" fill="var(--cs-fg)" textAnchor="middle">FastAPI</text>
            <text x="330" y="98" fontFamily={mono} fontSize="7.5" fill="var(--cs-fg-3)" textAnchor="middle">async · JWT · slowapi · Pydantic v2</text>

            {/* Route groups */}
            {[
                { label: '/auth', sub: 'register · login · me', y: 130 },
                { label: '/players', sub: 'list · detail · price-history', y: 172 },
                { label: '/trade', sub: 'buy · sell', y: 214 },
                { label: '/portfolio', sub: 'holdings · txns · wallet', y: 256 },
                { label: '/admin', sub: 'retrain · audit · simulate', y: 298 },
            ].map(({ label, sub, y }) => (
                <g key={label}>
                    <rect x="210" y={y} width="240" height="34" rx="2" fill="var(--cs-media-bg)" stroke="var(--cs-line-faint)" strokeWidth="1" />
                    <text x="225" y={y + 14} fontFamily={mono} fontSize="8" fill="var(--cs-fg-faint)">{label}</text>
                    <text x="225" y={y + 26} fontFamily={font} fontSize="7" fill="var(--cs-fg-faint)">{sub}</text>
                </g>
            ))}

            {/* WS endpoint — highlighted */}
            <rect x="210" y="340" width="240" height="34" rx="2" fill="var(--cs-media-bg)" stroke="var(--cs-line)" strokeWidth="1" />
            <text x="225" y="354" fontFamily={mono} fontSize="8" fill="var(--cs-fg-faint)">WS /ws/prices</text>
            <text x="225" y="366" fontFamily={font} fontSize="7" fill="var(--cs-fg-3)">global + per-athlete subscriptions</text>

            {/* Arrow from client to FastAPI */}
            <line x1="160" y1="86" x2="210" y2="86" stroke="var(--cs-line)" strokeWidth="1" markerEnd="url(#arr-active)" />
            <text x="185" y="82" fontFamily={mono} fontSize="6.5" fill="var(--cs-line)" textAnchor="middle">HTTP</text>

            {/* WS bi-directional */}
            <line x1="160" y1="252" x2="210" y2="357" stroke="var(--cs-line)" strokeWidth="1" strokeDasharray="3 3" markerEnd="url(#arr-active)" />
            <text x="178" y="318" fontFamily={mono} fontSize="6" fill="var(--cs-line)" transform="rotate(-28 178 318)">WebSocket</text>

            {/* ════════════════════════════════════════
                SERVICES — right column
            ════════════════════════════════════════ */}
            {/* Price Engine */}
            <rect x="495" y="60" width="260" height="64" rx="2" fill="var(--cs-media-bg)" stroke="var(--cs-line-strong)" strokeWidth="1" />
            <text x="625" y="80" fontFamily={font} fontSize="9" fontWeight="600" fill="var(--cs-fg)" textAnchor="middle">Price Engine</text>
            <text x="625" y="96" fontFamily={mono} fontSize="7" fill="var(--cs-fg-3)" textAnchor="middle">PS = w₁·actual + w₂·consistency + w₃·growth + w₄·AI</text>
            <text x="625" y="113" fontFamily={mono} fontSize="7" fill="var(--cs-fg-faint)" textAnchor="middle">P_final = η·(FV×DI) + (1−η)·P_old   η=0.6</text>

            {/* Sport engines */}
            {[
                { label: 'cricket_performance.py', x: 495 },
                { label: 'swimming_performance.py', x: 625 },
                { label: 'wrestling_performance.py', x: 755 },
            ].map(({ label, x }, i) => (
                <g key={label}>
                    <rect x={495 + i * 90} y="142" width="84" height="40" rx="2" fill="var(--cs-media-bg)" stroke="var(--cs-line-faint)" strokeWidth="1" />
                    <text x={495 + i * 90 + 42} y="159" fontFamily={mono} fontSize="6" fill="var(--cs-line-strong)" textAnchor="middle">{label.split('_')[0]}</text>
                    <text x={495 + i * 90 + 42} y="172" fontFamily={font} fontSize="6.5" fill="var(--cs-fg-faint)" textAnchor="middle">sport scoring</text>
                    <line x1={495 + i * 90 + 42} y1="124" x2={495 + i * 90 + 42} y2="142" stroke="var(--cs-line-faint)" strokeWidth="1" markerEnd="url(#arr)" />
                </g>
            ))}

            {/* Trading Engine */}
            <rect x="495" y="202" width="124" height="40" rx="2" fill="var(--cs-media-bg)" stroke="var(--cs-line-faint)" strokeWidth="1" />
            <text x="557" y="218" fontFamily={font} fontSize="8" fill="var(--cs-fg-faint)" textAnchor="middle">Trading Engine</text>
            <text x="557" y="232" fontFamily={mono} fontSize="6.5" fill="var(--cs-fg-3)" textAnchor="middle">buy · sell · supply</text>

            {/* Dividend Engine */}
            <rect x="631" y="202" width="124" height="40" rx="2" fill="var(--cs-media-bg)" stroke="var(--cs-line-faint)" strokeWidth="1" />
            <text x="693" y="218" fontFamily={font} fontSize="8" fill="var(--cs-fg-faint)" textAnchor="middle">Dividend Engine</text>
            <text x="693" y="232" fontFamily={mono} fontSize="6.5" fill="var(--cs-fg-3)" textAnchor="middle">DDPS · time-weighted</text>

            {/* ML / AI */}
            <rect x="495" y="262" width="260" height="52" rx="2" fill="var(--cs-media-bg)" stroke="var(--cs-line)" strokeWidth="1" />
            <text x="625" y="281" fontFamily={font} fontSize="8.5" fontWeight="600" fill="var(--cs-fg-2)" textAnchor="middle">ML Ensemble</text>
            <text x="625" y="296" fontFamily={mono} fontSize="7" fill="var(--cs-fg-3)" textAnchor="middle">XGBoost + LSTM   λ₁·XGB + λ₂·LSTM</text>
            <text x="625" y="308" fontFamily={font} fontSize="7" fill="var(--cs-fg-faint)" textAnchor="middle">APScheduler · retrain on demand</text>

            {/* APScheduler / Cron */}
            <rect x="495" y="334" width="124" height="40" rx="2" fill="var(--cs-media-bg)" stroke="var(--cs-line-faint)" strokeWidth="1" />
            <text x="557" y="350" fontFamily={font} fontSize="8" fill="var(--cs-fg-faint)" textAnchor="middle">APScheduler</text>
            <text x="557" y="364" fontFamily={mono} fontSize="6.5" fill="var(--cs-fg-faint)" textAnchor="middle">cron · score updates</text>

            {/* WS Manager */}
            <rect x="631" y="334" width="124" height="40" rx="2" fill="var(--cs-media-bg)" stroke="var(--cs-line)" strokeWidth="1" />
            <text x="693" y="350" fontFamily={font} fontSize="8" fill="var(--cs-fg-3)" textAnchor="middle" filter="url(#glow)">WS Manager</text>
            <text x="693" y="364" fontFamily={mono} fontSize="6.5" fill="var(--cs-fg-3)" textAnchor="middle">broadcast · fan-out</text>

            {/* Arrows: Gateway to Services */}
            <line x1="450" y1="86" x2="495" y2="86" stroke="var(--cs-line)" strokeWidth="1" markerEnd="url(#arr-active)" />
            <line x1="450" y1="219" x2="495" y2="219" stroke="var(--cs-line-faint)" strokeWidth="1" markerEnd="url(#arr)" />
            <line x1="450" y1="231" x2="495" y2="231" stroke="var(--cs-line-faint)" strokeWidth="1" markerEnd="url(#arr)" />
            <line x1="450" y1="280" x2="495" y2="280" stroke="var(--cs-line-faint)" strokeWidth="1" markerEnd="url(#arr)" />

            {/* WS Manager feeds back to Gateway WS */}
            <path d="M693,374 L693,410 L450,410 L450,357 L450,357" fill="none" stroke="var(--cs-line)" strokeWidth="1" strokeDasharray="3 3" markerEnd="url(#arr-active)" />

            {/* ════════════════════════════════════════
                PERSISTENCE — MongoDB
            ════════════════════════════════════════ */}
            <rect x="790" y="60" width="150" height="52" rx="2" fill="var(--cs-media-bg)" stroke="var(--cs-line)" strokeWidth="1" />
            <text x="865" y="80" fontFamily={font} fontSize="9" fontWeight="600" fill="var(--cs-fg-2)" textAnchor="middle">MongoDB</text>
            <text x="865" y="96" fontFamily={mono} fontSize="7" fill="var(--cs-fg-3)" textAnchor="middle">Motor async driver</text>

            {/* Collections */}
            {[
                'users · holdings',
                'players · price_history',
                'transactions · income',
                'watchlists · alerts',
            ].map((col, i) => (
                <g key={col}>
                    <rect x="790" y={128 + i * 44} width="150" height="34" rx="2" fill="var(--cs-media-bg)" stroke="var(--cs-line-faint)" strokeWidth="1" />
                    <text x="865" y={128 + i * 44 + 21} fontFamily={mono} fontSize="7" fill="var(--cs-fg-3)" textAnchor="middle">{col}</text>
                </g>
            ))}

            {/* Arrows: Services to MongoDB */}
            <line x1="755" y1="88" x2="790" y2="88" stroke="var(--cs-line)" strokeWidth="1" markerEnd="url(#arr)" />
            <line x1="755" y1="220" x2="790" y2="220" stroke="var(--cs-line-faint)" strokeWidth="1" markerEnd="url(#arr)" />
            <line x1="755" y1="285" x2="790" y2="285" stroke="var(--cs-line-faint)" strokeWidth="1" markerEnd="url(#arr)" />

            {/* ── Legend ── */}
            <g transform="translate(20, 430)">
                <line x1="0" y1="8" x2="20" y2="8" stroke="var(--cs-line)" strokeWidth="1" markerEnd="url(#arr-active)" />
                <text x="26" y="12" fontFamily={font} fontSize="7" fill="var(--cs-fg-3)">HTTP / service call</text>
                <line x1="120" y1="8" x2="140" y2="8" stroke="var(--cs-fg-3)" strokeWidth="1" strokeDasharray="3 3" markerEnd="url(#arr-active)" />
                <text x="146" y="12" fontFamily={font} fontSize="7" fill="var(--cs-fg-3)">WebSocket</text>
                <rect x="240" y="2" width="10" height="10" rx="1" fill="var(--cs-media-bg)" stroke="var(--cs-line-strong)" strokeWidth="1" />
                <text x="256" y="12" fontFamily={font} fontSize="7" fill="var(--cs-fg-3)">primary system</text>
                <rect x="350" y="2" width="10" height="10" rx="1" fill="var(--cs-media-bg)" stroke="var(--cs-line-faint)" strokeWidth="1" />
                <text x="366" y="12" fontFamily={font} fontSize="7" fill="var(--cs-fg-3)">sub-component</text>
            </g>
        </svg></div>
                        <ArchTiers />
                        </>
    );
}

// ─── Equation block ───────────────────────────────────────────────────────────
function Equation({ label, formula, note }: { label: string; formula: string; note: string }) {
    return (
        <div style={{
            padding: '1.5rem 2.5rem',
            background: 'var(--cs-media-bg)',
            borderLeft: '1px solid var(--cs-line)',
        }}>
            <p style={{ ...LBL, fontSize: '0.54rem', margin: '0 0 0.75rem', color: 'var(--cs-fg-3)' }}>{label}</p>
            <p style={{
                fontFamily: 'monospace', fontSize: '0.88rem',
                color: 'var(--cs-fg-2)', margin: '0 0 0.6rem', lineHeight: 1.5,
                letterSpacing: '0.02em',
            }}>
                {formula}
            </p>
            <p style={{ ...figtree, fontSize: '0.78rem', color: 'var(--cs-fg-3)', margin: 0, lineHeight: 1.6 }}>
                {note}
            </p>
        </div>
    );
}

// ─── Frontend decision row ────────────────────────────────────────────────────
function DecisionRow({ decision, why, tag }: { decision: string; why: string; tag: string }) {
    return (
        <div data-cols="3" style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 1.4fr',
            gap: '2rem',
            padding: '1.4rem 0',
            borderBottom: '1px solid var(--cs-line-faint)',
            alignItems: 'start',
        }}>
            <p style={{ ...LBL, fontSize: '0.54rem', color: 'var(--cs-fg-3)', margin: 0, paddingTop: '2px' }}>{tag}</p>
            <p style={{ ...figtree, fontSize: '0.875rem', fontWeight: 600, color: 'var(--cs-fg)', margin: 0, lineHeight: 1.4 }}>
                {decision}
            </p>
            <p style={{ ...figtree, fontSize: '0.82rem', color: 'var(--cs-fg-3)', margin: 0, lineHeight: 1.65 }}>
                {why}
            </p>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function SportfolioCaseStudy() {
    const navigate = useNavigate();
    const { active: activeNav, setRef, scrollToSection, ids } = useSectionSpy(NAV_SECTIONS);
    useScrollVars();

    const sectionRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null, null]);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Sportfolio | Real-Time Fintech Trading Platform";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Case study of Sportfolio, a fintech fan-engagement trading market combining sports performance metrics with financial stock market mechanics.");
        }

    }, []);

    const handleNav = (i: number) => scrollToSection(i);

    return (
        <div style={{ minHeight: '100vh', background: BG, color: 'var(--cs-fg)', ...figtree, overflowX: 'hidden' }}>

            {/* ── Back ── */}
            <CaseStudyChrome name="Sportfolio" sections={NAV_SECTIONS} ids={ids} active={activeNav} onNav={handleNav} />

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
                    width: '50vw', height: '60vh',
                    background: 'radial-gradient(ellipse at top right, var(--cs-wash-2) 0%, transparent 65%)',
                    pointerEvents: 'none',
                }} />

                <p style={{ ...LBL, margin: '0 0 2.5rem', animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
                    <span style={{ ...serifItalic, color: 'var(--cs-fg-3)', fontSize: '1.3em', marginRight: '6px' }}>//</span>
                    Case Study · Fintech · Hackathon · 2026
                </p>

                <h1 style={{
                    fontSize: 'clamp(3.8rem, 9vw, 8rem)',
                    fontWeight: 700, lineHeight: 0.92,
                    letterSpacing: '-0.03em',
                    margin: '0 0 2.5rem', color: 'var(--cs-fg-strong)',
                    animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.2s both',
                }}>
                    Sportfolio
                </h1>

                <p style={{
                    fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                    color: 'var(--cs-fg-3)', maxWidth: '46ch',
                    lineHeight: 1.65, margin: 0, fontWeight: 400,
                    animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.32s both',
                }}>
                    Fans watch grassroots athletes every weekend. They have opinions, instincts, and conviction. They have no way to act on any of it.
                </p>

                <div style={{
                    position: 'absolute', bottom: '2.5rem', right: PAD,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                    opacity: 'calc(var(--cs-hero-fade, 1) * 0.5)' as unknown as number,
                }}>
                    <p className="cs-scroll-hint" style={{ ...LBL, fontSize: '0.54rem', writingMode: 'vertical-rl', color: 'var(--cs-fg-3)' }}>scroll</p>
                    <div style={{
                        width: '1px', height: '44px',
                        background: 'linear-gradient(to bottom, var(--cs-fg-3), transparent)',
                        animation: 'pulse 2.4s ease-in-out infinite',
                    }} />
                </div>
            </div>

            {/* META STRIP */}
            <HR />
            <Reveal>
                <div style={{ display: 'flex', padding: `1.75rem ${PAD}`, overflowX: 'auto', gap: 0 }}>
                    {[
                        { k: 'My Role', v: 'Design · Frontend' },
                        { k: 'Team', v: 'Abhinav · Satvik' },
                        { k: 'Stack', v: 'React · TypeScript · Tailwind' },
                        { k: 'Context', v: 'Hackathon' },
                        { k: 'Status', v: 'Shipped' },
                    ].map(({ k, v }, i, arr) => (
                        <div key={k} style={{
                            flex: '1 0 auto',
                            paddingRight: i < arr.length - 1 ? '3rem' : '0',
                            paddingLeft: i > 0 ? '3rem' : '0',
                            borderRight: i < arr.length - 1 ? '1px solid var(--cs-line-faint)' : 'none',
                        }}>
                            <p style={{ ...LBL, fontSize: '0.56rem', margin: '0 0 0.35rem' }}>{k}</p>
                            <p style={{ ...figtree, fontSize: '0.82rem', color: 'var(--cs-fg-3)', margin: 0 }}>{v}</p>
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
                            The financial gap in grassroots sports isn't a funding problem. It's a structure problem.
                        </h2>
                    </Reveal>

                    <Reveal delay={130}>
                        <div>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-3)', lineHeight: 1.9, margin: '0 0 1.5rem' }}>
                                Early-stage athletes need capital before they have the track record to attract it. Crowdfunding asks people to donate with no upside. Betting cuts the athlete out entirely. Corporate sponsorships don't exist at this level. The existing options either exploit the athlete or ignore the fan.
                            </p>
                            <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-3)', lineHeight: 1.9, margin: 0 }}>
                                We saw a different framing: fans at local cricket leagues and wrestling matches already have conviction about specific athletes. They spot talent early, they track performance week to week, and they have no financial stake in being right. Sportfolio turns that conviction into a real position. Buy fractional shares of an athlete, earn dividends when they do, and watch the value of your read on them compound over time.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* MEDIA — hoisted out of the showcase so the Problem section has a
                visual break. The marketplace screen IS the problem statement:
                this is the thing fans had no way to act on. */}
            <Reveal y={10}>
                <div style={{ padding: `0 ${PAD}` }}>
                    <div style={{ width: 'min(320px, 100%)', margin: '0 auto' }}>
                        <Media filename="marketplace.png" />
                        <ScreenLabel name="Marketplace" note="Where conviction becomes a position" />
                    </div>
                </div>
            </Reveal>

            {/* ══════════════════════════════════════════════════
                THINKING
            ══════════════════════════════════════════════════ */}
            <div ref={setRef(1)} data-cs-section="" style={{ padding: `8rem ${PAD} 0` }}>
                <Reveal><SL>My Thinking</SL></Reveal>

                <Reveal delay={60}>
                    <p style={{
                        ...figtree,
                        fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                        color: 'var(--cs-fg-3)', maxWidth: '54ch', lineHeight: 1.8,
                        margin: '0 0 5rem',
                    }}>
                        The backend was being built in parallel. My constraint was sharper: how do you design a financial product that feels alive, not rigid, and makes a fan trust it with real money?
                    </p>
                </Reveal>
            </div>

            <Reveal y={8}>
                <div style={{ padding: `0 ${PAD}` }}>
                    <HR />
                    <div data-cols="3" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1px',
                        background: 'var(--cs-surface-raised)',
                    }}>
                        {[
                            {
                                index: 'Problem 01',
                                title: 'Financial UIs feel dead by default.',
                                body: 'Most fintech products look like spreadsheets wrapped in dark mode. Numbers without context. Charts without narrative. They work, but they give you no reason to care about what you\'re looking at.',
                                resolution: 'I led with identity. Every athlete has a card that feels like a trading card, not a data row. The price is there, but so is the sport, the face, the recent form. You\'re investing in a person, and the UI has to reflect that.',
                            },
                            {
                                index: 'Problem 02',
                                title: 'What do you actually show about a player?',
                                body: 'Investors and fans need different things. A fan wants feel and momentum. An investor wants trend, consistency, and risk. The athlete detail page had to serve both without overwhelming either.',
                                resolution: 'I split the page into two reading modes: headline view with performance score and price chart at the top, deeper stats below the fold for people who want to go further.',
                            },
                            {
                                index: 'Problem 03',
                                title: 'How do you make a live market feel real?',
                                body: 'A financial product where numbers don\'t move is a prototype, not a product. Every price on screen needed to feel connected to something happening in the world, not hardcoded.',
                                resolution: 'Real-time WebSocket updates let prices tick live as match events came in. I designed price animations to be immediate but not jarring — movement as information, not noise.',
                            },
                        ].map((card, i) => (
                            <div key={i} style={{ background: BG, padding: '3rem 2.5rem' }}>
                                <ProblemCard {...card} />
                            </div>
                        ))}
                    </div>
                    <HR />
                </div>
            </Reveal>

            {/* ══════════════════════════════════════════════════
                DESIGN
            ══════════════════════════════════════════════════ */}
            <div ref={setRef(2)} data-cs-section="" style={{ padding: `8rem ${PAD}` }}>
                <Reveal><SL>The Design</SL></Reveal>

                <Reveal delay={60}>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
                        fontWeight: 700, lineHeight: 1.0,
                        color: 'var(--cs-fg-strong)', margin: '0 0 2rem',
                        letterSpacing: '-0.025em', maxWidth: '20ch',
                    }}>
                        A market that feels like it has skin in the game.
                    </h2>
                </Reveal>

                <Reveal delay={100}>
                    <p style={{
                        ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-3)',
                        lineHeight: 1.9, maxWidth: '56ch', margin: '0 0 7rem',
                    }}>
                        The full product covers both sides of the market: athletes managing their profile and seeing how investors view them, and investors discovering, researching, trading, and tracking their portfolio. Every screen had to pull its weight.
                    </p>
                </Reveal>
            </div>

            {/* Screen showcase — uniform 3-column grid */}
            <div style={{ padding: `8rem ${PAD} 12rem` }}>
                {[
                    ['dashboard.png', 'portfolio.png'],
                    ['analytics.png', 'athelete_detail.png', 'compare.png']
                ].map((row, i) => (
                    <div data-cols="3" key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', marginBottom: '4rem' }}>
                        {row.map((file, j) => (
                            <div key={file} style={{ width: 'min(320px, 100%)', margin: '0 auto' }}>
                                <Reveal y={10} delay={(i * 3 + j) * 80}>
                                    <Media filename={file} />
                                    <ScreenLabel name={file.replace('.png', '').split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')} note="Interface" />
                                </Reveal>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* ══════════════════════════════════════════════════
                EXECUTION — redesigned
            ══════════════════════════════════════════════════ */}
            <HR />
            <div ref={setRef(3)} data-cs-section="" style={{ padding: `8rem ${PAD}` }}>
                <Reveal><SL>Execution</SL></Reveal>

                {/* ── Frontend decisions ── */}
                <Reveal delay={40}>
                    <p style={{ ...LBL, fontSize: '0.54rem', color: 'var(--cs-line-strong)', margin: '0 0 0' }}>
                        Frontend · my contribution
                    </p>
                </Reveal>

                <Reveal delay={60}>
                    <div style={{ borderTop: '1px solid var(--cs-line-faint)', marginTop: '1.5rem', marginBottom: '7rem' }}>
                        {[
                            {
                                tag: 'State',
                                decision: 'rAF-batched price context',
                                why: 'WebSocket ticks arrive faster than React can batch. Wrapping updates in requestAnimationFrame before committing to state means rapid events collapse into one render per frame — no flicker, no reflow.',
                            },
                            {
                                tag: 'Animation',
                                decision: 'Direction-state delta indicators',
                                why: 'Price arrows animate on direction change, not value change. A price ticking by 0.01 repeatedly never fires a visual. Only a genuine reversal does. That distinction is what makes the UI feel trustworthy rather than noisy.',
                            },
                            {
                                tag: 'Data',
                                decision: 'TanStack Query for server state',
                                why: 'Separates server cache from UI state entirely. Stale-while-revalidate means the portfolio page feels instant on revisit even though it\'s hitting a live API.',
                            },
                            {
                                tag: 'Charts',
                                decision: 'Recharts base + custom D3.js overlays',
                                why: 'Recharts handles the price curve and responsive layout. D3 draws the performance score overlay and the volume bars underneath — things Recharts can\'t do cleanly without fighting its API.',
                            },
                            {
                                tag: 'Forms',
                                decision: 'React Hook Form + Zod schemas',
                                why: 'Buy/sell inputs are type-validated at schema level before any API call. In a financial product, a bad input reaching the server is worse than a form that refuses to submit.',
                            },
                            {
                                tag: 'UX',
                                decision: 'Two-layer athlete detail page',
                                why: 'Headline view (price, score, recent form) above the fold. Full stats below. A fan makes a snap call from the top. An investor scrolls for the detail. One page, two reading modes, no compromise on either.',
                            },
                        ].map(row => <DecisionRow key={row.tag + row.decision} {...row} />)}
                    </div>
                </Reveal>

                {/* ── System architecture diagram ── */}
                <Reveal delay={40}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '2rem', marginBottom: '2rem' }}>
                        <p style={{ ...LBL, fontSize: '0.54rem', color: 'var(--cs-fg-3)', margin: 0 }}>
                            Architecture · system diagram
                        </p>
                        <p style={{ ...figtree, fontSize: '0.78rem', color: 'var(--cs-fg-3)', margin: 0 }}>
                            designed and built by the team
                        </p>
                    </div>
                </Reveal>

                <Reveal delay={80} y={16}>
                    <div style={{
                        border: '1px solid var(--cs-line-faint)',
                        background: 'var(--cs-media-bg)',
                        padding: '2rem',
                        overflow: 'hidden',
                    }}>
                        <ArchDiagram />
                    </div>
                </Reveal>

                {/* ── Pricing model ── */}
                <Reveal delay={40}>
                    <p style={{ ...LBL, fontSize: '0.54rem', color: 'var(--cs-line-strong)', margin: '6rem 0 0' }}>
                        Pricing model · how share price is calculated
                    </p>
                </Reveal>

                <Reveal delay={60}>
                    <div style={{ borderTop: '1px solid var(--cs-line-faint)', marginTop: '1.5rem' }}>
                        {[
                            {
                                label: 'Performance Score',
                                formula: 'PS = w₁·actual + w₂·consistency + w₃·growth + w₄·fitness + w₅·AI',
                                note: 'Weights are sport-specific. Cricket, swimming, and wrestling each have isolated scoring engines with different w values.',
                            },
                            {
                                label: 'Fundamental Value',
                                formula: 'FV = BaseValue × (1 + α · PS)',
                                note: 'Anchors the share price to verified career statistics. Hype cannot move this number directly.',
                            },
                            {
                                label: 'Demand Impact',
                                formula: 'DI = 1 + β × (circulating / total_shares)',
                                note: 'Market pressure from real buying activity enters here as a multiplier, not as the base.',
                            },
                            {
                                label: 'Final Price',
                                formula: 'P = η·(FV × DI) + (1−η)·P_old   [η=0.6]',
                                note: 'Exponential smoothing prevents a single bad match from crashing a player\'s price overnight.',
                            },
                            {
                                label: 'Dividend / Share',
                                formula: 'DDPS = (0.10 × income) / (days × total_shares)',
                                note: '10% of all verified athlete income distributes automatically, time-weighted by days held.',
                            },
                        ].map(row => <Equation key={row.label} {...row} />)}
                    </div>
                </Reveal>
            </div>
            <HR />

            {/* ══════════════════════════════════════════════════
                IMPACT
            ══════════════════════════════════════════════════ */}
            <div ref={setRef(4)} data-cs-section="" style={{ padding: `8rem ${PAD}` }}>
                <Reveal><SL>Impact</SL></Reveal>

                <Reveal delay={60}>
                    <div style={{ margin: '0 0 6rem' }}>
                        <p style={{
                            fontSize: 'clamp(1.8rem, 4vw, 3.4rem)',
                            ...serifItalic, color: 'var(--cs-fg)',
                            lineHeight: 1.15, margin: '0 0 1.5rem',
                            letterSpacing: '-0.01em', maxWidth: '24ch',
                        }}>
                            "This is the first hackathon project that actually felt like a real product."
                        </p>
                        <p style={{ ...LBL, fontSize: '0.58rem', color: 'var(--cs-fg-3)' }}>
                            Judge feedback, post-demo
                        </p>
                    </div>
                </Reveal>

                <Reveal delay={80}>
                    <div data-cols="3" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        borderTop: '1px solid var(--cs-line-faint)',
                    }}>
                        {[
                            {
                                head: 'Full product scope',
                                body: 'Both the investor and athlete sides of the market are fully designed and functional, not mocked. Two user types, two dashboards, one coherent system.',
                            },
                            {
                                head: 'Live market feel',
                                body: 'Prices move in real time as match data comes in. The UI absorbs WebSocket updates without reflows or visual noise, which is harder than it sounds.',
                            },
                            {
                                head: 'Conviction first',
                                body: 'The design proved the core thesis: fans with genuine conviction about athletes will engage with a financial product if it respects their intelligence and doesn\'t hide the signal.',
                            },
                        ].map(({ head, body }, i) => (
                            <div key={head} style={{
                                padding: '2.5rem 2.5rem 2.5rem 0',
                                paddingLeft: i > 0 ? '2.5rem' : '0',
                                borderRight: i < 2 ? '1px solid var(--cs-line-faint)' : 'none',
                            }}>
                                <p style={{ ...figtree, fontSize: '1rem', fontWeight: 600, color: 'var(--cs-fg-strong)', margin: '0 0 0.9rem' }}>{head}</p>
                                <p style={{ ...figtree, fontSize: '0.875rem', color: 'var(--cs-fg-faint)', lineHeight: 1.8, margin: 0 }}>{body}</p>
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
                        letterSpacing: '-0.015em', maxWidth: '26ch',
                    }}>
                        In fintech, trust is a design problem before it is anything else.
                    </p>
                </Reveal>

                <Reveal delay={100}>
                    <div data-cols="2" style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 'clamp(3rem, 6vw, 7rem)',
                        marginBottom: '8rem',
                    }}>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-3)', lineHeight: 1.9, margin: 0 }}>
                            I came into Sportfolio thinking the hard part was building enough screens fast enough. The actual hard part was figuring out what each screen needed to earn trust. Financial UIs feel untrustworthy when numbers appear without context, when motion is abrupt, when the hierarchy implies all data is equally important. Every decision I made was really a decision about what the user should believe, and in what order.
                        </p>
                        <p style={{ ...figtree, fontSize: '0.975rem', color: 'var(--cs-fg-3)', lineHeight: 1.9, margin: 0 }}>
                            The athlete detail page taught me the most. I went through four versions trying to balance information density with clarity. The version that worked was the one where I stopped asking "what data should we show?" and started asking "what question is the user trying to answer right now?" Those are different questions, and the second one produces better design every time.
                        </p>
                    </div>
                </Reveal>
            </div>

            {/* FOOTER */}
            <HR />
            <div data-cs-footer style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: `3rem ${PAD}`,
            }}>
                <Reveal>
                    <div>
                        <p style={{ ...LBL, fontSize: '0.56rem', margin: '0 0 0.6rem', color: 'var(--text-muted)' }}>Next project</p>
                        <button
                            onClick={() => navigate('/case-study/camber')}
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
                            Camber →
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
        </div >
    );
}