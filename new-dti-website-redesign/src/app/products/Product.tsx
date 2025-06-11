import React, { ReactNode } from 'react';
import Image from 'next/image';
import Button from '../../components/Button';
import Chip from '../../components/Chip';

type Props = {
  image: string;
  imageAlt: string;
  name: string;
  description: string;
  link?: string;
  comingSoon?: boolean;
  id: string;
};

const Product = ({
  image,
  imageAlt,
  name,
  description,
  link,
  comingSoon,
  id
}: Props): ReactNode => (
  <article id={id} className="sectionStyles scroll-mt-20">
    <div className="bg-background-2 border-b-1 border-border-1">
      <Image src={image} alt={imageAlt} className="w-full h-auto" width={888} height={500} />
    </div>

    <div className="p-4 sm:p-8 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <h2 className="h3">{name}</h2>

          {comingSoon && <Chip label="Coming soon" color="red" />}
        </div>
        <p className="text-foreground-3">{description}</p>
      </div>

      {link && <Button href={link} variant="primary" label="Visit product" newTab />}
    </div>
  </article>
);

export default Product;
