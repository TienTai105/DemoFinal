// =====================================================
// FOOTER COMPONENT
// =====================================================
// Main footer with links, info, and social media

import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import './Footer.scss';

/**
 * Footer Component
 * Displays company info, links, and social media
 * Consistent with design color scheme (Ocean Shadow background)
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Grid */}
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-column">
            <h4 className="footer-brand">NHOM_7</h4>
            <p className="footer-description">
              Discover timeless essentials that move with you. Quality, style, and sustainability in every piece.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="footer-column">
            <h5 className="footer-column-title">Shop</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Collections</Link></li>
              <li><a href="#new-arrivals">New Arrivals</a></li>
              <li><a href="#sale">Sale</a></li>
              <li><a href="#gift-cards">Gift Cards</a></li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="footer-column">
            <h5 className="footer-column-title">Customer Care</h5>
            <ul className="footer-links">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/shipping">Shipping & Delivery</Link></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#size-guide">Size Guide</a></li>
              <li><a href="#returns">Returns & Exchange</a></li>
            </ul>
          </div>

          {/* Brand Column */}
          <div className="footer-column">
            <h5 className="footer-column-title">About</h5>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><a href="#sustainability">Sustainability</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#press">Press</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="footer-column">
            <h5 className="footer-column-title">Legal</h5>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
              <li><a href="#accessibility">Accessibility</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Divider */}
        <hr className="footer-divider" />

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} NHOM_7. All rights reserved.
          </p>
          <div className="payment-methods">
            <span>Payment Methods:</span>
            <div className="payment-icons">
              <span className="payment-icon">💳</span>
              <span className="payment-icon">🏦</span>
              <span className="payment-icon">💰</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
