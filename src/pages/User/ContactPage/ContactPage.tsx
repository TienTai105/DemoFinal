import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import './ContactPage.scss';

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// Validation schema
const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Tên đầy đủ là bắt buộc')
    .min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: Yup.string()
    .required('Email là bắt buộc')
    .email('Email phải hợp lệ'),
  phone: Yup.string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^[0-9\s\-\+\(\)]+$/, 'Số điện thoại không hợp lệ'),
  subject: Yup.string()
    .required('Chủ đề là bắt buộc')
    .min(3, 'Chủ đề phải có ít nhất 3 ký tự'),
  message: Yup.string()
    .required('Tin nhắn là bắt buộc')
    .min(10, 'Tin nhắn phải có ít nhất 10 ký tự'),
});

export const ContactPage: React.FC = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // TODO: Send to backend API
      console.log('Form data:', data);
      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Liên Hệ Với Chúng Tôi</h1>
          <p>Chúng tôi rất muốn nghe từ bạn. Gửi cho chúng tôi một tin nhắn và chúng tôi sẽ phản hồi soonest có thể.</p>
        </div>
      </section>

      <div className="contact-container">
        {/* Contact Info Cards */}
        <section className="contact-info">
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">
                <MapPin size={28} />
              </div>
              <h3>Địa Chỉ</h3>
              <p>123 Fashion Street<br />District 1, Ho Chi Minh City<br />Vietnam 70000</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Phone size={28} />
              </div>
              <h3>Điện Thoại</h3>
              <p>+84 123 456 789<br />+84 987 654 321</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Mail size={28} />
              </div>
              <h3>Email</h3>
              <p>info@nhom7.com<br />support@nhom7.com</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Clock size={28} />
              </div>
              <h3>Giờ Làm Việc</h3>
              <p>Thứ Hai - Thứ Sáu: 9:00 - 18:00<br />Thứ Bảy - Chủ Nhật: 10:00 - 16:00</p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="contact-main">
          <div className="contact-grid">
            {/* Form */}
            <div className="contact-form-wrapper">
              <h2>Gửi Tin Nhắn Cho Chúng Tôi</h2>

              {submitSuccess && (
                <div className="success-message">
                  <span>✓ Tin nhắn được gửi thành công! Chúng tôi sẽ liên hệ lại bạn sớm.</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="contact-form" id="contactForm">
                <div className="form-group">
                  <label htmlFor="fullName">Tên Đầy Đủ</label>
                  <input
                    type="text"
                    id="fullName"
                    placeholder="Nguyễn Văn A"
                    {...register('fullName')}
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && (
                    <span className="error-message">{errors.fullName.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Địa Chỉ Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="email@example.com"
                    {...register('email')}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Số Điện Thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="+84 123 456 789"
                    {...register('phone')}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    placeholder="How can we help?"
                    {...register('subject')}
                    className={errors.subject ? 'error' : ''}
                  />
                  {errors.subject && (
                    <span className="error-message">{errors.subject.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    placeholder="Your message here..."
                    rows={5}
                    {...register('message')}
                    className={errors.message ? 'error' : ''}
                  />
                  {errors.message && (
                    <span className="error-message">{errors.message.message}</span>
                  )}
                </div>

                <button type="submit" className="submit-btn">
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="contact-map-wrapper">
              <h2>Find Us Here</h2>
              <div className="map-container">
                <iframe
                  title="Google Map - NHOM_7 Fashion"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5408460491534!2d106.66280147346213!3d10.762622589366054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f36c3a97e8d%3A0x123456789!2s123%20Fashion%20Street%2C%20District%201!5e0!3m2!1sen!2svi!4v1702640000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
