import React from 'react';
import './ImageGrid.scss';

interface ImageGridItem {
  id: string;
  image: string;
  alt: string;
  span?: 'small' | 'large';
  link?: string;
}

interface ImageGridProps {
  items: ImageGridItem[];
}

export const ImageGrid: React.FC<ImageGridProps> = ({ items }) => {
  return (
    <div className="image-grid">
      {items.map((item) => (
        <div
          key={item.id}
          className={`image-grid-item image-grid-item-${item.span || 'small'}`}
        >
          {item.link ? (
            <a href={item.link} className="image-grid-link">
              <img src={item.image} alt={item.alt} loading="lazy" />
            </a>
          ) : (
            <img src={item.image} alt={item.alt} loading="lazy" />
          )}
        </div>
      ))}
    </div>
  );
};
