import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import SectionSep from '../../../../components/SectionSep';
import SectionWrapper from '../../util/SectionWrapper';

export default function SectionSepPage() {
  return (
    <PageLayout title="Section separator">
      <PageSection
        title="Default"
        description="Section separator with just an open space."
        className="h-100"
      >
        <SectionWrapper>
          <SectionSep />
        </SectionWrapper>
      </PageSection>

      <PageSection
        title="Grid"
        description="Section separator with grid pattern."
        className="h-100"
      >
        <SectionWrapper>
          <SectionSep grid />
        </SectionWrapper>
      </PageSection>
    </PageLayout>
  );
}
