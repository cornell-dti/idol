import React from 'react';
import PageLayout from '../../PageLayout';
import PageSection from '../../PageSection';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import SectionTitle from '@/components/SectionTitle';

export default function SectionTitlePage() {
  return (
    <PageLayout title="Section title" description="Guidelines for Section title component.">
      <PageSection title="Default" description="Section title with heading and subheading">
        @CLEMENT ROZE TODO MAKE BORDER-1 INTO COMPONENT @CLEMENT ROZE ADD NAVBAR @CLEMENT ROZE
        RENAME PAGES TO BETTER SEMANTICS FIX RESPONSIVENESS OF SIDEBAR
        <div className="border-1 border-border-1">
          <SectionTitle
            heading="Who we are"
            subheading="More than just being inclusive, our team strives to bring many backgrounds and perspectives together solve community problems. These statistics come from recruiting across campus and seeking applicants with the best skills and potential for growth on the team. Updated Spring 2025."
          />
        </div>
      </PageSection>

      <PageSection title="Heading only" description="Section title with just a heading">
        <div className="border-1 border-border-1">
          <SectionTitle heading="Past student experiences" />
        </div>
      </PageSection>

      <PageSection title="Small caps" description="Section title with just a small caps heading">
        <div className="border-1 border-border-1">
          <SectionTitle heading="Our products" smallCaps />
        </div>
      </PageSection>
    </PageLayout>
  );
}
