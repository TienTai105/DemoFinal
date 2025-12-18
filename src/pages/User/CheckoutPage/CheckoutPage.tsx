import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Row, Col, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import {useLocation} from 'react-router-dom';
import { ChevronRight } from 'lucide-react';import toast from 'react-hot-toast';import './CheckoutPage.scss';
import { useCartStore } from '../../../store/cartStore';
import { useAuthStore } from '../../../store/authStore';
import { CheckoutCart } from '../../../components/Cart/CheckoutCart';
import { Button } from '../../../components/UI/Button/Button'; 
import { useNavigate } from 'react-router-dom';



interface CheckoutFormData {
  // Customer Info
  fullName: string;
  email: string;
  phone: string;
  // Shipping Address (Vietnamese format)
  receiverName: string;
  receiverPhone: string;
  addressLine: string;
  ward: string;
  district: string;
  city: string;
  // Payment Method
  paymentMethod: string; // Changed to string for yup compatibility
  // Card Info (optional, only if paymentMethod is 'card')
  cardNumber?: string;
  cardExpiry?: string;
  cardCVC?: string;
}

// Yup validation schema
const checkoutSchema = yup.object().shape({
  fullName: yup.string().required('Tên khách hàng là bắt buộc').min(2, 'Tên phải ít nhất 2 ký tự'),
  email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
  phone: yup.string().required('Số điện thoại là bắt buộc').matches(/^[0-9]{10,11}$/, 'Số điện thoại phải 10-11 chữ số'),
  
  receiverName: yup.string().required('Tên người nhận là bắt buộc').min(2, 'Tên phải ít nhất 2 ký tự'),
  receiverPhone: yup.string().required('Số điện thoại người nhận là bắt buộc').matches(/^[0-9]{10,11}$/, 'Số điện thoại phải 10-11 chữ số'),
  addressLine: yup.string().required('Địa chỉ là bắt buộc').min(5, 'Địa chỉ phải ít nhất 5 ký tự'),
  ward: yup.string().required('Phường/Xã là bắt buộc'),
  district: yup.string().required('Quận/Huyện là bắt buộc'),
  city: yup.string().required('Tỉnh/Thành phố là bắt buộc'),
  
  paymentMethod: yup.string().required('Vui lòng chọn phương thức thanh toán').oneOf(['cash', 'card', 'transfer']),
  
  // Card fields - only required if paymentMethod is 'card'
  cardNumber: yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema.required('Số thẻ là bắt buộc').matches(/^[0-9]{16}$/, 'Số thẻ phải 16 chữ số'),
    otherwise: (schema) => schema.optional(),
  }),
  cardExpiry: yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema.required('Ngày hết hạn là bắt buộc').matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Định dạng phải là MM/YY'),
    otherwise: (schema) => schema.optional(),
  }),
  cardCVC: yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema.required('CVC là bắt buộc').matches(/^[0-9]{3,4}$/, 'CVC phải 3-4 chữ số'),
    otherwise: (schema) => schema.optional(),
  }),
});

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const user = useAuthStore((s) => s.user);

  const getPreviousPage = () => {
    const state = location.state as any;
    if (state?.from) return state.from;
    const prevPage = sessionStorage.getItem('previousPage');
    if (prevPage) return JSON.parse(prevPage);
    return { name: 'Cart', path: '/cart' };
  };

  const previousPage = getPreviousPage();

  React.useEffect(() => {
    return () => {
      sessionStorage.setItem('previousPage', JSON.stringify({ name: 'Checkout', path: '/checkout' }));
    };
  }, []);

  // Get default address from user
  const defaultAddress = React.useMemo(() => {
    if (!user?.addresses || user.addresses.length === 0) return null;
    return user.addresses.find((addr: any) => addr.isDefault) || user.addresses[0];
  }, [user]);

  const defaultFormValues = React.useMemo(() => {
    if (!user) return {
      fullName: '',
      email: '',
      phone: '',
      receiverName: '',
      receiverPhone: '',
      addressLine: '',
      ward: '',
      district: '',
      city: '',
      paymentMethod: 'card',
      cardNumber: '',
      cardExpiry: '',
      cardCVC: '',
    };
    
    const fullName = user.fullName || user.name || '';
    
    return {
      fullName: fullName,
      email: user.email || '',
      phone: user.phone || '',
      receiverName: defaultAddress?.receiverName || fullName || '',
      receiverPhone: defaultAddress?.phone || user.phone || '',
      addressLine: defaultAddress?.addressLine || '',
      ward: defaultAddress?.ward || '',
      district: defaultAddress?.district || '',
      city: defaultAddress?.city || '',
      paymentMethod: 'card',
      cardNumber: '',
      cardExpiry: '',
      cardCVC: '',
    };
  }, [user, defaultAddress]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
    mode: 'onBlur',
    defaultValues: defaultFormValues,
  });

  const paymentMethod = watch('paymentMethod');

  const [showSuccess, setShowSuccess] = React.useState(false);
  const [useNewAddress, setUseNewAddress] = React.useState(false);
  const { items: cartItems, getTotal: getSubtotal, clearCart: getClearCart } = useCartStore();

  // Reset form when user data changes to load default values
  React.useEffect(() => {
    reset(defaultFormValues);
  }, [defaultFormValues, reset]);

  // Debug: log user data
  React.useEffect(() => {
    console.log('Checkout User:', user);
    console.log('Checkout User Addresses:', user?.addresses);
    console.log('Default Address:', defaultAddress);
  }, [user, defaultAddress]);

  // Fetch user from API if addresses are missing (restore from localStorage)
  React.useEffect(() => {
    if (user && user.id && (!user.addresses || user.addresses.length === 0)) {
      console.log('Fetching user from API:', user.id);
      const API_URL = 'https://68ef2e22b06cc802829c5e18.mockapi.io/api/users';
      fetch(`${API_URL}/${user.id}`)
        .then(res => res.json())
        .then(data => {
          console.log('Fetched user data:', data);
          // Update user in store with full data including addresses
          useAuthStore.setState({ user: data });
        })
        .catch(err => console.error('Error fetching user:', err));
    }
  }, [user?.id]);

  // Save order to localStorage
  const saveOrderToLocalStorage = (orderData: any) => {
    try {
      const existingOrders = localStorage.getItem('orders');
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(orders));
      console.log('Order saved to localStorage:', orderData);
      return true;
    } catch (error) {
      console.error('Error saving order to localStorage:', error);
      return false;
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      const PRODUCTS_API_URL = 'https://68ef2e22b06cc802829c5e18.mockapi.io/api/products';
      
      // ⭐ Kiểm tra hàng còn trong kho trước khi checkout
      for (const item of cartItems) {
        try {
          const productRes = await fetch(`${PRODUCTS_API_URL}/${item.id}`);
          const product = await productRes.json();
          
          if (product.stock === 0 || product.stock < item.quantity) {
            toast.error(`Sản phẩm "${product.name}" đã hết hàng hoặc không đủ số lượng!`, {
              duration: 3000,
              position: 'bottom-right',
              style: {
                background: '#dc3545',
                color: '#fff',
                borderRadius: '8px',
                padding: '16px',
              },
            });
            setIsSubmitting(false);
            return;
          }
        } catch (err) {
          console.error(`Error checking stock for product ${item.id}:`, err);
        }
      }

      const subtotal = getSubtotal();
      const tax = subtotal * 0.08; // 8% tax
      const totalAmount = subtotal + tax;

      // If user added a new address, save it to user
      if (useNewAddress && user?.id) {
        const newAddress = {
          id: `addr_${Date.now()}`,
          receiverName: data.receiverName,
          phone: data.receiverPhone,
          addressLine: data.addressLine,
          ward: data.ward,
          district: data.district,
          city: data.city,
          isDefault: false,
        };

        // Add new address to user addresses
        const updatedAddresses = [...(user.addresses || []), newAddress];
        const updatedUser = { ...user, addresses: updatedAddresses };

        // Save updated user to MockAPI
        try {
          const API_URL = 'https://68ef2e22b06cc802829c5e18.mockapi.io/api/users';
          const response = await fetch(`${API_URL}/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ addresses: updatedAddresses }),
          });
          
          if (response.ok) {
            console.log('✅ Address saved to user');
            // Update user in store
            useAuthStore.setState({ user: updatedUser });
          }
        } catch (err) {
          console.error('Error saving address:', err);
        }
      }

      // Prepare order data
      const orderData = {
        id: 'order-' + Date.now(), // Generate unique order ID
        userId: user?.id || 'guest-' + Date.now(),
        items: cartItems.map((item: any) => {
          // Extract image URL properly
          let imageUrl = '';
          if (Array.isArray(item.image)) {
            imageUrl = item.image[0] || '';
          } else if (typeof item.image === 'string') {
            imageUrl = item.image;
          }
          
          return {
            id: item.id,
            productId: item.id,
            productName: item.name, // Lấy từ field 'name'
            price: item.price,
            quantity: item.quantity,
            image: imageUrl,
            size: item.size || '',
            color: item.color || '',
            category: item.category || '',
          };
        }),
        total: totalAmount,
        subtotal: subtotal,
        tax: tax,
        status: 'pending' as const,
        paymentMethod: data.paymentMethod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Customer info
        customerName: data.fullName,
        customerEmail: data.email,
        customerPhone: data.phone,
        // Shipping address
        shippingAddress: {
          receiverName: data.receiverName,
          phone: data.receiverPhone,
          addressLine: data.addressLine,
          ward: data.ward,
          district: data.district,
          city: data.city,
        },
      };

      // ⭐ UPDATE PRODUCT STOCK - Giảm số lượng sản phẩm
      for (const item of cartItems) {
        try {
          // Fetch current product
          const productRes = await fetch(`${PRODUCTS_API_URL}/${item.id}`);
          const product = await productRes.json();
          
          // Calculate new stock
          const newStock = (product.stock || 0) - item.quantity;
          
          // Update product stock
          await fetch(`${PRODUCTS_API_URL}/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...product, stock: Math.max(0, newStock) }),
          });
          
          console.log(`✅ Updated stock for ${product.name}: ${product.stock} → ${Math.max(0, newStock)}`);
        } catch (err) {
          console.error(`Error updating stock for product ${item.id}:`, err);
        }
      }

      // Save order to localStorage
      const saved = saveOrderToLocalStorage(orderData);
      
      if (saved) {
        // Show success toast
        toast.success('Thanh toán thành công! Đơn hàng của bạn đã được lưu.', {
          duration: 3000,
          position: 'bottom-right',
          style: {
            background: '#173036',
            color: '#D6FC45',
            fontWeight: '600',
          },
        });
        
        // Clear form and show success modal
        reset();
        setUseNewAddress(false);
        getClearCart();
        setShowSuccess(true);
        
        console.log('✅ Order placed successfully:', orderData);
      } else {
        throw new Error('Failed to save order');
      }
    } catch (error) {
      console.error('Error preparing order:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="breadcrumb-top">
        <button 
          className="breadcrumb-link"
          onClick={() => navigate(previousPage.path === '/' ? '/' : previousPage.path, { state: { from: null } })}
        >
          {previousPage.name}
        </button>
        <span className="breadcrumb-sep"><ChevronRight size={18} /></span>
        <span className="breadcrumb-current">Check Out</span>
      </div>
      <div className="checkout-container">
        <h2 className="checkout-title">Checkout</h2>

        {/* Stepper */}
        <div className="checkout-stepper">
          <div className={`stepper-step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="stepper-circle">1</div>
            <span>Khách hàng</span>
          </div>
          <div className="stepper-line"></div>
          <div className={`stepper-step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="stepper-circle">2</div>
            <span>Giao hàng</span>
          </div>
          <div className="stepper-line"></div>
          <div className={`stepper-step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="stepper-circle">3</div>
            <span>Thanh toán</span>
          </div>
          <div className="stepper-line"></div>
          <div className={`stepper-step ${currentStep >= 4 ? 'active' : ''}`}>
            <div className="stepper-circle">✓</div>
            <span>Xác nhận</span>
          </div>
        </div>

        <Row>
        
        <Col lg={8}>
          {/* Cart at top */}
          <div className="checkout-cart-embedded">
            <CheckoutCart />
          </div>

            <Form onSubmit={handleSubmit(onSubmit)} id="checkoutForm">
              <div className="checkout-section">
                <div className="section-header-wrapper">
                  <h4 className="section-header">Shipping Information</h4>
                  {user && defaultAddress && (
                    <span className="default-address-badge">Địa chỉ mặc định</span>
                  )}
                </div>

                {user && defaultAddress && (
                  <Alert color="info" className="mb-4">
                    Thông tin được tự động điền từ tài khoản của bạn
                  </Alert>
                )}

                {!user && (
                  <Alert color="warning" className="mb-4">
                    Vui lòng đăng nhập để xem thông tin địa chỉ có sẵn
                  </Alert>
                )}

                {/* Customer Information Section */}
                <h5 className="subsection-header">Thông tin khách hàng</h5>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="fullName">Tên khách hàng *</Label>
                      <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="fullName"
                            type="text"
                            placeholder="Nguyễn Văn A"
                            {...field}
                            invalid={!!errors.fullName}
                          />
                        )}
                      />
                      {errors.fullName && <span className="error-text">{errors.fullName.message}</span>}
                    </FormGroup>
                  </Col>
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
                            placeholder="user@example.com"
                            {...field}
                            invalid={!!errors.email}
                          />
                        )}
                      />
                      {errors.email && <span className="error-text">{errors.email.message}</span>}
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="phone">Số điện thoại *</Label>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="0901234567"
                            {...field}
                            invalid={!!errors.phone}
                          />
                        )}
                      />
                      {errors.phone && <span className="error-text">{errors.phone.message}</span>}
                    </FormGroup>
                  </Col>
                </Row>

                {/* Shipping Address Section */}
                <h5 className="subsection-header">Địa chỉ giao hàng</h5>
                
                {/* Debug: Show if addresses exist */}
                {user && !user.addresses && (
                  <Alert color="warning" className="mb-3">
                    User không có địa chỉ. Vui lòng cập nhật tài khoản.
                  </Alert>
                )}
                
                {/* Address Selection - Card Layout */}
                {user?.addresses && user.addresses.length > 0 && (
                  <Row>
                    <Col md={12}>
                      <Label>Chọn địa chỉ có sẵn *</Label>
                      <div className="address-cards-container">
                        {user.addresses.map((addr: any) => (
                          <div
                            key={addr.id}
                            className={`address-card ${addr.isDefault ? 'default' : ''}`}
                            onClick={() => {
                              reset({
                                ...getValues(),
                                receiverName: addr.receiverName || '',
                                receiverPhone: addr.phone || '',
                                addressLine: addr.addressLine || '',
                                ward: addr.ward || '',
                                district: addr.district || '',
                                city: addr.city || '',
                              });
                              setCurrentStep(2);
                            }}
                          >
                            {addr.isDefault && <span className="default-badge">Mặc định</span>}
                            <h6>{addr.receiverName}</h6>
                            <p className="address-text">
                              📍 {addr.addressLine}, {addr.ward}, {addr.district}, {addr.city}
                            </p>
                            <p className="phone-text">☎️ {addr.phone}</p>
                          </div>
                        ))}
                        <div
                          className="address-card add-new"
                          onClick={() => {
                            setUseNewAddress(true);
                            setCurrentStep(2);
                          }}
                        >
                          <h6>➕ Thêm địa chỉ mới</h6>
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}

                {/* Shipping Address Form Fields */}

                {/* Show "Add New Address" option even if no addresses */}
                {user && (!user.addresses || user.addresses.length === 0) && (
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label>Địa chỉ giao hàng</Label>
                        <button
                          type="button"
                          className="btn btn-outline-primary w-100"
                          onClick={() => setUseNewAddress(true)}
                          style={{ marginBottom: '1rem', borderColor: '#173036', color: '#173036' }}
                        >
                          Thêm địa chỉ mới
                        </button>
                      </FormGroup>
                    </Col>
                  </Row>
                )}

                {/* New Address Form */}
                {useNewAddress && (
                  <Row>
                    <Col md={12}>
                      <Alert color="info" className="mb-3">
                        Nhập thông tin địa chỉ mới. Nó sẽ được lưu vào tài khoản của bạn sau khi thanh toán.
                      </Alert>
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => setUseNewAddress(false)}
                        style={{ color: '#173036', marginBottom: '1rem', padding: 0 }}
                      >
                        ✕ Quay lại
                      </button>
                    </Col>
                    
                  </Row>
                )}

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="receiverName">Tên người nhận *</Label>
                      <Controller
                        name="receiverName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="receiverName"
                            type="text"
                            placeholder="Nguyễn Văn A"
                            {...field}
                            invalid={!!errors.receiverName}
                          />
                        )}
                      />
                      {errors.receiverName && <span className="error-text">{errors.receiverName.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="addressLine">Địa chỉ chi tiết *</Label>
                      <Controller
                        name="addressLine"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="addressLine"
                            type="text"
                            placeholder="123 Đường Lê Lợi, Phường..."
                            {...field}
                            invalid={!!errors.addressLine}
                          />
                        )}
                      />
                      {errors.addressLine && <span className="error-text">{errors.addressLine.message}</span>}
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="ward">Phường/Xã *</Label>
                      <Controller
                        name="ward"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="ward"
                            type="text"
                            placeholder="Phường Bến Nghé"
                            {...field}
                            invalid={!!errors.ward}
                          />
                        )}
                      />
                      {errors.ward && <span className="error-text">{errors.ward.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="district">Quận/Huyện *</Label>
                      <Controller
                        name="district"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="district"
                            type="text"
                            placeholder="Quận 1"
                            {...field}
                            invalid={!!errors.district}
                          />
                        )}
                      />
                      {errors.district && <span className="error-text">{errors.district.message}</span>}
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="city">Tỉnh/Thành phố *</Label>
                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="city"
                            type="text"
                            placeholder="TP. Hồ Chí Minh"
                            {...field}
                            invalid={!!errors.city}
                          />
                        )}
                      />
                      {errors.city && <span className="error-text">{errors.city.message}</span>}
                    </FormGroup>
                  </Col>
                </Row>
              </div>

              <div className="checkout-section mt-4">
                <h4 className="section-header">💳 Thông tin thanh toán</h4>

                {/* Payment Method Selection - Modern Card Style */}
                <h5 className="subsection-header">Phương thức thanh toán</h5>
                <div className="payment-methods-container">
                  <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <>
                        <div
                          className={`payment-method-card ${field.value === 'cash' ? 'active' : ''}`}
                          onClick={() => field.onChange('cash')}
                        >
                          <div className="payment-icon">💵</div>
                          <div className="payment-content">
                            <h6>Tiền mặt</h6>
                            <p>Thanh toán khi nhận hàng</p>
                          </div>
                          <div className={`payment-radio ${field.value === 'cash' ? 'checked' : ''}`} />
                        </div>

                        <div
                          className={`payment-method-card ${field.value === 'card' ? 'active' : ''}`}
                          onClick={() => field.onChange('card')}
                        >
                          <div className="payment-icon">💳</div>
                          <div className="payment-content">
                            <h6>Thẻ tín dụng</h6>
                            <p>Visa, Mastercard, AmEx</p>
                          </div>
                          <div className={`payment-radio ${field.value === 'card' ? 'checked' : ''}`} />
                        </div>

                        <div
                          className={`payment-method-card ${field.value === 'transfer' ? 'active' : ''}`}
                          onClick={() => field.onChange('transfer')}
                        >
                          <div className="payment-icon">🏦</div>
                          <div className="payment-content">
                            <h6>Chuyển khoản</h6>
                            <p>Chuyển khoản ngân hàng</p>
                          </div>
                          <div className={`payment-radio ${field.value === 'transfer' ? 'checked' : ''}`} />
                        </div>
                      </>
                    )}
                  />
                </div>
                {errors.paymentMethod && (
                  <Row>
                    <Col md={12}>
                      <span className="error-text">{errors.paymentMethod.message}</span>
                    </Col>
                  </Row>
                )}

                {/* Card Details - Only show if payment method is 'card' */}
                {paymentMethod === 'card' && (
                  <>
                    <h5 className="subsection-header" style={{ marginTop: '1.5rem' }}>Chi tiết thẻ</h5>

                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="cardNumber">Số thẻ tín dụng *</Label>
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
                      <Col md={2}>
                        <FormGroup>
                          <Label for="cardCVC">CVV/CVC *</Label>
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
                      <Col md={3}>
                        <FormGroup>
                          <Label for="cardExpiry">Ngày hết hạn (MM/YY) *</Label>
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
                  </>
                )}

                {/* Payment method info messages */}
                {paymentMethod === 'cash' && (
                  <Alert color="info" className="mt-3">
                    💵 Vui lòng chuẩn bị tiền mặt. Bạn sẽ thanh toán khi nhận hàng.
                  </Alert>
                )}

                {paymentMethod === 'transfer' && (
                  <Alert color="info" className="mt-3">
                    🏦 Thông tin chuyển khoản sẽ được gửi sau khi đơn hàng được xác nhận.
                  </Alert>
                )}
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
              <span>{(getSubtotal() * 0.08).toLocaleString('vi-VN')}.000đ</span>
            </div>
            <hr />
            <div className="summary-item total">
              <span>Total</span>
              <span>{(getSubtotal() + getSubtotal() * 0.08).toLocaleString('vi-VN')}.000đ</span>
            </div>
            <Alert color="info" className="mt-4">
              <small>Your order will be delivered within 5-7 business days.</small>
            </Alert>
            <Button
                  variant="accent"
                  size="lg"
                  fullWidth
                  type="submit"
                  form="checkoutForm"
                  disabled={isSubmitting}
                  className="mt-4"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'} <ChevronRight size={20} />
                </Button>
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
