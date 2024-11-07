'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from './ui/button';

const Bottom: React.FC = () => (
  <div className="flex flex-col w-screen h-fit text-white justify-center">
    <div className="flex flex-col h-fit justify-center items-start px-8 md:flex-row md:px-14 lg:gap-x-12">
      <div className="flex flex-row h-fit justify-start align-middle py-10 w-full md:order-last gap-x-10 md:gap-x-5 max-w-[609px] z-10">
        <Image
          className="w-5/12"
          src="/images/teaching_1.svg"
          width={292}
          height={441}
          alt="teaching 1"
        />
        <div className="flex flex-col h-full w-7/12 gap-y-16">
          <Image
            className="w-11/12 self-end"
            src="/images/teaching_2.svg"
            width={276}
            height={179}
            alt="teachine 2"
          />
          <Image
            className="w-3/4 self-end"
            src="/images/teaching_3.svg"
            width={276}
            height={179}
            alt="teachine 3"
          />
        </div>
      </div>
      <div className="text-left w-full md:self-center max-w-[520px] relative z-10">
        <div className="flex flex-col gap-y-1 pb-3 md:gap-y-2">
          <p className="text-neutral-200 text-xs font-bold uppercase lg:text-lg">courses</p>
          <h5 className="text-lg font-semibold md:text-xl lg:text-[32px]">
            Teaching the Cornell Community
          </h5>
        </div>
        <div className="flex flex-col h-fit pb-3 justify-start gap-y-3 items-start md:gap-y-4">
          <div className="flex flex-row w-full justify-start">
            <Image
              className="w-12 h-auto pr-2"
              src="/icons/new_trends.svg"
              width={58}
              height={58}
              alt="Trends icon"
            />
            <div className="flex flex-col justify-start w-full items-start">
              <h6 className="text-left w-full font-bold md:text-sm lg:text-[22px]">
                Trends in Web Development
              </h6>
              <p className="md:text-xs lg:text-lg">
                Learn about modern industry-leading technologies.
              </p>
            </div>
          </div>
          <div className="flex flex-row w-full justify-start">
            <Image
              className="w-12 h-auto pr-2"
              src="/icons/propel_icon.svg"
              width={58}
              height={63}
              alt="Propel icon"
            />
            <div className="flex flex-col justify-start w-full items-start md:text-xs">
              <h6 className="text-left w-full font-bold md:text-sm lg:text-[22px]">Propel</h6>
              <p className="md:text-xs lg:text-lg">
                An incubator program devoted to student ideas.
              </p>
            </div>
          </div>
        </div>
        <Button className="px-3.5 py-3 w-fit h-fit bg-red-500 border-2 border-red-500 rounded-lg font-bold hover:border-red-800 hover:bg-red-800">
          Learn more
        </Button>
      </div>
    </div>
    <div className="flex flex-col h-fit justify-center items-start py-10 px-8 md:flex-row md:py-20 md:px-16">
      <div className="flex flex-col w-full py-10 gap-y-10 h-fit max-w-[578px]">
        <Image
          className="w-3/4 self-center"
          src="/images/outreach_1.svg"
          width={275}
          height={143}
          alt="outreach 1"
        />
        <div className="flex flex-row gap-x-10 w-full h-3/4">
          <Image
            className="w-1/2 self-end"
            src="/images/outreach_3.svg"
            width={154}
            height={104}
            alt="outreach 3"
          />
          <Image
            className="w-1/3 self-start"
            src="/images/outreach_2.svg"
            width={115}
            height={103}
            alt="outreach 2"
          />
        </div>
      </div>
      <div className="text-left w-full md:py-10 max-w-[559px]">
        <div className="flex flex-col gap-y-3 md:gap-y-4">
          <div className="flex flex-col gap-y-1 md:gap-y-2">
            <p className="text-neutral-200 text-xs font-bold uppercase lg:text-lg">outreach</p>
            <h5 className="text-lg font-semibold md:text-xl lg:text-[32px]">
              Expanding reach to our community
            </h5>
          </div>
          <p className="md:text-xs lg:text-lg">
            We strive to build initiatives not only at Cornell, but also in the{' '}
            <span className="font-bold">Ithaca community and beyond</span>.
          </p>
          <Button className="px-3.5 py-3 w-fit h-fit bg-red-500 border-2 border-red-500 rounded-lg font-bold hover:border-red-800 hover:bg-red-800">
            How we give back
          </Button>
        </div>
      </div>
    </div>
    <div className="flex flex-col h-fit justify-center items-start px-8 py-20 md:flex-row gap-x-10 md:py-24 md:px-16">
      <Image
        className="w-full py-10 md:self-cente md:order-last max-w-[662px]"
        src="/images/team.svg"
        width={377}
        height={286}
        alt="team"
      ></Image>
      <div className="text-left w-full flex flex-col gap-y-3 md:self-center md:gap-y-5 max-w-[389px]">
        <div className="flex flex-col gap-y-1 md:gap-y-2">
          <p className="text-neutral-200 text-xs font-bold uppercase lg:text-lg">team</p>
          <h5 className="text-lg font-semibold md:text-xl lg:text-[32px]">We're a family</h5>
        </div>
        <p className="md:text-xs lg:text-lg">
          We <span className="font-bold">solve real problems around us</span> to make our community
          better, while fostering our personal growth to{' '}
          <span className="font-bold">teach others from our experience.</span>
        </p>
        <div className="flex flex-row gap-x-3">
          <Button className="px-3.5 py-3 w-fit h-fit bg-red-500 border-2 border-red-500 rounded-lg font-bold hover:border-red-800 hover:bg-red-800">
            Get to know us
          </Button>
          <Button className="px-3.5 py-3 w-fit h-fit text-red-200 bg-transparent border-2 border-red-200 rounded-lg font-bold hover:bg-red-200 hover:text-red-800">
            Join us
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default Bottom;
