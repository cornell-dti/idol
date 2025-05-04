import React from 'react';
import Sidebar from '../../Sidebar';
import PageLayout from '../../PageLayout';

export default function Layout() {
  return (
    <div className="flex">
      <Sidebar />

      <PageLayout title="Layout" description="Guidelines for layout.">
        <section className="p-12 flex flex-col gap-6">
          <h2>Layyyyout</h2>
          <p>description</p>
        </section>
        <section className="p-12 flex flex-col gap-6">
          <h2>Layout bruh</h2>
          <p>description</p>
        </section>
      </PageLayout>
    </div>
  );
}
