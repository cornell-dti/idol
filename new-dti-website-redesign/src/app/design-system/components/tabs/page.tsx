'use client';

import React from 'react';
import Image from 'next/image';

import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import Tabs from '../../../../components/Tabs';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';
import FancyTabs from '../../../../components/FancyTabs/FancyTabs';
import Note from '../../util/Note';

export default function TabsPage() {
  return (
    <PageLayout title="Tabs">
      <PageSection
        title="Regular tabs"
        description="Used as default tabs component to organize content in compact spaces."
      >
        <Tabs
          tabs={[
            {
              label: 'Light theme',
              content: (
                <div
                  className="bg-white flex items-center justify-center flex-col gap-2 w-fill h-48 p-8 rounded-lg mx-l"
                  tabIndex={0}
                >
                  <h3 className="h4 text-black">Fresh and clean</h3>

                  <p className="text-black text-center max-w-100">
                    Perfect for daytime work and bright environments. But devs watch out – light
                    attracts bugs!
                  </p>
                </div>
              )
            },
            {
              label: 'Dark theme',
              content: (
                <div className="bg-black flex items-center justify-center flex-col gap-2 w-fill h-48 p-8 rounded-lg mx-8">
                  <h3 className="h4 text-white">Midnight mode</h3>

                  <p className="text-white text-center max-w-100">
                    Dark mode reduces eye strain in dim settings and (supposedly) can save some
                    battery life. Plus, it adds a sleek, modern vibe to your workspace when the
                    lights go down.
                  </p>
                </div>
              )
            },
            {
              label: 'Hotdog stand theme',
              content: (
                <div className="bg-[#E93323] flex items-center justify-center flex-col gap-2 w-fill h-48 p-8 rounded-lg mx-8">
                  <h3 className="h4 text-[#FFFF54]">The wildcard</h3>

                  <p className="text-[#FFFF54] text-center max-w-100">
                    Inspired by the bold yellows and reds of a classic hotdog stand, this theme is
                    all about fun, energy, and a bit of crazy.
                  </p>
                </div>
              )
            }
          ]}
        />
      </PageSection>

      <PageSection
        title="Fancy tabs"
        description="A visually enhanced tab variant that is meant to literally ressemble folder tabs."
      >
        <Note
          inner={
            <p>
              Use FancyTabs when the tabbed content mimics a structured workspace or programming
              environment.
            </p>
          }
        />

        <FancyTabs
          className="w-150"
          tabs={[
            {
              label: 'HTML',
              content: (
                <div
                  className="flex flex-col gap-2 h-96 bg-background-2 p-8 focusState"
                  tabIndex={0}
                >
                  <h3 className="h4">The bones of a website</h3>

                  <p>
                    HTML (HyperText Markup Language) gives structure to everything on the web —
                    buttons, headings, paragraphs, inputs.
                  </p>
                </div>
              )
            },
            {
              label: 'CSS',
              content: (
                <div className="flex flex-col gap-2 h-96 bg-background-2 p-8">
                  <h3 className="h4">The clothes of a website</h3>

                  <p>
                    CSS (Cascading Style Sheets) makes things beautiful — layout, color, spacing,
                    animations.
                  </p>
                </div>
              )
            },
            {
              label: 'JS',
              content: (
                <div
                  className="flex flex-col gap-2 h-96  bg-background-2 p-8 focusState"
                  tabIndex={0}
                >
                  <h3 className="h4">The muscles & brain of a website</h3>
                  <p>
                    JavaScript brings interactivity. It's what powers modals, tabs, accordions, and
                    all the reactive bits.
                  </p>
                </div>
              )
            }
          ]}
        />
      </PageSection>
    </PageLayout>
  );
}
