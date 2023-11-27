'use client';

import React, { useEffect, useRef, useState } from 'react';
import Icon from '../../components/icons';
import Slideshow from '../../components/slideshow';
import Bottom from '../../components/bottom';

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

  const scrollRef = useRef(null);

  const scrollToContent = () => {
    if (scrollRef.current) {
      const topPosition = (scrollRef.current as HTMLDivElement).offsetTop;
      window.scrollTo({
        top: topPosition,
        behavior: 'smooth'
      });
    }
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIcon]);

  return (
    <div>
      <div
        className="flex items-center justify-start pl-[15%] bg-black bg-cover bg-center h-screen"
        style={{ backgroundImage: "url('/images/hero_bg.png')" }}
      >
        <div className="flex flex-col items-start mr-12">
          <div className="mb-5">
            <h2 className="text-white text-6xl">
              Cornell Digital <br /> Tech & Innovation
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {icons.map((icon, index) => (
              <div key={index} className="flex items-center justify-center h-[90px]">
                <Icon
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
              </div>
            ))}
          </div>
        </div>
        <Slideshow selectedImage={selectedIcon} />
        <div className="fixed inset-x-0 bottom-5 flex justify-center">
          <button
            onClick={scrollToContent}
            className="text-white text-lg font-semibold cursor-pointer flex flex-col items-center"
            style={{ transition: 'all 0.3s ease' }}
          >
            LEARN MORE
            <img src="/images/arrow.png" alt="Learn more" className="mt-2 w-auto h-6" />
          </button>
        </div>
        <div ref={scrollRef} className="h-screen"></div>
      </div>
      <Bottom />
    </div>
  );
};

export default Home;
