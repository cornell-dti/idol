import React from 'react';
import LogoBox from '../../components/LogoBox';

const logos = [
  { src: '/sponsor/logos/google.svg', alt: 'Google logo', width: 185, height: 60 },
  { src: '/sponsor/logos/asana.svg', alt: 'Asana logo', width: 200, height: 40 },
  { src: '/sponsor/logos/adobe.svg', alt: 'Adobe logo', width: 190, height: 50 },
  { src: '/sponsor/logos/capital-one.svg', alt: 'Capital One logo', width: 200, height: 70 },
  { src: '/sponsor/logos/invision.svg', alt: 'InVision logo', width: 176, height: 60 },
  { src: '/sponsor/logos/millennium.svg', alt: 'Millennium logo', width: 238, height: 37 }
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
