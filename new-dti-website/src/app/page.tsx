import React from 'react';
import './assets/hero.css';
import Icons from '../../components/icons';
import Slideshow from '../../components/slideshow';

const Home: React.FC = () => (
  <div className="hero-section" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: '20%' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: '50px' }}>
      <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '36px' }}>Cornell Digital <br></br> Tech & Innovation</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <Icons defaultClass="dti" altText="DTI" dataIndex={0} />
        <Icons defaultClass="family" altText="Family" dataIndex={1} />
        <Icons defaultClass="collaboration" altText="Collaboration" dataIndex={2} />
        <Icons defaultClass="events" altText="Events" dataIndex={3} />
        <Icons defaultClass="initiatives" altText="Initiatives" dataIndex={4} />
      </div>
    </div>
    <Slideshow />
  </div>
);

export default Home;
