'use client';
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import useScreenSize from '../../src/hooks/useScreenSize';
import { TABLET_BREAKPOINT, MOBILE_BREAKPOINT } from '../../src/consts';
import Node from './Node';
import Wheel from './Wheel';
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
          creatingTechnology: progressPercentage >= 36,
          community: progressPercentage >= 44
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
        <div className="relative w-full h-auto z-10" ref={componentRef}>
          {width > MOBILE_BREAKPOINT ? (
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
        {/* Design */}
        <div className="border border-white sm:border-purple-500 md:border-pink-500 lg:border-red-500 xl:border-blue-500 2xl:border-green-500 flex absolute top-[3%] left-[5%] sm:top-[3%] sm:left-[9%] md:top-[4%] md:left-[11%] lg:top-[5%] lg:left-[13%] xl:top-[5%] xl:left-[13%]">
          <Node
            mainIcon={nodes.design[0].mainIcon}
            title={nodes.design[0].title}
            description={nodes.design[0].description}
            images={nodes.design[0].images}
            dragLimit={750}
            activeIcon={activeIcon.design}
            position={true}
          />
        </div>
        {/* Innovation */}
        <div className="border border-white sm:border-purple-500 md:border-pink-500 lg:border-red-500 xl:border-blue-500 2xl:border-green-500 flex absolute top-[45%] left-[-2%] sm:top-[26%] sm:left-[12%] md:top-[28.25%] md:left-[13%] lg:top-[29%] lg:left-[13%] xl:top-[27%] xl:left-[14%] ">
          <Node
            mainIcon={nodes.innovation[0].mainIcon}
            title={nodes.innovation[0].title}
            description={nodes.innovation[0].description}
            images={nodes.innovation[0].images}
            dragLimit={750}
            activeIcon={activeIcon.innovation}
            position={false}
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

        {/* Text Portion*/}
        <div className="flex absolute top-[71%] sm:top-[53%] md:top-[53.5%] w-full h-auto text-white border border-purple-500 z-0">
          <div className="relative w-full h-auto grid grid-cols-2 gap-y-8 sm:gap-y-6 md:gap-y-8 lg:gap-y-10 xl:gap-y-12 2xl:gap-y-16 text-md lg:text-2xl xl:text-3xl 2xl:text-4xl font-normal tracking-widest">
            <div
              className={`col-span-1 text-right ease-in-out duration-500 mr-14 sm:mr-0 md:mr-8 lg:mr-[8%] ${
                activeIcon.creatingTechnology ? 'opacity-100 scale-100 ' : 'opacity-50 scale-95'
              }`}
            >
              Creating technology
            </div>
            <div className="col-span-1"></div>
            <div
              className={`col-span-1 col-start-2 text-left ease-in-out duration-500 sm:ml-0 md:ml-8 lg:ml-[6%] ${
                activeIcon.community ? 'opacity-100 scale-100' : 'opacity-50 scale-95 '
              }`}
            >
              for community impact
            </div>
            <div
              className={`absolute top-[50%] left-[46%] rotate-[30deg] bg-gray-300 opacity-50 h-[3%] w-[7%]`}
            ></div>
          </div>
        </div>

        {/* Wheel */}
        {/* <div className="flex absolute w-full h-auto bottom-[15%] border border-green-500">
          <Wheel rotationDegree={rotationDegree} products={nodes.wheel} />
        </div> */}
      </div>
      {/* End of the Icons and Text */}
    </>
  );
};

export default Line;
