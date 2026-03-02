import React, { ReactNode } from 'react';
import Button from './Button';

type Props = {
  // Can be a string or a ReactNode for more complex headings/subheading
  heading: ReactNode;
  subheading: ReactNode;
  button1Label?: string;
  button1Link?: string;
  button1Disabled?: boolean;
  button1OpenInNewTab?: boolean;
  button2Label?: string;
  button2Link?: string;
  button2Disabled?: boolean;
  button2OpenInNewTab?: boolean;
  image?: string;
  centered?: boolean;
  className?: string;
  nextSectionCurved?: boolean;
};

const Hero = ({
  heading,
  subheading,
  button1Label,
  button1Link,
  button1Disabled,
  button1OpenInNewTab,
  button2Label,
  button2Link,
  button2Disabled,
  button2OpenInNewTab,
  image,
  className,
  nextSectionCurved = true
}: Props): React.ReactElement => (
  <section className={`${className} hero ${nextSectionCurved ? 'nextSectionCurved' : ''} mb-1`}>
    {image && (
      <div
        className="flex items-end [@media(max-height:800px)]:h-[600px] h-[800px] relative bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: `url('${image}')` }}
      >
        <div
          className="absolute inset-0 w-full h-full z-[5]"
          style={{
            backgroundImage: `
              linear-gradient(
          180deg,
          color-mix(in srgb, var(--background-1) 80%, transparent) 0%,
          color-mix(in srgb, var(--background-1) 20%, transparent) 50%
              ),
              radial-gradient(
          116.68% 116.67% at 50% -16.67%,
          transparent 40%,
          var(--background-1) 100%
              )
            `
          }}
        ></div>

        <div className="flex flex-col md:flex-row z-10 md:items-center w-full p-4 sm:p-8 pb-16 max-w-[1184px] mx-auto gap-4">
          <div className="flex flex-col gap-1 md:max-w-1/2">
            <h1>{heading}</h1>
            <p className="h6 text-foreground-3 !leading-7">{subheading}</p>
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
                  newTab={button1OpenInNewTab}
                />
              )}
              {button2Label && button2Link && (
                <Button
                  variant="transparent"
                  label={button2Label}
                  href={button2Link}
                  className="w-fit"
                  disabled={button2Disabled}
                  newTab={button2OpenInNewTab}
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
