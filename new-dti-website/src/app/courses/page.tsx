'use client';
// *IMPORTS
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';

// *DATA
import experiencesData from '../../../components/courses/data/key_experiences.json';

// *COMPONENTS
import RedBlob from '../../../components/blob';
import Experiences from '../../../components/courses/Experiences';

const { key_experiences } = experiencesData;

export default function Courses() {
  const trendsLogoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && trendsLogoRef.current) {
          trendsLogoRef.current.classList.add('sticker-animate');
        }
      },
      { threshold: 0.5 }
    );

    if (trendsLogoRef.current) {
      observer.observe(trendsLogoRef.current);
    }

    return () => {
      if (trendsLogoRef.current) {
        observer.unobserve(trendsLogoRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section id="Hero Section">
        <div
          className="bg-black text-white md:my-[100px] xs:my-9 min-h-[calc(100vh-250px)]
    flex items-center w-full overflow-hidden"
        >
          <div
            className="flex justify-around gap-y-10 md:gap-x-20 lg:flex-row flex-col w-10/12 relative z-10
      lg:mx-32 md:mx-10 xs:mx-9 md:gap-y-20"
          >
            <div className="flex flex-col gap-y-8 md:gap-y-0">
              <h1
                className="font-semibold md:text-9xl xs:text-7xl md:leading-[120px] 
          xs:leading-[63px] whitespace-pre"
              >
                OUR
              </h1>
              <h1
                className="font-semibold md:text-9xl xs:text-7xl md:leading-[120px] 
          xs:leading-[63px] whitespace-pre"
              >
                <span className="text-[#FF4C4C]">COURSE</span>
              </h1>
            </div>

            <div className="flex flex-col justify-center gap-6 ">
              <h2 className="font-bold md:text-5xl xs:text-4xl">
                <span className="text-[#877B7B]">Teaching the</span>{' '}
                <span className="italic">community</span>
              </h2>
              <p className="md:text-lg xs:text-md font-thin text-slate-300">
                A project team is meant, above all, to be a learning experience. Given our mission
                of <span className="font-black text-xl text-white">community impact</span>, we want
                to help everyone <b className="font-black text-xl text-white">learn and grow</b>{' '}
                through our training course in{' '}
                <b className="font-black text-xl text-white">product development</b>.{' '}
              </p>
            </div>
          </div>
          <div className="relative top-[-150px]">
            <RedBlob className={'right-[-300px]'} intensity={0.3} />
          </div>
        </div>
      </section>

      {/* LOGO SECTION */}
      <section id="Trends and Web Development">
        <div className="bg-[#EDEDED] text-black flex flex-col pl-10 lg:flex-row lg:items-center lg:justify-around min-h-[60vh]">
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
            <div className="font-black md:text-xl xs:text-lg tracking-wider">
              MODERN INDUSTRY-LEADING TECHNOLOGY
            </div>

            <div className="font-black md:text-[45px] xs:text-4xl tracking-wider mt-4">
              Trends in Web Development
            </div>

            <div className="xs:text-lg mt-8">
              Trends in Web Development in a 2-credit S/U course that showcase modern full-stack
              development and best practices used within industry. We cover technologies like
              TypeScript, React, Node.js, Firebase, Express and more, all of which are deployed at
              scale by leading tech companies
            </div>

            <div className="flex flex-row gap-x-6 mt-6">
              <button
                className="rounded-xl py-3 px-4 bg-[#A52424] text-white 
          font-bold hover:bg-white hover:text-[#A52424] border-4 hover:border-[#A52424] w-fit"
              >
                Apply Now
              </button>
              <button
                className="rounded-xl py-3 px-4 bg-[#A52424] text-white 
          font-bold hover:bg-white hover:text-[#A52424] border-4 hover:border-[#A52424] w-fit"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TODO: KEY EXPERIENCES SECTION */}
      <section id="Key Experiences">
        <div className="bg-[#EDEDED] text-black flex flex-col items-center gap-y-20 px-20 md:gap-x-10 md:flex-row md:items-center md:justify-around min-h-[60vh]">
          {key_experiences.map((experiences) => (
            <Experiences
              icon={experiences.icon}
              title={experiences.title}
              description={experiences.description}
            />
          ))}
        </div>
      </section>

      {/* TODO: TIMELINE SECTION */}
      <section id="Timeline"></section>

      {/* TODO: COURSE STAFF SECTION*/}
      <section id="Course Staff"></section>

      {/* TODO: PAST STUDENT EXPERIENCES SECTION*/}
      <section id="Past Student Experiences"></section>

      {/* TODO: PAST STUDENT PROJECTS SECTION*/}
      <section id="Past Student Projects"></section>

      {/* STYLING SECTION */}
      <style>{`
        .sticker {
          opacity: 0;
          transform: scale(0) rotate(-15deg);
          transition:
            transform 0.6s ease-out,
            opacity 0.6s ease-out;
        }

        .sticker-animate {
          opacity: 1;
          transform: scale(1) rotate(0);
        }
      `}</style>
    </>
  );
}
