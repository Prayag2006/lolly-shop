import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, SkipForward, Play } from 'lucide-react';
import './VideoSplash.css';

export function VideoSplash({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const handleEnter = useCallback(() => {
    setIsExiting(true);
    // Persist in sessionStorage so it doesn't auto-popup on every page navigation in this session
    sessionStorage.setItem('lolly_shop_splash_shown', 'true');
    setTimeout(() => {
      onComplete();
    }, 600); // match transition duration in CSS
  }, [onComplete]);

  const attemptPlay = useCallback(() => {
    if (!videoRef.current) return;
    
    // Ensure video is muted for initial autoplay approval by browsers
    videoRef.current.muted = isMuted;
    
    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsLoaded(true);
          setIsAutoplayBlocked(false);
        })
        .catch(err => {
          console.warn("Muted autoplay blocked or interrupted:", err);
          setIsLoaded(true);
          setIsAutoplayBlocked(true);
        });
    }
  }, [isMuted]);

  useEffect(() => {
    // 10-second safety fallback timeout for extremely slow or stalled network downloads
    const timer = setTimeout(() => {
      if (!isLoaded && !isPlaying) {
        console.warn("Video load timed out (10s). Transitioning to site.");
        handleEnter();
      }
    }, 10000);

    // If video is already cached by browser or ready to play
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.playsInline = true;
      
      if (videoRef.current.readyState >= 2) {
        setIsLoaded(true);
        attemptPlay();
      }
    }

    return () => clearTimeout(timer);
  }, [isLoaded, isPlaying, handleEnter, attemptPlay]);

  const handleVideoLoaded = () => {
    console.log("Video metadata & data loaded successfully.");
    setIsLoaded(true);
    attemptPlay();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleTapToPlay = () => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsAutoplayBlocked(false);
        })
        .catch(err => {
          console.error("Tap to play failed:", err);
          handleEnter();
        });
    }
  };

  return (
    <div 
      className={`video-splash-container ${isExiting ? 'exit-fade' : ''}`}
      onClick={isAutoplayBlocked ? handleTapToPlay : undefined}
    >
      {/* Loading State Spinner (shows while video.mp4 is initial downloading) */}
      {!isLoaded && (
        <div className="splash-loader-spinner-container">
          <div className="spinner-glow-ring"></div>
          <div className="spinner-candy-icon">🍬</div>
          <h2 className="spinner-title">Lolly Shop</h2>
          <p className="spinner-text">Preparing your sweet treats...</p>
        </div>
      )}

      {/* Tap To Play Overlay if browser blocked unmuted autoplay */}
      {isAutoplayBlocked && (
        <div className="splash-autoplay-blocked-overlay" onClick={handleTapToPlay}>
          <div className="play-pulse-btn">
            <Play size={36} fill="#ffffff" color="#ffffff" style={{ marginLeft: '4px' }} />
          </div>
          <p className="play-prompt-text">Tap anywhere to play intro video 🍬</p>
        </div>
      )}

      <video
        ref={videoRef}
        className={`splash-video-bg ${isLoaded ? 'loaded' : 'loading'}`}
        muted={true}
        defaultMuted={true}
        playsInline={true}
        autoPlay={true}
        onLoadedData={handleVideoLoaded}
        onCanPlay={handleVideoLoaded}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnter}
        onError={(e) => {
          console.error("Video element error:", e);
          handleEnter();
        }}
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>
      
      {/* Controls Container */}
      <div className="splash-controls-top">
        {/* Audio Mute/Unmute Toggle */}
        <button 
          className="splash-control-btn splash-mute-btn" 
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute Intro Video" : "Mute Intro Video"}
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          <span>{isMuted ? "Unmute" : "Sound On"}</span>
        </button>

        {/* Skip Intro button */}
        <button 
          className="splash-control-btn splash-skip-btn" 
          onClick={(e) => {
            e.stopPropagation();
            handleEnter();
          }}
          aria-label="Skip Intro"
        >
          <span>Skip Intro</span>
          <SkipForward size={18} />
        </button>
      </div>

      {/* Bottom Visual Progress Bar */}
      <div className="splash-progress-container">
        <div 
          className="splash-progress-fill" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
}

