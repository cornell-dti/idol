import React, { lazy, Suspense } from 'react';

const LazySpotlight = lazy(() => import('./Spotlight'));

const Spotlight = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazySpotlight {...props} />
  </Suspense>
);

export default Spotlight;
