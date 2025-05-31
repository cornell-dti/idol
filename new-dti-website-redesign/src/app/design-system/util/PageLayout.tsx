import Sidebar from './Sidebar';

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function PageLayout({
  title,
  description,
  children,
  className = ''
}: PageLayoutProps) {
  return (
    <div className="flex mx-auto max-w-[1184px]">
      <Sidebar />

      <main className={`flex-1 !pt-0 ml-[261px] ${className}`} id="main-content">
        <section className="p-12 flex flex-col gap-2">
          <h1>{title}</h1>
          {description && <p className="text-foreground-3 h6">{description}</p>}
        </section>

        {children}
      </main>
    </div>
  );
}
