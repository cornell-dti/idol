import Link from 'next/link';
import React from 'react';
import Sidebar from './../../Sidebar';

export default function Button() {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 !pt-0">
        <section className="p-12 flex flex-col gap-2">
          <h1>BUTTON</h1>
          <p className="text-foreground-3">xxx</p>
        </section>

        <section className="p-12 flex flex-col gap-6">
          <h2>x</h2>
        </section>

        <section className="p-12 flex flex-col gap-6">
          <h2>x</h2>
        </section>
      </main>
    </div>
  );
}
