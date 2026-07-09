import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Sparkles, Send } from 'lucide-react';
import './Footer.css';

export const Footer = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our sweet newsletter! 🍭');
    e.target.reset();
  };

  return (
    <footer className="footer-section">
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand-side">
            <Link to="/" className="logo-text footer-logo">
              Best <span>Lolly Shop</span>
            </Link>
            <p className="footer-desc">
              We carefully source the finest international confectioneries to spread happiness and sweeten your life, one treat at a time.
            </p>
            <div className="brand-tag">
              <Sparkles size={14} />
              <span>Premium Quality Confections</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h3>Quick Shop</h3>
            <ul className="footer-links">
              <li><Link to="/shop">Shop All Sweets</Link></li>
              <li><Link to="/shop?category=Gummies">Chewy Gummies</Link></li>
              <li><Link to="/shop?category=Chocolates">Dark Chocolates</Link></li>
              <li><Link to="/shop?category=Lollipops">Fun Lollipops</Link></li>
              <li><Link to="/shop?category=Marshmallows">Soft Marshmallows</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="footer-links-col">
            <h3>Contact Us</h3>
            <ul className="footer-contact">
              <li>
                <Mail size={16} fill="none" />
                <a href="mailto:BestLollyShop@gmail.com" style={{ transition: 'color var(--transition-fast)' }}>
                  BestLollyShop@gmail.com
                </a>
              </li>
              <li>
                <Phone size={16} fill="none" />
                <span>+64 9 123 4567</span>
              </li>
              <li>
                <MapPin size={16} fill="none" />
                <a 
                  href="https://maps.app.goo.gl/m27LjumNacLhLiaZ7?g_st=iw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', transition: 'color var(--transition-fast)' }}
                >
                  Locate Our Shop 📍
                </a>
              </li>
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
          <p>&copy; {new Date().getFullYear()} Best Lolly Shop. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
