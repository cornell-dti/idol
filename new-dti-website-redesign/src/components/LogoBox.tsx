import React from 'react';
import Image from 'next/image';

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

const LogoBox: React.FC<Logo> = ({ src, alt, width, height }) => (
  <div className="flex items-center justify-center w-40 h-24">
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

export default LogoBox;
