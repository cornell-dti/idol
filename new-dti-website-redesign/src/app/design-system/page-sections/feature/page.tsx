import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import FeatureSection from '../../../../components/FeatureSection';
import SectionWrapper from '../../util/SectionWrapper';
import RocketIcon from '../../../../components/icons/RocketIcon';

export default function FeatureSectionPage() {
  return (
    <PageLayout title="Feature">
      <PageSection
        title="Eyebrow, image left"
        description="Feature section with eyebrow text and image on the left."
      >
        <SectionWrapper>
          <FeatureSection
            eyebrowText="Hello World!"
            heading="We are Cornell DTI, a project team"
            description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
            image="/design-system/misc/featureSection1.png"
            imageAlt="DTI members rock climbing"
          />
        </SectionWrapper>
      </PageSection>

      <PageSection
        title="Eyebrow, image right"
        description="Feature section with eyebrow text and image on the right."
      >
        <SectionWrapper>
          <FeatureSection
            eyebrowText="Hello World!"
            heading="We are Cornell DTI, a project team"
            description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
            image="/design-system/misc/rock.png"
            imageAlt="DTI members in black DTI merch posing in Gates Hall"
            imagePosition="right"
          />
        </SectionWrapper>
      </PageSection>

      <PageSection
        title="Icon, image left"
        description="Feature section with icon and image on the left."
      >
        <SectionWrapper>
          <FeatureSection
            eyebrowIcon={<RocketIcon />}
            heading="We are Cornell DTI, a project team"
            description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
            image="/design-system/misc/rock.png"
            imageAlt="DTI members rock climbing"
          />
        </SectionWrapper>
      </PageSection>

      <PageSection
        title="Icon, image right"
        description="Feature section with icon and image on the right."
      >
        <SectionWrapper>
          <FeatureSection
            eyebrowIcon={<RocketIcon />}
            heading="We are Cornell DTI, a project team"
            description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
            image="/design-system/misc/rock.png"
            imageAlt="DTI members rock climbing"
            imagePosition="right"
          />
        </SectionWrapper>
      </PageSection>

      <PageSection
        title="2 buttons"
        description="Feature section with 2 buttons (CTA & secondary)."
      >
        <SectionWrapper>
          <FeatureSection
            heading="We are Cornell DTI, a project team"
            description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
            image="/design-system/misc/rock.png"
            imageAlt="DTI members rock climbing"
            button1Label="Apply to DTI"
            button1Link="/apply"
            button2Label="Meet the team"
            button2Link="/team"
          />
        </SectionWrapper>
      </PageSection>

      <PageSection title="CTA button" description="Feature section with 1 call to action button.">
        <SectionWrapper>
          <FeatureSection
            heading="We are Cornell DTI, a project team"
            description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
            image="/design-system/misc/rock.png"
            imageAlt="DTI members rock climbing"
            button1Label="Apply to DTI"
            button1Link="/apply"
          />
        </SectionWrapper>
      </PageSection>

      <PageSection title="Secondary button" description="Feature section with 1 secondary button.">
        <SectionWrapper>
          <FeatureSection
            heading="We are Cornell DTI, a project team"
            description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
            image="/design-system/misc/rock.png"
            imageAlt="DTI members rock climbing"
            button2Label="Meet the team"
            button2Link="/team"
          />
        </SectionWrapper>
      </PageSection>
    </PageLayout>
  );
}
