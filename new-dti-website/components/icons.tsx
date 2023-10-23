import React, { useState } from 'react';

interface IconProps {
  icon: string;
  hoverIcon: string;
  activeIcon: string;
  altText: string;
  isActive: boolean;
  onClick: () => void;
}

const Icon: React.FC<IconProps> = ({ icon, hoverIcon, activeIcon, altText, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  let currentIcon = icon;

  if (isActive) {
    currentIcon = activeIcon;
  } else if (isHovered) {
    currentIcon = hoverIcon;
  }

  return (
    <img
      src={currentIcon}
      alt={altText}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="cursor-pointer"
    />
  );
};

export default Icon;
