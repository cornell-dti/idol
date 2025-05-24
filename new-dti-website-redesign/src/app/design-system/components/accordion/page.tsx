import React from 'react';
import PageLayout from '../../PageLayout';
import PageSection from '../../PageSection';
import Accordion from '../../../../components/Accordion';

export default function AccordionPage() {
  return (
    <PageLayout title="Chip" description="Guidelines for Accordion component.">
      <PageSection title="" description="">
        <div className="flex flex-col ">
          <Accordion header="When will I hear back about a decision?">
            <p>
              Shortly after applications close, we will offer interviews to candidates we are
              interested in. These interviews serve as a chance to get to know you in person. We
              have one behavioral and one technical round for each role interview. During these
              interviews, talk about your past experience and interest in our team. Then, we will
              initiate some role-specific exercises to further gauge your thought process and skill
              set.
            </p>
          </Accordion>
          <Accordion header="How do we evaluate the applications?">
            <p>
              We look through every single application we receive. We fully understand and
              don&apos;t expect that everyone has a significant amount of past experience. Taking
              into account your year and past coursework, we will assess your interest in being a
              part of Cornell Digital Tech & Innovation and your willingness to learn and make a
              significant contribution.
            </p>
            <p>
              We have one behavioral and one technical round for each role interview. During these
              interviews, talk about your past experience and interest in our team. Then, we will
              initiate some role-specific exercises to further gauge your thought process and skill
              set.
            </p>
          </Accordion>
          <Accordion header="What could I do to learn more about DTI?">
            <p>
              Coffee chats are casual conversations allow you to find out more about DTI and ask any
              questions about our team. A &lsquo;coffee chat&rsquo; doesn&apos;t need to actually be
              over coffee, but should be 30 minutes like an actual coffee catch up with a friend.
              Get the most out of the coffee chat by preparing your questions ahead of time and
              researching the other person&apos;s experiences first.
            </p>
          </Accordion>
        </div>
      </PageSection>
    </PageLayout>
  );
}
