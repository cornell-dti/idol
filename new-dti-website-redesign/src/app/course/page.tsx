import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import CtaSection from '../../components/CtaSection';
import SectionSep from '../../components/SectionSep';
import FeatureSection from '@/components/FeatureSection';
import FeatureCard from '@/components/FeatureCard';
import RocketIcon from '../design-system/components/icon/RocketIcon';
import Marquee from '@/components/Marquee';
import TestimonialCard from '@/components/TestimonialCard';

export const metadata = {
  title: 'DTI COURSE PAGE',
  description: 'DESCRIPTION'
};

const testimonials = [
  {
    quote:
      "Trends in Web Development has been an incredibly valuable course, equipping me with practical skills and knowledge that will greatly benefit my future career. The final project was a rewarding experience, allowing me to put my new skills into practice and create a project I'm proud of!",
    picture: '/juju.png',
    name: 'Juju Crane',
    date: 'Fall 2024'
  },
  {
    quote:
      "This course was really helpful and enjoyable. The lessons were clear and easy to follow, and I learned a lot about web development. The project especially helped put everything together. I'd recommend it to anyone looking to learn web development!",
    picture: '/course/ryan.jpg',
    name: 'Ryan Qiu',
    date: 'Fall 2024'
  },
  {
    quote:
      'Trends taught the foundations for being a full-stack web developer. Some units required an additional bit of understanding of other languages like HTML and CSS, but overall the class gave a good starting point to learning web development.',
    picture: '/course/katie.jpg',
    name: 'Katie Xiao',
    date: 'Fall 2024'
  }
];

export default function Course() {
  return (
    <Layout>
      <Hero
        heading="Course"
        subheading="Given our mission of community impact, we want to help everyone learn and grow through our training course in product development."
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
        image="/course/trendsLogo.png"
        imageAlt="Screenshot showing Trends in Web Development course technologies"
        imagePosition="left"
      />

      <SectionSep />

      <section>
        <h4 className="p-8">Details about Trends</h4>

        <div className="grid grid-cols-1 md:grid-cols-3">
          <FeatureCard
            title="Best Practices"
            body="We emphasize best engineering practices for every element, from API design to frontend modularization."
            icon={
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0.5" y="0.5" width="63" height="63" rx="31.5" fill="#181818" />
                <rect x="0.5" y="0.5" width="63" height="63" rx="31.5" stroke="#2E2E2E" />
                <path
                  d="M44.2313 25.0835C44.9362 24.3787 45.3323 23.4228 45.3324 22.426C45.3326 21.4292 44.9367 20.4731 44.2319 19.7682C43.5272 19.0632 42.5712 18.6671 41.5744 18.667C40.5776 18.6669 39.6215 19.0627 38.9166 19.7675L21.1219 37.5662C20.8124 37.8748 20.5834 38.2549 20.4553 38.6728L18.6939 44.4755C18.6595 44.5908 18.6569 44.7133 18.6864 44.83C18.7159 44.9466 18.7765 45.0531 18.8617 45.1382C18.9468 45.2232 19.0534 45.2836 19.1701 45.3129C19.2869 45.3423 19.4093 45.3395 19.5246 45.3048L25.3286 43.5448C25.7462 43.4178 26.1262 43.1903 26.4353 42.8822L44.2313 25.0835Z"
                  stroke="white"
                  stroke-width="2.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M36 22.667L41.3333 28.0003"
                  stroke="white"
                  stroke-width="2.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
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
                width="65"
                height="64"
                viewBox="0 0 65 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0.833252" y="0.5" width="63" height="63" rx="31.5" fill="#181818" />
                <rect x="0.833252" y="0.5" width="63" height="63" rx="31.5" stroke="#2E2E2E" />
                <path
                  d="M29.6672 26.3331C29.6676 26.1555 29.7152 25.9812 29.8052 25.8281C29.8953 25.6749 30.0245 25.5486 30.1795 25.462C30.3346 25.3753 30.5099 25.3316 30.6875 25.3352C30.8651 25.3388 31.0385 25.3896 31.1899 25.4824L36.0752 28.4811C36.2208 28.5706 36.3411 28.6959 36.4245 28.845C36.5079 28.9942 36.5517 29.1622 36.5517 29.3331C36.5517 29.504 36.5079 29.672 36.4245 29.8212C36.3411 29.9703 36.2208 30.0956 36.0752 30.1851L31.1899 33.1851C31.0383 33.278 30.8646 33.3289 30.6868 33.3324C30.509 33.3358 30.3335 33.2918 30.1784 33.2049C30.0232 33.118 29.8941 32.9912 29.8042 32.8377C29.7144 32.6843 29.6671 32.5096 29.6672 32.3318V26.3331Z"
                  stroke="white"
                  stroke-width="2.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M32.3333 38.667V44.0003"
                  stroke="white"
                  stroke-width="2.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M26.9993 44H37.6659"
                  stroke="white"
                  stroke-width="2.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M42.9993 20H21.6659C20.1932 20 18.9993 21.1939 18.9993 22.6667V36C18.9993 37.4728 20.1932 38.6667 21.6659 38.6667H42.9993C44.472 38.6667 45.6659 37.4728 45.6659 36V22.6667C45.6659 21.1939 44.472 20 42.9993 20Z"
                  stroke="white"
                  stroke-width="2.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
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
          {testimonials.map(({ quote, picture, name, date }, index) => (
            <TestimonialCard key={index} quote={quote} picture={picture} name={name} date={date} />
          ))}
        </Marquee>
      </section>

      <section>
        <div className="p-8">
          <h2>Past student projects section</h2>
          <p className="pt-1 text-base text-[var(--foreground-3)]">
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
