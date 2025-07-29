'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import benefitData from './benefits.json';
import useScreenSize from '../../hooks/useScreenSize';
import IconWrapper from '../../components/IconWrapper';
import CheckIcon from '../../components/icons/CheckIcon';
/* import { TABLET_BREAKPOINT } from '../../src/consts'; */

type Tier = 'bronze' | 'silver' | 'gold' | 'platinum';

const medals = {
  bronze: {
    name: 'bronze',
    link: '/sponsor/medals/bronze.svg',
    title: 'Bronze',
    color: '#AC773A'
  },
  silver: {
    name: 'silver',
    link: '/sponsor/medals/silver.svg',
    title: 'Silver',
    color: '#B2B2B2'
  },
  gold: {
    name: 'gold',
    link: '/sponsor/medals/gold.svg',
    title: 'Gold',
    color: '#DBA10B'
  },
  platinum: {
    name: 'platinum',
    link: '/sponsor/medals/platinum.svg',
    title: 'Platinum',
    color: '#7D7D7D'
  }
};
const { benefits } = benefitData;

const medalHeight = 57;
const medalWidth = 45;
const mostPopular = 'gold';

const tiers = Object.keys(medals);

const SponsorshipTableMobile = () => {
  const [selectedMedal, setSelectedMedal] = useState<Tier>('bronze');

  return (
    <>
      <div className="py-8 px-4">
        <h2>
          Sponsorship <br />
          benefits
        </h2>
      </div>
      <table className="w-full border-t border-border-1">
        <thead>
          <tr>
            {Object.entries(medals).map(([tier, medal], index) => (
              <th
                key={tier}
                className={`relative w-1/4 border-border-1 text-center ${
                  index !== 0 ? 'border-l' : ''
                }`}
              >
                <button
                  onClick={() => setSelectedMedal(tier as Tier)}
                  aria-label={`Show ${medal} tier`}
                  className={`w-full py-4 transition-colors duration-200 outline-none cursor-pointer
                    hover:bg-background-2
                    focus-visible:ring-2 focus-visible:ring-foreground-1
                    ${selectedMedal === tier ? 'bg-background-2 relative' : ''}
                  `}
                >
                  {selectedMedal === tier && (
                    <div className="absolute border-b-2 bottom-0 w-full h-[1.9px] shadow-[0_-4px_8px_0_#fff]" />
                  )}
                  <div className="flex flex-col gap-2 items-center">
                    <Image src={medal.link} alt={'medal'} width={medalWidth} height={medalHeight} />
                    <p style={{ color: medal.color }}>{medal.title}</p>
                  </div>
                </button>
                {medal.name === mostPopular && (
                  <div className="absolute text-black -top-[38.5px] w-full bg-foreground-1 rounded-tl-lg rounded-tr-lg py-[6px]">
                    <p>Popular</p>
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {benefits.map((benefit) => {
            const highlighted = tiers.indexOf(selectedMedal) >= tiers.indexOf(benefit.lowestTier);

            return (
              <tr key={benefit.key} className="border-t border-border-1">
                <td colSpan={3} className="py-4 pl-4">
                  <h6>{benefit.title}</h6>
                  <p className="text-foreground-3">{benefit.description}</p>
                </td>
                <td className="pl-8 pr-4">
                  <div className="flex items-center justify-center">
                    {highlighted ? (
                      <IconWrapper size="small" type="primary" className="p-0">
                        <CheckIcon />
                      </IconWrapper>
                    ) : (
                      <span className="w-6 rounded-full border border-border-1" />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

const SponsorshipTableLaptop = () => (
  <>
    <table className="table-auto w-full bg-background-1">
      <thead>
        <tr>
          <th className="w-1/2 p-8 text-left shadow-[inset_-1px_0_0_0_var(--border-1)]">
            <h2 className="h3">Sponsorship benefits</h2>
          </th>
          {Object.entries(medals).map(([tier, medal], index) => (
            <th
              key={tier}
              className={`relative w-[12.5%] items-center shadow-[inset_-1px_0_0_0_var(--border-1)] last:shadow-none ${
                medal.name === 'gold' ? 'bg-background-2' : ''
              }`}
            >
              <div className="flex flex-col gap-2 items-center">
                <Image src={medal.link} alt={'medal'} width={medalWidth} height={medalHeight} />
                <p style={{ color: medal.color }}>{medal.title}</p>
              </div>
              {medal.name === mostPopular && (
                <div className="absolute shadow-[0px_8px_16px_0px_rgba(255,255,255,0.32)] text-background-1 -top-[38.6px] right-[1px] left-0 bg-foreground-1 rounded-tl-lg rounded-tr-lg py-[6px]">
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
            <td className="w-1/2 border-t border-border-1 shadow-[inset_-1px_0_0_0_var(--border-1)] align-top p-8">
              <h5>{benefit.title}</h5>
              <p className="text-foreground-3">{benefit.description}</p>
            </td>
            {tiers.map((tier) => (
              <td
                key={`${benefit.key}-${tier}`}
                className={`border-t border-border-1 shadow-[inset_-1px_0_0_0_var(--border-1)] last:shadow-none ${
                  tier === 'gold' ? 'bg-background-2' : ''
                }`}
              >
                {tiers.indexOf(tier) >= tiers.indexOf(benefit.lowestTier) ? (
                  <IconWrapper
                    size="small"
                    type="primary"
                    className="flex items-center justify-center mx-auto"
                  >
                    <CheckIcon />
                  </IconWrapper>
                ) : (
                  <div className="flex items-center justify-center mx-auto">
                    <span
                      className={`w-[24px] rounded-full border ${
                        tier === mostPopular ? 'border-border-2' : 'border-border-1'
                      }`}
                    ></span>
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
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <section>{width >= 768 ? <SponsorshipTableLaptop /> : <SponsorshipTableMobile />}</section>
  );
};

export default SponsorshipTable;
