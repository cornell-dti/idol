import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import Banner from '../../components/Banner';

export const metadata = {
  title: 'DTI APPLY PAGE',
  description: 'DESCRIPTION'
};

export default function Apply() {
  return (
    <Layout>
      <Banner label="We're no longer accepting applications for Spring 2025. Stay tuned for opportunities next semester!" />

      <Hero
        heading="Join our community"
        subheading="We strive for inclusivity, and encourage passionate applicants to apply regardless of experience. We'd love to work with someone like you."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Role descriptions"
        button2Link="/"
        image="/apply/hero.png"
        imageAlt="DTI members hosting a recruitment event with prospective applicants"
      />

      <section className="bg-background-3 h-[800px]">
        <h2>title</h2>
        <p className="mt-2">This is the apply page</p>
      </section>
      <section className="bg-border-2 h-[800px]">
        <h2>title</h2>

        <p className="mt-2">This is the apply page</p>
      </section>
    </Layout>
  );
}
