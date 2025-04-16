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
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-foreground-3">
        {label}
      </label>

      <Input {...inputProps} />

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default LabeledInput;
