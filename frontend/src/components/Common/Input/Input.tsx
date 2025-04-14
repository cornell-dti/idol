import React from 'react';
import styles from './Input.module.css';

type InputProps = {
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  multiline?: boolean;
  maxHeight?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
};

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  multiline = false,
  maxHeight,
  resize = 'none'
}) => {
  const style = {
    ...(maxHeight ? { maxHeight } : { height: 48 }),
    resize
  };

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.input}
        style={style}
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
    />
  );
};

export default Input;
