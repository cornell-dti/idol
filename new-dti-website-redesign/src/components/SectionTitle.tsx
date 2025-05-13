type SectionTitleProps = {
  heading: string;
  subheading?: string;
  smallCaps?: boolean;
};

export default function SectionTitle({ heading, subheading, smallCaps }: SectionTitleProps) {
  return (
    <div className="w-full flex flex-col gap-2 p-8 sectionStyles">
      {smallCaps ? (
        <p className="caps text-center text-foreground-3">{heading}</p>
      ) : (
        <>
          <h2>{heading}</h2>
          <p className="text-foreground-3">{subheading}</p>
        </>
      )}
    </div>
  );
}
