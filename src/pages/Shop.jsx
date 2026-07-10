import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { CustomDropdown } from '../components/CustomDropdown';
import { SEO } from '../components/SEO';
import './Shop.css';

const parentGroups = {
  'All': { name: 'All Products', emoji: '✨', categories: [] },
  'Lollies': { 
    name: 'Lollies', 
    emoji: '🍬', 
    categories: ['NZ Lollies', 'Soft Lollies', 'Hard Lollies', 'Sour Lollies', 'Sweet Lollies', 'Sugar Coated', 'Mayceys', 'Finni', 'Pascals', 'Sugar Free', 'Vegan', 'Jellybeans', 'Imported Lollies', 'Airheads', 'Cotton Candy', 'Theatre Boxes', 'Popping Candy', 'Novelty', 'Lollipops', 'Bulk'] 
  },
  'Chocolates': { 
    name: 'Chocolates', 
    emoji: '🍫', 
    categories: ['Chocolates', 'Bars', 'Cadbury', 'Nestle', 'Whitakers', 'Imported Chocolates', 'Share bags'] 
  },
  'Drinks': { 
    name: 'Drinks & Snacks', 
    emoji: '🥤', 
    categories: ['Drinks', 'Hydration', 'Cans', 'Bottles', 'Multi Pack', 'Snacks', 'Chips', 'Tackies', 'Cheetos', 'Kool Aid'] 
  },
  'Viral': { 
    name: 'TikTok Viral', 
    emoji: '🔥', 
    categories: ['TikTok Viral', 'Peel me lollies', 'Freeze Dried Candies'] 
  },
  'Colour': { 
    name: 'Pick by Colour', 
    emoji: '🎨', 
    categories: ['Pick by Colour', 'Red Colour', 'Blue Colour', 'Yellow Colour', 'Pink Colour', 'Black Colour'] 
  },
  'Other': { 
    name: 'Specials & Toys', 
    emoji: '🎁', 
    categories: ['Confectionery', 'Toys', 'Toys with lolly', 'Special / Clearance'] 
  }
};

