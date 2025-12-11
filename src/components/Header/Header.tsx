// =====================================================
// HEADER COMPONENT
// =====================================================
// Main navigation header with logo, menu, and action icons

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { Search, ShoppingCart, Heart, ChevronDown, User } from 'lucide-react';
import './Header.scss';

interface HeaderProps {
  onCartClick?: () => void;
}

// Main categories
const MAIN_CATEGORIES = [
  { name: 'Men', icon: '👔' },
  { name: 'Women', icon: '👗' },
  { name: 'Kids', icon: '👶' },
  { name: 'Baby', icon: '🍼' },
];

/**
 * Header Component
 * Main navigation with:
 * - Logo/Brand name
 * - Navigation menu (Shop with dropdown, Collections, About, Contacts)
 * - Search, cart, and wishlist icons
 * - Auth links (Login/Register or user menu)
 */
export const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const navigate = useNavigate();
  const { items } = useCartStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const cartCount = items.length;

  const handleCategoryClick = (category: string) => {
    setShowDropdown(false);
    navigate(`/?category=${category}`);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Left Section - Navigation Menu */}
        <nav className="header-nav-left">
          {/* Shop Dropdown */}
          <div className="nav-dropdown">
            <button 
              className="nav-item shop-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="nav-text">Shop</span>
              <ChevronDown size={16} className="nav-arrow" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="dropdown-menu-portal">
                <div className="dropdown-content">
                  {MAIN_CATEGORIES.map((category) => (
                    <button
                      key={category.name}
                      className="dropdown-item"
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <span className="dropdown-item-title">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

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
          <button className="icon-btn user-btn" title="User Account">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
