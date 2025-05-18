import React, { ReactNode } from 'react';
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
  centered?: boolean;
  className?: string;
};

const Hero = ({
  heading,
  subheading,
  button1Label,
  button1Link,
  button2Label,
  button2Link,
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
          className="absolute inset-0 w-full h-full z-5
            bg-[linear-gradient(180deg,rgba(13,13,13,0.8)_10%,rgba(13,13,13,0)_43.85%),radial-gradient(116.68%_116.67%_at_50%_-16.67%,rgba(13,13,13,0)_40%,#0D0D0D_100%)]"
        ></div>

        <div className="flex flex-col md:flex-row z-10 md:items-center w-full p-8 pb-16 max-w-[1184px] mx-auto gap-4">
          <div className="md:max-w-1/2">
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

export default Hero;
