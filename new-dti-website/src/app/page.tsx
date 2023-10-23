'use client'

import React, { useEffect, useState } from 'react';
import Icon from '@/components/icons'; 
import Slideshow from '@/components/slideshow';

import heroBackground from './assets/background/hero_bg.png';

import dtiNotSel from './assets/icons/DTI_notsel.png';
import dtiHover from './assets/icons/DTI_hover.png';
import dtiActive from './assets/icons/DTI_current.png';

import familyNotSel from './assets/icons/Family_notsel.png';
import familyHover from './assets/icons/Family_hover.png';
import familyActive from './assets/icons/Family_current.png';

import collaborationNotSel from './assets/icons/Collaboration_notsel.png';
import collaborationHover from './assets/icons/Collaboration_hover.png';
import collaborationActive from './assets/icons/Collaboration_current.png';

import eventsNotSel from './assets/icons/Events_notsel.png';
import eventsHover from './assets/icons/Events_hover.png';
import eventsActive from './assets/icons/Events_current.png';

import initiativesNotSel from './assets/icons/Initiatives_notsel.png';
import initiativesHover from './assets/icons/Initiatives_hover.png';
import initiativesActive from './assets/icons/Initiatives_current.png';

const Home: React.FC = () => {
  const [selectedIcon, setSelectedIcon] = useState<number | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const icons = [
    { default: dtiNotSel, hover: dtiHover, active: dtiActive, altText: "DTI" },
    { default: familyNotSel, hover: familyHover, active: familyActive, altText: "Family" },
    { default: collaborationNotSel, hover: collaborationHover, active: collaborationActive, altText: "Collaboration" },
    { default: eventsNotSel, hover: eventsHover, active: eventsActive, altText: "Events" },
    { default: initiativesNotSel, hover: initiativesHover, active: initiativesActive, altText: "Initiatives" }
  ];

  useEffect(() => {
    if (timer) clearTimeout(timer);

    setTimer(setTimeout(() => {
      if (selectedIcon === null || selectedIcon >= icons.length - 1) {
        setSelectedIcon(0);
      } else {
        setSelectedIcon(selectedIcon + 1);
      }
    }, 3000));

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [selectedIcon]);

  return (
    <div className="flex items-center justify-start pl-[20%] bg-black bg-cover bg-center h-screen"
      style={{ backgroundImage: `url(${heroBackground.src})` }}>
      
      {/* container for text and icons */}
      <div className="flex flex-col items-start mr-12">
        <h2 className="text-white mb-5 text-6xl">
          Cornell Digital <br /> Tech & Innovation
        </h2>
        <div className="flex items-center space-x-2">
          {icons.map((icon, index) => (
            <Icon
              key={index}
              icon={icon.default.src}
              hoverIcon={icon.hover.src}
              activeIcon={icon.active.src}
              altText={icon.altText}
              isActive={selectedIcon === index}
              onClick={() => {
                setSelectedIcon(index);
                if (timer) clearTimeout(timer); // stop auto-changing when an icon is clicked
              }}
            />
          ))}
        </div>
      </div>
      <Slideshow selectedImage={selectedIcon} />
    </div>
  );
};

export default Home;