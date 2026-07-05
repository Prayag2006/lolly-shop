import React from 'react';
import { useStore } from '../context/StoreContext';
import './MarqueeBanner.css';

export const MarqueeBanner = () => {
  const { settings } = useStore();

  const announcements = settings?.marqueeText
    ? settings.marqueeText.split('|').map(s => s.trim()).filter(Boolean)
    : [
        "✨ FREE SHIPPING ON ALL ORDERS OVER $50 NZD!",
        "🚚 QUICK DELIVERY ACROSS NEW ZEALAND IN 3-5 BUSINESS DAYS!",
        "🍭 USE COUPON CODE 'SWEET10' TO GET 10% OFF!",
        "🍬 FRESHLY HAND-PACKED PREMIUM IMPORTED CANDIES DAILY!",
        "🍫 GOURMET BELGIAN CHOCOLATES NOW IN STOCK!"
      ];

  return (
    <div className="marquee-banner">
      <div className="marquee-content">
        {/* Render twice for infinite loop seamless scroll */}
        <div className="marquee-track">
          {announcements.map((text, idx) => (
            <span key={`1-${idx}`} className="marquee-item">{text}</span>
          ))}
        </div>
        <div className="marquee-track" aria-hidden="true">
          {announcements.map((text, idx) => (
            <span key={`2-${idx}`} className="marquee-item">{text}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
