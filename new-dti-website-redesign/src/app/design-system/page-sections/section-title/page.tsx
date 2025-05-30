import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import SectionTitle from '@/components/SectionTitle';
import SectionWrapper from '../../util/SectionWrapper';

export default function SectionTitlePage() {
  return (
    <PageLayout title="Section title" description="Guidelines for Section title component.">
      <PageSection title="Default" description="Section title with heading and subheading">
        <SectionWrapper>
          <SectionTitle
            heading="Who we are"
            subheading="More than just being inclusive, our team strives to bring many backgrounds and perspectives together solve community problems. These statistics come from recruiting across campus and seeking applicants with the best skills and potential for growth on the team. Updated Spring 2025."
          />
        </SectionWrapper>
      </PageSection>

      <PageSection title="Heading only" description="Section title with just a heading">
        <SectionWrapper>
          <SectionTitle heading="Past student experiences" />
        </SectionWrapper>
      </PageSection>

      <PageSection title="Small caps" description="Section title with just a small caps heading">
        <SectionWrapper>
          <SectionTitle heading="Our products" smallCaps />
        </SectionWrapper>
      </PageSection>
    </PageLayout>
  );
}
