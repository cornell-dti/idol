/* eslint-disable consistent-return */

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { products, activeProducts, archivedProducts } from './productData';
import Product from './Product';
import ProductNav from './ProductNav';
import { TABLET_BREAKPOINT } from '../../consts';
import useScreenSize from '../../hooks/useScreenSize';
import SectionSep from '../../components/SectionSep';

interface NodePosition {
  id: string;
  y: number;
  scrollY: number;
}

export default function ProductsList() {
  const productSectionRef = useRef<(HTMLDivElement | null)[]>(products.map(() => null));
  const nodesRef = useRef<(HTMLHeadingElement | null)[]>(products.map(() => null));
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const { width } = useScreenSize();
  const isMobile = width <= TABLET_BREAKPOINT;

  const [isClient, setIsClient] = useState(false);
  const [activeProduct, setActiveProduct] = useState<string>(products[0]?.id || '');
  const [nodePositions, setNodePositions] = useState<NodePosition[]>([]);
  const [svgHeight, setSvgHeight] = useState(0);
  const [progressEnd, setProgressEnd] = useState(0);

  const safeSetNodePositions = useCallback((next: NodePosition[]) => {
    setNodePositions((prev) => {
      if (
        prev.length === next.length &&
        prev.every(
          (p, i) => p.id === next[i].id && p.y === next[i].y && p.scrollY === next[i].scrollY
        )
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  const updateNodePositions = useCallback(() => {
    if (!svgContainerRef.current) return;

    const containerRect = svgContainerRef.current.getBoundingClientRect();
    const containerTop = containerRect.top + window.scrollY;

    const positions: NodePosition[] = nodesRef.current
      .map((node, index) => {
        const article = productSectionRef.current[index];
        if (!node || !article) return null;
        const rect = node.getBoundingClientRect();
        const relativeY = rect.top + window.scrollY - containerTop + rect.height / 2;
        return {
          id: products[index].id,
          y: relativeY,
          scrollY: Math.max(
            0,
            article.getBoundingClientRect().top + window.scrollY - (isMobile ? 184 : 80)
          )
        };
      })
      .filter((pos): pos is NodePosition => pos !== null);

    safeSetNodePositions(positions);

    const lastProduct = productSectionRef.current[productSectionRef.current.length - 1];
    if (lastProduct) {
      const lastRect = lastProduct.getBoundingClientRect();
      const totalHeight = lastRect.bottom + window.scrollY - containerTop;
      if (totalHeight !== svgHeight) setSvgHeight(totalHeight);
    }
  }, [safeSetNodePositions, svgHeight, isMobile]);

  const measureAll = useCallback(() => {
    requestAnimationFrame(updateNodePositions);
  }, [updateNodePositions]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || nodePositions.length === 0) return;

    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const { scrollY } = window;
      const nextIndex = nodePositions.findIndex((node) => node.scrollY > scrollY);
      const previous =
        nextIndex === 0
          ? { scrollY: 0, y: 0 }
          : nodePositions[nextIndex === -1 ? nodePositions.length - 1 : nextIndex - 1];
      const next =
        nextIndex === -1
          ? { scrollY: document.documentElement.scrollHeight - window.innerHeight, y: svgHeight }
          : nodePositions[nextIndex];
      // Interpolate between product anchors so scrolling stays continuous and
      // each anchor lands exactly on the center of its heading marker.
      const fraction = Math.max(
        0,
        Math.min(1, (scrollY - previous.scrollY) / Math.max(1, next.scrollY - previous.scrollY))
      );
      setProgressEnd(previous.y + (next.y - previous.y) * fraction);
      const upcomingIndex = nodePositions.findIndex(
        (node) => node.scrollY > scrollY + window.innerHeight / 3
      );
      const activeIndex = Math.max(
        0,
        upcomingIndex === -1 ? nodePositions.length - 1 : upcomingIndex - 1
      );
      setActiveProduct(nodePositions[activeIndex].id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [isClient, nodePositions, svgHeight]);

  useEffect(() => {
    if (!isClient) return;

    const onResize = () => measureAll();
    const onOrientation = () => measureAll();

    requestAnimationFrame(measureAll);

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onOrientation);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onOrientation);
    };
  }, [isClient, isMobile, measureAll]);

  useEffect(() => {
    if (!isClient) return;
    const ro = new ResizeObserver(() => measureAll());

    if (svgContainerRef.current) ro.observe(svgContainerRef.current);

    const last = productSectionRef.current[productSectionRef.current.length - 1];
    if (last) ro.observe(last);

    nodesRef.current.forEach((h) => h && ro.observe(h));

    return () => ro.disconnect();
  }, [isClient, measureAll]);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <section id="products" className="scroll-m-20">
      <div className="relative flex flex-col min-[769px]:flex-row">
        <ProductNav activeProduct={activeProduct} productRefs={productSectionRef.current} />

        <div className="relative flex flex-row h-fit min-w-0 flex-1" ref={svgContainerRef}>
          <svg
            width={17}
            height={svgHeight}
            className="absolute top-0 left-0 -translate-x-1/2 pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="railGradient"
                x1="0"
                y1="0"
                x2="0"
                y2={svgHeight}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="var(--background-1)" />
                <stop offset="2%" stopColor="var(--foreground-3)" />
                <stop offset="98%" stopColor="var(--foreground-3)" />
                <stop offset="100%" stopColor="var(--background-1)" />
              </linearGradient>

              <linearGradient
                id="progressGradient"
                x1="0"
                y1="0"
                x2="0"
                y2={svgHeight}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="var(--background-1)" />
                <stop offset="2%" stopColor="var(--accent-red)" />
                <stop offset="98%" stopColor="var(--accent-red)" />
                <stop offset="100%" stopColor="var(--background-1)" />
              </linearGradient>
            </defs>

            {(() => {
              const x = 8.5;
              const y1 = 0;
              const y2 = svgHeight;
              const lineLength = Math.max(0, y2 - y1);
              const clamped = Math.max(0, Math.min(lineLength, progressEnd));
              const dashArray = `${lineLength} ${lineLength}`;
              const dashOffset = lineLength - clamped;

              return (
                <>
                  <line
                    x1={x}
                    y1={y1}
                    x2={x}
                    y2={y2}
                    stroke="url(#railGradient)"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />

                  <line
                    x1={x}
                    y1={y1}
                    x2={x}
                    y2={y2}
                    stroke="url(#progressGradient)"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                  />
                </>
              );
            })()}

            {nodePositions.map((node) => (
              <g key={node.id}>
                <circle
                  cx="8.5"
                  cy={node.y}
                  r="6.5"
                  fill="var(--background-1)"
                  stroke={progressEnd >= node.y ? 'var(--accent-red)' : 'var(--foreground-3)'}
                  strokeWidth="1"
                />
                <circle
                  cx="8.5"
                  cy={node.y}
                  r="3"
                  fill={progressEnd >= node.y ? 'var(--accent-red)' : 'var(--foreground-3)'}
                  style={{ transition: prefersReducedMotion ? 'none' : 'fill 0.2s ease-out' }}
                />
              </g>
            ))}
          </svg>

          <div className="flex flex-col min-w-0">
            {[activeProducts, archivedProducts].map((group, groupIndex) => (
              <section
                key={groupIndex}
                aria-label={groupIndex === 0 ? 'Active products' : 'Archived products'}
              >
                {groupIndex === 1 && (
                  <>
                    <SectionSep grid className="!w-full !mx-0 border-l-1 border-border-1" />
                    <div
                      id="archived-products"
                      className="scroll-mt-52 md:scroll-mt-24 p-4 sm:p-8 border-b border-border-1"
                    >
                      <h2 className="h3">Archived products</h2>
                    </div>
                  </>
                )}
                {group.map((product, groupProductIndex) => {
                  const index =
                    groupIndex === 0
                      ? groupProductIndex
                      : activeProducts.length + groupProductIndex;
                  return (
                    <React.Fragment key={product.name}>
                      <Product
                        {...product}
                        ref={(el) => {
                          productSectionRef.current[index] = el as HTMLDivElement;
                        }}
                        nodeRef={(el) => {
                          nodesRef.current[index] = el as HTMLHeadingElement;
                        }}
                        className={index === products.length - 1 ? '!border-b-0' : ''}
                      />
                      {groupProductIndex !== group.length - 1 && (
                        <SectionSep grid className="!w-full !mx-0 border-l-1 border-border-1" />
                      )}
                    </React.Fragment>
                  );
                })}
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
