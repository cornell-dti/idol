import Image from 'next/image';

import companies from './data/companies.json';
import useScreenSize from '../../src/hooks/useScreenSize';
import { TABLET_BREAKPOINT } from '../../src/consts';
import config from '../../config.json';
import { isAppOpen, isFall, isGenAppOpen } from '../../src/utils/dateUtils';
import SectionWrapper from '../hoc/SectionWrapper';

const BeyondDTI = () => {
  const { width } = useScreenSize();
  const insertIndex = width < TABLET_BREAKPOINT ? 8 : 7;
  return (
    <div className="flex justify-center items-center bg-[#E4E4E4] py-20 ">
      <SectionWrapper id={'Beyond DTI Section with list of logos'}>
        <div className="grid md:grid-cols-6 xs:grid-cols-4 w-full place-items-center">
          {companies.icons.map((icon, index) => (
            <>
              <img src={icon.src} alt={icon.alt} key={icon.alt} className="scale-50" />
              {index === insertIndex && (
                <div className="flex flex-col items-center gap-6 col-span-2 row-span-2">
                  <h2 className="font-semibold md:text-[32px] xs:text-[20px]">Beyond DTI</h2>
                  <p className="md:text-[22px] xs:text-sm !leading-7 text-center">
                    Our members and alumni are all over the world, but here are just a few places
                    you'll find the DTI family continue their success into industry.
                  </p>
                </div>
              )}
            </>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
};

const TeamFooter = () => {
  let message;
  if (!isAppOpen()) {
    message = `We're no longer accepting applicants for ${config.semester}. Stay tuned for opportunities next semester!`;
  } else if (isFall() && !isGenAppOpen()) {
    message = `Freshmen/Transfer applications for ${config.semester} are open.`;
  } else {
    message = `Applications for ${config.semester} are now open.`;
  }

  return (
    <div className="flex flex-col">
      <BeyondDTI />
      <div className="flex justify-center bg-[#EDEDED] lg:py-32 md:py-16 xs:py-10 xs:px-8">
        <SectionWrapper id={'Team Page Footer Information'}>
          <div className="flex md:flex-row xs:flex-col lg:gap-[60px] md:gap-10 xs:gap-8 items-center">
            <Image
              src="/images/become-sponsor-new.png"
              alt="DTI Spring 2025 newbies"
              width={490}
              height={370}
              className="lg:w-[412px] xs:w-[360px] rounded-xl"
            />
            <div className="flex flex-col gap-[20px] items-start w-2/3">
              <h2 className="font-semibold lg:text-[32px] md:text-2xl">Want to join the family?</h2>
              <p className="lg:text-[22px] md:text-lg">{message}</p>
              {isAppOpen() && (
                <a href={'/apply'} className="primary-button">
                  Apply here
                </a>
              )}
            </div>
          </div>
        </SectionWrapper>
      </div>
    </div>
  );
};

export default TeamFooter;
