import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import SectionTitle from '@/components/SectionTitle';
import SectionSep from '@/components/SectionSep';
import SectionWrapper from '../../util/SectionWrapper';

export default function SectionSepPage() {
  return (
    <PageLayout title="Section separator" description="Guidelines for Section separator component.">
      <PageSection title="Default" description="Section separator with just an open space">
        <SectionWrapper>
          <SectionSep />
        </SectionWrapper>
      </PageSection>

      <PageSection title="Grid" description="Section separator with grid pattern">
        <SectionWrapper>
          <SectionSep grid />
        </SectionWrapper>
      </PageSection>
    </PageLayout>
  );
}
