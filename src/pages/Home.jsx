import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { SEO } from '../components/SEO';
import {
  Star,
  Users,
  Award,
  Heart,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Smile
} from 'lucide-react';

const Instagram = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
import { useStore } from '../context/StoreContext';
import { CandyVisual } from '../components/SvgCandies';
import './Home.css';

const BrandSvg = ({ type, name }) => {
  switch (type) {
    case 'bazooka': return (
      <svg viewBox="0 0 160 60" style={{ width: '85%' }}>
        <rect x="2" y="2" width="156" height="56" rx="8" fill="#e8003d" />
        <text x="80" y="38" fontFamily="Impact, Arial Black, sans-serif" fontWeight="900" fontSize="28" fill="#ffd700" textAnchor="middle" letterSpacing="2">BAZOOKA</text>
      </svg>
    );
    case 'chupachups': return (
      <svg viewBox="0 0 120 120" style={{ width: '75%' }}>
        <circle cx="60" cy="60" r="58" fill="#ffd700" stroke="#e20613" strokeWidth="3" />
        <circle cx="60" cy="60" r="48" fill="#fff" />
        <text x="60" y="52" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="10" fill="#e20613" textAnchor="middle">CHUPA</text>
        <text x="60" y="66" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="10" fill="#e20613" textAnchor="middle">CHUPS</text>
        <circle cx="60" cy="82" r="6" fill="#e20613" />
        <line x1="60" y1="88" x2="60" y2="108" stroke="#e20613" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
    case 'hersheys': return (
      <svg viewBox="0 0 180 70" style={{ width: '88%' }}>
        <text x="90" y="30" fontFamily="Georgia, serif" fontWeight="700" fontSize="13" fill="#d4a017" textAnchor="middle" letterSpacing="3">THE</text>
        <text x="90" y="52" fontFamily="Georgia, serif" fontWeight="900" fontSize="22" fill="#d4a017" textAnchor="middle" letterSpacing="1">HERSHEY'S</text>
        <line x1="15" y1="57" x2="165" y2="57" stroke="#d4a017" strokeWidth="1" />
        <text x="90" y="67" fontFamily="Georgia, serif" fontSize="8" fill="#d4a017" textAnchor="middle" letterSpacing="4">COMPANY</text>
      </svg>
    );
    case 'reeses': return (
      <svg viewBox="0 0 160 80" style={{ width: '85%' }}>
        <rect x="5" y="5" width="150" height="70" rx="6" fill="#ffd200" />
        <text x="80" y="32" fontFamily="Arial Black, Impact, sans-serif" fontWeight="900" fontSize="11" fill="#f05a28" textAnchor="middle" letterSpacing="1">REESE'S</text>
        <text x="80" y="52" fontFamily="Arial Black, Impact, sans-serif" fontWeight="900" fontSize="20" fill="#f05a28" textAnchor="middle">Peanut Butter</text>
        <text x="80" y="66" fontFamily="Arial Black, Impact, sans-serif" fontWeight="900" fontSize="9" fill="#c03a0a" textAnchor="middle" letterSpacing="2">CUPS</text>
      </svg>
    );
    case 'walkers': return (
      <svg viewBox="0 0 100 100" style={{ width: '85%', height: '85%' }}>
        <path d="M 50 5 A 45 45 0 0 0 18.2 18.2 A 45 45 0 0 0 5 50 A 45 45 0 0 0 18.2 81.8 A 45 45 0 0 0 50 95 A 45 45 0 0 0 81.8 81.8 A 45 45 0 0 0 95 50 A 45 45 0 0 0 81.8 18.2 A 45 45 0 0 0 50 5 Z" fill="#e5c158" stroke="#d4b047" strokeWidth="1.5" />
        <path d="M 50 8 A 42 42 0 0 0 20.3 20.3 A 42 42 0 0 0 8 50 A 42 42 0 0 0 20.3 79.7 A 42 42 0 0 0 50 92 A 42 42 0 0 0 79.7 79.7 A 42 42 0 0 0 92 50 A 42 42 0 0 0 79.7 20.3 A 42 42 0 0 0 50 8 Z" fill="#ffffff" stroke="#d4b047" strokeWidth="1" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="#d4b047" strokeWidth="1" strokeDasharray="3,2" />
        <path id="walkers-curve2" d="M 23 50 A 27 27 0 0 1 77 50" fill="none" />
        <text fontFamily="Nunito" fontWeight="900" fontSize="5.2" fill="#2b2b2b" textAnchor="middle">
          <textPath href="#walkers-curve2" startOffset="50%">ENGLAND'S FINEST</textPath>
        </text>
        <text x="50" y="44" fontFamily="Nunito" fontWeight="700" fontSize="4" fill="#666" textAnchor="middle">Est 1894</text>
        <path d="M 44 56 L 44 49 L 46 49 L 46 51 L 48 51 L 48 49 L 52 49 L 52 51 L 54 51 L 54 49 L 56 49 L 56 56 Z" fill="#2b2b2b" />
        <text x="50" y="66" fontFamily="Nunito" fontWeight="900" fontSize="8.5" fill="#e72c83" textAnchor="middle">WALKER'S</text>
        <text x="50" y="73" fontFamily="Nunito" fontWeight="800" fontSize="4.5" fill="#2b2b2b" textAnchor="middle">NONSUCH</text>
      </svg>
    );
    case 'warheads': return (
      <svg viewBox="0 0 160 80" style={{ width: '85%' }}>
        <polygon points="80,5 55,45 70,45 50,75 105,35 88,35" fill="#f7e02e" />
        <text x="80" y="78" fontFamily="Impact, Arial Black, sans-serif" fontWeight="900" fontSize="13" fill="#f7e02e" textAnchor="middle" letterSpacing="3">WARHEADS</text>
      </svg>
    );
    default: return (
      <svg viewBox="0 0 160 60" style={{ width: '85%' }}>
        <text x="80" y="38" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="18" fill="#fff" textAnchor="middle">{name}</text>
      </svg>
    );
  }
};

export const Home = ({ onProductClick }) => {
  const { products, brands, testimonials: dbTestimonials, addTestimonial, currentUser, settings } = useStore();
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const [testName, setTestName] = useState('');
  const [testRole, setTestRole] = useState('');
  const [testQuote, setTestQuote] = useState('');
  const [testRating, setTestRating] = useState(5);
  const [testSuccess, setTestSuccess] = useState('');
  const [testError, setTestError] = useState('');

  const fallbackTestimonials = [
    {
      name: 'Priya Sharma',
      role: 'Sweet Enthusiast',
      avatar: 'P',
      quote: 'Best Lolly Shop has the most amazing collection! The quality is unmatched and delivery is always on time. My kids absolutely love their gummies!',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      role: 'Regular Customer',
      avatar: 'R',
      quote: 'I\'ve ordered from many candy stores, but none compare to Best Lolly Shop. Fresh, delicious, and beautifully packaged. Perfect for gifting!',
      rating: 5
    },
    {
      name: 'Anita Patel',
      role: 'Party Planner',
      avatar: 'A',
      quote: 'Their bulk orders for parties are fantastic! Great variety, competitive prices, and the customer service is exceptional. Highly recommended!',
      rating: 5
    },
    {
      name: 'Vikram Singh',
      role: 'Chocolate Lover',
      avatar: 'V',
      quote: 'The chocolates are divine! Premium quality at reasonable prices. Best Lolly Shop is now my go-to for all sweet cravings.',
      rating: 5
    }
  ];

  const testimonialsList = dbTestimonials && dbTestimonials.length > 0 ? dbTestimonials : fallbackTestimonials;

  useEffect(() => {
    if (testimonialsList.length === 0) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonialsList.length);
    }, 4500); // Auto-slide every 4.5 seconds
    return () => clearInterval(interval);
  }, [testimonialsList.length]);

  useEffect(() => {
    if (currentUser) {
      setTestName(currentUser.name);
    } else {
      setTestName('');
    }
  }, [currentUser]);

  // Filter popular products for "Forever Favourites" with fallback if isPopular is unset
  const popularFiltered = products.filter((p) => p.isPopular);
  const popularProducts = popularFiltered.length > 0 
    ? popularFiltered.slice(0, 4) 
    : products.slice(0, 4);

  // Filter discoveries for "Sweet Discoveries" with fallback
  const discoveriesFiltered = products.filter((p) => !p.isPopular);
  const discoveries = discoveriesFiltered.length > 0 
    ? discoveriesFiltered.slice(0, 4) 
    : products.slice(4, 8);

  const faqs = [
    {
      q: 'Why is Best Lolly Shop considered the best lolly shop in NZ?',
      a: 'Best Lolly Shop is rated the best lolly shop in NZ because we offer New Zealand\'s largest online lollyshop selection of imported candy, classic kiwi lollies, pick & mix lollies, freeze dried treats, and chocolate in NZ with ultra-fast nationwide shipping.'
    },
    {
      q: 'Do you deliver lollies & chocolates nationwide across New Zealand?',
      a: 'Yes! We provide fast sweets delivery NZ nationwide to both North Island & South Island destinations including Hamilton, Auckland, Christchurch, Wellington, Tauranga, Dunedin, Queenstown, Rotorua, Palmerston North, Nelson, New Plymouth, Napier, Whangarei, and all regional NZ towns.'
    },
    {
      q: 'Do you offer vegan, sugar-free, gluten-free, or halal lollies?',
      a: 'Absolutely! We stock vegan lollies NZ (gelatine free sweets), sugar free lollies NZ (diabetic candy), gluten free lollies, and halal certified lollies so everyone can enjoy sweet treats.'
    },
    {
      q: 'Can I order bulk lollies for birthday parties, weddings, and corporate events?',
      a: 'Yes! Our bulk lollies NZ section offers 1kg lolly bags, wholesale candy, and pick and mix bulk bags perfect for birthday lolly mixes, wedding candy buffet lollies, christmas lolly gifts, and corporate lolly boxes.'
    },
    {
      q: 'What are your delivery charges?',
      a: 'We offer FREE same day lolly delivery on qualifying orders in Hamilton, New Zealand! For other NZ locations, free delivery applies on all orders above $50 NZD. For orders below $50 NZD, a minimal delivery charge of $5 applies.'
    },
    {
      q: 'How do you ensure product freshness?',
      a: 'We maintain strict quality control and store all products in temperature-controlled facilities to ensure your chocolates in NZ and imported sweets arrive fresh and delicious.'
    }
  ];

  const categories = [
    { name: 'Lollipops', emoji: '🍭', color: 'var(--candy-cyan-gradient)', count: '2 Products' },
    { name: 'Gummies', emoji: '🍬', color: 'linear-gradient(135deg, #FF3366 0%, #FF9933 100%)', count: '2 Products' },
    { name: 'Chocolates', emoji: '🍫', color: 'linear-gradient(135deg, #4A0E17 0%, #0F0C1B 100%)', count: '2 Products' },
    { name: 'Marshmallows', emoji: '☁️', color: 'var(--primary-gradient)', count: '2 Products' }
  ];

  const socialGallery = [
    { emoji: '🍭', tag: '#RainbowPop', glow: 'rgba(0, 242, 254, 0.18)' },
    { emoji: '🍬', tag: '#SourWorms', glow: 'rgba(255, 94, 98, 0.18)' },
    { emoji: '🍫', tag: '#BelgianGold', glow: 'rgba(212, 160, 23, 0.18)' },
    { emoji: '🍑', tag: '#FuzzyPeach', glow: 'rgba(255, 142, 83, 0.18)' },
    { emoji: '🍒', tag: '#SweetCherry', glow: 'rgba(239, 68, 68, 0.18)' },
    { emoji: '🍩', tag: '#GlazedGlory', glow: 'rgba(219, 39, 119, 0.18)' }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const domain = typeof window !== 'undefined' ? window.location.origin : 'https://www.bestlollyshop.co.nz';

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${domain}/#organization`,
      "name": "Best Lolly Shop",
      "url": domain,
      "logo": `${domain}/logo.png`,
      "sameAs": [
        "https://www.facebook.com/bestlollyshop",
        "https://www.instagram.com/bestlollyshop"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+64 21 123 4567",
        "contactType": "customer service",
        "email": "bestlollyshopnz@gmail.com",
        "areaServed": "NZ"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "17 Braid Road, St Andrews",
        "addressLocality": "Hamilton",
        "postalCode": "3200",
        "addressCountry": "NZ"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${domain}/#localbusiness`,
      "name": "Best Lolly Shop",
      "image": `${domain}/logo.png`,
      "url": domain,
      "telephone": "+64 21 123 4567",
      "email": "bestlollyshopnz@gmail.com",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "17 Braid Road, St Andrews",
        "addressLocality": "Hamilton",
        "postalCode": "3200",
        "addressCountry": "NZ"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -37.7476837,
        "longitude": 175.2427845
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      },
      "areaServed": {
        "@type": "Country",
        "name": "New Zealand"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${domain}/#website`,
      "url": domain,
      "name": "Best Lolly Shop",
      "description": "New Zealand's favourite online candy store and lolly shop.",
      "publisher": {
        "@id": `${domain}/#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${domain}/shop?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    }
  ];

  const seoHome = settings?.seoOverrides?.home || settings?.seoOverrides?.['/'] || {
    title: "Best Lolly Shop NZ | #1 Online Lollyshop, Sweets & Chocolate in NZ",
    description: "Best lolly shop in NZ! Buy lollies online new zealand with fast delivery across Hamilton, Auckland, Wellington, Christchurch, Tauranga, Dunedin, Queenstown, Rotorua, Palmerston North, Nelson & all NZ cities.",
    keywords: "Best lolly shop in nz, lolly shop in nz, chocolate in nz, lollyshop, best lolly shop, chcolate in nz, lolly shop hamilton, candy shop auckland, lolly store christchurch, online lolly shop wellington, lolly shop tauranga, candy store tauranga, lolly shop rotorua, lolly shop palmerston north, lolly shop new plymouth, lolly shop napier, lolly shop hastings, hawkes bay candy store, lolly shop whangarei, lolly shop gisborne, lolly shop whanganui, lolly shop dunedin, candy store dunedin, lolly shop queenstown, candy store queenstown, lolly shop nelson, lolly shop invercargill, lolly shop blenheim, lolly shop timaru, north island lolly delivery, south island lolly delivery, waikato sweet shop, bay of plenty candy store, canterbury sweets online, otago candy delivery, northland sweets delivery, taranaki lolly store, fast lolly shipping new zealand, nz wide candy store delivery, express sweet delivery all nz cities, new zealand nationwide lolly delivery, sweets delivery nz nationwide, kiwi lolly shop online, hamilton candy delivery, kiwi lollies, classic kiwi lollies, sour lollies nz, fizzy sour lollies, sour straps nz, sour rainbow belts, gummy bears nz, gummy worms, jet plane lollies, milk bottle lollies, chewy lollies nz, hard boiled candies nz, licorice lollies nz, black licorice nz, marshmallows nz, lollipops nz, buy chocolate online nz, imported chocolates nz, milk chocolate bars nz, dark chocolate nz, belgian chocolates nz, cadbury lollies nz, whitakers chocolate nz, chocolate gift box nz, chocolate coated nuts nz, american candy nz, imported american lollies, uk sweets nz, british lollies nz, english sherbet sweets, freeze dried candy nz, freeze dried lollies, tiktok viral lollies nz, peel me lollies nz, rare imported candy, lolly gift box nz, sweet gift hampers, candy box delivery nz, birthday lolly mix, wedding candy buffet lollies, party bag lollies nz, christmas lolly gifts, corporate lolly boxes nz, bulk lollies nz, wholesale candy nz, 1kg lolly bags nz, cheap bulk sweets nz, pick and mix bulk bags, vegan lollies nz, gelatine free sweets, sugar free lollies nz, diabetic candy, gluten free lollies nz, halal certified lollies nz, buy lollies online new zealand, order candy online nz, cheap lollies online nz, same day lolly delivery hamilton, best place to buy lollies online in nz"
  };

  return (
    <div className="home-page">
      <SEO 
        title={seoHome.title}
        description={seoHome.description}
        keywords={seoHome.keywords}
        ogImage={seoHome.ogImage}
        schema={schema}
      />
      {/* 1. Hero */}
      <Hero />

      {/* Featured Brands Grid Section */}
      <section className="brands-section">
        <div className="container">
          <div className="brands-header">
            <h2>Brands</h2>
          </div>
          <div className="brands-grid-row">
            {brands.map(brand => (
              <div className="brand-grid-card" key={brand.id}>
                <div
                  className="brand-square"
                  style={{
                    backgroundColor: brand.color,
                    border: brand.color === '#ffffff' ? '1px solid var(--color-border)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                >
                  {brand.image ? (
                    <img 
                      src={brand.image} 
                      alt={brand.name} 
                      style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} 
                    />
                  ) : (
                    <BrandSvg type={brand.svgType} name={brand.name} />
                  )}
                </div>
                <span className="brand-grid-name">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Forever Favourites (Best Sellers) */}
      <section id="favourites" className="section-padding favourites-section">
        <div className="container">
          <div className="section-header">
            <span className="badge">Best Sellers</span>
            <h2>Forever Favourites</h2>
            <p>Our best-selling sweets that bring smiles to everyone</p>
          </div>

          <div className="products-grid">
            {popularProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
              />
            ))}
          </div>
          
          <div className="section-footer-cta">
            <Link to="/shop" className="btn btn-secondary">
              View All Sweets <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us (Features) */}
      <section className="section-padding features-section">
        <div className="container">
          <div className="section-header">
            <span className="badge">Why Choose Us</span>
            <h2>More Than Just Sweets</h2>
            <p>We craft premium sweet moments filled with high standards and care</p>
          </div>

          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon"><Award size={28} /></div>
              <h3>Premium Quality</h3>
              <p>Hand-picked from the finest global confectioners for the ultimate taste profile.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon"><Heart size={28} /></div>
              <h3>Made with Love</h3>
              <p>Curated selections designed to bring nostalgic happiness to kids and adults alike.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon"><Truck size={28} /></div>
              <h3>Free Hamilton Delivery</h3>
              <p>FREE delivery in Hamilton, New Zealand! Fast temperature-controlled shipping NZ-wide.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon"><ShieldCheck size={28} /></div>
              <h3>100% Secure</h3>
              <p>Encrypted checkouts and instant digital payments for hassle-free shopping.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Story (Journey counters) */}
      <section className="section-padding story-section">
        <div className="container story-grid">
          <div className="story-content">
            <div className="badge">
              <Sparkles size={14} style={{ marginRight: '6px' }} />
              <span>{settings?.aboutUs?.badgeText || 'Since 2015'}</span>
            </div>
            <h2 className="story-title">{settings?.aboutUs?.heading || 'OUR SWEET JOURNEY'}</h2>
            <p className="story-desc">
              {settings?.aboutUs?.description || "What started as a tiny confectionery passion project in a home kitchen has grown into New Zealand's most beloved premium online candy shop. At Best Lolly Shop, we believe in spreading pure joy and nostalgic happiness, one sweet bite at a time."}
            </p>
            <p className="story-desc">
              {settings?.aboutUs?.story || "We carefully curate our catalog from the finest international master confectioners. From tangy, fuzzy gummies to rich, hand-crafted Belgian truffles, we bring the world of gourmet sweets straight to your doorstep."}
            </p>

            {/* Counters */}
            <div className="stats-container">
              <div className="stat-item">
                <h3>{settings?.aboutUs?.stat1Value || '50K+'}</h3>
                <p>{settings?.aboutUs?.stat1Label || 'Happy Customers'}</p>
              </div>
              <div className="stat-item">
                <h3>{settings?.aboutUs?.stat2Value || '500+'}</h3>
                <p>{settings?.aboutUs?.stat2Label || 'Premium Treats'}</p>
              </div>
              <div className="stat-item">
                <h3>{settings?.aboutUs?.stat3Value || '99%'}</h3>
                <p>{settings?.aboutUs?.stat3Label || 'Satisfaction Rate'}</p>
              </div>
            </div>
          </div>

          {/* Story Visual */}
          <div className="story-visual-side">
            <div className="story-image-box">
              <div className="story-candy-collage">
                <div className="collage-candy-wrapper animate-float">
                  <CandyVisual emoji="🍭" size={52} />
                </div>
                <div className="collage-candy-wrapper animate-float-reverse">
                  <CandyVisual emoji="🍬" size={48} />
                </div>
                <div className="collage-candy-wrapper animate-float">
                  <CandyVisual emoji="🍫" size={48} />
                </div>
                <div className="collage-candy-wrapper animate-float-reverse">
                  <CandyVisual emoji="🍒" size={46} />
                </div>
              </div>
              <div className="story-badge">
                <Smile size={24} />
                <div>
                  <h4>{settings?.aboutUs?.badgeTitle || 'CERTIFIED FRESH'}</h4>
                  <p>{settings?.aboutUs?.badgeSubtitle || 'Hand-packed daily'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Explore Categories */}
      <section className="section-padding categories-section">
        <div className="container">
          <div className="section-header">
            <span className="badge">Categories</span>
            <h2>Explore Sweet Collections</h2>
            <p>Find the exact treat that fits your mood</p>
          </div>

          <div className="categories-grid">
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                to={`/shop?category=${cat.name}`} 
                className="category-card glass-card"
              >
                <div className="category-overlay-color" style={{ background: cat.color }}></div>
                <div className="category-emoji-box">
                  <CandyVisual emoji={cat.emoji} size={36} />
                </div>
                <h3>{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Sweet Discoveries */}
      <section className="section-padding discoveries-section">
        <div className="container">
          <div className="section-header">
            <span className="badge">New Arrivals</span>
            <h2>Sweet Discoveries</h2>
            <p>Fresh additions to our catalog to tickle your tastebuds</p>
          </div>

          <div className="products-grid">
            {discoveries.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Testimonial Slider */}
      <section className="section-padding testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="badge">Testimonials</span>
            <h2>Loved by Sweet Lovers</h2>
            <p>Real reviews from customers who experienced our sweet boxes</p>
          </div>

          <div className="testimonials-grid-layout">
            <div className="testimonial-slider-container glass-card">
              <div className="testimonial-quote">“</div>
              
              {/* Active Testimonial Card */}
              {testimonialsList.length > 0 && activeTestimonial < testimonialsList.length && (
                <div className="testimonial-card active">
                  <p className="t-text">{testimonialsList[activeTestimonial].quote}</p>
                  
                  <div className="t-stars">
                    {[...Array(testimonialsList[activeTestimonial].rating || 5)].map((_, i) => (
                      <Star key={i} size={16} fill="var(--color-accent)" stroke="var(--color-accent)" />
                    ))}
                  </div>

                  <div className="t-profile">
                    <div className="t-avatar">{testimonialsList[activeTestimonial].avatar || testimonialsList[activeTestimonial].name.charAt(0).toUpperCase()}</div>
                    <div className="t-meta">
                      <h4>{testimonialsList[activeTestimonial].name}</h4>
                      <p>{testimonialsList[activeTestimonial].role}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Slider Dots */}
              <div className="testimonial-dots">
                {testimonialsList.map((_, idx) => (
                  <button
                    key={idx}
                    className={`t-dot ${activeTestimonial === idx ? 'active' : ''}`}
                    onClick={() => setActiveTestimonial(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  ></button>
                ))}
              </div>
            </div>

            {/* Testimonials Submission Form */}
            <div className="testimonial-form-container glass-card">
              <h3>Share Your Sweet Story</h3>
              <p className="testimonial-form-desc">Loved your sweet deliveries? Leave a review and join our wall of fame!</p>
              
              {testError && <div className="testimonial-alert alert-error">{testError}</div>}
              {testSuccess && <div className="testimonial-alert alert-success">{testSuccess}</div>}

              <form onSubmit={async (e) => {
                e.preventDefault();
                setTestError('');
                setTestSuccess('');

                if (!testName.trim() || !testQuote.trim()) {
                  setTestError('Please fill in your name and sweet story.');
                  return;
                }

                const result = await addTestimonial({
                  name: testName.trim(),
                  role: testRole.trim() || 'Sweet Enthusiast',
                  quote: testQuote.trim(),
                  rating: testRating
                });

                if (result) {
                  setTestSuccess('Thank you for sharing your sweet story! 🍭');
                  setTestQuote('');
                  setTestRole('');
                  setTestRating(5);
                  if (!currentUser) setTestName('');
                } else {
                  setTestError('Failed to submit testimonial. Please try again.');
                }
              }} className="testimonial-form">
                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="test-name">Your Name</label>
                    <input
                      type="text"
                      id="test-name"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      placeholder="e.g. John Doe"
                      disabled={!!currentUser}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="test-role">Your Title / Role</label>
                    <input
                      type="text"
                      id="test-role"
                      value={testRole}
                      placeholder="e.g. Regular Customer"
                      onChange={(e) => setTestRole(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Rating</label>
                  <div className="testimonial-star-picker">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="star-picker-btn"
                        onClick={() => setTestRating(star)}
                      >
                        <Star 
                          size={22} 
                          fill={star <= testRating ? "var(--color-accent)" : "none"} 
                          stroke={star <= testRating ? "var(--color-accent)" : "#94a3b8"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="test-quote">Your Story</label>
                  <textarea
                    id="test-quote"
                    value={testQuote}
                    onChange={(e) => setTestQuote(e.target.value)}
                    placeholder="Tell us about your favourite lollies and shopping experience..."
                    rows="3"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary testimonial-submit-btn">
                  Submit Story
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Instagram social gallery */}
      <section className="section-padding instagram-section">
        <div className="container">
          <div className="section-header">
            <span className="badge instagram-badge">
              <Instagram size={14} style={{ marginRight: '6px' }} />
              #SweetMoments
            </span>
            <h2>Join Our Sweet Community</h2>
            <p>Follow us @bestlollyshop on Instagram to join our daily sweet sharing</p>
          </div>

          <div className="instagram-grid">
            {socialGallery.map((post, idx) => (
              <a 
                key={idx} 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="instagram-item glass-card"
              >
                <div className="insta-svg animate-float" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div 
                    className="candy-glow-halo" 
                    style={{
                      position: 'absolute',
                      width: '65px',
                      height: '65px',
                      borderRadius: '50%',
                      background: post.glow,
                      filter: 'blur(12px)',
                      zIndex: 1,
                      pointerEvents: 'none'
                    }}
                  />
                  <CandyVisual emoji={post.emoji} size={54} style={{ position: 'relative', zIndex: 2 }} />
                </div>
                <div className="insta-hover-overlay">
                  <Instagram size={24} />
                  <span>{post.tag}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Homepage SEO Content */}
      <section className="section-padding home-seo-text-section" style={{ background: 'var(--bg-accent)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="seo-content-card glass-card" style={{ padding: '3.5rem 3rem', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' }}>
            <div className="seo-text-block" style={{ maxWidth: '900px', margin: '0 auto' }}>
              <span className="badge" style={{ marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Confectionery Guide</span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.2', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                New Zealand's Best Lolly Shop & #1 Online Lollyshop
              </h2>
              
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '1.8rem' }}>
                Welcome to <strong>Best Lolly Shop</strong>, proud to be rated as the <strong>best lolly shop in NZ</strong>! Whether you are searching for a trusted <strong>lolly shop in nz</strong>, looking for imported <strong>chocolate in nz</strong>, or browsing an online <strong>lollyshop</strong> with nationwide delivery, we bring the joy of high-quality sweets directly to your doorstep.
              </p>

              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--text-color)' }}>
                Why We Are the Best Lolly Shop for All Your Sweet Cravings
              </h3>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '1.8rem' }}>
                At Best Lolly Shop, we believe every sweet tooth deserves the very best. We have curated an extensive collection of confectionery from New Zealand and around the world. As a top-tier <strong>lollyshop</strong>, we stock iconic Kiwi favourites like jet planes, milk bottles, and sour straps alongside imported American candy and British sweets.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '1.8rem' }}>
                Finding a reliable <strong>lolly shop in nz</strong> has never been easier. With fast dispatch, food-grade packing, and free delivery on eligible orders, we make buying lollies and <strong>chocolate in nz</strong> effortless—whether you are looking for a <strong>lolly shop hamilton</strong>, <strong>candy shop auckland</strong>, <strong>lolly store christchurch</strong>, <strong>online lolly shop wellington</strong>, or candy delivery in Tauranga, Dunedin, Queenstown, Rotorua, Palmerston North, Nelson, and right across the North Island & South Island.
              </p>

              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--text-color)' }}>
                Premium Pick & Mix Sweets & Chocolate in NZ
              </h3>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '1.8rem' }}>
                Build your ideal treat with our signature <strong>Pick and Mix Lollies</strong>. Choose from over 100 varieties including sour straps, gummy bears, soft licorice, and gourmet <strong>chocolates</strong>. We also offer curated gift boxes that make the ultimate sweet surprise for birthdays, weddings, or corporate events.
              </p>

              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--text-color)' }}>
                Wholesale Bulk Lollies NZ & Speciality Treats
              </h3>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '1.8rem' }}>
                Planning a party or corporate event? Our <strong>Bulk Lollies NZ</strong> range provides 1kg, 2kg, and wholesale bags at incredible value. Stock up on popular gummies, freeze dried candies, and premium <strong>chocolates in NZ</strong> for candy buffets and school fundraisers.
              </p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.8rem' }}>
                <li style={{ marginBottom: '0.5rem' }}><strong>Birthday Parties</strong>: Colorful candy arrangements to match any theme.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Weddings</strong>: Create a stunning DIY candy buffet that your guests will talk about for years.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Corporate Events</strong>: Unique branding treats, office snack bowls, and client thank-you gifts.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Fundraisers</strong>: High-margin, popular sweets that make fundraising easy for schools and sports clubs.</li>
              </ul>

              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--text-color)' }}>
                Experience the Finest Confectionery and Chocolates
              </h3>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '0' }}>
                We don't just stop at lollies. Our curated chocolate selection includes luxurious milk, dark, and white chocolates crafted by local NZ chocolatiers and premium global brands. Indulge in creamy caramels, chocolate-coated nuts, and gourmet truffles that melt in your mouth. For the adventurous taste buds, our imported candy ranges bring the world closer to you. Discover famous American candy bars, sour candies, British sherbets, and European chocolates that are hard to find on standard supermarket shelves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Accordion */}
      <section className="section-padding faq-section">
        <div className="container">
          <div className="section-header">
            <span className="badge">FAQ</span>
            <h2>Frequently Asked Questions</h2>
            <p>Answers to common inquiries about orders, quality, and shipping</p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index} 
                  className={`faq-item glass-card ${isOpen ? 'active' : ''}`}
                >
                  <button className="faq-question" onClick={() => toggleFaq(index)}>
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className="faq-arrow" />
                  </button>
                  <div className="faq-answer">
                    <div className="faq-answer-inner">
                      <p>{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

