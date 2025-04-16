import React from 'react';

type InputProps = {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  multiline?: boolean;
  height?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  disabled?: boolean;
};

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  multiline = false,
  height,
  resize = 'none',
  disabled = false
}) => {
  const baseStyles = `
    w-full p-3 text-rg text-foreground-1 placeholder-foreground-3
    bg-background-2 rounded-lg border border-border-1
    focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-offset-[-1px] focus-visible:outline-[var(--foreground-1)]
    hover:border-border-2
    transition duration-[120ms]
  `;

  const textareaStyles = `
    ${baseStyles}
    resize-none
  `;

  const inputStyles = `
    ${baseStyles}
    h-12
  `;

  const style = {
    ...(height ? { height } : { height: '48px' }),
    resize
  };

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={textareaStyles}
        style={{ height, resize }}
        disabled={disabled}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={inputStyles}
      disabled={disabled}
    />
  );
};

export default Input;
