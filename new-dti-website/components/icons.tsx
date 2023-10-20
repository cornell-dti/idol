import React from 'react';

interface IconProps {
  defaultClass: string;
  altText: string;
}

const Icons: React.FC<IconProps> = ({ defaultClass, altText }) => (
  <div 
    className={`icon-container ${defaultClass}`}
    aria-label={altText} 
    role="img"
  ></div>
);

export default Icons;
