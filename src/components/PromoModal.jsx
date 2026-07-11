import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Copy, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './PromoModal.css';

export const PromoModal = () => {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  
  const timerRef = useRef(null);
  const autoCloseTimerRef = useRef(null);

  const now = new Date();
  const currentPath = window.location.pathname;

  // Filter popupOffers by scheduling, page targeting, and frequency
  const activeOffers = (settings?.popupOffers || []).filter((offer, idx) => {
    if (!offer.enabled) return false;

    // Check scheduling dates
    if (offer.startDate) {
      if (now < new Date(offer.startDate)) return false;
    }
    if (offer.endDate) {
      if (now > new Date(offer.endDate)) return false;
    }

    // Check page targeting
    if (offer.targetPages && offer.targetPages.length > 0) {
      const match = offer.targetPages.some(page => {
        if (page === '*') return true;
        return page.toLowerCase() === currentPath.toLowerCase();
      });
      if (!match) return false;
    }

    // Check frequency (don't show if shown recently based on frequencyDays setting)
    const frequencyDays = offer.frequencyDays || 1;
    const lastShownKey = `lolly_popup_last_shown_${idx}`;
    const lastShown = localStorage.getItem(lastShownKey);
    if (lastShown) {
      const diffMs = now.getTime() - new Date(lastShown).getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays < frequencyDays) return false;
    }

    return true;
  });

  useEffect(() => {
    if (activeOffers.length === 0 || currentPath.startsWith('/admin')) return;

    // Show the first offer after its configured delay
    const firstOffer = activeOffers[0];
    timerRef.current = setTimeout(() => {
      setCurrentOfferIndex(0);
      setIsOpen(true);
      
      // Save last shown timestamp
      localStorage.setItem(`lolly_popup_last_shown_0`, now.toISOString());

      // Handle auto close if configured
      if (firstOffer.autoCloseSeconds || firstOffer.autoClose) {
        const secs = firstOffer.autoCloseSeconds || 8;
        autoCloseTimerRef.current = setTimeout(() => {
          handleClose();
        }, secs * 1000);
      }
    }, firstOffer.delay || 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    };
  }, [settings, currentPath]);

  const handleClose = () => {
    setIsOpen(false);
    if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    
    // Check if there is a next offer to show
    const nextIndex = currentOfferIndex + 1;
    if (nextIndex < activeOffers.length && !currentPath.startsWith('/admin')) {
      const nextOffer = activeOffers[nextIndex];
      timerRef.current = setTimeout(() => {
        setCurrentOfferIndex(nextIndex);
        setIsOpen(true);
        localStorage.setItem(`lolly_popup_last_shown_${nextIndex}`, new Date().toISOString());

        // Handle auto close for next offer
        if (nextOffer.autoCloseSeconds || nextOffer.autoClose) {
          const secs = nextOffer.autoCloseSeconds || 8;
          autoCloseTimerRef.current = setTimeout(() => {
            handleClose();
          }, secs * 1000);
        }
      }, nextOffer.delay || 4000);
    }
  };

  const handleCopyCode = () => {
    const currentOffer = activeOffers[currentOfferIndex];
    if (!currentOffer?.code) return;
    navigator.clipboard.writeText(currentOffer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || activeOffers.length === 0 || currentPath.startsWith('/admin')) return null;

  const currentOffer = activeOffers[currentOfferIndex];
  const { title, description, code, buttonText, buttonLink, image } = currentOffer;

  const handleCtaClick = () => {
    handleClose();
    if (buttonLink) {
      window.location.href = buttonLink;
    }
  };

  return (
    <AnimatePresence>
      <div className="promo-modal-backdrop">
        <motion.div 
          className="promo-modal-card glass-card"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="promo-modal-glow pink"></div>
          <div className="promo-modal-glow purple"></div>

          <button 
            className="promo-close-btn" 
            onClick={handleClose}
            aria-label="Close promotion"
          >
            <X size={18} />
          </button>

          <div className="promo-modal-content">
            {image ? (
              <div className="promo-modal-image-container" style={{ width: '100%', maxHeight: '180px', overflow: 'hidden', borderRadius: '12px', marginBottom: '16px' }}>
                <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div className="promo-icon-badge">
                <Gift size={28} className="gift-icon" />
              </div>
            )}

            <h2 className="promo-title">{title}</h2>
            <p className="promo-description">{description}</p>

            {code && (
              <div className="promo-code-container">
                <span className="promo-code-label">PROMO CODE</span>
                <div className="promo-code-box">
                  <span className="promo-code-text">{code}</span>
                  <button 
                    className={`promo-copy-btn ${copied ? 'copied' : ''}`}
                    onClick={handleCopyCode}
                    title="Copy promo code"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            )}

            <button className="btn btn-primary promo-shop-btn" onClick={handleCtaClick}>
              {buttonText || 'Start Shopping Now'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
