import React from 'react';

type TrendUpIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

const TrendUpIcon = ({ size = 24, color = 'currentColor', className = '' }: TrendUpIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 7h6v6" />
    <path d="m22 7-8.5 8.5-5-5L2 17" />
  </svg>
);

export default TrendUpIcon;
