import React, { useRef, useCallback } from 'react';
import type { PrintDef } from '../../data/portfolio';

/* ─── Print ───────────────────────────────────────────────────────────────────
   A darkroom contact print, replacing the Polaroid.

   The swap is a palette decision, not a style preference. A Polaroid's white
   frame exists to hold a *colour* print and its sepia cast is a colour move —
   on a site that rules out colour everywhere else, the polaroids were the one
   element fighting the palette. A contact print is paper, silver and black, so
   the metaphor is already monochrome and the photograph can be `grayscale(1)`
   without looking like an effect applied to it.

   Three things here are fixes rather than restyling:

   1. The image well takes the photograph's OWN aspect ratio, from the required
      `w`/`h`. The old forced `aspect-ratio: 1/1` + `objectFit: cover` cropped a
      3:4 group shot into a square — cutting heads and feet — and reduced the
      16:9 auditorium photo to a square centre crop, destroying the only image
      that actually evidences "400+ attendees". At the true ratio there is no
      crop at all.

   2. The glare is written as CSS custom properties on a ref. It used to be
      `useState` on every `mousemove`, across seven mounted instances.

   3. All motion lives in print.css, so one `prefers-reduced-motion` block can
      switch it off — inline transitions could not be reached by a media query.
   ───────────────────────────────────────────────────────────────────────────── */

export function Print({ card, frame, isVisible, cancelLeave, scheduleLeave }: {
  card: PrintDef;
  /** 1-based position in its deck; printed in the rebate as 01, 02, 03. */
  frame: number;
  isVisible: boolean;
  /* Only the "Beyond the screen" decks need these: there, moving the pointer
     from a row onto a card must not dismiss the card. The hero's resting deck
     has no such hand-off, so they are optional. */
  cancelLeave?: () => void;
  scheduleLeave?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);

  const onEnter = useCallback(() => {
    cancelLeave?.();
    ref.current?.style.setProperty('--g', '1');
  }, [cancelLeave]);

  const onLeave = useCallback(() => {
    scheduleLeave?.();
    ref.current?.style.setProperty('--g', '0');
  }, [scheduleLeave]);

  return (
    <figure
      className="print"
      data-on={isVisible ? 'true' : 'false'}
      /* Both the deck tilt and the aspect ratio are data, so they arrive as
         custom properties and the stylesheet decides whether to honour them —
         which is what lets the mobile strip ignore the tilt entirely. */
      style={{ '--tilt': `${card.tilt}deg`, '--ar': `${card.w} / ${card.h}` } as React.CSSProperties}
    >
      <div
        ref={ref}
        className="print__mount"
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onPointerMove={onMove}
      >
        <div className="print__well">
          <img
            src={card.src}
            alt={card.alt}
            width={card.w}
            height={card.h}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="print__img"
            /* Only set for frames whose subject is off-centre; otherwise the
               stylesheet's default centre crop applies. */
            style={card.objectPosition ? { objectPosition: card.objectPosition } : undefined}
          />
          <span aria-hidden="true" className="print__gloss" />
          {/* The single handwritten mark, made ON the emulsion — which is where
              a grease-pencil mark on a real contact sheet goes. Keeping it out
              of the rebate is also structural: in the rebate its larger line
              box made annotated cards taller than their siblings, so a dealt
              hand came out ragged for a reason nobody chose. */}
          {card.note && <span aria-hidden="true" className="print__note">{card.note}</span>}
        </div>

        <figcaption className="print__rebate">
          <span aria-hidden="true" className="print__frame">
            {String(frame).padStart(2, '0')}
          </span>
          <span className="print__lines">
            <span className="print__title">{card.title}</span>
            <span className="print__meta">{card.meta}</span>
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
