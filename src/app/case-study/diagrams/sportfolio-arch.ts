/* ─── Sportfolio architecture model ───────────────────────────────────────────
   The hand-authored SVG is the best artifact in the repo, but it lives on a
   960x480 viewBox with 6-9.5px type: below ~900px it scales down until the
   labels are unreadable.

   Rather than maintain a second drawing, both views read from this one model —
   the SVG on desktop, a stacked tier list on mobile — so they cannot drift.
   ───────────────────────────────────────────────────────────────────────────── */

export interface ArchNode {
  name: string;
  detail: string;
  /** A primary system in its tier, versus a sub-component of one. */
  primary?: boolean;
}

export interface ArchTier {
  key: string;
  label: string;
  nodes: ArchNode[];
  /** How this tier talks to the next one down. */
  edgeToNext?: 'HTTP' | 'WebSocket' | 'HTTP / service call' | 'driver';
}

export const ARCH_TIERS: ArchTier[] = [
  {
    key: 'client',
    label: 'Client',
    edgeToNext: 'HTTP',
    nodes: [
      { name: 'React 18 SPA', detail: 'TypeScript · Tailwind · RHF', primary: true },
      { name: 'Price Context', detail: 'rAF batching' },
      { name: 'TanStack Query', detail: 'server state' },
      { name: 'Recharts + D3.js', detail: 'price charts · sparklines' },
      { name: 'WS Client', detail: 'live price subscriptions' },
    ],
  },
  {
    key: 'gateway',
    label: 'Gateway',
    edgeToNext: 'HTTP / service call',
    nodes: [
      { name: 'FastAPI', detail: 'async · JWT · slowapi · Pydantic v2', primary: true },
      { name: 'WS /ws/prices', detail: 'global + per-athlete subscriptions' },
    ],
  },
  {
    key: 'services',
    label: 'Services',
    edgeToNext: 'driver',
    nodes: [
      { name: 'Price Engine', detail: 'sport scoring', primary: true },
      { name: 'Trading Engine', detail: 'buy · sell · supply', primary: true },
      { name: 'Dividend Engine', detail: 'DDPS · time-weighted', primary: true },
      { name: 'ML Ensemble', detail: 'APScheduler · retrain on demand' },
      { name: 'APScheduler', detail: 'cron · score updates' },
      { name: 'WS Manager', detail: 'broadcast · fan-out' },
    ],
  },
  {
    key: 'persistence',
    label: 'Persistence',
    nodes: [{ name: 'MongoDB', detail: 'Motor async driver', primary: true }],
  },
];

/** Accessible description for the SVG, which previously had no name at all —
 *  it was invisible to screen readers and to find-in-page. */
export const ARCH_DESCRIPTION =
  ARCH_TIERS.map(t => `${t.label}: ${t.nodes.map(n => n.name).join(', ')}`).join('. ') +
  '. Prices flow from the scoring engines through a WebSocket manager to subscribed clients.';
