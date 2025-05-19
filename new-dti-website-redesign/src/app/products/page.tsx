import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionSep from '../../components/SectionSep';
import Layout from '../../components/Layout';
import products from './products.json';
import Product from './Product';
import Hero from '../../components/Hero';
import CtaSection from '../../components/CtaSection';
import LogoBox from '../../components/LogoBox';

export const metadata = {
  title: 'DTI PRODUCTS PAGE',
  description: 'DESCRIPTION'
};

const logos = [
  {
    src: '/products/logos/cureviews.svg',
    alt: 'CU Reviews logo',
    width: 80,
    height: 80,
    href: '#cureviews'
  },
  {
    src: '/products/logos/courseplan.svg',
    alt: 'Courseplan logo',
    width: 60,
    height: 60,
    href: '#courseplan'
  },
  {
    src: '/products/logos/queuemein.svg',
    alt: 'Queue Me In logo',
    width: 80,
    height: 80,
    href: '#queuemein'
  },
  {
    src: '/products/logos/design@cornell.svg',
    alt: 'Design @ Cornell logo',
    width: 125,
    height: 52,
    href: '#design@cornell'
  },
  { src: '/products/logos/zing.svg', alt: 'Zing logo', width: 96, height: 96, href: '#zing' },
  {
    src: '/products/logos/cuapts.svg',
    alt: 'CU Apartments logo',
    width: 110,
    height: 80,
    href: '#cuapts'
  },
  {
    src: '/products/logos/carriage.svg',
    alt: 'Carriage logo',
    width: 70,
    height: 70,
    href: '#carriage'
  },
  {
    src: '/products/logos/cornellgo.svg',
    alt: 'CornellGo logo',
    width: 80,
    height: 80,
    href: '#cornellgo'
  }
];

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

      <div className="grid grid-cols-4 border-t-1 border-border-1">
        {logos.map((logo, index) => (
          <LogoBox key={index} {...logo} fillWidth />
        ))}
      </div>

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
