import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import Banner from '../../components/Banner';
import CtaSection from '../../components/CtaSection';
import SectionSep from '../../components/SectionSep';

export const metadata = {
  title: 'DTI APPLY PAGE',
  description: 'DESCRIPTION'
};

export default function Apply() {
  return (
    <Layout>
      <Banner label="We're no longer accepting applications for Spring 2025. Stay tuned for opportunities next semester!" />

      <Hero
        heading="Join our community"
        subheading="We strive for inclusivity, and encourage passionate applicants to apply regardless of experience. We'd love to work with someone like you."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Role descriptions"
        button2Link="/"
        image="/apply/hero.png"
        imageAlt="DTI members hosting a recruitment event with prospective applicants"
      />

      <section className="temporarySection">
        <h4>Application timeline section</h4>
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>Role descriptions section</h4>
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>Frequently Asked Questions section</h4>
      </section>

      <SectionSep />

      <CtaSection
        heading="Ready to join?"
        subheading="Be part of something greater today."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="/team"
      />

      <SectionSep />
    </Layout>
  );
}
