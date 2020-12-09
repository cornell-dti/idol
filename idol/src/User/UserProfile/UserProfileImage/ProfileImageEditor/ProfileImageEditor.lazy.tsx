import React, { lazy, Suspense } from 'react';

const LazyProfileImageEditor = lazy(() => import('./ProfileImageEditor'));

const ProfileImageEditor = (props: JSX.IntrinsicAttributes & {
  children?: React.ReactNode;
  currentProfileImage: string;
  setEditorRef: any;
  cropAndSubmitImage: any;
  setOpen: any;
}) => (
    <Suspense fallback={null}>
      <LazyProfileImageEditor {...props} />
    </Suspense>
  );

export default ProfileImageEditor;