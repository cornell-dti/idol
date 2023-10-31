'use client';

import React, { useEffect, useState } from 'react';
import Icon from '../../components/icons';
import Slideshow from '../../components/slideshow';

const Home: React.FC = () => {
  const [selectedIcon, setSelectedIcon] = useState<number | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const icons = [
    {
      src: '/images/DTI_notsel.png',
      hover: '/images/DTI_hover.png',
      active: '/images/DTI_current.png',
      altText: 'DTI',
      width: 80,
      height: 80
    },
    {
      src: '/images/Family_notsel.png',
      hover: '/images/Family_hover.png',
      active: '/images/Family_current.png',
      altText: 'Family',
      width: 80,
      height: 80
    },
    {
      src: '/images/Collaboration_notsel.png',
      hover: '/images/Collaboration_hover.png',
      active: '/images/Collaboration_current.png',
      altText: 'Collaboration',
      width: 100,
      height: 80
    },
    {
      src: '/images/Events_notsel.png',
      hover: '/images/Events_hover.png',
      active: '/images/Events_current.png',
      altText: 'Events',
      width: 90,
      height: 90
    },
    {
      src: '/images/Initiatives_notsel.png',
      hover: '/images/Initiatives_hover.png',
      active: '/images/Initiatives_current.png',
      altText: 'Initiatives',
      width: 80,
      height: 80
    }
  ];

  useEffect(() => {
    if (timer) clearTimeout(timer);

    setTimer(
      setTimeout(() => {
        if (selectedIcon === null || selectedIcon >= icons.length - 1) {
          setSelectedIcon(0);
        } else {
          setSelectedIcon(selectedIcon + 1);
        }
      }, 3000)
    );

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [selectedIcon]);

  return (
    <div
      className="flex items-center justify-start pl-[20%] bg-black bg-cover bg-center h-screen"
      style={{ backgroundImage: "url('/images/hero_bg.png')" }}
    >
      <div className="flex flex-col items-start mr-12">
        <div>
          <h2 className="text-white mb-5 text-6xl">
            Cornell Digital <br /> Tech & Innovation
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          {icons.map((icon, index) => (
            <Icon
              key={index}
              icon={icon.src}
              hoverIcon={icon.hover}
              activeIcon={icon.active}
              altText={icon.altText}
              isActive={selectedIcon === index}
              onClick={() => {
                setSelectedIcon(index);
                if (timer) clearTimeout(timer);
              }}
              width={icon.width}
              height={icon.height}
            />
          ))}
        </div>
      </div>
      <Slideshow selectedImage={selectedIcon} />
    </div>
  );
};

export default Home;
