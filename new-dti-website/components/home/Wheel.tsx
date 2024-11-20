'use client';
import React from 'react';
import { FC } from 'react';
import Image from 'next/image'; // Update if you use another image component

interface WheelProps {
  rotationDegree: number;
  products: {
    src: string;
    alt: string;
    position: string; // Translate position as a string for CSS
  }[];
}

const Wheel: FC<WheelProps> = ({ rotationDegree, products }) => {
  return (
    <div className="flex flex-col relative items-center justify-center text-white">
      {/* Heading and description */}
      <div className="flex flex-col items-center space-y-6 tracking-wide mr-20">
        <div className="text-4xl font-semibold">Our products define us</div>
        <div className="text-2xl font-light">
          5 launched products. The student body as our users.
        </div>
        <button className="flex flex-row text-xl space-x-2 pl-10 pr-6 py-3 h-fit w-fit bg-red-500 border-2 border-red-500 rounded-lg font-bold hover:border-red-800 hover:bg-red-800">
          <div>Explore our products</div>
        </button>
      </div>
      {/* Rotating wheel */}
      <div
        className="flex flex-col justify-center relative w-screen mr-20 mt-[-90px]"
        style={{
          transform: `rotate(${rotationDegree}deg)`,
          transformOrigin: 'center center'
        }}
      >
        <div className="flex items-center justify-center bg-blue-500">
          {products.map((product, index) => (
            <Image
              key={index}
              src={product.src}
              className="absolute"
              style={{ transform: product.position }}
              alt={product.alt}
              width={200}
              height={200}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wheel;
