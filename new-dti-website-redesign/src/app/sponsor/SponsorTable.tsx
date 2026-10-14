'use client';

import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import benefitData from './benefits.json';
import useScreenSize from '../../hooks/useScreenSize';
import IconWrapper from '../../components/IconWrapper';
import CheckIcon from '../../components/icons/CheckIcon';
import ExternalLinkIcon from '../../components/icons/ExternalLinkIcon';
import { TABLET_BREAKPOINT } from '../../consts';

type Tier = 'bronze' | 'silver' | 'gold' | 'platinum';

const medals = {
  bronze: {
    name: 'bronze',
    link: '/sponsor/medals/bronze.svg',
    title: 'Bronze',
    price: '$1,000',
    color: '#AC773A'
  },
  silver: {
    name: 'silver',
    link: '/sponsor/medals/silver.svg',
    title: 'Silver',
    price: '$2,500',
    color: '#B2B2B2'
  },
  gold: {
    name: 'gold',
    link: '/sponsor/medals/gold.svg',
    title: 'Gold',
    price: '$4,000',
    color: '#DBA10B'
  },
  platinum: {
    name: 'platinum',
    link: '/sponsor/medals/platinum.svg',
    title: 'Platinum',
    price: '$5,000',
    color: '#7D7D7D'
  }
};
const { benefits } = benefitData;

const BenefitDescription = ({ benefit }: { benefit: (typeof benefits)[number] }) => (
  <p className="text-foreground-3">
    {benefit.descriptionLinks
      ? benefit.descriptionLinks.map((link, index) => (
          <Fragment key={link.href}>
            {index > 0 && ' & '}
            <Link
              href={link.href}
              className="inline-flex max-w-full items-center gap-1 align-bottom hover:text-foreground-1 focusState rounded-sm"
            >
              <span className="underline underline-offset-3">{link.label}</span>
              <ExternalLinkIcon size={16} className="shrink-0" />
            </Link>
          </Fragment>
        ))
      : benefit.description}
  </p>
);

const medalHeight = 57;
const medalWidth = 45;
const mostPopular = 'gold';

const tiers = Object.keys(medals) as Tier[];

const BenefitValue = ({
  benefit,
  tier,
  mobile = false
}: {
  benefit: (typeof benefits)[number];
  tier: Tier;
  mobile?: boolean;
}) => {
  if (benefit.values) {
    return <p className="text-center !text-[20px]">{benefit.values[tier]}</p>;
  }

  if (tiers.indexOf(tier) >= tiers.indexOf(benefit.lowestTier as Tier)) {
    return (
      <IconWrapper
        size="small"
        type="primary"
        className={mobile ? 'p-0' : 'flex items-center justify-center mx-auto'}
      >
        <CheckIcon />
      </IconWrapper>
    );
  }

  return (
    <div className="flex items-center justify-center mx-auto">
      <span
        className={`w-6 rounded-full border ${
          !mobile && tier === mostPopular ? 'border-border-2' : 'border-border-1'
        }`}
      />
    </div>
  );
};

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
                  aria-label={`Show ${medal.title} tier`}
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
                    <p>{medal.price}</p>
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
          {benefits.map((benefit) => (
            <tr key={benefit.key} className="border-t border-border-1">
              <td colSpan={3} className="py-4 pl-4">
                <h6>{benefit.title}</h6>
                <BenefitDescription benefit={benefit} />
              </td>
              <td className="pl-8 pr-4">
                <div className="flex items-center justify-center">
                  <BenefitValue benefit={benefit} tier={selectedMedal} mobile />
                </div>
              </td>
            </tr>
          ))}
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
          {Object.entries(medals).map(([tier, medal]) => (
            <th
              key={tier}
              className={`relative w-[12.5%] items-center shadow-[inset_-1px_0_0_0_var(--border-1)] last:shadow-none ${
                medal.name === 'gold' ? 'bg-background-2' : ''
              }`}
            >
              <div className="flex flex-col gap-2 items-center">
                <Image src={medal.link} alt={'medal'} width={medalWidth} height={medalHeight} />
                <p style={{ color: medal.color }}>{medal.title}</p>
                <p>{medal.price}</p>
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
              <BenefitDescription benefit={benefit} />
            </td>
            {tiers.map((tier) => (
              <td
                key={`${benefit.key}-${tier}`}
                className={`border-t border-border-1 shadow-[inset_-1px_0_0_0_var(--border-1)] last:shadow-none ${
                  tier === 'gold' ? 'bg-background-2' : ''
                }`}
              >
                <BenefitValue benefit={benefit} tier={tier} />
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
    <section>
      {width >= TABLET_BREAKPOINT ? <SponsorshipTableLaptop /> : <SponsorshipTableMobile />}
    </section>
  );
};

export default SponsorshipTable;
