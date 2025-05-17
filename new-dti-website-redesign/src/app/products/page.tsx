import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionSep from '../../components/SectionSep';
import Layout from '../../components/Layout';
import products from './products.json';
import Product from './Product';
import Hero from '../../components/Hero';
import CtaSection from '../../components/CtaSection';

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
    className="flex items-center justify-center w-1/4 h-24 border-border-1 border-r-1 border-b-1 hover:bg-background-2 transition-[background-color] duration-[120ms] focusState"
    href={anchor}
    aria-label={`Jump to ${alt.replace(/ logo$/i, '')} product`}
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
      />

      <section className="flex flex-wrap [&>*:nth-child(4)]:border-r-0 [&>*:nth-child(8)]:border-r-0">
        {logos.map((logo, index) => (
          <LogoBox key={index} {...logo} />
        ))}
      </section>

      <SectionSep />

      {products.map((product, index) => (
        <React.Fragment key={product.name}>
          <Product {...product} />
          {index < products.length - 1 && <SectionSep grid />}
        </React.Fragment>
      ))}

      <SectionSep />

      <CtaSection
        heading="Ready to join?"
        subheading="Be part of something greater today."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="/team"
      />

      <SectionSep />
    </Layout>
  );
}
