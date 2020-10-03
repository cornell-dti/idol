import React, { lazy, Suspense } from 'react';

const LazyEditTeam = lazy(() => import('./EditTeam'));

const EditTeam = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyEditTeam {...props} />
  </Suspense>
);

export default EditTeam;
