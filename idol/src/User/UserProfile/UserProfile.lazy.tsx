import React, { lazy, Suspense } from 'react';

const LazyUserProfile = lazy(() => import('./UserProfile'));

const UserProfile = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyUserProfile {...props} />
  </Suspense>
);

export default UserProfile;