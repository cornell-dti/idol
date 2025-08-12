import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import CtaSection from '../../components/CtaSection';
import SectionSep from '../../components/SectionSep';
import BeyondDTI from './BeyondDTI';
import WhoWeAre from './WhoWeAre';
import TeamDisplay from './TeamDisplay';
import FeatureSection from '../../components/FeatureSection';

export const metadata = {
  title: 'Team - Cornell DTI',
  description:
    "Meet Cornell DTI's team of 80+ student designers, developers, PMs, and marketers building tech and driving innovation at Cornell and beyond."
};

export default function Team() {
  return (
    <Layout>
      <Hero
        heading="Team"
        subheading="We are a talented, diverse group of students striving to make a difference in the Cornell community."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="#meet-the-team"
        image="/team/hero.png"
      />

      <FeatureSection
        heading="We are Cornell DTI"
        description="Founded in 2017, DTI is a project team of 80+ designers, developers, product managers, and business members passionate about making change on campus and beyond."
        image="/team/we-are-cornell-dti.png"
        imageAlt="Spring 2025 new members of DTI posing together"
      />

      <SectionSep />

      <WhoWeAre />

      <SectionSep />

      <TeamDisplay />

      <SectionSep />

      <BeyondDTI />

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
