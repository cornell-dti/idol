import Image from 'next/image';
import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import SectionSep from '../../components/SectionSep';
import FeatureSection from '../../components/FeatureSection';
import CtaSection from '../../components/CtaSection';

export const metadata = {
  title: 'DTI INITIATIVES PAGE',
  description: 'DESCRIPTION'
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

      <section>
        <Image
          src="/initiatives/giving-back.png"
          width={1184}
          height={600}
          alt="A DTI member mentoring children"
        />

        <div className="flex flex-col gap-2 p-8">
          <h2 className="h3">Giving back to the community</h2>

          <p className="text-foreground-2">
            Young students can learn Scratch to create their own games and animations, and Figma to
            make eye-catching visuals with shapes, colors, and more!
          </p>

          <p className="text-foreground-2">
            We introduce code and design through beginner-friendly, interactive workshops with
            Cornell students, providing individualized feedback
          </p>
        </div>
      </section>

      <SectionSep />

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
        imagePosition="right"
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
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
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
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
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
        imagePosition="right"
        imageAlt="DTI members at the Millenium office"
      />

      <SectionSep />

      <CtaSection
        heading="Ready to join?"
        subheading="Be part of something greater today."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="/team"
      />

      <SectionSep />
    </Layout>
  );
}
