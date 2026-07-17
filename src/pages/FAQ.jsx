import React, { useState } from 'react';
import { Sparkles, HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SEO } from '../components/SEO';
import './FAQ.css';

export const FAQ = () => {
  const { settings } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);

  const defaultFaqs = [
    {
      q: "Do you deliver lollies NZ-wide?",
      a: "Yes! We offer fast courier lollies delivery NZ-wide. All our orders are dispatched from Auckland via reliable couriers. Standard shipping takes 3-5 business days for metropolitan areas like Wellington, Christchurch, and Tauranga. Rural delivery may take an additional 1-2 business days.",
      category: "Delivery & Shipping"
    },
    {
      q: "What's the best lolly mix for kids' parties?",
      a: "For children's parties, our Party Mix and Gummy Pick 'n' Mix collections are the most popular choices. They feature sweet and sour gummies, classic hard lollies, and soft marshmallows. If you have guests with dietary requirements, we also recommend checking out our dedicated Vegan and Sugar Free categories.",
      category: "Products & Variety"
    },
    {
      q: "What is your delivery charge?",
      a: "We offer completely FREE delivery in Hamilton, New Zealand! For other NZ locations, standard shipping is free for all orders over $50 NZD. For orders under $50 NZD, a flat delivery fee of $5 NZD is applied at checkout.",
      category: "Delivery & Shipping"
    },
    {
      q: "Do you offer bulk or wholesale pricing for events?",
      a: "Absolutely! We specialize in wholesale bulk lollies NZ-wide. Whether you are running a school fundraiser, planning a corporate promotion, or building a wedding lolly buffet, you can buy confections in 1kg+ bags at significant savings. Contact us at bestlollyshopnz@gmail.com for customized business accounts.",
      category: "Bulk & Events"
    },
    {
      q: "Do you offer sugar-free or vegan confections?",
      a: "Yes, we believe everyone deserves sweet moments! We stock a premium selection of Sugar Free confections (perfect for diabetic diets) and gelatine-free Vegan lollies. You can filter these easily using the search categories on our Shop page.",
      category: "Dietary & Health"
    },
    {
      q: "Where is the Best Lolly Shop physical presence?",
      a: "We operate primarily as an online candy store NZ-wide. Our storage and packaging depot is located at 17 Braid Road, St Andrews, Hamilton 3200, where we maintain strict temperature-controlled standards to guarantee sweet freshness.",
      category: "About Us"
    }
  ];

  const activeFaqs = settings?.faqs && settings.faqs.length > 0 ? settings.faqs : defaultFaqs;

  const handleToggle = (idx) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  const filteredFaqs = activeFaqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const domain = typeof window !== 'undefined' ? window.location.origin : 'https://www.bestlollyshop.co.nz';
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": activeFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": domain
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "FAQ",
        "item": `${domain}/faq`
      }
    ]
  };

  const schemas = [faqSchema, breadcrumbSchema];

  return (
    <div className="faq-page">
      <SEO 
        title="FAQ | Lollies Delivery NZ Questions - Best Lolly Shop"
        description="Got questions about bulk lollies NZ delivery, payment methods, local Hamilton delivery, or party sweet plans? Find all the answers here."
        schema={schemas}
      />

      {/* Hero Banner */}
      <section className="faq-hero">
        <div className="faq-hero-glow glow-pink animate-pulse-slow"></div>
        <div className="faq-hero-glow glow-gold"></div>
        <div className="container">
          <div className="faq-hero-content">
            <span className="badge">
              <Sparkles size={13} style={{ marginRight: '5px' }} /> Help Center
            </span>
            <h1>Frequently Asked Questions</h1>
            <p>Everything you need to know about our lollies delivery, bulk orders, and custom sweet bags in New Zealand.</p>
            
            {/* Search Box */}
            <div className="faq-search-wrapper glass-card">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search sweet questions (e.g. delivery, bulk, vegan)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="faq-search-input"
              />
            </div>
          </div>
        </div>
        <div className="faq-hero-fade"></div>
      </section>

      {/* Accordions */}
      <section className="faq-accordion-section section-padding">
        <div className="container faq-container">
          {filteredFaqs.length > 0 ? (
            <div className="faq-list">
              {filteredFaqs.map((faq, idx) => {
                const globalIdx = activeFaqs.findIndex(f => f.q === faq.q);
                const isOpen = activeIndex === globalIdx;
                
                return (
                  <div key={globalIdx} className={`faq-item glass-card ${isOpen ? 'active' : ''}`}>
                    <button 
                      className="faq-question-btn" 
                      onClick={() => handleToggle(globalIdx)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-question-text">
                        <HelpCircle size={18} className="faq-q-icon" />
                        {faq.q}
                      </span>
                      <span className="faq-category-tag">{faq.category}</span>
                      {isOpen ? <ChevronUp size={18} className="chevron" /> : <ChevronDown size={18} className="chevron" />}
                    </button>
                    
                    <div className={`faq-answer-wrapper ${isOpen ? 'show' : ''}`}>
                      <div className="faq-answer-content">
                        <p>{faq.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="faq-no-results glass-card">
              <h3>🍭 No sweet answers found</h3>
              <p>Try searching for different keywords, or get in touch with us directly on our <a href="/contact">Contact Page</a>.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
