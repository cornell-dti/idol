import React, { lazy, Suspense } from 'react';
import LoadingScreen from '../../../design-system-2026/components/LoadingScreen/LoadingScreen';

const LazyHomepage = lazy(() => import('./Homepage'));

const Homepage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode }): JSX.Element => (
  <Suspense fallback={<LoadingScreen />}>
    <LazyHomepage {...props} />
  </Suspense>
);

export default Homepage;
