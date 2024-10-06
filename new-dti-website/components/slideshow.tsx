'use client';

import React from 'react';
import Image from 'next/image';

interface SlideshowProps {
  selectedImage: number | null;
}

const imageNames = [
  'full-team.jpg',
  'family.png',
  'collaboration.png',
  'event.png',
  'initiative.png'
];

const ImageHeader: React.FC<{ imageName: string; isVisible: boolean }> = ({
  imageName,
  isVisible
}) => (
  <div
    className={`absolute top-0 left-0 w-full p-4 bg-white bg-opacity-100 flex items-center rounded-lg ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}
    style={{ zIndex: isVisible ? 1 : -1 }}
  >
    <img src="/images/folder_icon.png" alt="Folder" className="h-6 mr-2" />
    <span className="font-medium">cornell-dti/{imageName}</span>
    <span className="ml-auto font-medium">{imageName}</span>
  </div>
);

const Slideshow: React.FC<SlideshowProps> = ({ selectedImage }) => (
  <div className="relative w-[600px] h-[500px] flex items-center overflow-hidden">
    {imageNames.map((imageName, index) => (
      <div key={imageName} className="absolute top-0 left-0 w-full h-full">
        <ImageHeader imageName={imageName} isVisible={selectedImage === index} />
        <div className="relative top-10 w-full h-[400px]">
          <Image
            width={600}
            height={400}
            src={`/images/${imageName}`}
            alt={imageName.split('.')[0]}
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 max-w-full max-h-full border-8 border-white rounded-lg ${
              selectedImage === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </div>
    ))}
  </div>
);

export default Slideshow;
