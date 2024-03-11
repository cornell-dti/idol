'use client';

import React from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../../../components/ui/carousel';

const products = [
  {
    name: 'courseplan',
    image: '/icons/courseplan_icon.svg'
  },
  {
    name: 'cureviews',
    image: '/icons/cureviews_icon.svg'
  },
  {
    name: 'carriage',
    image: '/icons/carriage_icon.svg'
  },
  {
    name: 'cuapts',
    image: '/icons/cuapts_icon.svg'
  },
  {
    name: 'dac',
    image: '/icons/dac_icon.svg'
  },
  {
    name: 'qmi',
    image: '/icons/qmi_icon.svg'
  },
  {
    name: 'zing',
    image: '/icons/zing_icon.svg'
  }
];
const Page = () => {
  const plugin = React.useRef(Autoplay({ delay: 5, stopOnInteraction: false }));

  return (
    <div className="bg-black">
      <h1 className="bg-white">Page</h1>
      <Carousel
        opts={{
          align: 'start',
          loop: true
        }}
        plugins={[plugin.current]}
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.name}>
              <Image src={product.image} alt={product.name} width={174} height={174} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Page;
