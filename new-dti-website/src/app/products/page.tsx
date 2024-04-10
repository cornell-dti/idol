import ImageCarousel from '../../../components/products/imageCarousel';
import { Connector, NodeLine } from '../../../components/products/lines';
import { products } from '../../../components/products/productIcons.json';

const Page = () => (
  <div>
    <ImageCarousel items={products} />
    <ImageCarousel items={products} />
    <ImageCarousel items={products} />
    <ImageCarousel items={products} />
    <ImageCarousel items={products} />

    <Connector orientation="left" width={780} height={470} strokeWidth={6} />
    <Connector orientation="right" width={780} height={470} strokeWidth={6} />
    <Connector orientation="left" width={780} height={470} strokeWidth={6} />
    <Connector orientation="right" width={780} height={470} strokeWidth={6} />
    <Connector orientation="left" width={780} height={470} strokeWidth={6} />
    <Connector orientation="right" width={780} height={470} strokeWidth={6} />
  </div>
);

export default Page;
