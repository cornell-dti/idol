import React from 'react';
import Sidebar from './../../Sidebar';
import PageLayout from '../../PageLayout';

export default function Typography() {
  return (
    <div className="flex">
      <Sidebar />

      <PageLayout title="Typography" description="Guidelines for font usage and hierarchy.">
        <section className="p-12 flex flex-col gap-6">
          <h2>Font Styles</h2>
          <p>Here's how we use different font styles.</p>
        </section>
        <section className="p-12 flex flex-col gap-6">
          <h2>Hierarchy</h2>
          <p>Ensure headings and body text follow a clear visual structure.</p>
        </section>
      </PageLayout>
    </div>
  );
}
