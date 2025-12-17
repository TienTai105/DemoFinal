// =====================================================
// PRODUCT CARD COMPONENT - Display single product
// =====================================================
// Reusable card showing product image, price, rating, actions

import React from 'react';
import type { Product } from '../../types';
import { Badge } from '../UI/Badge/Badge';
import { Plus, Heart } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import './ProductCard.scss';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (id: string) => void;
}

/**
 * Product Card Component
 * Displays product with:
 * - Product image
 * - Price (with original price if on sale)
 * - Star rating
 * - Stock status
 * - Add to cart button
 * 
 * Design from component wireframe with Electric Lime accents
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const handleCardClick = () => {
    onViewDetails?.(product.id);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering card click
    const rawImage = Array.isArray(product.image) ? product.image[0] : product.image;
    const imageUrl = rawImage?.startsWith('http') ? rawImage : `/images${rawImage}`;
    
    if (inWishlist) {
      removeItem(product.id);
    } else {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: imageUrl,
      });
    }
  };


  // Handle image - support both string and array
  const rawImage = Array.isArray(product.image) ? product.image[0] : product.image;
  // Support both absolute URLs and relative paths
  const productImage = rawImage?.startsWith('http') ? rawImage : `/images${rawImage}`;

  // Calculate discount percentage if on sale
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      {/* Product Image Container */}
      <div className="product-card-image">
        <img src={productImage} alt={product.name} />

        {/* Add to Cart Button - Circular */}
        <button
          className="add-to-cart-btn"
          disabled={product.stock !== undefined && product.stock === 0}
          title="Add to Cart"
        >
          <Plus size={24} />
        </button>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <Badge variant="accent" className="discount-badge">
            -{discountPercent}%
          </Badge>
        )}

        {/* Stock Status */}
        {product.stock === 0 && (
          <div className="out-of-stock-overlay">
            <span>Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-card-body">
        {/* Product Category */}
        <span className="product-category">{product.category}</span>

        {/* Product Name with Wishlist Button and Price */}
        <div className="product-info-row">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-right">
            <button 
              className={`wishlist-btn ${inWishlist ? 'active' : ''}`} 
              onClick={handleWishlistClick}
              title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />

            </button>
            <div className="product-price">
              <span className="current-price">{product.price.toLocaleString('vi-VN')}.000đ</span>
              {product.originalPrice && (
                <span className="original-price">{product.originalPrice.toLocaleString('vi-VN')}.000đ</span>
              )}
            </div>
          </div>
        </div>

        {/* Product Description */}
      </div>
    </div>
  );
};
