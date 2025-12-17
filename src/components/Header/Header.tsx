// =====================================================
// HEADER COMPONENT
// =====================================================
// Main navigation header with logo, menu, and action icons

<<<<<<< HEAD
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { Search, ShoppingCart, Heart, User, Truck, X } from 'lucide-react';
import { Wishlist } from '../Wishlist/Wishlist';
=======
import type { FC } from 'react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { Search, ShoppingCart, Heart, ChevronDown, User } from 'lucide-react';
>>>>>>> 9477c6c8ca48db074ed2be7dca061b76656658cf
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
<<<<<<< HEAD
 * - Navigation menu (Collections, About, Contacts, Shop)
=======
 * - Navigation menu (Shop with dropdown, Collections, About, Contacts)
>>>>>>> 9477c6c8ca48db074ed2be7dca061b76656658cf
 * - Search, cart, and wishlist icons
 * - Auth links (Login/Register or user menu)
 */
export const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const navigate = useNavigate();
  const { items } = useCartStore();
<<<<<<< HEAD
  const { items: wishlistItems, removeItem } = useWishlistStore();
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const logout = useAuthStore((s) => s.logout);

  const [showWishlist, setShowWishlist] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = React.useRef<HTMLDivElement | null>(null);
=======
  const [showDropdown, setShowDropdown] = useState(false);
>>>>>>> 9477c6c8ca48db074ed2be7dca061b76656658cf

  const cartCount = items.length;
  const displayName = user?.email ? user.email.split('@')[0] : user?.name || '';

  const handleWishlistRemove = (id: string) => {
    removeItem(id);
  };

  const handleAddToCart = (id: string) => {
    // TODO: Implement add to cart from wishlist
    navigate(`/product/${id}`);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCategoryClick = (category: string) => {
    setShowDropdown(false);
    navigate(`/?category=${category}`);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Left Section - Navigation Menu */}
        <nav className="header-nav-left">
<<<<<<< HEAD
          <Link to="/" className="nav-item">
            Shop
          </Link>
=======
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

>>>>>>> 9477c6c8ca48db074ed2be7dca061b76656658cf
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
<<<<<<< HEAD

          {user ? (
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button
                className="icon-btn user-btn user-logged-in"
                onClick={() => setShowUserMenu((s) => !s)}
                title={user.email || user.name}
                aria-expanded={showUserMenu}
              >
                <span className="user-name">{displayName}</span>
              </button>

              {showUserMenu && (
                <div className="dropdown-menu-portal user-dropdown" role="menu">
                  <ul>
                    <li><Link to="/orders" onClick={() => setShowUserMenu(false)}>Đơn hàng của tôi</Link></li>
                    <li><Link to="/profile" onClick={() => setShowUserMenu(false)}>Tài khoản</Link></li>
                    {isAdmin && <li><Link to="/admin" onClick={() => setShowUserMenu(false)}>Trang quản trị</Link></li>}
                    <li><button className="logout-btn" onClick={handleLogout}>Đăng xuất</button></li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="icon-btn user-btn" title="Login">
              <User size={20} />
            </Link>
          )}
=======
          <button className="icon-btn user-btn" title="User Account">
            <User size={20} />
          </button>
>>>>>>> 9477c6c8ca48db074ed2be7dca061b76656658cf
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
