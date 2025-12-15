// =====================================================
// NEWSLETTER SECTION COMPONENT
// =====================================================
// Email subscription section with form

import React from 'react';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';
import './Newsletter.scss';

interface NewsletterProps {
  /** Callback when form is submitted */
  onSubscribe?: (email: string) => void;
}

/**
 * Newsletter Component
 * Email subscription section
 * Appears before footer with CTA
 */
export const Newsletter: React.FC<NewsletterProps> = ({ onSubscribe }) => {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: 'error', text: 'Please enter an email address' });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSubscribe?.(email);
      setMessage({ type: 'success', text: '✓ Thanks for subscribing!' });
      setEmail('');
    } catch {
      setMessage({ type: 'error', text: 'Failed to subscribe. Try again.' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <section className="newsletter" data-aos="zoom-in">
      <div className="newsletter-container">
        <div className="newsletter-content">
          {/* Left Section */}
          <div className="newsletter-text">
            <div className="newsletter-badge">
              <Sparkles size={16} />
              <span>Exclusive Perks</span>
            </div>
            <h2 className="newsletter-headline">Stay in the Loop</h2>
            <p className="newsletter-description">
              Get exclusive drops, early access to new collections, insider style tips, and special discounts delivered straight to your inbox.
            </p>
            <ul className="newsletter-benefits">
              <li>Early access to new drops</li>
              <li>Exclusive member-only discounts</li>
              <li>Curated style tips & trends</li>
            </ul>
          </div>

          {/* Right Section */}
          <div className="newsletter-form-wrapper">
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <div className="email-input-wrapper">
                <Mail size={20} />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Subscribing...' : 'Subscribe'}
                <ArrowRight size={18} />
              </button>
              <div className="newsletter-form-footer">
                {isLoading && <div className="newsletter-loading">Processing your request...</div>}
                {message && (
                  <div className={`newsletter-message newsletter-message-${message.type}`}>
                    {message.text}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
