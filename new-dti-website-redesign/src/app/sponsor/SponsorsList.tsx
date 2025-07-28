import React from 'react';
import LogoBox from '../../components/LogoBox';

const logos = [
  { src: '/sponsor/logos/google.svg', alt: 'Google logo', width: 130, height: 42 },
  { src: '/sponsor/logos/asana.svg', alt: 'Asana logo', width: 190, height: 74 },
  { src: '/sponsor/logos/zeplin.svg', alt: 'Zeplin logo', width: 200, height: 100 },
  { src: '/sponsor/logos/capital-one.svg', alt: 'Capital One logo', width: 172, height: 60 },
  { src: '/sponsor/logos/invision.svg', alt: 'InVision logo', width: 155, height: 52 },
  { src: '/sponsor/logos/millennium.svg', alt: 'Millennium logo', width: 206, height: 32 }
];

export default function SponsorsList() {
  return (
    <section>
      <div className="grid min-md:grid-cols-4">
        <div className="col-span-2 flex px-16 items-center justify-center border-b-1 border-border-1 max-md:py-8">
          <h2 className="h4 text-center">Thank you to our sponsors!</h2>
        </div>
        {logos.map((logo, index) => (
          <LogoBox
            key={index}
            {...logo}
            fillWidth
            className={`border-l border-border-1
              ${index === 0 || index === 4 ? 'max-md:!border-l-0' : ''} 
              ${index === 2 ? '!border-l-0' : ''} 
              ${index >= 2 && index <= 3 ? 'min-md:border-b-0 max-md:border-b' : ''}
              ${index >= 4 && index <= 5 ? '!border-b-0' : ''}`}
          />
        ))}
      </div>
    </section>
  );
}
