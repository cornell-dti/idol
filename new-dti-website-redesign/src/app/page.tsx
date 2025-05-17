import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import SectionSep from '../components/SectionSep';
import CtaSection from '../components/CtaSection';
import Marquee from '../components/Marquee';
import LogoBox from '../components/LogoBox';

export const metadata = {
  title: 'DIT HOMEPAGE',
  description: 'DESCRIPTION'
};

const logos = [
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

interface StatItemProps {
  value: string;
  label: string;
  reverse?: boolean;
}

function StatItem({ value, label, reverse = false }: StatItemProps) {
  const valueClass = reverse ? 'text-foreground-3' : 'text-foreground';
  const labelClass = reverse ? 'text-foreground' : 'text-foreground-3';

  return (
    <div className="flex justify-center gap-1 flex-1/4 px-8 py-4">
      <p className={valueClass}>{value}</p>
      <p className={labelClass}>{label}</p>
    </div>
  );
}

// TODO: finalize these values with actual, real numbers lol
const stats = [
  { value: '23,000', label: 'users' },
  { value: '11', label: 'products' },
  { value: '2017', label: 'founded', reverse: true },
  { value: '89', label: 'members' }
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
        />

        <section className="flex border-1 border-border-1 border-b-0 flex-wrap">
          {stats.map((stat, index) => (
            <StatItem key={index} value={stat.value} label={stat.label} />
          ))}
        </section>

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
