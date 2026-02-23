import CtaSection from '../../../components/CtaSection';
import FeatureSection from '../../../components/FeatureSection';
import Hero from '../../../components/Hero';
import Layout from '../../../components/Layout';
import SectionSep from '../../../components/SectionSep';
import productstrategyData from '../../../../config.json';
import allMembers from '../../team/data/all-members.json';
import config from '../data/config.json';
import timelineData from '../data/timeline_events.json';
import CourseStaff from '../../../components/course/CourseStaff';

//for later post-pilot:
// import PastStudentExperiences from '../PastStudentExperiences';
// import PastStudentProjects from '../PastStudentProjects';
// import DetailsAboutTrends from '../DetailsAboutTrends';
import DetailsAboutProductStrategy from '../DetailsAboutProductStrategy';
import Button from '@/components/Button';
import getConfig from 'next/config';

export const metadata = {
  title: 'Product Strategy',
  description:
    "Explore Cornell DTI's 1-credit courses: a course on full-stack web development and a course on product strategy. Learn best practices and build real projects."
};

//* DATA
const courseStaff = allMembers
  .filter((member) => productstrategyData.productstrategy_instructors.includes(member.netid))
  .sort(
    (instructor1, instructor2) =>
      productstrategyData.productstrategy_instructors.findIndex(
        (netid) => netid === instructor1.netid
      ) -
      productstrategyData.productstrategy_instructors.findIndex(
        (netid) => netid === instructor2.netid
      )
  ) as IdolMember[];

export default function Course() {
  return (
    <Layout>
      <Hero
        heading="Intro to Product Strategy"
        subheading="Offered in the fall and spring semesters"
        /* button1Label="Apply to course"
        button1Link={config.trendsApplicationLink}
        button2Label="Apply to DTI"
        button2Link="/apply" */
        image="/course/pmhero.png"
      />

      <FeatureSection
        eyebrowText="Product Thinking in Action "
        heading="Intro to Product Strategy"
        description="This 1-credit S/U course offers a hands-on introduction to product strategy and the product management role in industry. Students will learn core PM skills — customer discovery, prioritization frameworks, metrics, GTM strategy, and AI-assisted prototyping — while working in teams to design and pitch a product idea, guided by the DTI Product team. By the end, participants will walk away with a fleshed out digital product, a polished case study, and practical experience to prepare them for building a career in Product Management, Entrepreneurship, Product Design, and beyond.

        
        Join the course by enrolling into INFO 1998 PRJ 607."
        button1Label="Apply to Product Strategy"
        button1Link={config.productStrategyApplicationLink}
        button1LinkNewTab={true}
        button2Label="Learn more"
        button2Link={config.productStrategyWebsiteLink}
        button2LinkNewTab={true}
        image="/course/producticon.png"
        imageAlt="Bear-shaped light bulb icon with a sprout on the top, representing developing product thinking skills."
        imagePosition="left"
      />

      <SectionSep />

      <DetailsAboutProductStrategy timelineEvents={timelineData.product_strategy_timeline_events} />

      <SectionSep />

      <section className="!border-b-0">
        <h2 className="p-4 sm:p-8">Course staff</h2>
        <CourseStaff courseStaff={courseStaff} />
      </section>

      <SectionSep />

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
