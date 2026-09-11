import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { resolveSlug } from './registry';
import { NotFound } from './NotFound';

export function CaseStudyRoute() {
  const { slug } = useParams();
  const { entry, redirectTo } = resolveSlug(slug);

  if (redirectTo) return <Navigate to={`/case-study/${redirectTo}`} replace />;
  if (!entry) return <NotFound />;

  const { Component } = entry;
  return <Component />;
}
