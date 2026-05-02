import React, { useEffect, useRef } from 'react';

export function NoiseOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(256, 256);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    if (ref.current) ref.current.style.backgroundImage = `url(${canvas.toDataURL()})`;
  }, []);
  return <div ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 500, pointerEvents: 'none', opacity: 0.04, backgroundRepeat: 'repeat' }} />;
}
