// =====================================================
// HEADER COMPONENT
// =====================================================
// Main navigation header with logo, menu, and action icons

import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { Search, ShoppingCart, Heart, ChevronDown } from 'lucide-react';
import './Header.scss';

interface HeaderProps {
  onCartClick?: () => void;
}

/**
 * Header Component
 * Main navigation with:
 * - Logo/Brand name
 * - Navigation menu (Shop, Collections, About, Contacts)
 * - Search, cart, and wishlist icons
 * - Auth links (Login/Register or user menu)
 */
export const Header: FC<HeaderProps> = ({ onCartClick }) => {
  const { items } = useCartStore();
  const navigate = useNavigate();
  // TODO: Auth functionality to be implemented
  // const { user, logout } = useAuthStore();
  const cartCount = items.length;

  return (
    <header className="header">
      <div className="header-container">
        {/* Left Section - Navigation Menu */}
        <nav className="header-nav-left">
          <Link to="/products" className="nav-item">
            <span className="nav-text">Shop</span>
            <ChevronDown size={16} className="nav-arrow" />
          </Link>
          <Link to="/products" className="nav-item">
            Collections
          </Link>
          <Link to="/" className="nav-item">
            About
          </Link>
          <Link to="/" className="nav-item">
            Contacts
          </Link>
        </nav>

        {/* Center - Logo/Brand */}
        <Link to="/" className="header-logo">
          <span className="logo-text">NHOM_7</span>
        </Link>

        {/* Right Section - Action Icons */}
        <div className="header-actions">
          <button className="icon-btn search-btn" title="Search">
            <Search size={20} />
          </button>
          <button
            className="icon-btn cart-btn"
            onClick={() => {
              if (onCartClick) {
                onCartClick();
              } else {
                navigate('/checkout');
              }
            }}
            title="Shopping Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="icon-btn wishlist-btn" title="Wishlist">
            <Heart size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
