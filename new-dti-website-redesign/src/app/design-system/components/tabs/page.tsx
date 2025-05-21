'use client';

import React from 'react';
import Image from 'next/image';

import PageLayout from '../../PageLayout';
import PageSection from '../../PageSection';
import Tabs from '../../../../components/Tabs';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';

export default function TabsPage() {
  return (
    <PageLayout title="Tabs" description="Guidelines for tabs component.">
      <PageSection title="" description="">
        <Tabs
          tabs={[
            {
              label: 'Tab 1',
              content: (
                <div className="w-128 h-128 bg-accent-blue p-8 focusState" tabIndex={0}>
                  <h3>Tab panel 1</h3>

                  <p>A lovely tab 1 with just an image</p>

                  <Image src="/clem.jpg" alt="Clément's pic" width={128} height={128} />
                </div>
              )
            },
            {
              label: 'Tab 2',
              content: (
                <div className="w-128 h-128 bg-accent-yellow p-8">
                  <h3>Tab panel 2</h3>

                  <p>A lovely tab 2 with interactive elements</p>

                  <Input placeholder="Input placeholder" onChange={() => {}} className="w-64" />

                  <Button label="Hey hey" variant="secondary" />
                </div>
              )
            },
            {
              label: 'Tab 3',
              content: (
                <div className="w-128 h-128 bg-accent-red p-8 focusState" tabIndex={0}>
                  <h3>Tab panel 3</h3>
                  <p className="small caps">helloooo</p>
                </div>
              )
            }
          ]}
        />
      </PageSection>
    </PageLayout>
  );
}
