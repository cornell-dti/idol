import React from 'react';
import Image from 'next/image';
import IconWrapper from './IconWrapper';
import Button from './Button';
import Chip from './Chip';

type FeatureSectionProps = {
  eyebrowText?: string;
  eyebrowIcon?: React.ReactNode;
  heading: string;
  description: string;
  button1Label?: string;
  button1Link?: string;
  button1LinkNewTab?: boolean;
  button2Label?: string;
  button2Link?: string;
  button2LinkNewTab?: boolean;
  image: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
  className?: string;
  chip?: string;
};

export default function FeatureSection({
  eyebrowText,
  eyebrowIcon,
  heading,
  description,
  button1Label,
  button1Link,
  button1LinkNewTab = false,
  button2Label,
  button2Link,
  button2LinkNewTab = false,
  image,
  imageAlt,
  imagePosition = 'left',
  className,
  chip
}: FeatureSectionProps) {
  const imageOrder = imagePosition === 'right' ? 'md:order-2' : 'md:order-1';
  const contentOrder = imagePosition === 'right' ? 'md:order-1' : 'md:order-2';

  const content = (
    <div className="flex flex-col gap-4 p-4 sm:p-8">
      <div className="flex flex-col gap-2">
        {eyebrowIcon && <IconWrapper size="default">{eyebrowIcon}</IconWrapper>}

        {eyebrowText && <p className="caps text-foreground-3">{eyebrowText}</p>}

        <div className="flex items-center gap-2">
          <h2 className="h3">{heading}</h2>
          {chip && <Chip label={chip} color="red" />}
        </div>

        <p className="text-foreground-3">{description}</p>
      </div>

      <div className="flex gap-4">
        {button1Label && button1Link && (
          <Button
            variant="primary"
            label={button1Label}
            href={button1Link}
            newTab={button1LinkNewTab}
          />
        )}
        {button2Label && button2Link && (
          <Button
            variant="secondary"
            label={button2Label}
            href={button2Link}
            newTab={button2LinkNewTab}
          />
        )}
      </div>
    </div>
  );

  return (
    <section className={`flex flex-col md:flex-row w-full ${className}`}>
      <div
        className={`relative w-full md:w-1/2 ${imageOrder} border-border-1 ${
          imagePosition === 'right' ? 'md:border-l' : 'md:border-r'
        }`}
      >
        <Image src={image} alt={imageAlt} width={1000} height={1000} />
      </div>

      <div className={`w-full md:w-1/2 flex flex-col justify-center ${contentOrder}`}>
        {content}
      </div>
    </section>
  );
}
