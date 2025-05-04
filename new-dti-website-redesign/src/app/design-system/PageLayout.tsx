import Sidebar from './Sidebar';

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, description, children }: PageLayoutProps) {
  return (
    <div className="flex flex-1">
      <Sidebar />

      <main className="flex-1 !pt-0 ml-[261px]">
        <section className="p-12 flex flex-col gap-2">
          <h1>{title}</h1>
          {description && <p className="text-foreground-3">{description}</p>}
        </section>

        {children}
      </main>
    </div>
  );
}
