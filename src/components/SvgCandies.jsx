import React from 'react';

// 1. Lollipop SVG
export const LollipopSVG = ({ size = 64, className = '', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0 10px 15px rgba(255, 117, 140, 0.25))', ...style }}
  >
    <defs>
      <linearGradient id="lollipopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF758C" />
        <stop offset="50%" stopColor="#FF7EB3" />
        <stop offset="100%" stopColor="#00F2FE" />
      </linearGradient>
      <linearGradient id="stickGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    {/* Translucent Stick */}
    <rect x="47" y="65" width="6" height="50" rx="3" fill="url(#stickGrad)" />
    {/* Swirling Candy Body */}
    <circle cx="50" cy="45" r="35" fill="url(#lollipopGrad)" />
    {/* Swirl lines */}
    <path
      d="M50 15 C60 15, 80 25, 80 45 C80 65, 60 75, 50 75 C40 75, 20 65, 20 45 C20 25, 40 25, 50 25 C60 25, 70 35, 70 45 C70 55, 60 60, 50 60 C42 60, 35 55, 35 45 C35 38, 42 35, 50 35"
      stroke="#FFFFFF"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeOpacity="0.75"
    />
    {/* Glass reflection arcs */}
    <path
      d="M23 30 A 28 28 0 0 1 77 30"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeOpacity="0.6"
    />
  </svg>
);

// 2. Wrapped Candy SVG
export const CandySVG = ({ size = 64, className = '', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0 10px 15px rgba(255, 94, 98, 0.25))', ...style }}
  >
    <defs>
      <linearGradient id="candyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FF9966" />
        <stop offset="50%" stopColor="#FF5E62" />
        <stop offset="100%" stopColor="#FF9966" />
      </linearGradient>
      <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF5E62" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FF9966" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    {/* Left Twist */}
    <path d="M15 50 L35 38 L35 62 Z" fill="url(#wingGrad)" stroke="#FF5E62" strokeWidth="1.5" />
    <path d="M10 42 L35 50 L10 58 Z" fill="url(#wingGrad)" />
    {/* Right Twist */}
    <path d="M85 50 L65 38 L65 62 Z" fill="url(#wingGrad)" stroke="#FF5E62" strokeWidth="1.5" />
    <path d="M90 42 L65 50 L90 58 Z" fill="url(#wingGrad)" />
    {/* Main Oval Body */}
    <rect x="30" y="32" width="40" height="36" rx="18" fill="url(#candyGrad)" />
    {/* Highlights and Stripes */}
    <path d="M42 35 C42 35, 46 50, 42 65" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
    <path d="M50 35 C50 35, 54 50, 50 65" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
    <path d="M58 35 C58 35, 62 50, 58 65" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
    <path d="M35 40 A 12 12 0 0 1 65 40" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
  </svg>
);

// 3. Chocolate Bar SVG
export const ChocolateSVG = ({ size = 64, className = '', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0 10px 15px rgba(74, 14, 23, 0.25))', ...style }}
  >
    <defs>
      <linearGradient id="chocoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6C392B" />
        <stop offset="100%" stopColor="#3D1D16" />
      </linearGradient>
      <linearGradient id="foilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E2E8F0" />
        <stop offset="50%" stopColor="#CBD5E1" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
      <linearGradient id="wrapperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF758C" />
        <stop offset="100%" stopColor="#FF7EB3" />
      </linearGradient>
    </defs>
    {/* Chocolate Blocks */}
    <rect x="25" y="15" width="50" height="70" rx="6" fill="url(#chocoGrad)" />
    
    {/* Individual Block Lines */}
    <rect x="30" y="20" width="18" height="18" rx="2" fill="#5A2E22" stroke="#7A4537" strokeWidth="1" />
    <rect x="52" y="20" width="18" height="18" rx="2" fill="#5A2E22" stroke="#7A4537" strokeWidth="1" />
    
    <rect x="30" y="42" width="18" height="18" rx="2" fill="#5A2E22" stroke="#7A4537" strokeWidth="1" />
    <rect x="52" y="42" width="18" height="18" rx="2" fill="#5A2E22" stroke="#7A4537" strokeWidth="1" />
    
    <rect x="30" y="64" width="18" height="10" rx="2" fill="#5A2E22" stroke="#7A4537" strokeWidth="1" />
    <rect x="52" y="64" width="18" height="10" rx="2" fill="#5A2E22" stroke="#7A4537" strokeWidth="1" />

    {/* Silver Foil Wrapper (Torn Look) */}
    <path d="M22 55 L78 48 L78 87 L22 87 Z" fill="url(#foilGrad)" />
    <path d="M22 55 L35 50 L48 57 L62 51 L78 48 L70 60 L60 55 L40 62 Z" fill="#E2E8F0" />

    {/* Outer Pink Wrapper */}
    <path d="M22 62 L78 57 L78 87 L22 87 Z" fill="url(#wrapperGrad)" />
    
    {/* Brand Label on Wrapper */}
    <rect x="34" y="68" width="32" height="10" rx="2" fill="#FFFFFF" fillOpacity="0.2" />
    <circle cx="50" cy="73" r="3" fill="#FFFFFF" />
  </svg>
);

