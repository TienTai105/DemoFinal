// =====================================================
// SECTION HEADER COMPONENT
// =====================================================
// Reusable section header with title, subtitle, and action

import React from 'react';
import './SectionHeader.scss';

interface SectionHeaderProps {
  /** Section title */
  title: string;
  /** Section subtitle */
  subtitle?: string;
  /** Right-side content/action link */
  action?: React.ReactNode;
}

/**
 * Section Header Component
 * Consistent header for product sections, categories, etc.
 * Displays title, optional subtitle, and action button/link
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
}) => {
  return (
    <div className="section-header">
      <div className="section-header-content">
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="section-action">{action}</div>}
    </div>
  );
};
