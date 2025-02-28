'use client';

import InitiativeDisplay from '../../../components/initiatives/InitiativeDisplay';
import SectionWrapper from '../../../components/hoc/SectionWrapper';
import useTitle from '../../hooks/useTitle';

const InitiativeHero = () => (
  <section
    id="initiative-hero"
    className="bg-black text-[#FEFEFE] min-h-[calc(100vh-100px)] h-full flex items-center
    relative overflow-hidden"
  >
    <SectionWrapper id={'Initiatives Pages Hero Section'}>
      <div className="flex lg:flex-row xs:flex-col gap-x-[60px] relative z-10 md:items-center">
        <h1
          className="flex items-center md:text-header md:leading-header xs:leading-header-xs 
        xs:text-[48px] font-semibold"
        >
          <div>
            INSPIRING <span className="text-[#FF4C4C]">INNOVATION</span>
          </div>
        </h1>
        <div className="flex flex-col gap-6">
          <h2
            className="font-bold md:text-subheader xs:text-[24px] md:leading-subheader
          xs:leading-[29px] text-hero-primary"
          >
            Making impact
          </h2>
          <p className="md:text-lg xs:text-sm text-hero-secondary md:leading-body-text">
            What sets us apart from other project teams is our desire to share our discoveries with
            other students and members of the greater Ithaca community.
          </p>
        </div>
      </div>
    </SectionWrapper>
  </section>
);

const InitiativePage = () => {
  useTitle('Initiatives');
  return (
    <div className="bg-white flex flex-col">
      <InitiativeHero />
      <SectionWrapper id={'Initiatives Display'}>
        <InitiativeDisplay />
      </SectionWrapper>
      <div className="bg-[#F6F6F6] ">
        <SectionWrapper id={'initiative-footer'} className="flex justify-center lg:py-32 xs:py-16">
          <div className="w-full flex flex-col lg:gap-6 xs:gap-3">
            <h3 className="font-semibold md:text-[32px] xs:text-[22px] leading-10">
              Want us to be a part of your next event?
            </h3>
            <p className="md:text-[22px] md:leading-[26px] xs:text-[12px] xs:leading-[14px]">
              Feel free to coordinate with us over email, coffee, lunch-we're excited to work with
              you.
            </p>
            <a href="mailto:hello@cornelldti.org" className="primary-button">
              Get in touch
            </a>
          </div>
        </SectionWrapper>
      </div>
    </div>
  );
};

export default InitiativePage;
