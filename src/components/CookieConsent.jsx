import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Cookie } from 'lucide-react';
import './CookieConsent.css';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomise, setShowCustomise] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true
    functional: true,
    analytics: true,
    marketing: true,
  });

  useEffect(() => {
    // Check if consent has already been saved
    const consentSaved = localStorage.getItem('lolly_shop_cookie_consent');
    if (!consentSaved) {
      // Small delay to make the entrance feel smooth and premium
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('lolly_shop_cookie_consent', JSON.stringify(allAccepted));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const allRejected = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('lolly_shop_cookie_consent', JSON.stringify(allRejected));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const customConsent = {
      ...preferences,
      necessary: true, // Safeguard
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('lolly_shop_cookie_consent', JSON.stringify(customConsent));
    setIsVisible(false);
  };

  const handleToggle = (key) => {
    if (key === 'necessary') return; // Cannot toggle necessary
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="cookie-consent-wrapper"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      >
        <div className="cookie-consent-card glass-card">
          <div className="cookie-consent-glow-primary"></div>
          <div className="cookie-consent-glow-secondary"></div>

          <div className="cookie-main-content">
            <div className="cookie-text-section">
              <div className="cookie-title-row">
                <div className="cookie-icon-wrapper">
                  <Cookie size={20} className="cookie-icon animate-spin-slow" />
                </div>
                <h3>We value your privacy</h3>
              </div>
              <p className="cookie-description">
                We use cookies to enhance your browsing experience, serve personalised ads or content, and analyse our traffic. By clicking "Accept All", you consent to our use of cookies.{' '}
                <Link to="/privacy" className="cookie-policy-link">
                  Cookie Policy
                </Link>
              </p>
            </div>

            <div className="cookie-actions">
              <button
                className="btn btn-cookie-customise"
                onClick={() => setShowCustomise(!showCustomise)}
                aria-label="Customise cookie settings"
              >
                <Settings size={16} />
                <span>Customise</span>
              </button>
              <button className="btn btn-cookie-reject" onClick={handleRejectAll}>
                Reject All
              </button>
              <button className="btn btn-cookie-accept btn-primary" onClick={handleAcceptAll}>
                Accept All
              </button>
            </div>
          </div>

          {/* Collapsible customisation drawer */}
          <AnimatePresence>
            {showCustomise && (
              <motion.div
                className="cookie-customise-drawer"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="cookie-divider"></div>
                <div className="cookie-options-list">
                  
                  {/* Necessary */}
                  <div className="cookie-option-item disabled">
                    <div className="cookie-option-info">
                      <div className="cookie-option-title-row">
                        <h4>Necessary</h4>
                        <span className="cookie-badge required-badge">Required</span>
                      </div>
                      <p>Essential for basic shop features like the cart, authentication, and security. Cannot be turned off.</p>
                    </div>
                    <div className="cookie-toggle-container">
                      <button className="cookie-toggle active disabled" disabled>
                        <span className="cookie-toggle-handle"></span>
                      </button>
                    </div>
                  </div>

                  {/* Functional */}
                  <div className="cookie-option-item">
                    <div className="cookie-option-info">
                      <div className="cookie-option-title-row">
                        <h4>Preferences &amp; Functional</h4>
                        <span className="cookie-badge choice-badge">Preferences</span>
                      </div>
                      <p>Remembers custom settings such as layout options, theme preferences (light/dark mode), and local region data.</p>
                    </div>
                    <div className="cookie-toggle-container">
                      <button
                        className={`cookie-toggle ${preferences.functional ? 'active' : ''}`}
                        onClick={() => handleToggle('functional')}
                        aria-label="Toggle functional cookies"
                      >
                        <span className="cookie-toggle-handle"></span>
                      </button>
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="cookie-option-item">
                    <div className="cookie-option-info">
                      <div className="cookie-option-title-row">
                        <h4>Analytics &amp; Performance</h4>
                        <span className="cookie-badge choice-badge">Analytics</span>
                      </div>
                      <p>Gathers anonymous visitor counts and behavior stats. Helps us find popular sweets and improve user journeys.</p>
                    </div>
                    <div className="cookie-toggle-container">
                      <button
                        className={`cookie-toggle ${preferences.analytics ? 'active' : ''}`}
                        onClick={() => handleToggle('analytics')}
                        aria-label="Toggle analytics cookies"
                      >
                        <span className="cookie-toggle-handle"></span>
                      </button>
                    </div>
                  </div>

                  {/* Marketing */}
                  <div className="cookie-option-item">
                    <div className="cookie-option-info">
                      <div className="cookie-option-title-row">
                        <h4>Marketing &amp; Targeting</h4>
                        <span className="cookie-badge choice-badge">Marketing</span>
                      </div>
                      <p>Enables delivery of personalized sweet promotions, discount popups, and relevant ads across platforms.</p>
                    </div>
                    <div className="cookie-toggle-container">
                      <button
                        className={`cookie-toggle ${preferences.marketing ? 'active' : ''}`}
                        onClick={() => handleToggle('marketing')}
                        aria-label="Toggle marketing cookies"
                      >
                        <span className="cookie-toggle-handle"></span>
                      </button>
                    </div>
                  </div>

                </div>

                <div className="cookie-drawer-footer">
                  <button className="btn btn-cookie-save btn-primary" onClick={handleSavePreferences}>
                    Save Preferences
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
