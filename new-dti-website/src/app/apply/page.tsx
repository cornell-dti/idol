'use client';

import ApplicationTimeline from '../../../components/apply/ApplicationTimeline';
import config from '../../../config.json';
import RoleDescriptions from '../../../components/apply/RoleDescription';
import RedBlob from '../../../components/blob';
import ApplyFAQ from '../../../components/apply/ApplyFAQ';
import Banner from '../../../components/apply/Banner';
import SectionWrapper from '../../../components/hoc/SectionWrapper';
import { isAppOpen } from '../../utils/dateUtils';

const ApplyHero = () => {
  const isApplicationOpen = isAppOpen();

  return (
    <section
      id="Apply Hero"
      className="text-[#FEFEFE] min-h-[calc(100vh-136px)] flex items-center relative"
    >
      {!isApplicationOpen && (
        <Banner
          message={`We're no longer accepting applications for ${config.semester}. Stay tuned for opportunities next semester!`}
          variant={'accent'}
        />
      )}
      <SectionWrapper id={'Apply Page Hero Section'} className="translate-y-8">
        <div className="flex lg:flex-row xs:flex-col gap-x-[60px]">
          <h1 className="flex items-center md:text-header md:leading-header xs:text-[48px] xs:leading-header-xs font-semibold">
            <div>
              JOIN OUR <span className="text-[#FF4C4C]">COMMUNITY</span>
            </div>
          </h1>
          <div className="flex flex-col gap-6">
            <h2
              className="font-bold md:text-subheader xs:text-[24px] md:leading-subheader
          xs:leading-[29px] text-hero-primary"
            >
              Down to innovate?
            </h2>
            <p className="md:text-lg xs:text-sm text-hero-secondary md:leading-body-text">
              We strive for inclusivity, and encourage passionate applicants to apply regardless of
              experience. We'd love to work with someone like you.
            </p>
            {isApplicationOpen ? (
              <a key="Apply Page" href={config.applicationLink} className="primary-button">
                Apply now
              </a>
            ) : (
              <button
                key="Apply Page"
                className="primary-button opacity-50 cursor-not-allowed"
                onClick={(e) => e.preventDefault()}
                aria-disabled="true"
              >
                Apply now
              </button>
            )}
          </div>
        </div>
      </SectionWrapper>
      <div className="relative">
        <RedBlob className={'right-[-300px]'} intensity={0.5} />
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
        <a href={config.coffeeChatLink} className="primary-button">
          Coffee chat with us
        </a>
        <a href={config.coffeeChatFormLink} className="secondary-button !border-black">
          Don't know who to chat with?
        </a>
      </div>
    </SectionWrapper>
  </section>
);

const ApplyPage = () => (
  <div className="flex flex-col md:gap-[160px] xs:gap-[80px] overflow-hidden">
    <div>
      <ApplyHero />
      <ApplicationTimeline />
    </div>
    <RoleDescriptions />
    <div>
      <ApplyFAQ />
      <ApplyCoffeeChat />
    </div>
  </div>
);

export default ApplyPage;
