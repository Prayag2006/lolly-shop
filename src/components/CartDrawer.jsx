import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CandyVisual } from './SvgCandies';
import './CartDrawer.css';

export const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateCartQty, removeFromCart, getCartTotal } = useStore();
  const navigate = useNavigate();

  const total = getCartTotal();

  const handleCheckoutClick = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-overlay animate-fade-in" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <ShoppingCart size={22} />
            <h2>Sweet Cart ({cart.length})</h2>
          </div>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
            <X size={24} />
          </button>
        </div>



        {/* Content list */}
        <div className="cart-items-container">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
            <div className="empty-cart-emoji animate-float">
              <CandyVisual emoji="🍭" size={72} />
            </div>
              <h3>Your cart is empty</h3>
              <p>Add some sweetness to your day!</p>
              <button 
                className="btn btn-primary empty-shop-btn" 
                onClick={() => { onClose(); navigate('/shop'); }}
              >
                Go to Shop
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item glass-card">
                  {/* Visual gradient box */}
                  <div className="cart-item-visual">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="cart-item-image"
                    />
                  </div>

                  {/* Details */}
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <div className="cart-item-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="cart-item-category">{item.category}</span>
                      <span className="cart-item-weight-tag" style={{
                        fontSize: '9px',
                        fontWeight: '900',
                        background: 'rgba(231, 44, 131, 0.08)',
                        color: 'var(--color-primary)',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px'
                      }}>
                        {item.selectedWeight}
                      </span>
                    </div>
                    
                    <div className="cart-item-price">
                      ${item.price.toFixed(2)}
                    </div>

                    {/* Qty & delete */}
                    <div className="cart-item-controls">
                      <div className="qty-selector">
                        <button 
                          className="qty-btn" 
                          onClick={() => updateCartQty(item.id, item.selectedWeight, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-num">{item.quantity}</span>
                        <button 
                          className="qty-btn" 
                          onClick={() => updateCartQty(item.id, item.selectedWeight, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button 
                        className="item-remove-btn" 
                        onClick={() => removeFromCart(item.id, item.selectedWeight)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="cart-item-subtotal">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout */}
        {cart.length > 0 && (
          <div className="cart-footer-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span className="summary-total-amt">${total.toFixed(2)}</span>
            </div>
            <div className="summary-row shipping-row">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total-row">
              <span>Estimated Total</span>
              <span className="final-total-amt">
                ${(total + 5).toFixed(2)}
              </span>
            </div>

            <button 
              className="btn btn-primary cart-checkout-btn"
              onClick={handleCheckoutClick}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
