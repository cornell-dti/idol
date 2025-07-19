'use client';

import { useState } from 'react';
import Image from 'next/image';
import benefitData from './benefits.json';
import useScreenSize from '../../hooks/useScreenSize';
import { TABLET_BREAKPOINT } from '../../consts';
import FeatureCard from '../../components/FeatureCard';
import SectionSep from '../../components/SectionSep';
import IconWrapper from '../../components/IconWrapper';

type Tier = 'bronze' | 'silver' | 'gold' | 'platinum';

const medals = {
  bronze: {
    name: "bronze",
    link: "/sponsor/medals/bronze.svg",
    title: "Bronze",
    color: "#AC773A",
  },
  silver: {
    name: "silver",
    link: "/sponsor/medals/silver.svg",
    title: "Silver",
    color: "#B2B2B2",
  },
  gold: {
    name: "gold",
    link: "/sponsor/medals/gold.svg",
    title: "Gold",
    color: "#DBA10B",
  },
  platinum: {
    name: "platinum",
    link: "/sponsor/medals/platinum.svg",
    title: "Platinum",
    color: "#7D7D7D",
  }
}
const { benefits } = benefitData;

const medalHeight = 57;
const medalSelectedHeight = 45;
const mostPopular = 'gold';

const tiers = Object.keys(medals);

const SponsorshipTableMobile = () => {
  const [selectedMedal, setSelectedMedal] = useState<Tier>('bronze');

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
                  src={medals[medal as Tier].link}
                  alt=""
                  height={medalHeight}
                  width={medalSelectedHeight}
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
    <SectionSep grid className="border-border-1" />

    <table className="table-auto w-full border-collapse border-border-1 bg-background-1">
      <thead>
        <tr>
          <th className="w-[592px] p-[32px] text-left border-border-1">
            <h2 className="h3">Sponsorship benefits</h2>
          </th>
          {Object.keys(medals).map((medal) => (
            <th 
              key={medal}
              className={`relative w-[148px] items-center border-l border-border-1 ${
                medals[medal as Tier].name === 'gold' ? 'bg-[#181818]' : ''
              }`}
            >
              <div className="flex flex-col gap-[8px] items-center">
                <div className="w-[45px] h-[57px]">
                  <Image
                    src={medals[medal as Tier].link}
                    alt={medal}
                    width={medalSelectedHeight}
                    height={medalHeight}
                />
                </div>
                <p style={{ color: medals[medal as Tier].color }}>{medals[medal as Tier].title}</p>
              </div>
              {medals[medal as Tier].name === mostPopular && (
                <div className="absolute shadow-[0px_8px_16px_0px_rgba(255,255,255,0.32)] bg-[#181818] -top-[39px] w-full bg-white rounded-tl-[8px] rounded-tr-[8px] py-[6px]">
                  <p className="text-black">Most Popular</p>
                </div>
              )}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {benefits.map((benefit) => (
          <tr key={benefit.key}>
            <td className="w-[592px] border-t border-border-1 align-top">
              <FeatureCard title={benefit.title} body={benefit.description} />
            </td>
            {tiers.map((tier) => (
              <td
                key={`${benefit.key}-${tier}`}
                className={`border-t border-l border-border-1 ${
                tier === 'gold' ? 'bg-[#181818]' : ''
              }`}
              >
                {tiers.indexOf(tier) >= tiers.indexOf(benefit.lowestTier) ? (
                  <IconWrapper size="small" type="primary" className="flex items-center justify-center mx-auto">
                    <Image
                      src="/sponsor/check.svg"
                      alt="checkmark"
                      width={16}
                      height={16}
                    />
                  </IconWrapper>
                ) : (
                  <div className="flex items-center justify-center mx-auto">
                    <span className="w-[24px] h-[1px] rounded-full border border-border-1"></span>
                  </div>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

const SponsorshipTable = () => {
  const { width } = useScreenSize();
  return (
    <section>
      <div className="w-full flex flex-col justify-center">
      {width >= TABLET_BREAKPOINT ? <SponsorshipTableLaptop /> : <SponsorshipTableMobile />}
      </div>
    </section>
  );
};

export default SponsorshipTable;