const categorySeoData = {
  'All Products': {
    title: "Shop All Lollies & Candy Online | Best Lolly Shop NZ",
    description: "Browse our entire collection of premium candy, chocolates, gummies, and bulk lollies. Find imported sweets and Kiwi classics online with fast NZ delivery.",
    h1: "Shop All Lollies, Sweets & Chocolates",
    intro: "Explore the complete confectionery universe at Best Lolly Shop! Our 'Shop All' catalog is your passport to an incredible selection of sweets, chocolates, and imported treats. We gather the finest candies from local manufacturers and top global brands so you can find exactly what you're craving in one convenient location."
  },
  'All': {
    title: "Shop All Lollies & Candy Online | Best Lolly Shop NZ",
    description: "Browse our entire collection of premium candy, chocolates, gummies, and bulk lollies. Find imported sweets and Kiwi classics online with fast NZ delivery.",
    h1: "Shop All Lollies, Sweets & Chocolates",
    intro: "Explore the complete confectionery universe at Best Lolly Shop! Our 'Shop All' catalog is your passport to an incredible selection of sweets, chocolates, and imported treats. We gather the finest candies from local manufacturers and top global brands so you can find exactly what you're craving in one convenient location."
  },
  'Gummies': {
    title: "Gummy Bears & Jelly Sweets Online NZ | Best Lolly Shop",
    description: "Buy delicious gummy bears, jelly babies, and fruit gummies online. Fresh stock, great prices, and fast shipping across New Zealand.",
    h1: "Delicious Gummy Bears & Fruit Gummy Sweets",
    intro: "Discover our massive range of chewy, soft, and delicious fruit gummies! From classic gummy bears and jelly worms to exotic fruit flavors, we stock the freshest range of jelly sweets in NZ."
  },
  'Sour Lollies': {
    title: "Sour Candy & Fizzy Straps NZ | Best Lolly Shop",
    description: "Supercharge your tastebuds with our sour lollies, fizzy straps, and sour belts. Order online today for fast, secure delivery in NZ.",
    h1: "Super Sour Lollies, Straps & Fizzy Candies",
    intro: "Craving a sour kick? Browse our intense collection of sour belts, fizzy straps, and sour drops. Perfect for those who love a mouth-puckering candy experience!"
  },
  'Chocolates': {
    title: "Premium Chocolates Online NZ | Best Lolly Shop",
    description: "Indulge in gourmet milk, dark, and white chocolates. Shop local NZ confections and imported chocolate bars online with fast delivery.",
    h1: "Premium Chocolates & Sweet Cacao Treats",
    intro: "Treat yourself to rich, creamy chocolates. From single-origin dark chocolate bars to fun milk chocolate drops, our selection is a chocolate lover's dream come true."
  },
  'Licorice': {
    title: "Traditional Black & Red Licorice NZ | Best Lolly Shop",
    description: "Shop traditional soft eating black licorice, red licorice, and filled licorice logs. Order online with quick shipping across NZ.",
    h1: "Traditional Black & Red Licorice Collection",
    intro: "Enjoy the bold flavor of traditional soft-eating black licorice, raspberry red licorice, and gourmet filled logs. Fresh, chewy, and highly satisfying."
  },
  'Hard Lollies': {
    title: "Hard Candies, Rock & Lollipops NZ | Best Lolly Shop",
    description: "Buy classic hard-boiled candies, lollipops, and traditional rock candy online. Perfect for party bags and wedding favors in NZ.",
    h1: "Classic Hard-Boiled Candies & Lollipops",
    intro: "Discover nostalgic hard-boiled sweets, travel drops, and gourmet lollipops. Perfect for slow-sucking sweetness that lasts."
  },
  'Marshmallows': {
    title: "Soft Marshmallows & Fluffy Sweets NZ | Best Lolly Shop",
    description: "Buy fluffy pink & white marshmallows, toasted mallows, and chocolate-coated marshmallows online. Quick delivery throughout NZ.",
    h1: "Fluffy Marshmallows & Sweet Clouds",
    intro: "Light, pillowy, and meltingly soft! Shop our classic pink and white marshmallows, ideal for hot chocolates, baking, campfire toasting, or party bowls."
  },
  'Pick and Mix': {
    title: "Create Custom Pick & Mix Lollies NZ | Best Lolly Shop",
    description: "Build your dream candy bag online with our custom Pick and Mix lollies. Choose from 100+ gummies, sours, and chocolates. Fast shipping.",
    h1: "Build Your Custom Pick and Mix Candy Bag",
    intro: "Mix and match your absolute favorite sweets! Select your bag size and fill it with our premium selection of gummies, sours, chocolates, and chews."
  },
  'American': {
    title: "Imported American Candy & Soda NZ | Best Lolly Shop",
    description: "Shop famous USA candies: Reese's, Hershey's, Jolly Ranchers, and Nerds. Order imported American sweets online for delivery in NZ.",
    h1: "Imported American Candy, Chocolates & Sweets",
    intro: "Experience the famous flavors of the USA! We import authentic American candy, including peanut butter cups, sour candy boxes, and classic chocolate bars."
  },
  'British': {
    title: "British Sweets & UK Confectionery NZ | Best Lolly Shop",
    description: "Buy authentic English sweets, sherbets, and UK chocolates online in New Zealand. Fast dispatch and secure delivery for British favorites.",
    h1: "Authentic British Sweets & UK Classics",
    intro: "Bring back sweet memories of the UK with our range of traditional British sweets, boiled sherbets, and popular English chocolate bars."
  },
  'Bulk': {
    title: "Buy Bulk Lollies & Party Candy NZ | Best Lolly Shop",
    description: "Save money with wholesale bulk lollies. Buy 1kg+ bags of gummies, party mixes, and chocolates online. Fast courier delivery in NZ.",
    h1: "Wholesale Bulk Lollies for Parties & Events",
    intro: "Stock up and save with our bulk candy bags! Ideal for weddings, large events, corporate branding, or party favor bag filling. Great value per kilogram."
  },
  'Sugar Free': {
    title: "Sugar Free Candy & Diabetic Sweets NZ | Best Lolly Shop",
    description: "Shop guilt-free sugar free lollies, diabetic sweets, and chocolates online. Delicious taste with zero added sugar. Fast shipping in NZ.",
    h1: "Guilt-Free Sugar Free Candy & Sweets",
    intro: "Enjoy all the sweetness with none of the sugar! Perfect for diabetics or those watching their sugar intake. Delicious taste, zero compromise."
  },
  'Vegan': {
    title: "Vegan Lollies & Gelatine Free Sweets NZ | Best Lolly Shop",
    description: "Shop plant-based, gelatine-free vegan lollies online. Delicious organic and natural fruit gummies delivered fast across New Zealand.",
    h1: "Plant-Based Vegan & Gelatine-Free Lollies",
    intro: "Deliciously plant-based! Browse our range of vegan confections, crafted without gelatine, artificial colors, or dairy. Natural, sweet, and ethical."
  },
  'Lollies': {
    title: "Buy Lollies Online NZ | Premium Sweet Confectionery",
    description: "Shop the best selection of NZ lollies online. Chewies, gummies, hard candies, and nostalgic sweets. Fast delivery throughout New Zealand.",
    h1: "Premium New Zealand Lollies & Confectionery",
    intro: "Browse New Zealand's finest lollies! From traditional Kiwi classics to international favourites, find everything to satisfy your sweet tooth here."
  },
  'Drinks & Snacks': {
    title: "Imported Drinks & American Snacks NZ | Best Lolly Shop",
    description: "Shop imported sodas, chips, and viral TikTok snacks online. Reese's, Cheetos, Kool-Aid, and more delivered fast across New Zealand.",
    h1: "Imported Soda, Drinks & Viral Snacks",
    intro: "Refresh yourself with our imported beverages and snacks. Discover unique soda flavors, viral chips, and international snack foods today."
  }
};

