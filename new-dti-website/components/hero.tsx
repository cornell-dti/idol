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
    disabled?: boolean;
  };
};

const Hero = ({ title, description, image, action }: HeroProps) => (
  <SectionWrapper id={`${title} hero`}>
    <img src={image.src} alt={image.alt} height={600} className="w-[100%] rounded-[16px]" />
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="md:text-[40px] md:leading-[46px] font-bold mt-4 xs:text-[32px] xs:leading-[36.8px] text-[#ffffff]">
          {title}
        </h1>
        <p className="md:text-[18px] text-hero-secondary leading-[28.8px]">{description}</p>
      </div>
      {action &&
        (action.disabled ? (
          <a
            className={`primary-button ${
              action.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
            }`}
            href={action.link}
          >
            {action.buttonText}
          </a>
        ) : (
          <button className="primary-button" disabled={true}>
            {action.buttonText}
          </button>
        ))}
    </div>
  </SectionWrapper>
);

export default Hero;
