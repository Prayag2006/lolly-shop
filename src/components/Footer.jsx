import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Sparkles, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './Footer.css';

export const Footer = () => {
  const { settings, categories } = useStore();

  const footerSettings = settings?.footer || {
    description: "We carefully source the finest international confectioneries to spread happiness and sweeten your life, one treat at a time.",
    quickLinks: [
      { label: 'Shop All', link: '/shop' },
      { label: 'About Us', link: '/about' },
      { label: 'Contact Us', link: '/contact' }
    ],
    policies: [
      { label: 'Privacy Policy', link: '/privacy' },
      { label: 'Terms of Service', link: '/terms' }
    ],
    copyright: '© 2026 Best Lolly Shop. All rights reserved.'
  };

  const contactSettings = settings?.contactUs || {
    email: 'bestlollyshopnz@gmail.com',
    phone: '021 123 4567',
    address: 'Grey Lynn, Auckland 1021, New Zealand',
    googleMap: 'https://maps.app.goo.gl/m27LjumNacLhLiaZ7?g_st=iw'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our sweet newsletter! 🍭');
    e.target.reset();
  };

  // Get first 5 categories dynamically for footer if available
  const footerCategories = categories && categories.length > 0
    ? categories.slice(0, 5)
    : [
        { name: 'Chewy Gummies', id: 'Gummies' },
        { name: 'Dark Chocolates', id: 'Chocolates' },
        { name: 'Fun Lollipops', id: 'Lollipops' },
        { name: 'Soft Marshmallows', id: 'Marshmallows' }
      ];

  return (
    <footer className="footer-section">
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand-side">
            <Link to="/" className="logo-link footer-logo">
              {settings?.websiteLogo ? (
                <img src={settings.websiteLogo} alt={settings.websiteName || 'Best Lolly Shop'} style={{ maxHeight: '35px', objectFit: 'contain' }} />
              ) : (
                <div className="logo-text">
                  Best <span>Lolly Shop</span>
                </div>
              )}
            </Link>
            <p className="footer-desc">
              {footerSettings.description}
            </p>
            <div className="brand-tag">
              <Sparkles size={14} />
              <span>Premium Quality Confections</span>
            </div>
          </div>

          {/* Dynamic Categories Link Column */}
          <div className="footer-links-col">
            <h3>Quick Shop</h3>
            <ul className="footer-links">
              <li><Link to="/shop">Shop All Sweets</Link></li>
              {footerCategories.map((cat, idx) => (
                <li key={`foot-cat-${idx}`}>
                  <Link to={`/shop?category=${encodeURIComponent(cat.name || cat)}`}>
                    {cat.name || cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dynamic Contact Details */}
          <div className="footer-links-col">
            <h3>Contact Us</h3>
            <ul className="footer-contact">
              {contactSettings.email && (
                <li>
                  <Mail size={16} fill="none" />
                  <a href={`mailto:${contactSettings.email}`} style={{ transition: 'color var(--transition-fast)' }}>
                    {contactSettings.email}
                  </a>
                </li>
              )}
              {contactSettings.phone && (
                <li>
                  <Phone size={16} fill="none" />
                  <span>{contactSettings.phone}</span>
                </li>
              )}
              {contactSettings.address && (
                <li>
                  <MapPin size={16} fill="none" />
                  <a 
                    href={contactSettings.googleMap || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', transition: 'color var(--transition-fast)' }}
                  >
                    {contactSettings.address.split(',')[0]} 📍
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="footer-newsletter">
            <h3>Sweet Newsletter</h3>
            <p>Subscribe to receive news about fresh candies, flash sales, and exclusive coupons!</p>
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="footer-bottom">
          <p>{footerSettings.copyright || `© ${new Date().getFullYear()} Best Lolly Shop. All rights reserved.`}</p>
          <div className="footer-bottom-links">
            {(footerSettings.policies || []).map((pol, idx) => (
              <Link key={`foot-pol-${idx}`} to={pol.link}>{pol.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
