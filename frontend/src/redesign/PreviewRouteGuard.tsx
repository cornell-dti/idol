import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePreview, usePreviewToggle } from './preview';
import LoadingScreen from '../design-system-2026/components/LoadingScreen/LoadingScreen';

const PREVIEW_ONLY_ROUTES = ['/help', '/settings'];

/** Existing routes (including Profile) keep their released version when preview is off. */
export default function PreviewRouteGuard({
  children
}: {
  readonly children: ReactNode;
}): JSX.Element {
  const router = useRouter();
  const preview = usePreview();
  const { ready } = usePreviewToggle();
  const previewOnly = PREVIEW_ONLY_ROUTES.some(
    (path) => router.pathname === path || router.pathname.startsWith(`${path}/`)
  );
  const blocked = previewOnly && (!ready || !preview);
  useEffect(() => {
    if (router.isReady && ready && previewOnly && !preview) router.replace('/');
  }, [router, router.isReady, ready, previewOnly, preview]);
  return blocked ? <LoadingScreen /> : <>{children}</>;
}
