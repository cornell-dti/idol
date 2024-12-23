'use client';

// *IMPORTS
import Image from 'next/image';

import React, { useRef, useState } from 'react';

// *IMPORT DATA
import experiencesData from '../../../components/course/data/key_experiences.json';
import timelineData from '../../../components/course/data/timeline_events.json';
import testimonialData from '../../../components/course/data/testimonials.json';
import studentProjectData from '../../../components/course/data/student_projects.json';
import trendsData from '../../../config.json';
import allMembers from '../../../components/team/data/all-members.json';
import config from '../../../components/course/data/config.json';

// *IMPORT COMPONENTS
import RedBlob from '../../../components/blob';
import Experiences from '../../../components/course/Experiences';
import Timeline from '../../../components/course/Timeline';
import MemberGroup from '../../../components/team/MemberGroup';
import TestimonialSlider from '../../../components/course/TestimonialSlider';
import DDProjects from '../../../components/course/DDProjects';
import { TestimonialCardProps } from '../../../components/course/TestimonialCard';
import SectionWrapper from '../../../components/hoc/SectionWrapper';

//* DATA
const { key_experiences } = experiencesData;
const { timeline_events } = timelineData;
const { testimonials }: { testimonials: TestimonialCardProps[] } = testimonialData;
const { student_projects } = studentProjectData;
const trends_instructors = allMembers
  .filter((member) => trendsData.trends_instructors.includes(member.netid))
  .sort(
    (instructor1, instructor2) =>
      trendsData.trends_instructors.findIndex((netid) => netid === instructor1.netid) -
      trendsData.trends_instructors.findIndex((netid) => netid === instructor2.netid)
  ) as IdolMember[];

// * BEGIN COURSES PAGE
export default function Courses() {
  const trendsLogoRef = useRef<HTMLImageElement>(null);
  const [selectedMember, setSelectedMember] = useState<IdolMember | undefined>(undefined);

  const memberDetailsRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (
            !(
              target.classList.contains('card-clickable') ||
              target.parentElement?.classList.contains('card-clickable')
            ) &&
            !memberDetailsRef.current?.contains(target)
          )
            setSelectedMember(undefined);
        }}
      >
        {/* Hero Section */}
        <section id="Hero Section">
          <div
            className="bg-black text-white md:my-[100px] xs:my-9 min-h-[calc(100vh-300px)] 
    flex items-center w-full overflow-hidden"
          >
            <SectionWrapper id={'Product Page Hero Section'}>
              <div className="flex justify-around gap-y-10 md:gap-x-20 lg:flex-row flex-col relative z-10 md:gap-y-20">
                <div className="flex flex-col gap-y-8 md:gap-y-0">
                  <div>
                    <h1 className="font-semibold md:text-header xs:text-[52px] md:leading-header xs:leading-header-xs whitespace-pre">
                      OUR <br />
                      <span className="text-[#FF4C4C]">COURSE</span>
                    </h1>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-6 ">
                  <h2 className="font-bold md:text-subheader xs:text-2xl text-hero-primary md:leading-subheader">
                    Teaching the community
                  </h2>
                  <p className="md:text-lg xs:text-sm text-hero-secondary md:leading-body-text">
                    A project team is meant, above all, to be a learning experience. Given our
                    mission of community impact, we want to help everyone learn and grow through our
                    training course in product development.
                  </p>
                </div>
              </div>
            </SectionWrapper>
            <div className="relative top-[-250px]">
              <RedBlob className={'right-[-250px]'} intensity={0.3} />
            </div>
          </div>
        </section>

        {/* WRAPPER */}
        <div
          id="Wrapper"
          className="flex flex-col pb-10 gap-y-28 md:gap-y-36 lg:gap-y-44 bg-[#EDEDED] text-black "
        >
          <SectionWrapper id={'Products Page Logo Section'}>
            <div className="flex flex-col pt-20 lg:flex-row lg:items-center lg:justify-around">
              <div ref={trendsLogoRef} className="w-1/2">
                <Image
                  src={'/icons/courses/trends_logo.png'}
                  width={450}
                  height={450}
                  alt="Trends Logo composed of the firebase, react, typescript, nodejs, vscode, and DTI logos."
                  unoptimized
                  className="w-72 md:w-96 lg:w-[450px]"
                />
              </div>

              <div className="flex flex-col lg:w-1/2">
                <div className="font-semibold text-sm md:text-xl uppercase !text-[18px] tracking-[1px] text-[#666]">
                  Modern industry-leading technology
                </div>

                <h2 className="font-bold text-4xl mt-4 md:text-[40px]">
                  Trends in Web Development
                </h2>

                <div className="md:text-lg mt-8">
                  Trends in Web Development in a 1-credit S/U course that showcase modern full-stack
                  development and best practices used within industry. We cover technologies like
                  TypeScript, React, Node.js, Firebase, Express and more, all of which are deployed
                  at scale by leading tech companies.
                </div>

                <div className="flex flex-row gap-x-6 mt-6">
                  <a
                    key="Trends Application"
                    href={config.trendsApplicationLink}
                    className="primary-button"
                  >
                    Apply Now
                  </a>
                  <a
                    key="Trends Website"
                    href={config.trendsWebsiteLink}
                    className="secondary-button secondary-button--red"
                    aria-label="Trends Website"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </SectionWrapper>

          {/* KEY EXPERIENCES SECTION */}
          <SectionWrapper id={'Key Experiences'}>
            <div className="flex flex-col items-center gap-y-20 md:gap-x-10 md:flex-row md:items-center md:justify-around">
              {key_experiences.map((experiences) => (
                <Experiences
                  icon={experiences.icon}
                  title={experiences.title}
                  description={experiences.description}
                />
              ))}
            </div>
          </SectionWrapper>

          {/* TIMELINE SECTION */}
          <section id="Timeline">
            <Timeline events={timeline_events} currentDate={new Date()} />
          </section>

          {/* COURSE STAFF SECTION */}
          <SectionWrapper id={'Course Staff'}>
            <div className="flex flex-col items-center">
              <h2 className="font-bold md:text-[40px] xs:text-4xl">Course Staff</h2>
              <div className="pt-14">
                <MemberGroup
                  members={trends_instructors}
                  setSelectedMember={setSelectedMember}
                  selectedMember={selectedMember}
                  memberDetailsRef={memberDetailsRef}
                  isCard={true}
                />
              </div>
            </div>
          </SectionWrapper>

          {/* PAST STUDENT EXPERIENCES SECTION */}
          <SectionWrapper id={'Past Student Experiences'}>
            <div className="font-bold text-4xl md:text-[40px] w-[1200px]">
              Past Student Experiences
            </div>
            <TestimonialSlider testimonials={testimonials} className="w-screen" />
          </SectionWrapper>

          {/* PAST STUDENT PROJECTS SECTION */}
          <SectionWrapper id={'Past Student Projects'}>
            <div className="flex flex-col">
              <div className="font-bold md:text-[40px] xs:text-4xl">Past Student Projects</div>
              <div className="md:text-2xl xs:text-lg pt-8">
                See how our course helps students bring their ideas to life.
              </div>
              <div className="space-y-8 pt-20">
                {student_projects.map((project) => (
                  <DDProjects
                    title={project.title}
                    description={project.description}
                    imageSrc={project.imageSrc}
                  />
                ))}
              </div>
            </div>
          </SectionWrapper>
        </div>
      </div>
    </>
  );
}
