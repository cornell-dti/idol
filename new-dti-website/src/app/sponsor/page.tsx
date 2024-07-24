'use client'

import { impacts } from '../../../components/sponsor/data/impacts.json';
import { companies } from '../../../components/sponsor/data/sponsors.json';
import SponsorshipTable from '../../../components/sponsor/SponsorshipTable';

const SponsorHero = () => (
  <div className="bg-black text-white md:my-[100px] xs:my-9 min-h-[calc(100vh-336px)]">
    <div
      className="flex lg:flex-row xs:flex-col w-10/12 gap-y-9 relative z-10
      lg:ml-[152px] md:ml-10 xs:ml-9"
    >
      <div className="mr-20">
        <h1
          className="font-semibold md:text-[100px] xs:text-[52px] md:leading-[120px] 
          xs:leading-[63px] w-[550px]"
        >
          SUPPORT <span className="text-[#FF4C4C]">OUR TEAM</span>
        </h1>
      </div>
      <div className="flex flex-col justify-center gap-6">
        <h2 className="font-bold md:text-[40px] xs:text-2xl">
          <span className="text-[#877B7B]">Let's</span> <span className="italic">collaborate</span>
        </h2>
        <p className="md:text-lg xs:text-sm">
          The generous contributions of our supporters and sponsors allow our team to continue
          building products and hosting initiatives to{' '}
          <span className="font-bold">help the Cornell and Ithaca communities.</span>
        </p>
        <button
          className="rounded-xl py-3 px-[14px] bg-[#A52424] text-white 
          font-bold hover:bg-white hover:text-[#A52424] w-fit"
        >
          Donate now
        </button>
      </div>
    </div>
  </div>
);

type SponsorCardProps = {
  image: string;
  title: string;
  description: string;
  key: string;
};

const SponsorCard: React.FC<SponsorCardProps> = ({ image, title, description, key }) => (
  <div key={key} className="flex flex-col gap-3 w-[308px]">
    <img src={image} alt={key} className="h-[112px]" />
    <div
      className="bg-white p-6 flex flex-col gap-3 rounded-2xl"
      style={{ boxShadow: '4px 4px 8px 2px #00000014' }}
    >
      <h3 className="font-semibold text-xl text-center">{title}</h3>
      <p className="text-lg">{description}</p>
    </div>
  </div>
);

const SponsorImpact = () => (
  <div className="max-w-5xl flex gap-12 py-24">
    {impacts.map((impact) => (
      <SponsorCard
        image={impact.image}
        title={impact.title}
        description={impact.description}
        key={impact.key}
      />
    ))}
  </div>
);

const SponsorPage = () => (
  <>
    <SponsorHero />
    <div className="bg-[#EDEDED] flex justify-center">
      <div className="max-w-5xl flex justify-center py-14 gap-20">
        <img src="/images/dti_2024.png" alt="DTI 2024" className="rounded-3xl w-[475px] h-auto" />
        <div className="flex flex-col justify-center gap-5">
          <h3 className="font-semibold text-2xl">Become a sponsor!</h3>
          <p className="text-lg">
            We would love to partner with organizations that share our vision of changing the world.
            Together, we can{' '}
            <span className="font-bold">
              harness the power of technology to drive change in our communities.
            </span>
          </p>
          <button
            className="rounded-xl py-3 px-[14px] bg-[#A52424] text-white 
            font-bold hover:bg-white hover:text-[#A52424] w-fit"
          >
            Contact us
          </button>
        </div>
      </div>
    </div>
    <div className="bg-[#F6F6F6] flex flex-col items-center">
      <SponsorImpact />
      <SponsorshipTable />
    </div>
    <div className="bg-[#EDEDED] flex flex-col items-center gap-7 py-[100px]">
      <h3 className="font-semibold text-[32px]">Thank you to our sponsors!</h3>
      <div className="flex gap-6">
        {companies.map((company) => (
          <img src={company.icon} alt={company.key} key={company.key} width={company.width} />
        ))}
      </div>
    </div>
    <div className="bg-[#F6F6F6] flex flex-col items-center gap-5 py-[60px]">
      <p className="text-[22px]">Want to learn more about how you can help us make an impact?</p>
      <button
        className="rounded-xl py-3 px-[14px] bg-[#A52424] text-white 
          font-bold hover:bg-white hover:text-[#A52424] w-fit"
      >
        Contact us
      </button>
    </div>
  </>
);

export default SponsorPage;
