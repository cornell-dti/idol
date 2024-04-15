import Image from 'next/image';
import { Button } from '../ui/button';

const ProductDisplay = (props: {
  orientation: string;
  product: { alt: string; path: string; name: string; description: string, link: string, iconPath: string; width: number; height: number };
}) => (
  <div key={props.product.alt} className="flex flex-row justify-between w-full px-24 gap-x-24">
    <Image
      className={`${props.orientation === 'left' ? 'order-first' : 'order-last'}`}
      src={props.product.path}
      alt={props.product.alt}
      width={props.product.width}
      height={props.product.height}
    />
    <div className="w-full text-white">
      <Image src={props.product.iconPath} alt={props.product.alt} width={60} height={60} />
      <p>{props.product.name}</p>
      <p>{props.product.description}</p>
      <a href={props.product.link}>
        <Button variant="outline" size="default">
          Learn More
        </Button>
      </a>
    </div>
  </div>
);

export default ProductDisplay;
