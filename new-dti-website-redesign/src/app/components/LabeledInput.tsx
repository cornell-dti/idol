import React from 'react';
import Input from './Input';

type LabeledInputProps = {
  label: string;
  error?: string;
  inputProps: React.ComponentProps<typeof Input>;
};

const LabeledInput: React.FC<LabeledInputProps> = ({ label, error, inputProps }) => {
  const id = React.useId();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="block text-sm font-medium text-foreground-3">
          {label}
        </label>

        <Input {...inputProps} />
      </div>

      {error && <p className="text-accent-red">{error}</p>}
    </div>
  );
};

export default LabeledInput;
