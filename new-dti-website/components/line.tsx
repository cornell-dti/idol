import React, { useEffect, useState, FC } from 'react';

type Props = {
  angle: number;
  length: number;
};

const Line: FC<Props> = ({ angle, length }) => {
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  let opacity = (scrollY - 100) / (300 - 100);
  opacity = Math.min(Math.max(opacity, 0), 1);

  const lineStyle = `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white opacity-${opacity * 100} transition-opacity duration-300`;
  const dynamicStyle = {
    width: `${length}px`, // line length is controlled by 'length' prop
    height: '2px',        // line thickness
    transform: `rotate(${angle}deg)`,
    opacity
  };

  return (
    <div
      className={lineStyle}
      style={dynamicStyle}
    />
  );
};

export default Line;
