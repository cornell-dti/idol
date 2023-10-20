import React from 'react';

interface IconProps {
  defaultClass: string;
  altText: string;
  dataIndex: number;
  onClick: () => void;
}

const Icons: React.FC<IconProps> = ({ defaultClass, altText, dataIndex, onClick }) => (
  <div 
    className={`icon-container ${defaultClass}`}
    aria-label={altText} 
    role="img"
    data-index={dataIndex}
    onClick={onClick}
  ></div>
);

export default Icons;
