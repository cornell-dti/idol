import React from 'react';

type MailIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

const MailIcon = ({ size = 24, color = 'foreground-1', className }: MailIconProps) => (
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
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default MailIcon;
