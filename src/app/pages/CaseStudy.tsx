import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BUILDING_PROJECTS, SELECTED_PROJECTS } from '../../data/portfolio';
import { figtree, T, ls, serifItalic } from '../utils/constants';

export function CaseStudy() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const project = [...BUILDING_PROJECTS, ...SELECTED_PROJECTS].find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#141414', color: 'white', ...figtree }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
          <p style={{ color: '#888' }}>Project not found.</p>
          <button onClick={() => navigate('/')} style={{ marginTop: '2rem', background: 'transparent', border: '1px solid #444', color: 'white', padding: '10px 20px', cursor: 'pointer', ...figtree }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { caseStudy } = project;

  return (
    <div style={{ minHeight: '100vh', background: '#141414', color: 'white', ...figtree, padding: '10vw min(142px, 9.4vw)', position: 'relative', overflowX: 'hidden' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ position: 'fixed', top: '40px', left: 'min(142px, 9.4vw)', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', ...figtree, fontSize: '0.9rem', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <span style={{ fontSize: '1.2rem' }}>←</span> back
      </button>

      <div style={{ maxWidth: '800px', marginTop: '4rem' }}>
        <p style={{ ...T.label, color: '#888', marginBottom: '1rem', ...ls(0) }}>
          <span style={{ ...serifItalic, color: '#555', fontSize: '1.2em', marginRight: '6px' }}>//</span> Case Study
        </p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 600, lineHeight: 1.1, marginBottom: '2rem', ...ls(1) }}>
          {caseStudy.title}
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', marginTop: '6rem' }}>
          <section style={ls(2)}>
            <h2 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#555', marginBottom: '1.5rem' }}>Overview</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#aaa' }}>{caseStudy.overview}</p>
          </section>

          <section style={ls(3)}>
            <h2 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#555', marginBottom: '1.5rem' }}>The Challenge</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#aaa' }}>{caseStudy.challenge}</p>
          </section>

          <section style={ls(4)}>
            <h2 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#555', marginBottom: '1.5rem' }}>The Solution</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#aaa' }}>{caseStudy.solution}</p>
          </section>

          <section style={ls(5)}>
            <h2 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#555', marginBottom: '1.5rem' }}>Results</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#aaa' }}>{caseStudy.results}</p>
          </section>
        </div>

        <div style={{ marginTop: '8rem', display: 'flex', flexDirection: 'column', gap: '8rem' }}>
          {caseStudy.images.map((img, i) => (
            <div key={i} style={{ width: '100%', position: 'relative', overflow: 'hidden', ...ls(6 + i) }}>
              <img 
                src={img} 
                alt="" 
                style={{ width: '100%', height: 'auto', display: 'block', filter: 'grayscale(0.2) brightness(0.9)' }} 
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: '10rem', paddingBottom: '10rem', textAlign: 'center' }}>
          <p style={{ color: '#444', marginBottom: '2rem' }}>End of Case Study</p>
          <button onClick={() => navigate('/')} style={{ background: 'transparent', border: '1px solid #333', color: 'white', padding: '15px 40px', cursor: 'pointer', ...figtree, fontSize: '1rem', transition: 'all 0.3s ease' }}>
            Next Project
          </button>
        </div>
      </div>
    </div>
  );
}
