import React from 'react';
import PageLayout from '../../PageLayout';
import PageSection from '../../PageSection';
import Button from '../../../../components/Button';
import IconButton from '../../../../components/IconButton';

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-plus-icon lucide-plus"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </IconButton>
        <IconButton aria-label="Create" variant="secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-plus-icon lucide-plus"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </IconButton>
        <IconButton aria-label="Create" variant="tertiary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-plus-icon lucide-plus"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </IconButton>
      </PageSection>
    </PageLayout>
  );
}
