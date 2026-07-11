import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { SEO } from '../components/SEO';
import './Contact.css';

export const Contact = () => {
  const { addContactSubmission, settings } = useStore();
  const [searchParams] = useSearchParams();
  const defaultTopic = searchParams.get('topic') || 'General Inquiry';
  const [topic, setTopic] = useState(defaultTopic);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const contactSettings = settings?.contactUs || {
    address: 'Grey Lynn, Auckland 1021, New Zealand',
    phone: '021 123 4567',
    email: 'bestlollyshopnz@gmail.com',
    businessHours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
    googleMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3192.3664790382346!2d174.7408713!3d-36.8576402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d47f9f0f9797f%3A0xe54ef92ad04cb310!2sGrey%20Lynn%2C%20Auckland!5e0!3m2!1sen!2snz!4v1700000000000',
    formEnabled: true
  };

  const topics = [
    'Wholesale Lollies',
    'Custom Branded Bags',
    'Corporate Gifting',
    'Product Inquiry',
    'Bulk Order Request',
    'General Inquiry'
  ];

  useEffect(() => {
    setTopic(defaultTopic);
  }, [defaultTopic]);

  useEffect(() => {
    const handleClose = () => setDropdownOpen(false);
    document.addEventListener('click', handleClose);
    return () => document.removeEventListener('click', handleClose);
  }, []);

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    setDropdownOpen(prev => !prev);
  };

  const handleSelectOption = (opt) => {
    setTopic(opt);
    setDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      return;
    }

    addContactSubmission({
      subject: topic,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
      submittedAt: new Date().toLocaleString('en-NZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="contact-page container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
      <SEO title="Contact Us - Best Lolly Shop" description="Get in touch with Best Lolly Shop. Submit queries about wholesale lollies, corporate gifts, and bulk orders." />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="contact-grid-layout">
        
        {/* Contact Form Card */}
        <div className="contact-card glass-card" style={{ margin: '0', width: '100%' }}>
          <div className="contact-hero">
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Contact Us</h1>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>Choose a topic and tell us your requirements. Our team will reach out with a sweet solution.</p>
            </div>
          </div>

          {contactSettings.formEnabled !== false ? (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row two-cols">
                <div className="form-group custom-select-group">
                  <label>Topic</label>
                  <div className="custom-select-wrapper">
                    <button
                      type="button"
                      className={`custom-select-trigger ${dropdownOpen ? 'open' : ''}`}
                      onClick={handleDropdownClick}
                    >
                      <span>{topic}</span>
                      <span className="custom-select-arrow"></span>
                    </button>
                    
                    {dropdownOpen && (
                      <div className="custom-select-dropdown animate-fade-in">
                        {topics.map((t) => (
                          <div
                            key={t}
                            className={`custom-select-option ${topic === t ? 'selected' : ''}`}
                            onClick={() => handleSelectOption(t)}
                          >
                            {t}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    required
                  />
                </div>
              </div>

              <div className="form-row two-cols">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jane@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +64 21 123 4567"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your requirement, event, quantity, or any questions."
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary form-submit-btn">
                  Submit Request
                </button>
              </div>

              {submitted && (
                <div className="form-success-banner contact-success">
                  Thank you! Your request is submitted and visible in the admin panel.
                </div>
              )}
            </form>
          ) : (
            <div style={{ padding: '30px 20px', textAlign: 'center', background: 'rgba(231,44,131,0.02)', borderRadius: '16px', border: '1px dashed var(--color-primary)' }}>
              <p style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                📭 Our online message system is temporarily offline. Please contact us directly via email or phone!
              </p>
            </div>
          )}
        </div>

        {/* Contact Info Card & Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', color: 'var(--color-primary)' }}>Our Sweet HQ</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {contactSettings.address && (
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <MapPin size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</h4>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{contactSettings.address}</p>
                  </div>
                </div>
              )}

              {contactSettings.phone && (
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <Phone size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</h4>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{contactSettings.phone}</p>
                  </div>
                </div>
              )}

              {contactSettings.email && (
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <Mail size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</h4>
                    <a href={`mailto:${contactSettings.email}`} style={{ fontSize: '14px', color: 'var(--color-primary)', display: 'block', marginTop: '4px', textDecoration: 'none', fontWeight: '600' }}>
                      {contactSettings.email}
                    </a>
                  </div>
                </div>
              )}

              {contactSettings.businessHours && (
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <Clock size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Business Hours</h4>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{contactSettings.businessHours}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Embedded Google Map */}
          {contactSettings.googleMap && (
            <div style={{ height: '240px', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--card-shadow)', border: '1px solid var(--color-border)' }}>
              <iframe 
                src={contactSettings.googleMap} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map location"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
