type SectionTitleProps = {
  heading: string;
  subheading?: string;
};

export default function SectionTitle({ heading, subheading }: SectionTitleProps) {
  return (
    <div className="w-full flex flex-col gap-2 p-8 sectionStyles">
      <h2>{heading}</h2>

      <p className="text-foreground-3">{subheading}</p>
    </div>
  );
}
