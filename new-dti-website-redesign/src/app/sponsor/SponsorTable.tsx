'use client';

import { useState } from 'react';
import Image from 'next/image';
import benefitData from './benefits.json';
import useScreenSize from '../../hooks/useScreenSize';
import { TABLET_BREAKPOINT } from '../../consts';
import FeatureCard from '../../components/FeatureCard';
import SectionSep from '../../components/SectionSep';

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
    <SectionSep grid className="border-x-1 border-border-1" />
    <div className="flex items-center w-full">
      <div className="w-[592px] h-[131px] flex items-center 2 bg-background-1 border-l-1 border-border-1">
        <h2 className="h3 p-[32px]">Sponsorship benefits</h2>
      </div>
      <div className="flex">
        {Object.keys(medals).map((medal) => (
          <div className="w-[148px] h-[131px] flex flex-col gap-[8px] justify-center items-center border-l-1 border-border-1 bg-background-1">
            <Image
              src={medals[medal as Tier].link}
              alt={medal}
              key={medal}
              width = {medalSelectedHeight}
              height = {medalHeight}
            />
            <div className="">
              <p style={{ color: medals[medal as Tier].color }}>{medals[medal as Tier].title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    {benefits.map((benefit) => (
      <div key={benefit.key} className="flex">
        <div className="w-[592px] h-[131px] flex items-center 2 bg-background-1 border-t-1 border-border-1">
          <FeatureCard
            title={benefit.title}
            body={benefit.description}
          />
        </div>
        <div className="flex">
          {tiers.map((tier) => (
            <div
              className="w-[148px] h-[131px] flex justify-center items-center border-t-1 border-l-1 border-border-1 bg-background-1"
              key={`${benefit.key}-${tier}`}
            >
              {tiers.indexOf(tier) >= tiers.indexOf(benefit.lowestTier) ? (
                <div className="w-[32px] h-[32px] bg-white rounded-full bg-white flex items-center justify-center">
                  <Image src="/sponsor/check.svg" alt="checkmark" width={16} height={16} />
                </div>
              ) : (
                <div className="w-[32px] h-[32px] flex rounded-[123px] items-center justify-center">
                  <span className="w-[24px] h-[1px] rounded-[123px] border-1 border-border-1"></span>
                </div>
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
    <section>
      <div className="w-full flex flex-col justify-center">
      {width >= TABLET_BREAKPOINT ? <SponsorshipTableLaptop /> : <SponsorshipTableMobile />}
      </div>
    </section>
  );
};

export default SponsorshipTable;
