import React from 'react';
import { useCartStore } from '../store/cartStore';
import { Container, Row, Col, Button } from 'reactstrap';
import { Star, ShoppingCart } from 'lucide-react';

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Premium Wireless Headphones',
  description: 'High-quality sound with noise cancellation and long battery life',
  fullDescription: `Our Premium Wireless Headphones deliver exceptional audio quality with active noise cancellation technology. Perfect for music enthusiasts, professionals, and casual listeners alike.

Features:
- Active Noise Cancellation (ANC)
- 30-hour battery life
- Wireless Bluetooth connectivity
- Comfortable over-ear design
- Built-in microphone for calls
- Premium materials and construction

Specifications:
- Driver Size: 40mm
- Frequency Response: 20Hz - 20kHz
- Impedance: 32 Ohms
- Weight: 250g`,
  price: 129.99,
  originalPrice: 199.99,
  image: 'https://via.placeholder.com/500x500?text=Headphones',
  category: 'Electronics',
  rating: 5,
  reviews: 234,
  stock: 15,
};

export const ProductDetailPage: React.FC = () => {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = React.useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(mockProduct);
    }
    alert('Product added to cart!');
  };

  return (
    <Container className="product-detail-page py-5">
      <Row>
        <Col lg={6} className="mb-4">
          <div className="product-image-container">
            <img
              src={mockProduct.image}
              alt={mockProduct.name}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </div>
        </Col>
        <Col lg={6}>
          <div className="product-info">
            <h1 style={{ marginBottom: '1rem', fontSize: '2rem', fontWeight: 'bold' }}>
              {mockProduct.name}
            </h1>

            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  style={{
                    color: i < Math.floor(mockProduct.rating) ? '#ffc107' : '#dee2e6',
                    fill: i < Math.floor(mockProduct.rating) ? '#ffc107' : 'none',
                  }}
                />
              ))}
              <span style={{ marginLeft: '0.5rem', color: '#6c757d' }}>
                {mockProduct.rating} stars ({mockProduct.reviews} reviews)
              </span>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
                ${mockProduct.price.toFixed(2)}
              </span>
              {mockProduct.originalPrice && (
                <span
                  style={{
                    marginLeft: '1rem',
                    fontSize: '1.1rem',
                    textDecoration: 'line-through',
                    color: '#6c757d',
                  }}
                >
                  ${mockProduct.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {mockProduct.fullDescription}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Quantity:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: '60px',
                    padding: '0.5rem',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    textAlign: 'center',
                  }}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <Button
              color="primary"
              size="lg"
              onClick={handleAddToCart}
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              <ShoppingCart size={20} style={{ marginRight: '0.5rem' }} />
              Add to Cart
            </Button>

            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Stock:</strong> {mockProduct.stock > 0 ? `${mockProduct.stock} in stock` : 'Out of stock'}
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Category:</strong> {mockProduct.category}
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Free Shipping:</strong> On orders over $50
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>30-Day Return:</strong> Money-back guarantee
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
