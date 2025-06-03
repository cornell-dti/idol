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
  title: 'Products - Cornell DTI',
  description:
    'Discover student-built products from Cornell DTI: tools that solve real problems through human-centered design and modern software engineering.'
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

      <section className="grid grid-cols-4 border-border-1 border-t-1">
        {logos.map((logo, index) => (
          <LogoBox
            key={index}
            {...logo}
            fillWidth
            ariaLabel={`Jump to ${logo.alt.replace(/ logo$/i, '')} product`}
            // remove left border on 1st and 4th logos
            // remove bottom border on 4th to 8th logos
            className={`border-l border-border-1 
            ${index === 0 || index === 4 ? '!border-l-0' : ''}
            ${index >= 4 && index <= 8 ? '!border-b-0' : ''}
            `}
            outerLinkClassName={
              index === 0 ? 'onFocusRounded-t-l' : index === 3 ? 'onFocusRounded-t-r' : ''
            }
          />
        ))}
      </section>

      <SectionSep />

      {products.map((product, index) => (
        <React.Fragment key={product.name}>
          <Product {...product} />
          {index < products.length - 1 && (
            <SectionSep grid className="border-x-1 border-border-1" />
          )}
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
