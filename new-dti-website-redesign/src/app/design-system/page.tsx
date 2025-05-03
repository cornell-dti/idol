import Link from 'next/link';
import React from 'react';
import Sidebar from './Sidebar';
import { CardLink } from './CardLink'; // Ensure this path is correct

export default function DesignSystem() {
  const styles = [
    {
      href: '/design-system/color',
      title: 'Color',
      description: 'Usage, tokens, and accessibility.'
    },
    {
      href: '/design-system/typography',
      title: 'Typography',
      description: 'Font styles, weights, hierarchy.'
    },
    {
      href: '/design-system/layout',
      title: 'Layout',
      description: 'Grids, spacing, and structure.'
    }
  ];

  const components = [
    {
      href: '/design-system/button',
      title: 'Button',
      description: 'Primary, secondary, icon buttons.'
    },
    {
      href: '/design-system/input',
      title: 'Input',
      description: 'Forms, fields, and validations.'
    },
    { href: '/design-system/card', title: 'Card', description: 'Containers for content.' }
  ];

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 !pt-0">
        <section className="p-12 flex flex-col gap-2">
          <h1>Introduction</h1>
          <p className="text-foreground-3">
            Design system for the Digital Tech & Innovation's website.
          </p>
        </section>

        <section className="p-12 flex flex-col gap-6">
          <h2>Styles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {styles.map(({ href, title, description }) => (
              <CardLink key={href} href={href} title={title} description={description} />
            ))}
          </div>
        </section>

        <section className="p-12 flex flex-col gap-6">
          <h2>Components</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {components.map(({ href, title, description }) => (
              <CardLink key={href} href={href} title={title} description={description} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
