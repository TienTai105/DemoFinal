import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Row, Col, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './CheckoutPage.scss';
import { useCartStore } from '../store/cartStore';
import { useCreateOrder } from '../api/orders/queries';
import { CheckoutCart } from '../components/Cart/CheckoutCart';
import { Button } from '../components/UI/Button/Button';
import { useNavigate } from 'react-router-dom';



interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
}

// Yup validation schema
const checkoutSchema = yup.object().shape({
  firstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Email must be valid'),
  phone: yup.string().required('Phone number is required').matches(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  address: yup.string().required('Address is required').min(5, 'Address must be at least 5 characters'),
  city: yup.string().required('City is required').min(2, 'City must be at least 2 characters'),
  state: yup.string().required('State is required').min(2, 'State must be at least 2 characters'),
  zipCode: yup.string().required('ZIP code is required').matches(/^[0-9]{5}$/, 'ZIP code must be 5 digits'),
  cardNumber: yup.string().required('Card number is required').matches(/^[0-9]{16}$/, 'Card must be 16 digits'),
  cardExpiry: yup.string().required('Expiry date is required').matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry must be MM/YY'),
  cardCVC: yup.string().required('CVC is required').matches(/^[0-9]{3}$/, 'CVC must be 3 digits'),
});

export const CheckoutPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
  });

  const [showSuccess, setShowSuccess] = React.useState(false);
  const navigate = useNavigate();
  const { items: cartItems, getTotal: getSubtotal, clearCart: getClearCart } = useCartStore();
  const { mutate: createOrder } = useCreateOrder();

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      const subtotal = getSubtotal();
      const tax = subtotal * 0.1;
      const totalAmount = subtotal + tax;

      // Prepare order data for API
      const orderData = {
        userId: 'user-' + Date.now(), // Generate temporary user ID
        items: cartItems,
        total: totalAmount,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Add customer info from form
        customerInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
      };

      // Save order to MockAPI
      createOrder(orderData as any, {
        onSuccess: () => {
          reset();
          setIsSubmitting(false);
          setShowSuccess(true);
          getClearCart();
        },
        onError: (error) => {
          console.error('Error placing order:', error);
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      console.error('Error preparing order:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-breadcrumb-wrapper">
        <div className="checkout-breadcrumb">
          <Link to="/">Home Page</Link>
          <ChevronRight size={18} />
          <span>Check Out</span>
        </div>
      </div>
      <div className="checkout-container">
        <h2 className="checkout-title">Checkout</h2>
        <Row>
        
        <Col lg={8}>
          {/* Cart at top */}
          <div className="checkout-cart-embedded">
            <CheckoutCart />
          </div>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="checkout-section">
                <h4 className="section-header">Shipping Information</h4>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="firstName">First Name *</Label>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          {...field}
                          invalid={!!errors.firstName}
                        />
                      )}
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName.message}</span>}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="lastName">Last Name *</Label>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          {...field}
                          invalid={!!errors.lastName}
                        />
                      )}
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName.message}</span>}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="email">Email *</Label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                          invalid={!!errors.email}
                        />
                      )}
                    />
                    {errors.email && <span className="error-text">{errors.email.message}</span>}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="phone">Phone *</Label>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="1234567890"
                          {...field}
                          invalid={!!errors.phone}
                        />
                      )}
                    />
                    {errors.phone && <span className="error-text">{errors.phone.message}</span>}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="address">Address *</Label>
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="address"
                          type="text"
                          placeholder="123 Main Street"
                          {...field}
                          invalid={!!errors.address}
                        />
                      )}
                    />
                    {errors.address && <span className="error-text">{errors.address.message}</span>}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="city">City *</Label>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="city"
                          type="text"
                          placeholder="New York"
                          {...field}
                          invalid={!!errors.city}
                        />
                      )}
                    />
                    {errors.city && <span className="error-text">{errors.city.message}</span>}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                
                <Col md={6}>
                  <FormGroup>
                    <Label for="state">State *</Label>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="state"
                          type="text"
                          placeholder="NY"
                          {...field}
                          invalid={!!errors.state}
                        />
                      )}
                    />
                    {errors.state && <span className="error-text">{errors.state.message}</span>}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="zipCode">ZIP Code *</Label>
                    <Controller
                      name="zipCode"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="zipCode"
                          type="text"
                          placeholder="10001"
                          {...field}
                          invalid={!!errors.zipCode}
                        />
                      )}
                    />
                    {errors.zipCode && <span className="error-text">{errors.zipCode.message}</span>}
                  </FormGroup>
                </Col>
              </Row>

              
              </div>

              <div className="checkout-section mt-4">
                <h4 className="section-header">Payment Information</h4>

              <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="cardNumber">Card Number *</Label>
                  <Controller
                    name="cardNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="cardNumber"
                        type="text"
                        placeholder="1234567890123456"
                        {...field}
                        invalid={!!errors.cardNumber}
                      />
                    )}
                  />
                  {errors.cardNumber && <span className="error-text">{errors.cardNumber.message}</span>}
                </FormGroup>
              </Col>
              <Col md={6}>
                  <FormGroup>
                    <Label for="cardCVC">CVC *</Label>
                    <Controller
                      name="cardCVC"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="cardCVC"
                          type="text"
                          placeholder="123"
                          {...field}
                          invalid={!!errors.cardCVC}
                        />
                      )}
                    />
                    {errors.cardCVC && <span className="error-text">{errors.cardCVC.message}</span>}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="cardExpiry">Expiry Date (MM/YY) *</Label>
                    <Controller
                      name="cardExpiry"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="cardExpiry"
                          type="text"
                          placeholder="12/25"
                          {...field}
                          invalid={!!errors.cardExpiry}
                        />
                      )}
                    />
                    {errors.cardExpiry && <span className="error-text">{errors.cardExpiry.message}</span>}
                  </FormGroup>
                </Col>
                
              </Row>

                <Button
                  variant="accent"
                  size="lg"
                  fullWidth
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'} <ChevronRight size={20} />
                </Button>
              </div>
            </Form>
        </Col>

        <Col lg={4}>
          {/* Order Summary on right - sticky at top */}
          <div className="order-summary">
            <h4>Order Summary</h4>
            <div className="summary-item">
              <span>Subtotal</span>
              <span>{getSubtotal().toLocaleString('vi-VN')}.000đ</span>
            </div>
            <div className="summary-item">
              <span>Shipping</span>
              <span className="text-success">Free</span>
            </div>
            <div className="summary-item">
              <span>Tax</span>
              <span>{(getSubtotal() * 0.1).toLocaleString('vi-VN')}.000đ</span>
            </div>
            <hr />
            <div className="summary-item total">
              <span>Total</span>
              <span>{(getSubtotal() + getSubtotal() * 0.1).toLocaleString('vi-VN')}.000đ</span>
            </div>
            <Alert color="info" className="mt-4">
              <small>Your order will be delivered within 5-7 business days.</small>
            </Alert>
          </div>
          {showSuccess && (
            <div className="success-overlay">
              <div className="success-modal">
                <h3>The order has been successfully placed.</h3>
                <p className="text-muted">Thank you for your purchase!</p>
                <div style={{ marginTop: 20 }}>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowSuccess(false);
                      navigate('/');
                    }}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Col>
      </Row>
      </div>
    </div>
  );
};
