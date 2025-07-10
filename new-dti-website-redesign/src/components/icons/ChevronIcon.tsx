import React from 'react';

type ChevronIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

const ChevronIcon = ({ size = 24, color = 'currentColor', className = '' }: ChevronIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 25"
    fill="none"
    className={className}
  >
    <path
      d="M6 9.5L12 15.5L18 9.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChevronIcon;
