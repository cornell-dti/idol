import React, { lazy, Suspense } from 'react';

const LazyBanner = lazy(() => import('./Banner'));

const Banner = (props: JSX.IntrinsicAttributes & {
  title: string,
  message: string,
  style?: React.CSSProperties,
  children?: React.ReactNode;
}) => (
    <Suspense fallback={null}>
      <LazyBanner {...props} />
    </Suspense>
  );

export default Banner;
