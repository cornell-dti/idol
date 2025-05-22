import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import SectionSep from '../components/SectionSep';
import CtaSection from '../components/CtaSection';
import Marquee from '../components/Marquee';
import LogoBox from '../components/LogoBox';
import logos from './products/logos.json';

export const metadata = {
  title: 'DIT HOMEPAGE',
  description: 'DESCRIPTION'
};

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
  { value: 'founded', label: '2017', reverse: true },
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
          subheading="We are a talented, diverse group of students striving to make a difference in the Cornell community."
          button1Label="Apply to DTI"
          button1Link="/apply"
          button2Label="Meet the team"
          button2Link="/team"
          image="/home/hero.png"
        />

        <section className="flex border-1 border-border-1 border-b-0 flex-wrap">
          {stats.map((stat, index) => (
            <StatItem key={index} value={stat.value} label={stat.label} reverse={stat.reverse} />
          ))}
        </section>

        <Marquee height={96}>
          {logos.map((logo, index) => (
            <LogoBox key={index} {...logo} noLink />
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

        <CtaSection
          heading="Ready to join?"
          subheading="Be part of something greater today."
          button1Label="Apply to DTI"
          button1Link="/apply"
          button2Label="Meet the team"
          button2Link="/team"
        />
      </Layout>
    </>
  );
}
