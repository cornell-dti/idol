import SectionSep from '../../components/SectionSep';
import Layout from '../../components/Layout';
import products from './products.json';
import Product from './Product';

export const metadata = {
  title: 'DTI PRODUCTS PAGE',
  description: 'DESCRIPTION'
};

export default function Products() {
  return (
    <Layout>
      <section className="bg-background-2 h-[400px]">
        <h1>PRODUCTS</h1>
        <p className="mt-2">This is the PRODUCTS page</p>
      </section>

      <SectionSep />

      {products.map((product, index) => (
        <>
          <Product
            key={index}
            image={product.image}
            imageAlt={product.imageAlt}
            name={product.name}
            description={product.description}
            link={product.link}
            comingSoon={product.comingSoon}
          />
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
