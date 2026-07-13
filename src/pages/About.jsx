import React from 'react';
import { Sparkles, Heart, ShieldCheck, Compass, Users } from 'lucide-react';
import { CandyVisual } from '../components/SvgCandies';
import { useStore } from '../context/StoreContext';
import { SEO } from '../components/SEO';
import './About.css';

export const About = () => {
  const { settings } = useStore();

  const aboutSettings = settings?.aboutUs || {
    heading: 'Our Sweet Journey',
    subheading: 'Crafting smiles and supplying the finest confections across New Zealand since 2018.',
    description: 'Lolly Shop began with a simple mission: to bring the joy of premium confections right to your doorstep. Over the years, we have sourced the finest candies from around the globe while supporting local Kiwi makers.',
    story: 'Our story started in Auckland with a tiny storefront and a big passion for quality confectionery. Today, we are proud to be New Zealand\'s leading online sweet delivery store, sending thousands of packages of happiness every month.',
    mission: 'To satisfy every sweet tooth with top-tier, fresh lollies, while delivering exceptional, reliable service.',
    vision: 'To become the premier confection hub in the Southern Hemisphere, known for unique imported varieties and premium local packaging.',
    images: ['/about_showcase1.png'],
    gallery: [],
    seoTitle: 'About Best Lolly Shop - Premium NZ Sweets',
    seoDescription: 'Read our story and mission. Learn how Best Lolly Shop became New Zealand\'s favorite online sweet candy store.'
  };

  const values = [
    {
      icon: <Sparkles size={24} />,
      title: 'Premium Quality',
      desc: 'We source only the finest gourmet lollies, imported sweets, and luxury chocolates.'
    },
    {
      icon: <Heart size={24} />,
      title: 'Hand-Packed with Love',
      desc: 'Every single candy box is packed by hand in Auckland to ensure absolute perfection.'
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Certified Freshness',
      desc: 'We guarantee strict temperature-controlled storage and optimal shelf life.'
    },
    {
      icon: <Compass size={24} />,
      title: 'Locally Owned',
      desc: 'Proudly New Zealand owned and operated, sharing sweetness nationwide.'
    }
  ];

  const team = [
    {
      name: 'Sarah Jenkins',
      role: 'Founder & Candy Curator',
      emoji: '🍭',
      bio: 'Lover of all things sweet and sour. Sarah started Lolly Shop to bring rare confections to Kiwi homes.'
    },
    {
      name: 'Liam Thompson',
      role: 'Master Chocolatier',
      emoji: '🍫',
      bio: 'Belgian-trained chocolate designer. Liam oversees all things cocoa, caramel, and truffles.'
    },
    {
      name: 'Emma Radic',
      role: 'Operations Director',
      emoji: '🍬',
      bio: 'Ensures your sweet box arrives fresh, intact, and at record speeds across New Zealand.'
    }
  ];

  return (
    <div className="about-page">
      <SEO 
        title={aboutSettings.seoTitle || "About Us - Best Lolly Shop"} 
        description={aboutSettings.seoDescription}
        keywords={aboutSettings.metaKeywords}
        image={aboutSettings.ogImage}
      />
      {/* Hero Banner Section */}
      <section className="about-hero">
        <div className="about-hero-glow glow-pink animate-pulse-slow"></div>
        <div className="about-hero-glow glow-purple"></div>
        
        <div className="container">
          <div className="about-hero-content">
            <span className="badge">
              <Sparkles size={13} style={{ marginRight: '5px' }} /> Our Story
            </span>
            <h1>{aboutSettings.heading}</h1>
            <p>{aboutSettings.subheading}</p>
          </div>
        </div>
        
        {/* Fading bottom divider */}
        <div className="about-hero-fade"></div>
      </section>

      {/* Main Narrative Section */}
      <section className="about-story-section section-padding">
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-text">
              <h2>Sharing Happiness, One Sweet Box at a Time</h2>
              <p>{aboutSettings.description}</p>
              <p>{aboutSettings.story}</p>
            </div>
            
            <div className="about-story-visual">
              {aboutSettings.images && aboutSettings.images[0] && aboutSettings.images[0] !== '/about_showcase1.png' ? (
                <div className="about-visual-box-image-container">
                  <img src={aboutSettings.images[0]} alt="Showcase" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div className="about-story-visual-mockup glass-card animate-float">
                  <div className="mockup-header">
                    <span className="mockup-badge">✨ 100% Kiwi Owned</span>
                    <span className="mockup-verified">Premium Confections</span>
                  </div>
                  <div className="mockup-body">
                    <div className="mockup-stat-row">
                      <div className="mockup-stat-circle">
                        <span className="mockup-stat-number">10k+</span>
                        <span className="mockup-stat-label">Happy Customers</span>
                      </div>
                      <div className="mockup-features">
                        <div className="mockup-feature-item">
                          <span className="feature-icon">🚚</span>
                          <div>
                            <h5>Express Delivery</h5>
                            <p>Fast NZ-wide shipping</p>
                          </div>
                        </div>
                        <div className="mockup-feature-item">
                          <span className="feature-icon">🍬</span>
                          <div>
                            <h5>Fresh Guarantee</h5>
                            <p>Hand-packed with love</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mockup-testimonial-card glass-card">
                      <div className="testimonial-header">
                        <span className="stars">⭐⭐⭐⭐⭐</span>
                        <span className="time">Auckland</span>
                      </div>
                      <p className="testimonial-quote">"The best sour lollies in New Zealand! Incredibly fresh and fast shipping."</p>
                      <h6 className="testimonial-author">— James T.</h6>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      {(aboutSettings.mission || aboutSettings.vision) && (
        <section className="about-mission-vision section-padding">
          <div className="container">
            <div className="about-mission-grid">
              {aboutSettings.mission && (
                <div className="glass-card mission-card">
                  <h3>Our Mission</h3>
                  <p>{aboutSettings.mission}</p>
                </div>
              )}
              {aboutSettings.vision && (
                <div className="glass-card vision-card">
                  <h3>Our Vision</h3>
                  <p>{aboutSettings.vision}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Core Values Section */}
      <section className="about-values-section section-padding">
        <div className="container">
          <div className="section-header">
            <span className="badge">Our Ethos</span>
            <h2>What Drives Us</h2>
            <p>We believe in maintaining the highest standards for our community</p>
          </div>

          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card glass-card">
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {aboutSettings.gallery && aboutSettings.gallery.length > 0 && (
        <section className="about-gallery section-padding">
          <div className="container">
            <div className="section-header">
              <span className="badge">Gallery</span>
              <h2>Visual Sweetness</h2>
              <p>Explore snapshots of our confections and packaging process</p>
            </div>
            <div className="about-gallery-grid">
              {aboutSettings.gallery.map((img, i) => (
                <div key={i} className="about-gallery-item">
                  <img src={img} alt={`Gallery ${i}`} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      <section className="about-team-section section-padding">
        <div className="container">
          <div className="section-header">
            <span className="badge">
              <Users size={12} style={{ marginRight: '4px' }} /> The Team
            </span>
            <h2>Meet the Candy Curators</h2>
            <p>The passionate foodies behind New Zealand's Sweetest Shop</p>
          </div>

          <div className="team-grid">
            {team.map((member, i) => (
              <div key={i} className="team-card glass-card">
                <div className="team-avatar-box">
                  <div className="team-avatar-inner">
                    <span>{member.emoji}</span>
                  </div>
                </div>
                <h3>{member.name}</h3>
                <span className="team-role">{member.role}</span>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
