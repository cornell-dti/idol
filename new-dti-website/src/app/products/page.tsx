'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from '../../../components/ui/carousel';

const products = [
  {
    name: 'cuapts',
    image: '/icons/cuapts_icon.svg'
  },
  {
    name: 'carriage',
    image: '/icons/carriage_icon.svg'
  },
  {
    name: 'cureviews',
    image: '/icons/cureviews_icon.svg'
  },
  {
    name: 'courseplan',
    image: '/icons/courseplan_icon.svg'
  },
  {
    name: 'qmi',
    image: '/icons/qmi_icon.svg'
  },
  {
    name: 'dac',
    image: '/icons/dac_icon.svg'
  },
  {
    name: 'zing',
    image: '/icons/zing_icon.svg'
  }
];

const Page = () => {
  const plugin = React.useRef(Autoplay({ delay: 1300, stopOnInteraction: false }));
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>();

  useEffect(() => {
    if (carouselApi) {
      carouselApi.on('select', () => {
        setCurrentSlide(carouselApi.selectedScrollSnap());
        console.log('currentSlide', currentSlide);
      });
    }
  }, [currentSlide, carouselApi]);

  return (
    <div className="bg-black">
      <h1 className="bg-white">Page</h1>
      <Carousel
        className="w-full h-40 md:h-52 lg:h-64 xl:h-80 2xl:h-96"
        opts={{
          align: 'start',
          loop: true
        }}
        plugins={[plugin.current]}
        setApi={setCarouselApi}
      >
        <CarouselContent>
          {products.map((product, index) => (
            <CarouselItem key={product.name} className="basis-1/5 pl-16">
              <Image
                className={`${index !== (currentSlide + 2) % products.length ? 'opacity-70' : ''}`}
                src={product.image}
                alt={product.name}
                width={174}
                height={174}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Page;
