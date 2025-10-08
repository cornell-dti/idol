import React, { useRef } from 'react';
import styles from './Input.module.css';
import useKeyboardShortcut from '../../../hooks/useKeyboardShortcut';

type InputProps = {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  multiline?: boolean;
  maxHeight?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  disabled?: boolean;
};

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  multiline = false,
  maxHeight,
  resize = 'none',
  disabled = false
}) => {
  const style = {
    ...(maxHeight ? { maxHeight } : { height: 48 }),
    resize
  };
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useKeyboardShortcut(
    'Escape',
    () => {
      ref.current?.blur();
    },
    {},
    { captureInInputs: true }
  );

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.input}
        style={style}
        disabled={disabled}
        ref={ref as unknown as React.RefObject<HTMLTextAreaElement>}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={styles.input}
      style={style}
      disabled={disabled}
      ref={ref as unknown as React.RefObject<HTMLInputElement>}
    />
  );
};

export default Input;
