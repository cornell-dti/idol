import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import Navbar from '../../../../components/Navbar';
import SectionWrapper from '../../util/SectionWrapper';

export default function NavbarPage() {
  return (
    <PageLayout title="Navbar" description="Guidelines for Navbar component.">
      <PageSection title="" description="" className="h-200">
        <SectionWrapper>
          <Navbar demo />
        </SectionWrapper>
      </PageSection>
    </PageLayout>
  );
}
