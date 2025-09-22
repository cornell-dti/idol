import React, { ReactNode, forwardRef } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import SectionSep from '../../components/SectionSep';

type Props = {
  image: string;
  imageAlt: string;
  name: string;
  description: string;
  link?: string;
  linkLabel?: string;
  comingSoon?: boolean;
  id: string;
  index?: 'first' | 'last';
  accentColor?: string;
  className?: string;
};

const Product = forwardRef<HTMLElement, Props>(
  (
    {
      image,
      imageAlt,
      name,
      description,
      link,
      linkLabel = 'Visit product',
      comingSoon,
      id,
      index,
      accentColor,
      className
    },
    ref
  ): ReactNode => (
    <article
      id={id}
      className={clsx(
        'relative scroll-mt-20 h-fit !border-r-0 border-y-1 border-t-0 border-border-1',
        className
      )}
      ref={ref}
    >
      <svg id={id} className="absolute h-[calc(100%+2px)] w-[3px]">
        <defs>
          <linearGradient id="topGradient" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="var(--background-1)" />
            <stop offset="10%" stopColor="var(--foreground-3)" />
          </linearGradient>
        </defs>
        <defs>
          <linearGradient id="bottomGradient" gradientTransform="rotate(90)">
            <stop offset="90%" stopColor="var(--foreground-3)" />
            <stop offset="100%" stopColor="var(--background-1)" />
          </linearGradient>
        </defs>
        <rect
          width="3px"
          height="100%"
          fill={
            // eslint-disable-next-line no-nested-ternary
            index === 'first'
              ? 'url(#topGradient)'
              : index === 'last'
                ? 'url(#bottomGradient)'
                : 'var(--foreground-3)'
          }
        />
      </svg>

      <div
        className="border-b-1 border-border-1 border-t-0"
        style={{ background: accentColor || 'var(--background-2)' }}
      >
        <Image src={image} alt={imageAlt} className="w-full h-auto" width={888} height={500} />
      </div>

      <div className="p-4 sm:p-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <h2 className="h3">{name}</h2>

            {comingSoon && <Chip label="Coming soon" color="red" allCaps />}
          </div>
          <p className="text-foreground-3">{description}</p>
        </div>

        {link && <Button href={link} variant="primary" label={linkLabel} newTab />}
      </div>
      {index !== 'last' && (
        <SectionSep
          grid
          className="!w-full !mx-0 border-l-1 border-border-1 border-t-1 !border-b-0"
        />
      )}
    </article>
  )
);

Product.displayName = 'Product';

export default Product;
