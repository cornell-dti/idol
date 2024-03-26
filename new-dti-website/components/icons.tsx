'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface IconProps {
  icon: string;
  hoverIcon: string;
  activeIcon: string;
  altText: string;
  isActive: boolean;
  onClick: () => void;
  width: number;
  height: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  icon,
  hoverIcon,
  activeIcon,
  altText,
  isActive,
  onClick,
  width,
  height,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);

  let currentIcon = icon;

  if (isActive) {
    currentIcon = activeIcon;
  } else if (isHovered) {
    currentIcon = hoverIcon;
  }

  return (
    <Image
      src={currentIcon}
      alt={altText}
      width={width}
      height={height}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`cursor-pointer ${className || ''}`}
    />
  );
};

export default Icon;
