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
              Khám phá những bộ sưu tập cơ bản mang tính thời vượt thời gian. Chất lượng, phong cách và tính bền vững trong mỗi sản phẩm.
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
            <h5 className="footer-column-title">Cửa Hàng</h5>
            <ul className="footer-links">
              <li><Link to="/">Trang Chủ</Link></li>
              <li><Link to="/products">Bộ Sưu Tập</Link></li>
              <li><a href="#new-arrivals">Hàng Mới</a></li>
              <li><a href="#sale">Khuyến Mãi</a></li>
              <li><a href="#gift-cards">Thẻ Quà Tặng</a></li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="footer-column">
            <h5 className="footer-column-title">Hỗ Trợ Khách Hàng</h5>
            <ul className="footer-links">
              <li><Link to="/contact">Liên Hệ Chúng Tôi</Link></li>
              <li><Link to="/shipping">Vận Chuyển & Giao Hàng</Link></li>
              <li><a href="#faq">Câu Hỏi Thường Gặp</a></li>
              <li><a href="#size-guide">Hướng Dẫn Kích Cỡ</a></li>
              <li><a href="#returns">Hoàn Trả & Đổi Trả</a></li>
            </ul>
          </div>

          {/* Brand Column */}
          <div className="footer-column">
            <h5 className="footer-column-title">Về Chúng Tôi</h5>
            <ul className="footer-links">
              <li><Link to="/about">Thông Tin Về Chúng Tôi</Link></li>
              <li><a href="#sustainability">Tính Bền Vững</a></li>
              <li><a href="#careers">Công Việc</a></li>
              <li><a href="#press">Báo Chí</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="footer-column">
            <h5 className="footer-column-title">Pháp Lý</h5>
            <ul className="footer-links">
              <li><a href="#privacy">Chính Sách Bảo Mật</a></li>
              <li><a href="#terms">Điều Khoản Dịch Vụ</a></li>
              <li><a href="#cookies">Chính Sách Cookie</a></li>
              <li><a href="#accessibility">Khả Năng Truy Cập</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Divider */}
        <hr className="footer-divider" />

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} NHOM_7. Tất cả các quyền được bảo lưu.
          </p>
          <div className="payment-methods">
            <span>Phương Thức Thanh Toán:</span>
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
