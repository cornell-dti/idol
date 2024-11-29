'use client';

import Image from 'next/image';
import Link from 'next/link';
import impactData from '../../../components/sponsor/data/impacts.json';
import companyData from '../../../components/sponsor/data/sponsors.json';
import SponsorshipTable from '../../../components/sponsor/SponsorshipTable';
import useScreenSize from '../../hooks/useScreenSize';
import { LAPTOP_BREAKPOINT, TABLET_BREAKPOINT } from '../../consts';
import RedBlob from '../../../components/blob';
import config from '../../../config.json';

const { impacts } = impactData;
const { companies } = companyData;

const SponsorHero = () => {
  const { width } = useScreenSize();
  return (
    <div
      className="bg-black text-white md:my-[100px] xs:my-9 min-h-[calc(100vh-336px)]
    flex items-center w-full overflow-hidden"
    >
      <RedBlob className={'left-[-250px] top-[-175px]'} intensity={0.4} />
      <div
        className="flex lg:flex-row xs:flex-col w-10/12 gap-y-9 gap-x-24 relative z-10
      lg:mx-32 md:mx-10 xs:mx-9"
      >
        <div className="flex items-center">
          <h1
            className="font-semibold md:text-[100px] xs:text-[52px] md:leading-[120px] 
          xs:leading-[63px] whitespace-pre"
          >
            SUPPORT <br />
            <span className="text-[#FF4C4C]">OUR TEAM</span>
          </h1>
        </div>
        <div className="flex flex-col justify-center gap-6">
          <h2 className="font-bold md:text-[40px] xs:text-2xl text-hero-primary">
            Let's collaborate
          </h2>
          <p className="md:text-lg xs:text-sm text-hero-secondary">
            The generous contributions of our supporters and sponsors allow our team to continue
            building products and hosting initiatives to{' '}
            <span className="font-bold">help the Cornell and Ithaca communities.</span>
          </p>
          <Link href={config.donationLink} className="primary-button">
            Donate now
          </Link>
        </div>
      </div>
      {width >= TABLET_BREAKPOINT && (
        <div className="relative top-[-250px]">
          <RedBlob className={'right-[-300px]'} intensity={0.3} />
        </div>
      )}
    </div>
  );
};

type SponsorCardProps = {
  image: string;
  title: string;
  description: string;
  alt: string;
  width: number;
  height: number;
};

const SponsorCard: React.FC<SponsorCardProps> = ({
  image,
  title,
  description,
  alt,
  width,
  height
}) => (
  <div className="flex flex-col gap-3 lg:w-[308px] md:w-60 max-w-lg items-center">
    <Image src={image} alt={alt} height={height} width={width} />
    <div
      className="bg-white p-6 flex flex-col gap-3 rounded-2xl"
      style={{ boxShadow: '4px 4px 8px 2px #00000014' }}
    >
      <h3 className="font-semibold lg:text-xl xs:text-lg text-center">{title}</h3>
      <p className="lg:text-lg xs:text-sm">{description}</p>
    </div>
  </div>
);

const SponsorImpact = () => (
  <div
    className="max-w-5xl flex lg:gap-x-12 xs:gap-y-10 xs:gap-x-3 lg:py-24 xs:py-14 xs:flex-col 
    md:flex-row p-5 items-center"
  >
    {impacts.map((impact) => (
      <SponsorCard
        image={impact.image}
        title={impact.title}
        description={impact.description}
        key={impact.key}
        alt={impact.key}
        width={impact.width}
        height={impact.height}
      />
    ))}
  </div>
);

const SponsorPage = () => {
  const { width } = useScreenSize();
  return (
    <>
      <SponsorHero />
      <div className="bg-[#EDEDED] flex justify-center">
        <div className="max-w-5xl flex justify-center p-5 py-14 lg:gap-20 md:gap-10 xs:gap-5 md:flex-row xs:flex-col">
          <Image
            src="/images/dti_2024.png"
            alt="DTI 2024"
            width={width >= LAPTOP_BREAKPOINT ? 475 : 350}
            height={width >= LAPTOP_BREAKPOINT ? 320 : 236}
            className="rounded-3xl mx-auto object-cover"
          />
          <div className="flex flex-col justify-center md:gap-5 xs:gap-3">
            <h3 className="font-semibold text-2xl">Become a sponsor!</h3>
            <p className="text-lg">
              We would love to partner with organizations that share our vision of changing the
              world. Together, we can{' '}
              <span className="font-bold">
                harness the power of technology to drive change in our communities.
              </span>
            </p>
            <Link href="mailto:hello@cornelldti.org" className="primary-button">
              Contact us
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-[#F6F6F6] flex flex-col items-center">
        <SponsorImpact />
        <SponsorshipTable />
      </div>
      <div className="bg-[#EDEDED] flex flex-col items-center gap-7 lg:py-[100px] xs:py-[60px] md:px-20 xs:px-5">
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
      </div>
      <div className="bg-[#F6F6F6] flex flex-col items-center gap-5 py-[60px] px-10">
        <p className="lg:text-[22px] xs:text-lg text-center">
          Want to learn more about how you can help us make an impact?
        </p>
        <Link className="primary-button" href="mailto:hello@cornelldti.org">
          Contact us
        </Link>
      </div>
    </>
  );
};

export default SponsorPage;
