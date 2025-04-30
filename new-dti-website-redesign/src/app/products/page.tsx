import React from 'react';
import SectionSep from '../../components/SectionSep';
import Layout from '../../components/Layout';
import products from './products.json';
import Product from './Product';
import Hero from '../../components/Hero';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'DTI PRODUCTS PAGE',
  description: 'DESCRIPTION'
};

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  anchor: string;
};

const logos: Logo[] = [
  {
    src: '/products/logos/cureviews.svg',
    alt: 'CU Reviews logo',
    width: 80,
    height: 80,
    anchor: '#cureviews'
  },
  {
    src: '/products/logos/courseplan.svg',
    alt: 'Courseplan logo',
    width: 60,
    height: 60,
    anchor: '#courseplan'
  },
  {
    src: '/products/logos/queuemein.svg',
    alt: 'Queue Me In logo',
    width: 80,
    height: 80,
    anchor: '#queuemein'
  },
  {
    src: '/products/logos/design@cornell.svg',
    alt: 'Design @ Cornell logo',
    width: 125,
    height: 52,
    anchor: '#design@cornell'
  },
  { src: '/products/logos/zing.svg', alt: 'Zing logo', width: 96, height: 96, anchor: '#zing' },
  {
    src: '/products/logos/cuapts.svg',
    alt: 'CU Apartments logo',
    width: 110,
    height: 80,
    anchor: '#cuapts'
  },
  {
    src: '/products/logos/carriage.svg',
    alt: 'Carriage logo',
    width: 70,
    height: 70,
    anchor: '#carriage'
  },
  {
    src: '/products/logos/cornellgo.svg',
    alt: 'CornellGo logo',
    width: 80,
    height: 80,
    anchor: '#cornellgo'
  }
];

const LogoBox: React.FC<Logo> = ({ src, alt, width, height, anchor }) => (
  <Link
    className="flex items-center justify-center w-1/4 h-24 border border-border-1 hover:bg-background-2 transition-[background-color] duration-[120ms] focusState"
    href={anchor}
  >
    <Image
      src={src}
      alt={alt}
      unoptimized
      width={width}
      height={height}
      style={{ width: `${width}px`, height: `${height ?? 'auto'}px` }}
    />
  </Link>
);

export default function Products() {
  return (
    <Layout>
      <Hero
        heading="Products"
        subheading="Each of our projects address an unfulfilled need that exists in our community using human-centered design and software engineering."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="View products"
        button2Link="/"
        image="/products/hero.png"
        imageAlt="DTI students brainstorming with sticky notes"
      />

      <SectionSep />

      <div className="flex flex-wrap">
        {logos.map((logo, index) => (
          <LogoBox key={index} {...logo} />
        ))}
      </div>

      <SectionSep />

      {products.map((product, index) => (
        <React.Fragment key={product.name}>
          <Product {...product} />
          {index < products.length - 1 && <SectionSep grid />}
        </React.Fragment>
      ))}

      <section className="bg-background-3 h-[800px]">
        <h2>title</h2>
        <p className="mt-2">This is the PRODUCTS page</p>
      </section>
      <section className="bg-border-2 h-[800px]">
        <h2>title</h2>

        <p className="mt-2">This is the PRODUCTS page</p>
      </section>
    </Layout>
  );
}
