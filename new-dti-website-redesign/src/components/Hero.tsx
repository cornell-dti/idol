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
    <section className="hero">
      {image && (
        <div
          className="flex items-end h-[700px] relative bg-no-repeat bg-center bg-cover"
          style={{ backgroundImage: `url('${image}')` }}
        >
          <div
            className="absolute inset-0 w-full h-full z-5
            bg-[linear-gradient(180deg,rgba(13,13,13,0.8)_0%,rgba(13,13,13,0)_43.85%),radial-gradient(116.68%_116.67%_at_50%_-16.67%,rgba(13,13,13,0)_40%,#0D0D0D_100%)]"
          ></div>

          <div className="flex z-10 items-center w-full p-8 max-w-[1184px] mx-auto">
            <div className="max-w-1/2">
              <h1>{heading}</h1>
              <p className="h6 text-foreground-3">{subheading}</p>
            </div>

            {(button1Label && button1Link) || (button2Label && button2Link) ? (
              <div className="flex flex-1/2 gap-4 justify-end">
                {button1Label && button1Link && (
                  <Button
                    variant="primary"
                    label={button1Label}
                    href={button1Link}
                    className="w-fit"
                  />
                )}
                {button2Label && button2Link && (
                  <Button
                    variant="secondary"
                    label={button2Label}
                    href={button2Link}
                    className="w-fit"
                  />
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
