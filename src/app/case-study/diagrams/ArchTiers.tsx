import React from 'react';
import { ARCH_TIERS } from './sportfolio-arch';

/* Mobile rendition of the architecture diagram. Same model as the SVG, so the
   two cannot drift apart. Depth here is structural — hairline-bordered tiers
   and an indented sub-component list — rather than a scaled-down drawing with
   7px type. */
export function ArchTiers() {
  return (
    <ol className="arch-tiers" aria-label="System architecture, by tier">
      {ARCH_TIERS.map(tier => (
        <li key={tier.key} className="arch-tier">
          <p className="arch-tier__label">{tier.label}</p>
          <ul className="arch-tier__nodes">
            {tier.nodes.map(node => (
              <li
                key={node.name}
                className="arch-node"
                data-primary={node.primary ? 'true' : 'false'}
              >
                <span className="arch-node__name">{node.name}</span>
                <span className="arch-node__detail">{node.detail}</span>
              </li>
            ))}
          </ul>
          {tier.edgeToNext && (
            <p className="arch-tier__edge">
              <span aria-hidden="true">↓</span> {tier.edgeToNext}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
