import Image from 'next/image';
import companies from './data/companies.json';
import useScreenSize from '../../src/hooks/useScreenSize';
import { TABLET_BREAKPOINT } from '../../src/consts';
import { MemberCard } from './MemberGroup';
import alumniMembers from '../../../backend/src/members-archive/fa21.json';
import config from '../../config.json';

const AlumniDisplay = () => (
  <div className="flex justify-center bg-[#F6F6F6] pb-36">
    <div className="xs:mx-5 md:mx-10 lg:mx-20 xl:mx-60 max-w-5xl">
      <h2 className="font-semibold md:text-[32px] xs:text-2xl">Alumni & Inactive Members</h2>
      <div
        className="grid lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 md:gap-10 
          xs:gap-x-1.5 xs:gap-y-5 md:mt-10 xs:mt-5"
      >
        {alumniMembers.members.map((member, index) =>
          index <= 5 ? (
            <a href={member.linkedin ?? undefined}>
              <MemberCard
                {...member}
                roleDescription={member.roleDescription as RoleDescription}
                cardState={undefined}
                image={`team/${member.netid}.jpg`}
              />
            </a>
          ) : (
            <></>
          )
        )}
      </div>
    </div>
  </div>
);

const BeyondDTI = () => {
  const { width } = useScreenSize();
  const insertIndex = width < TABLET_BREAKPOINT ? 8 : 7;
  return (
    <div className="flex justify-center items-center bg-[#E4E4E4] py-20 ">
      <div className="grid md:grid-cols-6 xs:grid-cols-4 w-full place-items-center md:gap-5 max-w-5xl">
        {companies.icons.map((icon, index) => (
          <>
            <img src={icon.src} alt={icon.alt} key={icon.alt} className="scale-50" />
            {index === insertIndex && (
              <div className="flex flex-col items-center gap-6 col-span-2 row-span-2">
                <h1 className="font-semibold md:text-[32px] xs:text-[20px]">Beyond DTI</h1>
                <p className="md:text-[22px] xs:text-sm !leading-7">
                  Our members and alumni are <span className="font-bold">all over the world</span>,
                  but here are just a few places you'll find the DTI family continue their success
                  into industry.
                </p>
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

const TeamAlumni = () => {
  const isApplicationOpen = Date.parse(config.applicationDeadline) >= Date.now();
  return (
    <div className="flex flex-col">
      <AlumniDisplay />
      <BeyondDTI />
      <div className="flex justify-center bg-[#EDEDED] lg:py-32 md:py-16 xs:py-10">
        <div className="flex md:flex-row xs:flex-col lg:gap-[60px] md:gap-10 xs:gap-8 md:items-center">
          <Image
            src="/images/full-team.png"
            alt="team picture"
            width={412}
            height={312}
            className="lg:w-[412px] xs:w-[360px] rounded-xl"
          />
          <div className="flex flex-col gap-[20px] items-start">
            <h1 className="font-semibold lg:text-[32px] md:text-2xl">Want to join the family?</h1>
            <p className="lg:text-[22px] md:text-lg">
              Applications for {config.semester} are{' '}
              {isApplicationOpen ? 'now open!' : 'now closed.'}
            </p>
            {isApplicationOpen && (
              <button className="rounded-xl py-3 px-[14px] bg-[#A52424] text-white font-bold hover:bg-white hover:text-[#A52424]">
                <a href={'/apply'} target="_blank" rel="noopener noreferrer">
                  Apply here
                </a>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAlumni;
