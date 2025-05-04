import { useId } from 'react';
import type { ReactNode } from 'react';

interface SwitchProps {
  icon: ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string; // For accessibility
}

export default function Switch({ icon, checked = false, onChange, label = 'Toggle' }: SwitchProps) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={`relative inline-flex items-center cursor-pointer w-16 h-8 rounded-full p-1 transition-[background-color] duration-[120ms]
        ${checked ? 'bg-accent-red' : 'bg-background-2 border border-border-1'}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only"
        role="switch"
        aria-checked={checked}
        aria-label={label}
      />
      <span
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 absolute top-1 ${
          checked
            ? 'translate-x-8 bg-foreground-1 text-background-1'
            : 'translate-x-0 bg-border-1 text-foreground-1'
        }`}
      >
        {icon}
      </span>
    </label>
  );
}
