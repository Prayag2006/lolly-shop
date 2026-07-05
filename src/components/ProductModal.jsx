import React, { useState } from 'react';
import { X, Star, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CandyVisual } from './SvgCandies';
import './ProductModal.css';

export const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('100g');

  if (!product) return null;

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

  const handleAdd = () => {
    addToCart(product, quantity, selectedWeight);
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-container glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Modal Layout */}
        <div className="modal-grid">
          {/* Left Column: Visual */}
          <div className="modal-visual-side">
            <div className="modal-mesh"></div>
            <img 
              src={product.image} 
              alt={product.name} 
              className="modal-product-image"
            />
          </div>

          {/* Right Column: Content */}
          <div className="modal-info-side">
            <span className="modal-tag">{product.category}</span>
            <h2 className="modal-title">{product.name}</h2>

            {/* Rating */}
            <div className="modal-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating) ? 'var(--color-accent)' : 'none'}
                    stroke={i < Math.floor(product.rating) ? 'var(--color-accent)' : 'currentColor'}
                  />
                ))}
              </div>
              <span className="rating-text">
                {product.rating} / 5.0 ({product.reviewsCount} customer reviews)
              </span>
            </div>

            <p className="modal-description">{product.description}</p>

            {/* Nutrition Information Grid */}
            <div className="nutrition-section">
              <h4>Nutritional Value (Per 100g)</h4>
              <div className="nutrition-grid">
                <div className="nutrition-pill">
                  <span className="n-label">Energy</span>
                  <span className="n-val">{product.nutrition?.calories || 'N/A'}</span>
                </div>
                <div className="nutrition-pill">
                  <span className="n-label">Sugar</span>
                  <span className="n-val">{product.nutrition?.sugar || 'N/A'}</span>
                </div>
                <div className="nutrition-pill">
                  <span className="n-label">Fat</span>
                  <span className="n-val">{product.nutrition?.fat || 'N/A'}</span>
                </div>
                <div className="nutrition-pill">
                  <span className="n-label">Protein</span>
                  <span className="n-val">{product.nutrition?.protein || 'N/A'}</span>
                </div>
              </div>
            </div>


            {/* Select Weight Option */}
            <div className="modal-weight-section">
              <h4>Select Weight</h4>
              <div className="modal-weight-selector">
                {['100g', '250g', '500g', '1kg'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    className={`modal-weight-btn ${selectedWeight === w ? 'active' : ''}`}
                    onClick={() => setSelectedWeight(w)}
                  >
                    <span className="w-text">{w}</span>
                    <span className="w-desc">
                      {w === '100g' && 'Standard Pack'}
                      {w === '250g' && 'Value Size'}
                      {w === '500g' && 'Sharing Scoop'}
                      {w === '1kg' && 'Super Saver'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Controls footer */}
            <div className="modal-action-footer">
              <div className="modal-price-calc">
                <div className="modal-unit-price">${currentPrice.toFixed(2)} <span className="unit">/ pack</span></div>
                <div className="modal-total-calc">Total: <span>${(currentPrice * quantity).toFixed(2)}</span></div>
              </div>

              <div className="modal-qty-actions">
                <div className="qty-selector modal-qty">
                  <button className="qty-btn" onClick={() => handleQtyChange(quantity - 1)}>
                    <Minus size={14} />
                  </button>
                  <span className="qty-num">{quantity}</span>
                  <button className="qty-btn" onClick={() => handleQtyChange(quantity + 1)}>
                    <Plus size={14} />
                  </button>
                </div>

                <button 
                  className={`btn btn-primary modal-add-btn ${!product.inStock ? 'disabled' : ''}`}
                  onClick={handleAdd}
                  disabled={!product.inStock}
                >
                  <ShoppingBag size={18} />
                  <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
