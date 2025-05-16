interface PageSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function PageSection({ title, description, children }: PageSectionProps) {
  return (
    <section className="p-12 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="h4">{title}</h2>
        {description && <p className="text-foreground-3">{description}</p>}
      </div>

      {children}
    </section>
  );
}
