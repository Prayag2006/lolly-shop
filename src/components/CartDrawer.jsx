import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Sparkles, Truck, ShieldCheck, Flame, Gift, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CandyVisual } from './SvgCandies';
import './CartDrawer.css';

export const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateCartQty, removeFromCart, getCartTotal } = useStore();
  const navigate = useNavigate();

  const total = getCartTotal();

  const quickCategories = [
    { label: 'Sour Straps', path: '/shop?category=Sour%20Lollies', icon: '⚡' },
    { label: 'Gummies', path: '/shop?category=NZ%20Lollies', icon: '🍬' },
    { label: 'Chocolates', path: '/shop?category=Chocolates', icon: '🍫' },
    { label: 'TikTok Viral', path: '/shop?category=TikTok%20Viral', icon: '🔥' },
  ];

  const handleCheckoutClick = () => {
    onClose();
    navigate('/checkout');
  };

  const handleNavigateTo = (path) => {
    onClose();
    navigate(path);
  };

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-overlay animate-fade-in" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Aesthetic Glow Accents in Drawer */}
        <div className="drawer-glow-top"></div>
        <div className="drawer-glow-bottom"></div>

        {/* Modern Glass Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <div className="cart-header-icon-wrapper">
              <ShoppingBag size={20} className="header-bag-icon" />
              {cart.length > 0 && <span className="cart-badge-dot"></span>}
            </div>
            <div>
              <h2>Sweet Cart</h2>
              <span className="cart-count-pill">{cart.reduce((s, i) => s + (i.quantity || 1), 0)} items</span>
            </div>
          </div>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Cart Items or Rich Aesthetic Empty State */}
        <div className="cart-items-container">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              {/* Central Glowing Mascot Illustration */}
              <div className="empty-visual-wrapper">
                <div className="empty-aura-glow"></div>
                <div className="empty-aura-ring"></div>
                <div className="empty-floating-candy animate-float">
                  <CandyVisual emoji="🍭" size={88} />
                </div>
                <div className="floating-sparkle s-1">✨</div>
                <div className="floating-sparkle s-2">🍬</div>
                <div className="floating-sparkle s-3">💖</div>
              </div>

              <div className="empty-text-group">
                <h3 className="empty-title">Your Sweet Cart is Empty</h3>
                <p className="empty-subtitle">
                  Looks like you haven't indulged yet! Discover the freshest Kiwi candies, imported treats & sour sweets.
                </p>
              </div>

              {/* Quick Pick Shortcuts */}
              <div className="empty-quick-picks">
                <span className="quick-picks-label"><Sparkles size={13} /> Trending Collections</span>
                <div className="quick-picks-grid">
                  {quickCategories.map((cat, idx) => (
                    <button 
                      key={idx}
                      className="quick-pick-pill"
                      onClick={() => handleNavigateTo(cat.path)}
                    >
                      <span className="pick-icon">{cat.icon}</span>
                      <span className="pick-text">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Call to Action Button */}
              <button 
                className="btn-aesthetic-shop" 
                onClick={() => handleNavigateTo('/shop')}
              >
                <span>✨ Explore Sweet Shop</span>
                <ArrowRight size={18} className="btn-arrow" />
              </button>

              {/* Trust Badges */}
              <div className="empty-trust-footer">
                <div className="trust-item">
                  <ShieldCheck size={14} />
                  <span>100% NZ Owned</span>
                </div>
                <span className="trust-divider">•</span>
                <div className="trust-item">
                  <Truck size={14} />
                  <span>Fast Delivery</span>
                </div>
                <span className="trust-divider">•</span>
                <div className="trust-item">
                  <CheckCircle2 size={14} />
                  <span>Fresh Stock</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedWeight}`} className="cart-item-card">
                  {/* Visual Image / Thumbnail */}
                  <div className="cart-item-visual">
                    <img 
                      src={item.image || '/hero_candy_display.png'} 
                      alt={item.name} 
                      className="cart-item-image"
                      onError={(e) => { e.target.src = '/hero_candy_display.png'; }}
                    />
                  </div>

                  {/* Details */}
                  <div className="cart-item-details">
                    <div className="cart-item-header-row">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <button 
                        className="item-remove-btn" 
                        onClick={() => removeFromCart(item.id, item.selectedWeight)}
                        aria-label="Remove item"
                        title="Remove product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="cart-item-meta">
                      <span className="cart-item-category">{item.category || 'Confectionery'}</span>
                      {item.selectedWeight && (
                        <span className="cart-item-weight-pill">
                          {item.selectedWeight}
                        </span>
                      )}
                    </div>
                    
                    <div className="cart-item-bottom-row">
                      <div className="qty-pill-controls">
                        <button 
                          className="qty-btn" 
                          onClick={() => updateCartQty(item.id, item.selectedWeight, item.quantity - 1)}
                          title="Decrease"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="qty-num">{item.quantity}</span>
                        <button 
                          className="qty-btn" 
                          onClick={() => updateCartQty(item.id, item.selectedWeight, item.quantity + 1)}
                          title="Increase"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div className="cart-item-pricing">
                        <span className="unit-price">${Number(item.price).toFixed(2)}/ea</span>
                        <span className="cart-item-subtotal">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout */}
        {cart.length > 0 && (
          <div className="cart-footer-summary">
            <div className="summary-card">
              <div className="summary-row">
                <span>Subtotal ({cart.reduce((s, i) => s + (i.quantity || 1), 0)} items)</span>
                <span className="summary-total-amt">${total.toFixed(2)}</span>
              </div>
              <div className="summary-row shipping-row">
                <span>NZ Delivery</span>
                <span className="shipping-status-val">Calculated at checkout</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total-row">
                <div className="total-label-group">
                  <span className="est-total-txt">Total Amount</span>
                  <span className="gst-hint">GST Included (NZD)</span>
                </div>
                <span className="final-total-amt">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button 
                className="btn-aesthetic-checkout"
                onClick={handleCheckoutClick}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} className="checkout-arrow-icon" />
              </button>

              <div className="checkout-trust-hints">
                <span>🔒 256-Bit Encrypted</span>
                <span>•</span>
                <span>⚡ Instant Order Dispatch</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

