import React from 'react';
import '../src/app/assets/hero.css';
import redImage from "../src/app/assets/images/red.png";
import purpleImage from "../src/app/assets/images/purple.png";
import blueImage from "../src/app/assets/images/blue.png";
import orangeImage from "../src/app/assets/images/orange.png";
import yellowImage from "../src/app/assets/images/yellow.png";

interface SlideshowProps {
    selectedImage: number | null;
}

const Slideshow: React.FC<SlideshowProps> = ({ selectedImage }) => (
    <div className="slideshow-container">
        <img src={redImage.src} alt="DTI" className={`slide-image default ${selectedImage === 0 ? 'active' : ''}`} />
        <img src={purpleImage.src} alt="Family" className={`slide-image family ${selectedImage === 1 ? 'active' : ''}`} />
        <img src={blueImage.src} alt="Collaboration" className={`slide-image collaboration ${selectedImage === 2 ? 'active' : ''}`} />
        <img src={orangeImage.src} alt="Events" className={`slide-image events ${selectedImage === 3 ? 'active' : ''}`} />
        <img src={yellowImage.src} alt="Initiatives" className={`slide-image initiatives ${selectedImage === 4 ? 'active' : ''}`} />
    </div>
);

export default Slideshow;
