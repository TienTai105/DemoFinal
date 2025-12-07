// =====================================================
// PRODUCT CARD COMPONENT - Display single product
// =====================================================
// Reusable card showing product image, price, rating, actions

import React from 'react';
import type { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { Badge } from '../UI/Badge/Badge';
import { Plus, Heart } from 'lucide-react';
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
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product);
  };

  // Calculate discount percentage if on sale
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card">
      {/* Product Image Container */}
      <div className="product-card-image">
        <img src={product.image} alt={product.name} />

        {/* Add to Cart Button - Circular */}
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
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

        {/* Product Name with Wishlist Button */}
        <div className="product-name-row">
          <h3 className="product-name">{product.name}</h3>
          <button className="wishlist-btn" title="Add to Wishlist">
            <Heart size={20} />
          </button>
        </div>

        {/* Product Description */}
        
        <div className="product-price">
          <span className="current-price">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="original-price">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};
