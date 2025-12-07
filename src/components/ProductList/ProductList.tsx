import React from 'react';
import { Container, Row, Col, Spinner } from 'reactstrap';
import { ProductCard } from '../ProductCard/ProductCard';
import type { Product } from '../../types';
import './ProductList.scss';

interface ProductListProps {
  products?: Product[];
  isLoading?: boolean;
  onViewDetails?: (id: string) => void;
}

// Mock products for demo
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality sound with noise cancellation and long battery life',
    price: 129.99,
    originalPrice: 199.99,
    image: '/images/product-1.jpg',
    category: 'Men',
    rating: 5,
    reviews: 234,
    stock: 15,
  },
  {
    id: '2',
    name: 'Ultra Slim Laptop',
    description: 'Powerful performance in a slim design, perfect for professionals',
    price: 899.99,
    originalPrice: 1299.99,
    image: '/images/product-2.jpg',
    category: 'Computers',
    rating: 4.5,
    reviews: 128,
    stock: 8,
  },
  {
    id: '3',
    name: 'Smart Watch Pro',
    description: 'Track your fitness and stay connected with advanced features',
    price: 299.99,
    image: '/images/product-3.jpg',
    category: 'Wearables',
    rating: 4,
    reviews: 89,
    stock: 20,
  },
  {
    id: '4',
    name: '4K Wireless Camera',
    description: 'Professional-grade 4K video recording with stabilization',
    price: 499.99,
    originalPrice: 599.99,
    image: '/images/product-4.jpg',
    category: 'Photography',
    rating: 4.5,
    reviews: 156,
    stock: 5,
  },
  {
    id: '5',
    name: 'Portable Power Bank',
    description: '20000mAh capacity, fast charging technology',
    price: 39.99,
    image: '/images/product-5.jpg',
    category: 'Accessories',
    rating: 4,
    reviews: 412,
    stock: 50,
  },
  {
    id: '6',
    name: 'Premium Keyboard',
    description: 'Mechanical keyboard with RGB lighting and custom switches',
    price: 159.99,
    image: '/images/product-6.jpg',
    category: 'Accessories',
    rating: 5,
    reviews: 334,
    stock: 0,
  },
];

export const ProductList: React.FC<ProductListProps> = ({
  products = mockProducts,
  isLoading = false,
  onViewDetails,
}) => {
  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner color="primary" />
        <p className="mt-3">Loading products...</p>
      </Container>
    );
  }

  return (
    <div className="product-list">
      <Container>
        <h2 className="section-title">Our Products</h2>
        {products && products.length > 0 ? (
          <Row>
            {products.map((product) => (
              <Col lg={4} md={6} sm={12} key={product.id} className="mb-4">
                <ProductCard product={product} onViewDetails={onViewDetails} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="no-products">
            <p>No products found</p>
          </div>
        )}
      </Container>
    </div>
  );
};
