import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import './Shop.css';

export const Shop = ({ onProductClick }) => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search, Category, Price Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(100);
  const [sortBy, setSortBy] = useState('popular');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [newArrivalsOnly, setNewArrivalsOnly] = useState(false);
  const [bestSellersOnly, setBestSellersOnly] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Dynamically calculate the highest product price
  const dynamicMaxPrice = React.useMemo(() => {
    if (!products || products.length === 0) return 30;
    const maxVal = Math.max(...products.map(p => p.price || 0));
    return Math.max(30, Math.ceil(maxVal / 10) * 10);
  }, [products]);

  // Set initial maxPrice dynamically once products load
  useEffect(() => {
    if (products && products.length > 0) {
      const maxVal = Math.max(...products.map(p => p.price || 0));
      setMaxPrice(Math.max(30, Math.ceil(maxVal / 10) * 10));
    }
  }, [products]);

  // Sync state with URL parameters
  useEffect(() => {
    const catParam = searchParams.get('category');
    setSelectedCategory(catParam || 'All');

    const searchParam = searchParams.get('search');
    setSearchQuery(searchParam || '');

    const sortParam = searchParams.get('sort');
    setSortBy(sortParam || 'popular');
  }, [searchParams]);

  const { categories: storeCategories } = useStore();
  const categories = ['All', ...storeCategories];

  // Handle Category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  // Extract all unique collections dynamically
  const allCollections = React.useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      (p.collections || []).forEach((c) => {
        if (c.trim()) set.add(c.trim());
      });
    });
    return Array.from(set).sort();
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((product) => {
      const lowerQuery = searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(lowerQuery) ||
        (product.description || '').toLowerCase().includes(lowerQuery) ||
        (product.collections || []).some((tag) => tag.toLowerCase().includes(lowerQuery));
      
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      
      const matchesPrice = product.price <= maxPrice;

      const matchesStock = !inStockOnly || product.inStock;
      const matchesNew = !newArrivalsOnly || product.isNew;
      const matchesPopular = !bestSellersOnly || product.isPopular;
      const matchesCollections =
        selectedCollections.length === 0 ||
        (product.collections || []).some((c) => selectedCollections.includes(c));

      return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesNew && matchesPopular && matchesCollections;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.rating - a.rating; // default: popular (rating)
    });

  return (
    <div className="shop-page">
      {/* Banner */}
      <div className="shop-banner">
        <div className="shop-banner-mesh"></div>
        <div className="container">
          <h1>Candy Shop</h1>
          <p>Find your favourite sweet treats, chocolates and marshmallow fluffs</p>
        </div>
      </div>

      <div className="container shop-container">
        {/* Horizontal Collections Bar (First screenshot style) */}
        <div className="shop-collections-bar">
          <div className="collection-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`collection-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat)}
              >
                <span>{cat}</span>
                <span className="collection-active-bar"></span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-bar">
          <button 
            className="btn btn-secondary filter-toggle-btn"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>
          <div className="results-count">
            Showing {filteredProducts.length} treats
          </div>
        </div>

        {/* Layout: Sidebar & Catalog */}
        <div className="shop-layout">
          {/* 1. Sidebar Filters */}
          <aside className={`shop-sidebar glass-card ${showMobileFilters ? 'mobile-show' : ''}`}>
            {/* Search Input */}
            <div className="filter-group">
              <h3>Search Treats</h3>
              <div className="search-bar">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Sour worms, truffles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <div className="price-label-row">
                <h3>Max Price</h3>
                <span className="price-value">${maxPrice.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="2"
                max={dynamicMaxPrice}
                step="1"
                value={maxPrice > dynamicMaxPrice ? dynamicMaxPrice : maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="price-slider"
              />
              <div className="price-ranges">
                <span>$2.00</span>
                <span>${dynamicMaxPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Sort options */}
            <div className="filter-group">
              <h3>Sort By</h3>
              <div className="sort-select-wrapper">
                <ArrowUpDown size={16} />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="popular">Popularity (Rating)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Availability */}
            <div className="filter-group">
              <h3>Availability</h3>
              <label className="filter-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--color-text)' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Product Status */}
            <div className="filter-group">
              <h3>Product Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label className="filter-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--color-text)' }}>
                  <input
                    type="checkbox"
                    checked={newArrivalsOnly}
                    onChange={(e) => setNewArrivalsOnly(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                  />
                  <span>New Arrivals</span>
                </label>
                <label className="filter-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--color-text)' }}>
                  <input
                    type="checkbox"
                    checked={bestSellersOnly}
                    onChange={(e) => setBestSellersOnly(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                  />
                  <span>Best Sellers</span>
                </label>
              </div>
            </div>

            {/* Special Collections */}
            {allCollections.length > 0 && (
              <div className="filter-group">
                <h3>Special Collections</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                  {allCollections.map((col) => (
                    <label key={col} className="filter-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--color-text)' }}>
                      <input
                        type="checkbox"
                        checked={selectedCollections.includes(col)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCollections(prev => [...prev, col]);
                          } else {
                            setSelectedCollections(prev => prev.filter(c => c !== col));
                          }
                        }}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                      />
                      <span>{col}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {/* Close button for mobile */}
            {showMobileFilters && (
              <button 
                className="btn btn-primary close-filters-btn"
                onClick={() => setShowMobileFilters(false)}
              >
                Apply Filters
              </button>
            )}
          </aside>

          {/* 2. Products Catalog */}
          <main className="shop-catalog-side">
            <div className="catalog-header">
              <div className="results-count-desktop">
                Found <strong>{filteredProducts.length}</strong> delicious products
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="no-results glass-card">
                <span className="no-results-emoji">😢</span>
                <h3>No treats found</h3>
                <p>Try adjusting your search filters or price ranges to discover other sweets!</p>
                <button
                  className="btn btn-secondary reset-filters-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setMaxPrice(dynamicMaxPrice);
                    setSortBy('popular');
                    setInStockOnly(false);
                    setNewArrivalsOnly(false);
                    setBestSellersOnly(false);
                    setSelectedCollections([]);
                    searchParams.delete('category');
                    searchParams.delete('search');
                    searchParams.delete('sort');
                    setSearchParams(searchParams);
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="shop-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={onProductClick}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
