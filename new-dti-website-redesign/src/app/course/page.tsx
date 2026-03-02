import CtaSection from '../../components/CtaSection';
import FeatureSection from '../../components/FeatureSection';
import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import SectionSep from '../../components/SectionSep';
import config from './data/config.json';

export const metadata = {
  title: 'Courses - Cornell DTI',
  description:
    "Explore Cornell DTI's 1-credit courses: a course on full-stack web development and a course on product strategy. Learn best practices and build real projects."
};

//* DATA

export default function Course() {
  return (
    <Layout>
      <Hero
        heading="Courses"
        subheading="Driven by our mission of community impact, we want to help everyone learn and grow through our training courses in product development."
        button1Label="Apply to DTI"
        button1Link="/apply"
        image="/course/hero.png"
      />
      <FeatureSection
        eyebrowText="Product Thinking in Action "
        heading="Intro to Product Strategy"
        description={`This 1-credit S/U course offers a hands-on introduction to product strategy and the product management role in industry. Students will learn core PM skills — customer discovery, prioritization frameworks, metrics, GTM strategy, and AI-assisted prototyping — while working in teams to design and pitch a product idea, guided by the DTI Product team.

        By the end, participants will walk away with a fleshed out digital product, a polished case study, and practical experience to prepare them for building a career in Product Management, Entrepreneurship, Product Design, and beyond.`}
        button1Label="Apply to Product Strategy"
        button1Link={config.productStrategyApplicationLink}
        button1LinkNewTab={true}
        button2Label="Learn more"
        button2Link="/course/productstrategy"
        button2LinkNewTab={true}
        image="/course/producticon.png"
        imageAlt="Bear-shaped light bulb icon with a sprout on the top, representing developing product thinking skills."
        imagePosition="left"
      />

      <SectionSep />

      <FeatureSection
        eyebrowText="Modern industry-leading technology"
        heading="Trends in Web Development"
        description="Trends in Web Development is a 1-credit S/U course that showcases modern full-stack development and best practices used within industry. We cover technologies like TypeScript, React, Node.js, Firebase, Express, and more, all of which are deployed at scale by leading tech companies."
        button1Label="Apply to Trends"
        button1Link={config.trendsApplicationLink}
        button1LinkNewTab={true}
        button2Label="Learn more"
        button2Link="/course/trends"
        button2LinkNewTab={true}
        image="/course/trendsIcon.png"
        imageAlt="DTI logo surrounded by logos of Node.js, React [etc.] representing modern web development tools"
        imagePosition="left"
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
  );
}
