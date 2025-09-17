import React from 'react';
import SectionSep from '../../components/SectionSep';
import Layout from '../../components/Layout';
import Hero from '../../components/Hero';
import CtaSection from '../../components/CtaSection';
import LogoBoxes from './LogoBoxes';
import ProductsList from './ProductsList';

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
        button2Link="#products"
        image="/products/hero.png"
      />

      <LogoBoxes />

      <SectionSep />

      <ProductsList />

      <SectionSep />

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
