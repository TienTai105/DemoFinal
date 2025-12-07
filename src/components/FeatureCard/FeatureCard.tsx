// =====================================================
// FEATURE CARD COMPONENT
// =====================================================
// Display feature/benefit with icon and text

import React from 'react';
import './FeatureCard.scss';

interface FeatureCardProps {
  /** Feature icon */
  icon: React.ReactNode;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
}

/**
 * Feature Card Component
 * Used to display brand features/benefits
 * Typically shown in rows with multiple features
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
};
