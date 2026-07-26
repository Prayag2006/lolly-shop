import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Award, ShoppingBag, ShieldCheck, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import './Hero.css';

export const Hero = () => {
  const { settings } = useStore();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(null);

  const sliderSettings = settings?.heroSliderSettings || {
    autoPlay: true,
    interval: 5000,
    animationEffect: 'slide',
    showProgressBar: true,
    pauseOnHover: true
  };

  // Get active slides (filtered by enabled)
  const allSlides = settings?.heroSlides || [
    {
      id: 'slide-1',
      enabled: true,
      heading: 'BEST LOLLY SHOP | NZ ONLINE STORE',
      subheading: "Buy Lollies Online NZ — New Zealand's Favourite Candy Store",
      description: "Indulge in our exquisite selection of bulk lollies, retro kiwi sweets, party pick & mix, and luxury chocolates. Freshly packed in Auckland and delivered straight to your door across NZ.",
      badgeText: '100% NZ Owned & Operated',
      buttonText: 'Explore Sweet Shop',
      buttonLink: '/shop',
      secondaryButtonText: 'Best Sellers',
      secondaryButtonLink: '#favourites',
      heroImage: '/hero_candy_display.png',
      themeGlow: 'glow-pink',
      floatingIcons: ['🍬', '🍭', '🍫', '🍑', '🍒'],
      infoCards: [
        { icon: '🍭', title: '100% Pure Joy', subtitle: 'Natural Fruit Extracts' },
        { icon: '🚚', title: 'Free Delivery', subtitle: 'Hamilton, New Zealand' }
      ]
    },
    {
      id: 'slide-2',
      enabled: true,
      heading: 'EXPLORE OUR SOUR | & CHEWY CANDIES',
      subheading: 'Mind-Blowing Sour Straps, Rings & Gummy Bears',
      description: 'Tantalize your taste buds with our extreme sour collection! From fizzy rainbow belts to mouth-watering sour peach rings, find your ultimate sour rush here.',
      badgeText: '🔥 Trending & Viral Sweets',
      buttonText: 'Shop Sour Sweets',
      buttonLink: '/shop?category=Sour%20Lollies',
      secondaryButtonText: 'View Collections',
      secondaryButtonLink: '/shop',
      heroImage: '/hero_sour_candy.jpg',
      themeGlow: 'glow-gold',
      floatingIcons: ['🍋', '⚡', '🍬', '💥', '🍭'],
      infoCards: [
        { icon: '⚡', title: 'Fizzy & Sour', subtitle: 'Real Fruit Flavours' },
        { icon: '🎉', title: 'Party Bundles', subtitle: 'Bulk Savings Available' }
      ]
    },
    {
      id: 'slide-3',
      enabled: true,
      heading: 'HAND-CRAFTED LUXURY | CHOCOLATES & TRUFFLES',
      subheading: 'Pure Decadence Delivered Nationwide Across NZ',
      description: 'Rich Belgian dark chocolate, creamy milk truffles, and artisanal hazelnut pralines. Perfect for luxury gifting or an indulgent everyday sweet treat.',
      badgeText: '🍫 Premium Gourmet Selection',
      buttonText: 'Explore Chocolates',
      buttonLink: '/shop?category=Chocolates',
      secondaryButtonText: 'Gift Boxes',
      secondaryButtonLink: '/shop',
      heroImage: '/hero_chocolate_display.jpg',
      themeGlow: 'glow-purple',
      floatingIcons: ['🍫', '✨', '🍩', '👑', '🍓'],
      infoCards: [
        { icon: '👑', title: 'Artisanal Quality', subtitle: 'Master Confectioners' },
        { icon: '🎁', title: 'Luxury Packaging', subtitle: 'Ready for Gifting' }
      ]
    }
  ];

  const activeSlides = allSlides.filter(s => s.enabled !== false);
  const slides = activeSlides.length > 0 ? activeSlides : allSlides;

  const getSlideIndex = (val, len) => {
    if (!len) return 0;
    return ((val % len) + len) % len;
  };

  const slideIndex = getSlideIndex(currentSlide, slides.length);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide(prev => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide(prev => prev - 1);
  }, []);

  const goToSlide = (targetIndex) => {
    const activeIdx = getSlideIndex(currentSlide, slides.length);
    setDirection(targetIndex > activeIdx ? 1 : -1);
    setCurrentSlide(prev => prev + (targetIndex - activeIdx));
  };

  // Parallax mouse effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      setMouseOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-play rotation timer
  useEffect(() => {
    if (sliderSettings.autoPlay === false || !isPlaying || slides.length <= 1) return;

    const intervalTime = sliderSettings.interval || 5000;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [sliderSettings.autoPlay, sliderSettings.interval, isPlaying, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch swipe handling
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;
    if (diffX > 50) nextSlide();
    else if (diffX < -50) prevSlide();
    touchStartX.current = null;
  };

  const currentSlideData = slides[slideIndex] || slides[0];

  const headingText = currentSlideData.heading || "SWEETEN YOUR | EVERYDAY LIFE!";
  const parts = headingText.split('|');
  const mainPart = parts[0].trim();
  const gradientPart = parts[1] ? parts[1].trim() : '';

  const iconsList = currentSlideData.floatingIcons || ['🍬', '🍭', '🍫', '🍑', '🍒'];
  const infoCards = currentSlideData.infoCards || [
    { icon: '🍭', title: '100% Pure Joy', subtitle: 'Natural Fruit Extracts' },
    { icon: '🚚', title: 'Free Delivery', subtitle: 'Hamilton, New Zealand' }
  ];

  // Framer motion variants based on configured effect
  const slideEffect = sliderSettings.animationEffect || 'slide';
  
  const getVariants = () => {
    if (slideEffect === 'fade') {
      return {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
        exit: { opacity: 0, scale: 1.02, transition: { duration: 0.35, ease: 'easeIn' } }
      };
    }
    if (slideEffect === 'zoom') {
      return {
        initial: { opacity: 0, scale: 0.85 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 90 } },
        exit: { opacity: 0, scale: 1.15, transition: { duration: 0.35 } }
      };
    }
    // Default: slide
    return {
      initial: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
      animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 85, damping: 16 } },
      exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0, transition: { duration: 0.35 } })
    };
  };

  const variants = getVariants();

  return (
    <section 
      className="hero-section hero-slider-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ backgroundImage: currentSlideData.backgroundImage ? `url(${currentSlideData.backgroundImage})` : 'none' }}
    >
      {/* Animated Top Progress Bar */}
      {sliderSettings.showProgressBar && sliderSettings.autoPlay && isPlaying && slides.length > 1 && (
        <div className="hero-progress-container">
          <div 
            key={`progress-${currentSlide}`} 
            className="hero-progress-bar"
            style={{ animationDuration: `${sliderSettings.interval || 5000}ms` }}
          />
        </div>
      )}

      {/* Dynamic Background Mesh Glows */}
      <div className={`hero-glow ${currentSlideData.themeGlow || 'glow-pink'} animate-pulse-slow`}></div>
      <div className="hero-glow glow-gold"></div>
      <div className="hero-glow glow-purple"></div>

      {/* Floating Glassmorphic Candies */}
      {iconsList.map((icon, idx) => (
        <div 
          key={`bubble-${currentSlide}-${idx}`}
          className={`floating-glass-bubble bubble-${Math.min(5, idx + 1)} ${idx % 2 === 1 ? 'animate-float-reverse' : 'animate-float'}`}
          style={{ transform: `translate(${mouseOffset.x * (idx % 2 === 0 ? -0.4 - idx * 0.1 : 0.3 + idx * 0.1)}px, ${mouseOffset.y * (idx % 2 === 0 ? -0.4 - idx * 0.1 : 0.3 + idx * 0.1)}px)` }}
        >
          <span>{icon}</span>
        </div>
      ))}

      {/* Left / Right Slider Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button 
            className="hero-nav-arrow arrow-left" 
            onClick={prevSlide}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            className="hero-nav-arrow arrow-right" 
            onClick={nextSlide}
            aria-label="Next Slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Main Slide Content Area */}
      <div className="container hero-container">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="hero-slide-wrapper"
          >
            {/* Left Column: Slide Content */}
            <div className="hero-content">
              {/* Glowing Badge */}
              {currentSlideData.badgeText && (
                <div className="hero-badge">
                  <Sparkles size={14} className="badge-spark" />
                  <span>{currentSlideData.badgeText}</span>
                </div>
              )}

              {/* Title / Heading */}
              <h1 className="hero-title">
                {mainPart}
                {gradientPart && (
                  <>
                    <br />
                    <span className="gradient-text">{gradientPart}</span>
                  </>
                )}
                {currentSlideData.subheading && (
                  <span className="hero-seo-subtitle" style={{ display: 'block', fontSize: '1.2rem', marginTop: '12px', fontWeight: '600', opacity: 0.9, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {currentSlideData.subheading}
                  </span>
                )}
              </h1>

              {/* Subtitle / Description */}
              <p className="hero-subtitle">
                {currentSlideData.description}
              </p>

              {/* Action Buttons */}
              <div className="hero-buttons">
                {currentSlideData.buttonText && (
                  <Link to={currentSlideData.buttonLink || '/shop'} className="btn btn-primary hero-btn-explore">
                    {currentSlideData.buttonText} <ArrowRight size={18} />
                  </Link>
                )}
                {currentSlideData.secondaryButtonText && (
                  <a href={currentSlideData.secondaryButtonLink || '#favourites'} className="btn btn-secondary hero-btn-bestsellers">
                    {currentSlideData.secondaryButtonText}
                  </a>
                )}
              </div>

              {/* Features Row */}
              <div className="hero-features-row">
                <div className="hero-feature-item">
                  <Award size={16} />
                  <span>100% Kiwi Owned</span>
                </div>
                <div className="hero-feature-item">
                  <ShoppingBag size={16} />
                  <span>Bulk & Pick 'n' Mix</span>
                </div>
                <div className="hero-feature-item">
                  <ShieldCheck size={16} />
                  <span>Fast NZ Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Showcase */}
            <div 
              className="hero-visual"
              style={{ transform: `translate(${mouseOffset.x * 0.3}px, ${mouseOffset.y * 0.3}px)` }}
            >
              <div className="hero-showcase-wrapper">
                {/* Visual Glow Ring */}
                <div className="showcase-glow-ring"></div>
                
                {/* Slide Photo Image */}
                <div className="showcase-image-container">
                  <img 
                    src={currentSlideData.heroImage || '/hero_candy_display.png'} 
                    alt={currentSlideData.heading || "Best Lolly Shop NZ"} 
                    className="showcase-main-image"
                  />
                </div>

                {/* Overlapping Floating Info Cards */}
                {infoCards[0] && (
                  <div className="info-card card-left">
                    <div className="ic-icon">{infoCards[0].icon || '🍭'}</div>
                    <div className="ic-details">
                      <h4>{infoCards[0].title || '100% Pure Joy'}</h4>
                      <p>{infoCards[0].subtitle || 'Natural Fruit Extracts'}</p>
                    </div>
                  </div>
                )}

                {infoCards[1] && (
                  <div className="info-card card-right">
                    <div className="ic-icon">{infoCards[1].icon || '🚚'}</div>
                    <div className="ic-details">
                      <h4>{infoCards[1].title || 'Free Delivery'}</h4>
                      <p>{infoCards[1].subtitle || 'Hamilton, NZ'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Slider Pagination & Controls Toolbar */}
      {slides.length > 1 && (
        <div className="hero-controls-bar">
          {/* Dots Pagination */}
          <div className="hero-dots">
            {slides.map((_, idx) => (
              <button
                key={`dot-${idx}`}
                className={`hero-dot ${slideIndex === idx ? 'active' : ''}`}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              >
                <span className="dot-inner"></span>
              </button>
            ))}
          </div>

          {/* Play / Pause Toggle */}
          <button 
            className="hero-play-pause-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause auto-slide" : "Play auto-slide"}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      )}
    </section>
  );
};
