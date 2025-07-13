import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import Chip from '../../../../components/Chip';
import Note from '../../util/Note';

export default function ChipPage() {
  return (
    <PageLayout title="Chip">
      <PageSection title="" description="" className="h-200">
        <Note
          inner={
            <p>
              The gray variant for Chip is used specifically when paired with primary variant of
              Button.
            </p>
          }
        />

        <Chip label="Default pill" />

        <div className="bg-foreground-1 p-4 w-fit">
          <Chip label="12d 2h" color="gray" />
        </div>

        <Chip label="Full DTI team" color="red" />

        <Chip label="Lead (steering the ship)" color="pink" />

        <Chip label="Developer (bug hunter)" color="green" />

        <Chip label="Designer (Figma overlord)" color="blue" />

        <Chip label="Business (KPI collector)" color="yellow" />

        <Chip label="Product Manager (scope sorcerer)" color="purple" />
      </PageSection>
    </PageLayout>
  );
}
