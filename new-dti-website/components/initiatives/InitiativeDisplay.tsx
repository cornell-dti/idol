import Image, { ImageProps } from 'next/image';
import initiatives from './data/initiatives.json';
import useScreenSize from '../../src/hooks/useScreenSize';
import { LAPTOP_BREAKPOINT } from '../../src/consts';

type InitiativeProps = {
  title: string;
  subtitle: string;
  icon: ImageProps;
  image: ImageProps;
  description: string;
  className?: string;
};

const Initiative = ({ title, subtitle, icon, image, description, className }: InitiativeProps) => (
  <article className={`flex flex-col gap-10 ${className}`}>
    <div className="flex flex-col gap-[14px]">
      <div className="flex-col gap-2 min-h-10">
        <Image {...icon} />
        <h3 className="font-semibold text-[32px] leading-10">{title}</h3>
      </div>
      <p className="font-semibold text-[22px] leading-[26px]">{subtitle}</p>
      <div className="flex justify-center">
        <Image
          {...image}
          className="xs:h-[260px] md:h-[375px] lg:h-[260px] w-full object-cover rounded-xl"
        />
      </div>
    </div>
    <p>{description}</p>
  </article>
);

const InitiativeDisplay = () => {
  const { width } = useScreenSize();
  const { featured } = initiatives;

  return (
    <section id="initiative-display" className="bg-white text-black flex justify-center my-24">
      <div className="max-w-7xl">
        {width >= LAPTOP_BREAKPOINT ? (
          <div className="grid grid-cols-2 gap-16 mb-36">
            <div className="flex flex-col gap-8">
              <h3 className="font-semibold text-[40px] leading-[48px]">{featured.subtitle}</h3>
              <p className="font-semibold text-[22px] leading-[26px]">{featured.title}</p>
              <p className="section-text !leading-[28px]">{featured.description}</p>
            </div>
            <div className="flex items-center">
              <Image {...featured.image} className="rounded-xl" />
            </div>
          </div>
        ) : (
          <Initiative
            {...featured}
            description={featured.mobileDescription}
            image={{ ...featured.image, width: 340, height: 203 }}
            className="mb-7"
          />
        )}
        <div className="grid lg:grid-cols-3 xs:grid-cols-1 lg:gap-16 xs:gap-7">
          {initiatives.standard.map((initiative, index) => (
            <Initiative
              {...initiative}
              key={index}
              description={
                width >= LAPTOP_BREAKPOINT ? initiative.description : initiative.mobileDescription
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InitiativeDisplay;
