import Image from 'next/image';
import ImageCarousel from '../../../components/products/imageCarousel';
import FloatingImages, { ImageData } from '../../../components/products/FloatingImages';
import Connector from '../../../components/products/lines';
import products from '../../../components/products/products.json';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import RedBlob from '../../../components/blob';
import Link from 'next/link';

export default function Page() {
  const productIcons = [...products.current, ...products.upcoming].map((product) => ({
    alt: product.alt,
    path: product.iconPath
  }));

  return (
    <div className="overflow-x-hidden">
      <div className="flex lg:flex-row flex-col relative lg:max-w-[1186.76px] lg:mx-52 lg:my-24 lg:space-x-20 md:space-y-10 md:max-w-[698px] h-fit md:my-[130px] md:mx-[67px] max-w-[314px] mx-auto md:py-0 py-32">
        <RedBlob
          className={'-left-[250px] -top-24 scale-50 sm:scale-75 md:scale-100'}
          intensity={0.4}
        />
        <div className="md:w-fit w-[314px] z-10">
          <p className="md:text-[100px] md:leading-[121px] text-[48px] leading-[58px] font-semibold">
            <span className="text-white">OUR </span>
            <span className="text-red-500">PRODUCTS</span>
          </p>
        </div>
        <div className="flex flex-col justify-center w-fit gap-y-6 z-10">
          <div className="flex flex-row">
            <div className="RealImpact text-[24px] leading-[29.05px] font-bold md:text-[40px] md:leading-[48.41px]">
              <span className="text-neutral-400">Real</span>
              <span className="text-white font-medium"> </span>
              <span className="text-neutral-200 italic">impact</span>
            </div>
          </div>
          <p className="text-[#FFFFFF] w-[475px] md:text-lg md:leading-[21.78px] text-[14px] leading-[16.94px]  md:max-w-md max-w-[314px] z-10">
            Each of our projects address an unfulfilled need that exists in our community using
            <span className="font-semibold"> human-centered design and software engineering.</span>
          </p>
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
        <div className="flex flex-col text-white max-w-screen-md text-center items-center space-y-6">
          <p className="font-semibold text-[32px]">Have Any Ideas?</p>
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
    blobs?: { className: string; intensity: number }[];
    images?: ImageData[];
  };
}) => (
  <div
    key={props.product.alt}
    className="relative flex lg:flex-row flex-col gap-x-20 lg:justify-center lg:items-center lg:my-10 w-full "
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
      className={cn(
        'md:mx-16 px-20 sm:px-28 md:px-20',
        `${props.orientation === 'left' ? 'lg:order-first lg:ml-8' : 'lg:order-last lg:mr-8'}`
      )}
    >
      <div className="relative z-10 -translate-y-20">
        <FloatingImages images={props.product.images ?? []} />
      </div>
    </div>
    <div
      className={`flex flex-row lg:max-w-md w-full justify-center md:mt-20 md:mb-60 h-full px-12 mt-0 mb-72 z-10 text-white ${
        props.orientation === 'left' ? 'lg:mr-24' : 'lg:ml-24'
      }`}
    >
      <div className="space-y-6 md:max-w-xl">
        <Image
          src={props.product.iconPath}
          alt={props.product.alt}
          width={props.product.iconDimensions}
          height={props.product.iconDimensions}
        />
        <p className="text-3xl font-semibold">{props.product.name}</p>
        <p>{props.product.description}</p>
        <div hidden={props.product.link === ''}>
          <Link href={props.product.link} className="primary-button">
            View Product
          </Link>
        </div>
      </div>
    </div>
  </div>
);
