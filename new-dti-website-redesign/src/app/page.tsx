import Link from 'next/link';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import SectionSep from '../components/SectionSep';
import CtaSection from '../components/CtaSection';

export const metadata = {
  title: 'DIT HOMEPAGE',
  description: 'DESCRIPTION'
};

export default function Home() {
  return (
    <>
      <Layout>
        <Hero
          heading={
            <>
              <span className="block text-accent-red">Building the Future</span>
              <span className="block">of Tech @ Cornell</span>
            </>
          }
          subheading="We are a talented, diverse group of students from different colleges and countries striving to make a difference in the Cornell community."
          button1Label="Apply to DTI"
          button1Link="/apply"
          button2Label="Meet the team"
          button2Link="/team"
          image="/home/hero.png"
          imageAlt="DTI members in front of Gates Hall"
          centered
        />

        <SectionSep />

        <FeatureSection
          eyebrowText="Courses"
          heading="Teaching the Cornell Community"
          description="Learn about modern industry-leading technologies with DTI courses, and explore your ideas through our incubator program."
          image="/home/courses.png"
          imagePosition="right"
          imageAlt="DTI members rock climbing"
          button2Label="Learn more"
          button2Link="/courses"
        />

        <FeatureSection
          eyebrowText="Outreach"
          heading="Expanding reach to our community"
          description="We strive to build initiatives not only at Cornell, but also in the Ithaca community and beyond."
          image="/home/outreach.png"
          imageAlt="DTI members rock climbing"
          button2Label="How we give back"
          button2Link="/initiatives"
        />

        <FeatureSection
          eyebrowText="Team"
          heading="We’re a family"
          description="We solve real-world problems to improve our community while growing personally and sharing our experiences to help others learn."
          image="/home/team.png"
          imagePosition="right"
          imageAlt="DTI members rock climbing"
          button1Label="Meet the team"
          button1Link="/team"
          button2Label="Join us"
          button2Link="/apply"
        />

        <SectionSep />

        <CtaSection
          heading="Ready to join?"
          subheading="Be part of something greater today."
          button1Label="Apply to DTI"
          button1Link="/apply"
          button2Label="Meet the team"
          button2Link="/team"
        />

        <section className="bg-background-2 h-[400px]">
          <h1>Welcome</h1>
          <p className="mt-2">testing testing 123</p>
        </section>

        <section className="bg-background-3 h-[400px]">
          <h2>
            <Link href="/test-components" className="text-accent-red underline">
              View and test components
            </Link>
          </h2>

          <h2>
            <Link href="/test-page" className="text-accent-red underline">
              View full test page
            </Link>
          </h2>
        </section>
      </Layout>
    </>
  );
}