// 4. Gummy Bear / Marshmallow Cloud SVG
export const GummySVG = ({ size = 64, className = '', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0 8px 12px rgba(108, 92, 231, 0.25))', ...style }}
  >
    <defs>
      <linearGradient id="gummyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A29BFE" />
        <stop offset="100%" stopColor="#6C5CE7" />
      </linearGradient>
    </defs>
    {/* Ears */}
    <circle cx="34" cy="30" r="10" fill="url(#gummyGrad)" />
    <circle cx="66" cy="30" r="10" fill="url(#gummyGrad)" />
    {/* Head */}
    <circle cx="50" cy="42" r="20" fill="url(#gummyGrad)" />
    {/* Body */}
    <rect x="32" y="54" width="36" height="34" rx="16" fill="url(#gummyGrad)" />
    {/* Arms */}
    <rect x="22" y="58" width="12" height="16" rx="6" fill="url(#gummyGrad)" />
    <rect x="66" y="58" width="12" height="16" rx="6" fill="url(#gummyGrad)" />
    {/* Feet */}
    <circle cx="36" cy="85" r="10" fill="url(#gummyGrad)" />
    <circle cx="64" cy="85" r="10" fill="url(#gummyGrad)" />
    {/* Inner Specular Highlight */}
    <path
      d="M40 38 A 10 10 0 0 1 60 38"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.4"
    />
    <circle cx="44" cy="40" r="1.5" fill="#FFFFFF" />
    <circle cx="56" cy="40" r="1.5" fill="#FFFFFF" />
    <rect x="42" y="60" width="16" height="20" rx="8" fill="#FFFFFF" fillOpacity="0.1" />
  </svg>
);

// 5. Peach SVG
export const PeachSVG = ({ size = 64, className = '', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0 10px 15px rgba(255, 142, 83, 0.25))', ...style }}
  >
    <defs>
      <linearGradient id="peachGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFA751" />
        <stop offset="100%" stopColor="#FF5E62" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    {/* Green Leaf */}
    <path d="M55 22 C65 8, 80 18, 70 28 C60 38, 55 28, 55 22 Z" fill="url(#leafGrad)" />
    {/* Peach Shape */}
    <path
      d="M50 30 C30 30, 20 48, 20 64 C20 82, 38 88, 50 88 C62 88, 80 82, 80 64 C80 48, 70 30, 50 30 Z"
      fill="url(#peachGrad)"
    />
    {/* Peach Center Crease */}
    <path d="M50 30 C46 45, 46 72, 50 88" stroke="#E11D48" strokeWidth="2.5" strokeOpacity="0.4" />
    {/* Specular Highlight */}
    <circle cx="34" cy="50" r="6" fill="#FFFFFF" fillOpacity="0.35" style={{ filter: 'blur(1px)' }} />
  </svg>
);

