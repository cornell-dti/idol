'use client';

import { useState } from 'react';
import RoleDescriptions from '../../../components/apply/RoleDescriptions';
import ApplicationTimeline from '../../../components/apply/ApplicationTimeline';
import config from '../../../config.json';

const ApplyHero = () => (
  <div className="text-[#FEFEFE] min-h-[calc(100vh-136px)] flex items-center">
    <div
      className="flex lg:flex-row xs:flex-col gap-x-[60px] lg:ml-[90px] lg:mr-[169px]
    xs:mx-6 md:mx-[65px]"
    >
      <h1 className="flex items-center md:text-[100px] xs:text-[48px] md:leading-[120px] xs:text-[48px] font-semibold">
        <div>JOIN OUR <span className="text-[#FF4C4C]">COMMUNITY</span></div> 
      </h1>
      <div className="flex flex-col gap-6">
        <h2 className="font-bold md:text-[40px] xs:text-[24px] md:leading-[48px] xs:leading-[29px] text-[#877B7B]">
          Down to <span className="text-[#E4E4E4] italic">innovate?</span>
        </h2>
        <p className="md:text-lg xs:text-sm">
          <span className="font-bold">We strive for inclusivity</span>, and encourage passionate
          applicants to apply regardless of experience. We'd love to work with someone like you.
        </p>
        <button
          className="rounded-xl py-3 px-[20px] bg-[#A52424] text-white 
          font-bold hover:bg-white hover:text-[#A52424] w-fit"
        >
          <a href={config.applicationLink}>Apply now</a>
        </button>
      </div>
    </div>
  </div>
);

const ApplyFAQ = () => {
  const sections = ['General Questions', 'Behavioral Prep', 'Technical Prep'];
  const [question, setQuestion] = useState(sections[0]);

  const buttons = sections.map((section) => (
    <button
      className={`rounded-[30px] font-bold text-[20px] py-4 px-5 border-[3px] border-[#FEFEFE] ${
        section === question ? 'text-[#0C0404] bg-[#FEFEFE]' : ''
      }`}
      onClick={() => setQuestion(section)}
    >
      {section}
    </button>
  ));

  const sectionHeadingStyle = 'font-semibold text-[24px] leading-[29px]';
  const sectionSubheadingStyle = 'font-semibold text-[20px] leading-[24px]';
  const sectionTextStyle = 'text-[22px] leading-[26px]';
  const subsectionStyle = 'flex flex-col gap-2';

  return (
    <div className="flex justify-center text-[#FEFEFE]">
      <div className="flex flex-col max-w-5xl w-full gap-11">
        <h2 className="font-semibold text-[32px]">What's next?</h2>
        <div className="flex flex-col gap-5">
          <h3 className={sectionHeadingStyle}>
            Learn more about DTI's core values and processes below.
          </h3>
          <div className="flex gap-4">{buttons}</div>
        </div>
        <div className="flex flex-col gap-6">
          <h3 className={sectionHeadingStyle}>{question}</h3>
          {question === sections[0] && (
            <div className="flex flex-col gap-6">
              <div className={subsectionStyle}>
                <h3 className={sectionSubheadingStyle}>Application Review</h3>
                <p className={sectionTextStyle}>
                  We look through every single application we receive. We fully understand and don't
                  expect that everyone has a significant amount of past experience. Taking into
                  account your year and past coursework, we will assess your interest in being a
                  part of Cornell Digital Tech & Innovation and your willingness to learn and make a
                  significant contribution.
                </p>
                <p className={sectionTextStyle}>
                  We have one behavioral and one technical round for each role interview. During
                  these interviews, talk about your past experience and interest in our team. Then,
                  we will initiate some role-specific exercises to further gauge your thought
                  process and skill set.
                </p>
              </div>
              <div className={subsectionStyle}>
                <h3 className={sectionSubheadingStyle}>Interviews to Expect</h3>
                <p className={sectionTextStyle}>
                  Shortly after applications close, we will offer interviews to candidates we are
                  interested in. These interviews serve as a chance to get to know you in person. We
                  have one behavioral and one technical round for each role interview. During these
                  interviews, talk about your past experience and interest in our team. Then, we
                  will initiate some role-specific exercises to further gauge your thought process
                  and skill set.
                </p>
              </div>
              <div className={subsectionStyle}>
                <h3 className={sectionSubheadingStyle}>Coffee Chatting</h3>
                <p className={sectionTextStyle}>
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
              </div>
              <div className={subsectionStyle}>
                <h3 className={sectionSubheadingStyle}>Decisions?</h3>
                <p className={sectionTextStyle}>
                  Whether or not you receive an interview invitation, we will email you a definitive
                  decision within a week of applying! We're happy to answer any questions you have
                  during this time through our email,{' '}
                  <a className="underline" href="mailto:hello@cornelldti.org">
                    hello@cornelldti.org
                  </a>
                  .
                </p>
              </div>
            </div>
          )}
          {question === sections[1] && (
            <div className={subsectionStyle}>
              <h3 className={sectionSubheadingStyle}>What to Expect</h3>
              <ul className="flex flex-col gap-2 marker:text-[#FEFEFE] list-disc pl-8 space-y-3 ">
                <li className={sectionTextStyle}>
                  In our behavioral interviews, you will have the opportunity to share your
                  experiences and passions with us in a casual setting (no need to dress up!). We
                  want to get to know what makes you who you are and what brings you to DTI!
                </li>
                <li className={sectionTextStyle}>
                  If selected, you will get a zoom invitation in your email. We, as a team, just
                  want to get a better idea of you as a candidate, how you work in a team, and what
                  Cornell DTI means to you.
                </li>
                <li className={sectionTextStyle}>
                  You can find some behavioral practice online or chat with members about what to
                  expect. This isn't something to stress out about. Believe us, we've all been
                  there. Above all, we want to get to know you.
                </li>
              </ul>
            </div>
          )}
          {question === sections[2] && (
            <div className="flex flex-col gap-6">
              <div className={subsectionStyle}>
                <h3 className={sectionSubheadingStyle}>Designer</h3>
                <p className={sectionTextStyle}>
                  The design technical interview consists of 15 minutes behavioral questions that
                  are more design focused. Then, a 15 minutes portfolio review + 5 minutes of
                  questions. You will present a slide deck on one of your past projects. We'll end
                  with a 25 minute whiteboard challenge where we'll present you with a problem space
                  and you will create a solution solving it.
                </p>
              </div>
              <div className={subsectionStyle}>
                <h3 className={sectionSubheadingStyle}>Developer</h3>
                <p className={sectionTextStyle}>
                  To prepare for this interview, we recommend reviewing data structures (OOP) and
                  system design. You're expected to perform white-board challenges (yes, no code!)
                  to design features of a website. Ultimately, we want to see how you think and
                  solve problems.
                </p>
              </div>
              <div className={subsectionStyle}>
                <h3 className={sectionSubheadingStyle}>Business</h3>
                <p className={sectionTextStyle}>
                  Our technical interview questions will comprise of business case studies
                  simulating challenges you may face in your role. We do not expect any specific
                  background knowledge heading into your interview; however, the best way to prepare
                  would be to thoroughly research the expectations of your role. We look for
                  candidates that show passion and the ability to make rational decisions with
                  limited information.
                </p>
              </div>
              <div className={subsectionStyle}>
                <h3 className={sectionSubheadingStyle}>PM</h3>
                <p className={sectionTextStyle}>
                  Our technical interview questions are similar to questions real product managers
                  get asked in industry. If you google “PM interview questions” you'll find a lot of
                  helpful resources! We recommend following the CIRCLES framework. We'll also send
                  materials to help you prepare at that stage.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ApplyCoffeeChat = () => (
  <div className="flex justify-center text-[#FEFEFE] mb-[200px]">
    <div className="max-w-5xl w-full">
      <h3 className="font-semibold text-[32px] pb-4">Have more questions?</h3>
      <p className="text-[22px] pb-6">
        Feel free to chat with any of us over email, coffee, lunch-we're happy to help!
      </p>
      <div className="flex gap-3">
        <button
          className="rounded-xl py-3 px-[20px] bg-[#A52424] text-white 
          font-bold hover:bg-white hover:text-[#A52424] w-fit"
        >
          <a href={config.coffeeChatLink}>Coffee chat with us</a>
        </button>
        <button
          className="rounded-xl py-3 px-[20px] text-[#FFDCDC] border-[#FFDCDC] border-[3px]
          font-bold hover:bg-[#FFDCDC] hover:text-[#0C0404] w-fit"
        >
          <a href={config.coffeeChatFormLink}>Don't know who to chat with?</a>
        </button>
      </div>
    </div>
  </div>
);

const ApplyPage = () => (
  <div className="flex flex-col gap-[200px]">
    <ApplyHero />
    <ApplicationTimeline />
    <RoleDescriptions />
    <ApplyFAQ />
    <ApplyCoffeeChat />
  </div>
);

export default ApplyPage;
