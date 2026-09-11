import { useEffect } from 'react';
import { auditEvidence, hasRejectedOption, type CaseStudyContent } from './types';

/* Dev-only. Reports what a case study is still missing so gaps are a visible,
   countable list rather than a silent absence. Renders nothing, ever — this is
   an authoring aid, not a UI element, and it compiles out of production. */
export function EvidenceAudit({ content }: { content: CaseStudyContent }) {
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const missing = auditEvidence(content);
    const noRejected = content.tradeoffs.length > 0 && !hasRejectedOption(content);

    if (missing.length === 0 && !noRejected) return;

    const lines = [`evidence audit — ${content.name}`];
    if (missing.length) lines.push(`  missing: ${missing.join(', ')}`);
    if (noRejected) {
      lines.push(
        '  no tradeoff has status "rejected" — problem→resolution cards keep the',
        '  visual language but do not show a decision that was turned down'
      );
    }
    if (content.evidenceGaps?.length) {
      lines.push(`  acknowledged gaps: ${content.evidenceGaps.join(', ')}`);
    }
    // eslint-disable-next-line no-console
    console.info(lines.join('\n'));
  }, [content]);

  return null;
}
