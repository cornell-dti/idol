import { useState } from 'react';
import { benefits } from './data/benefits.json';
import { medals } from './data/medals.json';

type Tier = 'bronze' | 'silver' | 'gold' | 'platinum';
const tiers = Object.keys(medals);

const SponsorshipTableMobile = () => {
  const [medal, setMedal] = useState<Tier>('bronze');
  return <div></div>;
};

const SponsorshipTableLaptop = () => (
  <>
    <div className="flex justify-between pb-3 border-b-2 border-black">
      <h3 className="font-semibold flex items-center text-[32px]">Sponsorship benefits</h3>
      <div className="flex justify-evenly">
        {Object.keys(medals).map((medal) => (
          <div className="w-[130px] flex justify-center">
            <img src={medals[medal as Tier].standard} alt={medal} className="" key={medal} />
          </div>
        ))}
      </div>
    </div>
    {benefits.map((benefit) => (
      <div key={benefit.key} className="flex justify-between py-5 border-b-[1px] border-[#D3C4C4]">
        <div className="flex flex-col gap-1">
          <h4 className="text-[22px]">{benefit.title}</h4>
          <p className="text-[#877B7B] text-lg">{benefit.description}</p>
        </div>
        <div className="flex">
          {tiers.map((n) => (
            <div className="w-[130px] flex justify-center" key={`${benefit.key}-${n}`}>
              {tiers.indexOf(n) >= tiers.indexOf(benefit.lowestTier) && (
                <img src="/icons/check.svg" alt="check" className="w-[30px]" />
              )}
            </div>
          ))}
        </div>
      </div>
    ))}
    <div className="h-[200px]"></div>
  </>
);

const SponsorshipTable = () => (
  <div className="max-w-5xl w-full flex flex-col justify-center my-24">
    <SponsorshipTableLaptop />
  </div>
);

export default SponsorshipTable;
