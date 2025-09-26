import Image from 'next/image';

type ArrowLogoIconProps = {
  width?: number;
  height?: number;
  className?: string;
};

const ArrowLogoIcon = ({ width = 20, height = 20, ...props }: ArrowLogoIconProps) => (
  <Image
    src="/arrowLogo.svg"
    alt=""
    width={width}
    height={height}
    className={`min-w-5 min-h-5 ${props.className}`}
    {...props}
  />
);

export default ArrowLogoIcon;
