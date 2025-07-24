'use client';

import { useState } from 'react';
import Image from 'next/image';
import benefitData from './benefits.json';
import useScreenSize from '../../hooks/useScreenSize';
import { TABLET_BREAKPOINT } from '../../consts';
import FeatureCard from '../../components/FeatureCard';
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
const medalWidth = 45;
const mostPopular = 'gold';

const tiers = Object.keys(medals);

const SponsorshipTableMobile = () => {
  const [selectedMedal, setSelectedMedal] = useState<Tier>('bronze');

  return (
    <>
      <h2 className="h3 py-8 px-4">Sponsorship benefits</h2>
      <div className="bg-background-1">
        <table className="w-full border-t border-border-1">
          <thead>
            <tr>
              {Object.keys(medals).map((medal, index) => (
                <th
                  key={medal}
                  className={`w-1/4 py-4 border-border-1 text-center ${
                    index !== 0 ? 'border-l' : ''
                  }`}
                >
                  <button
                    onClick={() => setSelectedMedal(medal as Tier)}
                    aria-label={`Show ${medal} tier`}
                  >
                    <div className="flex flex-col gap-[8px] items-center">
                      <Image
                        src={medals[medal as Tier].link}
                        alt={medal}
                        width={medalWidth}
                        height={medalHeight}
                      />
                      <p style={{ color: medals[medal as Tier].color }}>
                        {medals[medal as Tier].title}
                      </p>
                    </div>
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {benefits.map((benefit) => {
              const highlighted =
                tiers.indexOf(selectedMedal) >= tiers.indexOf(benefit.lowestTier);

              return (
                <tr key={benefit.key} className="border-t border-border-1">
                  <td colSpan={3} className="py-4 pl-4">
                    <h6>{benefit.title}</h6>
                    <p className="text-[#A1A1A1]">{benefit.description}</p>
                  </td>
                  <td className="pl-[32px] pr-4">
                    <div className="flex items-center justify-center">
                      {highlighted ? (
                        <IconWrapper
                          size="small"
                          type="primary"
                          className="p-0"
                        >
                          <Image
                            src="/sponsor/check.svg"
                            alt="check"
                            width={22}
                            height={52}
                          />
                        </IconWrapper>
                      ) : (
                        <span className="w-[24px] rounded-full border border-border-1" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

const SponsorshipTableLaptop = () => (
  <>
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
                  <Image
                    src={medals[medal as Tier].link}
                    alt={medal}
                    width={medalWidth}
                    height={medalHeight}
                  />
                <p style={{ color: medals[medal as Tier].color }}>{medals[medal as Tier].title}</p>
              </div>
              {medals[medal as Tier].name === mostPopular && (
                <div className="absolute shadow-[0px_8px_16px_0px_rgba(255,255,255,0.32)] bg-[#181818] text-black -top-[39px] w-full bg-white rounded-tl-[8px] rounded-tr-[8px] py-[6px]">
                  <p className="block min-[1000px]:hidden">Popular</p>
                  <p className="hidden min-[1000px]:block">Most Popular</p>
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
                      alt="check"
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
      {width >= TABLET_BREAKPOINT ? <SponsorshipTableLaptop /> : <SponsorshipTableMobile />}
    </section>
  );
};

export default SponsorshipTable;
