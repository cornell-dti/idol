import CtaSection from '../../../components/CtaSection';
import FeatureSection from '../../../components/FeatureSection';
import Hero from '../../../components/Hero';
import Layout from '../../../components/Layout';
import SectionSep from '../../../components/SectionSep';
import trendsData from '../../../../config.json';
import allMembers from '../../team/data/all-members.json';
import config from '../data/config.json';
import timelineData from '../data/timeline_events.json';
import CourseStaff from '../../../components/course/CourseStaff';
import PastStudentExperiences from '../PastStudentExperiences';
import PastStudentProjects from '../PastStudentProjects';
import DetailsAboutTrends from '../DetailsAboutTrends';
import ArrowIcon from '../../../components/icons/ArrowIcon';

export const metadata = {
  title: 'Trends in Web Dev',
  description:
    "Explore Cornell DTI's 1-credit courses: a course on full-stack web development and a course on product strategy. Learn best practices and build real projects."
};

//* DATA
const courseStaff = allMembers
  .filter((member) => trendsData.trends_instructors.includes(member.netid))
  .sort(
    (instructor1, instructor2) =>
      trendsData.trends_instructors.findIndex((netid) => netid === instructor1.netid) -
      trendsData.trends_instructors.findIndex((netid) => netid === instructor2.netid)
  ) as IdolMember[];

export default function Course() {
  return (
    <Layout>
      <Hero
        heading="Trends in Web Dev"
        subheading="Offered in both the Fall and Spring"
        button1Label="Apply to course"
        button1Link={config.trendsApplicationLink}
        button2Label="Apply to DTI"
        button2Link="/apply"
        image="/course/hero.png"
      />
      <SectionSep
        button={{
          label: 'See all courses',
          href: '/course',
          variant: 'secondary',
          icon: <ArrowIcon size={16} className="rotate-180" />
        }}
        buttonPosition="first"
      />
      <FeatureSection
        eyebrowText="Modern industry-leading technology"
        heading="Trends in Web Development"
        description="Trends in Web Development is a 1-credit S/U course that showcases modern full-stack development and best practices used within industry. We cover technologies like TypeScript, React, Node.js, Firebase, Express, and more, all of which are deployed at scale by leading tech companies."
        button1Label="Apply to Trends"
        button1Link={config.trendsApplicationLink}
        button1LinkNewTab={true}
        button2Label="Learn more"
        button2Link={config.trendsWebsiteLink}
        button2LinkNewTab={true}
        image="/course/trendsIcon.png"
        imageAlt="DTI logo surrounded by logos of Node.js, React [etc.] representing modern web development tools"
        imagePosition="left"
      />

      <SectionSep />

      <DetailsAboutTrends timelineEvents={timelineData.trends_timeline_events} />

      <SectionSep />

      <section className="!border-b-0">
        <h2 className="p-4 sm:p-8">Course staff</h2>
        <CourseStaff courseStaff={courseStaff} />
      </section>

      <SectionSep />

      <PastStudentExperiences />

      <SectionSep />

      <PastStudentProjects />

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
