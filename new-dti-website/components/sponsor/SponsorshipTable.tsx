import { useState } from 'react';
import Image from 'next/image';
import benefitData from './data/benefits.json';
import medalData from './data/medals.json';
import useScreenSize from '../../src/hooks/useScreenSize';
import { TABLET_BREAKPOINT } from '../../src/consts';

type Tier = 'bronze' | 'silver' | 'gold' | 'platinum';

const { medals } = medalData;
const { benefits } = benefitData;

const tiers = Object.keys(medals);

const SponsorshipTableMobile = () => {
  const [selectedMedal, setSelectedMedal] = useState<Tier>('bronze');

  const medalHeight = 87;
  const medalSelectedHeight = 107;

  return (
    <>
      <div className="flex flex-col gap-7 pb-6 border-b-2 border-black">
        <h3 className="font-semibold text-2xl">Sponsorship benefits</h3>
        <div className="flex h-fit justify-between">
          {Object.keys(medals).map((medal) => (
            <div className="flex justify-center items-center" key={medal}>
              <button
                onClick={() => setSelectedMedal(medal as Tier)}
                aria-label={`Show ${medal} tier`}
              >
                <Image
                  src={medals[medal as Tier][selectedMedal === medal ? 'sticker' : 'shadow']}
                  alt=""
                  height={selectedMedal === medal ? medalSelectedHeight : medalHeight}
                  width={medals[medal as Tier][selectedMedal === medal ? 'widthSelected' : 'width']}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        {benefits.map((benefit) => {
          const highlighted = tiers.indexOf(selectedMedal) >= tiers.indexOf(benefit.lowestTier);
          return (
            <div className="flex py-3 gap-x-4 border-b-[1px] border-[#D3C4C4]" key={benefit.key}>
              <Image
                src={`/icons/${highlighted ? 'green_check' : 'red_x'}.svg`}
                alt={highlighted ? 'check' : 'x'}
                width={22}
                height={52}
              />
              <div className={`flex flex-col gap-1 ${highlighted ? 'opacity-100' : 'opacity-50'}`}>
                <h4 className="text-lg text-[#0C0404]">{benefit.title}</h4>
                <p className="text-sm text-[#877B7B] ">{benefit.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const SponsorshipTableLaptop = () => (
  <>
    <div className="flex justify-between pb-3 border-b-2 border-black">
      <h3 className="font-semibold flex items-center lg:text-[32px] md:text-2xl">
        Sponsorship benefits
      </h3>
      <div className="flex justify-evenly">
        {Object.keys(medals).map((medal) => (
          <div className="lg:w-[130px] md:w-28 flex justify-center" key={medal}>
            <Image
              src={medals[medal as Tier].standard}
              alt={medal}
              key={medal}
              height={87}
              width={medals[medal as Tier].width}
            />
          </div>
        ))}
      </div>
    </div>
    {benefits.map((benefit) => (
      <div key={benefit.key} className="flex justify-between py-5 border-b-[1px] border-[#D3C4C4]">
        <div className="flex flex-col gap-1">
          <h4 className="text-[#0C0404] lg:text-[22px] md:text-lg">{benefit.title}</h4>
          <p className="text-[#877B7B] lg:text-lg md:text-sm">{benefit.description}</p>
        </div>
        <div className="flex">
          {tiers.map((tier) => (
            <div
              className="lg:w-[130px] md:w-28 flex justify-center"
              key={`${benefit.key}-${tier}`}
            >
              {tiers.indexOf(tier) >= tiers.indexOf(benefit.lowestTier) && (
                <Image src="/icons/check.svg" alt="checkmark" width={30} height={60} />
              )}
            </div>
          ))}
        </div>
      </div>
    ))}
  </>
);

const SponsorshipTable = () => {
  const { width } = useScreenSize();
  return (
    <div className="w-full flex flex-col justify-center lg:my-24 md:my-14 xs:my-10">
      {width >= TABLET_BREAKPOINT ? <SponsorshipTableLaptop /> : <SponsorshipTableMobile />}
    </div>
  );
};

export default SponsorshipTable;
