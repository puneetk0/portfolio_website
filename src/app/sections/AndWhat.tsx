import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ls, serifItalic } from '../utils/constants';
import { Print } from '../components/Print';
import { CATEGORIES, sumAspect } from '../../data/portfolio';
import { DECK_QUERY, useMediaQuery } from '../hooks/useIsMobile';

export function AndWhat({ isActive }: { isActive: boolean }) {
  /* Not `isMobile`: the constraint is horizontal room for a dealt hand beside
     the text column, not device class. See DECK_QUERY. */
  const hasDecks = useMediaQuery(DECK_QUERY);
  /* Default-active, released on first pointer move.
     The section used to render three lines of text and nothing else until you
     hovered one of them — so the only real numbers anywhere on the home page
     (400+ attendees, 626,292 views, the wins) had a near-zero chance of being
     seen during the 30-60s scan a portfolio actually gets. Arriving here now
     shows a dealt hand of prints immediately; the first deliberate pointer
     movement hands control back to the reader. */
  const [active, setActive] = useState<number | null>(0);
  const [defaulted, setDefaulted] = useState(true);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelLeave = useCallback(() => {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
  }, []);
  const scheduleLeave = useCallback(() => {
    cancelLeave();
    leaveTimer.current = setTimeout(() => setActive(null), 300);
  }, [cancelLeave]);
  const activateRow = useCallback((i: number) => {
    cancelLeave();
    setDefaulted(false);
    setActive(i);
  }, [cancelLeave]);

  useEffect(() => () => { if (leaveTimer.current) clearTimeout(leaveTimer.current); }, []);

  /* Re-armed once per entry, so leaving and coming back shows the work again
     rather than an empty screen. */
  useEffect(() => {
    if (isActive) { setActive(0); setDefaulted(true); }
  }, [isActive]);

  // While defaulted, the deck is showing on its own initiative; a real pointer
  // move anywhere in the section releases it without needing to hit a row.
  const releaseDefault = useCallback(() => {
    if (defaulted) { setDefaulted(false); setActive(null); }
  }, [defaulted]);

  return (
    <>
      {/* Desktop decks. Positions are no longer in the data: the old hardcoded
          x/y pixels were measured from the section's top edge and stopped
          meaning anything once sections became grid-centred flow. Geometry now
          comes from each card's index inside its deck, in print.css. */}
      {hasDecks && (
        <div className="section-decor section-decor--decks" onPointerMove={releaseDefault}>
          <div className="deck-stage">
            {CATEGORIES.map((cat, catIdx) => (
              <div
                className="deck"
                key={cat.name}
                id={`deck-${catIdx}`}
                data-on={active === catIdx ? 'true' : 'false'}
                /* --n and --sum-ar are what let the stylesheet solve the frame
                   height from the room actually left beside the text column,
                   without knowing this strip's shape ahead of time. */
                style={{ '--n': cat.cards.length, '--sum-ar': sumAspect(cat.cards) } as React.CSSProperties}
                /* Only the dealt deck is exposed: the prints are the section's
                   entire content, so hiding all of them would leave a screen
                   reader three bare row labels — but the undealt decks are
                   still in the DOM at opacity 0. */
                aria-hidden={active === catIdx ? undefined : 'true'}
              >
                {cat.cards.map((card, cardIdx) => (
                  <div
                    className="deck__slot"
                    key={card.src}
                    style={{ '--i': cardIdx } as React.CSSProperties}
                  >
                    <Print
                      card={card}
                      frame={cardIdx + 1}
                      isVisible={active === catIdx}
                      cancelLeave={cancelLeave}
                      scheduleLeave={scheduleLeave}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="home__inner">
        <div className="section-content">
          <h2 className="t-eyebrow section-label" style={ls(0)}>
            <span aria-hidden="true" className="section-label__slash" style={serifItalic}>//</span>
            Beyond the screen
          </h2>

          <ol className="row-list">
            {CATEGORIES.map((cat, i) => {
              const isOpen = active === i;
              // ls() must sit on an OUTER element: `lineUp` uses
              // animation-fill-mode: forwards, so while it shared a node with
              // the hover state its filled opacity/transform won and the
              // dim-others + shift never rendered at all.
              return (
                <li key={cat.name} style={ls(i + 1)}>
                  <button
                    type="button"
                    className="row row--button"
                    aria-expanded={isOpen}
                    /* The strip only exists while open, so only point at it
                       then — a dangling aria-controls target is worse than
                       none. The deck is always in the DOM. */
                    aria-controls={hasDecks ? `deck-${i}` : isOpen ? `strip-${i}` : undefined}
                    /* Nothing is dimmed while the default deck is showing — the
                       reader has not chosen anything yet, so dimming two of
                       three rows would be asserting a choice they did not make. */
                    data-dim={!defaulted && active !== null && !isOpen ? 'true' : 'false'}
                    data-on={!defaulted && isOpen ? 'true' : 'false'}
                    onMouseEnter={() => activateRow(i)}
                    onMouseLeave={scheduleLeave}
                    onFocus={() => activateRow(i)}
                    onBlur={scheduleLeave}
                    onClick={() => (isOpen && !defaulted ? setActive(null) : activateRow(i))}
                  >
                    <span data-magnetic="true" className="row__inner">
                      <span className="t-row row__name">{cat.name}</span>
                      <span className="t-meta row__count">
                        {cat.cards.length} {cat.cards.length === 1 ? 'print' : 'prints'}
                      </span>
                    </span>
                  </button>

                  {/* Below the deck width: a flat x-snap row of prints, tilt
                      switched off. The dealt hand has no meaning at 375px, and
                      the section used to simply render nothing there. */}
                  {!hasDecks && isOpen && (
                    <div className="snap-x print-strip" id={`strip-${i}`}>
                      {cat.cards.map((card, ci) => (
                        <div className="print-strip__item" key={card.src}>
                          <Print
                            card={card}
                            frame={ci + 1}
                            isVisible
                            cancelLeave={cancelLeave}
                            scheduleLeave={scheduleLeave}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
}