// 6. Cherry SVG
export const CherrySVG = ({ size = 64, className = '', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0 10px 15px rgba(239, 68, 68, 0.25))', ...style }}
  >
    <defs>
      <linearGradient id="cherryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
    </defs>
    {/* Stems */}
    <path d="M50 18 Q55 35 38 65" stroke="#047857" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M50 18 Q62 40 68 62" stroke="#047857" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    {/* Leaf */}
    <path d="M50 18 C40 10, 32 18, 42 22 Z" fill="#10B981" />
    
    {/* Cherry Left */}
    <circle cx="35" cy="68" r="16" fill="url(#cherryGrad)" />
    <ellipse cx="30" cy="62" rx="4" ry="2" transform="rotate(-30 30 62)" fill="#FFFFFF" fillOpacity="0.5" />

    {/* Cherry Right */}
    <circle cx="68" cy="65" r="16" fill="url(#cherryGrad)" />
    <ellipse cx="63" cy="59" rx="4" ry="2" transform="rotate(-30 63 59)" fill="#FFFFFF" fillOpacity="0.5" />
  </svg>
);

// 7. Donut SVG
export const DonutSVG = ({ size = 64, className = '', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0 10px 15px rgba(219, 39, 119, 0.25))', ...style }}
  >
    <defs>
      <linearGradient id="donutBase" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="frostGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#BE185D" />
      </linearGradient>
    </defs>
    {/* Donut Doughnut base */}
    <circle cx="50" cy="50" r="36" fill="url(#donutBase)" />
    {/* Center Hole Cutout in dough */}
    <circle cx="50" cy="50" r="12" fill="#FFF9FA" /> 
    
    {/* Donut Pink Frosting */}
    <path
      d="M50 18 C32.3 18, 18 32.3, 18 50 C18 53, 19.5 56, 21.5 58 C23 60, 24.5 58.5, 27 61 C29.5 63.5, 28 65, 30.5 67 C33 69, 34.5 67.5, 37 70 C39.5 72.5, 41 71.5, 43.5 74 C45.5 76, 48 78, 50 78 C53 78, 56.5 76.5, 59 74.5 C61 73, 63.5 74.5, 66 72 C68.5 69.5, 67 67, 69.5 64.5 C72 62, 73.5 63.5, 76 61 C78.5 58.5, 77 56, 79 53 C81 50, 82 46.5, 82 43.5 C82.3 26.3, 67 18, 50 18 Z"
      fill="url(#frostGrad)"
    />
    
    {/* Center Hole Cutout in Frosting */}
    <circle cx="50" cy="50" r="12" fill="#FFF9FA" className="donut-hole-bg" />
    
    {/* Sprinkles */}
    <rect x="30" y="32" width="6" height="2" rx="1" fill="#FFFFFF" transform="rotate(30 30 32)" />
    <rect x="64" y="32" width="6" height="2" rx="1" fill="#FFE259" transform="rotate(-45 64 32)" />
    <rect x="25" y="52" width="6" height="2" rx="1" fill="#00F2FE" transform="rotate(60 25 52)" />
    <rect x="70" y="52" width="6" height="2" rx="1" fill="#FFFFFF" transform="rotate(15 70 52)" />
    <rect x="42" y="25" width="6" height="2" rx="1" fill="#FFE259" transform="rotate(-10 42 25)" />
    <rect x="58" y="70" width="6" height="2" rx="1" fill="#00F2FE" transform="rotate(45 58 70)" />
    <rect x="34" y="66" width="6" height="2" rx="1" fill="#FFFFFF" transform="rotate(-30 34 66)" />
  </svg>
);

// 8. Sparkle/Star SVG
export const SparkleSVG = ({ size = 24, className = '', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0 0 8px rgba(255, 211, 105, 0.6))', ...style }}
  >
    <path
      d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"
      fill="#FFE259"
    />
  </svg>
);

// 9. Master Selector Component
export const CandyVisual = ({ emoji, size = 64, className = '', style = {} }) => {
  // Map standard emojis or strings to custom vectors
  switch (emoji) {
    case '🍭':
      return <LollipopSVG size={size} className={className} style={style} />;
    case '🍬':
      return <CandySVG size={size} className={className} style={style} />;
    case '🍫':
      return <ChocolateSVG size={size} className={className} style={style} />;
    case '☁️':
    case '🥥':
      return <GummySVG size={size} className={className} style={style} />;
    case '🍑':
      return <PeachSVG size={size} className={className} style={style} />;
    case '🍒':
      return <CherrySVG size={size} className={className} style={style} />;
    case '🍩':
      return <DonutSVG size={size} className={className} style={style} />;
    case '✨':
      return <SparkleSVG size={size} className={className} style={style} />;
    default:
      return <CandySVG size={size} className={className} style={style} />;
  }
};
