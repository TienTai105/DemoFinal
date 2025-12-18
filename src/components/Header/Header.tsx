// =====================================================
// HEADER COMPONENT
// =====================================================
// Main navigation header with logo, menu, and action icons

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
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
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const logout = useAuthStore((s) => s.logout);

  const [showWishlist, setShowWishlist] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = React.useRef<HTMLDivElement | null>(null);

  const cartCount = items.length;
  const displayName = user?.username ? user.username : user?.email?.split('@')[0] || '';

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
          <Link to="/home" className="nav-item">
            Cửa Hàng
          </Link>
          <Link to="/collection" className="nav-item">
            Bộ Sưu Tập
          </Link>
          <Link to="/about" className="nav-item">
            Về Chúng Tôi
          </Link>
          <Link to="/contact" className="nav-item">
            Liên Hệ
          </Link>
        </nav>

        {/* Center - Logo/Brand */}
        <Link to="/home" className="header-logo">
          <span className="logo-text">E-Shop</span>
        </Link>

        {/* Right Section - Action Icons */}
        <div className="header-actions">
          <button className="icon-btn search-btn" title="Tìm Kiếm">
            <Search size={20} />
          </button>

          {/* Shipping button */}
          <button
            className="icon-btn shipping-btn"
            onClick={() => navigate('/shipping')}
            title="Vận Chuyển & Giao Hàng"
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
            title="Giỏ Hàng"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <button className="icon-btn wishlist-btn" onClick={() => setShowWishlist(!showWishlist)} title="Danh Sách Yêu Thích">
            <Heart size={20} fill={wishlistItems.length > 0 ? "currentColor" : "none"} />
            {wishlistItems.length > 0 && <span className="wishlist-badge">{wishlistItems.length}</span>}
          </button>

          {user ? (
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button
                className="icon-btn user-btn user-logged-in"
                onClick={() => setShowUserMenu((s) => !s)}
                title={user.username || user.email}
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
            <Link to="/login" className="icon-btn user-btn" title="Đăng Nhập">
              <User size={20} />
            </Link>
          )}
        </div>
      </div>

      {/* Wishlist Modal */}
      {showWishlist && (
        <div className="wishlist-modal-overlay" onClick={() => setShowWishlist(false)}>
          <div className="wishlist-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="wishlist-close-btn" 
              onClick={() => setShowWishlist(false)}
              title="Đóng"
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
