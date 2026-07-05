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

  // Extract all enabled offers
  const activeOffers = settings?.popupOffers?.filter(o => o.enabled) || 
    (settings?.popupOffer?.enabled ? [settings.popupOffer] : []);

  useEffect(() => {
    if (activeOffers.length === 0 || window.location.pathname.startsWith('/admin')) return;

    // Show the first offer after its configured delay
    const firstOffer = activeOffers[0];
    timerRef.current = setTimeout(() => {
      setCurrentOfferIndex(0);
      setIsOpen(true);
    }, firstOffer.delay || 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [settings]);

  const handleClose = () => {
    setIsOpen(false);
    
    // Check if there is a next offer to show
    const nextIndex = currentOfferIndex + 1;
    if (nextIndex < activeOffers.length && !window.location.pathname.startsWith('/admin')) {
      const nextOffer = activeOffers[nextIndex];
      // Start timer for the next offer using its delay as time gap
      timerRef.current = setTimeout(() => {
        setCurrentOfferIndex(nextIndex);
        setIsOpen(true);
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

  if (!isOpen || activeOffers.length === 0 || window.location.pathname.startsWith('/admin')) return null;

  const currentOffer = activeOffers[currentOfferIndex];
  const { title, description, code } = currentOffer;

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
          {/* Decorative elements */}
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
            <div className="promo-icon-badge">
              <Gift size={28} className="gift-icon" />
            </div>

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

            <button className="btn btn-primary promo-shop-btn" onClick={handleClose}>
              Start Shopping Now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
