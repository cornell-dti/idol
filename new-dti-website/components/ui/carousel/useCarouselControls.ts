import { useEffect, useRef, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import type { CarouselApi } from './carousel';

interface UseCarouselControlsOptions {
  width?: number;
  delay?: number;
  reduceMotion?: boolean;
}

const useCarouselControls = ({
  delay = 5000,
  reduceMotion = false,
  width
}: UseCarouselControlsOptions) => {
  const [isPlaying, setIsPlaying] = useState(!reduceMotion);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const plugin = useRef(Autoplay({ delay, stopOnInteraction: false, playOnInit: isPlaying }));

  useEffect(() => {
    if (carouselApi && plugin.current) {
      carouselApi.on('select', () => {
        setCurrentSlide(carouselApi.selectedScrollSnap());
      });
      if (isPlaying) {
        plugin.current.play();
      } else {
        plugin.current.stop();
      }
    }
  }, [carouselApi, isPlaying]);

  useEffect(() => {
    if (reduceMotion && width) {
      setIsPlaying(false);
    }
  }, [width, reduceMotion]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return {
    isPlaying,
    setIsPlaying,
    currentSlide,
    setCurrentSlide,
    carouselApi,
    setCarouselApi,
    togglePlayPause,
    plugin
  };
};

export default useCarouselControls;
