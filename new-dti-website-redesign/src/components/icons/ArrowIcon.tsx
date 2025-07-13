import React from 'react';

type ArrowIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

const ArrowIcon = ({ size = 24, color = 'currentColor', className = '' }: ArrowIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default ArrowIcon;
