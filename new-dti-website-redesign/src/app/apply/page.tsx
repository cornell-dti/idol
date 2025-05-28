import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import Banner from '../../components/Banner';
import CtaSection from '../../components/CtaSection';
import SectionSep from '../../components/SectionSep';
import roles from './roleDescriptions.json';
import RoleDescriptionCard from './RoleDescriptionCard';
import FancyTabs from '../../components/FancyTabs';

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
        subheading="We value inclusivity and welcome passionate applicants of all experience levels. We’d love to work with you."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Role descriptions"
        button2Link="/"
        image="/apply/hero.png"
      />

      <section className="temporarySection">
        <h4>Application timeline section</h4>
      </section>

      <SectionSep />

      <section className="flex flex-col gap-8 items-center p-4">
        <h2 className="md:p-0 pt-4">Role descriptions</h2>

         <FancyTabs
          className="md:w-200 w-full"
          tabs={roles.map((role, index) => ({
            label: role.role,
            content: (
              <RoleDescriptionCard
                key={index}
                role={role.role}
                skills={role.skills}
                responsibilities={role.responsibilities}
              />
            )
          }))}
        />
      </section>

      <SectionSep />

      <section className="temporarySection">
        <h4>Frequently Asked Questions section</h4>
      </section>

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
