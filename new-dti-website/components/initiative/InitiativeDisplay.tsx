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
  eventName: string;
};

const Initiative = (
  { title, subtitle, icon, image, description, eventName }: InitiativeProps,
  className?: string
) => {
  const parts = description.split(new RegExp(`(${eventName})`));

  return (
    <div className={`flex flex-col gap-10 ${className}`}>
      <div className="flex flex-col gap-[14px]">
        <div>
          <Image {...icon} />
          <h3>{title}</h3>
        </div>
        <p>{subtitle}</p>
        <Image {...image} />
      </div>
      <p>{parts.map((part, index) => (part === eventName ? <b key={index}>{part}</b> : part))}</p>
    </div>
  );
};

const InitiativeDisplay = () => {
  const { width } = useScreenSize();
  const { featured } = initiatives;
  const parts = featured.description.split(new RegExp(`(${featured.eventName})`));

  return (
    <div className="bg-white text-black flex justify-center mt-6">
      <div className="max-w-7xl">
        {width >= LAPTOP_BREAKPOINT ? (
          <div className="flex gap-16">
            <div>
              <h3>{featured.subtitle}</h3>
              <p>{featured.title}</p>
              <p>
                {parts.map((part, index) =>
                  part === featured.eventName ? <b key={index}>{part}</b> : part
                )}
              </p>
            </div>
            <Image {...featured.image} />
          </div>
        ) : (
          <Initiative {...featured} description={featured.mobileDescription} />
        )}
        <div className="grid grid-cols-3">
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
    </div>
  );
};

export default InitiativeDisplay;
