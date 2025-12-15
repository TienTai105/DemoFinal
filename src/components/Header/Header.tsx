// =====================================================
// HEADER COMPONENT
// =====================================================
// Main navigation header with logo, menu, and action icons

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { Search, ShoppingCart, Heart, User, Truck, X } from 'lucide-react';
import { Wishlist } from '../Wishlist/Wishlist';
import './Header.scss';

interface HeaderProps {
  onCartClick?: () => void;
}

/**
 * Header Component
 * Main navigation with:
 * - Logo/Brand name
 * - Navigation menu (Collections, About, Contacts, Shop)
 * - Search, cart, and wishlist icons
 * - Auth links (Login/Register or user menu)
 */
export const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const navigate = useNavigate();
  const { items } = useCartStore();
  const { items: wishlistItems, removeItem } = useWishlistStore();
  const [showWishlist, setShowWishlist] = useState(false);

  const cartCount = items.length;

  const handleWishlistRemove = (id: string) => {
    removeItem(id);
  };

  const handleAddToCart = (id: string) => {
    // TODO: Implement add to cart from wishlist
    navigate(`/product/${id}`);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Left Section - Navigation Menu */}
        <nav className="header-nav-left">
          <Link to="/" className="nav-item">
            Shop
          </Link>
          <Link to="/products" className="nav-item">
            Collections
          </Link>
          <Link to="/about" className="nav-item">
            About
          </Link>
          <Link to="/contact" className="nav-item">
            Contacts
          </Link>
        </nav>

        {/* Center - Logo/Brand */}
        <Link to="/" className="header-logo">
          <span className="logo-text">E-Shop</span>
        </Link>

        {/* Right Section - Action Icons */}
        <div className="header-actions">
          <button className="icon-btn search-btn" title="Search">
            <Search size={20} />
          </button>

          {/* Shipping button */}
          <button
            className="icon-btn shipping-btn"
            onClick={() => navigate('/shipping')}
            title="Shipping & Delivery"
          >
            <Truck size={20} />
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

          <button className="icon-btn wishlist-btn" onClick={() => setShowWishlist(!showWishlist)} title="Wishlist">
            <Heart size={20} fill={wishlistItems.length > 0 ? "currentColor" : "none"} />
            {wishlistItems.length > 0 && <span className="wishlist-badge">{wishlistItems.length}</span>}
          </button>
          <button className="icon-btn user-btn" title="User Account">
            <User size={20} />
          </button>
        </div>
      </div>

      {/* Wishlist Modal */}
      {showWishlist && (
        <div className="wishlist-modal-overlay" onClick={() => setShowWishlist(false)}>
          <div className="wishlist-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="wishlist-close-btn" 
              onClick={() => setShowWishlist(false)}
              title="Close"
            >
              <X size={24} />
            </button>
            <Wishlist 
              items={wishlistItems}
              onRemove={handleWishlistRemove}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      )}
    </header>
  );
};
