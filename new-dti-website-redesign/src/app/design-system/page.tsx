import navItems, { NavGroup } from './util/nav.config';
import CardLink from './util/CardLink';
import PageLayout from './util/PageLayout';
import PageSection from './util/PageSection';

export default function DesignSystem() {
  const sections = navItems.filter(
    (group): group is NavGroup & { category: string } => group.category !== null
  );

  return (
    <PageLayout
      title="DTI Design System"
      description="Design system for the Digital Tech & Innovation's website."
    >
      {sections.map((section) => (
        <PageSection key={section.category} title={section.category}>
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
        </PageSection>
      ))}
    </PageLayout>
  );
}
