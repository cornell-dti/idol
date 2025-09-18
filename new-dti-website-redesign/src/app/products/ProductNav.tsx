import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { TABLET_BREAKPOINT } from '../../consts';
import useScreenSize from '../../hooks/useScreenSize';
import products from './products.json';
import ArrowLogoIcon from '../../components/icons/ArrowLogoIcon';

export default function ProductNav() {
  const { width } = useScreenSize();
  const isMobile = width <= TABLET_BREAKPOINT;
  const [isClient, setIsClient] = useState(false);
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isMobile && isClient ? (
    <div className="flex flex-row sticky top-[72px] overflow-scroll h-28 items-center pl-4 gap-x-2 sectionStyles bg-background-1 fancyTabsContainer">
      {products.map((product) => (
        <Button
          className=""
          variant={activeProduct === product.id ? 'primary' : 'tertiary'}
          label={product.name}
          href={`#${product.id}`}
          key={product.name}
          onClick={() => setActiveProduct(product.id)}
        >
          {product.name}
        </Button>
      ))}
    </div>
  ) : (
    <div className="flex flex-col sticky top-[80px] h-fit w-72 px-12 gap-2 py-4">
      {products.map((product) => (
        <React.Fragment key={product.name}>
          <div className="flex flex-row items-center gap-x-2">
            {activeProduct === product.id && <ArrowLogoIcon className="rotate-90 ml-[-28px]" />}
            <Link
              href={`#${product.id}`}
              key={product.name}
              className={`cursor-pointer select-none ${activeProduct === product.id ? 'text-foreground-1' : 'text-foreground-3'}`}
              onClick={() => {
                setActiveProduct(product.id);
              }}
            >
              {product.name}
            </Link>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
