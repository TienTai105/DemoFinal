import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { Container, Row, Col, Button, Table } from 'reactstrap';
import { Trash2 } from 'lucide-react';
import './Cart.scss';

export const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <Container className="cart-container py-5 text-center">
        <h2>Your Cart is Empty</h2>
        <p className="text-muted mt-3">Add some products to get started!</p>
      </Container>
    );
  }

  return (
    <Container className="cart-container py-5">
      <h2 className="mb-4">Shopping Cart</h2>
      <Row>
        <Col lg={8}>
          <Table hover className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="cart-item">
                  <td>
                    <div className="item-info">
                      <img src={item.image} alt={item.name} className="item-image" />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <input type="number" value={item.quantity} onChange={() => {}} />
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col lg={4}>
          <div className="cart-summary">
            <h4>Order Summary</h4>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${(total * 0.1).toFixed(2)}</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total:</span>
              <span>${(total * 1.1).toFixed(2)}</span>
            </div>
            <Button color="primary" block className="mt-4 checkout-btn">
              Proceed to Checkout
            </Button>
            <Button color="secondary" outline block className="mt-2">
              Continue Shopping
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
