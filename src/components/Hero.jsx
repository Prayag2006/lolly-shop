import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Award, ShoppingBag, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import './Hero.css';

export const Hero = () => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20; // max 20px offset
      const y = (clientY / innerHeight - 0.5) * 20;
      setMouseOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 90, damping: 14 }
    }
  };

  return (
    <section className="hero-section">
      {/* Radial mesh background glows */}
      <div className="hero-glow glow-pink animate-pulse-slow"></div>
      <div className="hero-glow glow-gold"></div>
      <div className="hero-glow glow-purple"></div>

      {/* Modern floating glassmorphic candy bubbles */}
      <div 
        className="floating-glass-bubble bubble-1 animate-float"
        style={{ transform: `translate(${mouseOffset.x * -0.6}px, ${mouseOffset.y * -0.6}px)` }}
      >
        <span>🍭</span>
      </div>
      <div 
        className="floating-glass-bubble bubble-2 animate-float-reverse"
        style={{ transform: `translate(${mouseOffset.x * 0.7}px, ${mouseOffset.y * 0.7}px)` }}
      >
        <span>🍬</span>
      </div>
      <div 
        className="floating-glass-bubble bubble-3 animate-float"
        style={{ transform: `translate(${mouseOffset.x * -0.4}px, ${mouseOffset.y * -0.4}px)` }}
      >
        <span>🍫</span>
      </div>
      <div 
        className="floating-glass-bubble bubble-4 animate-float-reverse"
        style={{ transform: `translate(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px)` }}
      >
        <span>🍑</span>
      </div>
      <div 
        className="floating-glass-bubble bubble-5 animate-float"
        style={{ transform: `translate(${mouseOffset.x * -0.8}px, ${mouseOffset.y * -0.8}px)` }}
      >
        <span>🍒</span>
      </div>

      <div className="container hero-container">
        {/* Left Column: Premium content */}
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Glowing Badge */}
          <motion.div className="hero-badge" variants={itemVariants}>
            <Sparkles size={14} className="badge-spark" />
            <span>Premium New Zealand Confections</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 className="hero-title" variants={itemVariants}>
            SWEETEN YOUR <br />
            <span className="gradient-text">EVERYDAY LIFE!</span>
          </motion.h1>

          {/* Subheading description */}
          <motion.p className="hero-subtitle" variants={itemVariants}>
            Indulge in our exquisite gourmet selection of hand-picked imported lollies, luxury chocolates, and sour straps. Freshly packed and delivered straight to your door across NZ.
          </motion.p>

          {/* Call to Actions */}
          <motion.div className="hero-buttons" variants={itemVariants}>
            <Link to="/shop" className="btn btn-primary hero-btn-explore">
              Explore Sweet Shop <ArrowRight size={18} />
            </Link>
            <a href="#favourites" className="btn btn-secondary hero-btn-bestsellers">
              Best Sellers
            </a>
          </motion.div>

          {/* Features Row */}
          <motion.div className="hero-features-row" variants={itemVariants}>
            <div className="hero-feature-item">
              <Award size={16} />
              <span>Gourmet Quality</span>
            </div>
            <div className="hero-feature-item">
              <ShoppingBag size={16} />
              <span>Bulk Weight Options</span>
            </div>
            <div className="hero-feature-item">
              <ShieldCheck size={16} />
              <span>Safe NZ Delivery</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Premium High-Res Jar Showcase */}
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.2 }}
          style={{ transform: `translate(${mouseOffset.x * 0.3}px, ${mouseOffset.y * 0.3}px)` }}
        >
          <div className="hero-showcase-wrapper">
            {/* Visual glow ring */}
            <div className="showcase-glow-ring"></div>
            
            {/* The Main High-Quality Candy Jar Image */}
            <div className="showcase-image-container">
              <img 
                src="/hero_candy_display.png" 
                alt="Best Lolly Shop Showcase Jar" 
                className="showcase-main-image"
              />
            </div>

            {/* Overlapping Floating Info Cards */}
            <motion.div 
              className="info-card card-left"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
            >
              <div className="ic-icon">🍭</div>
              <div className="ic-details">
                <h4>100% Pure Joy</h4>
                <p>Natural Fruit Extracts</p>
              </div>
            </motion.div>

            <motion.div 
              className="info-card card-right"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
            >
              <div className="ic-icon">🚚</div>
              <div className="ic-details">
                <h4>Free Delivery</h4>
                <p>Orders over $50 NZD</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
