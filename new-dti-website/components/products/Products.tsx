'use client';

import Image from 'next/image';
import React, { CSSProperties } from 'react';

export interface ImageData {
  src: string;
  alt: string;
  bottom?: string;
  right?: string;
  top?: string;
  left?: string;
  width?: string;
  direction?: string;
  delay?: boolean;
}

interface FloatingImagesProps {
  images: ImageData[];
}

export default function FloatingImages({ images }: FloatingImagesProps) {
  const getFloatClass = (dir?: string) => {
    switch (dir) {
      case 'up':
        return 'floating-up';
      case 'down':
        return 'floating-down';
      case 'right':
        return 'floating-right';
      default:
        return '';
    }
  };

  const getStyle = (img: ImageData, index: number): CSSProperties => {
    const style: CSSProperties = {};

    if (index !== 0) {
      if (img.bottom) style.bottom = img.bottom;
      if (img.right) style.right = img.right;
      if (img.top) style.top = img.top;
      if (img.left) style.left = img.left;
      if (img.width) style.width = img.width;
    } else {
      style.width = '100%';
    }

    return style;
  };

  return (
    <>
      <div className="relative max-w-4xl">
        {images.map((img, index) => (
          <div
            key={index}
            className={`${index === 0 ? 'relative z-10' : 'absolute'} w-full h-auto ${
              index !== 0 ? getFloatClass(img.direction) : ''
            } ${img.delay && index !== 0 ? 'floating-delay' : ''}`}
            style={getStyle(img, index)}
          >
            <Image src={img.src} alt={img.alt} width={800} height={800} />
          </div>
        ))}
      </div>
      <style>{`
    @keyframes floatUp {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }

    @keyframes floatDown {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(8px);
      }
    }

    @keyframes floatRight {
      0%,
      100% {
        transform: translateX(0);
      }
      50% {
        transform: translateX(8px);
      }
    }

    .floating-up {
      will-change: transform;
      animation: floatUp 3s ease-in-out infinite;
    }

    .floating-down {
      will-change: transform;
      animation: floatDown 3s ease-in-out infinite;
    }

    .floating-right {
      will-change: transform;
      animation: floatRight 3s ease-in-out infinite;
    }

    .floating-delay {
      animation-delay: 0.75s;
    }
  `}</style>
    </>
  );
}
