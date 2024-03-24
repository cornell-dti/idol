import ImageCarousel from '../../../components/products/imageCarousel';
import { products } from '../../../components/products/productIcons.json';

const Page = () => (
  <div>
    <ImageCarousel items={products} />
    <ImageCarousel items={products} />
  </div>
);

export default Page;
