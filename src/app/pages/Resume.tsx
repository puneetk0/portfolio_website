import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { figtree, geist, serifItalic } from '../utils/constants';

export function Resume() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Resume | Puneet Kathuria — Full-Stack Engineer";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Interactive and A4 print-optimized professional resume of Puneet Kathuria, illustrating experience with Camber, Sportfolio, and technical qualifications.");
        }
        // Force light mode background for page print to ensure high-contrast paper output
        document.body.style.setProperty('--bg-color-print', '#ffffff');
        document.body.style.setProperty('--text-color-print', '#141414');
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="resume-page" style={{
            minHeight: '100vh',
            background: 'var(--bg-color)',
            color: 'var(--text-color)',
            transition: 'background-color 300ms ease, color 300ms ease',
            padding: '4rem 2rem',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            {/* Nav & Download Actions bar */}
            <div className="resume-actions" style={{
                width: '100%',
                maxWidth: '840px',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '2.5rem',
            }}>
                <button 
                    onClick={() => navigate('/')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        padding: '6px 12px',
                        borderBottom: '1px solid transparent',
                        transition: 'all 0.2s ease',
                        ...geist,
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.color = 'var(--text-color)';
                        e.currentTarget.style.borderBottomColor = 'var(--text-color)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.color = 'var(--text-muted)';
                        e.currentTarget.style.borderBottomColor = 'transparent';
                    }}
                >
                    ← Back to Portfolio
                </button>

                <button 
                    onClick={handlePrint}
                    style={{
                        background: 'var(--text-color)',
                        border: '1px solid var(--text-color)',
                        color: 'var(--bg-color)',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        padding: '10px 22px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        ...geist,
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-color)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'var(--text-color)';
                        e.currentTarget.style.color = 'var(--bg-color)';
                    }}
                >
                    Download PDF / Print
                </button>
            </div>

            {/* Resume Sheet Container */}
            <div className="resume-sheet" style={{
                width: '100%',
                maxWidth: '840px',
                background: 'var(--bg-color)',
                border: '1px solid var(--border-color)',
                padding: '3rem 3.5rem',
                boxSizing: 'border-box',
                boxShadow: 'var(--polaroid-shadow)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                transition: 'all 0.30s cubic-bezier(0.16,1,0.3,1)',
            }}>
                {/* Header Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 0.8fr',
                    gap: '2rem',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '1.5rem',
                }}>
                    <div>
                        <h1 style={{
                            margin: '0 0 0.4rem 0',
                            fontSize: '2.5rem',
                            fontWeight: 500,
                            letterSpacing: '-0.025em',
                            color: 'var(--text-color)',
                            ...figtree,
                        }}>
                            Puneet Kathuria
                        </h1>
                        <p style={{
                            margin: 0,
                            fontSize: '0.95rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            ...geist,
                        }}>
                            Full-Stack Engineer & AI Undergrad
                        </p>
                    </div>

                    {/* Contact Details */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        color: 'var(--text-secondary)',
                        ...geist,
                    }}>
                        <a href="tel:+919803320125" style={{ color: 'inherit', textDecoration: 'none' }}>+91 98033 20125</a>
                        <a href="mailto:puneet.2024@nst.rishihood.edu.in" style={{ color: 'inherit', textDecoration: 'none' }}>puneet.2024@nst.rishihood.edu.in</a>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <a href="https://github.com/puneetk0" target="_blank" rel="noreferrer" style={{ color: 'var(--text-color)', textDecoration: 'none', borderBottom: '1px solid var(--border-color)' }}>Github</a>
                            <span style={{ color: 'var(--border-color)' }}>•</span>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-color)', textDecoration: 'none', borderBottom: '1px solid var(--border-color)' }}>LinkedIn</a>
                            <span style={{ color: 'var(--border-color)' }}>•</span>
                            <a href="/" style={{ color: 'var(--text-color)', textDecoration: 'none', borderBottom: '1px solid var(--border-color)' }}>Portfolio</a>
                        </div>
                    </div>
                </div>

                {/* Professional Summary */}
                <div>
                    <h2 style={{
                        fontSize: '0.62rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.18em',
                        color: 'var(--label-color)',
                        margin: '0 0 0.8rem 0',
                        ...geist,
                    }}>
                        // Professional Summary
                    </h2>
                    <p style={{
                        margin: 0,
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        ...figtree,
                    }}>
                        Product-minded Full-Stack Developer and Artificial Intelligence undergraduate with a passion for designing and engineering high-performance, responsive systems. Experienced in end-to-end development—from UI/UX design architectures in Figma to real-time microservices. Driven by solving organizational fragmentation and creating seamless human-computer interfaces.
                    </p>
                </div>

                {/* Two-Column Core Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.15fr 0.85fr',
                    gap: '2.5rem',
                }}>
                    {/* Left Column: Work & Projects */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Selected Projects */}
                        <div>
                            <h2 style={{
                                fontSize: '0.62rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.18em',
                                color: 'var(--label-color)',
                                margin: '0 0 1.2rem 0',
                                ...geist,
                            }}>
                                // Selected Projects
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                                {/* Camber */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-color)', margin: 0, ...figtree }}>Camber</h3>
                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', ...geist }}>macOS App · 2026</span>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 6px 0', ...geist }}>
                                        Stack: Swift, AppKit, React/TypeScript (Electron Sandbox), Tailwind CSS
                                    </p>
                                    <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, ...figtree }}>
                                        <li style={{ marginBottom: '3px' }}>Engineered a keyboard-driven, ultra-fast task manager that reduces friction to a single keystroke.</li>
                                        <li>Implemented adaptive workspaces and sleek layouts supporting responsive, dynamic light/dark triggers.</li>
                                    </ul>
                                </div>

                                {/* Sportfolio */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-color)', margin: 0, ...figtree }}>Sportfolio</h3>
                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', ...geist }}>Fintech Platform · 2026</span>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 6px 0', ...geist }}>
                                        Stack: Next.js, React, Node.js, Express, WebSockets, Redis, Chart.js
                                    </p>
                                    <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, ...figtree }}>
                                        <li style={{ marginBottom: '3px' }}>Architected a fantasy trading market allowing users to trade emerging athletes using stock market principles.</li>
                                        <li>Integrated low-latency WebSockets handling high-frequency price updates with zero layout shifts.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Experience */}
                        <div>
                            <h2 style={{
                                fontSize: '0.62rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.18em',
                                color: 'var(--label-color)',
                                margin: '0 0 1.2rem 0',
                                ...geist,
                            }}>
                                // Work Experience
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-color)', margin: 0, ...figtree }}>Lead Organizer</h3>
                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', ...geist }}>Dec 2024 – Present</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', ...geist }}>
                                        <span>GDGoC Rishihood University</span>
                                        <span>Delhi NCR</span>
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, ...figtree }}>
                                        <li style={{ marginBottom: '3px' }}>Directing a 35+ member team managing dev conferences, hackathons, and logistics for a 500+ student developer community.</li>
                                        <li>Organized high-impact Ideathons & Designathons; conducted comprehensive UI/UX workshops for 150+ developers.</li>
                                    </ul>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-color)', margin: 0, ...figtree }}>Indic Summer School Intern</h3>
                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', ...geist }}>Jan 2025 – Present</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', ...geist }}>
                                        <span>Rishihood University</span>
                                        <span>Delhi NCR</span>
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, ...figtree }}>
                                        <li>Coordinating end-to-end program delivery, attendee logistics, and technical onboarding for high-profile summits.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Skills, Education & Achievements */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Skills */}
                        <div>
                            <h2 style={{
                                fontSize: '0.62rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.18em',
                                color: 'var(--label-color)',
                                margin: '0 0 1rem 0',
                                ...geist,
                            }}>
                                // Technical Skills
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <p style={{ ...geist, fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px 0', letterSpacing: '0.04em' }}>Languages</p>
                                    <p style={{ ...figtree, fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>JavaScript (ES6+), TypeScript, HTML5, CSS3, Python, Swift, SQL</p>
                                </div>
                                <div>
                                    <p style={{ ...geist, fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px 0', letterSpacing: '0.04em' }}>Frameworks & Packages</p>
                                    <p style={{ ...figtree, fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>React, Next.js, Node.js, Express.js, Tailwind CSS, Electron, Supabase, Prisma ORM</p>
                                </div>
                                <div>
                                    <p style={{ ...geist, fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px 0', letterSpacing: '0.04em' }}>Software & Tools</p>
                                    <p style={{ ...figtree, fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Figma, Git & GitHub, VS Code, Photoshop, Xcode</p>
                                </div>
                            </div>
                        </div>

                        {/* Education */}
                        <div>
                            <h2 style={{
                                fontSize: '0.62rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.18em',
                                color: 'var(--label-color)',
                                margin: '0 0 1rem 0',
                                ...geist,
                            }}>
                                // Education
                            </h2>

                            <div>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-color)', margin: '0 0 4px 0', ...figtree }}>
                                    B.Tech in Artificial Intelligence
                                </h3>
                                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 2px 0', ...figtree }}>
                                    Newton School of Technology
                                </p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 6px 0', ...geist }}>
                                    Rishihood University · 2024 – 2028
                                </p>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500, margin: 0, ...figtree }}>
                                    Cumulative GPA: 7.48 / 10.0
                                </p>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div>
                            <h2 style={{
                                fontSize: '0.62rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.18em',
                                color: 'var(--label-color)',
                                margin: '0 0 1rem 0',
                                ...geist,
                            }}>
                                // Achievements & Extracurriculars
                            </h2>

                            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, ...figtree }}>
                                <li style={{ marginBottom: '6px' }}>
                                    <strong>Winner (Prod-G)</strong> – Secured 1st place in national Product Management Challenge @ IIT Roorkee.
                                </li>
                                <li style={{ marginBottom: '6px' }}>
                                    <strong>Runner-Up (DCode)</strong> – Placed 2nd in full-stack hackathon among 100+ competing regional teams.
                                </li>
                                <li style={{ marginBottom: '6px' }}>
                                    <strong>2nd Place (Designathon)</strong> – Secured runner-up position in national design challenge on Bluelearn.
                                </li>
                                <li>
                                    <strong>Hacktoberfest Accomplished</strong> – Completed digital open-source challenge with 4 verified contributions (2024).
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Override CSS in Style Tag */}
            <style>{`
                @media print {
                    /* Ensure exact color matching and force light theme colors on paper */
                    body, html, .resume-page, .resume-sheet {
                        background: var(--bg-color-print) !important;
                        color: var(--text-color-print) !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    /* Hide interface buttons and non-printable elements */
                    .resume-actions, .theme-toggle-btn, .noise-overlay, .background-glow {
                        display: none !important;
                    }

                    .resume-page {
                        min-height: auto !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }

                    .resume-sheet {
                        max-width: 100% !important;
                        padding: 2.2cm 2cm 2cm 2cm !important;
                        border: none !important;
                        box-shadow: none !important;
                    }

                    /* Perfect spacing for single-page print */
                    h1 {
                        font-size: 2.3rem !important;
                    }
                    
                    a {
                        text-decoration: none !important;
                        color: var(--text-color-print) !important;
                    }
                }

                @page {
                    size: A4;
                    margin: 0;
                }
            `}</style>
        </div>
    );
}
