import React from 'react';
import { useStore } from '../context/StoreContext';
import './MarqueeBanner.css';

export const MarqueeBanner = () => {
  const { settings } = useStore();

  const now = new Date();

  // Load marquees from settings, filtering for enabled and scheduled
  const activeMarquees = (settings?.marquees || []).filter(m => {
    if (!m.enabled) return false;
    
    // Check start date schedule
    if (m.startDate) {
      const start = new Date(m.startDate);
      if (now < start) return false;
    }

    // Check end date schedule
    if (m.endDate) {
      const end = new Date(m.endDate);
      if (now > end) return false;
    }

    return true;
  });

  // Fallback if no marquees are defined/enabled
  if (activeMarquees.length === 0) {
    const fallbackText = settings?.marqueeText || "🍬 NZ'S FAVORITE CANDY STORE — FREE SHIPPING ON ORDERS OVER $50! | 🍭 GET 10% OFF YOUR FIRST ORDER WITH CODE: SWEET10";
    const announcements = fallbackText.split('|').map(s => s.trim()).filter(Boolean);
    
    return (
      <div className="marquee-banner" style={{ backgroundColor: '#e72c83', color: '#ffffff' }}>
        <div className="marquee-content">
          <div className="marquee-track" style={{ animationDuration: '30s' }}>
            {announcements.map((text, idx) => (
              <span key={`1-${idx}`} className="marquee-item">{text}</span>
            ))}
          </div>
          <div className="marquee-track" aria-hidden="true" style={{ animationDuration: '30s' }}>
            {announcements.map((text, idx) => (
              <span key={`2-${idx}`} className="marquee-item">{text}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="multiple-marquees-container">
      {activeMarquees.map((marquee, mIdx) => {
        const itemText = `${marquee.icon || '🍬'} ${marquee.text}`.trim();
        // Speed is mapped to animation duration. Higher speed = shorter duration
        const durationSec = Math.max(10, 100 - (marquee.speed || 40));
        
        return (
          <div 
            key={`marquee-${mIdx}`} 
            className={`marquee-banner ${marquee.pauseOnHover ? 'pause-on-hover' : ''}`}
            style={{ 
              backgroundColor: marquee.bgColor || '#e72c83', 
              color: marquee.color || '#ffffff',
              borderBottom: activeMarquees.length > 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              backgroundImage: 'none'
            }}
          >
            <div className="marquee-content">
              <div className="marquee-track" style={{ animationDuration: `${durationSec}s` }}>
                {Array(6).fill(itemText).map((txt, idx) => (
                  <span key={`t1-${idx}`} className="marquee-item">{txt}</span>
                ))}
              </div>
              <div className="marquee-track" aria-hidden="true" style={{ animationDuration: `${durationSec}s` }}>
                {Array(6).fill(itemText).map((txt, idx) => (
                  <span key={`t2-${idx}`} className="marquee-item">{txt}</span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
