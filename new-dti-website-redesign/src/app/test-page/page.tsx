'use client';

import Hero from '../components/Hero';
import Layout from '../components/Layout';

export default function TestPage() {
  return (
    <Layout>
      <Hero
        heading="Heading test"
        subheading="We are a talented, diverse group of students from different colleges and countries striving to make a difference in the Cornell community."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="/team"
        image="/heroImages/team.png"
        imageAlt="IMAGE ALT"
        centered
      />
      <section className="bg-background-2 h-[400px]">
        <h2>section</h2>
        <p className="mt-2">This is the full test page</p>
      </section>
      <section className="bg-background-3 h-[800px]">
        <h2>title</h2>
        <p className="mt-2">This is the full test page</p>
      </section>
      <section className="bg-border-2 h-[800px]">
        <h2>title</h2>

        <p className="mt-2">This is the full test page</p>
      </section>
    </Layout>
  );
}
