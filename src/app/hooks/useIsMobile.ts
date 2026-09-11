import { useEffect, useState } from 'react';

/** Single source for the mobile breakpoint. The cursor CSS previously used
 *  768px while this hook used 900px, which left a 769-900px non-touch band with
 *  `cursor: none` applied and no custom cursor rendered — no pointer at all. */
export const MOBILE_QUERY = '(max-width: 900px), (pointer: coarse)';

/** Whether there is room for a dealt deck of prints beside the text column.
 *
 *  This is deliberately NOT the mobile query. The constraint is horizontal
 *  room, not device class: below ~1200px the text column, two gutters and a
 *  264px print cannot coexist, and the deck starts crossing the headline. The
 *  900-1200px band is desktop by every other measure, so gating decks on
 *  `isMobile` left exactly that band with a print sitting on top of the h1.
 *  Under this width the same photograph renders inline instead — it is content,
 *  and it should never be switched off along with the decoration. */
export const DECK_QUERY = '(min-width: 1200px) and (pointer: fine)';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    // `change` on the query, not window `resize`: resize fires on every mobile
    // URL-bar collapse, which this never needed to react to.
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export function useIsMobile() {
  return useMediaQuery(MOBILE_QUERY);
}
