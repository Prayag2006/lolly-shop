import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { MarqueeBanner } from './components/MarqueeBanner';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductModal } from './components/ProductModal';
import { ChatBot } from './components/ChatBot';
import { PromoModal } from './components/PromoModal';
import { CookieConsent } from './components/CookieConsent';
import { VideoSplash } from './components/VideoSplash';

// Lazy load Pages (Code splitting)
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Shop = lazy(() => import('./pages/Shop').then(m => ({ default: m.Shop })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));
const ProductDetails = lazy(() => import('./pages/ProductDetails').then(m => ({ default: m.ProductDetails })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const TrackOrder = lazy(() => import('./pages/TrackOrder').then(m => ({ default: m.TrackOrder })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/TermsOfService').then(m => ({ default: m.TermsOfService })));
const Blog = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const BlogPost = lazy(() => import('./pages/BlogPost').then(m => ({ default: m.BlogPost })));
const FAQ = lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));

// Lightweight fallback loader for lazy-loaded pages
const PageLoadingFallback = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px',
    fontFamily: 'var(--font-heading, sans-serif)'
  }}>
    <style>{`
      @keyframes page-loader-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .page-loader-spinner {
        width: 40px;
        height: 40px;
        border: 3.5px solid rgba(231, 44, 131, 0.15);
        border-top-color: #e72c83;
        border-radius: 50%;
        animation: page-loader-spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
    `}</style>
    <div className="page-loader-spinner" />
    <span style={{
      color: 'var(--color-text-muted)',
      fontSize: '14px',
      fontWeight: '600',
      letterSpacing: '0.5px'
    }}>Loading sweet treats...</span>
  </div>
);

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Bypass splash screen if already shown in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('lolly_shop_splash_shown') === 'true') {
      return false;
    }
    // Bypass splash screen entirely on password reset path
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/reset-password')) {
      return false;
    }
    // Bypass splash screen for search engine crawlers to prevent indexing empty tags
    if (typeof navigator !== 'undefined') {
      const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
      if (isBot) return false;
    }
    // Bypass splash screen entirely on slow connections (2G, 3G, or saveData active)
    const conn = typeof navigator !== 'undefined' && (navigator.connection || navigator.mozConnection || navigator.webkitConnection);
    if (conn) {
      if (conn.saveData) return false;
      const slowTypes = ['slow-2g', '2g', '3g'];
      if (slowTypes.includes(conn.effectiveType)) return false;
    }
    return true; // Show on full page load
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [activeModalProduct, setActiveModalProduct] = useState(null);

  if (showSplash) {
    return <VideoSplash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <StoreProvider>
      <ThemeInjector />
      <Router>
        <div className="app-layout">
          {/* Announcement Banner */}
          <MarqueeBanner />

          {/* Main sticky navigation */}
          <Navbar onCartOpen={() => setCartOpen(true)} />

          {/* Page Routing */}
          <Suspense fallback={<PageLoadingFallback />}>
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
              <Route 
                path="/blog" 
                element={<Blog />} 
              />
              <Route 
                path="/blog/:slug" 
                element={<BlogPost />} 
              />
              <Route 
                path="/faq" 
                element={<FAQ />} 
              />
            </Routes>
          </Suspense>

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
          <CookieConsent />
        </div>
      </Router>
    </StoreProvider>
  );
}

const ThemeInjector = () => {
  const { settings } = useStore();
  const themeColors = settings?.themeColors || {
    primary: '#e72c83',
    secondary: '#f472b6',
    background: '#faf9fc',
    text: '#2d2645'
  };
  const fontFamily = settings?.fonts || 'Outfit, sans-serif';

  return (
    <style>{`
      :root {
        --color-primary: ${themeColors.primary || '#e72c83'} !important;
        --color-secondary: ${themeColors.secondary || '#f472b6'} !important;
        --color-bg: ${themeColors.background || '#faf9fc'} !important;
        --color-text: ${themeColors.text || '#2d2645'} !important;
        --font-primary: ${fontFamily} !important;
      }
      body {
        font-family: var(--font-primary) !important;
        background-color: var(--color-bg) !important;
        color: var(--color-text) !important;
      }
    `}</style>
  );
};

export default App;
