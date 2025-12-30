import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import Banner from '../../components/Banner';
import CtaSection from '../../components/CtaSection';
import SectionSep from '../../components/SectionSep';
import FaqSection from './FaqSection';
import RoleDescriptionsSection from './RoleDescriptionsSection';
import config from '../../../config.json';
import ApplicationTimeline from './ApplicationTimeline';
import { applicationOpen } from '../../utils/dateUtils';

export const metadata = {
  title: 'Apply - Cornell DTI',
  description: 'Apply to Cornell DTI and join a diverse team of students building tech for impact.'
};

export default function Apply() {
  return (
    <Layout>
      {!applicationOpen && (
        <Banner
          label={`Applications for ${config.semester} open soon. Stay tuned for more information!`}
        />
      )}

      <Hero
        heading="Join our community"
        subheading="We value inclusivity and welcome passionate applicants of all experience levels. We'd love to work with you."
        button1Label="Apply to DTI"
        button1Link={config.applicationLink}
        button1Disabled={!applicationOpen}
        button1OpenInNewTab
        button2Label="Role descriptions"
        button2Link="#role-descriptions"
        image="/apply/hero.png"
      />

      <ApplicationTimeline />

      <SectionSep />

      <RoleDescriptionsSection />

      <SectionSep />

      <FaqSection />

      <CtaSection
        heading="Ready to join?"
        subheading="Be part of something greater today."
        button1Label="Apply to DTI"
        button1Link={config.applicationLink}
        button1LinkNewTab
        button2Label="Meet the team"
        button2Link="/team"
      />
    </Layout>
  );
}
