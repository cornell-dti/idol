import React, { lazy, Suspense } from 'react';
import LoadingScreen from '../../../design-system-2026/components/LoadingScreen/LoadingScreen';

const LazySignIn = lazy(() => import('./SignIn'));

const SignIn = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode }): JSX.Element => (
  <Suspense fallback={<LoadingScreen />}>
    <LazySignIn {...props} />
  </Suspense>
);

export default SignIn;
