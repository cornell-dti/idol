import React from 'react';
import styles from './Button.module.css'; // Import the CSS file

type ButtonProps = {
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'negative';
};

const Button: React.FC<ButtonProps> = ({
  label,
  disabled = false,
  onClick,
  icon,
  variant = 'default',
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`${styles['custom-button']} ${styles[variant]} ${disabled ? styles.disabled : ''}`}
  >
    {icon && <span className="icon">{icon}</span>}
    {label}
  </button>
);

export default Button;
