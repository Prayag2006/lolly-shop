import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { User, Mail, Phone, MapPin, ShoppingBag, Clock, CheckCircle2, AlertCircle, Edit2, Save, X } from 'lucide-react';
import './Profile.css';

export const Profile = () => {
  const { currentUser, orders, logout, updateProfile } = useStore();
  
  const getSavedAddressFromStorage = () => {
    try {
      const stored = localStorage.getItem('lolly_saved_address');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    return {};
  };

  const initialSaved = getSavedAddressFromStorage();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || initialSaved.phone || '',
    address: currentUser?.savedAddress?.address || initialSaved.address || '',
    city: currentUser?.savedAddress?.city || initialSaved.city || '',
    zip: currentUser?.savedAddress?.zip || initialSaved.zip || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleEditChange = (e) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);

    const savedAddressObj = {
      name: editForm.name,
      email: currentUser?.email || '',
      phone: editForm.phone,
      address: editForm.address,
      city: editForm.city,
      zip: editForm.zip
    };

    try {
      localStorage.setItem('lolly_saved_address', JSON.stringify(savedAddressObj));
    } catch (e) {
      // ignore
    }

    await updateProfile({
      name: editForm.name,
      phone: editForm.phone,
      savedAddress: {
        address: editForm.address,
        city: editForm.city,
        zip: editForm.zip
      }
    });

    setIsSaving(false);
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    const freshSaved = getSavedAddressFromStorage();
    setEditForm({
      name: currentUser?.name || '',
      phone: currentUser?.phone || freshSaved.phone || '',
      address: currentUser?.savedAddress?.address || freshSaved.address || '',
      city: currentUser?.savedAddress?.city || freshSaved.city || '',
      zip: currentUser?.savedAddress?.zip || freshSaved.zip || ''
    });
    setIsEditing(false);
  };

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
            <div className="profile-avatar-wrapper" style={{ position: 'relative' }}>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  style={{
                    position: 'absolute', top: 0, right: 0, 
                    background: 'none', border: 'none', color: 'var(--color-primary)', 
                    cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', gap: '4px',
                    fontSize: '13px', fontWeight: 'bold'
                  }}
                >
                  <Edit2 size={14} /> Edit
                </button>
              )}
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
                <div className="profile-detail-text-box" style={{ width: '100%' }}>
                  <label>Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="name"
                      value={editForm.name} 
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', marginTop: '4px', fontSize: '14px' }}
                    />
                  ) : (
                    <span>{currentUser.name}</span>
                  )}
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
                <div className="profile-detail-text-box" style={{ width: '100%' }}>
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="phone"
                      value={editForm.phone} 
                      onChange={handleEditChange}
                      placeholder="e.g. 021 123 4567"
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', marginTop: '4px', fontSize: '14px' }}
                    />
                  ) : (
                    <span>{currentUser.phone || 'Not provided'}</span>
                  )}
                </div>
              </div>

              <div className="profile-detail-row-item">
                <div className="profile-detail-icon-box">
                  <MapPin size={16} />
                </div>
                <div className="profile-detail-text-box" style={{ width: '100%' }}>
                  <label>Default Delivery Address</label>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                      <input 
                        type="text" 
                        name="address"
                        value={editForm.address} 
                        onChange={handleEditChange}
                        placeholder="Street Address (e.g. 17 Braid Road)"
                        style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <input 
                          type="text" 
                          name="city"
                          value={editForm.city} 
                          onChange={handleEditChange}
                          placeholder="City (e.g. Hamilton)"
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                        />
                        <input 
                          type="text" 
                          name="zip"
                          value={editForm.zip} 
                          onChange={handleEditChange}
                          placeholder="Postcode (e.g. 3200)"
                          maxLength="4"
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span>
                      {currentUser.savedAddress?.address || initialSaved.address ? (
                        `${currentUser.savedAddress?.address || initialSaved.address}, ${currentUser.savedAddress?.city || initialSaved.city || ''} ${currentUser.savedAddress?.zip || initialSaved.zip || ''}`
                      ) : (
                        'No address saved yet'
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isEditing ? (
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  style={{
                    flex: 1, background: 'var(--color-primary)', color: 'white', border: 'none',
                    padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px'
                  }}
                >
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  style={{
                    flex: 1, background: '#f1f1f1', color: '#333', border: 'none',
                    padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px'
                  }}
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            ) : (
              <button 
                className="profile-logout-action-btn"
                onClick={logout}
              >
                🚪 Log Out Account
              </button>
            )}
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

export default Profile;

