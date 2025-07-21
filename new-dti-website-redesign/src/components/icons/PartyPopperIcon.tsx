import React from 'react';

type PartyPopperIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

const PartyPopperIcon = ({
  size = 24,
  color = 'currentColor',
  className
}: PartyPopperIconProps) => (
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
    <path
      d="M5.8 11.2998L2 21.9998L12.7 18.2098"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M4 3H4.01"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M22 8H22.01"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M15 2H15.01"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M22 20H22.01"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M22 2L19.76 2.75C19.1224 2.96239 18.5783 3.38964 18.2208 3.95872C17.8633 4.52781 17.7146 5.20339 17.8 5.87C17.9 6.73 17.23 7.5 16.35 7.5H15.97C15.11 7.5 14.37 8.1 14.21 8.94L14 10"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M22 12.9999L21.18 12.6699C20.32 12.3299 19.36 12.8699 19.2 13.7799C19.09 14.4799 18.48 14.9999 17.77 14.9999H17"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11 2L11.33 2.82C11.67 3.68 11.13 4.64 10.22 4.8C9.52 4.9 9 5.52 9 6.23V7"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11.0005 12.9995C12.9305 14.9295 13.8305 17.1695 13.0005 17.9995C12.1705 18.8295 9.93051 17.9295 8.00051 15.9995C6.07051 14.0695 5.17051 11.8295 6.00051 10.9995C6.83051 10.1695 9.07051 11.0695 11.0005 12.9995Z"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default PartyPopperIcon;
