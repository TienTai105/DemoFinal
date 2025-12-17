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
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Email must be valid'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9\s\-\+\(\)]+$/, 'Phone number is invalid'),
  subject: Yup.string()
    .required('Subject is required')
    .min(3, 'Subject must be at least 3 characters'),
  message: Yup.string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters'),
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
          <h1>Get In Touch</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
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
              <h3>Address</h3>
              <p>123 Fashion Street<br />District 1, Ho Chi Minh City<br />Vietnam 70000</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Phone size={28} />
              </div>
              <h3>Phone</h3>
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
              <h3>Business Hours</h3>
              <p>Mon - Fri: 9:00 - 18:00<br />Sat - Sun: 10:00 - 16:00</p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="contact-main">
          <div className="contact-grid">
            {/* Form */}
            <div className="contact-form-wrapper">
              <h2>Send us a Message</h2>

              {submitSuccess && (
                <div className="success-message">
                  <span>✓ Message sent successfully! We'll get back to you soon.</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="contact-form" id="contactForm">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    placeholder="John Doe"
                    {...register('fullName')}
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && (
                    <span className="error-message">{errors.fullName.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your.email@example.com"
                    {...register('email')}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
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
