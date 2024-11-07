import { ReactNode, useState } from 'react';
import Image from 'next/image';
import config from '../../config.json';
import interviewPrep from './data/interviewPrep.json';

type FAQAccordionProps = {
  header: string;
  children: ReactNode;
};

const FAQAccordion = ({ header, children }: FAQAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen((prev) => !prev);

  return (
    <div className="py-4 border-white border-b-black border-2 cursor-pointer" onClick={handleClick}>
      <div className="flex justify-between pr-4">
        <p className="font-semibold text-[20px] leading-[24px]">{header}</p>
        <Image
          src="/icons/dropdown.svg"
          alt="dropdown"
          width={13}
          height={7}
          className={isOpen ? 'rotate-180' : 'rotate-0'}
        />
      </div>
      <div
        className={`overflow-hidden transition-all duration-700 ease-in-out ${
          isOpen ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="md:py-5 xs:py-3">{children}</div>
      </div>
    </div>
  );
};

const ApplyFAQ = () => {
  const sections = ['General Questions', 'Behavioral Prep', 'Technical Prep'];
  const [question, setQuestion] = useState('General Questions');

  const buttons = sections.map((section) => (
    <button
      className={`md:rounded-[30px] xs:rounded-[15px] font-bold md:text-[20px] xs:text-[9px] md:py-4 md:px-5 xs:py-[10px] 
        xs:px-2 border-[3px] border-black ${
          section === question ? 'text-[#FEFEFE] bg-[#0C0404]' : ''
        }`}
      onClick={() => setQuestion(section)}
    >
      {section}
    </button>
  ));

  return (
    <div className="relative flex justify-center bg-white py-24">
      <div
        className="flex flex-col max-w-5xl w-full lg:gap-11 md:gap-7 xs:gap-4 
        lg:px-5 md:px-[60px] xs:px-6 relative z-10"
      >
        <h2 className="font-semibold md:text-[32px] xs:text-[22px]">What's next?</h2>
        <div className="flex flex-col gap-5">
          <h3 className="section-heading">
            Learn more about DTI's core values and processes below.
          </h3>
          <div className="flex gap-4">{buttons}</div>
        </div>
        <div className="flex flex-col gap-6">
          <h3 className="section-heading">{question}</h3>
          {question === 'General Questions' && (
            <div className="flex flex-col">
              <FAQAccordion header="How do we evaluate applications?">
                <div className="flex flex-col gap-2">
                  <p className="section-text">
                    We look through every single application we receive. We fully understand and
                    don't expect that everyone has a significant amount of past experience. Taking
                    into account your year and past coursework, we will assess your interest in
                    being a part of Cornell Digital Tech & Innovation and your willingness to learn
                    and make a significant contribution.
                  </p>
                  <p className="section-text">
                    We have one behavioral and one technical round for each role interview. During
                    these interviews, talk about your past experience and interest in our team.
                    Then, we will initiate some role-specific exercises to further gauge your
                    thought process and skill set.
                  </p>
                </div>
              </FAQAccordion>
              <FAQAccordion header="How can I prepare for the interview process?">
                <p className="section-text">
                  Shortly after applications close, we will offer interviews to candidates we are
                  interested in. These interviews serve as a chance to get to know you in person. We
                  have one behavioral and one technical round for each role interview. During these
                  interviews, talk about your past experience and interest in our team. Then, we
                  will initiate some role-specific exercises to further gauge your thought process
                  and skill set.
                </p>
              </FAQAccordion>
              <FAQAccordion header="What could I do to learn more about DTI?">
                <p className="section-text">
                  Coffee chats are casual conversations allow you to find out more about DTI and ask
                  any questions about our team. A “coffee chat” doesn't need to actually be over
                  coffee, but should be 30 minutes like an actual coffee catch up with a friend. Get
                  the most out of the coffee chat by preparing your questions ahead of time and
                  researching the other person's experiences first. Find DTI members to chat{' '}
                  <a className="underline" href={config.coffeeChatLink}>
                    here
                  </a>
                  .
                </p>
              </FAQAccordion>
              <FAQAccordion header="When will I hear back about a decision?">
                <p className="section-text">
                  Whether or not you receive an interview invitation, we will email you a definitive
                  decision within a week of applying! We're happy to answer any questions you have
                  during this time through our email,{' '}
                  <a className="underline" href="mailto:hello@cornelldti.org">
                    hello@cornelldti.org
                  </a>
                  .
                </p>
              </FAQAccordion>
            </div>
          )}
          {question === 'Behavioral Prep' && (
            <div className="flex flex-col gap-2">
              <h3 className="section-subheading">What to Expect</h3>
              <ul className="flex flex-col gap-2 marker:text-black list-disc pl-8 space-y-3 ">
                {interviewPrep.behavioral.map((tip) => (
                  <li className="section-text">{tip}</li>
                ))}
              </ul>
            </div>
          )}
          {question === 'Technical Prep' && (
            <div className="flex flex-col">
              {interviewPrep.technical.map((role) => (
                <FAQAccordion header={`${role.role} Role`}>
                  <p className="section-text">{role.expectation}</p>
                </FAQAccordion>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyFAQ;
