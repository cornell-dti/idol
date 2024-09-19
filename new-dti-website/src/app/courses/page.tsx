'use client';
// *IMPORTS
import RedBlob from '../../../components/blob';

export default function Courses() {
  return (
    <>
      <section id="Hero Section">
        <div
          className="bg-black text-white md:my-[100px] xs:my-9 min-h-[calc(100vh-250px)]
    flex items-center w-full overflow-hidden"
        >
          <div
            className="flex justify-around gap-y-10 md:gap-x-20 lg:flex-row flex-col w-10/12 relative z-10
      lg:mx-32 md:mx-10 xs:mx-9 md:gap-y-20"
          >
            <div className="flex flex-col md:gap-y-14">
              <h1
                className="font-semibold md:text-[150px] xs:text-[52px] md:leading-[120px] 
          xs:leading-[63px] whitespace-pre"
              >
                Our
              </h1>
              <h1
                className="font-semibold md:text-[150px] xs:text-[52px] md:leading-[120px] 
          xs:leading-[63px] whitespace-pre"
              >
                <span className="text-[#FF4C4C]">Course</span>
              </h1>
            </div>

            <div className="flex flex-col justify-center gap-6 ">
              <h2 className="font-bold md:text-[45px] xs:text-2xl">
                <span className="text-[#877B7B]">Teaching the</span>{' '}
                <span className="italic">community</span>
              </h2>
              <p className="md:text-lg xs:text-sm">
                A project team is meant, above all, to be a learning experience. Given our mission
                of community impact, we want to help everyone learn and grow through our training
                course in product development.{' '}
              </p>
            </div>
          </div>
          <div className="relative top-[-150px]">
            <RedBlob className={'right-[-300px]'} intensity={0.3} />
          </div>
        </div>
      </section>

      <section id="Trends and Web Development">
        <div className="bg-[#EDEDED] text-black flex flex-col lg:flex-row lg:items-center min-h-[60vh]">
          <div className="w-1/2">Logo</div>

          <div className="flex flex-col w-1/2">
            <div className="font-black md:text-xl xs:text-2xl tracking-wider">
              MODERN INDUSTRY-LEADING TECHNOLOGY
            </div>

            <div className="font-bold md:text-[45px] xs:text-2xl tracking-wider mt-4">
              Trends in Web Development
            </div>

            <div className="md:text-lg xs:text-sm mt-8">
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
    </>
  );
}
