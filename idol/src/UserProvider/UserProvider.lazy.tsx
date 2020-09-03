import React, { lazy, Suspense } from 'react';

const LazyUserProvider = lazy(() => import('./UserProvider'));

const UserProvider = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyUserProvider {...props} />
  </Suspense>
);

export default UserProvider;
