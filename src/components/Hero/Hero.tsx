// =====================================================
// HERO SECTION COMPONENT
// =====================================================
// Large banner at top of homepage with image and CTA

import React from 'react';
import { Zap } from 'lucide-react';
import './Hero.scss';

interface HeroProps {
  /** Hero title */
  title: string;
  /** Hero subtitle */
  subtitle?: string;
  /** Background image URL */
  backgroundImage?: string;
  /** Icon badge text (optional) */
  badgeText?: string;
}

/**
 * Hero Section Component
 * Full-width banner with image, title, subtitle, and Electric Lime badge
 * Used at top of homepage for brand/campaign promotion
 */
export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  backgroundImage,
  badgeText = 'Timeless essentials designed to adapt, layer, and last',
}) => {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">{title}</h1>
          {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        </div>
        <div className="hero-badge">
          <Zap size={20} />
          <span>{badgeText}</span>
        </div>
      </div>
    </section>
  );
};
