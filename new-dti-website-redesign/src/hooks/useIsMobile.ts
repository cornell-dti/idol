'use client';

import { useLayoutEffect, useState } from 'react';

const useIsMobile = (width: number | undefined) => {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    if (width === undefined) return;
    setIsMobile(width < 640);
  }, [width]);

  return isMobile;
};

export default useIsMobile;
