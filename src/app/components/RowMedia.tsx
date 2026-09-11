import React from 'react';
import type { RowMedia as RowMediaDef } from '../../data/portfolio';

/* ─── RowMedia ────────────────────────────────────────────────────────────────
   The work, visible without interaction, on every platform.

   This replaces `ImageCluster`, which was hover-only on desktop and switched
   off entirely below 900px. Four separate reasons it had to go rather than be
   patched:

     1. `.row-media { display: none }` on desktop meant the hero row — whose
        media data already existed in `portfolio.ts` — rendered nothing at all,
        and hovering it did nothing. That is the reported bug.
     2. It rendered screenshots in full colour on a site that rules out colour
        everywhere else, which was the single most jarring thing on the page.
     3. `objectFit: contain` on fixed boxes letterboxed every frame.
     4. `ImgDef` carried no alt text, so `alt=""` was hardcoded and none of the
        work was reachable by assistive technology.

   Frames share a uniform height and take their width from their own ratio —
   the same rule the prints use, and for the same reason: these sources run from
   a 9:19.5 phone capture to a 16:10 desktop one, so a uniform width would turn
   ratio variance into a 4x spread in height.
   ───────────────────────────────────────────────────────────────────────────── */

export function RowMedia({ media, active }: { media: readonly RowMediaDef[]; active: boolean }) {
  if (media.length === 0) return null;

  return (
    <div className="snap-x row-media" data-on={active ? 'true' : 'false'}>
      {media.map(m => (
        <figure
          className="row-media__frame"
          key={m.src}
          style={{ '--ar': `${m.w} / ${m.h}` } as React.CSSProperties}
        >
          <img
            src={m.src}
            alt={m.alt}
            width={m.w}
            height={m.h}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </figure>
      ))}
    </div>
  );
}
