import Image from 'next/image';
import Link from 'next/link';
import ImageCarousel from '../../../components/products/imageCarousel';
import FloatingImages from '../../../components/products/FloatingImages';
import Connector from '../../../components/products/lines';
import products from '../../../components/products/products.json';
import RedBlob from '../../../components/blob';

export default function Page() {
  const productIcons = [...products.current, ...products.upcoming].map((product) => ({
    alt: product.alt,
    path: product.iconPath
  }));

  return (
    <div className="overflow-x-hidden">
      <div className="flex justify-center">
        <div className="flex lg:flex-row flex-col relative lg:px-[10vw] lg:my-24 lg:gap-20 md:space-y-10 h-fit md:my-[130px] md:px-[67px] px-10 md:py-0 py-20">
          <RedBlob
            className="-left-[250px] -top-24 scale-50 sm:scale-75 md:scale-100"
            intensity={0.4}
          />
          <div className="md:w-fit md:max-w-[558px] xs:max-w-none z-10">
            <h1 className="md:text-header md:leading-header text-[48px] font-semibold xs:leading-header-xs">
              <span className="text-white">OUR </span>
              <span className="text-red-500">PRODUCTS</span>
            </h1>
          </div>
          <div className="flex flex-col justify-center w-fit gap-y-6 z-10">
            <div className="flex flex-row">
              <h2 className="text-[24px] font-bold md:text-subheader md:leading-subheader text-hero-primary">
                Real impact
              </h2>
            </div>
            <p className="text-hero-secondary xs:max-w-none md:text-lg md:leading-body-text xs:text-sm md:max-w-md max-w-[314px] z-10">
              Each of our projects address an unfulfilled need that exists in our community using
              <span className="font-semibold">
                {' '}
                human-centered design and software engineering.
              </span>
            </p>
          </div>
        </div>
      </div>
      <ImageCarousel items={productIcons} />
      <div className="w-full py-12" />

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
        <RedBlob
          className={'-left-52 bottom-0 scale-50 sm:scale-75 md:scale-100'}
          intensity={0.3}
        />
        <RedBlob
          className={'-right-52 bottom-0 scale-50 sm:scale-75 md:scale-100'}
          intensity={0.3}
        />
        <div className="flex flex-col text-white max-w-xl text-center items-center space-y-6">
          <h2 className="font-semibold text-[32px]">Have Any Ideas?</h2>
          <p className="px-20">
            We've learned that tackling the hardest problems is the only way to truly create value
            for the people around us.
          </p>
          <Link href="mailto:hello@cornelldti.org" className="primary-button">
            Contact us
          </Link>
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
    productImageDimensions: number;
    blobs?: { className: string; intensity: number }[];
  };
}) => (
  <div
    key={props.product.alt}
    className="relative flex lg:flex-row flex-col gap-x-20 lg:justify-center lg:items-center lg:my-10 w-full"
  >
    {props.product.blobs &&
      props.product.blobs.map((blob, index) => (
        <RedBlob
          key={index}
          className={blob.className ? blob.className.trim() : ''}
          intensity={blob.intensity}
        />
      ))}
    <div
      className={`${
        props.orientation === 'left' ? 'lg:order-first lg:ml-8' : 'lg:order-last lg:mr-8'
      }`}
    >
      <div className="relative z-10 -translate-y-8">
        <Image
          src={props.product.productImage}
          alt={props.product.name}
          width={props.product.productImageDimensions}
          height={props.product.productImageDimensions}
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
        />
        <h3 className="text-3xl font-semibold">{props.product.name}</h3>
        <p>{props.product.description}</p>
        <div className="-translate-x-0.5 translate-y-10" hidden={props.product.link === ''}>
          <Link href={props.product.link} className="primary-button">
            View Product
          </Link>
        </div>
      </div>
    </div>
  </div>
);
