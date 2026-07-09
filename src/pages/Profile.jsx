import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { User, Mail, Phone, MapPin, ShoppingBag, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import './Profile.css';

export const Profile = () => {
  const { currentUser, orders, logout } = useStore();

  // Redirect to login if guest or admin
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Filter orders matching logged-in user's email or account email
  const userOrders = (Array.isArray(orders) ? orders : []).filter(
    (ord) => ord && ((ord.userEmail?.toLowerCase() === currentUser.email?.toLowerCase()) ||
             (ord.customer?.email?.toLowerCase() === currentUser.email?.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' };
      case 'shipped': return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' };
      case 'processing': return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' };
      default: return { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle2 size={13} style={{ marginRight: '4px' }} />;
      case 'shipped': return <Clock size={13} style={{ marginRight: '4px' }} />;
      default: return <AlertCircle size={13} style={{ marginRight: '4px' }} />;
    }
  };

  return (
    <div className="profile-container container">
      {/* Background glow effects */}
      <div className="profile-bg-glow glow-pink animate-pulse-slow"></div>
      <div className="profile-bg-glow glow-purple"></div>

      {/* Page Header */}
      <div className="profile-page-header">
        <h1>My Sweet Account</h1>
        <p>Manage your account details and track your candy orders.</p>
      </div>

      <div className="profile-layout-grid">
        {/* Left Column: Personal details */}
        <div className="profile-sidebar-wrapper">
          <div className="glass-card profile-details-card">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar-circle">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h3>{currentUser.name}</h3>
              <span className="profile-customer-tag">Sweet Enthusiast</span>
            </div>

            <div className="profile-details-rows">
              <div className="profile-detail-row-item">
                <div className="profile-detail-icon-box">
                  <User size={16} />
                </div>
                <div className="profile-detail-text-box">
                  <label>Full Name</label>
                  <span>{currentUser.name}</span>
                </div>
              </div>
              
              <div className="profile-detail-row-item">
                <div className="profile-detail-icon-box">
                  <Mail size={16} />
                </div>
                <div className="profile-detail-text-box">
                  <label>Email Address</label>
                  <span>{currentUser.email}</span>
                </div>
              </div>

              <div className="profile-detail-row-item">
                <div className="profile-detail-icon-box">
                  <Phone size={16} />
                </div>
                <div className="profile-detail-text-box">
                  <label>Phone Number</label>
                  <span>{currentUser.phone || 'Not provided'}</span>
                </div>
              </div>

              <div className="profile-detail-row-item">
                <div className="profile-detail-icon-box">
                  <MapPin size={16} />
                </div>
                <div className="profile-detail-text-box">
                  <label>Shipping Location</label>
                  <span>{currentUser.location || 'Auckland, New Zealand'}</span>
                </div>
              </div>
            </div>

            <button 
              className="profile-logout-action-btn"
              onClick={logout}
            >
              🚪 Log Out Account
            </button>
          </div>
        </div>

        {/* Right Column: Order history */}
        <div className="profile-orders-wrapper">
          <div className="profile-orders-header">
            <ShoppingBag size={20} />
            <h2>Order History ({userOrders.length})</h2>
          </div>

          <div className="profile-orders-list-container">
            {userOrders.length > 0 ? (
              userOrders.map((ord) => (
                <div key={ord.id} className="glass-card profile-order-card">
                  <div className="profile-order-card-header">
                    <div>
                      <span className="profile-order-id">{ord.id}</span>
                      <span className="profile-order-date">Ordered on {ord.date}</span>
                    </div>
                    <span 
                      className="profile-order-status-badge"
                      style={{ 
                        backgroundColor: getStatusColor(ord.status).bg, 
                        color: getStatusColor(ord.status).text 
                      }}
                    >
                      {getStatusIcon(ord.status)}
                      {ord.status}
                    </span>
                  </div>

                  <div className="profile-order-items">
                    {ord.items.map((item, index) => (
                      <div key={index} className="profile-order-item-row">
                        <span className="profile-order-item-name">{item.name || item.productName}</span>
                        <span className="profile-order-item-qty">
                          {(item.quantity !== undefined ? item.quantity : item.qty) || 1}x • {item.selectedWeight || item.weightSelected || '100g'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="profile-order-card-footer">
                    <div>
                      {ord.status !== 'Cancelled' && (
                        <Link 
                           to={`/track-order/${ord.id}`} 
                          style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          🚚 Track Delivery Live
                        </Link>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="profile-order-total-price" style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-text)' }}>${Number(ord.total).toFixed(2)} NZD</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card profile-empty-orders-card">
                <div className="profile-empty-orders-emoji">🍭</div>
                <h3>No candy orders yet</h3>
                <p>Your sweet cravings are waiting! Head to the shop and fill your cart with confections.</p>
                <Link to="/shop" className="btn btn-primary profile-shop-btn">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
