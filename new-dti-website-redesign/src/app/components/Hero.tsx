import React, { ReactNode } from 'react';
import Image from 'next/image';
import Button from './Button';

type Props = {
  heading: string;
  subheading: string;
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
      <section>
        <div className="flex flex-col p-8 outline-[0.5px] outline-accent-green">
          <div className="flex flex-col m-auto  items-center gap-4 max-w-128">
            <h1 className="text-center">{heading}</h1>
            <h6 className="text-center text-foreground-3">{subheading}</h6>

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
          <Image src={image} alt={imageAlt || 'Hero image alt text'} width={1184} height={600} />
        )}
      </section>
    );
  }

  return (
    <section>
      {image && (
        <Image src={image} alt={imageAlt || 'Hero image alt text'} width={1184} height={600} />
      )}
      <div className="flex">
        <div className="p-8 flex flex-col gap-2 flex-3/4 outline-[0.5px] outline-accent-green">
          <h1>{heading}</h1>
          <h6 className="text-foreground-3">{subheading}</h6>
        </div>

        <div className="p-8 flex flex-col gap-4 flex-1/4 outline-[0.5px] outline-accent-green justify-center">
          {button1Label && button1Link && (
            <Button variant="primary" label={button1Label} href={button1Link} className="w-full" />
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
    </section>
  );
};

export default Hero;
