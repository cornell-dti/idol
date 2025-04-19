import React, { ReactNode } from 'react';
import Button from './Button';

type Props = {
  heading: ReactNode;
  subheading: ReactNode;
  button1Label?: string;
  button1Link?: string;
  button2Label?: string;
  button2Link?: string;
};

const CtaSection = ({
  heading,
  subheading,
  button1Label,
  button1Link,
  button2Label,
  button2Link
}: Props): ReactNode => {
  return (
    <section className="flex flex-col-reverse md:flex-col">
      <div className="flex flex-col outline-[0.5px] outline-accent-green  p-4 sm:px-8 sm:py-16">
        <div className="flex flex-col m-auto  items-center gap-4 max-w-120">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-center">{heading}</h2>
            <h6 className="text-center text-foreground-3">{subheading}</h6>
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
    </section>
  );
};

export default CtaSection;
