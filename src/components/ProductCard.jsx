import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CandyVisual } from './SvgCandies';
import './ProductCard.css';

export const ProductCard = ({ product, onProductClick }) => {
  const { addToCart } = useStore();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Don't trigger details click
    addToCart(product, 1);
    
    // Quick pop effect on button
    const btn = e.currentTarget;
    btn.classList.add('pop-active');
    setTimeout(() => btn.classList.remove('pop-active'), 300);
  };

  return (
    <div 
      className={`product-card glass-card animate-slide-up ${!product.inStock ? 'out-of-stock' : ''}`}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Badges */}
      <div className="card-badges">
        {product.isNew && <span className="p-badge b-new">New</span>}
        {product.isPopular && <span className="p-badge b-popular">Popular</span>}
      </div>

      {/* Sweet Cover Visual */}
      <div className="card-visual-wrapper">
        <div className="card-mesh"></div>
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=600'} 
          alt={`Buy ${product.name} Online NZ | Best Lolly Shop`} 
          className="card-product-image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=600';
          }}
        />
        {!product.inStock && (
          <div className="out-of-stock-overlay">
            <span>Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info Content */}
      <div className="card-content">
        <span className="card-category">{product.category}</span>
        <h3 className="card-title">{product.name}</h3>
        
        {/* Rating */}
        <div className="card-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(product.rating) ? 'var(--color-accent)' : 'none'}
                stroke={i < Math.floor(product.rating) ? 'var(--color-accent)' : 'currentColor'}
              />
            ))}
          </div>
          <span className="rating-num">({product.reviewsCount})</span>
        </div>


        {/* Pricing & Cart Action */}
        <div className="card-footer">
          <div className="card-price">
            <span className="currency">$</span>
            <span className="amount">{product.price.toFixed(2)}</span>
          </div>
          <button
            className={`card-add-btn ${!product.inStock ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
