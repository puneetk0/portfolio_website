import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

/* Replaces the old generic CaseStudy.tsx, which rendered invented metrics from
   a fabricated data block and — because every real slug had its own explicit
   route — only ever reached its own 404 branch anyway. That 404 also hardcoded
   #141414/#444/#888, so it was broken in light mode. */
export function NotFound() {
  useEffect(() => {
    document.title = 'Not found | Puneet Kathuria';
  }, []);

  return (
    <main className="notfound">
      <p className="t-eyebrow">404</p>
      <h1 className="t-h1">That page doesn&rsquo;t exist.</h1>
      <p className="t-body">
        The link may be out of date. Everything lives on the home page.
      </p>
      <Link to="/" className="cta-link cta-link--ghost">
        Back to work <span aria-hidden="true">&rarr;</span>
      </Link>
    </main>
  );
}
