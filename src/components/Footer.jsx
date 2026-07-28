import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Sparkles, Send, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './Footer.css';

export const Footer = () => {
  const { settings, categories, addNewsletterSubscriber } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const footerSettings = settings?.footer || {
    description: "NZ's favorite online candy store. Hand-picked imported confections, luxury chocolates, and sour straps delivered directly to your doorstep.",
    badgeText: "✨ Premium Quality Confections",
    quickShopTitle: "Quick Shop",
    quickLinks: [
      { label: 'Shop All Sweets', link: '/shop' },
      { label: 'Frequently Asked Questions', link: '/faq' },
      { label: 'NZ Lollies', link: '/shop?category=NZ%20Lollies' },
      { label: 'Imported Lollies', link: '/shop?category=Imported%20Lollies' },
      { label: 'Chocolates', link: '/shop?category=Chocolates' },
      { label: 'Drinks', link: '/shop?category=Drinks' },
      { label: 'Snacks', link: '/shop?category=Snacks' }
    ],
    contactTitle: "Contact Us",
    newsletterTitle: "Sweet Newsletter",
    newsletterSub: "Subscribe to receive news about fresh candies, flash sales, and exclusive coupons!",
    copyright: '© 2026 Best Lolly Shop. All rights reserved.',
    policies: [
      { label: 'Privacy Policy', link: '/privacy' },
      { label: 'Terms of Service', link: '/terms' }
    ]
  };

  const contactSettings = settings?.contactUs || {
    email: 'bestlollyshopnz@gmail.com',
    phone: '021 082 63626',
    address: '17 Braid Road, St Andrews, Hamilton 3200, New Zealand',
    googleMap: 'https://maps.google.com/maps?q=17%20Braid%20Road,%20St%20Andrews,%20Hamilton%203200,%20New%20Zealand&t=&z=15&ie=UTF8&iwloc=&output=embed'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailToSubmit = newsletterEmail.trim();
    if (!emailToSubmit || !emailToSubmit.includes('@')) {
      setNewsletterStatus({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    
    setIsSubmitting(true);
    setNewsletterStatus(null);

    try {
      if (addNewsletterSubscriber) {
        const res = await addNewsletterSubscriber(emailToSubmit);
        if (res && res.alreadySubscribed) {
          setNewsletterStatus({ type: 'info', text: res.message || 'You are already subscribed to our sweet newsletter! 🍭' });
        } else if (res && !res.error) {
          setNewsletterStatus({ type: 'success', text: 'Thank you for subscribing to our sweet newsletter! 🍭' });
          setNewsletterEmail('');
        } else {
          setNewsletterStatus({ type: 'error', text: res?.error || res?.message || 'Subscription failed. Please try again.' });
        }
      }
    } catch (err) {
      setNewsletterStatus({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get first 5 categories dynamically for footer if custom quickLinks not provided
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
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{ maxHeight: '60px', width: 'auto', objectFit: 'contain', marginLeft: '20px' }}
              >
                <source src="/Logo.mp4" type="video/mp4" />
              </video>
            </Link>
            <p className="footer-desc">
              {footerSettings.description}
            </p>
            {footerSettings.badgeText && (
              <div className="brand-tag">
                <Sparkles size={14} />
                <span>{footerSettings.badgeText}</span>
              </div>
            )}
          </div>

          {/* Dynamic Quick Links Column */}
          <div className="footer-links-col">
            <h3>{footerSettings.quickShopTitle || "Quick Shop"}</h3>
            <ul className="footer-links">
              {footerSettings.quickLinks && footerSettings.quickLinks.length > 0 ? (
                footerSettings.quickLinks.map((ql, idx) => (
                  <li key={`foot-ql-${idx}`}>
                    <Link to={ql.link || '#'}>{ql.label}</Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/shop">Shop All Sweets</Link></li>
                  <li><Link to="/faq">Frequently Asked Questions</Link></li>
                  {footerCategories.map((cat, idx) => (
                    <li key={`foot-cat-${idx}`}>
                      <Link to={`/shop?category=${encodeURIComponent(cat.name || cat)}`}>
                        {cat.name || cat}
                      </Link>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>

          {/* Dynamic Contact Details */}
          <div className="footer-links-col">
            <h3>{footerSettings.contactTitle || "Contact Us"}</h3>
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
                    href={
                      !contactSettings.googleMap || contactSettings.googleMap.includes('/embed')
                        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactSettings.address)}`
                        : contactSettings.googleMap
                    } 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', transition: 'color var(--transition-fast)' }}
                  >
                    {contactSettings.address} 📍
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="footer-newsletter">
            <h3>{footerSettings.newsletterTitle || "Sweet Newsletter"}</h3>
            <p>{footerSettings.newsletterSub || "Subscribe to receive news about fresh candies, flash sales, and exclusive coupons!"}</p>
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <button 
                type="submit" 
                className={`newsletter-submit-btn ${isSubmitting ? 'loading' : ''}`} 
                aria-label="Subscribe"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 size={16} className="spin-icon" /> : <Send size={16} />}
              </button>
            </form>
            {newsletterStatus && (
              <div className={`newsletter-status-msg ${newsletterStatus.type}`}>
                {newsletterStatus.text}
              </div>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="footer-bottom">
          <p>{footerSettings.copyright || `© ${new Date().getFullYear()} Best Lolly Shop. All rights reserved.`}</p>
          <div className="footer-bottom-links">
            {(footerSettings.policies || []).map((pol, idx) => (
              <Link key={`foot-pol-${idx}`} to={pol.link || '#'}>{pol.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
