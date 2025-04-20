'use client';

import { Rocket } from 'lucide-react';
import FeatureSection from '../components/FeatureSection';
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

      <Hero
        heading="Heading over here"
        subheading="We are a talented, diverse group of students from different colleges and countries striving to make a difference in the Cornell community."
        button1Label="Meet the team"
        button1Link="/team"
        image="/heroImages/team.png"
        imageAlt="DTI members in front of Gates Hall"
      />

      <Hero
        heading="Heading over here"
        subheading="We are a talented, diverse group of students from different colleges and countries striving to make a difference in the Cornell community."
        button2Label="Meet the team"
        button2Link="/team"
        image="/heroImages/team.png"
        imageAlt="DTI members in front of Gates Hall"
      />

      <Hero
        heading="Heading over here"
        subheading="We are a talented, diverse group of students from different colleges and countries striving to make a difference in the Cornell community."
        image="/heroImages/team.png"
        imageAlt="DTI members in front of Gates Hall"
      />

      <section className="h-128" />

      <FeatureSection
        eyebrowText="We're pretty dope, actually"
        heading="We are Cornell DTI, a project team"
        description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
        image="/rock.png"
        imageAlt="DTI members rock climbing"
      />

      <FeatureSection
        eyebrowText="We're pretty dope, actually"
        heading="We are Cornell DTI, a project team"
        description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
        image="/rock.png"
        imageAlt="DTI members rock climbing"
        imagePosition="right"
      />

      <FeatureSection
        eyebrowIcon={<Rocket />}
        heading="We are Cornell DTI, a project team"
        description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
        image="/rock.png"
        imageAlt="DTI members rock climbing"
      />

      <FeatureSection
        eyebrowIcon={<Rocket />}
        heading="We are Cornell DTI, a project team"
        description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
        image="/rock.png"
        imageAlt="DTI members rock climbing"
        imagePosition="right"
      />

      <FeatureSection
        eyebrowIcon={<Rocket />}
        heading="We are Cornell DTI, a project team"
        description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
        image="/rock.png"
        imageAlt="DTI members rock climbing"
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="/team"
      />

      <FeatureSection
        eyebrowIcon={<Rocket />}
        heading="We are Cornell DTI, a project team"
        description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
        image="/rock.png"
        imageAlt="DTI members rock climbing"
        imagePosition="right"
        button1Label="Apply to DTI"
        button1Link="/apply"
      />

      <FeatureSection
        eyebrowIcon={<Rocket />}
        heading="We are Cornell DTI, a project team"
        description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
        image="/rock.png"
        imageAlt="DTI members rock climbing"
        button2Label="Meet the team"
        button2Link="/team"
      />
      <section className="h-128" />
    </Layout>
  );
}
