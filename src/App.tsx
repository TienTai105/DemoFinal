import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Toaster } from 'react-hot-toast';
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes'; 
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
  // Initialize AOS animations on mount
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      easing: 'ease-in-out',
      offset: 0,
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Admin routes - no header/footer */}
          <Route path="/admin/*" element={<AdminLayout><AdminRoutes /></AdminLayout>} />
          
          {/* User routes - with header/footer */}
          <Route path="/*" element={<UserLayout><UserRoutes /></UserLayout>} />
        </Routes>

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
      </Router>
    </QueryClientProvider>
  );
}

export default App;
