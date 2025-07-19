import React from 'react';

type SidebarIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

const SidebarIcon: React.FC<SidebarIconProps> = ({
  size = 24,
  color = 'currentColor',
  className
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    className={className}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18" />
  </svg>
);

export default SidebarIcon;
