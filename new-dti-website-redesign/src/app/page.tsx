import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import SectionSep from '../components/SectionSep';
import CtaSection from '../components/CtaSection';
import SectionTitle from '../components/SectionTitle';
import Marquee from '../components/Marquee';
import LogoBox from '../components/LogoBox';

export const metadata = {
  title: 'DIT HOMEPAGE',
  description: 'DESCRIPTION'
};

export const logos = [
  { src: '/products/logos/cuapts.svg', alt: 'CU Apartments logo', width: 110, height: 80 },
  { src: '/products/logos/queuemein.svg', alt: 'Queue Me In logo', width: 80, height: 80 },
  { src: '/products/logos/zing.svg', alt: 'Zing logo', width: 96, height: 96 },
  { src: '/products/logos/cureviews.svg', alt: 'CU Reviews logo', width: 80, height: 80 },
  { src: '/products/logos/cornellgo.svg', alt: 'CornellGo logo', width: 80, height: 80 },
  { src: '/products/logos/courseplan.svg', alt: 'Courseplan logo', width: 60, height: 60 },
  { src: '/products/logos/carriage.svg', alt: 'Carriage logo', width: 70, height: 70 },
  {
    src: '/products/logos/design@cornell.svg',
    alt: 'Design @ Cornell logo',
    width: 125,
    height: 52
  }
];

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
          imageAlt="DTI members in front of Duffield Hall"
          centered
        />

        <SectionTitle heading="Our products" smallCaps />

        <Marquee height={96}>
          {logos.map((logo, index) => (
            <LogoBox key={index} {...logo} />
          ))}
        </Marquee>

        <SectionSep />

        <FeatureSection
          eyebrowText="Courses"
          heading="Teaching the Cornell Community"
          description="Learn about modern industry-leading technologies with DTI courses, and explore your ideas through our incubator program."
          image="/home/courses.png"
          imagePosition="right"
          imageAlt="DTI members in front of a whiteboard pasting sticky notes in a brainstorming session"
          button2Label="Learn more"
          button2Link="/courses"
        />

        <FeatureSection
          eyebrowText="Outreach"
          heading="Expanding reach to our community"
          description="We strive to build initiatives not only at Cornell, but also in the Ithaca community and beyond."
          image="/home/outreach.png"
          imageAlt="DTI members teaching a Figma workshop"
          button2Label="How we give back"
          button2Link="/initiatives"
        />

        <FeatureSection
          eyebrowText="Team"
          heading="We’re a family"
          description="We solve real-world problems to improve our community while growing personally and sharing our experiences to help others learn."
          image="/home/team.png"
          imagePosition="right"
          imageAlt="DTI members apple picking social"
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

        <SectionSep />
      </Layout>
    </>
  );
}
