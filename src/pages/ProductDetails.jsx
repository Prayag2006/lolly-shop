import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Minus, ArrowLeft, Heart, ShieldCheck, HelpCircle, Star, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CandyVisual } from '../components/SvgCandies';
import { SEO } from '../components/SEO';
import './ProductDetails.css';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, addProductReview, currentUser } = useStore();

  // Extract ID from slug format (e.g. pascall-pineapple-lumps-p-1 -> p-1)
  const getProductIdFromSlug = (slugOrId) => {
    if (!slugOrId) return '';
    if (slugOrId.startsWith('p-')) return slugOrId;
    const parts = slugOrId.split('-');
    if (parts.length >= 2) {
      const pIdx = parts.lastIndexOf('p');
      if (pIdx !== -1 && pIdx < parts.length - 1) {
        return `p-${parts[pIdx + 1]}`;
      }
    }
    return slugOrId;
  };

  const realId = getProductIdFromSlug(id);

  // Find product by id
  const product = products.find(p => String(p.id) === String(realId));

  const getProductSlugUrl = (prod) => {
    if (!prod) return '';
    const cleanName = prod.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `/product/${cleanName}-${prod.id}`;
  };

  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(() => {
    if (product && product.weightPrices && Object.keys(product.weightPrices).length > 0) {
      return Object.keys(product.weightPrices)[0];
    }
    return '100g';
  });
  const [activeAccordion, setActiveAccordion] = useState(null);

  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Sync review name if user is logged in
  useEffect(() => {
    if (currentUser) {
      setReviewName(currentUser.name);
    } else {
      setReviewName('');
    }
  }, [currentUser]);

  // Reset details state on product change
  useEffect(() => {
    setQuantity(1);
    setSelectedWeight(product && product.weightPrices && Object.keys(product.weightPrices).length > 0 
      ? Object.keys(product.weightPrices)[0] 
      : '100g'
    );
    setActiveAccordion(null);
    setReviewComment('');
    setReviewRating(5);
    setReviewError('');
    setReviewSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, product]);

  if (!product) {
    return (
      <div className="container product-not-found">
        <div className="glass-card not-found-card">
          <h2>🍭 Product Not Found</h2>
          <p>We couldn't find the sweet treat you are looking for.</p>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>
            Back to Sweet Shop
          </button>
        </div>
      </div>
    );
  }

  const getWeightPrice = (product, weight) => {
    if (product.weightPrices && product.weightPrices[weight]) {
      return Number(product.weightPrices[weight]);
    }
    if (weight === '250g') return Number((product.price * 2.2).toFixed(2));
    if (weight === '500g') return Number((product.price * 4.0).toFixed(2));
    if (weight === '1kg') return Number((product.price * 7.5).toFixed(2));
    return product.price;
  };

  const currentPrice = getWeightPrice(product, selectedWeight);

  const handleQtyChange = (val) => {
    if (val < 1) return;
    setQuantity(val);
  };

  const handleAddToCartClick = () => {
    addToCart(product, quantity, selectedWeight);
    // Visual alert feedback
    const banner = document.getElementById('add-success-banner');
    if (banner) {
      banner.innerText = `Added ${quantity}x ${product.name} (${selectedWeight}) to your sweet cart! 🍭`;
      banner.classList.add('visible');
      setTimeout(() => banner.classList.remove('visible'), 4000);
    }
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(prev => (prev === section ? null : section));
  };

  // Get recommendations (excluding current product, prioritizing same category)
  const recommendations = products
    .filter(p => p.id !== product.id)
    .sort((a, b) => {
      if (a.category === product.category && b.category !== product.category) return -1;
      if (b.category === product.category && a.category !== product.category) return 1;
      return 0;
    })
    .slice(0, 5); // Display 5 recommendation cards

  // Best Before Date simulation
  const bbdSimulated = `BBD: ${product.id % 2 === 0 ? '5/2026' : '12/2026'}`;

  // Simulated Flavours
  const flavoursSimulated = 
    product.category === 'Chocolates' ? 'Milk Chocolate Ganache, Roasted Almond Crunch' :
    product.category === 'Gummies' ? 'Tangy Sour Peach, Wild Raspberry, Green Apple' :
    product.category === 'Lollipops' ? 'Sweet Cherry Swirl, Blue Raspberry Twist' :
    'Original Sweets Fruity Blend';

  const seoTitle = `${product.name} NZ | Buy Online at Best Lolly Shop`;
  const seoDescription = `Buy premium ${product.name} online at Best Lolly Shop New Zealand. Available in sizes 100g, 250g, 500g, and 1kg with fast courier delivery.`;

  const domain = typeof window !== 'undefined' ? window.location.origin : 'https://www.bestlollyshop.co.nz';
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [
      product.image || 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=600'
    ],
    "description": product.description || `Buy delicious ${product.name} online from Best Lolly Shop, New Zealand. Available in multiple sizes.`,
    "sku": `BLS-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Best Lolly Shop"
    },
    "offers": {
      "@type": "Offer",
      "url": typeof window !== 'undefined' ? window.location.href : `${domain}${getProductSlugUrl(product)}`,
      "priceCurrency": "NZD",
      "price": currentPrice.toFixed(2),
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  if (product.reviews && product.reviews.length > 0) {
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = (totalRating / product.reviews.length).toFixed(1);
    
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "reviewCount": product.reviews.length
    };
    
    productSchema.review = product.reviews.map((r) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": r.name || "Anonymous"
      },
      "datePublished": r.date || new Date().toISOString().split('T')[0],
      "reviewBody": r.comment || "",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.rating
      }
    }));
  } else {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "5"
    };
  }

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
        "name": "Shop",
        "item": `${domain}/shop`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `${domain}${getProductSlugUrl(product)}`
      }
    ]
  };

  const productSchemas = [productSchema, breadcrumbSchema];

  return (
    <div className="product-details-page">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        ogImage={product.image}
        ogType="product"
        schema={productSchemas}
      />
      {/* Add Success Banner */}
      <div id="add-success-banner" className="add-success-banner">
        <span>Added {quantity}x {product.name} ({selectedWeight}) to your sweet cart! 🍭</span>
      </div>

      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="details-breadcrumbs">
          <Link to="/">Home</Link>
          <span className="bc-separator">/</span>
          <Link to="/shop">Shop</Link>
          <span className="bc-separator">/</span>
          <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
          <span className="bc-separator">/</span>
          <span className="bc-current">{product.name}</span>
        </div>

        {/* Main Details Grid */}
        <div className="details-main-grid">
          {/* Left Column: Image Showcase */}
          <div className="details-visual-column">
            <div className="details-image-wrapper glass-card">
              <div className="details-mesh-grid"></div>
              <img 
                src={product.image || 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=600'} 
                alt={`${product.name} - Premium Candy from Best Lolly Shop New Zealand`} 
                className="details-main-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=600';
                }}
              />
            </div>
          </div>

          {/* Right Column: Order Selection details */}
          <div className="details-info-column">
            <span className="details-category-tag">{product.category}</span>
            <h1 className="details-product-title">{product.name}</h1>

            {/* Price display */}
            <div className="details-price-row">
              <span className="details-currency">$</span>
              <span className="details-amount">{currentPrice.toFixed(2)}</span>
            </div>

            {/* BBD details */}
            <div className="details-bbd-tag">
              <strong>{bbdSimulated}</strong>
            </div>

            <p className="details-description">{product.description}</p>

            {/* Size Selector */}
            <div className="details-size-selector-section">
              <span className="details-section-label">Size</span>
              <div className="details-size-chips">
                {product.weightPrices && Object.keys(product.weightPrices).length > 0 ? (
                  Object.keys(product.weightPrices).map(w => (
                    <button
                      key={w}
                      type="button"
                      className={`size-chip-btn ${selectedWeight === w ? 'active' : ''}`}
                      onClick={() => setSelectedWeight(w)}
                    >
                      {w.toUpperCase()}
                    </button>
                  ))
                ) : (
                  ['100g', '250g', '500g', '1kg'].map(w => (
                    <button
                      key={w}
                      type="button"
                      className={`size-chip-btn ${selectedWeight === w ? 'active' : ''}`}
                      onClick={() => setSelectedWeight(w)}
                    >
                      {w.toUpperCase()}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Stock status */}
            <div className="details-stock-status">
              <span className={`stock-dot ${product.inStock ? 'green' : 'red'}`}></span>
              <span className="stock-label">{product.inStock ? 'In stock' : 'Out of stock'}</span>
            </div>

            {/* Action panel (Qty and Add button) */}
            <div className="details-action-row">
              <div className="details-qty-wrapper">
                <button 
                  type="button" 
                  className="qty-adjust-btn" 
                  onClick={() => handleQtyChange(quantity - 1)}
                >
                  <Minus size={14} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button 
                  type="button" 
                  className="qty-adjust-btn" 
                  onClick={() => handleQtyChange(quantity + 1)}
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                className={`btn details-add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
                onClick={handleAddToCartClick}
                disabled={!product.inStock}
              >
                ADD TO CART
              </button>
            </div>

            {/* Accordions */}
            <div className="details-accordions">
              {/* Ingredients Accordion */}
              <div className="details-accordion-item">
                <button 
                  type="button"
                  className={`accordion-header ${activeAccordion === 'ingredients' ? 'active' : ''}`}
                  onClick={() => toggleAccordion('ingredients')}
                >
                  <span>INGREDIENTS</span>
                  <span className="header-icon">{activeAccordion === 'ingredients' ? '−' : '+'}</span>
                </button>
                <div className={`accordion-content ${activeAccordion === 'ingredients' ? 'open' : ''}`}>
                  <p>{product.ingredients}</p>
                </div>
              </div>

              {/* Nutrition Accordion */}
              <div className="details-accordion-item">
                <button 
                  type="button"
                  className={`accordion-header ${activeAccordion === 'nutrition' ? 'active' : ''}`}
                  onClick={() => toggleAccordion('nutrition')}
                >
                  <span>NUTRITION VALUE (Per 100g)</span>
                  <span className="header-icon">{activeAccordion === 'nutrition' ? '−' : '+'}</span>
                </button>
                <div className={`accordion-content ${activeAccordion === 'nutrition' ? 'open' : ''}`}>
                  <div className="nutrition-details-grid">
                    <div className="nutrition-row">
                      <span>Calories</span>
                      <strong>{product.nutrition?.calories || 'N/A'}</strong>
                    </div>
                    <div className="nutrition-row">
                      <span>Sugar</span>
                      <strong>{product.nutrition?.sugar || 'N/A'}</strong>
                    </div>
                    <div className="nutrition-row">
                      <span>Fats</span>
                      <strong>{product.nutrition?.fat || 'N/A'}</strong>
                    </div>
                    <div className="nutrition-row">
                      <span>Protein</span>
                      <strong>{product.nutrition?.protein || 'N/A'}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flavours Accordion */}
              <div className="details-accordion-item">
                <button 
                  type="button"
                  className={`accordion-header ${activeAccordion === 'flavours' ? 'active' : ''}`}
                  onClick={() => toggleAccordion('flavours')}
                >
                  <span>FLAVOURS</span>
                  <span className="header-icon">{activeAccordion === 'flavours' ? '−' : '+'}</span>
                </button>
                <div className={`accordion-content ${activeAccordion === 'flavours' ? 'open' : ''}`}>
                  <p>{flavoursSimulated}</p>
                </div>
              </div>
            </div>

            {/* Payment & Security Section */}
            <div className="details-payment-security">
              <h3>PAYMENT & SECURITY</h3>
              
              <div className="brand-logos-row">
                {/* Apple Pay Logo */}
                <div className="payment-logo logo-applepay" title="Apple Pay">
                  <span> Pay</span>
                </div>
                {/* Google Pay Logo */}
                <div className="payment-logo logo-gpay" title="Google Pay">
                  <span className="g-letter">G</span><span>Pay</span>
                </div>
                {/* Mastercard Logo */}
                <div className="payment-logo logo-mastercard" title="Mastercard">
                  <div className="mc-circles">
                    <span className="mc-red"></span>
                    <span className="mc-orange"></span>
                  </div>
                  <span className="mc-text">mastercard</span>
                </div>
                {/* Shop Pay Logo */}
                <div className="payment-logo logo-shoppay" title="Shop Pay">
                  <span className="sh-bold">shop</span><span>pay</span>
                </div>
                {/* UnionPay Logo */}
                <div className="payment-logo logo-unionpay" title="UnionPay">
                  <span className="up-text">UnionPay</span>
                </div>
                {/* Visa Logo */}
                <div className="payment-logo logo-visa" title="Visa">
                  <span className="v-bold">VISA</span>
                </div>
              </div>

              <p className="payment-note-text">
                Your payment information is processed securely. We do not store credit card details nor have access to your credit card information.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="product-reviews-section glass-card animate-slide-up">
          <h2>Customer Reviews</h2>
          
          <div className="reviews-layout">
            {/* Left side: Review stats & list */}
            <div className="reviews-list-container">
              <div className="reviews-summary-card">
                <div className="summary-rating-value">{product.rating ? product.rating.toFixed(1) : '5.0'}</div>
                <div className="summary-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      fill={i < Math.round(product.rating || 5) ? "#f59e0b" : "none"} 
                      stroke={i < Math.round(product.rating || 5) ? "#d97706" : "#cbd5e1"} 
                    />
                  ))}
                </div>
                <div className="summary-count">Based on {product.reviewsCount || 0} reviews</div>
              </div>

              <div className="reviews-list">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev, idx) => (
                    <div key={rev._id || idx} className="review-item glass-card">
                      <div className="review-item-header">
                        <strong>{rev.userName}</strong>
                        <span className="review-date">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Just now'}
                        </span>
                      </div>
                      <div className="review-item-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            fill={i < rev.rating ? "#f59e0b" : "none"} 
                            stroke={i < rev.rating ? "#d97706" : "#cbd5e1"} 
                          />
                        ))}
                      </div>
                      <p className="review-item-comment">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="no-reviews-msg">
                    <span className="no-reviews-emoji">💬</span>
                    <p>No reviews yet. Be the first to leave one!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Write review form */}
            <div className="review-form-container">
              <h3>Write a Review</h3>
              
              {reviewError && <div className="review-alert review-alert-error">{reviewError}</div>}
              {reviewSuccess && <div className="review-alert review-alert-success">{reviewSuccess}</div>}

              <form onSubmit={async (e) => {
                e.preventDefault();
                setReviewError('');
                setReviewSuccess('');

                if (!reviewName.trim() || !reviewComment.trim()) {
                  setReviewError('Please enter your name and review comment.');
                  return;
                }

                const result = await addProductReview(product.id, {
                  userName: reviewName.trim(),
                  rating: reviewRating,
                  comment: reviewComment.trim()
                });

                if (result) {
                  setReviewSuccess('Your review has been submitted successfully! 🍭');
                  setReviewComment('');
                  setReviewRating(5);
                  if (!currentUser) setReviewName('');
                } else {
                  setReviewError('Error submitting review. Please try again.');
                }
              }} className="review-form">
                <div className="form-group">
                  <label htmlFor="review-name">Your Name</label>
                  <input
                    type="text"
                    id="review-name"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Enter your name"
                    disabled={!!currentUser}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Your Rating</label>
                  <div className="star-picker">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="star-picker-btn"
                        onClick={() => setReviewRating(star)}
                      >
                        <Star 
                          size={24} 
                          fill={star <= reviewRating ? "#f59e0b" : "none"} 
                          stroke={star <= reviewRating ? "#d97706" : "#94a3b8"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="review-comment">Your Review</label>
                  <textarea
                    id="review-comment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="What did you think of these lollies?"
                    rows="4"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary review-submit-btn">
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        <div className="details-recommendations-section">
          <h2>YOU MAY ALSO LIKE</h2>
          
          <div className="recommendations-grid">
            {recommendations.map(p => (
              <div key={p.id} className="rec-card glass-card" onClick={() => navigate(getProductSlugUrl(p))}>
                <div className="rec-image-wrapper">
                  <img 
                    src={p.image || 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=600'} 
                    alt={`Buy ${p.name} Online NZ`} 
                    className="rec-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=600';
                    }}
                  />
                </div>
                <h3 className="rec-name">{p.name}</h3>
                <div className="rec-price">From ${p.price.toFixed(2)}</div>
                
                <button
                  type="button"
                  className="rec-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p, 1, '100g');
                    const banner = document.getElementById('add-success-banner');
                    if (banner) {
                      banner.innerText = `Added 1x ${p.name} (100g) to your sweet cart! 🍭`;
                      banner.classList.add('visible');
                      setTimeout(() => banner.classList.remove('visible'), 4000);
                    }
                  }}
                >
                  ADD TO CART
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
