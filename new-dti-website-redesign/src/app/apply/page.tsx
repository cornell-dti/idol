import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import Banner from '../../components/Banner';
import CtaSection from '../../components/CtaSection';
import SectionSep from '../../components/SectionSep';
import FaqSection from './FaqSection';
import RoleDescriptionsSection from './RoleDescriptionsSection';

export const metadata = {
  title: 'Apply - Cornell DTI',
  description: 'Apply to Cornell DTI and join a diverse team of students building tech for impact.'
};

const applicationsOpen = false;

export default function Apply() {
  return (
    <Layout>
      {!applicationsOpen && (
        <Banner label="We're no longer accepting applications for Spring 2025. Stay tuned for opportunities next semester!" />
      )}

      <Hero
        heading="Join our community"
        subheading="We value inclusivity and welcome passionate applicants of all experience levels. We'd love to work with you."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button1Disabled={!applicationsOpen}
        button2Label="Role descriptions"
        button2Link="/"
        image="/apply/hero.png"
      />

      <section className="temporarySection border-t-1 border-border-1">
        <h4>Application timeline section</h4>
      </section>

      <SectionSep />

      <RoleDescriptionsSection />

      <SectionSep />

      <FaqSection />

      <CtaSection
        heading="Ready to join?"
        subheading="Be part of something greater today."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="/team"
      />
    </Layout>
  );
}
