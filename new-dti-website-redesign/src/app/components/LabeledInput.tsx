import React from 'react';
import Input from './Input';

type LabeledInputProps = {
  label: string;
  error?: string;
  inputProps: React.ComponentProps<typeof Input>;
  className?: string;
};

const LabeledInput: React.FC<LabeledInputProps> = ({ label, error, inputProps, className }) => {
  const id = React.useId();
  const errorId = `${id}-error`;

  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="block text-sm font-medium text-foreground-3">
          {label}
        </label>

        <Input
          id={id}
          aria-invalid={!!error}
          ariaDescribedby={error ? errorId : undefined}
          {...inputProps}
        />
      </div>

      {error && (
        <p className="text-accent-red" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
};

export default LabeledInput;
