import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import FeatureSection from '@/components/FeatureSection';
import CtaSection from '@/components/CtaSection';

export default function CtaSectionPage() {
  return (
    <PageLayout title="CTA section" description="Guidelines for CTA section component.">
      <PageSection title="Default" description="Regular CTA section used on most pages">
        <div className="border-1 border-border-1">
          <CtaSection
            heading="Ready to join?"
            subheading="Be part of something greater today."
            button1Label="Apply to DTI"
            button1Link="/apply"
            button2Label="Meet the team"
            button2Link="/team"
          />
        </div>
      </PageSection>

      <PageSection
        title="Custom text"
        description="CTA section with custom styles on heading and subheading"
      >
        <div className="border-1 border-border-1">
          <CtaSection
            heading={
              <>
                <span className="block text-accent-red">Building the Future</span>
                <span className="block">of Tech @ Cornell</span>
              </>
            }
            subheading={
              <>
                <span>Be part of something </span>
                <span className="text-accent-blue">greater</span>
                <span> today</span>
              </>
            }
            button1Label="Apply to DTI"
            button1Link="/apply"
            button2Label="Meet the team"
            button2Link="/team"
          />
        </div>
      </PageSection>

      <PageSection title="No buttons" description="CTA Section without any buttons">
        <div className="border-1 border-border-1">
          <CtaSection heading="Ready to join?" subheading="Be part of something greater today." />
        </div>
      </PageSection>
    </PageLayout>
  );
}
