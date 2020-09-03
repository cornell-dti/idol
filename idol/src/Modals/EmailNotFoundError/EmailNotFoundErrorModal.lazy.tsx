import React, { lazy, Suspense } from 'react';

const LazyEmailNotFoundErrorModal = lazy(() => import('./EmailNotFoundErrorModal'));

const EmailNotFoundErrorModal = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyEmailNotFoundErrorModal {...props} />
  </Suspense>
);

export default EmailNotFoundErrorModal;
