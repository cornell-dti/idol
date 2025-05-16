import React from 'react';
import PageLayout from '../../PageLayout';
import PageSection from '../../PageSection';
import Button from '../../../../components/Button';
import IconButton from '../../../../components/IconButton';
import { PlusIcon } from '../icon/PlusIcon';

export default function ButtonPage() {
  return (
    <PageLayout title="Button" description="Guidelines for buttons.">
      <PageSection title="Regular button" description="Use for regular buttons">
        <Button label="Apply today" />

        <Button label="Apply" badge="12D 2H" />

        <Button label="Apply today" variant="secondary" />

        <Button label="Apply today" variant="tertiary" />
      </PageSection>

      <PageSection title="Icon button" description="Use when you just need an icon">
        <IconButton aria-label="Create">
          <PlusIcon />
        </IconButton>
        <IconButton aria-label="Create" variant="secondary">
          <PlusIcon />
        </IconButton>
        <IconButton aria-label="Create" variant="tertiary">
          <PlusIcon />
        </IconButton>
      </PageSection>
    </PageLayout>
  );
}
