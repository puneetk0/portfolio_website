import React from 'react';
import { figtree, serifItalic } from '../utils/constants';
import { LBL } from './kit';

/* ─── Evidence components ─────────────────────────────────────────────────────
   2026 hiring screens on trade-offs, not process: rejected options *with the
   reason they were rejected* are what demonstrate judgment, while methodology
   diagrams actively hurt. Camber's `Option 01/02/03 + CHOSEN` cards and
   FindMyRepo's failed `Attempt 01` were already the right instinct — these
   generalise that instinct into the kit's spine.

   `verdict` is deliberately REQUIRED on a tradeoff. Camber's Options 01 and 02
   carried a rationale but no verdict line, which is exactly the missing
   "and here's why I didn't" that the screen is looking for. Making it
   non-optional means the omission is a type error, not an oversight.
   ───────────────────────────────────────────────────────────────────────────── */

export type TradeoffStatus = 'chosen' | 'rejected' | 'resolved';

export interface Tradeoff {
  /** "Option 01", "Attempt 01", "Problem 01" */
  id: string;
  title: string;
  rationale: string;
  /** Why it was rejected, or what choosing it produced. Required by design. */
  verdict: string;
  status: TradeoffStatus;
  /** Optional hard number, rendered in tabular figures. */
  metric?: string;
}

const GLYPH: Record<TradeoffStatus, string> = {
  chosen: '→',
  resolved: '→',
  rejected: '✕',
};

export function TradeoffCards({
  items,
  variant = 'columns',
}: {
  items: Tradeoff[];
  /** `columns` reproduces Camber's full-bleed 3-up, `boxes` FindMyRepo's
   *  bordered attempt cards, `stack` Sportfolio's problem list. */
  variant?: 'columns' | 'boxes' | 'stack';
}) {
  return (
    <ol className="tradeoffs" data-variant={variant} data-cols={variant === 'columns' ? items.length : undefined}>
      {items.map(t => (
        <li key={t.id} className="tradeoff" data-status={t.status}>
          <p className="tradeoff__id" style={LBL}>{t.id}</p>
          {t.status === 'chosen' && <span className="tradeoff__badge" style={LBL}>CHOSEN</span>}
          <p className="tradeoff__title">{t.title}</p>
          <p className="tradeoff__rationale">{t.rationale}</p>
          <p className="tradeoff__verdict">
            <span aria-hidden="true" className="tradeoff__glyph">{GLYPH[t.status]}</span>{' '}
            {t.verdict}
            {t.metric && <span className="tradeoff__metric">{t.metric}</span>}
          </p>
        </li>
      ))}
    </ol>
  );
}

/* ── Stats ── */
export interface Stat {
  value: string;
  label: string;
  sub?: string;
}

export function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <dl className="stat-row" data-cols={stats.length}>
      {stats.map(s => (
        <div key={s.label} className="stat">
          <dd className="stat__value">{s.value}</dd>
          <dt className="stat__label" style={LBL}>{s.label}</dt>
          {s.sub && <p className="stat__sub">{s.sub}</p>}
        </div>
      ))}
    </dl>
  );
}

/* ── Quote ──
   `evidenceHref` is the cheap fix for "unverifiable": a screenshot of the DM or
   the review turns a claim into something a reviewer can click. */
export interface Quote {
  text: string;
  attribution: string;
  source?: string;
  evidenceHref?: string;
}

export function PullQuote({ quote }: { quote: Quote }) {
  return (
    <figure className="pull-quote">
      <blockquote style={serifItalic}>&ldquo;{quote.text}&rdquo;</blockquote>
      <figcaption style={LBL}>
        {quote.attribution}
        {quote.source && <span className="pull-quote__source"> · {quote.source}</span>}
        {quote.evidenceHref && (
          <>
            {' '}
            <a href={quote.evidenceHref} target="_blank" rel="noreferrer" className="pull-quote__evidence">
              see it <span aria-hidden="true">↗</span>
            </a>
          </>
        )}
      </figcaption>
    </figure>
  );
}

/* ── Before / after ──
   Absent from every case study. It is one of the listed requirements, and the
   cheapest form is two text panels plus a delta, which needs no new assets. */
export interface BeforeAfterSpec {
  beforeLabel: string;
  before: string;
  afterLabel: string;
  after: string;
  delta?: string;
}

export function BeforeAfter({ spec }: { spec: BeforeAfterSpec }) {
  return (
    <div className="before-after" data-cols={2}>
      <div className="before-after__side" data-side="before">
        <p style={LBL}>{spec.beforeLabel}</p>
        <p className="before-after__body">{spec.before}</p>
      </div>
      <div className="before-after__side" data-side="after">
        <p style={LBL}>{spec.afterLabel}</p>
        <p className="before-after__body">{spec.after}</p>
        {spec.delta && <p className="before-after__delta" style={figtree}>{spec.delta}</p>}
      </div>
    </div>
  );
}
