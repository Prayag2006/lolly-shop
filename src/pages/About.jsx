import React from 'react';
import { Sparkles, Heart, ShieldCheck, Compass, Users } from 'lucide-react';
import { CandyVisual } from '../components/SvgCandies';
import './About.css';

export const About = () => {
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
      {/* Hero Banner Section */}
      <section className="about-hero">
        <div className="about-hero-glow glow-pink animate-pulse-slow"></div>
        <div className="about-hero-glow glow-purple"></div>
        
        <div className="container">
          <div className="about-hero-content">
            <span className="badge">
              <Sparkles size={13} style={{ marginRight: '5px' }} /> Our Story
            </span>
            <h1>Our Sweet Journey</h1>
            <p>Bringing premium confections, luxury chocolates, and sour straps straight to Kiwi doors since 2018.</p>
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
              <p>
                Lolly Shop began with a simple craving for authentic, premium candy. We realized how difficult it was to source high-fidelity imported sweets and luxury chocolates that tasted as good as they looked.
              </p>
              <p>
                What started in a small home office in Auckland has grown into one of New Zealand's favorite online sweet destinations. We hand-pick confections from the world’s leading candy artisans, package them beautifully in custom glassmorphic pouches, and ship them direct to your door.
              </p>
            </div>
            
            <div className="about-story-visual">
              <div className="about-visual-box glass-card animate-float">
                <div className="about-candy-circle">
                  <CandyVisual emoji="🍭" size={72} />
                </div>
                <div className="about-decor-circle">
                  <CandyVisual emoji="🍩" size={48} />
                </div>
                <div className="about-floating-card glass-card">
                  <Heart size={20} className="glow-icon" />
                  <div>
                    <h4>100% Sweet</h4>
                    <p>NZ Owned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
