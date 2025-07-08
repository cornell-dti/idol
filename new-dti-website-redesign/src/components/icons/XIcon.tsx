import React from 'react';

type XIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

const XIcon = ({ size = 24, color = 'foreground-1', className }: XIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={`var(--${color})`}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export default XIcon;
