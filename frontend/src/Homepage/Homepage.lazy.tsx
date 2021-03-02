import React, { lazy, Suspense } from 'react';

const LazyHomepage = lazy(() => import('./Homepage'));

const Homepage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyHomepage {...props} />
  </Suspense>
);

export default Homepage;
