import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { ibm_plex_mono } from '../../src/app/layout';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '../ui/carousel';
import carouselImages from './data/carousel.json';
import useScreenSize from '../../src/hooks/useScreenSize';
import RedBlob from '../blob';
import { TABLET_BREAKPOINT } from '../../src/consts';

type ImageModalProps = {
  onClose: () => void;
  carouselIndex: number;
  setCarouselIndex: Dispatch<SetStateAction<number>>;
  carouselApi: CarouselApi;
};

const ImageModal: React.FC<ImageModalProps> = ({ onClose, carouselIndex, carouselApi }) => {
  const handleNext = () => carouselApi?.scrollNext();
  const handlePrev = () => carouselApi?.scrollPrev();
  return (
    <div className="fixed w-full inset-0 bg-opacity-50 backdrop-blur-sm z-20 md:block xs:hidden">
      <div className="flex justify-center items-center h-full gap-[70px] md:scale-75 lg:scale-100">
        <img
          src="/icons/arrow.svg"
          alt="left arrow"
          width={20}
          onClick={handlePrev}
          className="cursor-pointer"
        />
        <Carousel
          opts={{
            startIndex: carouselIndex,
            loop: true
          }}
          className="w-[750px]"
        >
          <CarouselContent>
            {carouselImages.images.map((image) => (
              <CarouselItem key={image.alt} className="flex justify-center">
                <div className="relative w-[750px] h-[511px] bg-white rounded-md">
                  <div className="flex items-center h-[440px] overflow-hidden rounded-md relative top-[10px] left-[10px]">
                    <img src={image.src} alt={image.alt} className="w-[730px] h-fit" />
                  </div>
                  <img
                    src="/icons/close_icon.svg"
                    alt="close"
                    width={47}
                    height={47}
                    className="absolute right-5 top-5 cursor-pointer"
                    onClick={onClose}
                  />
                  <img
                    src={image.icon}
                    alt="icon"
                    width={90}
                    height={90}
                    className="absolute bottom-20 left-6"
                  />
                  <p
                    className={`absolute bottom-0 p-5 text-xl text-[#877B7B] whitespace-nowrap ${ibm_plex_mono.className}`}
                  >
                    {`${carouselImages.images[carouselIndex % 6].alt}.jpg`}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <img
          src="/icons/arrow.svg"
          alt="right arrow"
          width={20}
          onClick={handleNext}
          className="cursor-pointer rotate-180"
        />
      </div>
    </div>
  );
};

const TeamHero = () => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [modalShown, setModalShown] = useState<boolean>(false);

  const { width } = useScreenSize();

  useEffect(() => {
    if (carouselApi) {
      carouselApi.on('select', () => {
        setCarouselIndex(carouselApi.selectedScrollSnap());
      });
    }
  }, [carouselIndex, carouselApi]);

  return (
    <div className="flex flex-col">
      {modalShown && (
        <ImageModal
          onClose={() => setModalShown(false)}
          carouselIndex={carouselIndex}
          setCarouselIndex={setCarouselIndex}
          carouselApi={carouselApi}
        />
      )}
      <RedBlob intensity={0.7} className="left-[-300px] top-[-100px]" />
      <div className="bg-black text-white md:pt-[100px] xs:pt-9">
        <div
          className="flex lg:flex-row xs:flex-col w-2/3 gap-y-9 relative z-10
        lg:m-[0_0_106px_152px] md:m-[0_0_140px_40px] xs:m-[0_0_71px_36px]"
        >
          <div className="mr-20">
            <h1 className="font-semibold md:text-[100px] xs:text-[52px] md:leading-[120px] xs:leading-[63px]">
              OUR <span className="text-[#FF4C4C]">TEAM</span>
            </h1>
          </div>
          <div className="flex flex-col justify-center gap-6">
            <h2 className="font-bold md:text-[40px] xs:text-2xl">
              <span className="text-[#877B7B]">Working</span>{' '}
              <span className="italic">together</span>
            </h2>
            <p className="md:text-lg xs:text-sm">
              We are Cornell DTI. But individually, we are a{' '}
              <span className="font-bold">talented, diverse group of students</span> from different
              colleges and countries striving to make a difference in the Cornell community and
              beyond.
            </p>
          </div>
        </div>
        <div className="flex justify-center relative bottom-2">
          <img src="/images/carousel-frame.png" alt="frame" className="absolute z-10" />
          <div className="absolute z-10 w-[243px] h-[270px]">
            <p className={`absolute bottom-0 py-3 px-2 text-[#877B7B] ${ibm_plex_mono.className}`}>
              {`${carouselImages.images[carouselIndex % 6].alt}.jpg`}
            </p>
          </div>
        </div>
        <div>
          <Carousel
            plugins={modalShown ? undefined : [Autoplay({ delay: 5000, stopOnInteraction: false })]}
            opts={{
              align: 'center',
              loop: true
            }}
            canClick={true}
            setApi={setCarouselApi}
            offset={0}
          >
            <CarouselContent>
              {carouselImages.images.map((image, index) => (
                <CarouselItem
                  key={image.alt}
                  className={`lg:basis-1/4 xs:basis-1/2 cursor-pointer flex justify-center ${
                    index === carouselIndex % 6 ? '' : 'opacity-50'
                  }`}
                >
                  <div
                    className="relative z-10"
                    onClick={() => {
                      if (index === carouselIndex % 6 && width >= TABLET_BREAKPOINT)
                        setModalShown(true);
                    }}
                  >
                    <div className="flex justify-center overflow-hidden w-[227px] rounded-md">
                      <img src={image.src} alt={image.alt} className="h-[220px] max-w-none" />
                    </div>
                    <img
                      src={image.icon}
                      alt="icon"
                      width={50}
                      height={50}
                      className="relative bottom-[62px] left-2"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default TeamHero;
