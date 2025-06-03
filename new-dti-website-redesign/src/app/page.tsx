import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import CtaSection from '../components/CtaSection';
import Marquee from '../components/Marquee';
import LogoBox from '../components/LogoBox';
import logos from './products/logos.json';
import Button from '../components/Button';

export const metadata = {
  title: 'Cornell DTI',
  description:
    'Cornell Digital Tech & Innovation (DTI) is a student-led team building impactful tech, teaching modern dev skills, and driving innovation at Cornell and beyond.'
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
          subheading="We are a talented, diverse group of students striving to make a difference in the Cornell community."
          button1Label="Apply to DTI"
          button1Link="/apply"
          button2Label="Meet the team"
          button2Link="/team"
          image="/home/hero.png"
          nextSectionCurved={false}
        />

        <div className="[&+*]:rounded-t-2xl [&+*]:overflow-hidden [&+*]:border-t-1 [&+*]:border-border-1 mb-16 relative group">
          <Marquee height={96}>
            {logos.map((logo, index) => (
              <LogoBox key={index} {...logo} noLink border={false} noFocus={true} />
            ))}
          </Marquee>

          <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 bg-background-1/30 backdrop-blur-[10px] absolute inset-0 z-10 flex items-center justify-center group">
            <Button
              label="Explore our products"
              href="/products"
              variant="transparent"
              size="small"
              className="transform scale-95 group-hover:scale-100 group-active:scale-[0.97] group-active:brightness-[0.8]focus-visible:opacity-100 !transition-all !duration-300"
            />

            <a href="/products" className="absolute inset-0 z-0" tabIndex={-1} aria-disabled />
          </div>
        </div>

        <FeatureSection
          eyebrowText="Courses"
          heading="Teaching the Cornell Community"
          description="Learn about modern industry-leading technologies with DTI courses, and explore your ideas through our incubator program."
          image="/home/courses.png"
          imagePosition="right"
          imageAlt="DTI members in front of a whiteboard pasting sticky notes in a brainstorming session"
          button2Label="Learn more"
          button2Link="/course"
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
