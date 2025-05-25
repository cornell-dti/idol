import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import CtaSection from '../../components/CtaSection';
import SectionSep from '../../components/SectionSep';
import FeatureSection from '@/components/FeatureSection';

export const metadata = {
  title: 'DTI COURSE PAGE',
  description: 'DESCRIPTION'
};

export default function Course() {
  return (
    <Layout>
      <Hero
        heading="Course"
        subheading="Driven by our mission of community impact, we offer a product development course to help everyone learn."
        button1Label="Apply to course"
        button1Link="https://docs.google.com/forms/d/e/1FAIpQLSdIQoS1ScMQuzLFIdC3ITsz7rpLS_qg_CBymSHp8Bcl-x4ITQ/viewform"
        button2Label="Apply to DTI"
        button2Link="/apply"
        image="/course/hero.png"
      />

      <section className="temporarySection">
        <h4>Trends in Web Development section</h4>
        <FeatureSection
          eyebrowText="Modern industry-leading technology"
          heading="Trends in Web Development"
          description="Trends in Web Development is a 1-credit S/U course that showcases modern full-stack development and the best practices used in industry. We cover technologies like TypeScript, React, Node.js, Firebase, Express and more—everything deployed at scale by leading tech companies."
          button1Label="Course Details"
          button1Link="#"
          button2Label="Enroll Now"
          button2Link="#"
          image="/course/Trends.png"
          imageAlt="Screenshot showing Trends in Web Development course technologies"
          imagePosition="left"
        />
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>Details about Trends section</h4>
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>Course staff section</h4>
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>Past student experiences section</h4>
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>Past student projects section</h4>
      </section>

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
