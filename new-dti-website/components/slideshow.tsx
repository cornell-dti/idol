'use client';

import React from 'react';
import Image from 'next/image';

interface SlideshowProps {
  selectedImage: number | null;
}

const imageNames = [
  'full-team.png',
  'family-new.jpeg',
  'collaboration.jpeg',
  'new-event.jpeg',
  'new-initiative.jpeg'
];

const Slideshow: React.FC<SlideshowProps> = ({ selectedImage }) => {
  const image = imageNames[selectedImage ?? 0];
  return (
    <div className="w-fit md:rounded-[20px] xs:rounded-lg relative z-10">
      <div>
        <Image
          width={900}
          height={500}
          src={`/images/${image}`}
          alt={image.split('.')[0]}
          className={`max-h-[500px] md:border-8 xs:border-4 border-[rgba(214,_61,_61,_0.40)] md:rounded-[20px] xs:rounded-lg object-cover`}
        />
      </div>
    </div>
  );
};

export default Slideshow;
