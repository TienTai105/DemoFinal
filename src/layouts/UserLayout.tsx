import { useState } from 'react';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import CartDrawer from '../components/CartDrawer/CartDrawer';

interface UserLayoutProps {
  children: React.ReactNode;
}

export const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="user-layout">
      <Header onCartClick={() => setDrawerOpen(true)} />
      <CartDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};
