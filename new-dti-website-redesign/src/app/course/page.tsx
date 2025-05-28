import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import CtaSection from '../../components/CtaSection';
import SectionSep from '../../components/SectionSep';
import Timeline, { Event } from '../../components/Timeline';

export const metadata = {
  title: 'DTI COURSE PAGE',
  description: 'DESCRIPTION'
};

const events: Event[] = [
  { title: 'Lecture 0', date: 'Feb 9' },
  { title: 'Lecture 1 (async)', date: 'Feb 17' },
  { title: 'Sign-up Deadline', date: 'June 1' },
  { title: 'Project Presentation', date: 'June 2' }
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
        imageAlt="DTI member presenting a course to an auditorium"
      />

      <SectionSep />

      <section className="temporarySection">
        <h4>Trends in Web Development section</h4>
      </section>

      <SectionSep />

      <section>
        <h2 className="p-8">Details about Trends</h2>
        <Timeline events={events} currentDate={new Date()} />
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>Course staff section</h4>
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>Past student experiences section</h4>
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>Past student projects section</h4>
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

      <SectionSep />
    </Layout>
  );
}
