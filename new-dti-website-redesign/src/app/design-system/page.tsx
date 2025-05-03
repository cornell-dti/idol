import Link from 'next/link';
import React from 'react';
import Sidebar from './Sidebar';

export default function DesignSystem() {
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
        </section>

        <section className="p-12 flex flex-col gap-6">
          <h2>Components</h2>
        </section>
      </main>
    </div>
  );
}
