import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { TABLET_BREAKPOINT } from '../../consts';
import useScreenSize from '../../hooks/useScreenSize';
import products from './products.json';

export default function ProductNav() {
  const { width } = useScreenSize();
  const isMobile = width <= TABLET_BREAKPOINT;
  const [isClient, setIsClient] = useState(false);
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isMobile && isClient ? (
    <div className="flex flex-row overflow-scroll h-28 items-center pl-4">
      {products.map((product) => (
        <Button label={product.name} href={`#${product.id}`} key={product.name}>
          {product.name}
        </Button>
      ))}
    </div>
  ) : (
    <div className="flex flex-col sticky top-0 left-0 justify-top w-72 pl-7 gap-2 pt-4">
      {products.map((product) => (
        <React.Fragment key={product.name}>
          <Link
            href={`#${product.id}`}
            key={product.name}
            className={`text-foreground-3 cursor-pointer select-none ${activeProduct === product.id ? 'text-foreground-1' : ''}`}
            onClick={() => setActiveProduct(product.id)}
          >
            {product.name}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
}
