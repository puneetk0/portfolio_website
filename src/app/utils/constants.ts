export const TOTAL = 3;
export const DURATION = 650;
export const EASE_PAGE = 'cubic-bezier(0.76, 0, 0.24, 1)';
export const EASE_TEXT = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

export const geist: React.CSSProperties = { fontFamily: "'Geist', sans-serif" };
export const figtree: React.CSSProperties = { fontFamily: "'Figtree', sans-serif" };
export const caveat: React.CSSProperties = { fontFamily: "'Caveat', cursive" };
export const serifItalic: React.CSSProperties = { fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 400 };
export const CONTENT_LEFT = 'min(142px, 9.4vw)';

export const T = {
  label: { fontSize: 'clamp(12px, 1.05vw, 14px)' } as React.CSSProperties,
  name: { fontSize: 'clamp(15px, 1.3vw, 18px)' } as React.CSSProperties,
  desc: { fontSize: 'clamp(13px, 1.15vw, 16px)' } as React.CSSProperties,
  hero: { fontSize: 'clamp(16px, 1.4vw, 20px)' } as React.CSSProperties,
} as const;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function ls(i: number): React.CSSProperties {
  return { opacity: 0, animation: `lineUp 420ms ${EASE_TEXT} ${80 + i * 55}ms forwards` };
}
