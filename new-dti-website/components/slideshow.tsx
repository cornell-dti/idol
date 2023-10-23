import React from 'react';

import redImage from '../src/app/assets/images/dti.png';
import purpleImage from '../src/app/assets/images/family.png';
import blueImage from '../src/app/assets/images/collaboration.png';
import orangeImage from '../src/app/assets/images/event.png';
import yellowImage from '../src/app/assets/images/initiative.png';

interface SlideshowProps {
  selectedImage: number | null;
}

const Slideshow: React.FC<SlideshowProps> = ({ selectedImage }) => (
  <div className="relative w-[600px] h-[400px] flex items-center">
    {/* images are absolutely positioned within the relative container and transition opacity changes */}
    <img
      src={redImage.src}
      alt="DTI"
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full transition-opacity duration-300 border border-white rounded ${
        selectedImage === 0 ? 'opacity-100' : 'opacity-0'
      }`}
    />
    <img
      src={purpleImage.src}
      alt="Family"
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full transition-opacity duration-300 border border-white rounded ${
        selectedImage === 1 ? 'opacity-100' : 'opacity-0'
      }`}
    />
    <img
      src={blueImage.src}
      alt="Collaboration"
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full transition-opacity duration-300 border border-white rounded ${
        selectedImage === 2 ? 'opacity-100' : 'opacity-0'
      }`}
    />
    <img
      src={orangeImage.src}
      alt="Events"
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full transition-opacity duration-300 border border-white rounded ${
        selectedImage === 3 ? 'opacity-100' : 'opacity-0'
      }`}
    />
    <img
      src={yellowImage.src}
      alt="Initiatives"
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full transition-opacity duration-300 border border-white rounded ${
        selectedImage === 4 ? 'opacity-100' : 'opacity-0'
      }`}
    />
  </div>
);

export default Slideshow;
