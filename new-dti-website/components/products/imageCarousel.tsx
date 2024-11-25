'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '../ui/carousel';
import useScreenSize from '../../src/hooks/useScreenSize';
import useMediaReduce from '../../src/hooks/useMediaReduce';
import { cn } from '../../lib/utils';
import play from '../../public/icons/play.svg';
import pause from '../../public/icons/pause.svg';

interface carouselItem {
  alt: string;
  path: string;
}

const ImageCarousel = (props: { items: carouselItem[] }) => {
  const reduceMotion = useMediaReduce();
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));
  const [isPlaying, setIsPlaying] = useState(!reduceMotion);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>();
  const { width } = useScreenSize();
  const highlightIndex = width < 1024 ? 1 : 3;

  useEffect(() => {
    if (carouselApi && plugin.current) {
      carouselApi.on('select', () => {
        setCurrentSlide(carouselApi.selectedScrollSnap());
      });
    }
  }, [carouselApi]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex relative bg-transparent overflow-x-hidden">
      <Carousel
        className="grow h-36 md:h-72 lg:h-80 mb-24 md:mb-0 lg:-ml-[105px]"
        opts={{
          align: 'start',
          loop: true,
          duration: 200
        }}
        plugins={isPlaying ? [plugin.current] : []}
        setApi={setCarouselApi}
        canClick={true}
        offset={highlightIndex}
      >
        <CarouselContent>
          {props.items.map((product, index) => (
            <CarouselItem
              key={product.alt}
              className="select-none lg:basis-[15%] basis-1/3 cursor-pointer md:pl-10"
            >
              <Image
                className={cn(
                  `${
                    index !== (currentSlide + highlightIndex) % props.items.length
                      ? 'opacity-70'
                      : ''
                  } md:w-[211px] md:h-[211px] sm:w-[115px] sm:h-[115px]`
                )}
                src={product.path}
                alt={product.alt}
                width={174}
                height={174}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {reduceMotion && (
        <button
          className="absolute right-[2%] bottom-[15%] rounded-full p-2 bg-[#d63d3d] hover:bg-[#a52424] duration-300"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
        >
          <Image
            src={isPlaying ? pause : play}
            alt={isPlaying ? 'Pause' : 'Play'}
            width={24}
            height={24}
          />
        </button>
      )}
    </div>
  );
};

export default ImageCarousel;
