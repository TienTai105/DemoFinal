import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Cart } from './components/Cart/Cart';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import './App.scss';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

/**
 * Main App Component
 * Routes and layout wrapper for the e-commerce application
 * Provides QueryClient context for data fetching
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app-container">
          {/* Header Navigation */}
          <Header />

          {/* Main Content Area */}
          <main className="main-content">
            <Routes>
              {/* Home / Landing Page */}
              <Route path="/" element={<HomePage />} />
              
              {/* Products Listing */}
              <Route path="/products" element={<HomePage />} />
              
              {/* Product Detail */}
              <Route path="/product/:id" element={<ProductDetailPage />} />
              
              {/* Shopping Cart */}
              <Route path="/cart" element={<Cart />} />
              
              {/* Checkout */}
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
