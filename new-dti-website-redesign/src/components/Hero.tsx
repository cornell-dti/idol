import React, { ReactNode } from 'react';
import Button from './Button';

type Props = {
  // Can be a string or a ReactNode for more complex headings/subheading
  heading: ReactNode;
  subheading: ReactNode;
  button1Label?: string;
  button1Link?: string;
  button1Disabled?: boolean;
  button2Label?: string;
  button2Link?: string;
  button2Disabled?: boolean;
  image?: string;
  centered?: boolean;
  className?: string;
};

const Hero = ({
  heading,
  subheading,
  button1Label,
  button1Link,
  button1Disabled,
  button2Label,
  button2Link,
  button2Disabled,
  image,
  className
}: Props): ReactNode => (
  // sets border radius for the sibling element right after it
  <section className={`${className} hero [&+*]:rounded-t-2xl [&+*]:overflow-hidden mb-1`}>
    {image && (
      <div
        className="flex items-end h-[800px] relative bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: `url('${image}')` }}
      >
        <div
          className="absolute inset-0 w-full h-full z-[5]"
          style={{
            backgroundImage: `
          linear-gradient(181.82deg,
              color-mix(in srgb, var(--background-1) 90%, transparent) 1.54%,
              color-mix(in srgb, var(--background-1) 20%, transparent) 75.51%
            ),
            radial-gradient(116.68% 116.67% at 50% -16.67%,
              transparent 40%,
              var(--background-1) 100%
            )
          `
          }}
        ></div>

        <div className="flex flex-col md:flex-row z-10 md:items-center w-full p-8 pb-16 max-w-[1184px] mx-auto gap-4">
          <div className="flex flex-col gap-1 md:max-w-1/2">
            <h1>{heading}</h1>
            <p className="h6 text-foreground-3">{subheading}</p>
          </div>

          {(button1Label && button1Link) || (button2Label && button2Link) ? (
            <div className="flex md:flex-1/2 gap-4 md:justify-end">
              {button1Label && button1Link && (
                <Button
                  variant="primary"
                  label={button1Label}
                  href={button1Link}
                  className="w-fit"
                  disabled={button1Disabled}
                />
              )}
              {button2Label && button2Link && (
                <Button
                  variant="transparent"
                  label={button2Label}
                  href={button2Link}
                  className="w-fit"
                  disabled={button2Disabled}
                />
              )}
            </div>
          ) : null}
        </div>
      </div>
    )}
  </section>
);

export default Hero;
