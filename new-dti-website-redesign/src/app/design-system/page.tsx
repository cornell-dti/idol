import { navItems } from './nav.config';
import CardLink from './CardLink';
import Sidebar from './Sidebar';
import PageLayout from './PageLayout';

export default function DesignSystem() {
  const sections = navItems.filter((group) => group.category !== null);

  return (
    <div className="flex h-full">
      <Sidebar />

      <PageLayout
        title="DTI Design System"
        description="Design system for the Digital Tech & Innovation's website."
      >
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
      </PageLayout>
    </div>
  );
}
