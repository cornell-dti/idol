'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from './ui/button';

const Bottom: React.FC = () => (
  <div className="border-2 border-red-500 flex flex-col w-screen h-fit text-white justify-center">
    <div className="border-2 border-red-500 flex flex-col h-fit justify-center items-start px-8 md:flex-row">
      <div className="border-2 border-red-500 flex flex-row h-fit justify-start">
        <Image
          className="w-28"
          src="/images/teaching_1.svg"
          width={292}
          height={441}
          alt="teaching 1"
        />
        <div className="border-2 border-red-500 pl-10 flex flex-col h-full">
          <Image
            className="w-32"
            src="/images/teaching_2.svg"
            width={276}
            height={179}
            alt="teachine 2"
          />
          <Image
            className="w-28"
            src="/images/teaching_3.svg"
            width={276}
            height={179}
            alt="teachine 3"
          />
        </div>
      </div>
      <div className="border-2 border-red-500 text-left w-full">
        <div className="flex flex-col gap-y-1 pb-3">
          <p className="text-neutral-200 text-xs font-bold uppercase">courses</p>
          <h5 className="text-lg font-semibold">Teaching the Cornell Community</h5>
        </div>
        <div className="border-2 border-red-500 flex flex-col h-fit pb-3 justify-start gap-y-3 items-start">
          <div className="border-2 border-red-500 flex flex-row w-full justify-start">
            <Image
              className="w-12 h-auto pr-2"
              src="/icons/new_trends.svg"
              width={58}
              height={58}
              alt="Trends icon"
            />
            <div className="border-2 border-red-500 flex flex-col justify-start w-full items-start">
              <h6 className="text-left w-full font-bold">Trends in Web Development</h6>
              <p>Learn about modern industry-leading technologies.</p>
            </div>
          </div>
          <div className="border-2 border-red-500 flex flex-row w-full justify-start">
            <Image
              className="w-12 h-auto pr-2"
              src="/icons/propel_icon.svg"
              width={58}
              height={63}
              alt="Propel icon"
            />
            <div className="border-2 border-red-500 flex flex-col justify-start w-full items-start">
              <h6 className="text-left w-full font-bold">Propel</h6>
              <p>An incubator program devoted to student ideas.</p>
            </div>
          </div>
        </div>
        <Button className="px-3.5 py-3 w-fit h-fit bg-red-500 border-2 border-red-500 rounded-lg font-bold">
          Learn more
        </Button>
      </div>{' '}
    </div>
    <div className="border-2 border-red-500 flex flex-col h-fit justify-center items-start px-8 md:flex-row">
      <div className="border-2 border-red-500 flex flex-col">
        <Image
          className="w-64"
          src="/images/outreach_1.svg"
          width={275}
          height={143}
          alt="outreach 1"
        />
        <div className="border-2 border-red-500 flex flex-row">
          <Image
            className="w-28"
            src="/images/outreach_2.svg"
            width={115}
            height={103}
            alt="outreach 2"
          />
          <Image
            className="w-36"
            src="/images/outreach_3.svg"
            width={154}
            height={104}
            alt="outreach 3"
          />
        </div>
      </div>
      <div className="border-2 border-red-500 text-left w-full">
        <div className="border-2 border-red-500 flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-1">
            <p className="text-neutral-200 text-xs font-bold uppercase">outreach</p>
            <h5 className="text-lg font-semibold">Expanding reach to our community</h5>
          </div>
          <p>
            We strive to build initiatives not only at Cornell, but also in the{' '}
            <span className="font-bold">Ithaca community and beyond</span>
          </p>
          <Button className="px-3.5 py-3 w-fit h-fit bg-red-500 border-2 border-red-500 rounded-lg font-bold">
            How we give back
          </Button>
        </div>
      </div>
    </div>
    <div className="border-2 border-red-500 flex flex-col h-fit justify-center items-start px-8 md:flex-row">
      <Image className="w-80" src="/images/team.svg" width={377} height={286} alt="team"></Image>
      <div className="border-2 border-red-500 text-left w-full pb-3">
        <p className="text-neutral-200 text-xs font-bold uppercase">team</p>
        <h5 className="text-lg font-semibold">We're a family</h5>
        <p>
          We <span className="font-bold">solve real problems around us</span> to make our community
          better, while fostering our personal growth to{' '}
          <span className="font-bold">teach others from our experience.</span>
        </p>
        <div className="border-2 border-red-500 flex flex-row gap-x-3">
          <Button className="px-3.5 py-3 w-fit h-fit bg-red-500 border-2 border-red-500 rounded-lg font-bold">
            Get to know us
          </Button>
          <Button className="px-3.5 py-3 w-fit h-fit text-red-200 bg-transparent border-2 border-red-200 rounded-lg font-bold">
            Join us
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default Bottom;
