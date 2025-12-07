// =====================================================
// BADGE COMPONENT - Status badges and labels
// =====================================================
// Usage: <Badge variant="accent">New</Badge>

import React from 'react';
import classnames from 'classnames';
import './Badge.scss';

interface BadgeProps {
  /** Badge variant */
  variant?: 'primary' | 'accent' | 'secondary' | 'success' | 'danger';
  /** Badge content */
  children: React.ReactNode;
  /** Custom class */
  className?: string;
}

/**
 * Reusable Badge Component
 * Used for labels, status indicators, tags
 * Example: "New", "Sale", "Limited"
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  children,
  className,
}) => {
  const badgeClasses = classnames(`badge-${variant}`, 'badge', className);

  return <span className={badgeClasses}>{children}</span>;
};
