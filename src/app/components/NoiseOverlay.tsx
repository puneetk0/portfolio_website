import React from 'react';

export function NoiseOverlay() {
  return (
    <>
      <style>{`
        @keyframes staticNoise {
          0% { background-position: 0px 0px; }
          20% { background-position: -50px 50px; }
          40% { background-position: 50px -50px; }
          60% { background-position: 100px 100px; }
          80% { background-position: -100px -100px; }
          100% { background-position: 0px 0px; }
        }
      `}</style>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        opacity: 0.05,
        animation: 'staticNoise 0.4s steps(4) infinite'
      }} />
    </>
  );
}
