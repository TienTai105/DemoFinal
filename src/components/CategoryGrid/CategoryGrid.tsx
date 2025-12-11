import React from 'react';
import { ChevronRight } from 'lucide-react';
import './CategoryGrid.scss';

interface CategoryItem {
  id: string;
  image: string;
  title: string;
  count?: number;
  link?: string;
}

interface CategoryGridProps {
  items: CategoryItem[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ items }) => {
  return (
    <div className="category-grid">
      {items.map((category) => (
        <div key={category.id} className="category-card">
          <div className="category-image">
            <img src={category.image} alt={category.title} loading="lazy" />
            <div className="category-overlay">
              <a href={category.link || '#'} className="shop-now-btn">
                Shop Now
                <ChevronRight size={18} />
              </a>
            </div>
          </div>
          <div className="category-content">
            <h3 className="category-title">{category.title}</h3>
            {category.count && (
              <p className="category-count">{category.count} items</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
