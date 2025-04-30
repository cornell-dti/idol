import Hero from '@/components/Hero';
import Layout from '../../components/Layout';

export const metadata = {
  title: 'DTI COURSE PAGE',
  description: 'DESCRIPTION'
};

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

      <section className="bg-background-3 h-[800px]">
        <h2>title</h2>
        <p className="mt-2">This is the COURSE page</p>
      </section>
      <section className="bg-border-2 h-[800px]">
        <h2>title</h2>

        <p className="mt-2">This is the COURSE page</p>
      </section>
    </Layout>
  );
}
