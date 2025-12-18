// =====================================================
// CAROUSEL COMPONENT - Image slider with navigation
// =====================================================
// Full-width carousel for hero/featured images

import React from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.scss';

interface CarouselSlide {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  link?: string;
  layout?: 'classic' | 'glassmorphism';
  floatingElements?: Array<{
    type: 'badge' | 'star' | 'sale' | 'tag';
    text?: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }>;
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoplay?: boolean;
  autoplaySpeed?: number;
  slidesToShow?: number;
  variant?: 'hero' | 'product';
  layout?: 'classic' | 'glassmorphism';
}

// Custom Arrow Components
interface ArrowProps {
  onClick?: () => void;
}

const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <button
    className="carousel-arrow carousel-arrow-prev"
    onClick={onClick}
    aria-label="Slide Trước"
  >
    <ChevronLeft size={24} />
  </button>
);

const NextArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <button
    className="carousel-arrow carousel-arrow-next"
    onClick={onClick}
    aria-label="Slide Tiếp"
  >
    <ChevronRight size={24} />
  </button>
);

/**
 * Carousel Component
 * Displays image slider with dot navigation
 * Used for featured products/campaigns
 */
export const Carousel: React.FC<CarouselProps> = ({
  slides,
  autoplay = true,
  autoplaySpeed = 5000,
  slidesToShow = 3,
  variant = 'product',
  layout = 'classic',
}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    autoplay,
    autoplaySpeed,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    dotsClass: 'carousel-dots',
    customPaging: () => <button className="dot" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.max(1, slidesToShow - 1),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className={`carousel-container carousel-${variant}`}>
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className={`carousel-slide carousel-slide-${variant} carousel-layout-${slide.layout || layout}`}>
            <img src={slide.image} alt={slide.title || 'Slide'} />
            
            {/* Floating Elements for Glassmorphism Layout */}
            {(slide.layout || layout) === 'glassmorphism' && slide.floatingElements && (
              <div className="floating-elements">
                {slide.floatingElements.map((element, idx) => (
                  <div
                    key={idx}
                    className={`floating-element floating-${element.type} floating-${element.position}`}
                  >
                    {element.type === 'badge' && <span className="badge-text">{element.text || 'NEW'}</span>}
                    {element.type === 'star' && <span className="star-icon">★</span>}
                    {element.type === 'sale' && <span className="sale-icon">⚡</span>}
                    {element.type === 'tag' && <span className="tag-text">{element.text || 'Hot'}</span>}
                  </div>
                ))}
              </div>
            )}

            {(slide.title || slide.subtitle || slide.cta) && (
              <div className={`carousel-content carousel-content-${slide.layout || layout}`}>
                {slide.title && <h2 className="carousel-title">{slide.title}</h2>}
                {slide.subtitle && <p className="carousel-subtitle">{slide.subtitle}</p>}
                {slide.cta && (
                  <Link to={slide.link || '/collection'} className="carousel-cta">
                    {slide.cta} 
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};
