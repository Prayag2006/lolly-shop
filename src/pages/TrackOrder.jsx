import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, MessageSquare, Truck, Package, Clock, ShieldCheck, ArrowLeft, Receipt } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './TrackOrder.css';

export const TrackOrder = () => {
  const { id } = useParams();
  const { orders } = useStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [driverProgress, setDriverProgress] = useState(0.4); // 0 to 1 progress along the delivery path
  const [estimatedMinutes, setEstimatedMinutes] = useState(18);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Parse rating query param from email URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialRating = params.get('rating');
    if (initialRating) {
      setRating(Number(initialRating));
    }
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a star rating first!');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${id}/feedback`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment })
      });
      const updated = await res.json();
      setOrder(updated);
      setSubmittedFeedback(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Real-time polling order details from backend every 3 seconds to react to Admin status updates
  useEffect(() => {
    const fetchOrder = () => {
      fetch(`/api/orders`)
        .then(res => res.json())
        .then(data => {
          const matched = data.find(o => o.id === id);
          if (matched) {
            setOrder(matched);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    };

    fetchOrder(); // Initial fetch
    const pollInterval = setInterval(fetchOrder, 3000);

    return () => clearInterval(pollInterval);
  }, [id]);

  // Set progress and ETA based on order.status and animate Out for Delivery status
  useEffect(() => {
    if (!order) return;

    const status = order.status;

    if (status === 'Pending') {
      setDriverProgress(0.0);
      setEstimatedMinutes(30);
    } else if (status === 'Processing') {
      setDriverProgress(0.12);
      setEstimatedMinutes(25);
    } else if (status === 'Packing') {
      setDriverProgress(0.25);
      setEstimatedMinutes(20);
    } else if (status === 'Completed') {
      setDriverProgress(1.0);
      setEstimatedMinutes(0);
    } else if (status === 'Cancelled') {
      setDriverProgress(0.0);
      setEstimatedMinutes(0);
    } else if (status === 'Out for Delivery') {
      // Start moving along the road! Let's animate it smoothly starting from 0.35 up to 0.95
      setDriverProgress(0.35);
      setEstimatedMinutes(15);

      const interval = setInterval(() => {
        setDriverProgress((prev) => {
          if (prev >= 0.94) {
            return 0.95;
          }
          const nextProgress = prev + 0.03;
          setEstimatedMinutes(Math.max(1, Math.round(15 * (1 - (nextProgress - 0.35) / 0.6))));
          return nextProgress;
        });
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [order]);

  if (loading) {
    return (
      <div className="tracking-loading-container">
        <div className="spinner"></div>
        <p>Locating your sweet package...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container tracking-error-container">
        <div className="glass-card error-card">
          <h2>😢 Order Locator Failed</h2>
          <p>We couldn't locate any active delivery route for order ID: <strong>{id}</strong>.</p>
          <p>Please double check the link in your email or place a new order.</p>
          <Link to="/shop" className="btn btn-primary">Go to Candy Shop</Link>
        </div>
      </div>
    );
  }

  // Calculate coordinates for the delivery vehicle along a curved bezier SVG path
  // Start: (80, 240) - Lolly Shop Warehouse
  // Control Point: (200, 80)
  // End: (320, 280) - Customer Destination
  const startX = 80;
  const startY = 240;
  const controlX1 = 140;
  const controlY1 = 100;
  const controlX2 = 240;
  const controlY2 = 120;
  const endX = 320;
  const endY = 280;

  // Bezier curve interpolation function (cubic)
  const getBezierPoint = (t) => {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    const x = mt3 * startX + 3 * mt2 * t * controlX1 + 3 * mt * t2 * controlX2 + t3 * endX;
    const y = mt3 * startY + 3 * mt2 * t * controlY1 + 3 * mt * t2 * controlY2 + t3 * endY;
    return { x, y };
  };

  const vehiclePos = getBezierPoint(driverProgress);

  // Status mapping logic
  const getStatusDisplay = () => {
    const s = order.status;
    if (s === 'Cancelled') {
      return {
        title: '❌ Order Cancelled',
        desc: 'This order was cancelled by the store administrator.',
        eta: 'Cancelled'
      };
    }
    if (s === 'Completed') {
      return {
        title: '🍭 Package Delivered!',
        desc: order.deliveryCompany
          ? `Your handpicked treats were successfully delivered to your address by ${order.deliveryCompany}.`
          : `Your handpicked treats were successfully delivered to your address in ${order.customer?.city || 'NZ'}.`,
        eta: 'Delivered'
      };
    }
    if (s === 'Out for Delivery') {
      if (order.deliveryCompany) {
        return {
          title: `🚚 In Transit via ${order.deliveryCompany}`,
          desc: `Your sweet treats are currently in transit with ${order.deliveryCompany}. Tracking Reference: ${order.deliveryReference || 'Awaiting Ref'}.`,
          eta: 'Courier Transit'
        };
      }
      return {
        title: `🚚 Out for Delivery — Arriving in ${estimatedMinutes} mins`,
        desc: 'Charlie is navigating the Lolly Express Van to deliver your sweet treats live.',
        eta: `${estimatedMinutes} Mins`
      };
    }
    if (s === 'Packing' || s === 'Processing') {
      return {
        title: '📦 Handcrafting & Packing Your Box',
        desc: order.deliveryCompany 
          ? `Our specialists are packing your treats. Once completed, your package will be picked up by ${order.deliveryCompany}.`
          : 'Our candy specialists are handpicking and bubble-wrapping your treats in the store.',
        eta: order.deliveryCompany ? 'Preparing Dispatch' : `${estimatedMinutes} Mins`
      };
    }
    // Default Pending
    return {
      title: '📋 Order Placed — Awaiting Packing',
      desc: order.deliveryCompany
        ? `Your order is confirmed! We are preparing to handpick your confections for dispatch via ${order.deliveryCompany}.`
        : 'Your order is confirmed! Charlie is preparing to pack your candies.',
      eta: order.deliveryCompany ? 'Awaiting Dispatch' : `${estimatedMinutes} Mins`
    };
  };

  const statusDisplay = getStatusDisplay();

  // Step flags mapping
  const isStep1Completed = ['Pending', 'Processing', 'Packing', 'Out for Delivery', 'Completed'].includes(order.status);
  const isStep1Active = order.status === 'Pending';
  
  const isStep2Completed = ['Processing', 'Packing', 'Out for Delivery', 'Completed'].includes(order.status);
  const isStep2Active = ['Processing', 'Packing'].includes(order.status);
  
  const isStep3Completed = ['Out for Delivery', 'Completed'].includes(order.status);
  const isStep3Active = order.status === 'Out for Delivery';
  
  const isStep4Completed = order.status === 'Completed';

  return (
    <div className="track-order-page">
      <div className="container">
        {/* Back Link */}
        <Link to="/profile" className="back-link">
          <ArrowLeft size={16} /> Back to My Profile
        </Link>

        {/* Top Header Card */}
        <div className="tracking-header-row glass-card">
          <div className="status-meta">
            <span className="order-badge">Order ID: {order.id}</span>
            <h1>{statusDisplay.title}</h1>
            <p className="delivery-status-description">{statusDisplay.desc}</p>
          </div>
          <div className="eta-badge-card">
            <Clock className="eta-icon" size={24} />
            <div className="eta-texts">
              <span className="eta-label">Estimated Delivery</span>
              <span className="eta-time">{statusDisplay.eta}</span>
            </div>
          </div>
        </div>

        {/* Courier Details Box */}
        {(order.deliveryCompany || order.deliveryReference) && (
          <div className="courier-tracking-banner glass-card" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 25px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(231, 44, 131, 0.03) 0%, rgba(144, 19, 254, 0.03) 100%)',
            border: '1.5px solid var(--color-primary-light)',
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '32px' }}>📦</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--color-text)' }}>
                  Shipped via Local Courier
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--color-text-light)' }}>
                  Your package has been handed over to <strong>{order.deliveryCompany || 'Local Delivery Partner'}</strong>.
                </p>
              </div>
            </div>
            {order.deliveryReference && (
              <div style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                padding: '10px 16px',
                borderRadius: '12px',
                textAlign: 'right'
              }}>
                <span style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Courier Tracking Ref
                </span>
                <strong style={{ fontSize: '15px', color: 'var(--color-text)', fontFamily: 'monospace' }}>
                  {order.deliveryReference}
                </strong>
              </div>
            )}
          </div>
        )}

        <div className="tracking-layout">
          {/* Left Column: Live Locator Map & Driver Card */}
          <div className="locator-map-column">
            {/* Live Locator Map Card */}
            <div className="map-card glass-card">
              <div className="map-header">
                <span className="live-indicator">
                  <span className="live-pulse"></span> LIVE LOCATION
                </span>
                <h3>Realtime Delivery Route</h3>
              </div>

              {/* Map SVG container */}
              <div className="svg-map-wrapper">
                <svg viewBox="0 0 400 360" className="delivery-svg-map">
                  {/* Map Grid / Streets background representation */}
                  <rect width="400" height="360" fill="var(--color-bg-map)" rx="12" />
                  
                  {/* Map Parks & Landmarks */}
                  <rect x="20" y="40" width="80" height="70" fill="var(--color-map-green)" rx="8" opacity="0.15" />
                  <rect x="270" y="30" width="100" height="80" fill="var(--color-map-green)" rx="8" opacity="0.15" />
                  <circle cx="200" cy="200" r="50" fill="var(--color-map-water)" opacity="0.1" />

                  {/* Grid Lines representing secondary roads */}
                  <line x1="0" y1="180" x2="400" y2="180" stroke="var(--color-map-road)" strokeWidth="4" strokeDasharray="6,6" opacity="0.3" />
                  <line x1="120" y1="0" x2="120" y2="360" stroke="var(--color-map-road)" strokeWidth="4" strokeDasharray="6,6" opacity="0.3" />
                  <line x1="280" y1="0" x2="280" y2="360" stroke="var(--color-map-road)" strokeWidth="4" strokeDasharray="6,6" opacity="0.3" />

                  {/* Principal Delivery Route Bezier Path */}
                  <path 
                    d={`M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`} 
                    fill="none" 
                    stroke="var(--color-border)" 
                    strokeWidth="6" 
                    strokeLinecap="round"
                    opacity="0.2"
                  />
                  <path 
                    d={`M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`} 
                    fill="none" 
                    stroke="var(--color-primary)" 
                    strokeWidth="6" 
                    strokeLinecap="round"
                    strokeDasharray="8, 6"
                    className="animated-route-dashes"
                  />

                  {/* Warehouse Starting Point */}
                  <g transform={`translate(${startX}, ${startY})`}>
                    <circle r="22" fill="var(--color-primary)" opacity="0.15" className="locator-pulse" />
                    <circle r="12" fill="var(--color-primary)" />
                    <text x="-7" y="4" fontSize="12" fill="white">🏪</text>
                  </g>
                  <text x={startX - 30} y={startY + 26} fontSize="11" fontWeight="700" fill="var(--color-text-light)" textAnchor="middle">
                    Lolly Store
                  </text>

                  {/* Customer Shipping Address Destination */}
                  <g transform={`translate(${endX}, ${endY})`}>
                    <circle r="22" fill="#10b981" opacity="0.15" className="locator-pulse" />
                    <circle r="12" fill="#10b981" />
                    <text x="-7" y="4" fontSize="12" fill="white">🏠</text>
                  </g>
                  <text x={endX} y={endY + 26} fontSize="11" fontWeight="700" fill="var(--color-text-light)" textAnchor="middle">
                    Your Address
                  </text>

                  {/* Animated Driver Van Locator */}
                  <g transform={`translate(${vehiclePos.x}, ${vehiclePos.y})`}>
                    <circle r="20" fill="var(--color-accent)" opacity="0.2" className="locator-pulse" />
                    <circle r="13" fill="var(--color-accent)" style={{ boxShadow: '0 0 10px rgba(144, 19, 254, 0.4)' }} />
                    <text x="-8" y="4" fontSize="13">🚚</text>
                  </g>
                </svg>
              </div>

              {/* Coordinates & Route Details Overlay */}
              <div className="route-details-grid">
                <div className="route-item">
                  <span className="label">ACTIVE STATUS</span>
                  <span className="value font-mono">
                    {order.deliveryCompany ? 'DISPATCHED' : `NZST: -${(36.8485 + (driverProgress * 0.05)).toFixed(4)}°, ${(174.7633 + (driverProgress * 0.04)).toFixed(4)}°`}
                  </span>
                </div>
                <div className="route-item">
                  <span className="label">CARRIER & SERVICE</span>
                  <span className="value">
                    {order.deliveryCompany 
                      ? `${order.deliveryCompany} Courier` 
                      : 'Sweet Transit Van | Charlie'}
                  </span>
                </div>
              </div>
            </div>

            {/* Driver / Courier Profile Card */}
            <div className="driver-card glass-card">
              <div className="driver-avatar-wrapper">
                <div className="driver-avatar" style={{ fontSize: '30px', display: 'flex', alignItems: 'center', justify: 'center' }}>
                  {order.deliveryCompany ? '📦' : '👨‍✈️'}
                </div>
                {!order.deliveryCompany && <div className="driver-rating">⭐ 4.9</div>}
              </div>
              <div className="driver-info">
                <h3>{order.deliveryCompany || 'Charlie Bucket'}</h3>
                <p className="subtext">
                  {order.deliveryCompany ? 'Local Delivery Partner' : 'Lolly Shop Delivery Captain'}
                </p>
                <div className="driver-actions" style={{ width: '100%' }}>
                  {order.deliveryCompany ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left', width: '100%', padding: '4px 0' }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Tracking Reference
                      </span>
                      <strong style={{ fontSize: '15px', fontFamily: 'monospace', color: 'var(--color-text)' }}>
                        {order.deliveryReference || 'Awaiting Reference'}
                      </strong>
                    </div>
                  ) : (
                    <>
                      <a href="tel:+649999999" className="btn btn-secondary action-btn">
                        <Phone size={16} /> Call Driver
                      </a>
                      <button className="btn btn-secondary action-btn" onClick={() => alert('Chatting with driver Charlie is coming soon!')}>
                        <MessageSquare size={16} /> Message
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Timeline & Order Invoice Card */}
          <div className="timeline-invoice-column">
            {/* Timeline Progress Card */}
            <div className="timeline-card glass-card">
              <h3>Delivery Progress</h3>
              <div className="tracking-timeline">
                <div className={`timeline-item ${isStep1Completed ? 'completed' : ''} ${isStep1Active ? 'active' : ''}`}>
                  <div className="timeline-marker">
                    <ShieldCheck size={14} />
                  </div>
                  <div className="timeline-content">
                    <h4>Order Placed</h4>
                    <p>Receipt confirmed & payment approved successfully.</p>
                    <span className="timeline-time">Today, {order.date || 'NZST'}</span>
                  </div>
                </div>

                <div className={`timeline-item ${isStep2Completed ? 'completed' : ''} ${isStep2Active ? 'active' : ''}`}>
                  <div className="timeline-marker">
                    <Package size={14} />
                  </div>
                  <div className="timeline-content">
                    <h4>Sweet Box Packing</h4>
                    <p>Your candy treasures were hand-picked & bubble-wrapped.</p>
                    <span className="timeline-time">Today, prepared in 10 mins</span>
                  </div>
                </div>

                <div className={`timeline-item ${isStep3Completed ? 'completed' : ''} ${isStep3Active ? 'active' : ''}`}>
                  <div className="timeline-marker">
                    <Truck size={14} />
                  </div>
                  <div className="timeline-content">
                    <h4>Out for Delivery</h4>
                    <p>Charlie is routing the shipping package to your address.</p>
                    <span className="timeline-time">{order.status === 'Completed' ? 'Delivered' : 'Currently live'}</span>
                  </div>
                </div>

                <div className={`timeline-item ${isStep4Completed ? 'completed active' : 'pending'}`}>
                  <div className="timeline-marker">
                    <MapPin size={14} />
                  </div>
                  <div className="timeline-content">
                    <h4>Delivery Completed</h4>
                    <p>Receive your sweet pack and enjoy your candies!</p>
                    <span className="timeline-time">{isStep4Completed ? 'Completed' : 'Waiting...'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Rating Card - visible only when order is Completed */}
            {order.status === 'Completed' && (
              <div className="feedback-rating-card glass-card" style={{ marginBottom: '24px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: 'var(--color-text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🍬 Rate Your Sweets
                </h3>
                {order.feedback?.rating || submittedFeedback ? (
                  <div className="feedback-thank-you" style={{ padding: '10px 0', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
                    <h4 style={{ margin: '0 0 6px 0', color: 'var(--color-primary)' }}>Thank You for Your Review!</h4>
                    <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--color-text-light)' }}>
                      Your feedback helps Charlie and the kitchen team deliver sweet perfection.
                    </p>
                    <div style={{ display: 'inline-flex', gap: '4px', fontSize: '20px', marginBottom: '10px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ color: i < (order.feedback?.rating || rating) ? '#f59e0b' : '#d1d5db' }}>★</span>
                      ))}
                    </div>
                    {order.feedback?.comment && (
                      <p style={{ margin: '6px 0 0 0', fontSize: '13px', fontStyle: 'italic', color: 'var(--color-text-dark)', backgroundColor: '#faf9fc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #f1eff5' }}>
                        "{order.feedback.comment}"
                      </p>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-light)', lineHeight: 1.4 }}>
                      We'd love to know how delicious your confections were and how you rate Charlie's delivery!
                    </p>
                    
                    {/* Stars Selection */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '5px 0' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '32px',
                            padding: 0,
                            margin: 0,
                            color: star <= (hoveredRating || rating) ? '#f59e0b' : '#d1d5db',
                            transition: 'transform 0.1s ease, color 0.1s ease',
                            transform: star <= (hoveredRating || rating) ? 'scale(1.15)' : 'scale(1.0)'
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>

                    {/* Comment text box */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-light)' }}>
                        ADDITIONAL COMMENT (OPTIONAL)
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us about your treats or delivery..."
                        rows="3"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: '1.5px solid var(--color-border)',
                          fontSize: '13px',
                          outline: 'none',
                          resize: 'none',
                          backgroundColor: 'rgba(255, 255, 255, 0.6)',
                          transition: 'border-color 0.2s'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || rating === 0}
                      className="btn btn-primary"
                      style={{
                        padding: '10px 20px',
                        borderRadius: '30px',
                        fontSize: '13px',
                        fontWeight: '700',
                        textAlign: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: rating === 0 ? 'not-allowed' : 'pointer',
                        opacity: rating === 0 ? 0.6 : 1
                      }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Feedback ➔'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Order Invoice Details Card */}
            <div className="invoice-details-card glass-card">
              <div className="invoice-header">
                <Receipt size={20} className="text-primary" />
                <h3>Order Invoice</h3>
              </div>
              <div className="invoice-meta-row">
                <div>
                  <span className="label">CUSTOMER DETAILS</span>
                  <p className="value">
                    <strong>{order.customer.name}</strong><br/>
                    {order.customer.address}, {order.customer.city}<br/>
                    {order.customer.postalCode} | {order.customer.phone}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="invoice-items-list">
                {order.items.map((item) => (
                  <div key={`${item.id}-${item.selectedWeight}`} className="invoice-item-row">
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-weight">Weight: {item.selectedWeight}</span>
                    </div>
                    <span className="item-qty">Qty {item.quantity}</span>
                    <span className="item-total-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                {/* Flat Delivery Fee Item Line */}
                <div className="invoice-item-row" style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '10px', marginTop: '10px' }}>
                  <div className="item-details">
                    <span className="item-name" style={{ fontWeight: '700' }}>{order.freeShippingApplied ? 'Free Delivery - Hamilton' : 'Courier Delivery Fee'}</span>
                    <span className="item-weight" style={{ color: 'var(--color-primary)', fontWeight: '800' }}>
                      {order.freeShippingApplied ? 'Hamilton Free Delivery' : (order.deliveryCompany || 'Standard Shipping')}
                    </span>
                  </div>
                  <span className="item-qty">Qty 1</span>
                  <span className="item-total-price">${Number(order.shipping !== undefined ? order.shipping : (order.freeShippingApplied ? 0 : 19)).toFixed(2)}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="invoice-total-footer">
                <span>Grand Total:</span>
                <span className="grand-total-price">${Number(order.total).toFixed(2)} NZD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
