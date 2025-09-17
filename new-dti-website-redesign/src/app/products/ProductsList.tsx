'use client';

import React, { useEffect, useRef, useState } from 'react';
import products from './products.json';
import Product from './Product';
import SectionSep from '../../components/SectionSep';
import ProductNav from './ProductNav';
import { TABLET_BREAKPOINT } from '../../consts';
import useScreenSize from '../../hooks/useScreenSize';

export default function ProductsList() {
  const nodesRef = useRef<(HTMLDivElement | null)[]>(products.map(() => null));
  const { width } = useScreenSize();
  const [isClient, setIsClient] = useState(false);
  const isMobile = width <= TABLET_BREAKPOINT;
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section id="products" className="scroll-m-20">
      {isClient && (
        <div
          className={`max-w-[1184px] mx-auto relative !border-r-0 flex ${isMobile ? 'flex-col' : 'flex-row sectionStyles'}`}
        >
          <ProductNav />
          <div className="flex flex-col">
            {products.map((product, index) => (
              <React.Fragment key={product.name}>
                <Product
                  {...product}
                  ref={(el) => {
                    nodesRef.current[index] = el;
                  }}
                />
                {index < products.length - 1 && (
                  <SectionSep grid className="border-x-1 border-border-1" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
