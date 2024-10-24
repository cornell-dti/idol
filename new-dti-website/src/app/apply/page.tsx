'use client';

import ApplicationTimeline from '../../../components/apply/ApplicationTimeline';
import config from '../../../config.json';
import RoleDescriptions from '../../../components/apply/RoleDescription';
import RedBlob from '../../../components/blob';
import ApplyFAQ from '../../../components/apply/ApplyFAQ';

const ApplyHero = () => (
  <div className="text-[#FEFEFE] min-h-[calc(100vh-136px)] flex items-center">
    <div
      className="flex lg:flex-row xs:flex-col gap-x-[60px] lg:ml-[90px] lg:mr-[169px]
      xs:mx-6 md:mx-[65px]"
    >
      <h1
        className="flex items-center md:text-[100px] xs:text-[48px] md:leading-[120px] 
        xs:text-[48px] font-semibold"
      >
        <div>
          JOIN OUR <span className="text-[#FF4C4C]">COMMUNITY</span>
        </div>
      </h1>
      <div className="flex flex-col gap-6">
        <h2
          className="font-bold md:text-[40px] xs:text-[24px] md:leading-[48px] 
          xs:leading-[29px] text-[#877B7B]"
        >
          Down to <span className="text-[#E4E4E4] italic">innovate?</span>
        </h2>
        <p className="md:text-lg xs:text-sm">
          <span className="font-bold">We strive for inclusivity</span>, and encourage passionate
          applicants to apply regardless of experience. We'd love to work with someone like you.
        </p>
        <button
          className="rounded-xl py-3 px-[20px] bg-[#A52424] text-white 
          font-bold hover:bg-[#D63D3D] w-fit"
        >
          <a href={config.applicationLink}>Apply now</a>
        </button>
      </div>
    </div>
    <div className="relative">
      <RedBlob className={'right-[-300px]'} intensity={0.5} />
    </div>
  </div>
);

const ApplyCoffeeChat = () => (
  <div className="relative flex justify-center text-[#FEFEFE] md:mb-[200px] xs:mb-[139px]">
    <RedBlob className="top-[-200px] left-[-400px] z-0" intensity={0.5} />
    <div className="max-w-5xl w-full lg:px-5 md:px-[60px] xs:px-6 relative">
      <h3 className="font-semibold md:text-[32px] xs:text-[22px] pb-4">Have more questions?</h3>
      <p className="md:text-[22px] md:leading-[26px] xs:text-[12px] xs:leading-[14px] pb-6">
        Feel free to chat with any of us over email, coffee, lunch-we're happy to help!
      </p>
      <div className="flex md:flex-row xs:flex-col gap-3">
        <button
          className="rounded-xl py-3 px-[20px] bg-[#A52424] text-white 
          font-bold hover:bg-[#D63D3D] w-fit"
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
  <div className="flex flex-col md:gap-[200px] xs:gap-[80px] overflow-hidden">
    <div>
      <ApplyHero />
      <ApplicationTimeline />
    </div>
    <RoleDescriptions />
    <ApplyFAQ />
    <ApplyCoffeeChat />
  </div>
);

export default ApplyPage;
