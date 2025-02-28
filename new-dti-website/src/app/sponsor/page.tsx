'use client';

import Image from 'next/image';

import impactData from '../../../components/sponsor/data/impacts.json';
import companyData from '../../../components/sponsor/data/sponsors.json';
import SponsorshipTable from '../../../components/sponsor/SponsorshipTable';
import SectionWrapper from '../../../components/hoc/SectionWrapper';
import config from '../../../config.json';
import useTitle from '../../hooks/useTitle';

const { impacts } = impactData;
const { companies } = companyData;

const SponsorHero = () => (
  <div
    className="bg-black text-white md:my-[100px] xs:my-9 min-h-[calc(100vh-300px)] 
    flex items-center w-full overflow-hidden"
  >
    <SectionWrapper id={'Sponsors Page Hero Section'}>
      <div className="flex lg:flex-row xs:flex-col gap-y-9 gap-x-24 relative z-10">
        <div className="flex items-center">
          <h1
            className="font-semibold md:text-header xs:text-[52px] md:leading-header
          xs:leading-header-xs whitespace-pre"
          >
            SUPPORT <br />
            <span className="text-[#FF4C4C]">OUR TEAM</span>
          </h1>
        </div>
        <div className="flex flex-col justify-center gap-6">
          <h2 className="font-bold md:text-subheader xs:text-2xl text-hero-primary md:leading-subheader">
            Let's collaborate
          </h2>
          <p className="md:text-lg xs:text-sm text-hero-secondary md:leading-body-text">
            The generous contributions of our supporters and sponsors allow our team to continue
            building products and hosting initiatives to help the Cornell and Ithaca communities.
          </p>
          <a href={config.donationLink} className="primary-button">
            Donate now
          </a>
        </div>
      </div>
    </SectionWrapper>
  </div>
);

const SponsorImpact = () => (
  <div
    className="flex lg:gap-x-12 xs:gap-y-10 xs:gap-x-3 lg:py-24 xs:py-14 xs:flex-col 
    md:flex-row"
  >
    {impacts.map((impact) => (
      <div className="flex flex-col gap-3 md:w-1/3">
        <div className="flex items-center gap-1">
          <Image
            src={impact.image}
            alt={impact.key}
            height={impact.height}
            width={impact.width}
            className="h-24 h-auto md:w-[30%]"
          />
          <h3 className="font-semibold lg:text-xl xs:text-lg text-center">{impact.title}</h3>
        </div>
        <p className="lg:text-lg xs:text-sm">{impact.description}</p>
      </div>
    ))}
  </div>
);

const SponsorPage = () => {
  useTitle('Sponsor');
  return (
    <>
      <SponsorHero />
      <div className="bg-[#EDEDED] flex justify-center">
        <SectionWrapper
          id={'Become a sponsor section 1'}
          className="flex flex-col h-fit justify-center items-start md:flex-row lg:gap-x-12"
        >
          <div className="flex flex-row justify-start align-middle py-10 md:order-last gap-x-10 md:gap-x-5 z-10 pb-4">
            <Image
              className="self-center rounded-[16px]"
              src="/images/dti_2024.png"
              alt="2024 DTI Team"
              width={576}
              height={576}
            />
          </div>
          <div className="text-left w-full md:self-center max-w-[520px] relative z-10">
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <h2 className="text-[32px] font-semibold lg:leading-10">Become a sponsor</h2>
                <p className="text-[#060B12] text-[18px]">
                  We would love to partner with organizations that share our vision of changing the
                  world. Together, we can harness the power of technology to drive change in our
                  communities.
                </p>
              </div>

              <a href="mailto:hello@cornelldti.org" className="primary-button">
                Contact us
              </a>
            </div>
          </div>
        </SectionWrapper>
      </div>
      <div className="bg-[#F6F6F6] flex flex-col">
        <SectionWrapper id={'Sponsors impact and table'} className="items-center">
          <SponsorImpact />
          <SponsorshipTable />
        </SectionWrapper>
      </div>
      <div className="bg-[#EDEDED] flex flex-col lg:py-[60px] xs:py-[20px]">
        <SectionWrapper id={'Sponsors list section'} className="text-center space-y-7">
          <h3 className="font-semibold md:text-[32px] xs:text-2xl">Thank you to our sponsors!</h3>
          <div className="grid gap-6 md:grid-cols-6 xs:grid-cols-3 items-center">
            {companies.map((company) => (
              <Image
                src={company.icon}
                alt={company.key}
                key={company.key}
                width={company.width}
                height={company.height}
              />
            ))}
          </div>
        </SectionWrapper>
      </div>
      <div className="bg-[#F6F6F6] flex flex-col items-center gap-5 py-[60px] px-10">
        <p className="lg:text-[22px] xs:text-lg text-center">
          Want to learn more about how you can help us make an impact?
        </p>
        <a className="primary-button" href="mailto:hello@cornelldti.org">
          Contact us
        </a>
      </div>
    </>
  );
};

export default SponsorPage;
