import React from 'react';
import ApplyTimeline from './timeline';
import RoleDescriptions from './role';
import FAQ from './faq';
import CoffeeChat from './coffee-chat';

const Apply: React.FC = () => (
  <>
    <div
      className="flex flex-col bg-black bg-cover bg-center h-screen lg:flex-row"
      style={{ backgroundImage: "url('/images/apply_hero_bg.png')", marginTop: '-60px' }}
    >
      <div className="flex items-center justify-center h-full lg:w-1/2 px-10 lg:px-0">
        <div className="flex flex-col justify-center items-start p-10 lg:pl-[10%]">
          <h1
            className="text-white text-4xl md:text-6xl lg:text-8xl font-semibold uppercase"
            style={{
              lineHeight: '1.2em',
              letterSpacing: '0.01em',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <span style={{ display: 'block', marginBottom: '0.01em' }}>JOIN OUR</span>
            <span style={{ color: '#FF4C4C' }}>COMMUNITY</span>
          </h1>
        </div>
      </div>
      <div className="w-8 lg:hidden"></div>
      <div className="flex-1 flex flex-col justify-center items-center lg:items-start px-10 lg:pr-[10%] text-white text-center lg:text-left">
        <p
          className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <span style={{ color: '#877B7B' }}>Down to</span>{' '}
          <span style={{ fontStyle: 'italic' }}>innovate?</span>
        </p>
        <p
          className="text-lg md:text-xl lg:text-2xl"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 'normal' }}
        >
          <span style={{ fontWeight: 'bold' }}>We strive for inclusivity,</span> and encourage
          passionate applicants to apply, regardless of experience. We’d love to work with someone
          like you.
        </p>
        <button
          style={{
            backgroundColor: '#A52424',
            color: 'white',
            padding: '8px 16px',
            fontSize: '16px md:18px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            marginTop: '1em'
          }}
        >
          Apply Now
        </button>
      </div>
    </div>
    <ApplyTimeline />
    <RoleDescriptions />
    <FAQ />
    <CoffeeChat />
  </>
);

export default Apply;
