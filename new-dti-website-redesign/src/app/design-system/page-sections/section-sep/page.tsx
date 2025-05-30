import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import SectionTitle from '@/components/SectionTitle';
import SectionSep from '@/components/SectionSep';

export default function SectionSepPage() {
  return (
    <PageLayout title="Section separator" description="Guidelines for Section separator component.">
      <PageSection title="Default" description="Section separator with just an open space">
        <div className="border-1 border-border-1">
          <SectionSep />
        </div>
      </PageSection>

      <PageSection title="Grid" description="Section separator with grid pattern">
        <div className="border-1 border-border-1">
          <SectionSep grid />
        </div>
      </PageSection>
    </PageLayout>
  );
}
