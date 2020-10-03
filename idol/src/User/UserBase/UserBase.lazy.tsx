import React, { lazy, Suspense } from 'react';

const LazyUserBase = lazy(() => import('./UserBase'));

const UserBase = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyUserBase {...props} />
  </Suspense>
);

export default UserBase;
