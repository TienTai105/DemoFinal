import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Carousel } from '../../../components/Carousel/Carousel';
import { ShippingBanner } from '../../../components/ShippingBanner/ShippingBanner';
import { ProductCard } from '../../../components/ProductCard/ProductCard';
import { ImageGrid } from '../../../components/ImageGrid/ImageGrid';
import { CategoryGrid } from '../../../components/CategoryGrid/CategoryGrid';
import { Pagination } from '../../../components/Pagination/Pagination';
import { Newsletter } from '../../../components/Newsletter/Newsletter';
import { useProducts } from '../../../api/products/queries';
import './HomePage.scss';

// Carousel slides data
const CAROUSEL_SLIDES = [
  {
    id: '1',
    image: '/images/banner1.jpg',
    title: '2025',
    subtitle: 'Bộ Sưu Tập Mùa Thu',
  },
  {
    id: '2',
    image: '/images/banner1.jpg',
    title: 'Sản Phẩm Mới',
    subtitle: 'Khám phá những phong cách mới nhất',
  },
  {
    id: '3',
    image: '/images/banner3.jpg',
    title: 'Khuyến Mãi Mùa Hè',
    subtitle: 'Giảm đến 50%',
  },
  {
    id: '4',
    image: '/images/banner3.jpg',
    title: 'Khuyến Mãi Mùa Hè',
    subtitle: 'Giảm đến 50%',
  },
];

// Hero carousel slides data
const HERO_SLIDES = [
  {
    id: 'hero-1',
    image: '/images/banner5.jpg',
    title: 'Khám Phá Bộ Sưu Tập Mới',
    subtitle: 'Thời trang mùa mới – phong cách tối giản, chất liệu thoải mái & phù hợp cho mọi hoạt động hằng ngày.',
    cta: 'Mua Ngay',
    layout: 'glassmorphism' as const,
    floatingElements: [
      { type: 'badge' as const, text: 'NEW', position: 'top-left' as const },
      { type: 'star' as const, position: 'top-right' as const },
      { type: 'sale' as const, position: 'bottom-left' as const },
    ],
  },
  {
    id: 'hero-2',
    image: '/images/banner6.jpg',
    title: 'Sale Mùa Hè – Giảm Đến 50%',
    subtitle: 'Sưu tập những mẫu áo thun, sơ mi và váy hot nhất với mức giá cực ưu đãi. Số lượng có hạn.',
    cta: 'Mua Ngay',
    layout: 'glassmorphism' as const,
    floatingElements: [
      { type: 'badge' as const, text: 'SALE', position: 'top-left' as const },
      { type: 'sale' as const, position: 'top-right' as const },
      { type: 'star' as const, position: 'bottom-left' as const },
      { type: 'tag' as const, text: 'Hot', position: 'bottom-right' as const },
    ],
  },
  {
    id: 'hero-3',
    image: '/images/banner9.jpg',
    title: 'Thời Trang Trẻ Em – Dễ Thương & An Toàn',
    subtitle: 'Chất liệu mềm mại, thoáng mát, an toàn cho làn da bé. Nhiều mẫu mới mỗi tuần.',
    cta: 'Mua Ngay',
    layout: 'glassmorphism' as const,
    floatingElements: [
      { type: 'badge' as const, text: 'KIDS', position: 'top-left' as const },
      { type: 'star' as const, position: 'top-right' as const },
      { type: 'sale' as const, position: 'bottom-right' as const },
    ],
  },
  {
    id: 'hero-4',
    image: '/images/banner8.jpg',
    title: 'Phong Cách Streetwear Tối Giản',
    subtitle: 'Tự tin thể hiện cá tính với phong cách đơn giản nhưng cuốn hút. Hoodie, jogger & tee mới nhất.',
    cta: 'Mua Ngay',
    floatingElements: [
      { type: 'badge' as const, text: 'TREND', position: 'top-right' as const },
      { type: 'star' as const, position: 'top-left' as const },
      { type: 'sale' as const, position: 'bottom-right' as const },
      { type: 'tag' as const, text: 'Exclusive', position: 'bottom-left' as const },
    ],
  },
];

