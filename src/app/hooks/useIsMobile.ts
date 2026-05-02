import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => {
      // Also consider pointer:coarse to properly handle iPads
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      setMobile(window.innerWidth <= 640 || isTouch);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return mobile;
}
