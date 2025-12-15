import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import CartDrawer from './components/CartDrawer/CartDrawer';
import { HomePage } from './pages/HomePage';
import ProductDetailPage  from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import ProductListPage  from './pages/ProductListPage';
import ShippingPage  from './pages/ShippingPage';  
import './App.scss';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

/**
 * Main App Component
 * Routes and layout wrapper for the e-commerce application
 * Provides QueryClient context for data fetching
 */
function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Initialize AOS animations on mount
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      easing: 'ease-in-out',
      offset: 0, // Animations trigger immediately when elements are visible
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app-container">
          {/* Header Navigation */}
          <Header onCartClick={() => setDrawerOpen(true)} />

          {/* Global Cart Drawer */}
          <CartDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

          {/* Main Content */}
          <main className="main-content">
            <Routes>
              {/* Home */}
              <Route path="/" element={<HomePage />} />

              {/* ✅ PRODUCT LIST – PHẦN CỦA BẠN */}
              <Route path="/products" element={<ProductListPage />} />

              {/* Product Detail */}
              <Route path="/product/:id" element={<ProductDetailPage />} />
              
              {/* Checkout */}
              <Route path="/checkout" element={<CheckoutPage />} />

              {/* ✅ SHIPPING & DELIVERY – PHẦN CỦA BẠN */}
              <Route path="/shipping" element={<ShippingPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Toast Notifications */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#173036',
                color: '#fff',
                fontSize: '14px',
                borderRadius: '8px',
                padding: '16px',
              },
              success: {
                style: {
                  background: '#173036',
                },
                icon: '✓',
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
