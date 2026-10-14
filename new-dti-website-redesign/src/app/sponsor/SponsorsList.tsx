import React from 'react';
import Button from '../../components/Button';
import LogoBox from '../../components/LogoBox';

export default function SponsorsList() {
  return (
    <section>
      <div className="grid min-md:grid-cols-4">
        <div className="col-span-2 flex px-16 items-center justify-center border-b-1 border-border-1 min-md:border-b-0 max-md:py-8">
          <h2 className="h4 text-center">Thank you to our sponsors!</h2>
        </div>
        <LogoBox
          src="/sponsor/logos/jane-street.svg"
          alt="Jane Street logo"
          width={208}
          height={82}
          fillWidth
          className="border-l border-border-1 !border-b-0 max-md:!border-l-0"
        />
        <div className="flex items-center justify-center h-32 p-4 border-l border-border-1">
          <Button
            variant="transparent"
            label="Get in touch"
            href="mailto:hello@cornelldti.org"
          />
        </div>
      </div>
    </section>
  );
}