export const Shop = ({ onProductClick }) => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search, Category, Price Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParent, setSelectedParent] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
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
    const catParam = searchParams.get('category') || 'All';
    setSelectedCategory(catParam);

    let parentKey = 'All';
    let subcatKey = null;

    if (catParam !== 'All') {
      const foundEntry = Object.entries(parentGroups).find(([key, val]) => 
        key === catParam || val.name === catParam || val.categories.includes(catParam)
      );

      if (foundEntry) {
        parentKey = foundEntry[0];
        if (foundEntry[1].categories.includes(catParam)) {
          subcatKey = catParam;
        }
      }
    }

    setSelectedParent(parentKey);
    setSelectedSubcategory(subcatKey);

    const searchParam = searchParams.get('search');
    setSearchQuery(searchParam || '');

    const sortParam = searchParams.get('sort');
    setSortBy(sortParam || 'popular');
  }, [searchParams, products]);

  // Handle Parent Category selection
  const handleParentSelect = (parentKey) => {
    setSelectedParent(parentKey);
    setSelectedSubcategory(null);
    
    if (parentKey === 'All') {
      searchParams.delete('category');
      setSelectedCategory('All');
    } else {
      const parentName = parentGroups[parentKey].name;
      searchParams.set('category', parentName);
      setSelectedCategory(parentName);
    }
    setSearchParams(searchParams);
  };

  // Handle Subcategory selection
  const handleSubcategorySelect = (subcat) => {
    setSelectedSubcategory(subcat);
    if (!subcat) {
      const parentName = parentGroups[selectedParent].name;
      searchParams.set('category', parentName);
      setSelectedCategory(parentName);
    } else {
      searchParams.set('category', subcat);
      setSelectedCategory(subcat);
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
        selectedCategory === 'All' || 
        product.category === selectedCategory ||
        product.mainCategory === selectedCategory ||
        (selectedParent !== 'All' && !selectedSubcategory && (
          product.category === parentGroups[selectedParent].name ||
          product.mainCategory === parentGroups[selectedParent].name ||
          (parentGroups[selectedParent].categories || []).includes(product.category) ||
          (parentGroups[selectedParent].categories || []).includes(product.mainCategory)
        ));
      
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

  const getActiveSeoInfo = () => {
    if (selectedSubcategory && categorySeoData[selectedSubcategory]) {
      return categorySeoData[selectedSubcategory];
    }
    const parentName = parentGroups[selectedParent]?.name;
    if (categorySeoData[parentName]) {
      return categorySeoData[parentName];
    }
    if (categorySeoData[selectedCategory]) {
      return categorySeoData[selectedCategory];
    }
    return categorySeoData['All'];
  };

  const seoInfo = getActiveSeoInfo();
  const domain = typeof window !== 'undefined' ? window.location.origin : 'https://www.bestlollyshop.co.nz';

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": seoInfo.h1,
    "description": seoInfo.description,
    "url": typeof window !== 'undefined' ? window.location.href : `${domain}/shop`,
    "numberOfItems": filteredProducts.length,
    "itemListElement": filteredProducts.slice(0, 20).map((product, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `${domain}/product/${product.id}`,
      "name": product.name
    }))
  };

  return (
    <div className="shop-page">
      <SEO 
        title={seoInfo.title}
        description={seoInfo.description}
        schema={itemListSchema}
      />
      {/* Banner */}
      <div className="shop-banner">
        <div className="shop-banner-mesh"></div>
        <div className="container">
          <h1>{seoInfo.h1}</h1>
          <p style={{ maxWidth: '800px', margin: '0 auto' }}>{seoInfo.intro}</p>
        </div>
      </div>

      <div className="container shop-container">
        {/* Horizontal Grouped Categories Bar */}
        <div className="shop-collections-bar">
          <div className="parent-categories-row">
            {Object.entries(parentGroups).map(([key, group]) => (
              <button
                key={key}
                type="button"
                className={`parent-category-card ${selectedParent === key ? 'active' : ''}`}
                onClick={() => handleParentSelect(key)}
              >
                <span className="parent-emoji">{group.emoji}</span>
                <span className="parent-name">{group.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Subcategories Horizontal Scroll Row */}
        {selectedParent !== 'All' && (
          <div className="subcategories-scroll-wrapper">
            <div className="subcategories-scroll-row">
              <button
                type="button"
                className={`subcategory-pill ${!selectedSubcategory ? 'active' : ''}`}
                onClick={() => handleSubcategorySelect(null)}
              >
                All {parentGroups[selectedParent].name}
              </button>
              {parentGroups[selectedParent].categories.map((subcat) => (
                <button
                  key={subcat}
                  type="button"
                  className={`subcategory-pill ${selectedSubcategory === subcat ? 'active' : ''}`}
                  onClick={() => handleSubcategorySelect(subcat)}
                >
                  {subcat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sidebar backdrop overlay (mobile) */}
        <div
          className={`sidebar-backdrop ${showMobileFilters ? 'visible' : ''}`}
          onClick={() => setShowMobileFilters(false)}
          aria-hidden="true"
        />

        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-bar">
          <button
            className="filter-toggle-btn"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>
          <CustomDropdown
            options={[
              { value: 'popular', label: 'Popular' },
              { value: 'price-low', label: 'Price: Low' },
              { value: 'price-high', label: 'Price: High' },
              { value: 'name', label: 'A–Z' },
            ]}
            value={sortBy}
            onChange={setSortBy}
            className="mobile-sort-select-custom"
          />
          <div className="results-count">
            {filteredProducts.length} treats
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
              <CustomDropdown
                options={[
                  { value: 'popular', label: 'Popularity (Rating)' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                  { value: 'name', label: 'Alphabetical (A-Z)' },
                ]}
                value={sortBy}
                onChange={setSortBy}
                icon={ArrowUpDown}
              />
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
