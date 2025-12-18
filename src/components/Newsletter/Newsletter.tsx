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
      setMessage({ type: 'error', text: 'Vui lòng nhập địa chỉ email' });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSubscribe?.(email);
      setMessage({ type: 'success', text: '✓ Cảm ơn bạn đã đăng ký!' });
      setEmail('');
    } catch {
      setMessage({ type: 'error', text: 'Không thể đăng ký. Vui lòng thử lại.' });
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
              <span>Ưu Đãi Độc Quyền</span>
            </div>
            <h2 className="newsletter-headline">Cập Nhật Tin Tức</h2>
            <p className="newsletter-description">
              Nhận những sản phẩm độc quyền, truy cập sớm vào bộ sưu tập mới, mẹo kiểu tươi mới và giảm giá đặc biệt gửi trực tiếp đến inbox của bạn.
            </p>
            <ul className="newsletter-benefits">
              <li>Truy cập sớm vào sản phẩm mới</li>
              <li>Giảm giá độc quyền chỉ cho thành viên</li>
              <li>Mẹo kiểu trang & xu hướng</li>
            </ul>
          </div>

          {/* Right Section */}
          <div className="newsletter-form-wrapper">
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <div className="email-input-wrapper">
                <Mail size={20} />
                <input
                  type="email"
                  placeholder="email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Đang Đăng Ký...' : 'Đăng Ký'}
                <ArrowRight size={18} />
              </button>
              <div className="newsletter-form-footer">
                {isLoading && <div className="newsletter-loading">Xử lý yêu cầu của bạn...</div>}
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
