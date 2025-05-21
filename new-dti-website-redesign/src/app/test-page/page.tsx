'use client';

import Link from 'next/link';
import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import CtaSection from '../../components/CtaSection';
import FeatureSection from '../../components/FeatureSection';
import SectionSep from '../../components/SectionSep';
import Marquee from '../../components/Marquee';
import SectionTitle from '../../components/SectionTitle';
import LogoBox from '../../components/LogoBox';
import TestimonialCard from '../../components/TestimonialCard';

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

const testimonials = [
  {
    quote:
      "This course was really helpful and enjoyable. The lessons were clear and easy to follow, and I learned a lot about web development. The project especially helped put everything together. I'd recommend it to anyone looking to learn web development!",
    picture: '/clem.jpg',
    name: 'Clément Rozé',
    date: 'Fall 2024'
  },
  {
    quote:
      "Trends in Web Development has been an incredibly valuable course, equipping me with practical skills and knowledge that will greatly benefit my future career. The final project was a rewarding experience, allowing me to put my new skills into practice and create a project I'm proud of!",
    picture: '/juju.png',
    name: 'Juju Crane',
    date: 'Fall 2024'
  }
];

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
        centered
      />

      <SectionSep />

      <Marquee height={96}>
        {logos.map((logo, index) => (
          <LogoBox key={index} {...logo} />
        ))}
      </Marquee>

      <SectionSep />

      <Marquee height={370}>
        {testimonials.map(({ quote, picture, name, date }, index) => (
          <TestimonialCard key={index} quote={quote} picture={picture} name={name} date={date} />
        ))}
      </Marquee>

      <SectionSep />

      <Hero
        heading="Heading over here"
        subheading="We are a talented, diverse group of students from different colleges and countries striving to make a difference in the Cornell community."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="/team"
        image="/heroImages/team.png"
      />

      <SectionSep grid />

      <Hero
        heading="Heading over here"
        subheading="We are a talented, diverse group of students from different colleges and countries striving to make a difference in the Cornell community."
        button1Label="Meet the team"
        button1Link="/team"
        image="/heroImages/team.png"
      />

      <SectionSep />

      <Hero
        heading="Heading over here"
        subheading="We are a talented, diverse group of students from different colleges and countries striving to make a difference in the Cornell community."
        button2Label="Meet the team"
        button2Link="/team"
        image="/heroImages/team.png"
      />

      <SectionSep />

      <Hero
        heading="Heading over here"
        subheading="We are a talented, diverse group of students from different colleges and countries striving to make a difference in the Cornell community."
        image="/heroImages/team.png"
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

      <SectionSep />

      <SectionTitle
        heading="Who we are"
        subheading="More than just being inclusive, our team strives to bring many backgrounds and perspectives together solve community problems. These statistics come from recruiting across campus and seeking applicants with the best skills and potential for growth on the team. Updated Spring 2025."
      />

      <SectionTitle heading="Past student experiences" />

      <SectionTitle heading="Our products" smallCaps />

      <SectionSep />

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

      <h2 className="text-accent-purple">
        NOTE: this page will soon be deprecated in favor of the
        <Link href="/design-system" className="text-accent-red underline">
          Design System library
        </Link>
        !
      </h2>
    </Layout>
  );
}
