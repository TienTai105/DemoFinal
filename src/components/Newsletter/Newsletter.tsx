// =====================================================
// NEWSLETTER SECTION COMPONENT
// =====================================================
// Email subscription section with form

import React from 'react';
import { Input } from '../UI/Input/Input';
import { Button } from '../UI/Button/Button';
import { Mail } from 'lucide-react';
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
      setMessage({ type: 'success', text: 'Thanks for subscribing!' });
      setEmail('');
    } catch {
      setMessage({ type: 'error', text: 'Failed to subscribe. Try again.' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <section className="newsletter">
      <div className="newsletter-container">
        <div className="newsletter-content">
          <h2 className="newsletter-title">Join our community</h2>
          <p className="newsletter-description">
            Get exclusive offers, new arrivals, and style tips delivered to your inbox.
          </p>
        </div>

        <form className="newsletter-form" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={18} />}
            disabled={isLoading}
          />
          <Button
            variant="accent"
            size="md"
            type="submit"
            loading={isLoading}
            disabled={isLoading}
          >
            Subscribe
          </Button>
        </form>

        {message && (
          <div className={`newsletter-message newsletter-message-${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
    </section>
  );
};
