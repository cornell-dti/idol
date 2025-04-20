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
import { IconWrapper } from './IconWrapper';
import Button from './Button';
import Image from 'next/image';

export default function FeatureSection({
  image,
  imageAlt,
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

  // eyebrow is the element (icon or label) sitting right above the section heading
  const renderEyebrow = () => {
    if (eyebrowType === 'icon' && icon) return <IconWrapper size="default">{icon}</IconWrapper>;
    if (eyebrowType === 'text') return <p className="caps">{eyebrowText}</p>;
    return null;
  };

  const content = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {renderEyebrow()}
        {/* TODO: Once globals.css heading elements have class, change 'text-2xl' to 'h2' */}
        <h2 className="text-2xl font-semibold">{heading}</h2>
        <p className="text-foreground-3">{description}</p>
      </div>
      <div className="flex gap-4">
        {button1Label && button1Link && (
          <Button variant="primary" label={button1Label} href={button1Link} />
        )}
        {button2Label && button2Link && (
          <Button variant="secondary" label={button2Label} href={button2Link} />
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row w-full">
      {isImageLeft && (
        <Image src={image} alt={imageAlt || 'Section image alt text'} width={592} height={592} />
      )}
      <div className="w-full lg:w-1/2 p-6">{content}</div>
      <Image src={image} alt={imageAlt || 'Section image alt text'} width={592} height={592} />
    </div>
  );
}
