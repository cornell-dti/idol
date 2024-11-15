'use client';

import Link from 'next/link';
import RedBlob from '../../../components/blob';
import InitiativeDisplay from '../../../components/initiative/InitiativeDisplay';

const InitiativeHero = () => (
  <div
    className="bg-black text-[#FEFEFE] min-h-[calc(100vh-136px)] h-full flex items-center
    relative overflow-hidden"
  >
    <div
      className="flex lg:flex-row xs:flex-col gap-x-[60px] lg:ml-[90px] lg:mr-[169px]
      xs:mx-6 md:mx-[65px] relative z-20"
    >
      <h1
        className="flex items-center md:text-[100px] xs:text-[48px] md:leading-[120px] 
        xs:text-[48px] font-semibold"
      >
        <div>
          INSPIRING <span className="text-[#FF4C4C]">INNOVATION</span>
        </div>
      </h1>
      <div className="flex flex-col gap-6">
        <h2
          className="font-bold md:text-[40px] xs:text-[24px] md:leading-[48px] 
          xs:leading-[29px] text-[#877B7B]"
        >
          Invigorating <span className="text-[#E4E4E4] italic">growth</span>
        </h2>
        <p className="md:text-lg xs:text-sm">
          What sets us apart from other project teams is our desire to{' '}
          <span className="font-bold">share our discoveries</span> with other students and members
          of the greater Ithaca community.
        </p>
      </div>
    </div>
    <div className="relative">
      <RedBlob intensity={0.5} className="right-[-300px] bottom-[-600px]" />
    </div>
  </div>
);

const InitiativePage = () => (
  <div className="bg-white flex flex-col">
    <InitiativeHero />
    <InitiativeDisplay />
    <div className="flex justify-center bg-[#F5F5F5] lg:py-32 xs:py-16 lg:px-20 xs:px-7">
      <div className="max-w-7xl w-full flex flex-col lg:gap-6 xs:gap-3">
        <h3 className="font-semibold md:text-[32px] xs:text-[22px] leading-10">
          Want us to be a part of your next event?
        </h3>
        <p className="md:text-[22px] md:leading-[26px] xs:text-[12px] xs:leading-[14px]">
          Feel free to coordinate with us over email, coffee, lunch-we're excited to work with you.
        </p>
        <Link href="mailto:hello@cornelldti.org" className="primary-button">
          Get in touch
        </Link>
      </div>
    </div>
  </div>
);

export default InitiativePage;
