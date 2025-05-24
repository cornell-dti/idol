import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import CtaSection from '../../components/CtaSection';
import SectionSep from '../../components/SectionSep';
import BeyondDTI from './BeyondDTI';

export const metadata = {
  title: 'DTI TEAM PAGE',
  description: 'DESCRIPTION'
};

export default function Team() {
  return (
    <Layout>
      <Hero
        heading="Team"
        subheading="We are a talented, diverse group of students striving to make a difference in the Cornell community."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="/team"
        image="/team/hero.png"
      />

      <section className="temporarySection">
        <h4>We are Cornell DTI section</h4>
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>Who we are section</h4>
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>Introducing the team section</h4>
      </section>

      <SectionSep />

      <BeyondDTI />

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
