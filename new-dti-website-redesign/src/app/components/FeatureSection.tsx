type FeatureSectionProps = {
  image: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
  eyebrowType?: 'text' | 'icon' | 'none';
  eyebrowText?: string;
  icon?: React.ReactNode;
  heading: string;
  description: string;
  button1Label?: string;
  button1Link?: string;
  button2Label?: string;
  button2Link?: string;
};

import React from 'react';

export default function FeatureSection({
  image,
  imagePosition = 'left',
  eyebrowType = 'text',
  eyebrowText,
  icon,
  heading,
  description,
  button1Label,
  button1Link,
  button2Label,
  button2Link
}: FeatureSectionProps) {
  const isImageLeft = imagePosition === 'left';

  const renderEyebrow = () => {
    if (eyebrowType === 'icon' && icon) return <div className="mb-2">{icon}</div>;
    if (eyebrowType === 'text') return <div className="text-sm uppercase mb-2">{eyebrowText}</div>;
    return null;
  };

  const content = (
    <div className="flex flex-col justify-center gap-4 text-white">
      {renderEyebrow()}
      <h2 className="text-2xl font-semibold">{heading}</h2>
      <p className="text-sm opacity-80">{description}</p>

      <div className="flex gap-2">
        {button1Label && button1Link && (
          <a href={button1Link} className="px-4 py-2 rounded-md text-sm bg-white text-black">
            {button1Label}
          </a>
        )}
        {button2Label && button2Link && (
          <a href={button2Link} className="px-4 py-2 rounded-md text-sm bg-zinc-800 text-white">
            {button2Label}
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row w-full">
      {isImageLeft && <div className="w-full lg:w-1/2">{image}</div>}
      <div className="w-full lg:w-1/2 p-6">{content}</div>
      {!isImageLeft && <div className="w-full lg:w-1/2">{image}</div>}
    </div>
  );
}
