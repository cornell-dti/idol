'use client';

import React from 'react';
import Image from 'next/image';
import SectionWrapper from './hoc/SectionWrapper';

const Bottom: React.FC = () => (
  <div className="flex flex-col w-screen h-fit text-white justify-center">
    <SectionWrapper
      id={'Home Page Bottom section Wrapper 1'}
      className="flex flex-col h-fit justify-center items-start md:flex-row lg:gap-x-12"
    >
      <div className="flex flex-row h-fit justify-start align-middle py-10 w-full md:order-last gap-x-10 md:gap-x-5 z-10">
        <Image
          className="self-center rounded-[16px]"
          src="/images/home-1.png"
          width={576}
          height={576}
          alt="DTI members in front of a whiteboard pasting sticky notes in a brainstorming session"
        />
      </div>
      <div className="text-left w-full md:self-center max-w-[520px] relative z-10">
        <div className="flex flex-col gap-[16px]">
          <p className="uppercase text-[16px] tracking-[1px] text-hero-secondary font-medium">
            Courses
          </p>
          <div className="flex flex-col gap-[8px]">
            <h2 className="text-[32px] font-semibold lg:leading-10">
              Teaching the Cornell community
            </h2>

            <p className="text-hero-secondary text-[18px]">
              Learn about modern industry-leading technologies with DTI courses, and explore your
              ideas through our incubator program.
            </p>
          </div>

          <a href="/course" className="primary-button">
            Learn more
          </a>
        </div>
      </div>
    </SectionWrapper>

    <SectionWrapper
      id={'Home Page Bottom section Wrapper 2'}
      className="flex flex-col md:flex-row-reverse h-fit justify-center items-start md:gap-x-12"
    >
      <div className="flex flex-row h-fit justify-start align-middle py-10 w-full md:order-last gap-x-10 md:gap-x-5 z-10">
        <Image
          className="self-center rounded-[16px]"
          src="/images/home-2.png"
          width={576}
          height={576}
          alt="DTI members teaching a Figma workshop"
        />
      </div>
      <div className="text-left w-full md:self-center max-w-[520px] relative z-10">
        <div className="flex flex-col gap-[16px]">
          <p className="uppercase text-[16px] tracking-[1px] text-hero-secondary font-medium">
            Outreach
          </p>
          <div className="flex flex-col gap-[8px]">
            <h2 className="text-[32px] font-semibold lg:leading-10">
              Expanding reach to our community
            </h2>

            <p className="text-hero-secondary text-[18px]">
              We strive to build initiatives not only at Cornell, but also in the Ithaca community
              and beyond.
            </p>
          </div>

          <a href="/initiatives" className="primary-button">
            How we give back
          </a>
        </div>
      </div>
    </SectionWrapper>

    <SectionWrapper
      id={'Home Page Bottom section Wrapper 3'}
      className="flex flex-col h-fit justify-center items-start md:flex-row lg:gap-x-12"
    >
      <div className="flex flex-row h-fit justify-start align-middle py-10 w-full md:order-last gap-x-10 md:gap-x-5 z-10">
        <Image
          className="self-center rounded-[16px]"
          src="/images/home-3.jpg"
          width={576}
          height={576}
          alt="DTI members on the slope"
        />
      </div>
      <div className="text-left w-full md:self-center max-w-[520px] relative z-10">
        <div className="flex flex-col gap-[16px]">
          <p className="uppercase text-[16px] tracking-[1px] text-hero-secondary font-medium">
            Team
          </p>
          <div className="flex flex-col gap-[8px]">
            <h2 className="text-[32px] font-semibold lg:leading-10">We're a family</h2>

            <p className="text-hero-secondary text-[18px]">
              We solve real-world problems to improve our community while growing personally and
              sharing our experiences to help others learn.
            </p>
          </div>

          <div className="flex flex-row gap-x-3">
            <a href="/team" className="primary-button">
              Get to know us
            </a>
            <a href="/apply" className="secondary-button">
              Join us
            </a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  </div>
);

export default Bottom;
