// =====================================================
// SHIPPING BANNER COMPONENT
// =====================================================
// Banner with shipping/delivery benefits and icons

import React from 'react';
import {
  Truck,
  Shield,
  RotateCcw,
  Headphones,
} from 'lucide-react';
import './ShippingBanner.scss';

interface ShippingBenefit {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

/**
 * Shipping Banner Component
 * Displays key shipping/delivery benefits with icons
 * Benefits: Free Shipping, Secure Payment, Easy Returns, 24/7 Support
 */
export const ShippingBanner: React.FC = () => {
  const benefits: ShippingBenefit[] = [
    {
      id: '1',
      icon: <Truck size={40} />,
      title: 'Vận Chuyển Miễn Phí',
      description: 'Cho đơn hàng trên 50đ',
    },
    {
      id: '2',
      icon: <Shield size={40} />,
      title: 'Thanh Toán An Toàn',
      description: 'Giao dịch 100% bảo mật',
    },
    {
      id: '3',
      icon: <RotateCcw size={40} />,
      title: 'Dễ Dàng Hoàn Trả',
      description: 'Chính sách hoàn trả 30 ngày',
    },
    {
      id: '4',
      icon: <Headphones size={40} />,
      title: 'Hỗ Trợ 24/7',
      description: 'Chăm sóc khách hàng chuyên dụng',
    },
  ];

  return (
    <section className="shipping-banner">
      <div className="shipping-container">
        <div className="benefits-grid">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="benefit-item">
              <div className="benefit-icon">{benefit.icon}</div>
              <div className="benefit-content">
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
