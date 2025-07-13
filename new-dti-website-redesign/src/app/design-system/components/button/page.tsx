import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import Button from '../../../../components/Button';
import IconButton from '../../../../components/IconButton';
import PlusIcon from '../../../../components/icons/PlusIcon';
import Note from '../../util/Note';

export default function ButtonPage() {
  return (
    <PageLayout title="Button">
      <PageSection
        title="Default button"
        description="Has a label and an optional chip inside."
        className="gap-12"
      >
        <div className="flex gap-8">
          <div className="flex flex-col gap-6">
            <Button label="Apply today" />
            <Button label="Apply today" size="small" />
          </div>

          <div className="flex flex-col gap-6">
            <Button label="Apply" chip="12D 2H" chipColor="gray" />
            <Button label="Apply" size="small" chip="12D 2H" chipColor="gray" />
          </div>

          <div className="flex flex-col gap-6">
            <Button label="Apply today" variant="secondary" />
            <Button label="Apply today" variant="secondary" size="small" />
          </div>

          <div className="flex flex-col gap-6">
            <Button label="Apply today" variant="tertiary" />
            <Button label="Apply today" variant="tertiary" size="small" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Note text="The transparent variant is used when the button is on top of an image, like in the CTA page section" />

          <div className="flex w-100 h-50 items-center justify-center bg-[url(/CtaSection.jpg)] bg-no-repeat bg-center bg-cover">
            <Button label="Apply today" variant="transparent" />
          </div>
        </div>
      </PageSection>

      <PageSection title="Icon button" description="Use when you just need an icon.">
        <Note text="Remember to add the aria-label prop to specific alt text for the icon button." />

        <div className="flex gap-8">
          <div className="flex flex-col gap-6">
            <IconButton aria-label="Create">
              <PlusIcon />
            </IconButton>

            <IconButton aria-label="Create" size="small">
              <PlusIcon />
            </IconButton>
          </div>

          <div className="flex flex-col gap-6">
            <IconButton aria-label="Create" variant="secondary">
              <PlusIcon />
            </IconButton>

            <IconButton aria-label="Create" variant="secondary" size="small">
              <PlusIcon />
            </IconButton>
          </div>

          <div className="flex flex-col gap-6">
            <IconButton aria-label="Create" variant="tertiary">
              <PlusIcon />
            </IconButton>

            <IconButton aria-label="Create" variant="tertiary" size="small">
              <PlusIcon />
            </IconButton>
          </div>
        </div>
      </PageSection>
    </PageLayout>
  );
}
