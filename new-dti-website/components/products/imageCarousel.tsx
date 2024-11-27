'use client';

import React from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel/carousel';
import useCarouselControls from '../ui/carousel/useCarouselControls';
import useScreenSize from '../../src/hooks/useScreenSize';
import useMediaReduce from '../../src/hooks/useMediaReduce';
import { cn } from '../../lib/utils';

interface carouselItem {
  alt: string;
  path: string;
}

const ImageCarousel = (props: { items: carouselItem[] }) => {
  const reduceMotion = useMediaReduce();
  const { width } = useScreenSize();
  const { isPlaying, togglePlayPause, currentSlide, setCarouselApi, plugin } = useCarouselControls({
    delay: 2000,
    reduceMotion,
    width
  });
  const highlightIndex = React.useMemo(() => (width < 1024 ? 1 : 3), [width]);
  console.log(isPlaying);

  return (
    <div
      className="flex relative bg-transparent overflow-x-hidden"
      onPointerDown={(e) => e.preventDefault()}
      onTouchStart={(e) => e.preventDefault()}
    >
      <Carousel
        className="grow h-36 md:h-72 lg:h-80 mb-24 md:mb-0 lg:-ml-[105px]"
        opts={{
          align: 'start',
          loop: true,
          duration: 150
        }}
        plugins={[plugin.current]}
        setApi={setCarouselApi}
        canClick={!reduceMotion}
        offset={highlightIndex}
      >
        <CarouselContent>
          {props.items.map((product, index) => (
            <CarouselItem
              key={product.alt}
              className="select-none lg:basis-[15%] basis-1/3 motion-safe:cursor-pointer md:pl-10"
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
      <button
        className="absolute right-[2%] bottom-[15%] rounded-full p-2 bg-[#d63d3d] hover:bg-[#a52424] duration-300"
        onClick={togglePlayPause}
        aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
      >
        <Image
          src={isPlaying ? '/icons/pause.svg' : '/icons/play.svg'}
          alt={isPlaying ? 'Pause' : 'Play'}
          width={24}
          height={24}
        />
      </button>
    </div>
  );
};

export default ImageCarousel;
