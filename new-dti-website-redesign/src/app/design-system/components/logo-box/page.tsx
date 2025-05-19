import React from 'react';
import Image from 'next/image';

import PageLayout from '../../PageLayout';
import PageSection from '../../PageSection';
import LogoBox from '../../../../components/LogoBox';
import { logos as regularLogos } from '../../../page';
import { logos as linkLogos } from '../../../products/page';

export default function LogoBoxPage() {
  return (
    <PageLayout title="Logo box" description="Guidelines for logo box component.">
      <PageSection title="Regular logo box" description="">
        <div className="grid grid-cols-4 border-t-1 border-border-1">
          {regularLogos.map((logo, index) => (
            <LogoBox key={index} {...logo} fillWidth />
          ))}
        </div>
      </PageSection>

      <PageSection title="Logo box with link" description="">
        <div className="grid grid-cols-4 border-t-1 border-border-1">
          {linkLogos.map((logo, index) => (
            <LogoBox key={index} {...logo} fillWidth />
          ))}
        </div>
      </PageSection>

      <PageSection title="Logo box width fixed width" description="">
        <div className="flex flex-wrap">
          {regularLogos.map((logo, index) => (
            <LogoBox key={index} {...logo} />
          ))}
        </div>
      </PageSection>
    </PageLayout>
  );
}
