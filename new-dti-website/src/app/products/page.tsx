import ImageCarousel from '../../../components/products/imageCarousel';
import ProductDisplay from '../../../components/products/productDisplay';
import Connector from '../../../components/products/lines';
import productIcons from '../../../components/products/productIcons.json';
import productImages from '../../../components/products/productImages.json';
import { Button } from '../../../components/ui/button';

const Page = () => (
  <div>
    <div className="flex lg:flex-row flex-col lg:max-w-[1186.76px] lg:mx-52 lg:my-24 lg:space-x-20 md:space-y-10 md:max-w-[698px] h-fit md:my-[130px] md:mx-[67px]">
      <div className="flex flex-col justify-between h-[220px] w-fit">
        <span className="text-white text-8xl font-semibold">
          OUR
          <br />
        </span>
        <span className="text-red-500 text-8xl font-semibold">PRODUCTS</span>
      </div>
      <div className="flex flex-col justify-center w-96 gap-y-6">
        <div className="flex flex-row">
          <div className="RealImpact">
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
    <div className="w-full py-12" />

    {productImages.products.map((product, index) => (
      <div>
        <ProductDisplay
          key={product.alt}
          orientation={index % 2 === 0 ? 'left' : 'right'}
          product={product}
        />
        {index !== productImages.products.length - 1 && (
          <Connector
            orientation={index % 2 === 0 ? 'right' : 'left'}
            width={780}
            height={470}
            strokeWidth={6}
            displayText={index === productImages.products.length - 2 ? 'Coming soon...' : ''}
          />
        )}
      </div>
    ))}
    <Connector
      orientation="right"
      width={384}
      height={466}
      strokeWidth={6}
      className={'pl-[198px]'}
    />
    <div className="flex justify-center lg:my-[120px] md:my-[260px]">
      <div className="flex flex-col text-white max-w-[727px] text-center items-center space-y-6">
        <p className="font-semibold text-[32px]">Have Any Ideas?</p>
        <p className="px-20">
          We've learned that tackling the hardest problems is the only way to truly create value for
          the people around us.
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

export default Page;
