import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import CtaSection from '../../../../components/CtaSection';
import SectionWrapper from '../../util/SectionWrapper';

export default function CtaSectionPage() {
  return (
    <PageLayout title="CTA">
      <PageSection title="Default" description="Regular CTA section used on most pages.">
        <SectionWrapper>
          <CtaSection
            heading="Ready to join?"
            subheading="Be part of something greater today."
            button1Label="Apply to DTI"
            button1Link="/apply"
            button2Label="Meet the team"
            button2Link="/team"
          />
        </SectionWrapper>
      </PageSection>

      <PageSection
        title="Custom text"
        description="The heading and subheading of this page can be modified."
      >
        <SectionWrapper>
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
        </SectionWrapper>
      </PageSection>

      <PageSection title="No buttons" description="This variant includes only text.">
        <SectionWrapper>
          <CtaSection heading="Ready to join?" subheading="Be part of something greater today." />
        </SectionWrapper>
      </PageSection>
    </PageLayout>
  );
}
