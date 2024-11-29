'use client';

import Link from 'next/link';
import ApplicationTimeline from '../../../components/apply/ApplicationTimeline';
import config from '../../../config.json';
import RoleDescriptions from '../../../components/apply/RoleDescription';
import RedBlob from '../../../components/blob';
import ApplyFAQ from '../../../components/apply/ApplyFAQ';
import Banner from '../../../components/apply/Banner';
import { isAppOpen } from '../../utils/dateUtils';

const ApplyHero = () => (
  <div className="text-[#FEFEFE] min-h-[calc(100vh-136px)] flex items-center relative">
    <Banner
      message={`We're no longer accepting applications for ${config.semester}. Stay tuned for opportunities next semester!`}
      variant={'accent'}
    />
    <div
      className="flex lg:flex-row xs:flex-col gap-x-[60px] lg:ml-[90px] lg:mr-[169px]
      xs:mx-6 md:mx-[65px]"
    >
      <h1 className="flex items-center md:text-[100px] md:leading-[120px] xs:text-[48px] font-semibold">
        <div>
          JOIN OUR <span className="text-[#FF4C4C]">COMMUNITY</span>
        </div>
      </h1>
      <div className="flex flex-col gap-6">
        <h2
          className="font-bold md:text-[40px] xs:text-[24px] md:leading-[48px] 
          xs:leading-[29px] text-hero-primary"
        >
          Down to innovate?
        </h2>
        <p className="md:text-lg xs:text-sm text-hero-secondary">
          <span className="font-bold">We strive for inclusivity</span>, and encourage passionate
          applicants to apply regardless of experience. We'd love to work with someone like you.
        </p>
        {isAppOpen() ? (
          <Link key="Apply Page" href={config.applicationLink} className="primary-button">
            Apply now
          </Link>
        ) : (
          <Link
            key="Apply Page"
            href="#"
            className="primary-button opacity-50 cursor-not-allowed"
            onClick={(e) => e.preventDefault()}
            aria-disabled="true"
          >
            Apply now
          </Link>
        )}
      </div>
    </div>
    <div className="relative">
      <RedBlob className={'right-[-300px]'} intensity={0.5} />
    </div>
  </div>
);

const ApplyCoffeeChat = () => (
  <div className="relative flex justify-center bg-[#F5F5F5] md:py-[80px] xs:py-[80px]">
    <div className="max-w-5xl w-full lg:px-5 md:px-[60px] xs:px-6 relative">
      <h3 className="font-semibold md:text-[32px] xs:text-[22px] pb-4">Have more questions?</h3>
      <p className="md:text-[22px] md:leading-[26px] xs:text-[12px] xs:leading-[14px] pb-6">
        Feel free to chat with any of us over email, coffee, lunch-we're happy to help!
      </p>
      <div className="flex md:flex-row xs:flex-col gap-3">
        <Link href={config.coffeeChatLink} className="primary-button">
          Coffee chat with us
        </Link>
        <Link href={config.coffeeChatFormLink} className="secondary-button">
          Don't know who to chat with?
        </Link>
      </div>
    </div>
  </div>
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
