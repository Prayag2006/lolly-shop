import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft, CheckCircle2, Ticket } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CandyVisual } from '../components/SvgCandies';
import confetti from 'canvas-confetti';
import './Checkout.css';

export const Checkout = () => {
  const { cart, getCartTotal, placeOrder, currentUser } = useStore();
  const navigate = useNavigate();

  // Wizard Step: 1 = Shipping, 2 = Payment, 3 = Success
  const [step, setStep] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Form Field States
  const [shippingForm, setShippingForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  // Form Validations
  const isShippingValid = () => {
    return (
      shippingForm.name.trim() &&
      shippingForm.email.includes('@') &&
      shippingForm.phone.trim().length >= 8 &&
      shippingForm.address.trim() &&
      shippingForm.city.trim() &&
      shippingForm.zip.trim().length === 4
    );
  };

  const isPaymentValid = () => {
    return (
      paymentForm.cardNumber.replace(/\s/g, '').length === 16 &&
      paymentForm.expiry.includes('/') &&
      paymentForm.cvv.length === 3
    );
  };

  // Pricing math
  const subtotal = getCartTotal();
  const shippingFee = 19.00; // Flat $19 delivery charge on any order
  const discountAmt = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmt + shippingFee;

  // Coupon apply
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (couponCode.toUpperCase() === 'SWEET10') {
      setDiscountPercent(10);
      setCouponSuccess('SWEET10 coupon applied! 10% discount subtracted.');
    } else {
      setCouponError('Invalid coupon code. Try code: SWEET10');
    }
  };

  // Navigation handlers
  const handleNextStep = () => {
    if (step === 1 && isShippingValid()) {
      setStep(2);
    }
  };

  const handleBackStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isPaymentValid()) return;

    // Submit order
    const order = await placeOrder({
      ...shippingForm,
      discountCode: discountPercent > 0 ? 'SWEET10' : 'None'
    }, finalTotal, shippingFee);

    setPlacedOrderDetails(order);
    setStep(3);

    // Throw confetti!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="checkout-empty container">
        <div className="no-results glass-card">
          <span className="no-results-emoji">🛒</span>
          <h3>Your cart is empty</h3>
          <p>Please add products to your cart before proceeding to checkout.</p>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      {/* Step Indicators */}
      {step !== 3 && (
        <div className="checkout-steps">
          <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-label">Shipping</span>
          </div>
          <div className="step-line"></div>
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-label">Payment</span>
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="checkout-grid">
        {/* Left Column: Forms */}
        <div className="checkout-form-column">
          {step === 1 && (
            <div className="glass-card checkout-form-card">
              <h2>Shipping Details</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="Sarah Jenkins"
                      value={shippingForm.name}
                      onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row two-cols">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="sarah.j@gmail.com"
                      value={shippingForm.email}
                      onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="021 123 4567"
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Street Address</label>
                    <input
                      type="text"
                      placeholder="24 Lollypop Lane, Grey Lynn"
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row two-cols">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      placeholder="Auckland"
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Postcode (4 digits)</label>
                    <input
                      type="text"
                      placeholder="1021"
                      value={shippingForm.zip}
                      onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value.replace(/[^0-9]/g, '') })}
                      maxLength="4"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary next-btn"
                    disabled={!isShippingValid()}
                  >
                    Continue to Payment <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="glass-card checkout-form-card">
              <h2>Payment Details</h2>
              <form onSubmit={handlePlaceOrder}>
                <div className="mock-banner">
                  🔒 Safe Mockup Checkout Sandbox
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Card Number (16 digits)</label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      value={paymentForm.cardNumber}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                        const formatted = v.match(/.{1,4}/g)?.join(' ') || v;
                        setPaymentForm({ ...paymentForm, cardNumber: formatted.slice(0, 19) });
                      }}
                      maxLength="19"
                      required
                    />
                  </div>
                </div>

                <div className="form-row two-cols">
                  <div className="form-group">
                    <label>Expiry Date (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={paymentForm.expiry}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\//g, '').replace(/[^0-9]/gi, '');
                        let formatted = v;
                        if (v.length > 2) {
                          formatted = `${v.slice(0, 2)}/${v.slice(2, 4)}`;
                        }
                        setPaymentForm({ ...paymentForm, expiry: formatted.slice(0, 5) });
                      }}
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV (3 digits)</label>
                    <input
                      type="password"
                      placeholder="123"
                      value={paymentForm.cvv}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/gi, '');
                        setPaymentForm({ ...paymentForm, cvv: v.slice(0, 3) });
                      }}
                      maxLength="3"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions two-btns">
                  <button type="button" className="btn btn-secondary back-btn" onClick={handleBackStep}>
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary place-btn"
                    disabled={!isPaymentValid()}
                  >
                    Place Sweet Order (${finalTotal.toFixed(2)})
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && placedOrderDetails && (
            <div className="glass-card success-card animate-slide-up">
              <div className="success-icon">
                <CheckCircle2 size={64} />
              </div>
              <h2>Order Placed Successfully!</h2>
              <p className="success-tag">Thank you for shopping with Best Lolly Shop! Your order receipt and live delivery tracker link have been sent to your email.</p>
              
              <div className="order-receipt glass-card">
                <div className="receipt-row">
                  <span>Order Reference:</span>
                  <strong>{placedOrderDetails.id}</strong>
                </div>
                <div className="receipt-row">
                  <span>Date:</span>
                  <span>{placedOrderDetails.date}</span>
                </div>
                <div className="receipt-row">
                  <span>Total Amount Paid:</span>
                  <strong>${placedOrderDetails.total.toFixed(2)}</strong>
                </div>
                <div className="receipt-row">
                  <span>Delivery Address:</span>
                  <span>{placedOrderDetails.customer.address}, {placedOrderDetails.customer.city}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '25px', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate(`/track-order/${placedOrderDetails.id}`)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)', border: 'none', boxShadow: '0 6px 18px rgba(79, 172, 254, 0.35)' }}
                >
                  <span>Track Delivery Live 🚚</span>
                </button>
                <button className="btn btn-secondary success-home-btn" onClick={() => navigate('/')} style={{ margin: 0 }}>
                  Back to Sweet Home
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Cart Summary */}
        {step !== 3 && (
          <div className="checkout-summary-column">
            <div className="glass-card summary-sticky-card">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {cart.map((item) => (
                  <div key={item.id} className="summary-item-row">
                    <div className="summary-item-visual">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="summary-item-image"
                      />
                    </div>
                    <div className="summary-item-name-qty">
                      <h4>{item.name}</h4>
                      <p style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span>Qty: {item.quantity}</span>
                        <span style={{
                          fontSize: '9px',
                          fontWeight: '900',
                          background: 'rgba(231, 44, 131, 0.08)',
                          color: 'var(--color-primary)',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          textTransform: 'uppercase'
                        }}>{item.selectedWeight}</span>
                      </p>
                    </div>
                    <div className="summary-item-cost">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon inputs */}
              <form className="coupon-form" onSubmit={handleApplyCoupon}>
                <div className="coupon-input-wrapper">
                  <Ticket size={18} />
                  <input
                    type="text"
                    placeholder="Enter Coupon (SWEET10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-secondary coupon-apply-btn">
                  Apply
                </button>
              </form>
              
              {couponError && <p className="coupon-msg error-msg">{couponError}</p>}
              {couponSuccess && <p className="coupon-msg success-msg">{couponSuccess}</p>}

              <div className="summary-divider"></div>

              {/* Prices breakdown */}
              <div className="breakdown-rows">
                <div className="b-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmt > 0 && (
                  <div className="b-row discount-row">
                    <span>Discount (10%)</span>
                    <span>-${discountAmt.toFixed(2)}</span>
                  </div>
                )}
                <div className="b-row">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="b-row final-row">
                  <span>Grand Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
