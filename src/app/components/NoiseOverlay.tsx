import React from 'react';

/* Static grain.
   This previously animated `background-position` on a fixed full-viewport layer
   via `staticNoise 0.4s steps(4) infinite` — repainting the entire screen 2.5
   times a second for a texture no one perceives as moving. The SVG data URI now
   lives in the token layer so the print mount can share it. */
export function NoiseOverlay() {
  return <div className="grain noise-overlay" aria-hidden="true" />;
}
