import React from 'react';
import PageLayout from '../../PageLayout';
import PageSection from '../../PageSection';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';

export default function HeroPage() {
  return (
    <PageLayout title="Hero" description="Guidelines for Hero component.">
      <PageSection title="Regular Hero" description="Default hero used for most pages">
        <div className="border-1 border-border-1">
          <Hero
            heading="Team"
            subheading="We are a talented, diverse group of students striving to make a difference in the Cornell community."
            button1Label="Apply to DTI"
            button1Link="/apply"
            button2Label="Meet the team"
            button2Link="/team"
            image="/team/hero.png"
          />
        </div>
      </PageSection>

      <PageSection title="Hero with CTA" description="Hero section with a call to action button">
        <div className="border-1 border-border-1">
          <Hero
            heading="Team"
            subheading="We are a talented, diverse group of students striving to make a difference in the Cornell community."
            button1Label="Apply to DTI"
            button1Link="/apply"
            image="/team/hero.png"
          />
        </div>
      </PageSection>

      <PageSection title="Hero with secondary" description="Hero section with a secondary button">
        <div className="border-1 border-border-1">
          <Hero
            heading="Team"
            subheading="We are a talented, diverse group of students striving to make a difference in the Cornell community."
            button2Label="Meet the team"
            button2Link="/team"
            image="/team/hero.png"
          />
        </div>
      </PageSection>
    </PageLayout>
  );
}
