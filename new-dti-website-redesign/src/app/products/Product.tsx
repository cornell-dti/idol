import React, { ReactNode, forwardRef } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import Button from '../../components/Button';
import Chip from '../../components/Chip';

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
    </article>
  )
);

Product.displayName = 'Product';

export default Product;
