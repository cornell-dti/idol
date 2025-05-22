'use client';

import React, { ReactNode, useEffect, useRef } from 'react';
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
  const sectionRef = useRef<HTMLElement>(null);

  // Adds bottom border radius and overflow hidden to the previous sibling element
  useEffect(() => {
    if (sectionRef.current) {
      const prevSibling = sectionRef.current.previousElementSibling as HTMLElement | null;
      if (prevSibling) {
        prevSibling.classList.add('rounded-b-2xl', 'overflow-hidden');
      }
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="ctaSection flex flex-col-reverse md:flex-col h-125 justify-center
  bg-[url(/CtaSection.jpg)] bg-no-repeat bg-center bg-cover relative mt-8"
    >
      <div
        className="absolute inset-0 w-full h-full z-[5]"
        style={{
          backgroundImage: `
      radial-gradient(262.42% 155.53% at 50% 153.47%, color-mix(in srgb, var(--background-1) 0%, transparent) 11.11%, var(--background-1) 100%),
      radial-gradient(95.79% 95.78% at 50% 0%, color-mix(in srgb, var(--background-1) 0%, transparent) 21.15%, var(--background-1) 100%)
    `
        }}
      ></div>

      <div className="z-10 flex flex-col m-auto p-4 sm:px-8 sm:py-16 items-center gap-4 max-w-120">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-center">{heading}</h2>
          <p className="h6 text-center text-foreground-3">{subheading}</p>
        </div>

        <div className="flex gap-4">
          {button1Label && button1Link && (
            <Button variant="primary" label={button1Label} href={button1Link} className="w-full" />
          )}
          {button2Label && button2Link && (
            <Button
              variant="transparent"
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

export default CtaSection;
