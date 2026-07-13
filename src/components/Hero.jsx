import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Award, ShoppingBag, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import './Hero.css';

export const Hero = () => {
  const { settings } = useStore();
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

  const heroSettings = settings?.hero || {
    heading: 'SWEETEN YOUR | EVERYDAY LIFE!',
    subheading: "NZ's Favourite Online Lolly Shop & Candy Store",
    description: "Indulge in our exquisite gourmet selection of hand-picked imported lollies, luxury chocolates, and sour straps. Freshly packed and delivered straight to your door across NZ.",
    buttonText: 'Explore Sweet Shop',
    buttonLink: '/shop',
    secondaryButtonText: 'Best Sellers',
    secondaryButtonLink: '#favourites',
    heroImage: '/hero_candy_display.png',
    backgroundImage: '',
    floatingIcons: ['🍬', '🍭', '🍫', '🍑', '🍒'],
    badgeText: 'Premium New Zealand Confections'
  };

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

  const headingText = heroSettings.heading || "SWEETEN YOUR | EVERYDAY LIFE!";
  const parts = headingText.split('|');
  const mainPart = parts[0].trim();
  const gradientPart = parts[1] ? parts[1].trim() : '';

  const iconsList = heroSettings.floatingIcons || ['🍬', '🍭', '🍫', '🍑', '🍒'];

  return (
    <section className="hero-section" style={{ backgroundImage: heroSettings.backgroundImage ? `url(${heroSettings.backgroundImage})` : 'none' }}>
      {/* Radial mesh background glows */}
      <div className="hero-glow glow-pink animate-pulse-slow"></div>
      <div className="hero-glow glow-gold"></div>
      <div className="hero-glow glow-purple"></div>

      {/* Modern floating glassmorphic candy bubbles */}
      {iconsList.map((icon, idx) => (
        <div 
          key={`bubble-${idx}`}
          className={`floating-glass-bubble bubble-${Math.min(5, idx + 1)} ${idx % 2 === 1 ? 'animate-float-reverse' : 'animate-float'}`}
          style={{ transform: `translate(${mouseOffset.x * (idx % 2 === 0 ? -0.4 - idx * 0.1 : 0.3 + idx * 0.1)}px, ${mouseOffset.y * (idx % 2 === 0 ? -0.4 - idx * 0.1 : 0.3 + idx * 0.1)}px)` }}
        >
          <span>{icon}</span>
        </div>
      ))}

      <div className="container hero-container">
        {/* Left Column: Premium content */}
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Glowing Badge */}
          {heroSettings.badgeText && (
            <motion.div className="hero-badge" variants={itemVariants}>
              <Sparkles size={14} className="badge-spark" />
              <span>{heroSettings.badgeText}</span>
            </motion.div>
          )}

          {/* Heading */}
          <motion.h1 className="hero-title" variants={itemVariants}>
            {mainPart}
            {gradientPart && (
              <>
                <br />
                <span className="gradient-text">{gradientPart}</span>
              </>
            )}
            {heroSettings.subheading && (
              <span className="hero-seo-subtitle" style={{ display: 'block', fontSize: '1.25rem', marginTop: '12px', fontWeight: '500', opacity: 0.9, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {heroSettings.subheading}
              </span>
            )}
          </motion.h1>

          {/* Subheading description */}
          <motion.p className="hero-subtitle" variants={itemVariants}>
            {heroSettings.description}
          </motion.p>

          {/* Call to Actions */}
          <motion.div className="hero-buttons" variants={itemVariants}>
            {heroSettings.buttonText && (
              <Link to={heroSettings.buttonLink || '/shop'} className="btn btn-primary hero-btn-explore">
                {heroSettings.buttonText} <ArrowRight size={18} />
              </Link>
            )}
            {heroSettings.secondaryButtonText && (
              <a href={heroSettings.secondaryButtonLink || '#favourites'} className="btn btn-secondary hero-btn-bestsellers">
                {heroSettings.secondaryButtonText}
              </a>
            )}
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
              <span>Free Hamilton Delivery</span>
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
                src={heroSettings.heroImage || '/hero_candy_display.png'} 
                alt="Best Lolly Shop New Zealand - Buy Sweets & Chocolates Online" 
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
                <p>Hamilton, New Zealand</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
