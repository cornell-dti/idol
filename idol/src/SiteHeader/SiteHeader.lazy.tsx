import React, { lazy, Suspense } from 'react';

const LazySiteHeader = lazy(() => import('./SiteHeader'));

const SiteHeader = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazySiteHeader {...props} />
  </Suspense>
);

export default SiteHeader;
