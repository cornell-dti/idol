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
    className="flex flex-row justify-between w-full px-24 gap-x-24 items-center"
  >
    <Image
      className={`${props.orientation === 'left' ? 'order-first' : 'order-last'}`}
      src={props.product.path}
      alt={props.product.alt}
      width={props.product.width}
      height={props.product.height}
    />
    <div className="flex flex-row w-full h-full text-white">
      <div className="space-y-6">
        <Image
          src={props.product.iconPath}
          alt={props.product.alt}
          width={props.product.iconDimensions}
          height={props.product.iconDimensions}
        />
        <p className="text-3xl font-semibold">{props.product.name}</p>
        <p>{props.product.description}</p>
        <div>
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
