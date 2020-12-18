import React, { lazy, Suspense } from 'react';

const LazyUserProfileImage = lazy(() => import('./UserProfileImage'));

const UserProfileImage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyUserProfileImage {...props} />
  </Suspense>
);

export default UserProfileImage;