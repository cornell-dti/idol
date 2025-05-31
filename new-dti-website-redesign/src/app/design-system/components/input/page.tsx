'use client';

import React from 'react';
import PageLayout from '../../util/PageLayout';
import PageSection from '../../util/PageSection';
import Input from '../../../../components/Input';
import LabeledInput from '../../../../components/LabeledInput';

export default function InputPage() {
  return (
    <PageLayout title="Input" description="Guidelines for input.">
      <PageSection title="Regular input" description="Use for regular inputs">
        <Input placeholder="Input placeholder" onChange={() => {}} className="w-128" />

        <Input
          placeholder="Input placeholder"
          onChange={() => {}}
          multiline
          height={256}
          className="w-128"
        />
      </PageSection>

      <PageSection title="Labeled input" description="Use when you need a label with the input">
        <LabeledInput
          className="w-128"
          label="Input label"
          inputProps={{
            onChange: () => {},
            placeholder: 'Input placeholder'
          }}
        />

        <LabeledInput
          className="w-128"
          label="Input label"
          inputProps={{
            onChange: () => {},
            placeholder: 'Input placeholder',
            multiline: true,
            height: 256
          }}
        />
      </PageSection>

      <PageSection
        title="Labeled input with error"
        description="Use when you need a label with the input and an error message"
      >
        <LabeledInput
          className="w-128"
          label="Input label"
          inputProps={{
            onChange: () => {},
            placeholder: 'Input placeholder'
          }}
          error="Input error message"
        />

        <LabeledInput
          className="w-128"
          label="Input label"
          inputProps={{
            onChange: () => {},
            placeholder: 'Input placeholder',
            multiline: true,
            height: 256
          }}
          error="Input error message"
        />
      </PageSection>
    </PageLayout>
  );
}
