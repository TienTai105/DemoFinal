// =====================================================
// HOME PAGE
// =====================================================
// Main landing page with hero, category filters, and 4-column product grid

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero/Hero';
import { ProductCard } from '../components/ProductCard/ProductCard';
import './HomePage.scss';

// Category options for filter tabs
const CATEGORIES = ['Men', 'Women', 'Bags', 'Shoes', 'Accessories'];

// Mock product data - clothing and accessories
const ALL_PRODUCTS = [
  {
    id: '1',
    name: 'Core Hoodie',
    description: 'Black / Gray',
    price: 89.00,
    originalPrice: 119.00,
    image: '/images/p_img1.png',
    category: 'Men',
    rating: 5,
    reviews: 234,
    stock: 15,
  },
  {
    id: '2',
    name: 'Essential Tank',
    description: 'White / Black',
    price: 49.00,
    originalPrice: 69.00,
    image: '/images/p_img2.png',
    category: 'Women',
    rating: 4.5,
    reviews: 128,
    stock: 8,
  },
  {
    id: '3',
    name: 'Contrast Tee',
    description: 'Black / White',
    price: 59.00,
    originalPrice: 79.00,
    image: '/images/p_img3.png',
    category: 'Men',
    rating: 4,
    reviews: 89,
    stock: 20,
  },
  {
    id: '4',
    name: 'Base Crop',
    description: 'White',
    price: 44.00,
    originalPrice: 59.00,
    image: '/images/p_img4.png',
    category: 'Women',
    rating: 4.5,
    reviews: 156,
    stock: 5,
  },
  {
    id: '5',
    name: 'Mono Tee',
    description: 'White / Black',
    price: 49.00,
    originalPrice: 69.00,
    image: '/images/p_img5.png',
    category: 'Women',
    rating: 5,
    reviews: 200,
    stock: 12,
  },
  {
    id: '6',
    name: 'Flex Shorts',
    description: 'Black / Gray',
    price: 59.00,
    originalPrice: 79.00,
    image: '/images/p_img6.png',
    category: 'Men',
    rating: 4,
    reviews: 95,
    stock: 18,
  },
  {
    id: '7',
    name: 'Pure Joggers',
    description: 'White',
    price: 79.00,
    originalPrice: 99.00,
    image: '/images/p_img7.png',
    category: 'Men',
    rating: 4.5,
    reviews: 142,
    stock: 10,
  },
  {
    id: '8',
    name: 'Urban Sole',
    description: 'Black / White',
    price: 129.00,
    originalPrice: 169.00,
    image: '/images/p_img8.png',
    category: 'Shoes',
    rating: 5,
    reviews: 267,
    stock: 7,
  },
];

/**
 * HomePage Component
 * Main landing page with:
 * - Full-width hero section with title and badge
 * - Category filter tabs (Men, Women, Bags, Shoes, Accessories)
 * - 4-column product grid
 * - Fully responsive design
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Women');

  const handleViewDetails = (id: string) => {
    navigate(`/product/${id}`);
  };

  // Filter products by active category
  const filteredProducts = ALL_PRODUCTS.filter(
    (product) => product.category === activeCategory
  );

  return (
    <div className="home-page">
      {/* ===== HERO SECTION ===== */}
      <Hero
        title="Define Your Base"
        badgeText="Timeless essentials designed to adapt, layer, and last"
        backgroundImage="/images/banner4.jpg"
      />

      {/* ===== PRODUCTS SECTION ===== */}
      <section className="products-section">
        <div className="products-container">
          {/* Section Header with Category Tabs and Show More - ALL ON ONE LINE */}
          <div className="section-header-row">
            <h2 className="section-title">New Arrivals</h2>

            {/* Category Filter Tabs */}
            <div className="category-tabs">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <a href="#" className="show-more-link">
              Show More →
            </a>
          </div>

          {/* 4-Column Products Grid */}
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
