import React, { lazy, Suspense } from 'react';

const LazyAddUser = lazy(() => import('./AddUser'));

const AddUser = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyAddUser {...props} />
  </Suspense>
);

export default AddUser;
