import React from 'react';
import '../src/app/assets/hero.css';
import redImage from "../src/app/assets/images/red.png";
import purpleImage from "../src/app/assets/images/purple.png";
import blueImage from "../src/app/assets/images/blue.png";
import orangeImage from "../src/app/assets/images/orange.png";
import yellowImage from "../src/app/assets/images/yellow.png";

const Slideshow: React.FC = () => (
  <div className="slideshow-container">
    <img src={redImage.src} alt="DTI" className="slide-image.default" />
    <img src={purpleImage.src} alt="Family" className="slide-image.family" />
    <img src={blueImage.src} alt="Collaboration" className="slide-image.collaboration" />
    <img src={orangeImage.src} alt="Events" className="slide-image.events" />
    <img src={yellowImage.src} alt="Initiatives" className="slide-image.initiatives" />
  </div>
);

export default Slideshow;
