import React, { useState } from 'react';
import { ShopProvider } from './context/ShopContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';

// Customer Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';
import PCBuilder from './pages/PCBuilder';
import Compare from './pages/Compare';
import LaptopFinder from './pages/LaptopFinder';
import Warranty from './pages/Warranty';
import ServiceCenter from './pages/ServiceCenter';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin ERP Dashboard
import AdminDashboard from './dashboard/AdminDashboard';

export default function App() {
  const [activePage, setActivePage] = useState(() => {
    if (window.location.pathname === '/admin') return 'admin';
    return 'home';
  });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [recentOrder, setRecentOrder] = useState(null);

  React.useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/admin') {
        setActivePage('admin');
      } else if (window.location.pathname === '/') {
        setActivePage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (pageStr) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (pageStr === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (pageStr === 'home') {
      window.history.pushState({}, '', '/');
    }

    if (pageStr.startsWith('product-detail:')) {
      const pId = pageStr.split(':')[1];
      setSelectedProductId(pId);
      setActivePage('product-detail');
      return;
    }

    setActivePage(pageStr);
  };

  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);
    setActivePage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCompleted = (orderData) => {
    setRecentOrder(orderData);
    setActivePage('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper parser for category or search filter encoded in page string e.g. "products:category=gpu"
  let categoryFilter = '';
  let searchFilter = '';
  if (activePage.startsWith('products:')) {
    const params = activePage.split(':')[1];
    if (params.startsWith('category=')) categoryFilter = params.split('=')[1];
    if (params.startsWith('search=')) searchFilter = decodeURIComponent(params.split('=')[1]);
  }

  return (
    <ShopProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar activePage={activePage} setActivePage={handleNavigate} />

        <main style={{ flex: 1 }}>
          {activePage === 'home' && (
            <Home onNavigate={handleNavigate} onSelectProduct={handleSelectProduct} />
          )}

          {(activePage === 'products' || activePage.startsWith('products:')) && (
            <Products categoryFilter={categoryFilter} searchFilter={searchFilter} onSelectProduct={handleSelectProduct} />
          )}

          {activePage === 'product-detail' && (
            <ProductDetails productId={selectedProductId} onNavigate={handleNavigate} />
          )}

          {activePage === 'cart' && (
            <Cart onNavigate={handleNavigate} />
          )}

          {activePage === 'checkout' && (
            <Checkout onNavigate={handleNavigate} onOrderCompleted={handleOrderCompleted} />
          )}

          {activePage === 'order-success' && (
            <OrderSuccess order={recentOrder} onNavigate={handleNavigate} />
          )}

          {activePage === 'track-order' && (
            <TrackOrder />
          )}

          {activePage === 'pc-builder' && (
            <PCBuilder onNavigate={handleNavigate} />
          )}

          {activePage === 'compare' && (
            <Compare onNavigate={handleNavigate} onSelectProduct={handleSelectProduct} />
          )}

          {activePage === 'laptop-finder' && (
            <LaptopFinder onSelectProduct={handleSelectProduct} />
          )}

          {activePage === 'warranty' && (
            <Warranty />
          )}

          {activePage === 'service-center' && (
            <ServiceCenter />
          )}

          {(activePage === 'login' || activePage === 'account') && (
            <Login onNavigate={handleNavigate} />
          )}

          {activePage === 'register' && (
            <Register onNavigate={handleNavigate} />
          )}

          {activePage === 'admin' && (
            <AdminDashboard onNavigate={handleNavigate} />
          )}
        </main>

        <Footer setActivePage={handleNavigate} />
        <FloatingActions onNavigate={handleNavigate} />
      </div>
    </ShopProvider>
  );
}
