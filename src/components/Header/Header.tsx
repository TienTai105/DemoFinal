// =====================================================
// HEADER COMPONENT
// =====================================================
// Main navigation header with logo, menu, and action icons

import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import {
  Search,
  ShoppingCart,
  Heart,
  ChevronDown,
  Truck
} from 'lucide-react';
import './Header.scss';

interface HeaderProps {
  onCartClick?: () => void;
}

/**
 * Header Component
 * Main navigation with:
 * - Logo/Brand name
 * - Navigation menu (Shop, Collections, About, Contacts)
 * - Search, cart, wishlist, and shipping icons
 */
export const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { items } = useCartStore();
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
          <span className="logo-text">drop.code</span>
        </Link>

        {/* Right Section - Action Icons */}
        <div className="header-actions">
          <button className="icon-btn search-btn" title="Search">
            <Search size={20} />
          </button>

          {/* Shipping button */}
          <Link
            to="/shipping"
            className="icon-btn shipping-btn"
            title="Shipping & Delivery"
          >
            <Truck size={20} />
          </Link>

          <button
            className="icon-btn cart-btn"
            onClick={onCartClick}
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
