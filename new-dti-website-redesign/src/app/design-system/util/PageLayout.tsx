import Sidebar from './Sidebar';
import navItems from './nav.config';

function getDescriptionByTitle(title: string): string | undefined {
  const allNavItems = navItems.flatMap((group) => group.items);
  return allNavItems.find((item) => item.label === title)?.description;
}

interface PageLayoutProps {
  title: string;
  explicitDescription?: string;
  children: React.ReactNode;
  className?: string;
}

export default function PageLayout({
  title,
  explicitDescription,
  children,
  className = ''
}: PageLayoutProps) {
  const description = getDescriptionByTitle(title);

  return (
    <div className="flex mx-auto max-w-[1184px]">
      <Sidebar />

      <main className={`flex-1 !pt-0 ${className}`} id="main-content">
        <section className="p-6 pt-20 md:p-12 flex flex-col gap-2 pageLayout">
          <h1>{title}</h1>
          {description && <p className="text-foreground-3 h6">{description}</p>}

          {explicitDescription && <p className="text-foreground-3 h6">{explicitDescription}</p>}
        </section>

        {children}
      </main>
    </div>
  );
}
