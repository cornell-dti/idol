import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import { TABLET_BREAKPOINT } from '../../consts';
import useScreenSize from '../../hooks/useScreenSize';
import products from './products.json';
import ArrowLogoIcon from '../../components/icons/ArrowLogoIcon';
import Chip from '../../components/Chip';

export default function ProductNav({
  activeProduct,
  productRefs
}: {
  activeProduct: string;
  productRefs: (HTMLDivElement | null)[];
}) {
  const { width } = useScreenSize();
  const isMobile = width <= TABLET_BREAKPOINT;
  const [isClient, setIsClient] = useState(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isMobile || !isClient) return;

    const activeIndex = products.findIndex((product) => product.id === activeProduct);
    const activeButtonRef = buttonRefs.current[activeIndex];

    if (activeButtonRef && mobileMenuRef.current) {
      activeButtonRef.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeProduct, isMobile, isClient]);

  function handleMobileMenuClick(productId: string, e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const product = productRefs.find((product) => product?.id === productId);
    const productTop = product!.offsetTop;
    const navbarHeight = mobileMenuRef.current!.offsetHeight;
    const productHeight = product!.offsetHeight;
    const windowHeight = window.innerHeight;
    const newScrollY = productTop + productHeight / 2 + windowHeight / 2 + navbarHeight;
    window.scrollTo({
      top: newScrollY,
      behavior: 'smooth'
    });
  }

  return isMobile && isClient ? (
    <aside
      ref={mobileMenuRef}
      className="sticky top-[72px] h-28 bg-background-1 border-b-1 border-border-1"
    >
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background-1 to-transparent pointer-events-none z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background-1 to-transparent pointer-events-none z-10"></div>
      <div className="flex flex-row overflow-scroll h-full items-center pl-4 gap-x-2 fancyTabsContainer">
        {products.map((product, index) => (
          <Button
            variant={activeProduct === product.id ? 'primary' : 'tertiary'}
            label={product.name}
            key={product.name}
            onClick={(e) =>
              handleMobileMenuClick(product.id, e as React.MouseEvent<HTMLButtonElement>)
            }
            ref={(el) => {
              buttonRefs.current[index] = el as HTMLButtonElement;
            }}
          >
            {product.name}
          </Button>
        ))}
      </div>
    </aside>
  ) : (
    <aside className="flex flex-col sticky top-[80px] h-fit w-104 px-12 gap-2 py-4">
      {products.map((product) => (
        <div key={product.name} className="flex flex-row items-center gap-x-2">
          <ArrowLogoIcon
            className={`rotate-90 ml-[-24px] transition-all duration-200 ease-in-out ${
              activeProduct === product.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          />
          <Link
            href={`#${product.id}`}
            key={product.name}
            className={`flex flex-row gap-x-2 cursor-pointer select-none items-center ${activeProduct === product.id ? 'text-foreground-1 pl-1' : 'text-foreground-3'} transition-all duration-300 ease-in-out`}
          >
            <p className="h6">{product.name}</p>
            {product.comingSoon && (
              <Chip label="soon" color="red" allCaps className="h-7 justify-center" />
            )}
          </Link>
        </div>
      ))}
    </aside>
  );
}
