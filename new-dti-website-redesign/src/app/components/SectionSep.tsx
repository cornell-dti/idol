type SectionSepProps = {
  grid?: boolean;
};

export default function SectionSep({ grid = false }: SectionSepProps) {
  if (!grid) {
    return <div className="w-full h-16 md:h-32" />;
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="flex justify-center">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square outline-[0.5px] outline-solid outline-border-1 shrink-0
                w-[calc(100%/8)] 
                md:w-[calc(100%/16)] 
                lg:min-w-[74px]"
          />
        ))}
      </div>
    </div>
  );
}
