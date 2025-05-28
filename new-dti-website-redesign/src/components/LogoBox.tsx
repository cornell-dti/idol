import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fillWidth?: boolean;
  href?: string;
  noLink?: boolean;
  ariaLabel?: string;
  border?: boolean;
};

const LogoBox: React.FC<Logo> = ({
  src,
  alt,
  width,
  height,
  fillWidth,
  href,
  noLink,
  ariaLabel,
  border = true
}) => {
  const content = (
    <div
      className={`flex items-center justify-center h-24 p-4 border-r-0 ${
        border ? 'border-border-1 border-l-1 border-b-1' : ''
      }`}
      style={{ width: fillWidth ? '100%' : '160px' }}
    >
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

  if (noLink || !href) {
    return content;
  }

  return (
    <Link
      href={href}
      className="hover:bg-background-2 transition-[background-color] duration-[120ms] focusState"
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
    >
      {content}
    </Link>
  );
};

export default LogoBox;
