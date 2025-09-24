import Link from 'next/link';
import clsx from 'clsx';
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

  return isMobile ? (
    <aside
      ref={mobileMenuRef}
      className="sticky top-[72px] h-28 bg-background-1 border-b-1 border-border-1 z-20"
    >
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background-1 to-transparent pointer-events-none z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background-1 to-transparent pointer-events-none z-10"></div>
      <ul className="flex flex-row overflow-scroll h-full items-center pl-4 gap-x-2 fancyTabsContainer">
        {products.map((product, index) => (
          <li key={product.name} className="flex flex-row items-center gap-x-2">
            <Button
              variant={activeProduct === product.id ? 'primary' : 'tertiary'}
              label={product.name}
              key={product.name}
              aria-current={activeProduct === product.id ? 'page' : undefined}
              onClick={(e) =>
                handleMobileMenuClick(product.id, e as React.MouseEvent<HTMLButtonElement>)
              }
              ref={(el) => {
                buttonRefs.current[index] = el as HTMLButtonElement;
              }}
            >
              {product.name}
            </Button>
          </li>
        ))}
      </ul>
    </aside>
  ) : (
    <aside className="flex flex-col sticky top-[80px] h-fit w-104 px-12 gap-2 pt-4 pb-8">
      <ul className="flex flex-col gap-2">
        {products.map((product) => (
          <li key={product.name} className="flex flex-row items-center gap-x-2">
            <ArrowLogoIcon
              className={clsx(
                'rotate-90 ml-[-24px] transition-all duration-200 ease-in-out',
                activeProduct === product.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              )}
            />
            <Link
              href={`#${product.id}`}
              key={product.name}
              aria-current={activeProduct === product.id ? 'page' : undefined}
              className={clsx(
                'flex flex-row gap-x-2 cursor-pointer select-none items-center hover:text-foreground-1 rounded-sm',
                activeProduct === product.id ? 'text-foreground-1 pl-1' : 'text-foreground-3',
                'transition-colors duration-300 ease-in-out'
              )}
            >
              <p className="h6">{product.name}</p>
              {product.comingSoon && (
                <Chip label="soon" color="red" allCaps className="h-7 justify-center" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
