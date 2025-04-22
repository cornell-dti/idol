import React, { useEffect, useState, ReactNode } from 'react';
import Marquee from 'react-fast-marquee';

type ScrollingMarqueeProps = {
  children: ReactNode;
};

const ScrollingMarquee: React.FC<ScrollingMarqueeProps> = ({ children }) => {
  const [shouldPlay, setShouldPlay] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setShouldPlay(false);
    }
  }, []);

  return (
    <div className="h-24">
      <div className="w-full z-5 bg-background-1 border-t border-b border-border-1 absolute left-0 controlChildDivWidth overflow-y-hidden">
        <Marquee
          gradient
          gradientWidth={128}
          gradientColor={'#0D0D0D'}
          speed={60}
          pauseOnHover
          play={shouldPlay}
          className="flex w-fit"
        >
          {children}
        </Marquee>
      </div>
    </div>
  );
};

export default ScrollingMarquee;
