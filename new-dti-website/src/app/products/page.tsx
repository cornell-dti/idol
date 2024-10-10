import Image from 'next/image';
import ImageCarousel from '../../../components/products/imageCarousel';
import Connector from '../../../components/products/lines';
import products from '../../../components/products/products.json';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';

const Page = () => {
  const productIcons = [...products.current, ...products.upcoming].map((product) => ({
    alt: product.alt,
    path: product.iconPath
  }));

  return (
    <div>
      <div className="flex lg:flex-row flex-col lg:max-w-[1186.76px] lg:mx-52 lg:my-24 lg:space-x-20 md:space-y-10 md:max-w-[698px] h-fit md:my-[130px] md:mx-[67px] max-w-[314px] mx-auto md:py-0 py-32">
        <div className="md:w-fit w-[314px]">
          <p className="md:text-[100px] md:leading-[121px] text-[48px] leading-[58px] font-semibold">
            <span className="text-white">OUR </span>
            <span className="text-red-500">PRODUCTS</span>
          </p>
        </div>
        <div className="flex flex-col justify-center w-fit gap-y-6">
          <div className="flex flex-row">
            <div className="RealImpact text-[24px] leading-[29.05px] font-bold md:text-[40px] md:leading-[48.41px]">
              <span className="text-neutral-400">Real</span>
              <span className="text-white font-medium"> </span>
              <span className="text-neutral-200 italic">impact</span>
            </div>
          </div>
          <p className="text-[#FFFFFF] w-[475px] md:text-lg md:leading-[21.78px] text-[14px] leading-[16.94px]  md:max-w-md max-w-[314px]">
            Each of our projects address an unfulfilled need that exists in our community using
            <span className="font-semibold"> human-centered design and software engineering.</span>
          </p>
        </div>
      </div>
      <ImageCarousel items={productIcons} />
      <div className="w-full py-12" />

      {products.current.map((product, index) => (
        <div>
          <ProductDisplay
            key={product.alt}
            orientation={index % 2 === 0 ? 'left' : 'right'}
            product={product}
          />
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
      {products.upcoming.map((product, index) => (
        <div>
          <ProductDisplay
            key={product.alt}
            orientation={index % 2 === 0 ? 'left' : 'right'}
            product={product}
          />
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
      <div className="flex justify-center lg:my-32 md:my-64 mb-60 mt-40">
        <div className="flex flex-col text-white max-w-screen-md text-center items-center space-y-6">
          <p className="font-semibold text-[32px]">Have Any Ideas?</p>
          <p className="px-20">
            We've learned that tackling the hardest problems is the only way to truly create value
            for the people around us.
          </p>
          <Button
            className="text-white font-bold bg-[#D63D3D] hover:bg-[#A52424] hover:text-white border-none px-4 py-5"
            variant="outline"
            size="default"
          >
            Contact us
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProductDisplay = (props: {
  orientation: string;
  product: {
    alt: string;
    path: string;
    name: string;
    description: string;
    link: string;
    iconPath: string;
    iconDimensions: number;
    width: number;
    height: number;
  };
}) => (
  <div
    key={props.product.alt}
    className="flex lg:flex-row flex-col gap-x-20 lg:justify-center lg:my-10 w-full"
  >
    <div
      className={cn(
        'md:mx-16 px-4 md:px-0',
        `${props.orientation === 'left' ? 'lg:order-first lg:ml-8' : 'lg:order-last lg:mr-8'}`
      )}
    >
      <Image
        src={props.product.path}
        alt={props.product.alt}
        width={props.product.width}
        height={props.product.height}
      />
    </div>
    <div
      className={`flex flex-row lg:max-w-md w-full justify-center md:mt-20 md:mb-60 h-full px-12 mt-32 mb-40 text-white ${
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
          <a href={props.product.link}>
            <Button
              className="text-white bg-[#D63D3D] hover:bg-[#A52424] hover:text-white border-none px-4 py-5"
              variant="outline"
              size="default"
            >
              Learn More
            </Button>
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default Page;
