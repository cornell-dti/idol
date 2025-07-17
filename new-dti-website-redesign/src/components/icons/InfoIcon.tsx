import React from 'react';

type IncoIconProps = {
  size?: number;
  color?: string;
  className?: string;
  decoration?: boolean;
};

const InfoIcon = ({
  size = 24,
  color = 'currentColor',
  className = '',
  decoration
}: IncoIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="transparent"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={decoration}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

export default InfoIcon;
