import React from 'react';

type PresentIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

const PresentIcon = ({ size = 24, color = 'currentColor', className }: PresentIconProps) => (
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
    <path d="M10 7.75a.75.75 0 0 1 1.142-.638l3.664 2.249a.75.75 0 0 1 0 1.278l-3.664 2.25a.75.75 0 0 1-1.142-.64z" />
    <path d="M12 17v4" />
    <path d="M8 21h8" />
    <rect x="2" y="3" width="20" height="14" rx="2" />
  </svg>
);

export default PresentIcon;
