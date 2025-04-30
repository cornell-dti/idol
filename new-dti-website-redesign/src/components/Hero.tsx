import React, { ReactNode } from 'react';
import Image from 'next/image';
import Button from './Button';

type Props = {
  // Can be a string or a ReactNode for more complex headings/subheading
  heading: ReactNode;
  subheading: ReactNode;
  button1Label?: string;
  button1Link?: string;
  button2Label?: string;
  button2Link?: string;
  image?: string;
  imageAlt?: string;
  centered?: boolean;
};

const Hero = ({
  heading,
  subheading,
  button1Label,
  button1Link,
  button2Label,
  button2Link,
  image,
  imageAlt,
  centered = false
}: Props): ReactNode => {
  if (centered) {
    return (
      <section className="flex flex-col-reverse md:flex-col">
        <div className="flex flex-col p-4 outline-[0.5px] outline-border-1 sm:p-8">
          <div className="flex flex-col m-auto  items-center gap-4 max-w-120">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-center">{heading}</h1>
              <p className="h6 text-center text-foreground-3">{subheading}</p>
            </div>

            <div className="flex gap-4">
              {button1Label && button1Link && (
                <Button
                  variant="primary"
                  label={button1Label}
                  href={button1Link}
                  className="w-full"
                />
              )}
              {button2Label && button2Link && (
                <Button
                  variant="secondary"
                  label={button2Label}
                  href={button2Link}
                  className="w-full"
                />
              )}
            </div>
          </div>
        </div>

        {image && (
          <Image
            src={image}
            alt={imageAlt || 'Hero image alt text'}
            width={1184}
            height={600}
            className="border-t-1 border-t-border-1"
          />
        )}
      </section>
    );
  }

  return (
    <section>
      {image && (
        <Image
          src={image}
          alt={imageAlt || 'Hero image alt text'}
          width={1184}
          height={600}
          className="outline-[0.5px] outline-border-1 md:outline-0"
        />
      )}
      <div className="flex-col md:flex-row flex">
        <div className="p-4 sm:p-4 md:p-8 flex flex-col gap-2 md:flex-[3] md:outline-[0.5px] md:outline-border-1">
          <h1>{heading}</h1>
          <p className="h6 text-foreground-3">{subheading}</p>
        </div>

        {(button1Label && button1Link) || (button2Label && button2Link) ? (
          <div className="p-4 pt-0 sm:p-4 sm:pt-0 md:p-8 md:pt-8 flex md:flex-col gap-4 md:flex-[1] md:outline-[0.5px] md:outline-border-1 md:justify-center max-w-1/4">
            {button1Label && button1Link && (
              <Button
                variant="primary"
                label={button1Label}
                href={button1Link}
                className="md:w-full"
              />
            )}
            {button2Label && button2Link && (
              <Button
                variant="secondary"
                label={button2Label}
                href={button2Link}
                className="md:w-full"
              />
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Hero;
