'use client';

// *IMPORTS
import Image from 'next/image';
import Link from 'next/link';
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
              target.classList.contains('memberCard') ||
              target.parentElement?.classList.contains('memberCard')
            ) &&
            !memberDetailsRef.current?.contains(target)
          )
            setSelectedMember(undefined);
        }}
      >
        {/* Hero Section */}
        <section id="Hero Section">
          <div
            className="bg-black text-white md:my-[100px] xs:my-9 min-h-[calc(100vh-336px)] 
    flex items-center w-full overflow-hidden"
          >
            <div
              className="flex justify-around gap-y-10 md:gap-x-20 lg:flex-row flex-col w-10/12 relative z-10
      lg:mx-32 md:mx-10 xs:mx-9 md:gap-y-20"
            >
              <div className="flex flex-col gap-y-8 md:gap-y-0">
                <div>
                  <h1
                    className="font-semibold md:text-[100px] xs:text-[52px] md:leading-[120px] 
          xs:leading-[63px] whitespace-pre"
                  >
                    OUR <br />
                    <span className="text-[#FF4C4C]">COURSE</span>
                  </h1>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-6 ">
                <h2 className="font-bold md:text-[40px] xs:text-2xl text-hero-primary">
                  Teaching the community
                </h2>
                <p className="md:text-lg xs:text-sm text-hero-secondary">
                  A project team is meant, above all, to be a learning experience. Given our mission
                  of <span className="font-black">community impact</span>, we want to help everyone{' '}
                  <span className="font-black">learn and grow</span> through our training course in{' '}
                  <span className="font-black">product development.</span>
                </p>
              </div>
            </div>
            <div className="relative top-[-250px]">
              <RedBlob className={'right-[-250px]'} intensity={0.3} />
            </div>
          </div>
        </section>

        {/* WRAPPER */}
        <div
          id="Wrapper"
          className="flex flex-col py-10 lg:py-20 gap-y-36 md:gap-y-56 lg:gap-y-80 bg-[#EDEDED] text-black "
        >
          {/* LOGO SECTION */}
          <section id="Trends and Web Development">
            <div className=" flex flex-col pl-10 pt-20 lg:flex-row lg:items-center lg:justify-around">
              <div ref={trendsLogoRef} className="sticker">
                <Image
                  src={'/icons/courses/trends_logo.png'}
                  width={450}
                  height={450}
                  alt="Trends Logo"
                  unoptimized
                  className="w-72 md:w-96 lg:w-[450px]"
                />
              </div>

              <div className="flex flex-col lg:w-1/2">
                <div className="font-black text-sm md:text-xl tracking-wider">
                  MODERN INDUSTRY-LEADING TECHNOLOGY
                </div>

                <div className="font-black text-4xl tracking-wider mt-4 md:text-[45px]">
                  Trends in Web Development
                </div>

                <div className="text-md md:text-2xl mt-8">
                  Trends in Web Development in a 1-credit S/U course that showcase modern full-stack
                  development and best practices used within industry. We cover technologies like
                  TypeScript, React, Node.js, Firebase, Express and more, all of which are deployed
                  at scale by leading tech companies
                </div>

                <div className="flex flex-row gap-x-6 mt-6">
                  <Link
                    key="Trends Application"
                    href={config.trendsApplicationLink}
                    className="primary-button"
                  >
                    Apply Now
                  </Link>
                  <Link
                    key="Trends Website"
                    href={config.trendsWebsiteLink}
                    className="primary-button"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* KEY EXPERIENCES SECTION */}
          <section id="Key Experiences">
            <div className="flex flex-col items-center gap-y-20 px-10 lg:px-20 md:gap-x-10 md:flex-row md:items-center md:justify-around">
              {key_experiences.map((experiences) => (
                <Experiences
                  icon={experiences.icon}
                  title={experiences.title}
                  description={experiences.description}
                />
              ))}
            </div>
          </section>

          {/* TIMELINE SECTION */}
          <section id="Timeline">
            <div>
              <Timeline events={timeline_events} currentDate={new Date()} />
            </div>
          </section>

          {/* COURSE STAFF SECTION */}
          <section id="Course Staff">
            <div className="flex flex-col items-center">
              <div className="font-black md:text-[45px] xs:text-4xl tracking-wider">
                Course Staff
              </div>
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
          </section>

          {/* PAST STUDENT EXPERIENCES SECTION */}
          <section id="Past Student Experiences">
            <div className="flex flex-col">
              <div className="font-black text-4xl tracking-wider pl-10 md:pl-32 md:text-[45px] ">
                Past Student Experiences
              </div>
              <TestimonialSlider testimonials={testimonials} />
            </div>
          </section>

          {/* PAST STUDENT PROJECTS SECTION */}
          <section id="Past Student Projects">
            <div className="flex flex-col px-10 md:px-32">
              <div className="font-black md:text-[45px] xs:text-4xl tracking-wider">
                Past Student Projects
              </div>
              <div className="md:text-2xl xs:text-lg pt-8">
                With the right skills, you will be able to create projects like ours.
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
          </section>
        </div>
      </div>
    </>
  );
}
