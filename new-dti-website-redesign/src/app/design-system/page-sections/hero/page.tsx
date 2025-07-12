import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import Hero from '../../../../components/Hero';
import SectionWrapper from '../../util/SectionWrapper';

export default function HeroPage() {
  return (
    <PageLayout title="Hero">
      <PageSection title="Regular Hero" description="Default hero used for most pages">
        <SectionWrapper>
          <Hero
            heading="Team"
            subheading="We are a talented, diverse group of students striving to make a difference in the Cornell community."
            button1Label="Apply to DTI"
            button1Link="/apply"
            button2Label="Meet the team"
            button2Link="/team"
            image="/team/hero.png"
          />
        </SectionWrapper>
      </PageSection>

      <PageSection title="Hero with CTA" description="Hero section with a call to action button">
        <SectionWrapper>
          <Hero
            heading="Team"
            subheading="We are a talented, diverse group of students striving to make a difference in the Cornell community."
            button1Label="Apply to DTI"
            button1Link="/apply"
            image="/team/hero.png"
          />
        </SectionWrapper>
      </PageSection>

      <PageSection title="Hero with secondary" description="Hero section with a secondary button">
        <SectionWrapper>
          <Hero
            heading="Team"
            subheading="We are a talented, diverse group of students striving to make a difference in the Cornell community."
            button2Label="Meet the team"
            button2Link="/team"
            image="/team/hero.png"
          />
        </SectionWrapper>
      </PageSection>
    </PageLayout>
  );
}
