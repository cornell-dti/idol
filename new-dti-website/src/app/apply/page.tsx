'use client';

import ApplicationTimeline from '../../../components/apply/ApplicationTimeline';
import config from '../../../config.json';

const ApplyHero = () => (
  <div className="text-[#FEFEFE] min-h-[calc(100vh-136px)] flex items-center">
    <div
      className="flex lg:flex-row xs:flex-col gap-x-[60px] lg:ml-[90px] lg:mr-[169px]
    xs:mx-6 md:mx-[65px]"
    >
      <h1 className="flex items-center md:text-[100px] xs:text-[48px] md:leading-[120px] xs:text-[48px] font-semibold">
        <div>
          JOIN OUR <span className="text-[#FF4C4C]">COMMUNITY</span>
        </div>
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

const ApplyPage = () => (
  <div className="flex flex-col gap-[200px]">
    <ApplyHero />
    <ApplicationTimeline />
  </div>
);

export default ApplyPage;
