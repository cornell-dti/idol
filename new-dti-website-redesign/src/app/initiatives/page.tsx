import Hero from '../../components/Hero';
import Layout from '../../components/Layout';

export const metadata = {
  title: 'DTI INITIATIVES PAGE',
  description: 'DESCRIPTION'
};

export default function Initiatives() {
  return (
    <Layout>
      <Hero
        heading="Inspiring innovation"
        subheading="What sets us apart from other project teams is our desire to share our discoveries with other students and members of the Ithaca community."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Learn more"
        button2Link="/"
        image="/initiatives/hero.png"
        imageAlt="DTI members engaging with the community"
      />

      <section className="bg-background-3 h-[800px]">
        <h2>title</h2>
        <p className="mt-2">This is the INITIATIVES page</p>
      </section>
      <section className="bg-border-2 h-[800px]">
        <h2>title</h2>

        <p className="mt-2">This is the INITIATIVES page</p>
      </section>
    </Layout>
  );
}
