// =====================================================
// INPUT COMPONENT - Reusable form input
// =====================================================
// Usage: <Input type="email" placeholder="Enter email" />

import React from 'react';
import classnames from 'classnames';
import './Input.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string;
  /** Error message */
  error?: string;
  /** Icon inside input */
  icon?: React.ReactNode;
  /** Input has error */
  hasError?: boolean;
}

/**
 * Reusable Input Component
 * Supports labels, error states, and icons
 * Used in forms, search, and filters
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  hasError = !!error,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random()}`;

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={inputId}
          className={classnames('input', { 'input-error': hasError }, className)}
          {...props}
        />
      </div>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};
