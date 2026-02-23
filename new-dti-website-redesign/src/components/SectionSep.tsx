import XIcon from './icons/XIcon';
import IconButton from './IconButton';
import Button from './Button';
import type { ComponentProps } from 'react';

type SectionSepProps = {
  grid?: boolean;
  hasX?: boolean;
  isMobile?: boolean;
  onClickX?: () => void;
  xAriaLabel?: string;
  className?: string;
  disableSectionSepStyle?: boolean;
  button?: ComponentProps<typeof Button>;
  buttonPosition?: 'first' | 'last';
};

export default function SectionSep({
  grid = false,
  hasX = false,
  isMobile = false,
  onClickX = () => {},
  xAriaLabel,
  className,
  disableSectionSepStyle = false,
  button,
  buttonPosition = 'last'
}: SectionSepProps) {
  const boxCount = isMobile ? 8 : 16;
  const lastIndex = boxCount - 1;

  const sectionSepClass = disableSectionSepStyle ? 'border-border-1 border-b' : 'sectionSep';

  if (!grid) {
    return (
      <div
        className={`w-full h-16 md:h-32 border-border-1 border-x-1 ${sectionSepClass} ${className} relative flex items-center`}
      >
        {button && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 p-4 sm:p-8 ${buttonPosition === 'first' ? 'left-0' : 'right-0'}`}
          >
            <Button {...button} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden ${sectionSepClass} ${className} relative`}>
      <div className="flex justify-center">
        {Array.from({ length: boxCount }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square border-r-1 border-border-1 shrink-0
                  w-[calc(100%/8)] 
                  md:w-[calc(100%/16)] ${(hasX || button) && (buttonPosition === 'last' ? i === lastIndex : i === 0) ? 'relative' : ''}
                  ${i === lastIndex ? '!border-r-0' : ''}
                  `}
          >
            {hasX && i === lastIndex && (
              <IconButton
                className="absolute w-full h-full rounded-none border-none innerFocusState activeStateChild"
                onClick={onClickX}
                variant="tertiary"
                aria-label={xAriaLabel ?? ''}
              >
                <XIcon color={'var(--foreground-1)'} />
              </IconButton>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
