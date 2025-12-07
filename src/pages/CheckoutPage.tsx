import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import './CheckoutPage.scss';

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
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
  });

  const onSubmit = async (_data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('Order placed successfully!');
      reset();
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error placing order:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="checkout-page py-5">
      <h2 className="mb-4">Checkout</h2>
      <Row>
        <Col lg={8}>
          <div className="checkout-section">
            <h4 className="section-header">Shipping Information</h4>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      {...register('firstName')}
                      invalid={!!errors.firstName}
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName.message}</span>}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      {...register('lastName')}
                      invalid={!!errors.lastName}
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName.message}</span>}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register('email')}
                      invalid={!!errors.email}
                    />
                    {errors.email && <span className="error-text">{errors.email.message}</span>}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="1234567890"
                      {...register('phone')}
                      invalid={!!errors.phone}
                    />
                    {errors.phone && <span className="error-text">{errors.phone.message}</span>}
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <Label for="address">Address *</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="123 Main Street"
                  {...register('address')}
                  invalid={!!errors.address}
                />
                {errors.address && <span className="error-text">{errors.address.message}</span>}
              </FormGroup>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="city">City *</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="New York"
                      {...register('city')}
                      invalid={!!errors.city}
                    />
                    {errors.city && <span className="error-text">{errors.city.message}</span>}
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="state">State *</Label>
                    <Input
                      id="state"
                      type="text"
                      placeholder="NY"
                      {...register('state')}
                      invalid={!!errors.state}
                    />
                    {errors.state && <span className="error-text">{errors.state.message}</span>}
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      placeholder="10001"
                      {...register('zipCode')}
                      invalid={!!errors.zipCode}
                    />
                    {errors.zipCode && <span className="error-text">{errors.zipCode.message}</span>}
                  </FormGroup>
                </Col>
              </Row>

              <h4 className="section-header mt-4">Payment Information</h4>

              <FormGroup>
                <Label for="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234567890123456"
                  {...register('cardNumber')}
                  invalid={!!errors.cardNumber}
                />
                {errors.cardNumber && <span className="error-text">{errors.cardNumber.message}</span>}
              </FormGroup>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="cardExpiry">Expiry Date (MM/YY) *</Label>
                    <Input
                      id="cardExpiry"
                      type="text"
                      placeholder="12/25"
                      {...register('cardExpiry')}
                      invalid={!!errors.cardExpiry}
                    />
                    {errors.cardExpiry && <span className="error-text">{errors.cardExpiry.message}</span>}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="cardCVC">CVC *</Label>
                    <Input
                      id="cardCVC"
                      type="text"
                      placeholder="123"
                      {...register('cardCVC')}
                      invalid={!!errors.cardCVC}
                    />
                    {errors.cardCVC && <span className="error-text">{errors.cardCVC.message}</span>}
                  </FormGroup>
                </Col>
              </Row>

              <Button
                color="primary"
                size="lg"
                type="submit"
                block
                disabled={isSubmitting}
                className="mt-4"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </Form>
          </div>
        </Col>

        <Col lg={4}>
          <div className="order-summary">
            <h4>Order Summary</h4>
            <div className="summary-item">
              <span>Subtotal</span>
              <span>$1,234.56</span>
            </div>
            <div className="summary-item">
              <span>Shipping</span>
              <span className="text-success">Free</span>
            </div>
            <div className="summary-item">
              <span>Tax</span>
              <span>$123.46</span>
            </div>
            <hr />
            <div className="summary-item total">
              <span>Total</span>
              <span>$1,358.02</span>
            </div>
            <Alert color="info" className="mt-4">
              <small>Your order will be delivered within 5-7 business days.</small>
            </Alert>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
