import React, { useEffect, useRef } from 'react';
import { geist, lerp } from '../utils/constants';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -200, y: -200 });
  const curPos = useRef({ x: -200, y: -200 });
  const magnetEl = useRef<HTMLElement | null>(null);
  const modeRef = useRef<'default' | 'ring' | 'greeting' | 'magnetic' | 'hidden'>('hidden');

  useEffect(() => {
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label) return;

    const appear = (m: typeof modeRef.current) => {
      if (m === 'hidden') {
        dot.style.opacity = '0';
        label.style.opacity = '0';
        return;
      }
      if (m === 'greeting') {
        dot.style.opacity = '0';
        label.style.opacity = '1';
        label.style.transform = 'translate(-50%, -50%) scale(1)';
        return;
      }
      label.style.opacity = '0';
      label.style.transform = 'translate(-50%, -50%) scale(0.85)';
      dot.style.opacity = '1';
      switch (m) {
        case 'default':
          dot.style.width = '8px'; dot.style.height = '8px';
          dot.style.borderRadius = '50%';
          dot.style.backgroundColor = 'white';
          dot.style.border = 'none';
          break;
        case 'ring':
          dot.style.width = '22px'; dot.style.height = '22px';
          dot.style.borderRadius = '50%';
          dot.style.backgroundColor = 'transparent';
          dot.style.border = '1px solid rgba(255,255,255,0.75)';
          break;
        case 'magnetic':
          dot.style.width = '5px'; dot.style.height = '5px';
          dot.style.borderRadius = '50%';
          dot.style.backgroundColor = 'white';
          dot.style.border = 'none';
          break;
      }
    };

    let rafId: number;
    const tick = () => {
      if (modeRef.current === 'magnetic' && magnetEl.current) {
        const r = magnetEl.current.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        curPos.current.x = lerp(curPos.current.x, cx, 0.14);
        curPos.current.y = lerp(curPos.current.y, cy, 0.14);
      } else {
        curPos.current.x = mousePos.current.x;
        curPos.current.y = mousePos.current.y;
      }
      dot.style.left = `${curPos.current.x}px`;
      dot.style.top = `${curPos.current.y}px`;
      label.style.left = `${curPos.current.x}px`;
      label.style.top = `${curPos.current.y}px`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      if (modeRef.current === 'hidden') {
        modeRef.current = 'default';
        appear('default');
      }
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const mag = t.closest('[data-magnetic]') as HTMLElement | null;
      if (t.closest('[data-cursor="greeting"]')) {
        modeRef.current = 'greeting'; magnetEl.current = null; appear('greeting');
      } else if (mag) {
        modeRef.current = 'magnetic'; magnetEl.current = mag; appear('magnetic');
      } else if (t.closest('a, button')) {
        modeRef.current = 'ring'; magnetEl.current = null; appear('ring');
      } else {
        modeRef.current = 'default'; magnetEl.current = null; appear('default');
      }
    };

    const onOut = (e: MouseEvent) => {
      const to = e.relatedTarget as HTMLElement | null;
      if (!to) {
        modeRef.current = 'hidden'; magnetEl.current = null; appear('hidden');
        return;
      }
      const leaving = !to || (
        !to.closest('[data-cursor="greeting"]') &&
        !to.closest('[data-magnetic]') &&
        !to.closest('a, button')
      );
      if (leaving) {
        modeRef.current = 'default'; magnetEl.current = null;
        curPos.current = { ...mousePos.current };
        appear('default');
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 99999,
        width: '8px', height: '8px', borderRadius: '50%',
        backgroundColor: 'white', border: 'none',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none',
        transition: 'width 140ms ease, height 140ms ease, background-color 140ms ease, border 140ms ease, opacity 140ms ease, border-radius 140ms ease',
      }} />
      <div ref={labelRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 99999,
        transform: 'translate(-50%, -50%) scale(0.85)',
        pointerEvents: 'none', opacity: 0,
        transition: 'opacity 180ms ease, transform 180ms ease',
        backgroundColor: 'white', color: '#141414',
        padding: '7px 13px', borderRadius: '4px',
        ...geist, fontSize: '12px', fontWeight: 500,
        letterSpacing: '0.04em', whiteSpace: 'nowrap', userSelect: 'none',
      }}>
        hello.
      </div>
    </>
  );
}
