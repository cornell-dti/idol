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
    className="flex lg:flex-row flex-col justify-between w-full lg:gap-x-24 items-center lg:my-10"
  >
    <div
      className={`md:mx-[60px] ${
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
      className={`flex flex-row lg:max-w-[430px] md:max-w-[567px] md:mt-20 md:mb-[250px] h-full text-white ${
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
