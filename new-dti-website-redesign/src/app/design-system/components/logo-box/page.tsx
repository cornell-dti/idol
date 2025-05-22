import React from 'react';

import PageLayout from '../../PageLayout';
import PageSection from '../../PageSection';
import LogoBox from '../../../../components/LogoBox';
import logos from '../../../products/logos.json';

export default function LogoBoxPage() {
  return (
    <PageLayout title="Logo box" description="Guidelines for logo box component.">
      <PageSection title="Regular logo box" description="">
        <div className="grid grid-cols-4 border-t-1 border-border-1">
          {logos.map((logo, index) => (
            <LogoBox key={index} {...logo} fillWidth noLink />
          ))}
        </div>
      </PageSection>

      <PageSection title="Logo box with link" description="">
        <div className="grid grid-cols-4 border-t-1 border-border-1">
          {logos.map((logo, index) => (
            <LogoBox
              key={index}
              {...logo}
              fillWidth
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
