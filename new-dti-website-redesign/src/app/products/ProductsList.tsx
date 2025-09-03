import React from 'react';
import products from './products.json';
import Product from './Product';
import SectionSep from '../../components/SectionSep';

export default function ProductsList() {
  return (
    <section id="products" className="scroll-m-20">
      {products.map((product, index) => (
        <React.Fragment key={product.name}>
          <Product {...product} />
          {index < products.length - 1 && (
            <SectionSep grid className="border-x-1 border-border-1" />
          )}
        </React.Fragment>
      ))}
    </section>
  );
}
