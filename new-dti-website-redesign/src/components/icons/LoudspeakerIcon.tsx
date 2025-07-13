import React from 'react';

type LoudspeakerIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

const LoudspeakerIcon = ({
  size = 24,
  color = 'currentColor',
  className = ''
}: LoudspeakerIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 11L21 6V18L3 14V11Z"
      width={size}
      height={size}
      stroke={color}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
    />
    <path
      d="M11.5997 16.8002C11.4947 17.181 11.3156 17.5374 11.0728 17.8491C10.83 18.1607 10.5282 18.4215 10.1847 18.6165C9.84108 18.8115 9.46245 18.9369 9.07041 18.9856C8.67836 19.0343 8.28056 19.0053 7.89973 18.9002C7.51889 18.7951 7.16248 18.6161 6.85084 18.3733C6.5392 18.1305 6.27844 17.8287 6.08343 17.4851C5.88843 17.1415 5.76301 16.7629 5.71433 16.3709C5.66565 15.9788 5.69467 15.581 5.79973 15.2002"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default LoudspeakerIcon;
