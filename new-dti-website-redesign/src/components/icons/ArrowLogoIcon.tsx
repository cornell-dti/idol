import Image from 'next/image';

type ArrowLogoIconProps = {
  width?: number;
  height?: number;
};

const ArrowLogoIcon = ({ width = 20, height = 20 }: ArrowLogoIconProps) => (
  <Image src="/arrowLogo.svg" alt="" width={width} height={height} className="min-w-5 min-h-5" />
);

export default ArrowLogoIcon;
