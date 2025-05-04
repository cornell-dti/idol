import React from 'react';
import Sidebar from '../../Sidebar';
import PageLayout from '../../PageLayout';

export default function Input() {
  return (
    <div className="flex">
      <Sidebar />
      <PageLayout title="Input" description="Guidelines for input.">
        <section className="p-12 flex flex-col gap-6">
          <h2>Input</h2>
          <p>description</p>
        </section>
        <section className="p-12 flex flex-col gap-6">
          <h2>Input</h2>
          <p>description</p>
        </section>
      </PageLayout>
    </div>
  );
}
