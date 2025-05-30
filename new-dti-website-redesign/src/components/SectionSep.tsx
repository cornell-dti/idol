import XIcon from '../app/design-system/components/icon/XIcon';

type SectionSepProps = {
  grid?: boolean;
  hasX?: boolean;
  isMobile?: boolean;
  onClickX?: () => void;
};

export default function SectionSep({
  grid = false,
  hasX = false,
  isMobile = false,
  onClickX = () => {}
}: SectionSepProps) {
  const boxCount = isMobile ? 8 : 16;
  const lastIndex = boxCount - 1;

  if (!grid) {
    return <div className="w-full h-16 md:h-32 sectionSep border-border-1 border-l-1 border-r-1" />;
  }

  return (
    <div className="w-full overflow-hidden sectionSep border-border-1 border-l-1 border-r-1">
      <div className="flex justify-center">
        {Array.from({ length: boxCount }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square outline-[0.5px] outline-solid outline-border-1 shrink-0
                  w-[calc(100%/8)] 
                  md:w-[calc(100%/16)] ${hasX && i === lastIndex ? 'relative' : ''}`}
          >
            {hasX && i === lastIndex && (
              <div
                className="absolute cursor-pointer inset-0 flex items-center justify-center"
                onClick={onClickX}
              >
                <XIcon />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
