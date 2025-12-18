import React from 'react';
import './CartDrawer.scss';
import { Cart } from '../Cart/Cart';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div
        className="cart-drawer"
        onClick={(e) => {
          e.stopPropagation();
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="drawer-header">
          <h5>Giỏ Hàng Của Bạn</h5>
          <button className="close-btn" onClick={onClose} aria-label="Đóng">×</button>
        </div>

        <div className="drawer-body">
          <Cart variant="drawer" onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
