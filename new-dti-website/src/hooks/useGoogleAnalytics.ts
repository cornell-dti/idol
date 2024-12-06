import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: any;
  }
}

const useGoogleAnalytics = (measurementId: string) => {
  const pathname = usePathname();

  const handleRouteChange = (path: string) => {
    console.log(path);
    window.gtag('config', measurementId, {
      page_path: path
    });
  };

  useEffect(() => {
    handleRouteChange(pathname);
  }, [pathname]);
};

export default useGoogleAnalytics;
