import Image from 'next/image';
import { Button } from '../ui/button';

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
    className="flex lg:flex-row flex-col gap-x-20 w-full lg:justify-center lg:my-10 w-full"
  >
    <div
      className={`md:mx-16 ${
        props.orientation === 'left' ? 'lg:order-first lg:ml-8' : 'lg:order-last lg:mr-8'
      }`}
    >
      <Image
        src={props.product.path}
        alt={props.product.alt}
        width={props.product.width}
        height={props.product.height}
      />
    </div>
    <div
      className={`flex flex-row lg:max-w-md md:max-w-xl md:mt-20 md:mb-60 h-full text-white ${
        props.orientation === 'left' ? 'lg:mr-24' : 'lg:ml-24'
      }`}
    >
      <div className="space-y-6">
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

export default ProductDisplay;
