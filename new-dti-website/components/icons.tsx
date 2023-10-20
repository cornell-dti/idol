import React from 'react';

interface IconProps {
  defaultClass: string;
  altText: string;
  dataIndex: number;
}

const Icons: React.FC<IconProps> = ({ defaultClass, altText, dataIndex }) => (
  <div 
    className={`icon-container ${defaultClass}`}
    aria-label={altText} 
    role="img"
    data-index={dataIndex}
  ></div>
);

export default Icons;
