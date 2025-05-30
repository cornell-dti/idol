import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import FeatureSection from '@/components/FeatureSection';

export default function FeatureSectionPage() {
  return (
    <PageLayout title="Feature section" description="Guidelines for Feature section component.">
      <PageSection
        title="Eyebrow, image left"
        description="Feature section with eyebrow text and image on the left"
      >
        <div className="border-1 border-border-1">
          <FeatureSection
            eyebrowText="We're pretty dope, actually"
            heading="We are Cornell DTI, a project team"
            description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
            image="/rock.png"
            imageAlt="DTI members rock climbing"
          />
        </div>
      </PageSection>

      <PageSection
        title="Eyebrow, image right"
        description="Feature section with eyebrow text and image on the right"
      >
        <div className="border-1 border-border-1">
          <FeatureSection
            eyebrowText="We're pretty dope, actually"
            heading="We are Cornell DTI, a project team"
            description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
            image="/rock.png"
            imageAlt="DTI members rock climbing"
            imagePosition="right"
          />
        </div>
      </PageSection>

      <PageSection
        title="Icon, image left"
        description="Feature section with icon and image on the left"
      >
        <div className="border-1 border-border-1">
          <FeatureSection
            eyebrowIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-rocket-icon lucide-rocket"
              >
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
            }
            heading="We are Cornell DTI, a project team"
            description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
            image="/rock.png"
            imageAlt="DTI members rock climbing"
          />
        </div>
      </PageSection>

      <PageSection
        title="Icon, image right"
        description="Feature section with icon and image on the right"
      >
        <div className="border-1 border-border-1">
          <FeatureSection
            eyebrowIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-rocket-icon lucide-rocket"
              >
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
            }
            heading="We are Cornell DTI, a project team"
            description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
            image="/rock.png"
            imageAlt="DTI members rock climbing"
            imagePosition="right"
          />
        </div>
      </PageSection>

      <PageSection title="2 buttons" description="Feature section with 2 buttons (CTA & secondary)">
        <div className="border-1 border-border-1">
          <FeatureSection
            heading="We are Cornell DTI, a project team"
            description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
            image="/rock.png"
            imageAlt="DTI members rock climbing"
            button1Label="Apply to DTI"
            button1Link="/apply"
            button2Label="Meet the team"
            button2Link="/team"
          />
        </div>
      </PageSection>

      <PageSection title="CTA button" description="Feature section with 1 call to action button">
        <div className="border-1 border-border-1">
          <FeatureSection
            heading="We are Cornell DTI, a project team"
            description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
            image="/rock.png"
            imageAlt="DTI members rock climbing"
            button1Label="Apply to DTI"
            button1Link="/apply"
          />
        </div>
      </PageSection>

      <PageSection title="Secondary button" description="Feature section with 1 secondary button">
        <div className="border-1 border-border-1">
          <FeatureSection
            heading="We are Cornell DTI, a project team"
            description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
            image="/rock.png"
            imageAlt="DTI members rock climbing"
            button2Label="Meet the team"
            button2Link="/team"
          />
        </div>
      </PageSection>
    </PageLayout>
  );
}
