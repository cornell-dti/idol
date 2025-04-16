import Hero from '../components/Hero';
import Layout from '../components/Layout';

export const metadata = {
  title: 'DTI TEAM PAGE',
  description: 'DESCRIPTION'
};

export default function Team() {
  return (
    <Layout>
      <Hero
        heading="Team"
        subheading="We are a talented, diverse group of students from different colleges and countries striving to make a difference in the Cornell community."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="/team"
        image="/heroImages/team.png"
        imageAlt="IMAGE ALT"
      />
      <section className="bg-background-2 h-[400px]">
        <h1>Team</h1>
        <p className="mt-2">This is the team page</p>
      </section>
      <section className="bg-background-3 h-[800px]">
        <h2>title</h2>
        <p className="mt-2">This is the team page</p>
      </section>
      <section className="bg-border-2 h-[800px]">
        <h2>title</h2>

        <p className="mt-2">This is the team page</p>
      </section>
    </Layout>
  );
}
