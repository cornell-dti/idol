import React from 'react';

type FacebookIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

const FacebookIcon: React.FC<FacebookIconProps> = ({
  size = 24,
  color = 'currentColor',
  className
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.5 12.0625C22.5 6.26406 17.7984 1.5625 12 1.5625C6.20156 1.5625 1.5 6.26406 1.5 12.0625C1.5 17.3031 5.33906 21.647 10.3594 22.4355V15.0986H7.69266V12.0625H10.3594V9.74922C10.3594 7.11812 11.9273 5.66359 14.3255 5.66359C15.4744 5.66359 16.6763 5.86891 16.6763 5.86891V8.45312H15.3516C14.048 8.45312 13.6402 9.26219 13.6402 10.0937V12.0625H16.552L16.087 15.0986H13.6406V22.4364C18.6609 21.6484 22.5 17.3045 22.5 12.0625Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default FacebookIcon;
