import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft, CheckCircle2, Ticket, Lock, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CandyVisual } from '../components/SvgCandies';
import confetti from 'canvas-confetti';
import './Checkout.css';

export const Checkout = () => {
  const { cart, getCartTotal, placeOrder, currentUser, clearCart } = useStore();
  const navigate = useNavigate();

  // Wizard Step: 1 = Shipping, 2 = Payment, 3 = Success
  const [step, setStep] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Form Field States
  const [shippingForm, setShippingForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  });

  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [redirectingToStripe, setRedirectingToStripe] = useState(false);
  const [redirectingToGateway, setRedirectingToGateway] = useState(false);

  // Form Validations
  const isValidNZPhoneNumber = (phone) => {
    if (!phone) return false;
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    const nzPhonePattern = /^(?:\+?64|0)(?:2\d{7,9}|[34679]\d{7}|800\d{6,8}|508\d{6,8})$/;
    return nzPhonePattern.test(cleaned);
  };

  const isShippingValid = () => {
    return (
      shippingForm.name.trim() &&
      shippingForm.email.includes('@') &&
      isValidNZPhoneNumber(shippingForm.phone) &&
      shippingForm.address.trim() &&
      shippingForm.city.trim() &&
      shippingForm.zip.trim().length === 4
    );
  };

  // Shipping Method States
  const [shippingFee, setShippingFee] = useState(19.00); // Default flat rate
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState('');
  const [isHamilton, setIsHamilton] = useState(false);

  // All Hamilton NZ postcodes (32xx range)
  const HAMILTON_POSTCODES = [
    '3200','3201','3202','3203','3204','3205','3206','3207','3208','3209',
    '3210','3211','3212','3213','3214','3215','3216','3217','3218','3219',
    '3220','3240','3241','3242','3243','3244','3245','3246','3247','3248',
    '3249','3250','3251','3252','3253','3254','3255','3256','3257','3258',
    '3259','3260','3281','3282','3283','3284','3285','3286','3287','3288',
    '3289','3290','3291','3292','3293','3294','3295','3296','3297','3298','3299'
  ];

  const isHamiltonPostcode = (zip) => HAMILTON_POSTCODES.includes((zip || '').trim());

  // Fetch Shipping Rates from backend
  const fetchShippingRates = async (address, city, zip) => {
    setLoadingShipping(true);
    setShippingError('');
    try {
      const response = await fetch('/api/calculate-shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, city, zip, items: cart })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch courier prices.');
      }
      const data = await response.json();
      if (data.isHamilton) {
        setIsHamilton(true);
        if (data.validatedCity && shippingForm.city !== data.validatedCity) {
          setShippingForm(prev => ({ ...prev, city: data.validatedCity }));
        }
      } else {
        setIsHamilton(false);
      }
      if (data.rates && data.rates.length > 0) {
        setShippingOptions(data.rates);
        // Default to the first option
        const firstOption = data.rates[0];
        setSelectedOption(firstOption);
        setShippingFee(firstOption.price);
      } else {
        throw new Error('No shipping options returned.');
      }
    } catch (err) {
      console.error('Error fetching shipping rates:', err);
      setShippingError('Could not calculate shipping rates automatically. Using flat rate.');
      setIsHamilton(false);
      setShippingOptions([]);
      setSelectedOption(null);
      setShippingFee(19.00);
    } finally {
      setLoadingShipping(false);
    }
  };

  // ─── Instant Hamilton postcode detection ──────────────────────────────────
  // Fires as soon as a 4-digit Hamilton postcode (32xx) is typed —
  // no need for the rest of the form to be valid.
  useEffect(() => {
    if (shippingForm.zip.length === 4 && isHamiltonPostcode(shippingForm.zip)) {
      setIsHamilton(true);
      setShippingFee(0);
      setShippingOptions([{
        id: 'hamilton_free_delivery',
        name: 'Free Delivery — Hamilton, NZ 🎉',
        price: 0,
        eta: '1-2 business days'
      }]);
      setSelectedOption({
        id: 'hamilton_free_delivery',
        name: 'Free Delivery — Hamilton, NZ 🎉',
        price: 0,
        eta: '1-2 business days'
      });
      setShippingError('');
    } else if (shippingForm.zip.length === 4 && !isHamiltonPostcode(shippingForm.zip)) {
      // Non-Hamilton postcode — reset to default
      setIsHamilton(false);
      setShippingFee(19.00);
      setShippingOptions([]);
      setSelectedOption(null);
    }
  }, [shippingForm.zip]);

  // Automatically recalculate shipping when full form is complete (non-Hamilton)
  useEffect(() => {
    if (isShippingValid() && !isHamiltonPostcode(shippingForm.zip)) {
      const delayDebounce = setTimeout(() => {
        fetchShippingRates(shippingForm.address, shippingForm.city, shippingForm.zip);
      }, 600);
      return () => clearTimeout(delayDebounce);
    } else if (!isHamiltonPostcode(shippingForm.zip)) {
      setShippingOptions([]);
      setSelectedOption(null);
      setShippingFee(19.00);
      setIsHamilton(false);
    }
  }, [shippingForm.address, shippingForm.city, shippingForm.zip]);

  // Pricing math
  const subtotal = getCartTotal();
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

  const handlePaymentCheckout = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setRedirectingToGateway(true);

    try {
      const endpoint = '/api/create-checkout-session';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerDetails: shippingForm,
          items: cart,
          finalTotal: finalTotal,
          shippingFee: shippingFee,
          deliveryCompany: selectedOption ? selectedOption.name : 'NZ Post Courier'
        })
      });
      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        setSubmitError(data.message || 'Failed to redirect to Stripe Payment gateway. Please try again.');
        setRedirectingToGateway(false);
      }
    } catch (err) {
      console.error('Error redirecting to Stripe:', err);
      setSubmitError('A connection error occurred. Please verify your internet connection and try again.');
      setRedirectingToGateway(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const sessionId = params.get('session_id');
    const orderId = params.get('order_id');

    if (status === 'success' && sessionId && orderId) {
      setVerifyingPayment(true);
      setStep(2);
      
      const verifyPayment = async () => {
        try {
          const endpoint = `/api/orders/${orderId}/confirm-payment`;

          const res = await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
          });
          const data = await res.json();
          if (res.ok) {
            setPlacedOrderDetails(data);
            setStep(3);
            clearCart();
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 }
            });
          } else {
            setVerificationError(data.message || 'Payment verification failed. Please contact customer support.');
          }
        } catch (err) {
          console.error('Payment verification error:', err);
          setVerificationError('A connection error occurred while verifying your payment. Please reload the page.');
        } finally {
          setVerifyingPayment(false);
        }
      };

      verifyPayment();
    } else if (status === 'cancel') {
      setStep(2);
      setSubmitError('Payment checkout session was cancelled. You can try checking out again.');
    }
  }, []);

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
                    {shippingForm.phone && !isValidNZPhoneNumber(shippingForm.phone) && (
                      <span className="validation-error" style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                        ⚠️ Only New Zealand phone numbers are valid (e.g. 021 123 4567 or 09 427 4993).
                      </span>
                    )}
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
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setShippingForm(prev => ({
                          ...prev,
                          zip: val,
                          // Auto-fill city to Hamilton when a Hamilton postcode is typed
                          city: isHamiltonPostcode(val) ? 'Hamilton' : prev.city
                        }));
                      }}
                      maxLength="4"
                      required
                      style={{
                        borderColor: shippingForm.zip.length === 4
                          ? isHamiltonPostcode(shippingForm.zip) ? '#10b981' : 'inherit'
                          : 'inherit'
                      }}
                    />
                    {/* Instant Hamilton free delivery badge */}
                    {shippingForm.zip.length === 4 && isHamiltonPostcode(shippingForm.zip) && (
                      <div style={{
                        marginTop: '8px',
                        padding: '10px 14px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#fff',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(16,185,129,0.25)',
                        animation: 'fadeIn 0.3s ease'
                      }}>
                        🎉 Hamilton postcode detected — <strong>FREE Delivery!</strong>
                      </div>
                    )}
                    {shippingForm.zip.length === 4 && !isHamiltonPostcode(shippingForm.zip) && (
                      <div style={{
                        marginTop: '6px',
                        fontSize: '11px',
                        color: '#8d879e'
                      }}>
                        💡 Hamilton postcodes (32xx) get FREE delivery!
                      </div>
                    )}
                  </div>
                </div>

                {/* NZ Post Shipping Method Selector */}
                {isShippingValid() && (
                  <div className="shipping-methods-section" style={{ marginTop: '25px', marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#2d2645', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🚚 NZ Post Delivery Options
                    </h3>
                    
                    {loadingShipping ? (
                      <div className="shipping-loading-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: 'rgba(255, 255, 255, 0.4)', borderRadius: '10px' }}>
                        <div className="spinner-small" style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid rgba(231, 44, 131, 0.1)',
                          borderLeftColor: 'var(--color-primary)',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        <span style={{ fontSize: '13px', color: '#615a75' }}>Calculating delivery prices with NZ Post...</span>
                      </div>
                    ) : shippingError ? (
                      <div className="shipping-error-msg" style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#b91c1c', fontSize: '13px' }}>
                        ⚠️ {shippingError}
                      </div>
                    ) : (
                      <div className="shipping-options-grid" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {isHamilton && (
                          <div 
                            className="hamilton-free-shipping-banner" 
                            style={{
                              padding: '14px 18px',
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: '#ffffff',
                              borderRadius: '12px',
                              fontSize: '14px',
                              fontWeight: '700',
                              textAlign: 'left',
                              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            <span>🎉 Great news! Your delivery address is in Hamilton, so you qualify for FREE delivery.</span>
                          </div>
                        )}
                        {shippingOptions.map((option) => (
                          <label 
                            key={option.id} 
                            className={`shipping-option-card ${selectedOption?.id === option.id ? 'active' : ''}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '14px 18px',
                              background: selectedOption?.id === option.id ? 'rgba(231, 44, 131, 0.06)' : 'rgba(255, 255, 255, 0.5)',
                              border: selectedOption?.id === option.id ? '2px solid var(--color-primary)' : '1px solid rgba(0, 0, 0, 0.08)',
                              borderRadius: '12px',
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              setSelectedOption(option);
                              setShippingFee(option.price);
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <input 
                                type="radio" 
                                name="shipping_option" 
                                checked={selectedOption?.id === option.id}
                                onChange={() => {}}
                                style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                              />
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                                <span style={{ fontWeight: '700', fontSize: '14px', color: '#2d2645' }}>{option.name}</span>
                                <span style={{ fontSize: '11px', color: '#8d879e' }}>📅 Delivery: {option.eta}</span>
                              </div>
                            </div>
                            <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--color-primary)' }}>
                              ${option.price.toFixed(2)}
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

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
              <h2>Complete Your Order</h2>
              {verifyingPayment ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: '15px' }}>
                  <div className="spinner" style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid rgba(231, 44, 131, 0.1)',
                    borderLeftColor: 'var(--color-primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                  <p style={{ fontWeight: '700', fontSize: '15px', color: 'var(--color-primary)' }}>Verifying secure transaction...</p>
                </div>
              ) : verificationError ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 20px', textAlign: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '40px' }}>⚠️</span>
                  <h3 style={{ color: '#ef4444' }}>Verification Issue</h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>{verificationError}</p>
                  <button type="button" className="btn btn-primary" onClick={() => { setVerificationError(''); navigate('/checkout'); }} style={{ marginTop: '10px' }}>
                    Try Checking Out Again
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePaymentCheckout}>
                  <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)' }}>
                    Payment Method
                  </h3>
                  <div className="payment-options-container" style={{ cursor: 'default' }}>
                    {/* Option 1: Stripe */}
                    <div 
                      className="payment-row active"
                      style={{ cursor: 'default' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--color-text)' }}>
                          Credit / Debit Card (Stripe)
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {/* Visa badge */}
                        <div style={{
                          background: 'white',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          height: '18px'
                        }}>
                          <span style={{ color: '#1a1f71', fontWeight: '900', fontSize: '9px', fontStyle: 'italic', letterSpacing: '-0.3px', lineHeight: 1 }}>VISA</span>
                        </div>
                        {/* Mastercard badge */}
                        <div style={{
                          background: 'white',
                          padding: '2px 5px',
                          borderRadius: '4px',
                          border: '1px solid rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '18px',
                          width: '28px'
                        }}>
                          <div style={{ display: 'flex', width: '16px', height: '10px', position: 'relative' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eb001b', position: 'absolute', left: 0 }} />
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f00', position: 'absolute', right: 0, opacity: 0.85 }} />
                          </div>
                        </div>
                        {/* Amex badge */}
                        <div style={{
                          background: '#0070d2',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          height: '18px'
                        }}>
                          <span style={{ color: 'white', fontWeight: '900', fontSize: '7px', letterSpacing: '0.1px', lineHeight: 1 }}>AMEX</span>
                        </div>
                      </div>
                    </div>

                    <div className="gateway-drawer stripe" style={{ display: 'block' }}>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <div className="drawer-icon-box stripe">
                          <ShieldCheck size={20} style={{ flexShrink: 0 }} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '800', color: 'var(--color-text)' }}>
                            Stripe Secure Checkout
                          </h4>
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                            You'll be redirected to a secure, 256-bit SSL encrypted Stripe portal to enter your card details. Lolly Shop never stores your private payment credentials.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="secure-badge-pill">
                      <Lock size={14} style={{ flexShrink: 0 }} />
                      <span>All transactions are secure and fully encrypted.</span>
                    </div>
                  </div>

                  {submitError && (
                    <div className="checkout-submit-error" style={{
                      color: '#e72c83',
                      background: '#fcedee',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '700',
                      textAlign: 'center',
                      marginBottom: '20px',
                      border: '1.5px solid rgba(231, 44, 131, 0.15)',
                      lineHeight: '1.4'
                    }}>
                      ❌ {submitError}
                    </div>
                  )}

                  <div className="form-actions two-btns">
                    <button type="button" className="btn btn-secondary back-btn" onClick={handleBackStep} disabled={redirectingToGateway}>
                      <ArrowLeft size={18} /> Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary place-btn stripe-pay-btn"
                      disabled={redirectingToGateway}
                    >
                      {redirectingToGateway ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                          <div className="spinner-btn" style={{
                            width: '14px',
                            height: '14px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderLeftColor: '#fff',
                            borderRadius: '50%',
                            animation: 'spin 0.6s linear infinite'
                          }} />
                          <span>Connecting to Stripe...</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                          <Lock size={16} style={{ flexShrink: 0, opacity: 0.9 }} />
                          <span>Pay Securely with Stripe (${finalTotal.toFixed(2)})</span>
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              )}
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
                  <span>{isHamilton ? 'Free Delivery - Hamilton' : (shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`)}</span>
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
