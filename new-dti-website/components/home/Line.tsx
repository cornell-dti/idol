'use client';
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import useScreenSize from '../../src/hooks/useScreenSize';
import { TABLET_BREAKPOINT, MOBILE_BREAKPOINT } from '../../src/consts';
import Node from './Node';
import nodes from './data/home.json';

const Line: React.FC = () => {
  const line1Ref = useRef<SVGPathElement | null>(null);
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIcon, setActiveIcon] = useState({
    design: false,
    development: false,
    innovation: false,
    creatingTechnology: false,
    community: false
  });
  const [rotationDegree, setRotationDegree] = useState(0);
  const { width } = useScreenSize();
  const [isSmall, setIsSmall] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!line1Ref.current || !componentRef.current) return;

      const pathLength = line1Ref.current.getTotalLength();
      line1Ref.current.style.strokeDasharray = `${pathLength}`;
      line1Ref.current.style.strokeDashoffset = `${pathLength}`;

      const componentPosition = componentRef.current.getBoundingClientRect().top + window.scrollY;
      const componentHeight = componentRef.current.offsetHeight;
      const startAnimationScrollY = componentPosition + componentHeight * 0.3;
      const endAnimationScrollY = componentPosition + componentHeight;

      const scrollY = window.scrollY + window.innerHeight;
      if (scrollY > startAnimationScrollY && scrollY < endAnimationScrollY) {
        const scrollProgress =
          (scrollY - startAnimationScrollY) / (endAnimationScrollY - startAnimationScrollY);
        const dashOffset = pathLength - pathLength * scrollProgress;
        line1Ref.current.style.strokeDashoffset = dashOffset.toString();

        // * Calculate progress in percentage
        // ? Might need to adjust depending due to clipping
        const progressPercentage = scrollProgress * 100;
        if (progressPercentage >= 65 && progressPercentage <= 100) {
          const normalizedProgress = (progressPercentage - 65) / (100 - 65);
          const mappedDegree = normalizedProgress * 360;
          setRotationDegree(mappedDegree);
        } else if (progressPercentage < 65) {
          setRotationDegree(0);
        }

        // * Update icons based on scroll progress
        // TODO: Decide if it should just be opacity or a new icon?
        setActiveIcon({
          design: progressPercentage >= 5,
          development: progressPercentage >= 16,
          innovation: progressPercentage >= 26,
          creatingTechnology: progressPercentage >= 34,
          community: progressPercentage >= 40
        });
      } else if (scrollY <= startAnimationScrollY) {
        line1Ref.current.style.strokeDashoffset = `${pathLength}`;
        setActiveIcon({
          design: false,
          development: false,
          innovation: false,
          creatingTechnology: false,
          community: false
        });
      } else if (scrollY >= endAnimationScrollY) {
        line1Ref.current.style.strokeDashoffset = '0';
        setActiveIcon({
          design: true,
          development: true,
          innovation: true,
          creatingTechnology: true,
          community: true
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible]);

  return (
    <>
      {/* Begin Parent Div Container*/}
      <div className="relative max-w-full bg-black border border-blue-500" ref={componentRef}>
        {/* Begin Line Component */}
        <div className="relative w-full h-auto" ref={componentRef}>
          {width >= MOBILE_BREAKPOINT ? (
            <div className="relative">
              <svg
                ref={svgRef}
                className="opacity-50 static w-[80vw] h-auto"
                viewBox="0 0 1230 2700"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke="#FEFEFE"
                  strokeWidth="7"
                  d="M3.93038 0.292969L869.93 585.293L873.66 587.812L869.936 590.479L312.749 989.538L312.749 1283.37L312.985 1283.36L312.985 1507.19L1224.13 1507.19H1226.98L1226.98 1510.23L1226.98 1678.73V1681.88H1224.03L761.985 1681.88V1867.07C984.692 1871.06 1164 2052.84 1164 2276.5C1164 2502.66 980.661 2686 754.5 2686C528.339 2686 345 2502.66 345 2276.5C345 2050.34 528.339 1867 754.5 1867C755.061 1867 755.622 1867 756.183"
                />
              </svg>
              <svg
                className="flex absolute top-0 w-[80vw] h-auto"
                viewBox="0 0 1230 2700"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  ref={line1Ref}
                  stroke="#FEFEFE"
                  strokeWidth="9"
                  d="M3.93038 0.292969L869.93 585.293L873.66 587.812L869.936 590.479L312.749 989.538L312.749 1283.37L312.985 1283.36L312.985 1507.19L1224.13 1507.19H1226.98L1226.98 1510.23L1226.98 1678.73V1681.88H1224.03L761.985 1681.88V1867.07C984.692 1871.06 1164 2052.84 1164 2276.5C1164 2502.66 980.661 2686 754.5 2686C528.339 2686 345 2502.66 345 2276.5C345 2050.34 528.339 1867 754.5 1867C755.061 1867 755.622 1867 756.183"
                />
              </svg>
            </div>
          ) : (
            <div className="relative">
              <svg
                ref={svgRef}
                className="opacity-50 static w-screen h-auto"
                viewBox="620 0 596 2096"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M619.877 1.9999L1162.877 581L675.377 1092L675.377 1456.5M925.876 1995.5L925.877 1703.5L1119.376 1703.5L1119.377 1521.5L675.377 1521.5L675.377 1421"
                  stroke="#FEFEFE"
                  strokeWidth="4"
                />
              </svg>
              <svg
                className="flex absolute top-0 w-screen h-auto"
                viewBox="620 0 596 2096"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  ref={line1Ref}
                  d="M619.877 1.9999L1162.877 581L675.377 1092L675.377 1456.5M925.876 1995.5L925.877 1703.5L1119.376 1703.5L1119.377 1521.5L675.377 1521.5L675.377 1421"
                  stroke="#FEFEFE"
                  strokeWidth="4"
                />
              </svg>
            </div>
          )}
        </div>
        {/* End of Lind Component */}

        {/* Beginning of Icons and text*/}
        {/* First Row */}
        <div className="flex absolute top-[3%] left-[10%] sm:top-[3%] sm:left-[12%] md:top-[4%] md:left-[13%] lg:top-[5%] lg:left-[13%] xl:top-[5%] xl:left-[13%] border border-white sm:border-purple-500 md:border-pink-500 lg:border-red-500 xl:border-blue-500 2xl:border-green-500">
          <Node
            mainIcon={nodes.design[0].mainIcon}
            title={nodes.design[0].title}
            description={nodes.design[0].description}
            images={nodes.design[0].images}
          />
        </div>
        {/* {width >= TABLET_BREAKPOINT ? (
          <div className="inline-flex items-center border-2 border-green-300 space-x-5 tracking-normal lg:tracking-widest absolute h-auto text-white top-[20%] left-[54%]">
            <Image
              className="h-auto w-16 sm:w-20 md:w-24 lg:w-32"
              src={activeIcon.development ? development : developmentdim}
              alt="Development Icon"
            />
            <div className="flex flex-col space-y-3">
              <div className="text-xl lg:text-4xl font-semibold tracking-widest">DEVELOPMENT</div>
              <p className="text-md lg:text-2xl">
                Bringing ideas to life and creating<br></br> quality digital products.
              </p>
            </div>
          </div>
        ) : (
          <div
            className="inline-flex items-center border-2 border-green-300 space-x-5 tracking-normal lg:tracking-widest absolute h-auto text-white top-[5%] left-[15%]"
            style={{ transform: 'translateY(30px)' }}
          >
            <div className="flex flex-col">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold tracking-widest">
                DEVELOPMENT
              </div>
              <p className="text-xs sm:text-sm md:text-md lg:text-2xl lg:mt-2">
                Bringing ideas to life and <br></br>creating quality digital<br></br>products.
              </p>
            </div>
            <Image
              className="h-auto w-16 lg:w-[120px]"
              src={activeIcon.development ? development : developmentdim}
              alt="Development Icon"
            />
          </div>
        )} */}

        {/* <div
                ref={imageRef2}
                className="flex flex-row col-span-2 row-start-5 border-2 border-green-300 space-x-5 tracking-normal lg:tracking-widest"
                style={{ transform: 'translateY(70px)' }}
              >
                <Image
                  className="h-auto w-16 sm:w-20 md:w-24 lg:w-32"
                  src={activeIcon.innovation ? innovation : innovationdim}
                  alt="innovation Icon"
                />
                <div className="flex flex-col lg:flex-row lg:space-x-5">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold tracking-widest">
                    INNOVATION
                  </div>
                  <p className="text-xs sm:text-sm md:text-md lg:text-2xl lg:mt-2">
                    Pioneering new ideas to solve real<br></br> problems in our community, at
                    <br></br> Cornell and beyond.
                  </p>
                </div>
              </div> */}

        {/* Second Row: Text */}
        {/* <div className="text-white row-start-2">
              <div
                className={`text-4xl ml-96 mt-10 ${
                  activeIcon.creatingTechnology ? 'opacity-100' : 'opacity-50'
                }`}
              >
                Creating technology
              </div>
              <div
                className={`text-4xl ml-28 mt-44 ${
                  activeIcon.community ? 'opacity-100' : 'opacity-50'
                }`}
              >
                for community impact
              </div>
            </div> */}

        {/* Third Row */}
        {/* Wheel of Product Icons TODO */}
        {/* <div className="flex flex-col relative row-start-3 items-center justify-center col-span-2 text-white border-2 border-red-500">
              <div className="flex flex-col items-center space-y-6 tracking-wide mr-20">
                <div className="text-4xl font-semibold">Our products define us</div>
                <div className="text-2xl font-light">
                  5 launched products. The student body as our users.
                </div>
                <button className="flex flex-row text-xl space-x-2 pl-10 pr-6 py-3 h-fit w-fit bg-red-500 border-2 border-red-500 rounded-lg font-bold hover:border-red-800 hover:bg-red-800">
                  <div>Explore our products</div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    strokeLinejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 12l14 0" />
                    <path d="M15 16l4 -4" />
                    <path d="M15 8l4 4" />
                  </svg>
                </button>
              </div>
              <div
                className="flex flex-col justify-center relative w-screen mr-20 mt-[-90px]"
                style={{
                  transform: `rotate(${rotationDegree}deg)`,
                  transformOrigin: 'center center'
                }}
              >
                <div className="flex items-center justify-center bg-blue-500">
                  <Image
                    src={CUReviews}
                    className="absolute"
                    style={{ transform: 'translate(0rem, -25rem)' }}
                    alt="CUReviews"
                  />
                  <Image
                    src={Carriage}
                    className="absolute"
                    style={{ transform: 'translate(21rem, -14rem)' }}
                    alt="Carriage"
                  />
                  <Image
                    src={DAC}
                    className="absolute"
                    style={{ transform: 'translate(25rem, 6rem)' }}
                    alt="DAC"
                  />
                  <Image
                    src={Zing}
                    className="absolute"
                    style={{ transform: 'translate(11rem, 23rem)' }}
                    alt="Zing"
                  />
                  <Image
                    src={CoursePlan}
                    className="absolute"
                    style={{ transform: 'translate(-11rem, 23rem)' }}
                    alt="CoursePlan"
                  />
                  <Image
                    src={QMI}
                    className="absolute"
                    style={{ transform: 'translate(-25rem, 6rem)' }}
                    alt="QMI"
                  />
                  <Image
                    src={CUApts}
                    className="absolute"
                    style={{ transform: 'translate(-21rem, -14rem)' }}
                    alt="CUApts"
                  />
                </div>
              </div>
            </div> */}
        {/* Fourth Row */}
      </div>
      {/* End of the Icons and Text */}
    </>
  );
};

export default Line;
