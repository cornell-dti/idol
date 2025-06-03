import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import FeatureSection from '../../components/FeatureSection';
import CtaSection from '../../components/CtaSection';

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
        eyebrowIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-hand-heart-icon lucide-hand-heart"
          >
            <path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
            <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
            <path d="m2 15 6 6" />
            <path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z" />
          </svg>
        }
        heading="Giving back to the community"
        description="We introduce code and design through beginner-friendly, interactive workshops with Cornell students, providing individualized feedback."
        image="/initiatives/giving-back.png"
        imagePosition="right"
        imageAlt="A DTI member mentoring children"
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-users-icon lucide-users"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        }
        heading="Events"
        description='Our team helps host Half-Baked, an open space for individuals, project teams and organizations to present their "half-baked" ideas for further interdisciplinary collaboration.'
        image="/initiatives/courses.png"
        imageAlt="A DTI member presenting at Half-Baked"
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-presentation-icon lucide-presentation"
          >
            <path d="M2 3h20" />
            <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
            <path d="m7 21 5-5 5 5" />
          </svg>
        }
        heading="Workshops"
        description="BigRed//Hacks is Cornell's largest and most established student-run hackathon. It features various seminars about best practices in the industry and a competition where teams of students enter a programming project around a theme."
        image="/initiatives/workshops.png"
        imagePosition="right"
        imageAlt="A DTI member holding a resume building workshop"
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-lightbulb-icon lucide-lightbulb"
          >
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
          </svg>
        }
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
