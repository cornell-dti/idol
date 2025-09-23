/* eslint-disable consistent-return */

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import products from './products.json';
import Product from './Product';
import ProductNav from './ProductNav';
import { TABLET_BREAKPOINT } from '../../consts';
import useScreenSize from '../../hooks/useScreenSize';
import SectionSep from '../../components/SectionSep';

interface NodePosition {
  id: string;
  y: number;
  isVisible: boolean;
}

export default function ProductsList() {
  const productSectionRef = useRef<(HTMLDivElement | null)[]>(products.map(() => null));
  const nodesRef = useRef<(HTMLHeadingElement | null)[]>(products.map(() => null));
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const { width } = useScreenSize();

  const [isClient, setIsClient] = useState(false);
  const [activeProduct, setActiveProduct] = useState<string>(products[0]?.id || '');
  const [nodePositions, setNodePositions] = useState<NodePosition[]>([]);
  const [svgHeight, setSvgHeight] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const isMobile = width <= TABLET_BREAKPOINT;

  const updateNodePositions = () => {
    if (!svgContainerRef.current) return;

    const containerRect = svgContainerRef.current.getBoundingClientRect();
    const containerTop = containerRect.top + window.scrollY;

    const positions: NodePosition[] = nodesRef.current
      .map((node, index) => {
        if (!node) return null;

        const rect = node.getBoundingClientRect();
        const relativeY = rect.top + window.scrollY - containerTop + rect.height / 2;

        return {
          id: products[index].id,
          y: relativeY,
          isVisible: rect.top >= -100 && rect.bottom <= window.innerHeight + 100
        };
      })
      .filter((pos): pos is NodePosition => pos !== null);

    setNodePositions(positions);

    const lastProduct = productSectionRef.current[productSectionRef.current.length - 1];
    if (lastProduct) {
      const lastRect = lastProduct.getBoundingClientRect();
      const totalHeight = lastRect.bottom + window.scrollY - containerTop;
      setSvgHeight(totalHeight);
    }
  };

  const updateScrollProgress = useCallback(() => {
    if (!svgContainerRef.current || nodePositions.length === 0) return;

    const containerRect = svgContainerRef.current.getBoundingClientRect();
    const containerTop = containerRect.top + window.scrollY;
    const containerBottom = containerTop + svgHeight;

    const viewportCenter = window.scrollY + window.innerHeight / 2;

    if (viewportCenter <= containerTop) {
      setScrollProgress(0);
    } else if (viewportCenter >= containerBottom) {
      setScrollProgress(1);
    } else {
      const progress = (viewportCenter - containerTop + 150) / (containerBottom - containerTop);
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    }
  }, [svgHeight, nodePositions.length]);

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

    productSectionRef.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => {
      observer.disconnect();
    };
  }, [isClient, isMobile]);

  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      updateNodePositions();
    };

    setTimeout(updateNodePositions, 100);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      updateScrollProgress();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isClient, svgHeight, nodePositions.length, updateScrollProgress]);

  return (
    <section id="products" className="scroll-m-20">
      {isClient && (
        <div className={`relative flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
          <ProductNav activeProduct={activeProduct} productRefs={productSectionRef.current} />
          <div className="flex flex-row h-fit" ref={svgContainerRef}>
            <svg
              width={17}
              height={svgHeight}
              className={clsx('absolute ml-[-10px]')}
              style={{ minHeight: '100%' }}
            >
              {/* --- GRADIENTS FOR STROKES (scale with svgHeight) --- */}
              <defs>
                {/* Rail gradient (gray) */}
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

                {/* Progress gradient (red) */}
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
                const clamped = Math.max(0, Math.min(1, scrollProgress));
                const dashArray = `${lineLength} ${lineLength}`;
                const dashOffset = lineLength * (1 - clamped);

                return (
                  <>
                    {/* Rail (background) */}
                    <line
                      x1={x}
                      y1={y1}
                      x2={x}
                      y2={y2}
                      stroke="url(#railGradient)"
                      strokeWidth={3}
                      strokeLinecap="round"
                    />

                    {/* Progress (foreground) */}
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
                      style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
                    />
                  </>
                );
              })()}

              {/* Nodes at each product header */}
              {nodePositions.map((node) => (
                <g key={node.id}>
                  {/* Outer circle (background) */}
                  <circle
                    cx="8.5"
                    cy={node.y}
                    r="6.5"
                    fill="var(--background-1)"
                    stroke={
                      scrollProgress >= node.y / svgHeight
                        ? 'var(--accent-red)'
                        : 'var(--foreground-3)'
                    }
                    strokeWidth="1"
                  />
                  {/* Inner circle (progress indicator) */}
                  <circle
                    cx="8.5"
                    cy={node.y}
                    r="3"
                    fill={
                      scrollProgress >= node.y / svgHeight
                        ? 'var(--accent-red)'
                        : 'var(--foreground-3)'
                    }
                    style={{ transition: 'fill 0.2s ease-out' }}
                  />
                </g>
              ))}
            </svg>

            <div className="flex flex-col">
              {products.map((product, index) => (
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
                  {index !== products.length - 1 && (
                    <SectionSep grid className="!w-full !mx-0 border-l-1 border-border-1" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
