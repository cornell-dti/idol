'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import ReactFastMarquee from 'react-fast-marquee';

type MarqueeProps = {
  children: ReactNode;
  height?: number;
};

const Marquee: React.FC<MarqueeProps> = ({ children, height }) => {
  const [shouldPlay, setShouldPlay] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setShouldPlay(false);
    }
  }, []);

  return (
    <div style={{ height }}>
      <div className="w-full z-5 bg-background-1 absolute left-0 controlChildDivWidth overflow-y-hidden">
        <ReactFastMarquee
          gradient
          gradientWidth={128}
          gradientColor={'#0D0D0D'}
          speed={60}
          pauseOnHover
          play={shouldPlay}
          className="flex w-fit"
        >
          {children}
        </ReactFastMarquee>
      </div>
    </div>
  );
};

export default Marquee;
