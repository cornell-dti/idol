import SectionSep from '../../components/SectionSep';
import Layout from '../../components/Layout';
import products from './products.json';
import Product from './Product';
import Hero from '../../components/Hero';

export const metadata = {
  title: 'DTI PRODUCTS PAGE',
  description: 'DESCRIPTION'
};

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

      {products.map((product, index) => (
        <>
          <Product key={index} {...product} />
          {index < products.length - 1 && <SectionSep grid />}
        </>
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
