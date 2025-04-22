import React, { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import Image from 'next/image';

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

const logos: Logo[] = [
  { src: '/products/logos/cuapts.svg', alt: 'CU Apartments logo', width: 110, height: 80 },
  { src: '/products/logos/queuemein.svg', alt: 'Queue Me In logo', width: 80, height: 80 },
  { src: '/products/logos/zing.svg', alt: 'Zing logo', width: 111, height: 100 },
  { src: '/products/logos/cureviews.svg', alt: 'CU Reviews logo', width: 80, height: 80 },
  { src: '/products/logos/cornellgo.svg', alt: 'CornellGo logo', width: 80, height: 80 },
  { src: '/products/logos/courseplan.svg', alt: 'Courseplan logo', width: 60, height: 60 },
  { src: '/products/logos/carriage.svg', alt: 'Carriage logo', width: 70, height: 70 },
  {
    src: '/products/logos/design@cornell.svg',
    alt: 'Design @ Cornell logo',
    width: 125,
    height: 52
  }
];

const LogoBox: React.FC<Logo> = ({ src, alt, width, height }) => (
  <div className="flex items-center justify-center w-40 h-24 border-l border-l-border-1">
    <Image
      src={src}
      alt={alt}
      unoptimized
      width={width}
      height={height}
      style={{ width: `${width}px`, height: `${height ?? 'auto'}px` }}
    />
  </div>
);

const ScrollingMarquee = () => {
  const [shouldPlay, setShouldPlay] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setShouldPlay(false);
    }
  }, []);

  return (
    <div className="h-24">
      <div className="w-full z-5 bg-background-1 border-t border-b border-border-1 absolute left-0 controlChildDivWidth">
        <Marquee
          gradient={true}
          gradientWidth={128}
          gradientColor={'#0D0D0D'}
          speed={60}
          pauseOnHover
          play={shouldPlay}
          className="flex w-fit"
        >
          {logos.map((logo, index) => (
            <LogoBox key={index} {...logo} />
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default ScrollingMarquee;
