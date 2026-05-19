import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      setMobile(window.innerWidth <= 900 || isTouch);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return mobile;
}
