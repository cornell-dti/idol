import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import Accordion from '../../../../components/Accordion';

const testAccordions = [
  {
    header: 'When will I hear back about a decision?',
    content: (
      <p>
        Shortly after applications close, we will offer interviews to candidates we are interested
        in. These interviews serve as a chance to get to know you in person. We have one behavioral
        and one technical round for each role interview. During these interviews, talk about your
        past experience and interest in our team. Then, we will initiate some role-specific
        exercises to further gauge your thought process and skill set.
      </p>
    ),
    icon: '/apply/roles/design.svg'
  },
  {
    header: 'How do we evaluate the applications?',
    content: (
      <>
        <p>
          We look through every single application we receive. We fully understand and don&apos;t
          expect that everyone has a significant amount of past experience. Taking into account your
          year and past coursework, we will assess your interest in being a part of Cornell Digital
          Tech & Innovation and your willingness to learn and make a significant contribution.
        </p>
        <p>
          We have one behavioral and one technical round for each role interview. During these
          interviews, talk about your past experience and interest in our team. Then, we will
          initiate some role-specific exercises to further gauge your thought process and skill set.
        </p>
      </>
    ),
    icon: '/apply/roles/development.svg'
  },
  {
    header: 'What could I do to learn more about DTI?',
    content: (
      <p>
        Coffee chats are casual conversations that allow you to find out more about DTI and ask any
        questions about our team. A &lsquo;coffee chat&rsquo; doesn&apos;t need to actually be over
        coffee, but should be 30 minutes like an actual coffee catch-up with a friend. Get the most
        out of the coffee chat by preparing your questions ahead of time and researching the other
        person&apos;s experiences first.
      </p>
    ),
    icon: '/apply/roles/product.svg'
  }
];

export default function AccordionPage() {
  return (
    <PageLayout title="Accordion" description="Guidelines for Accordion component.">
      <PageSection title="Regular accordion">
        <div className="flex flex-col">
          {testAccordions.map(({ header, content }) => (
            <Accordion key={header} header={header}>
              {content}
            </Accordion>
          ))}
        </div>
      </PageSection>

      <PageSection title="Accordion with icons">
        <div className="flex flex-col">
          {testAccordions.map(({ header, content, icon }) => (
            <Accordion key={header} header={header} icon={icon}>
              {content}
            </Accordion>
          ))}
        </div>
      </PageSection>
    </PageLayout>
  );
}
