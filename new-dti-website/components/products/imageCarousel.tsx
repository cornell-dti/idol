'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '../ui/carousel';
import useScreenSize from '../../src/hooks/useScreenSize';

interface carouselItem {
  alt: string;
  path: string;
}

const ImageCarousel = (props: { items: carouselItem[] }) => {
  const plugin = React.useRef(Autoplay({ delay: 1300, stopOnInteraction: false }));
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>();
  const { width } = useScreenSize();
  const numElements = width < 1024 ? 3 : 5;
  const highlight_index = Math.floor(numElements / 2) + 1;

  useEffect(() => {
    if (carouselApi) {
      carouselApi.on('select', () => {
        setCurrentSlide(carouselApi.selectedScrollSnap());
      });
    }
  }, [currentSlide, carouselApi]);

  return (
    <div className="bg-black overflow-x-hidden">
      <Carousel
        className="lg:w-[1688px] h-40 md:h-52 lg:h-64 xl:h-80 2xl:h-96 lg:-ml-[10%]"
        opts={{
          align: 'start',
          loop: true
        }}
        plugins={[plugin.current]}
        setApi={setCarouselApi}
      >
        <CarouselContent>
          {props.items.map((product, index) => (
            <CarouselItem key={product.alt} className="select-none lg:basis-[15%] sm:basis-1/3">
              <Image
                className={`${
                  index !== (currentSlide + highlight_index) % props.items.length
                    ? 'opacity-70'
                    : ''
                } w-[211px] h-[211px]`}
                src={product.path}
                alt={product.alt}
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

export default ImageCarousel;
