import React, { lazy, Suspense } from 'react';
import { EventEmitter } from '../../EventEmitter/event-emitter';

const LazyErrorModal = lazy(() => import('./ErrorModal'));

const ErrorModal = (props: JSX.IntrinsicAttributes & {
  children?: React.ReactNode;
  onEmitter: EventEmitter<{ headerMsg: string, contentMsg: string }>
}) => (
    <Suspense fallback={null}>
      <LazyErrorModal {...props} />
    </Suspense>
  );

export default ErrorModal;
