import { useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: any;
  }
}

const useGoogleAnalytics = (measurementId: string) => {
  const pathname = usePathname();

  const handleRouteChange = useCallback(
    (path: string) => {
      window.gtag('config', measurementId, {
        page_path: path
      });
    },
    [measurementId]
  );

  useEffect(() => {
    handleRouteChange(pathname);
  }, [pathname, handleRouteChange]);
};

export default useGoogleAnalytics;
