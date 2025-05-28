import React from 'react';
import SectionSep from '../../components/SectionSep';
import Layout from '../../components/Layout';
import products from './products.json';
import Product from './Product';
import Hero from '../../components/Hero';
import CtaSection from '../../components/CtaSection';
import LogoBox from '../../components/LogoBox';
import logos from './logos.json';

export const metadata = {
  title: 'DTI PRODUCTS PAGE',
  description: 'DESCRIPTION'
};

export default function Products() {
  return (
    <Layout>
      <Hero
        heading="Products"
        subheading="Each project addresses a community need through human-centered design and software engineering."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="View products"
        button2Link="/"
        image="/products/hero.png"
      />

      <section className="grid grid-cols-4">
        {logos.map((logo, index) => (
          <LogoBox
            key={index}
            {...logo}
            fillWidth
            ariaLabel={`Jump to ${logo.alt.replace(/ logo$/i, '')} product`}
          />
        ))}
      </section>

      <SectionSep />

      {products.map((product, index) => (
        <React.Fragment key={product.name}>
          <Product {...product} />
          {index < products.length - 1 && <SectionSep grid />}
        </React.Fragment>
      ))}

      <CtaSection
        heading="Ready to join?"
        subheading="Be part of something greater today."
        button1Label="Apply to DTI"
        button1Link="/apply"
        button2Label="Meet the team"
        button2Link="/team"
      />
    </Layout>
  );
}
