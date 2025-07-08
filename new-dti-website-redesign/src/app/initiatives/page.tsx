import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import FeatureSection from '../../components/FeatureSection';
import CtaSection from '../../components/CtaSection';
import HandHeartIcon from '@/components/icons/HandHeartIcon';
import PeopleIcon from '@/components/icons/PeopleIcon';
import WorkshopIcon from '@/components/icons/WorkshopIcon';
import LightBulbIcon from '@/components/icons/LightBulbIcon';

export const metadata = {
  title: 'Initiatives - Cornell DTI',
  description:
    "Engage with Cornell DTI's initiatives, where we empower the Cornell and Ithaca communities through tech education, outreach, and real-world collaboration."
};

export default function Initiatives() {
  return (
    <Layout>
      <Hero
        heading="Inspiring innovation"
        subheading="We stand out by sharing our discoveries with fellow students and the Ithaca community."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Learn more"
        button2Link="/"
        image="/initiatives/hero.png"
      />

      <FeatureSection
        eyebrowIcon={<HandHeartIcon />}
        heading="Giving back to the community"
        description="We introduce code and design through beginner-friendly, interactive workshops with Cornell students, providing individualized feedback."
        image="/initiatives/giving-back.png"
        imagePosition="right"
        imageAlt="A DTI member mentoring children"
      />

      <FeatureSection
        eyebrowIcon={<PeopleIcon />}
        heading="Events"
        description='Our team helps host Half-Baked, an open space for individuals, project teams and organizations to present their "half-baked" ideas for further interdisciplinary collaboration.'
        image="/initiatives/courses.png"
        imageAlt="A DTI member presenting at Half-Baked"
      />

      <FeatureSection
        eyebrowIcon={<WorkshopIcon />}
        heading="Workshops"
        description="BigRed//Hacks is Cornell's largest and most established student-run hackathon. It features various seminars about best practices in the industry and a competition where teams of students enter a programming project around a theme."
        image="/initiatives/workshops.png"
        imagePosition="right"
        imageAlt="A DTI member holding a resume building workshop"
      />

      <FeatureSection
        eyebrowIcon={<LightBulbIcon />}
        heading="Initiatives"
        description="We collaborated with Millennium Management in Spring 2024. Members of Cornell DTI volunteered to participate in projects created by Millennium professionals introducing the team to relevant problems tackled in the industry."
        image="/initiatives/initiatives.png"
        imageAlt="DTI members at the Millenium office"
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
