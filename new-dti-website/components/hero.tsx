import SectionWrapper from './hoc/SectionWrapper';

type HeroProps = {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  action?: {
    buttonText: string;
    link: string;
  };
};

const Hero = ({ title, description, image, action }: HeroProps) => (
  <SectionWrapper id={`${title} hero`}>
    <img
      src={image.src}
      alt={image.alt}
      height={600}
      className="w-auto lg:w-[600px] xs:w-[300px]"
    />
    <h1 className="md:text-[40px] md:leading-[46px] font-bold mt-4 xs:text-[32px] xs:leading-[36.8px]">
      {title}
    </h1>
    <p className="md:text-[18px] md:text-[#A1A1A1] leading-[28.8px]">{description}</p>
    {action && (
      <a className="primary-button" href={action.link}>
        {action.buttonText}
      </a>
    )}
  </SectionWrapper>
);

export default Hero;
