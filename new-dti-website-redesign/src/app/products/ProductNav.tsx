import Link from 'next/link';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import { TABLET_BREAKPOINT } from '../../consts';
import useScreenSize from '../../hooks/useScreenSize';
import { products, activeProducts, archivedProducts } from './productData';
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
  const [isClient, setIsClient] = useState(false);
  const isMobile = isClient && width <= TABLET_BREAKPOINT;
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileListRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isMobile || !isClient) return;

    const activeIndex = products.findIndex((product) => product.id === activeProduct);
    const activeButtonRef = buttonRefs.current[activeIndex];

    if (activeButtonRef && mobileListRef.current) {
      const list = mobileListRef.current;
      list.scrollTo({
        left:
          list.scrollLeft +
          activeButtonRef.getBoundingClientRect().left -
          list.getBoundingClientRect().left -
          list.clientWidth / 2 +
          activeButtonRef.offsetWidth / 2,
        behavior: 'smooth'
      });
    }
  }, [activeProduct, isMobile, isClient]);

  function handleMobileMenuClick(productId: string, e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const product = productRefs.find((product) => product?.id === productId);
    if (!product || !mobileMenuRef.current) return;
    const newScrollY =
      product.getBoundingClientRect().top +
      window.scrollY -
      72 -
      mobileMenuRef.current.offsetHeight;
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
      <ul
        ref={mobileListRef}
        className="flex flex-row overflow-x-auto h-full items-center px-4 gap-x-2 fancyTabsContainer"
      >
        {products.map((product, index) => (
          <li key={product.name} className="flex flex-row shrink-0 items-center gap-x-2">
            {index === activeProducts.length && (
              <span className="text-sm uppercase tracking-wide text-foreground-3 border-l border-border-1 pl-4 ml-2">
                Archived
              </span>
            )}
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
    <aside
      aria-label="Product navigation"
      className="flex flex-col sticky top-[80px] h-fit max-h-[calc(100dvh-80px)] overflow-y-auto shrink-0 w-56 lg:w-72 px-8 lg:px-12 gap-2 pt-4 pb-8"
    >
      {[activeProducts, archivedProducts].map((group, index) => (
        <nav
          key={index}
          aria-label={index === 0 ? 'Active products' : 'Archived products'}
          className={index === 1 ? 'mt-6 pt-6 border-t border-border-1' : undefined}
        >
          {index === 1 && <p className="caps small text-foreground-3 mb-4">Archived</p>}
          <ul className="flex flex-col gap-2">
            {group.map((product) => (
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
                    'transition-colors duration-120 ease-in-out'
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
        </nav>
      ))}
    </aside>
  );
}
