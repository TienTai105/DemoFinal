import React, { useState } from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { ConfirmModal } from '../UI/ConfirmModal/ConfirmModal';
import './Wishlist.scss';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistProps {
  items?: WishlistItem[];
  onRemove?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}

export const Wishlist: React.FC<WishlistProps> = ({
  items = [],
  onRemove = () => {},
  onAddToCart = () => {},
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<WishlistItem | null>(null);

  const handleDeleteClick = (item: WishlistItem) => {
    setItemToDelete(item);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onRemove(itemToDelete.id);
      setShowConfirm(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setItemToDelete(null);
  };
  return (
    <div className="wishlist-wrapper">
      <div className="wishlist-header">
        <div className="wishlist-title">
          <Heart size={24} fill="#c41e3a" color="#c41e3a" />
          <h4>My Wishlist</h4>
          <span className="wishlist-count">{items.length} items</span>
        </div>
        
      </div>

      {items.length === 0 ? (
        <div className="empty-wishlist">
          <Heart size={48} color="#ccc" />
          <p>Your wishlist is empty</p>
          <small>Save your favorite items to view them later</small>
        </div>
      ) : (
        <div className="wishlist-items">
          {items.map((item) => (
            <div key={item.id} className="wishlist-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="item-details">
                <h5 className="item-name">{item.name}</h5>
                <p className="item-price">
                  {item.price.toLocaleString('vi-VN')}.000đ
                </p>
              </div>

              <div className="item-actions">
                <button
                  className="btn-add-to-cart"
                  onClick={() => onAddToCart(item.id)}
                  title="Add to cart"
                >
                  <ShoppingCart size={18} />
                </button>
                <button
                  className="btn-remove"
                  onClick={() => handleDeleteClick(item)}
                  title="Remove from wishlist"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirm}
        title="Remove from Wishlist"
        message={itemToDelete ? `Are you sure you want to remove "${itemToDelete.name}" from your wishlist?` : 'Are you sure?'}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Wishlist;
