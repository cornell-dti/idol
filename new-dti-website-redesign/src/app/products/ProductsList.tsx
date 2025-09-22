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
  const [activeProduct, setActiveProduct] = useState<string>(products[0]?.id || '');
  const isMobile = width <= TABLET_BREAKPOINT;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const productId = entry.target.id;
            setActiveProduct(productId);
          }
        });
      },
      {
        rootMargin: isMobile ? '-50px 0px -20% 0px' : '-100px 0px -50% 0px',
        threshold: isMobile ? 0.8 : 0.1
      }
    );

    nodesRef.current.forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });

    // eslint-disable-next-line consistent-return
    return () => {
      observer.disconnect();
    };
  }, [isClient, isMobile]);

  return (
    <section id="products" className="scroll-m-20">
      {isClient && (
        <div className={`relative flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
          <ProductNav activeProduct={activeProduct} productRefs={nodesRef.current} />

          <div className="flex flex-col">
            {products.map((product, index) => (
              <React.Fragment key={product.name}>
                <Product
                  {...product}
                  ref={(el) => {
                    nodesRef.current[index] = el as HTMLDivElement;
                  }}
                  className={index === products.length - 1 ? '!border-b-0' : ''}
                />
                {index < products.length - 1 && (
                  <SectionSep grid className="border-l-1 border-border-1" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
