import {
  Dispatch,
  KeyboardEvent,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react';
import Image from 'next/image';
import { ibm_plex_mono } from '../../src/app/layout';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '../ui/carousel/carousel';
import carouselImages from './data/carousel.json';
import useCarouselControls from '../ui/carousel/useCarouselControls';
import useScreenSize from '../../src/hooks/useScreenSize';
import useMediaReduce from '../../src/hooks/useMediaReduce';
import RedBlob from '../blob';
import SectionWrapper from '../hoc/SectionWrapper';
import { TABLET_BREAKPOINT } from '../../src/consts';

type ImageModalProps = {
  onClose: () => void;
  carouselIndex: number;
  setCarouselIndex: Dispatch<SetStateAction<number>>;
  carouselApi: CarouselApi;
  modalRef: RefObject<HTMLButtonElement>;
  isShown: boolean;
};

const ImageModal: React.FC<ImageModalProps> = ({
  onClose,
  carouselIndex,
  carouselApi,
  modalRef,
  isShown
}) => {
  const handleNext = () => carouselApi?.scrollNext();
  const handlePrev = () => carouselApi?.scrollPrev();
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed w-full inset-0 bg-opacity-50 backdrop-blur-sm z-20 md:block xs:hidden">
      <div
        className="flex justify-center items-center h-full gap-[70px] md:scale-75 lg:scale-100"
        onKeyDown={handleKeyDown}
      >
        <button onClick={handlePrev} ref={modalRef} aria-label="navigate to previous photo">
          <img src="/icons/arrow.svg" alt="" width={20} className="cursor-pointer" />
        </button>
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
                  <button onClick={onClose} aria-label="View previous carousel slide">
                    <img
                      src="/icons/close_icon.svg"
                      alt=""
                      width={47}
                      height={47}
                      className="absolute right-5 top-5 cursor-pointer"
                    />
                  </button>
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
                    {`${
                      carouselImages.images[carouselIndex % carouselImages.images.length].alt
                    }.jpg`}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <button onClick={handleNext} aria-label="View next carousel slide">
          <img src="/icons/arrow.svg" alt="" width={20} className="cursor-pointer rotate-180" />
        </button>
      </div>
    </div>
  );
};

const TeamHero = () => {
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [modalShown, setModalShown] = useState<boolean>(false);
  const [focusableElements, setFocusableElements] = useState<NodeListOf<Element>>();
  const modalRef = useRef<HTMLButtonElement>(null);
  const { width } = useScreenSize();
  const [reduceMotion] = useMediaReduce();
  const { isPlaying, togglePlayPause, carouselApi, setCarouselApi, plugin } = useCarouselControls({
    delay: 5000,
    reduceMotion,
    width
  });
  const carouselLength = carouselImages.images.length;

  useEffect(() => {
    setFocusableElements(document.querySelectorAll('button, a'));
  }, []);

  useEffect(() => {
    if (carouselApi) {
      carouselApi.on('select', () => {
        setCarouselIndex(carouselApi.selectedScrollSnap());
      });
    }
  }, [carouselIndex, carouselApi]);

  useEffect(() => {
    focusableElements?.forEach((el) => el.setAttribute('tabIndex', modalShown ? '-1' : '0'));
    if (modalShown) {
      modalRef.current?.focus();
    }
  }, [focusableElements, modalShown]);

  return (
    <div className="flex flex-col relative">
      {modalShown && (
        <ImageModal
          onClose={() => setModalShown(false)}
          carouselIndex={carouselIndex}
          setCarouselIndex={setCarouselIndex}
          carouselApi={carouselApi}
          modalRef={modalRef}
          isShown={modalShown}
        />
      )}
      <RedBlob intensity={0.7} className="left-[-300px] top-[-100px]" />
      <div className="bg-black text-white md:pt-[100px] xs:pt-9">
        <SectionWrapper id={'Team Page Hero Section'} className="mb-20 lg:mb-20">
          <div className="flex lg:flex-row xs:flex-col relative z-10">
            <div className="mr-24">
              <h1 className="font-semibold text-white md:text-header xs:text-[52px] md:leading-header xs:leading-header-xs">
                OUR <span className="text-[#FF4C4C]">TEAM</span>
              </h1>
            </div>
            <div className="flex flex-col justify-center gap-6">
              <h2 className="font-bold md:text-subheader xs:text-2xl text-hero-primary md:leading-subheader">
                Working together
              </h2>
              <p className="md:text-lg xs:text-sm text-hero-secondary md:leading-body-text">
                We are Cornell DTI. But individually, we are a{' '}
                <span className="font-bold">talented, diverse group of students</span> from
                different colleges and countries striving to make a difference in the Cornell
                community and beyond.
              </p>
            </div>
          </div>
        </SectionWrapper>
        <div
          className="flex justify-center relative bottom-2 cursor-pointer"
          style={{ pointerEvents: 'none' }}
        >
          <img src="/images/carousel-frame.png" alt="" className="absolute z-10" />
          <div className="absolute z-10 w-[243px] h-[270px]">
            <p className={`absolute bottom-0 py-3 px-2 text-[#877B7B] ${ibm_plex_mono.className}`}>
              {`${carouselImages.images[carouselIndex % carouselLength].alt}.jpg`}
            </p>
          </div>
        </div>
        <div onPointerDown={(e) => e.preventDefault()} onTouchStart={(e) => e.preventDefault()}>
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: 'center',
              loop: true,
              ...(reduceMotion && { duration: 100 })
            }}
            canClick={true}
            setApi={setCarouselApi}
            offset={0}
          >
            <CarouselContent>
              {carouselImages.images.map((image, index) => (
                <CarouselItem
                  key={image.alt}
                  className={`lg:basis-1/4 xs:basis-1/2 cursor-pointer min-w-[250px] flex justify-center ${
                    index === carouselIndex % carouselLength ? '' : 'opacity-50'
                  }`}
                >
                  <button
                    className="relative z-10 custom-focus-state team-carousel-button"
                    onClick={() =>
                      setModalShown(index === carouselIndex && width >= TABLET_BREAKPOINT)
                    }
                    aria-label="open modal"
                  >
                    <div className="flex justify-center overflow-hidden w-[227px] rounded-md">
                      <img src={image.src} alt={image.alt} className="h-[220px] max-w-none" />
                    </div>
                    <img
                      src={image.icon}
                      alt=""
                      width={50}
                      height={50}
                      className="relative bottom-[62px] left-2"
                    />
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      <button
        className="absolute right-[2%] -bottom-10 z-20 rounded-full p-2 bg-[#d63d3d] hover:bg-[#a52424] duration-300"
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

export default TeamHero;
