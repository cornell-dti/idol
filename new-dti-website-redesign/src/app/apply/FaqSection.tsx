'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Accordion from '../../components/Accordion';
import Tabs from '../../components/Tabs';
import faqs from './faqs.json';
import MailIcon from '@/components/icons/MailIcon';

type FAQ = {
  question: string;
  answer: string;
  icon?: string;
};

const renderFaqContent = (section: FAQ[]) => (
  <div className="onFocusRounded-b-r">
    {section.map(({ question, answer, icon }, index) => (
      <Accordion
        key={question}
        header={question}
        icon={icon}
        className={index === section.length - 1 ? 'onFocusRounded-b-r' : ''}
      >
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
  </div>
);

export default function FaqSection() {
  return (
    <section className="flex flex-col md:flex-row">
      <div className="flex flex-col justify-between flex-1 p-4 sm:p-8 gap-4">
        <h2>Frequently Asked Questions</h2>

        <div className="flex flex-col gap-1">
          <p className="text-foreground-3">Have any other questions?</p>
          <Link
            href="mailto:hello@cornelldti.org"
            className="text-foreground-1 underline underline-offset-3 flex items-center gap-2 rounded-sm"
          >
            <MailIcon size={20} />

            <span>Contact the DTI team</span>
          </Link>
        </div>
      </div>
      <div className="flex flex-col flex-3 md:border-l-1 border-border-1">
        <Tabs
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
  );
}
