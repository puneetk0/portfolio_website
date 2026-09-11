import React, { useEffect, useRef } from 'react';
import { lerp } from '../utils/constants';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  /* Parked in the middle of the viewport, not off its left edge.
     It used to start at {-200,-200}: the element is `position: fixed` and only
     `opacity: 0`, so it was still laid out at left:-204px and contributed
     leftward scroll overflow — the page reported 11px of horizontal overflow
     until the first mouse move. Centre-parked and transparent it is invisible
     and contributes nothing. */
  const mousePos = useRef({ x: 0, y: 0 });
  const curPos = useRef({ x: 0, y: 0 });
  const magnetEl = useRef<HTMLElement | null>(null);
  /* The 'greeting' mode and its "hello." bubble are gone: they were driven by a
     `data-cursor="greeting"` attribute on the hero heading, and that attribute
     went away when the greeting stopped being a hover target — leaving a mode
     nothing could ever enter. */
  const modeRef = useRef<'default' | 'ring' | 'magnetic' | 'hidden'>('hidden');

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const park = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    mousePos.current = { ...park };
    curPos.current = { ...park };

    // Sole owner of `cursor: none`. The rule itself lives in base.css keyed on
    // this attribute, so the hidden pointer and the rendered cursor can never
    // desync the way five scattered declarations previously did.
    document.documentElement.dataset.customCursor = 'on';

    const appear = (m: typeof modeRef.current) => {
      if (m === 'hidden') {
        dot.style.opacity = '0';
        return;
      }
      dot.style.opacity = '1';
      switch (m) {
        case 'default':
          dot.style.width = '8px'; dot.style.height = '8px';
          dot.style.borderRadius = '50%';
          dot.style.backgroundColor = 'var(--cursor-ink)';
          dot.style.border = 'none';
          break;
        case 'ring':
          dot.style.width = '22px'; dot.style.height = '22px';
          dot.style.borderRadius = '50%';
          dot.style.backgroundColor = 'transparent';
          dot.style.border = '1px solid var(--cursor-ring)';
          break;
        case 'magnetic':
          dot.style.width = '6px'; dot.style.height = '6px';
          dot.style.borderRadius = '50%';
          dot.style.backgroundColor = 'var(--cursor-ink)';
          dot.style.border = 'none';
          break;
      }
    };

    let rafId: number;
    const tick = () => {
      /* `magnetEl` used to be assigned here and never read, so the magnetic
         cursor did not magnetise and the five `data-magnetic` attributes in the
         markup did nothing at all. The pull is applied to the TARGET, not to
         the rendered position, so the existing easing still does the smoothing
         and the dot never fights the pointer. */
      let tx = mousePos.current.x;
      let ty = mousePos.current.y;
      const m = magnetEl.current;
      if (m) {
        const r = m.getBoundingClientRect();
        tx = lerp(tx, r.left + r.width / 2, 0.3);
        ty = lerp(ty, r.top + r.height / 2, 0.45);
      }
      curPos.current.x = lerp(curPos.current.x, tx, 0.15);
      curPos.current.y = lerp(curPos.current.y, ty, 0.15);
      dot.style.left = `${curPos.current.x}px`;
      dot.style.top = `${curPos.current.y}px`;
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

    // ✅ When mouse re-enters the window, snap position instantly to avoid
    // the custom cursor sliding in from its last known off-screen position
    const onWindowEnter = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      curPos.current = { x: e.clientX, y: e.clientY };
      modeRef.current = 'default';
      appear('default');
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const mag = t.closest('[data-magnetic]') as HTMLElement | null;
      if (mag) {
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
        // ✅ Cursor left the browser window entirely — hide custom cursor
        modeRef.current = 'hidden'; magnetEl.current = null; appear('hidden');
        return;
      }
      const leaving = !to.closest('[data-magnetic]') && !to.closest('a, button');
      if (leaving) {
        modeRef.current = 'default'; magnetEl.current = null;
        appear('default');
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    window.addEventListener('mouseenter', onWindowEnter); // ✅ re-entry snap

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      window.removeEventListener('mouseenter', onWindowEnter);
      delete document.documentElement.dataset.customCursor;
    };
  }, []);

  return (
    <>
      <div 
        ref={dotRef} 
        className="custom-cursor"
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 'var(--z-cursor)' as unknown as number,
          width: '8px', height: '8px', borderRadius: '50%',
          backgroundColor: 'var(--cursor-ink)', border: 'none',
          transform: 'translate(-50%, -50%)', pointerEvents: 'none',
          mixBlendMode: 'difference',
          transition: 'width 140ms ease, height 140ms ease, background-color 140ms ease, border 140ms ease, opacity 140ms ease, border-radius 140ms ease',
        }} 
      />
    </>
  );
}