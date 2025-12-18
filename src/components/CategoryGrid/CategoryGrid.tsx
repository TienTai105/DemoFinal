import React from 'react';
import { ChevronRight } from 'lucide-react';
import './CategoryGrid.scss';
import { Link } from 'react-router-dom';

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
              <Link to= "/collection" className="shop-now-btn">
                Mua Ngay
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
          <div className="category-content">
            <h3 className="category-title">{category.title}</h3>
            {category.count && (
              <p className="category-count">{category.count} sản phẩm</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
