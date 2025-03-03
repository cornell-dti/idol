'use client';

import InitiativeDisplay from '../../../components/initiatives/InitiativeDisplay';
import SectionWrapper from '../../../components/hoc/SectionWrapper';
import useTitle from '../../hooks/useTitle';
import Hero from '../../../components/hero';

const InitiativePage = () => {
  useTitle('Initiatives');
  return (
    <div className="bg-white flex flex-col">
      <div className="lg:pb-24 pb-12 bg-[#000000]">
        <Hero
          title={'Inspiring innovation'}
          description={
            'What sets us apart from other project teams is our desire to share our discoveries with other students and members of the greater Ithaca community.'
          }
          image={{
            src: '/images/initiatives-hero.png',
            alt: 'DTI member engaging in a workshop with a child'
          }}
        />
      </div>
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
