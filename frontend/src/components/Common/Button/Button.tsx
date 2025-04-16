import React from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  iconLeft?: boolean;
  iconRight?: boolean;
  variant?: 'default' | 'primary' | 'negative';
};

const Button: React.FC<ButtonProps> = ({
  label,
  disabled = false,
  onClick,
  icon,
  iconLeft = false,
  iconRight = false,
  variant = 'default'
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`${styles['base-styles']} ${styles[variant]} ${disabled ? styles.disabled : ''}`}
  >
    {icon && <span className="icon">{icon}</span>}
    {iconLeft && <span className="icon">{icon}</span>}
    {iconRight && <span className="icon">{icon}</span>}
    {label}
  </button>
);

export default Button;
