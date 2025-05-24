import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Hero from '../../components/Hero';
import Layout from '../../components/Layout';
import Banner from '../../components/Banner';
import CtaSection from '../../components/CtaSection';
import SectionSep from '../../components/SectionSep';
import roles from './roleDescriptions.json';
import faqs from './faqs.json';
import RoleDescriptionCard from './RoleDescriptionCard';
import Tabs from '../../components/Tabs';
import Accordion from '../../components/Accordion';

export const metadata = {
  title: 'DTI APPLY PAGE',
  description: 'DESCRIPTION'
};

type FAQ = {
  question: string;
  answer: string;
  icon?: string;
};
const renderFaqContent = (section: FAQ[]) => (
  <>
    {section.map(({ question, answer, icon }) => (
      <Accordion key={question} header={question} icon={icon}>
        <div className="flex flex-col gap-4">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p>{children}</p>,
              a: ({ href = '#', children }) => (
                <Link
                  href={href}
                  target="_blank"
                  className="text-foreground-1 underline underline-offset-3"
                >
                  {children}
                </Link>
              )
            }}
          >
            {answer}
          </ReactMarkdown>
        </div>
      </Accordion>
    ))}
  </>
);

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

      <section className="flex flex-col gap-8 items-center md:p-8">
        <h2 className="md:p-0 pt-4">Role descriptions</h2>

        <Tabs
          center
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

      <section className="flex flex-col md:flex-row">
        <div className="flex flex-1 p-4 pb-0 sm:p-8 sm:pb-0">
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="flex flex-col flex-3 border-l-1 border-border-1">
          <Tabs
            tabsContainerPadding
            tabs={[
              {
                label: 'General Questions',
                content: renderFaqContent(faqs.General)
              },
              {
                label: 'Behavioral Prep',
                content: (
                  <ul className="flex flex-col gap-4 p-8 pl-12 border-t-1 border-border-1 list-disc">
                    {faqs.BehavioralPrep.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )
              },
              {
                label: 'Technical Prep',
                content: renderFaqContent(faqs.TechnicalPrep)
              }
            ]}
          />
        </div>
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
