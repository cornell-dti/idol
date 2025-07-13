import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import Accordion from '../../../../components/Accordion';

const testAccordions = [
  {
    header: 'What is a design system?',
    content: (
      <p>
        A design system is a collection of reusable components, guidelines, and standards that
        ensure consistency across digital products. It helps teams work faster and more cohesively
        by using shared design language.
      </p>
    ),
    icon: '/apply/roles/design.svg'
  },
  {
    header: 'What is it used for?',
    content: (
      <p>
        Design systems are used to streamline product development. They provide a consistent visual
        and functional experience, reduce repetitive coding, and allow websites to scale
        efficiently.
      </p>
    ),
    icon: '/apply/roles/development.svg'
  },
  {
    header: 'Why make it public?',
    content: (
      <p>
        Since DTI's products are open source, we thought it made sense to make our design system
        public as well. This allows others to learn from our approach, reuse components, and
        contribute improvements — just like with our code.
      </p>
    ),
    icon: '/apply/roles/business.svg'
  }
];

export default function AccordionPage() {
  return (
    <PageLayout title="Accordion">
      <PageSection title="Regular accordion">
        <div className="flex flex-col">
          {testAccordions.map(({ header, content }) => (
            <Accordion key={header} header={header}>
              {content}
            </Accordion>
          ))}
        </div>
      </PageSection>

      <PageSection title="Accordion with icons">
        <div className="flex flex-col">
          {testAccordions.map(({ header, content, icon }) => (
            <Accordion key={header} header={header} icon={icon}>
              {content}
            </Accordion>
          ))}
        </div>
      </PageSection>
    </PageLayout>
  );
}
