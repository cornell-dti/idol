'use client';

import Image from 'next/image';

import ImageCarousel from '../../../components/products/imageCarousel';
import Connector from '../../../components/products/lines';
import products from '../../../components/products/products.json';
import SectionWrapper from '../../../components/hoc/SectionWrapper';
import useTitle from '../../hooks/useTitle';
import Hero from '../../../components/hero';

export default function Page() {
  const productIcons = [...products.current, ...products.upcoming].map((product) => ({
    alt: product.alt,
    path: product.iconPath
  }));

  useTitle('Products');

  return (
    <div className="overflow-x-hidden">
      <Hero
        title={'Our products'}
        description={
          'Each of our projects address an unfulfilled need that exists in our community using human-centered design and software engineering.'
        }
        image={{
          src: '/images/products-hero.png',
          alt: 'DTI students brainstorming with sticky notes'
        }}
      />

      <ImageCarousel items={productIcons} />

      {products.current.map((product, index) => (
        <div key={product.alt}>
          <ProductDisplay orientation={index % 2 === 0 ? 'left' : 'right'} product={product} />
          {index < products.current.length - 1 && (
            <Connector
              orientation={index % 2 === 0 ? 'right' : 'left'}
              width={780}
              height={470}
              strokeWidth={6}
            />
          )}
        </div>
      ))}
      <Connector
        orientation={'left'}
        width={780}
        height={470}
        strokeWidth={6}
        text="Coming Soon..."
      />
      {products.upcoming.map((product, index) => (
        <div key={product.alt}>
          <ProductDisplay orientation={index % 2 === 0 ? 'left' : 'right'} product={product} />
          {index < products.upcoming.length - 1 && (
            <Connector
              orientation={index % 2 === 0 ? 'right' : 'left'}
              width={780}
              height={470}
              strokeWidth={6}
            />
          )}
        </div>
      ))}
      <Connector
        orientation="right"
        width={390}
        height={466}
        strokeWidth={6}
        className="!w-fit !ml-[50%]"
      />
      <div className="flex relative justify-center lg:my-32 md:my-64 mb-60 mt-40">
        <div className="flex flex-col text-white max-w-xl text-center items-center space-y-6">
          <h2 className="font-semibold text-[32px]">Have Any Ideas?</h2>
          <p className="px-20">
            We've learned that tackling the hardest problems is the only way to truly create value
            for the people around us.
          </p>
          <a href="mailto:hello@cornelldti.org" className="primary-button">
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
}

const ProductDisplay = (props: {
  orientation: string;
  product: {
    alt: string;
    name: string;
    description: string;
    link: string;
    iconPath: string;
    iconDimensions: number;
    iconClassName?: string;
    productImage: string;
    productAlt: string;
    productImageDimensions: number;
    blobs?: { className: string; intensity: number }[];
  };
}) => (
  <div
    key={props.product.alt}
    className="relative flex lg:flex-row flex-col gap-x-20 lg:justify-center lg:items-center lg:my-10 w-full"
  >
    <div
      className={`${
        props.orientation === 'left' ? 'lg:order-first lg:ml-8' : 'lg:order-last lg:mr-8'
      }`}
    >
      <div className="relative z-10 -translate-y-8">
        <Image
          src={props.product.productImage}
          alt={props.product.productAlt}
          width={props.product.productImageDimensions}
          height={props.product.productImageDimensions}
          unoptimized
        />
      </div>
    </div>
    <div
      className={`flex flex-row lg:max-w-md w-full justify-center md:mt-20 md:mb-60 h-full px-12 md:px-0 mt-0 mb-72 z-10 text-white ${
        props.orientation === 'left' ? 'lg:mr-24' : 'lg:ml-24'
      }`}
    >
      <div className="space-y-3 md:max-w-xl ">
        <Image
          src={props.product.iconPath}
          alt={props.product.alt}
          width={props.product.iconDimensions}
          height={props.product.iconDimensions}
          className={props.product.iconClassName}
          unoptimized
        />
        <h3 className="text-3xl font-semibold">{props.product.name}</h3>
        <p>{props.product.description}</p>
        <div className="-translate-x-0.5 translate-y-10" hidden={props.product.link === ''}>
          <a href={props.product.link} className="primary-button">
            View Product
          </a>
        </div>
      </div>
    </div>
  </div>
);
