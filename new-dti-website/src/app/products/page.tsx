import ImageCarousel from '../../../components/products/imageCarousel';
import ProductDisplay from '../../../components/products/productDisplay';
import { Connector } from '../../../components/products/lines';
import productIcons from '../../../components/products/productIcons.json';
import productImages from '../../../components/products/productImages.json';

const Page = () => (
  <div>
    <div className="flex flex-row justify-between w-full px-52 py-24 space-x-[80px]">
      <div className="flex flex-col justify-between h-[220px]">
        <span className="text-white text-8xl font-semibold">
          OUR
          <br />
        </span>
        <span className="text-red-500 text-8xl font-semibold">PRODUCTS</span>
      </div>
      <div className="flex flex-col justify-center w-full gap-y-6">
        <div className="flex flex-row">
          <div className="RealImpact w-96">
            <span className="text-neutral-400 text-4xl font-bold">Real</span>
            <span className="text-white text-4xl font-medium"> </span>
            <span className="text-neutral-200 text-4xl font-bold italic">impact</span>
          </div>
        </div>
        <p className="text-[#FFFFFF]">
          Each of our projects address an unfulfilled need that exists in our community using
          <span className="font-semibold"> human-centered design and software engineering.</span>
        </p>
      </div>
    </div>
    <ImageCarousel items={productIcons.products} />

    {productImages.products.map((product, index) => (
      <div>
        <ProductDisplay
          key={product.alt}
          orientation={index % 2 === 0 ? 'left' : 'right'}
          product={product}
        />
        <Connector
          orientation={index % 2 === 0 ? 'right' : 'left'}
          width={780}
          height={470}
          strokeWidth={6}
        />
      </div>
    ))}
    {/* <Connector orientation="right" width={780} height={470} strokeWidth={6} />
    <Connector orientation="left" width={780} height={470} strokeWidth={6} />
    <Connector orientation="right" width={780} height={470} strokeWidth={6} />
    <Connector orientation="left" width={780} height={470} strokeWidth={6} />
    <Connector orientation="right" width={780} height={470} strokeWidth={6} />
    <Connector orientation="left" width={780} height={470} strokeWidth={6} /> */}
  </div>
);

export default Page;
