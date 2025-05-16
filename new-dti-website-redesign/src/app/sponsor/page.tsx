import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import CtaSection from '../../components/CtaSection';
import SectionSep from '../../components/SectionSep';

export const metadata = {
  title: 'DTI SPONSOR PAGE',
  description: 'DESCRIPTION'
};

export default function Sponsor() {
  return (
    <Layout>
      <Hero
        heading="Support our team"
        subheading="The generous contributions of our supporters and sponsors allow our team to continue building products and hosting initiatives."
        button1Label="Donate to DTI"
        button1Link="https://securelb.imodules.com/s/1717/giving/interior.aspx?sid=1717&gid=2&pgid=16421&bledit=1&dids=2215"
        button2Label="Get in touch"
        button2Link="/"
        image="/sponsor/hero.png"
        imageAlt="DTI members collaborating together in front of a laptop"
      />

      <SectionSep />

      <section className="temporarySection">
        <h4>"Become a sponsor!" section</h4>
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>"row of 3 cards" section</h4>
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>"Sponsorship benefits" section</h4>
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>"Thank you to our sponsors!" section</h4>
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
