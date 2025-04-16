'use client';

import Hero from '../components/Hero';
import Layout from '../components/Layout';

export default function TestPage() {
  return (
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
        image="/heroImages/team.png"
        imageAlt="DTI members in front of Gates Hall"
        centered
      />

      <Hero
        heading="Heading over here"
        subheading="We are a talented, diverse group of students from different colleges and countries striving to make a difference in the Cornell community."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="/team"
        image="/heroImages/team.png"
        imageAlt="DTI members in front of Gates Hall"
      />
      <section className="h-128" />
    </Layout>
  );
}
