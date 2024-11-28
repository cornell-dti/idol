'use client';

import React from 'react';
import Image from 'next/image';
import { ibm_plex_mono } from '../src/app/layout';

interface SlideshowProps {
  selectedImage: number | null;
}

const imageNames = [
  'full-team.png',
  'family.png',
  'collaboration.png',
  'event.png',
  'initiative.png'
];

const ImageHeader: React.FC<{ imageName: string }> = ({ imageName }) => (
  <div className="md:p-4 xs:p-2 flex items-center rounded-[20px] gap-2">
    <img src="/images/folder_icon.png" alt="Folder" className="xs:h-3 md:h-6" />
    <span className={`font-medium xs:text-[8px] md:text-[16px] ${ibm_plex_mono.className}`}>
      cornell-dti
    </span>
    <span className={`ml-auto font-medium md:text-[16px] xs:text-[8px] ${ibm_plex_mono.className}`}>
      {imageName}
    </span>
  </div>
);

const Slideshow: React.FC<SlideshowProps> = ({ selectedImage }) => {
  const image = imageNames[selectedImage ?? 0];
  return (
    <div className="bg-white w-fit md:rounded-[20px] xs:rounded-lg relative z-10">
      <ImageHeader imageName={image} />
      <div>
        <Image
          width={600}
          height={400}
          src={`/images/${image}`}
          alt={image.split('.')[0]}
          className={`max-h-[400px] md:border-8 xs:border-4 border-white md:rounded-[20px] xs:rounded-lg object-cover`}
        />
      </div>
    </div>
  );
};

export default Slideshow;
