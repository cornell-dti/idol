import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import CtaSection from '../../components/CtaSection';
import SectionSep from '../../components/SectionSep';
import FeatureSection from '@/components/FeatureSection';
import FeatureCard from '@/components/FeatureCard';
import RocketIcon from '../design-system/components/icon/RocketIcon';
import Marquee from '@/components/Marquee';
import TestimonialCard from '@/components/TestimonialCard';
import testimonialData from './data/testimonialData.json';

export const metadata = {
  title: 'DTI COURSE PAGE',
  description: 'DESCRIPTION'
};

export default function Course() {
  return (
    <Layout>
      <Hero
        heading="Course"
        subheading="Driven by our mission of community impact, we offer a product development course to help everyone learn."
        button1Label="Apply to course"
        button1Link="https://docs.google.com/forms/d/e/1FAIpQLSdIQoS1ScMQuzLFIdC3ITsz7rpLS_qg_CBymSHp8Bcl-x4ITQ/viewform"
        button2Label="Apply to DTI"
        button2Link="/apply"
        image="/course/hero.png"
      />
      <FeatureSection
        eyebrowText="Modern industry-leading technology"
        heading="Trends in Web Development"
        description="Trends in Web Development in a 1-credit S/U course that showcase modern full-stack development and best practices used within industry. We cover technologies like TypeScript, React, Node.js, Firebase, Express and more, all of which are deployed at scale by leading tech companies."
        button1Label="Apply to Trends"
        button1Link="https://docs.google.com/forms/d/e/1FAIpQLSdIQoS1ScMQuzLFIdC3ITsz7rpLS_qg_CBymSHp8Bcl-x4ITQ/viewform"
        button2Label="Learn more"
        button2Link="https://webdev.cornelldti.org/"
        image="/course/trendsIcon.png"
        imageAlt="DTI logo surrounded by logos of Node.js, React [etc.] representing modern web development tools"
        imagePosition="left"
      />

      <SectionSep />

      <section>
        <div className="grid grid-cols-1 md:grid-cols-3">
          <FeatureCard
            title="Best Practices"
            body="We emphasize best engineering practices for every element, from API design to frontend modularization."
            icon={
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
              >
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                <path d="m15 5 4 4" />
              </svg>
            }
          />

          <FeatureCard
            title="Deploy"
            body="Learn how to deploy your web applications ot the cloud using service provider such as Heroku or the Google Cloud Platform."
            icon={<RocketIcon />}
          />

          <FeatureCard
            title="Final Project"
            body="The class ends with a final project project consolidating all class topics, which can be used on your resume or portfolio."
            icon={
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
              >
                <path d="M10 7.75a.75.75 0 0 1 1.142-.638l3.664 2.249a.75.75 0 0 1 0 1.278l-3.664 2.25a.75.75 0 0 1-1.142-.64z" />
                <path d="M12 17v4" />
                <path d="M8 21h8" />
                <rect x="2" y="3" width="20" height="14" rx="2" />
              </svg>
            }
          />
        </div>
      </section>
      <SectionSep />

      <section className="temporarySection">
        <h2 className="p-8">Course staff</h2>
      </section>

      <SectionSep />
      <section>
        <h2 className="p-8">Past student experiences</h2>
        <Marquee height={370}>
          {testimonialData.testimonials.map(
            ({ description, profileImage, name, semesterTaken }, index) => (
              <TestimonialCard
                key={index}
                quote={description}
                picture={profileImage}
                name={name}
                date={semesterTaken}
              />
            )
          )}
        </Marquee>
      </section>

      <section>
        <div className="flex flex-col gap-y-3 p-8">
          <h2>Past student projects section</h2>
          <p className="text-base text-foreground-3">
            See how our course helps students bring their ideas to life.
          </p>
        </div>
      </section>

      <CtaSection
        heading="Ready to join?"
        subheading="Be part of something greater today."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="/team"
      />
    </Layout>
  );
}
