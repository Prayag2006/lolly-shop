import React, { useState, useRef, useEffect } from 'react';
import './VideoSplash.css';

export function VideoSplash({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);

  const handleEnter = () => {
    setIsExiting(true);
    // Persist in sessionStorage so it doesn't show again in this session
    sessionStorage.setItem('lolly_shop_splash_shown', 'true');
    setTimeout(() => {
      onComplete();
    }, 600); // match transition duration in CSS
  };

  const handleVideoLoaded = () => {
    console.log("Video loaded successfully.");
    setIsLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn("Autoplay blocked or failed, wait for click to play or skip", err);
      });
    }
  };

  return (
    <div className={`video-splash-container ${isExiting ? 'exit-fade' : ''}`}>
      {/* Loading State Spinner (shows while video.mp4 is downloading) */}
      {!isLoaded && (
        <div className="splash-loader-spinner-container">
          <div className="spinner-glow-ring"></div>
          <div className="spinner-candy-icon animate-spin-slow">🍬</div>
          <h2 className="spinner-title">Lolly Shop</h2>
          <p className="spinner-text">Preparing your sweet treats...</p>
        </div>
      )}

      <video
        ref={videoRef}
        className={`splash-video-bg ${isLoaded ? 'loaded' : 'loading'}`}
        src="/video.mp4"
        type="video/mp4"
        muted
        playsInline
        autoPlay
        onLoadedData={handleVideoLoaded}
        onEnded={handleEnter}
        onError={handleEnter} // Go directly to site if video fails to load
      />
      
      {/* Skip Intro button positioned in bottom-left */}
      <button 
        className="splash-skip-btn" 
        onClick={handleEnter}
        aria-label="Skip Intro"
      >
        <span>Skip Intro</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  );
}
