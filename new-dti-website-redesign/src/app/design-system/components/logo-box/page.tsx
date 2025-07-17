import React from 'react';

import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import LogoBox from '../../../../components/LogoBox';
import logos from '../../../products/logos.json';

export default function LogoBoxPage() {
  return (
    <PageLayout title="Logo box">
      <PageSection title="Regular logo box" description="Used to just show a static grid of logos.">
        <div className="grid grid-cols-4 border-t-1 border-border-1">
          {logos.map((logo, index) => (
            <LogoBox key={index} {...logo} fillWidth noLink />
          ))}
        </div>
      </PageSection>

      <PageSection
        title="Logo box with link"
        description="Used to bring you to a page (e.g., on the Products page to scroll you down to the respective section)."
      >
        <div className="grid grid-cols-4 border-t-1 border-border-1">
          {logos.map((logo, index) => (
            <LogoBox
              key={index}
              {...logo}
              fillWidth
              href={logo.href}
              ariaLabel={`Jump to ${logo.alt.replace(/ logo$/i, '')} product`}
            />
          ))}
        </div>
      </PageSection>

      <PageSection title="Logo box with fixed width" description="">
        <div className="flex flex-wrap">
          {logos.map((logo, index) => (
            <LogoBox key={index} {...logo} noLink />
          ))}
        </div>
      </PageSection>
    </PageLayout>
  );
}
