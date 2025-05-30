import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import Chip from '../../../../components/Chip';

export default function ChipPage() {
  return (
    <PageLayout title="Chip" description="Guidelines for chip component.">
      <PageSection title="" description="">
        <Chip label="Coming soon" />

        <Chip label="Coming soon" color="red" />

        <Chip label="Coming soon" color="green" />

        <Chip label="Coming soon" color="blue" />

        <Chip label="Coming soon" color="yellow" />

        <Chip label="Coming soon" color="purple" />
      </PageSection>
    </PageLayout>
  );
}
