'use client';

import React, { useState, useEffect } from 'react';
import './assets/hero.css';
import Icons from '../../components/icons';
import Slideshow from '../../components/slideshow';

const Home: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const nextImage = () => {
    setSelectedImage((prevImage) => (prevImage + 1) % 5); // adjust '5' for a different number of images
  };

  const handleIconClick = (index: number) => {
    setSelectedImage(index);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(nextImage, 3000);
  };

  const intervalRef = React.useRef<NodeJS.Timeout>();

  useEffect(() => {
    intervalRef.current = setInterval(nextImage, 3000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      className="hero-section"
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: '20%'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginRight: '50px'
        }}
      >
        <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '36px' }}>
          Cornell Digital <br></br> Tech & Innovation
        </h2>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Icons
            defaultClass="dti"
            altText="DTI"
            dataIndex={0}
            onClick={() => handleIconClick(0)}
          />
          <Icons
            defaultClass="family"
            altText="Family"
            dataIndex={1}
            onClick={() => handleIconClick(1)}
          />
          <Icons
            defaultClass="collaboration"
            altText="Collaboration"
            dataIndex={2}
            onClick={() => handleIconClick(2)}
          />
          <Icons
            defaultClass="events"
            altText="Events"
            dataIndex={3}
            onClick={() => handleIconClick(3)}
          />
          <Icons
            defaultClass="initiatives"
            altText="Initiatives"
            dataIndex={4}
            onClick={() => handleIconClick(4)}
          />
        </div>
      </div>
      <Slideshow selectedImage={selectedImage} />
    </div>
  );
};

export default Home;
