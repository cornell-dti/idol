import React from 'react';
import './assets/hero.css';
import Icons from '../../components/icons';

const Home: React.FC = () => (
  <div className="hero-section" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: '20%' }}>
    <Icons defaultClass="dti" altText="DTI" />
    <Icons defaultClass="family" altText="Family" />
    <Icons defaultClass="collaboration" altText="Collaboration" />
    <Icons defaultClass="events" altText="Events" />
    <Icons defaultClass="initiatives" altText="Initiatives" />
  </div>
);

export default Home;