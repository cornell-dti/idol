'use client';

import React from 'react';
import Image from 'next/image';

interface SlideshowProps {
  selectedImage: number | null;
}

const Slideshow: React.FC<SlideshowProps> = ({ selectedImage }) => (
  <div className="relative w-[600px] h-[400px] flex items-center">
    {/* images are absolutely positioned within the relative container and transition opacity changes */}
    <Image
      width={600}
      height={400}
      src="/images/dti.png"
      alt="DTI"
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full transition-opacity duration-300 border-8 border-white rounded-lg ${
        selectedImage === 0 ? 'opacity-100' : 'opacity-0'
      }`}
    />
    <Image
      width={600}
      height={400}
      src="/images/family.png"
      alt="Family"
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full transition-opacity duration-300 border-8 border-white rounded-lg ${
        selectedImage === 1 ? 'opacity-100' : 'opacity-0'
      }`}
    />
    <Image
      width={600}
      height={400}
      src="/images/collaboration.png"
      alt="Collaboration"
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full transition-opacity duration-300 border-8 border-white rounded-lg ${
        selectedImage === 2 ? 'opacity-100' : 'opacity-0'
      }`}
    />
    <Image
      width={600}
      height={400}
      src="/images/event.png"
      alt="Events"
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full transition-opacity duration-300 border-8 border-white rounded-lg ${
        selectedImage === 3 ? 'opacity-100' : 'opacity-0'
      }`}
    />
    <Image
      width={600}
      height={400}
      src="/images/initiative.png"
      alt="Initiatives"
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full transition-opacity duration-300 border-8 border-white rounded-lg ${
        selectedImage === 4 ? 'opacity-100' : 'opacity-0'
      }`}
    />
  </div>
);

export default Slideshow;
