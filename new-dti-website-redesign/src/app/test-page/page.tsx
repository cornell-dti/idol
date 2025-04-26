'use client';

import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import CtaSection from '../../components/CtaSection';
import FeatureSection from '../../components/FeatureSection';
import SectionSep from '../../components/SectionSep';
import ScrollingMarquee from '../../components/ScrolllingMarquee';
import Footer from '../../components/Footer';

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

      <SectionSep />

      <ScrollingMarquee />

      <SectionSep />

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

      <SectionSep grid />

      <Hero
        heading="Heading over here"
        subheading="We are a talented, diverse group of students from different colleges and countries striving to make a difference in the Cornell community."
        button1Label="Meet the team"
        button1Link="/team"
        image="/heroImages/team.png"
        imageAlt="DTI members in front of Gates Hall"
      />

      <SectionSep />

      <Hero
        heading="Heading over here"
        subheading="We are a talented, diverse group of students from different colleges and countries striving to make a difference in the Cornell community."
        button2Label="Meet the team"
        button2Link="/team"
        image="/heroImages/team.png"
        imageAlt="DTI members in front of Gates Hall"
      />

      <SectionSep />

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
        eyebrowIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-rocket-icon lucide-rocket"
          >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        }
        heading="We are Cornell DTI, a project team"
        description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
        image="/rock.png"
        imageAlt="DTI members rock climbing"
      />

      <FeatureSection
        eyebrowIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-rocket-icon lucide-rocket"
          >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        }
        heading="We are Cornell DTI, a project team"
        description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
        image="/rock.png"
        imageAlt="DTI members rock climbing"
        imagePosition="right"
      />

      <FeatureSection
        eyebrowIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-rocket-icon lucide-rocket"
          >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        }
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
        eyebrowIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-rocket-icon lucide-rocket"
          >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        }
        heading="We are Cornell DTI, a project team"
        description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
        image="/rock.png"
        imageAlt="DTI members rock climbing"
        imagePosition="right"
        button1Label="Apply to DTI"
        button1Link="/apply"
      />

      <FeatureSection
        eyebrowIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-rocket-icon lucide-rocket"
          >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        }
        heading="We are Cornell DTI, a project team"
        description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
        image="/rock.png"
        imageAlt="DTI members rock climbing"
        button2Label="Meet the team"
        button2Link="/team"
      />

      <CtaSection
        heading="Ready to join?"
        subheading="Be part of something greater today."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="/team"
      />

      <CtaSection
        heading="Ready to join?"
        subheading="Be part of something greater today."
        button2Label="Meet the team"
        button2Link="/team"
      />

      <CtaSection
        heading={
          <>
            <span className="block text-accent-red">Building the Future</span>
            <span className="block">of Tech @ Cornell</span>
          </>
        }
        subheading={
          <>
            <span>Be part of something </span>
            <span className="text-accent-blue">greater</span>
            <span> today</span>
          </>
        }
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="/team"
      />

      <CtaSection heading="Ready to join?" subheading="Be part of something greater today." />

      <section className="h-128" />

      <Footer />
    </Layout>
  );
}
