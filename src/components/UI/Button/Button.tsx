// =====================================================
// BUTTON COMPONENT - Reusable button with variants
// =====================================================
// Usage: <Button variant="primary" size="lg">Click me</Button>

import React from 'react';
import classnames from 'classnames';
import './Button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant style */
  variant?: 'primary' | 'secondary' | 'outline' | 'accent';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width button */
  fullWidth?: boolean;
  /** Button content */
  children: React.ReactNode;
  /** Loading state */
  loading?: boolean;
}

/**
 * Reusable Button Component
 * Supports multiple variants and sizes
 * Primary: Ocean Shadow background
 * Accent: Electric Lime background
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className,
  disabled,
  children,
  ...props
}) => {
  const buttonClasses = classnames(
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    {
      'btn-full-width': fullWidth,
      'btn-loading': loading,
      'btn-disabled': disabled || loading,
    },
    className
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="btn-spinner">⟳</span> : null}
      {children}
    </button>
  );
};
