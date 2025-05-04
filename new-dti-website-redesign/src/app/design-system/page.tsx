import { navItems } from './nav.config';
import { CardLink } from './CardLink';
import Sidebar from './Sidebar';

export default function DesignSystem() {
  const intro = navItems.find((group) => group.category === null)?.items[0];

  const sections = navItems.filter((group) => group.category !== null);

  return (
    <div className="flex h-full">
      <Sidebar />

      <main className="!pt-0 flex flex-col flex-1">
        <section className="flex flex-col gap-2 p-12">
          <h1>DTI Design System</h1>
          <h5 className="text-foreground-3">
            Design system for the Digital Tech & Innovation's website.
          </h5>
        </section>
        {sections.map((section) => (
          <section key={section.category} className="p-12 flex flex-col gap-6">
            <h2>{section.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item) => (
                <CardLink
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  description={item.description}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
