'use client';

import React, { useEffect, useRef, useState } from 'react';
import Icon from '../../components/icons';
import Slideshow from '../../components/slideshow';
import Bottom from '../../components/bottom';
import RedBlob from '../../components/blob';
import { ibm_plex_mono } from './layout';

const Home: React.FC = () => {
  const [selectedIcon, setSelectedIcon] = useState<number | null>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const icons = [
    {
      src: '/images/DTI_notsel.png',
      hover: '/images/DTI_hover.png',
      active: '/images/DTI_current.png',
      ariaLabel: 'Show full team slide',
      width: 80,
      height: 80
    },
    {
      src: '/images/Family_notsel.png',
      hover: '/images/Family_hover.png',
      active: '/images/Family_current.png',
      araiLabel: 'Show family slide',
      width: 80,
      height: 80
    },
    {
      src: '/images/Collaboration_notsel.png',
      hover: '/images/Collaboration_hover.png',
      active: '/images/Collaboration_current.png',
      ariaLabel: 'Show collaboration slide',
      width: 100,
      height: 80
    },
    {
      src: '/images/Events_notsel.png',
      hover: '/images/Events_hover.png',
      active: '/images/Events_current.png',
      ariaLabel: 'Show events slide',
      width: 90,
      height: 90
    },
    {
      src: '/images/Initiatives_notsel.png',
      hover: '/images/Initiatives_hover.png',
      active: '/images/Initiatives_current.png',
      ariaLabel: 'Show initiatives slide',
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
    <>
      <div className="flex flex-col min-h-[calc(100vh-136px)] justify-between items-center">
        <RedBlob intensity={0.5} className="left-[-250px] top-[-250px]" />
        <div className="flex flex-row grow h-full justify-evenly lg:gap-24 items-center lg:px-24 md:px-10 xs:px-4 mt-5">
          <div className="flex flex-col md:gap-8 xs:gap-4 xs:w-full lg:w-5/12">
            <h1 className="text-white md:text-[40px] xs:text-[28px] z-10 font-medium">
              Building the Future <br /> of Tech @ Cornell
            </h1>
            <div className="flex justify-center lg:hidden">
              <Slideshow selectedImage={selectedIcon} />
            </div>
            <div className="flex xs:justify-center lg:justify-normal items-center gap-2 z-10 lg:min-h-[100px] xs:min-h-[45px] scale-75 lg:scale-100">
              {icons.map((icon, index) => (
                <button
                  onClick={() => {
                    setSelectedIcon(index);
                    if (timer) clearTimeout(timer);
                  }}
                  aria-label={icon.ariaLabel}
                >
                  <Icon
                    key={index}
                    icon={icon.src}
                    hoverIcon={icon.hover}
                    activeIcon={icon.active}
                    altText=""
                    isActive={selectedIcon === index}
                    width={icon.width}
                    height={icon.height}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="lg:w-7/12 xs:w-none hidden lg:block">
            <Slideshow selectedImage={selectedIcon} />
          </div>
        </div>
        <RedBlob intensity={0.6} className="left-[800px] top-[100px] hidden lg:block" />
        <div className="relative flex justify-center self-center w-full py-5">
          <RedBlob intensity={0.5} className="left-[0px] top-[-200px]" />
          <button
            onClick={scrollToContent}
            className={`text-white md:text-lg xs:text-[16px] font-semibold cursor-pointer flex flex-col items-center z-10 ${ibm_plex_mono.className}`}
            style={{ transition: 'all 0.3s ease' }}
            aria-label="scroll down"
          >
            LEARN MORE
            <img src="/images/arrow.png" alt="" className="mt-3 w-auto h-6" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="min-h-[10vh]"></div>
      <Bottom />
    </>
  );
};

export default Home;