// Image grid items - 4 column layout with diagonal small items
const IMAGE_GRID_ITEMS = [
  {
    id: 'grid-1',
    image: '/images/p_img1.png',
    alt: 'White T-Shirt',
    span: 'large' as const,
  },
  {
    id: 'grid-2',
    image: '/images/p_img2.png',
    alt: 'Black T-Shirt',
    span: 'small' as const,
  },
  {
    id: 'grid-4',
    image: '/images/p_img4.png',
    alt: 'Light Blue Shirt',
    span: 'large' as const,
  },
  {
    id: 'grid-3',
    image: '/images/p_img3.png',
    alt: 'Floral Dress',
    span: 'small' as const,
  },
];

/**
 * HomePage Component
 * Displays:
 * - Hero carousel with glassmorphism layout
 * - Shipping benefits banner
 * - Category grid (Men, Women, Bags, Shoes, Accessories)
 * - Product carousel (3 columns)
 * - Image grid (diagonal layout)
 * - New Arrivals section with pagination & filtering
 * - Best Sellers section with pagination & filtering
 * - Newsletter subscription
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("");
  const [currentPageNewArrivals, setCurrentPageNewArrivals] = useState(1);
  const [currentPageBestSellers, setCurrentPageBestSellers] = useState(1);
  const itemsPerPage = 5;

  // Fetch products from API
  const { data: allProducts = [], isLoading, error } = useProducts();

  // Debug log
  React.useEffect(() => {
    console.log('HomePage Debug:', {
      isLoading,
      error: error?.message || null,
      productCount: allProducts.length,
      firstProduct: allProducts[0],
      categories: Array.from(new Set(allProducts.map((p) => p.category))),
    });
  }, [allProducts, isLoading, error]);

  // Extract unique categories from products (only from API)
  const displayCategories = Array.from(
    new Set(
      allProducts
        .map((product) => product.category)
        .filter((category) => category !== undefined && category !== null && category !== '')
    )
  );

  // Generate dynamic category items with product count
  const dynamicCategoryItems = displayCategories.map((category, index) => {
    const count = allProducts.filter((p) => p.category === category).length;
    const categoryImages = [
      '/images/p_img1.png',
      '/images/p_img2.png',
      '/images/p_img3.png',
      '/images/p_img4.png',
    ];
    
    return {
      id: `cat-${index}`,
      image: categoryImages[index % categoryImages.length],
      title: category,
      count: count > 0 ? count : undefined,
      link: `/category/${category.toLowerCase()}`,
    };
  });

  // 👉 Hàm chuyển sang trang chi tiết
  const handleViewDetails = (id: string) => {
    navigate(`/product/${id}`);
  };

  // Filter products for New Arrivals (newproduct = true)
  // Apply category filter if selected
  let newArrivalsProducts = allProducts.filter((product) => product.newproduct === true);
  if (activeCategory) {
    newArrivalsProducts = newArrivalsProducts.filter((p) => p.category === activeCategory);
  }

  // Filter products for Best Sellers (bestseller = true)
  // Apply category filter if selected
  let bestSellerProducts = allProducts.filter((product) => product.bestseller === true);
  if (activeCategory) {
    bestSellerProducts = bestSellerProducts.filter((p) => p.category === activeCategory);
  }

  // Pagination logic for New Arrivals
  const totalPagesNewArrivals = Math.ceil(newArrivalsProducts.length / itemsPerPage);
  const startIndexNewArrivals = (currentPageNewArrivals - 1) * itemsPerPage;
  const paginatedProducts = newArrivalsProducts.slice(startIndexNewArrivals, startIndexNewArrivals + itemsPerPage);

  // Pagination logic for Best Sellers
  const totalPagesBestSellers = Math.ceil(bestSellerProducts.length / itemsPerPage);
  const startIndexBestSellers = (currentPageBestSellers - 1) * itemsPerPage;
  const paginatedBestSellers = bestSellerProducts.slice(startIndexBestSellers, startIndexBestSellers + itemsPerPage);

  const handlePageChangeNewArrivals = (page: number) => {
    setCurrentPageNewArrivals(page);
  };

  const handlePageChangeBestSellers = (page: number) => {
    setCurrentPageBestSellers(page);
  };

  // Reset pagination when category changes
  React.useEffect(() => {
    setCurrentPageNewArrivals(1);
    setCurrentPageBestSellers(1);
  }, [activeCategory]);

  // ===== SET HOME AS PREVIOUS PAGE =====
  React.useEffect(() => {
    sessionStorage.setItem('previousPage', JSON.stringify({ name: 'Home', path: '/' }));
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="home-page">
        <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Đang tải sản phẩm từ MockAPI...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="home-page">
        <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#d32f2f' }}>
          <p style={{ fontSize: '1.1rem' }}>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Hãy chắc chắn rằng MockAPI có thể truy cập được.</p>
        </div>
      </div>
    );
  }

  // Show message if no products found
  if (allProducts.length === 0) {
    return (
      <div className="home-page">
        <div style={{ textAlign: 'center', padding: '6rem 2rem', color: '#999' }}>
          <p style={{ fontSize: '1.1rem' }}>Không có sản phẩm nào từ MockAPI.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Vui lòng kiểm tra cài đặt MockAPI của bạn.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* ===== HERO CAROUSEL SECTION ===== */}
      <section className="hero-carousel-section" data-aos="fade-up">
        <div className="hero-carousel-container">
          <Carousel
            slides={HERO_SLIDES}
            autoplay={true}
            autoplaySpeed={6000}
            slidesToShow={1}
            variant="hero"
            layout="glassmorphism"
          />
        </div>
      </section>

      {/* ===== SHIPPING BENEFITS BANNER ===== */}
      <section className="shipping-banner-section" data-aos="zoom-in" data-aos-delay="100">
        <div className="shipping-banner-container">
          <ShippingBanner />
        </div>
      </section>

      {/* ===== CATEGORY GRID SECTION ===== */}
      <section className="category-grid-section" data-aos="fade-up" data-aos-delay="200">
        <div className="category-grid-container">
          <h2 className="section-title">Mua Theo Danh Mục</h2>
          <CategoryGrid items={dynamicCategoryItems} />
        </div>
      </section>

      {/* ===== PRODUCTS SECTION (NEW ARRIVALS) ===== */}
      <section className="products-section" data-aos="fade-left" data-aos-delay="300">
        <div className="products-container">
          <div className="section-header-row">
            <h2 className="section-title">Sản Phẩm Mới</h2>

            <div className="category-tabs">
              {displayCategories.map((category: string) => (
                <button
                  key={category}
                  className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <Link to ="/collection" className="show-more-link">
              Xem Thêm →
            </Link>
          </div>

          <div className="products-grid">
            {paginatedProducts.map((product, index) => (
              <div key={product.id} data-aos="fade-up" data-aos-delay={`${50 + index * 50}`}>
                <ProductCard product={product} onViewDetails={handleViewDetails} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPagesNewArrivals > 1 && (
            <Pagination
              currentPage={currentPageNewArrivals}
              totalPages={totalPagesNewArrivals}
              onPageChange={handlePageChangeNewArrivals}
            />
          )}
        </div>
      </section>

      {/* ===== PRODUCT CAROUSEL SECTION ===== */}
      <section className="carousel-section" data-aos="fade-up" data-aos-delay="100">
        <div className="carousel-container-wrapper">
          <Carousel slides={CAROUSEL_SLIDES} autoplay={true} autoplaySpeed={5000} slidesToShow={3} variant="product" />
        </div>
      </section>

      {/* ===== IMAGE GRID SECTION ===== */}
      <section className="image-grid-section" data-aos="fade-up" data-aos-delay="200">
        <div className="image-grid-container">
          <ImageGrid items={IMAGE_GRID_ITEMS} />
        </div>
      </section>

      {/* ===== PRODUCTS SECTION (BEST SELLERS) ===== */}
      <section className="products-section" data-aos="fade-right" data-aos-delay="300">
        <div className="products-container">
          <div className="section-header-row">
            <h2 className="section-title">Sản phẩm bán chạy</h2>

            <div className="category-tabs">
              {displayCategories.map((category: string) => (
                <button
                  key={category}
                  className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <Link to="/collection" className="show-more-link">
              Xem Thêm →
            </Link>
          </div>

          {/* 4-Column Products Grid */}
          <div className="products-grid">
            {paginatedBestSellers.map((product, index) => (
              <div key={product.id} data-aos="fade-up" data-aos-delay={`${50 + index * 50}`}>
                <ProductCard product={product} onViewDetails={handleViewDetails} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPagesBestSellers > 1 && (
            <Pagination
              currentPage={currentPageBestSellers}
              totalPages={totalPagesBestSellers}
              onPageChange={handlePageChangeBestSellers}
            />
          )}
        </div>
      </section>

      {/* ===== NEWSLETTER SECTION ===== */}
      <Newsletter onSubscribe={(email) => console.log('Subscribed:', email)} />
    </div>
  );
};
