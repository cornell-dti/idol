import ImageCarousel from '../../../components/imageCarousel';

const products: carouselItem[] = [
  {
    alt: 'cuapts',
    path: '/icons/cuapts_icon.svg'
  },
  {
    alt: 'carriage',
    path: '/icons/carriage_icon.svg'
  },
  {
    alt: 'cureviews',
    path: '/icons/cureviews_icon.svg'
  },
  {
    alt: 'courseplan',
    path: '/icons/courseplan_icon.svg'
  },
  {
    alt: 'qmi',
    path: '/icons/qmi_icon.svg'
  },
  {
    alt: 'dac',
    path: '/icons/dac_icon.svg'
  },
  {
    alt: 'zing',
    path: '/icons/zing_icon.svg'
  }
];

interface carouselItem {
  alt: string;
  path: string;
}

const Page = () => (
  <div>
    <ImageCarousel items={products} />
  </div>
);

export default Page;
