import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { MarqueeBanner } from './components/MarqueeBanner';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductModal } from './components/ProductModal';
import { ChatBot } from './components/ChatBot';
import { PromoModal } from './components/PromoModal';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Checkout } from './pages/Checkout';
import { Admin } from './pages/Admin';
import { ProductDetails } from './pages/ProductDetails';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { About } from './pages/About';
import { Profile } from './pages/Profile';
import { ResetPassword } from './pages/ResetPassword';
import { TrackOrder } from './pages/TrackOrder';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';

import { VideoSplash } from './components/VideoSplash';

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('lolly_shop_splash_shown');
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [activeModalProduct, setActiveModalProduct] = useState(null);

  if (showSplash) {
    return <VideoSplash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <StoreProvider>
      <Router>
        <div className="app-layout">
          {/* Announcement Banner */}
          <MarqueeBanner />

          {/* Main sticky navigation */}
          <Navbar onCartOpen={() => setCartOpen(true)} />

          {/* Page Routing */}
          <Routes>
            <Route 
              path="/" 
              element={<Home onProductClick={(p) => setActiveModalProduct(p)} />} 
            />
            <Route 
              path="/shop" 
              element={<Shop onProductClick={(p) => setActiveModalProduct(p)} />} 
            />
            <Route 
              path="/product/:id" 
              element={<ProductDetails />} 
            />
            <Route 
              path="/checkout" 
              element={<Checkout />} 
            />
            <Route 
              path="/contact" 
              element={<Contact />} 
            />
            <Route 
              path="/about" 
              element={<About />} 
            />
            <Route 
              path="/profile" 
              element={<Profile />} 
            />
            <Route 
              path="/login" 
              element={<Login />} 
            />
            <Route 
              path="/reset-password" 
              element={<ResetPassword />} 
            />
            <Route 
              path="/track-order/:id" 
              element={<TrackOrder />} 
            />
            <Route 
              path="/admin" 
              element={<Admin />} 
            />
            <Route 
              path="/privacy" 
              element={<PrivacyPolicy />} 
            />
            <Route 
              path="/terms" 
              element={<TermsOfService />} 
            />
          </Routes>

          {/* Footer shared across pages */}
          <Footer />

          {/* Persistent global widgets */}
          <CartDrawer 
            isOpen={cartOpen} 
            onClose={() => setCartOpen(false)} 
          />
          
          <ProductModal 
            product={activeModalProduct} 
            onClose={() => setActiveModalProduct(null)} 
          />

          <ChatBot />
          <PromoModal />
        </div>
      </Router>
    </StoreProvider>
  );
}

export default App;
