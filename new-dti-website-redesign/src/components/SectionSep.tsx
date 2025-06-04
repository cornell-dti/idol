import XIcon from '../app/design-system/components/icon/XIcon';
import IconButton from './IconButton';

type SectionSepProps = {
  grid?: boolean;
  hasX?: boolean;
  isMobile?: boolean;
  onClickX?: () => void;
  xAriaLabel?: string;
  className?: string;
};

export default function SectionSep({
  grid = false,
  hasX = false,
  isMobile = false,
  onClickX = () => {},
  xAriaLabel,
  className
}: SectionSepProps) {
  const boxCount = isMobile ? 8 : 16;
  const lastIndex = boxCount - 1;

  if (!grid) {
    return (
      <div className={`w-full h-16 md:h-32 sectionSep border-border-1 border-x-1 ${className}`} />
    );
  }

  return (
    <div className={`w-full overflow-hidden sectionSep ${className}`}>
      <div className="flex justify-center">
        {Array.from({ length: boxCount }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square border-r-1 border-border-1 shrink-0
                  w-[calc(100%/8)] 
                  md:w-[calc(100%/16)] ${hasX && i === lastIndex ? 'relative' : ''}
                  ${i === lastIndex ? '!border-r-0' : ''}
                  `}
          >
            {hasX && i === lastIndex && (
              <IconButton
                className="absolute w-full h-full rounded-none border-none innerFocusState"
                onClick={onClickX}
                variant="tertiary"
                aria-label={xAriaLabel ?? ''}
              >
                <XIcon />
              </IconButton>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
