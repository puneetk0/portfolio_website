import { useEffect, useRef } from 'react';
import { lerp } from '../utils/constants';

export function useParallax(disabled = false) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      if (!disabled) {
        currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.07);
        currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.07);
        if (groupRef.current)
          groupRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px)`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [disabled]);

  const onMouseMove = disabled ? undefined : (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    targetPos.current = {
      x: ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 14,
      y: ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 9,
    };
  };
  const onMouseLeave = disabled ? undefined : () => { targetPos.current = { x: 0, y: 0 }; };

  return { sectionRef, groupRef, onMouseMove, onMouseLeave };
}
