type SectionSepProps = {
  grid?: boolean;
};

export default function SectionSep({ grid = false }: SectionSepProps) {
  if (!grid) {
    return <div className="w-full h-16 md:h-32 sectionSep border-border-1 border-l-1 border-r-1" />;
  }

  return (
    <div className="w-full overflow-hidden sectionSep border-border-1 border-l-1 border-r-1">
      <div className="flex justify-center">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square outline-[0.5px] outline-solid outline-border-1 shrink-0
                  w-[calc(100%/8)] 
                  md:w-[calc(100%/16)]"
          />
        ))}
      </div>
    </div>
  );
}
