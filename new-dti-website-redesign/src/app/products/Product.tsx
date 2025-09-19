import React, { ReactNode, forwardRef } from 'react';
import Image from 'next/image';
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
  accentColor?: string;
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
      accentColor
    },
    ref
  ): ReactNode => (
    <article
      id={id}
      className="scroll-mt-20 !border-r-0 md:border-l-1 border-y-1 border-border-1"
      ref={ref}
    >
      <div
        className="border-b-1 border-border-1"
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
