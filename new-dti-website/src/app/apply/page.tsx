'use client';

import ApplicationTimeline from '../../../components/apply/ApplicationTimeline';
import config from '../../../config.json';
import RoleDescriptions from '../../../components/apply/RoleDescription';
import ApplyFAQ from '../../../components/apply/ApplyFAQ';
import Banner from '../../../components/apply/Banner';
import SectionWrapper from '../../../components/hoc/SectionWrapper';
import { isAppOpen } from '../../utils/dateUtils';
import useTitle from '../../hooks/useTitle';
import Hero from '../../../components/hero';

const ApplyHero = () => {
  const isApplicationOpen = isAppOpen();

  return (
    <section id="Apply Hero" className="text-[#FEFEFE] flex items-center relative">
      {!isApplicationOpen && (
        <Banner
          message={`Applications for Fall 2025 are not open yet. Stay tuned for opportunities around the beginning of the semester!`} // TOOO @oscar: change back to config.semester once new semester is set up.
          variant={'accent'}
        />
      )}
      <div className="flex items-center pt-12 w-[100%]">
        <Hero
          title={'Join our community'}
          description={
            "We strive for inclusivity, and encourage passionate applicants to apply regardless of experience. We'd love to work with someone like you."
          }
          image={{
            src: '/images/apply-hero.png',
            alt: 'DTI members hosting a recruitment event with prospective applicants'
          }}
          action={{
            buttonText: 'Apply now',
            link: config.applicationLink,
            disabled: true
          }}
        />
      </div>
    </section>
  );
};

const ApplyCoffeeChat = () => (
  <section
    id="Apply Coffee Chat"
    className="relative flex justify-center bg-[#F5F5F5] md:py-[80px] xs:py-[80px]"
  >
    <SectionWrapper id={'Apply Coffee Chat wrapper'} className="w-full relative">
      <h3 className="font-semibold md:text-[32px] xs:text-[22px] pb-4">Have more questions?</h3>
      <p className="md:text-[22px] md:leading-[26px] xs:text-[12px] xs:leading-[14px] pb-6">
        Feel free to chat with any of us over email, coffee, lunch-we're happy to help!
      </p>
      <div className="flex md:flex-row xs:flex-col gap-3">
        <a href={config.coffeeChatLink} className="primary-button xs:w-full md:w-fit text-center">
          Coffee chat with us
        </a>
        <a
          href={config.coffeeChatFormLink}
          className="secondary-button secondary-button--red xs:w-full md:w-fit text-center"
        >
          Don't know who to chat with?
        </a>
      </div>
    </SectionWrapper>
  </section>
);

// TODO @oscar: Update once applications are open for FA25.
const ApplyPage = () => {
  useTitle('Apply');
  return (
    <div className="flex flex-col md:gap-[160px] xs:gap-[80px] overflow-hidden">
      <div>
        <ApplyHero />
        {/* <ApplicationTimeline /> */}
      </div>
      <RoleDescriptions />
      <div>
        <ApplyFAQ />
        <ApplyCoffeeChat />
      </div>
    </div>
  );
};

export default ApplyPage;
