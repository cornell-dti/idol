'use client';

import Hero from '../components/Hero';
import Layout from '../components/Layout';

export default function TestPage() {
  return (
    <Layout>
      <Hero
        heading={
          <>
            <span className="text-accent-red">Building the Future</span> of Tech @ Cornell
          </>
        }
        subheading="We are a talented, diverse group of students from different colleges and countries striving to make a difference in the Cornell community."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="/team"
        image="/heroImages/team.png"
        imageAlt="IMAGE ALT"
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
        imageAlt="IMAGE ALT"
      />
    </Layout>
  );
}
