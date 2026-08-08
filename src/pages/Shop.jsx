import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { CustomDropdown } from '../components/CustomDropdown';
import { SEO } from '../components/SEO';
import { getProductSlugUrl } from '../utils/productUtils';
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
    title: "Best Lolly Shop in NZ | Complete Online Lollyshop & Chocolates in NZ",
    description: "Browse the best lolly shop in NZ! Buy lollies online new zealand, imported american candy, uk sweets, freeze dried lollies, pick and mix bulk bags, and chocolate in NZ.",
    h1: "Shop All Lollies, Sweets & Chocolate in NZ",
    intro: "Welcome to New Zealand's favourite online lollyshop! Explore our complete candy store catalog featuring classic kiwi lollies, sour rainbow belts, 1kg lolly bags, and premium chocolates in NZ."
  },
  'All': {
    title: "Best Lolly Shop in NZ | Complete Online Lollyshop & Chocolates in NZ",
    description: "Browse the best lolly shop in NZ! Buy lollies online new zealand, imported american candy, uk sweets, freeze dried lollies, pick and mix bulk bags, and chocolate in NZ.",
    h1: "Shop All Lollies, Sweets & Chocolate in NZ",
    intro: "Welcome to New Zealand's favourite online lollyshop! Explore our complete candy store catalog featuring classic kiwi lollies, sour rainbow belts, 1kg lolly bags, and premium chocolates in NZ."
  },
  'Gummies': {
    title: "Gummy Bears NZ & Gummy Worms Online | Best Lolly Shop",
    description: "Buy delicious gummy bears nz, gummy worms, jelly babies, and fruit gummies online. Fresh stock, great prices, and fast sweets delivery NZ nationwide.",
    h1: "Gummy Bears NZ & Fruit Gummy Sweets",
    intro: "Discover our massive range of chewy gummy bears nz, gummy worms, and jelly sweets! From classic fruit gummies to exotic flavours, we stock the freshest range of lollies in NZ."
  },
  'Sour Lollies': {
    title: "Sour Lollies NZ & Sour Rainbow Belts | Best Lolly Shop",
    description: "Supercharge your tastebuds with sour lollies nz, sour straps nz, fizzy sour lollies, and sour rainbow belts. Order candy online nz with fast delivery.",
    h1: "Fizzy Sour Lollies, Sour Straps & Rainbow Belts",
    intro: "Craving an intense sour kick? Browse sour lollies nz, fizzy sour straps, and sour rainbow belts. Perfect for candy lovers looking for a mouth-puckering rush!"
  },
  'Chocolates': {
    title: "Buy Chocolate Online NZ | Milk, Dark & Belgian Chocolates NZ",
    description: "Buy chocolate online nz! Indulge in milk chocolate bars nz, dark chocolate nz, belgian chocolates nz, cadbury lollies, and whitakers chocolate nz with fast shipping.",
    h1: "Buy Chocolate Online NZ | Milk & Dark Chocolates",
    intro: "Treat yourself to the finest chocolate in NZ! Shop imported chocolates nz, milk chocolate bars, dark chocolate, belgian chocolates, cadbury lollies, and chocolate gift boxes online."
  },
  'Licorice': {
    title: "Licorice Lollies NZ & Black Licorice NZ | Best Lolly Shop",
    description: "Shop licorice lollies nz and traditional black licorice nz online. Soft eating black and red licorice logs delivered fast across New Zealand.",
    h1: "Licorice Lollies NZ & Black Licorice Collection",
    intro: "Enjoy the bold flavor of traditional soft-eating black licorice nz, red licorice, and gourmet filled logs. Fresh, chewy, and highly satisfying."
  },
  'Hard Lollies': {
    title: "Hard Boiled Candies NZ & Lollipops NZ | Best Lolly Shop",
    description: "Buy hard boiled candies nz, lollipops nz, and traditional rock candy online. Perfect for party bag lollies nz and wedding candy buffets.",
    h1: "Hard Boiled Candies NZ & Lollipops Collection",
    intro: "Discover nostalgic hard boiled candies nz, travel drops, and gourmet lollipops nz. Perfect for slow-sucking sweetness that lasts."
  },
  'Marshmallows': {
    title: "Marshmallows NZ & Fluffy Sweets | Best Lolly Shop",
    description: "Buy fluffy pink & white marshmallows nz, toasted mallows, and chocolate-coated marshmallows online. Quick sweets delivery NZ nationwide.",
    h1: "Fluffy Marshmallows NZ & Soft Sweets",
    intro: "Light, pillowy, and meltingly soft! Shop our classic pink and white marshmallows nz, ideal for hot chocolates, baking, campfire toasting, or party bowls."
  },
  'Pick and Mix': {
    title: "Pick and Mix Bulk Bags & Custom Lollies NZ | Best Lolly Shop",
    description: "Build your custom pick and mix bulk bags online! Choose from 100+ gummies, sour straps, chocolates, and chewy lollies. Fast courier shipping.",
    h1: "Build Your Custom Pick and Mix Bulk Bags",
    intro: "Mix and match your absolute favourite sweets! Select your bag size and fill it with our premium selection of gummies, sour lollies nz, and imported chocolates."
  },
  'American': {
    title: "American Candy NZ & Imported American Lollies | Best Lolly Shop",
    description: "Shop famous american candy nz: Reese's, Hershey's, Jolly Ranchers, and Nerds. Order imported american lollies online for fast delivery in NZ.",
    h1: "American Candy NZ & Imported American Lollies",
    intro: "Experience the famous flavors of the USA! We stock american candy nz, imported american lollies, peanut butter cups, and rare imported candy."
  },
  'British': {
    title: "UK Sweets NZ & British Lollies NZ | Best Lolly Shop",
    description: "Buy authentic uk sweets nz, british lollies nz, and english sherbet sweets online in New Zealand. Fast dispatch and secure delivery.",
    h1: "Authentic UK Sweets NZ & British Lollies NZ",
    intro: "Bring back sweet memories of the UK with our range of traditional uk sweets nz, british lollies nz, english sherbet sweets, and UK chocolate bars."
  },
  'Bulk': {
    title: "Bulk Lollies NZ, Wholesale Candy & 1kg Lolly Bags | Best Lolly Shop",
    description: "Save money with bulk lollies nz, wholesale candy nz, 1kg lolly bags nz, and cheap bulk sweets. Perfect for party bag lollies and weddings.",
    h1: "Bulk Lollies NZ, Wholesale Candy & 1kg Bags",
    intro: "Stock up and save with bulk lollies nz and 1kg lolly bags! Ideal for wedding candy buffet lollies, corporate lolly boxes, or birthday party bag lollies."
  },
  'Sugar Free': {
    title: "Sugar Free Lollies NZ & Diabetic Candy | Best Lolly Shop",
    description: "Shop sugar free lollies nz and diabetic candy online. Delicious taste with zero added sugar. Fast sweets delivery NZ nationwide.",
    h1: "Sugar Free Lollies NZ & Diabetic Candy",
    intro: "Enjoy all the sweetness with none of the sugar! Perfect for diabetics watching their sugar intake. Shop sugar free lollies nz with zero compromise."
  },
  'Vegan': {
    title: "Vegan Lollies NZ & Gelatine Free Sweets | Best Lolly Shop",
    description: "Shop plant-based vegan lollies nz and gelatine free sweets online. Delicious organic and natural fruit gummies delivered fast across New Zealand.",
    h1: "Vegan Lollies NZ & Gelatine Free Sweets",
    intro: "Deliciously plant-based! Browse vegan lollies nz and gelatine free sweets, crafted without animal products, artificial colors, or dairy."
  },
  'Lollies': {
    title: "Buy Lollies Online New Zealand | Premium Sweet Confectionery",
    description: "Buy lollies online new zealand! Shop chewy lollies nz, gummies, hard candies, and nostalgic sweets. Fast delivery throughout New Zealand.",
    h1: "Buy Lollies Online New Zealand",
    intro: "Browse New Zealand's finest lollies! From traditional Kiwi classics to international favourites, find cheap lollies online nz to satisfy your sweet tooth."
  },
  'NZ Lollies': {
    title: "Kiwi Lollies & Classic Kiwi Lollies NZ | Best Lolly Shop",
    description: "Shop iconic kiwi lollies and classic kiwi lollies online: jet plane lollies, milk bottle lollies, pineapple lumps, and Mayceys. Fast delivery in NZ.",
    h1: "Kiwi Lollies & Classic Kiwi Lollies NZ",
    intro: "Take a trip down memory lane! Our Kiwi Lollies collection features your all-time favourite classic kiwi lollies, jet plane lollies, and milk bottle lollies."
  },
  'Soft Lollies': {
    title: "Chewy Soft Lollies & Gummies NZ | Best Lolly Shop",
    description: "Buy soft chewy sweets, gummy fruits, and soft candies online. Fresh stock, delicious flavours, and quick delivery across New Zealand.",
    h1: "Soft & Chewy Lollies Collection",
    intro: "Indulge in our collection of soft, pillowy, and chewy lollies. From milk bottles to wine gums, find your perfect chew here."
  },
  'Mayceys': {
    title: "Mayceys Lollies NZ | Sour Peaches & Apples Online",
    description: "Shop premium Mayceys lollies online, including the famous Mayceys sour peaches, sour apples, and globs. Made in New Zealand.",
    h1: "Mayceys Confectionery Collection",
    intro: "Proudly crafted in New Zealand! Mayceys confections are legendary for their intense flavours and perfect chew. Taste the local pride today."
  },
  'Drinks & Snacks': {
    title: "Imported Drinks & American Snacks NZ | Best Lolly Shop",
    description: "Shop imported sodas, chips, and viral TikTok snacks online. Reese's, Cheetos, Kool-Aid, and more delivered fast across New Zealand.",
    h1: "Imported Soda, Drinks & Viral Snacks",
    intro: "Refresh yourself with our imported beverages and snacks. Discover unique soda flavors, viral chips, and international snack foods today."
  }
};

export const Shop = ({ onProductClick }) => {
  const { products, settings } = useStore();
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

  // Category Bar Scroll Handling
  const categoryRowRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (categoryRowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryRowRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    }
  };

  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollCategories = (direction) => {
    if (categoryRowRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      categoryRowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
      
      const productCategoryList = typeof product.category === 'string'
        ? product.category.split(',').map(c => c.trim()).filter(Boolean)
        : (Array.isArray(product.category) ? product.category : [product.category].filter(Boolean));

      const matchesCategory =
        selectedCategory === 'All' || 
        product.category === selectedCategory ||
        productCategoryList.includes(selectedCategory) ||
        product.mainCategory === selectedCategory ||
        (selectedParent !== 'All' && !selectedSubcategory && (
          product.category === parentGroups[selectedParent]?.name ||
          productCategoryList.includes(parentGroups[selectedParent]?.name) ||
          product.mainCategory === parentGroups[selectedParent]?.name ||
          (parentGroups[selectedParent]?.categories || []).includes(product.category) ||
          (parentGroups[selectedParent]?.categories || []).some(c => productCategoryList.includes(c)) ||
          (parentGroups[selectedParent]?.categories || []).includes(product.mainCategory)
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
    let base = categorySeoData['All'];
    
    if (selectedSubcategory) {
      if (categorySeoData[selectedSubcategory]) {
        base = categorySeoData[selectedSubcategory];
      } else {
        base = {
          title: `Buy ${selectedSubcategory} Online NZ | Best Lolly Shop`,
          description: `Order fresh ${selectedSubcategory} online at Best Lolly Shop New Zealand. High-quality sweets, competitive prices, and fast courier delivery nationwide.`,
          h1: selectedSubcategory,
          intro: `Browse our delicious range of ${selectedSubcategory}. Hand-picked and packed fresh for our NZ customers.`
        };
      }
    } else if (selectedCategory && selectedCategory !== 'All') {
      if (categorySeoData[selectedCategory]) {
        base = categorySeoData[selectedCategory];
      } else {
        const parentName = parentGroups[selectedParent]?.name;
        if (parentName && categorySeoData[parentName]) {
          base = categorySeoData[parentName];
        } else {
          base = {
            title: `Buy ${selectedCategory} Online NZ | Best Lolly Shop`,
            description: `Order ${selectedCategory} online at New Zealand's favourite candy store. Great prices and fast nationwide delivery.`,
            h1: selectedCategory,
            intro: `Explore our collection of ${selectedCategory}. Packed with love in Auckland.`
          };
        }
      }
    } else {
      const defaultSeo = settings?.seoOverrides?.shop || settings?.seoOverrides?.['/shop'] || categorySeoData['All'];
      base = defaultSeo;
    }
    return base;
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
      "url": `${domain}${getProductSlugUrl(product)}`,
      "name": product.name
    }))
  };

  const breadcrumbElements = [
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
    }
  ];

  if (selectedCategory && selectedCategory !== 'All') {
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 3,
      "name": selectedCategory,
      "item": `${domain}/shop?category=${encodeURIComponent(selectedCategory)}`
    });
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbElements
  };

  const shopSchemas = [itemListSchema, breadcrumbSchema];

  return (
    <div className="shop-page">
      <SEO 
        title={seoInfo.title}
        description={seoInfo.description}
        schema={shopSchemas}
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
        <div className="shop-collections-bar-container">
          {canScrollLeft && (
            <button
              type="button"
              className="category-scroll-btn scroll-btn-left"
              onClick={() => scrollCategories('left')}
              aria-label="Scroll categories left"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          <div className={`shop-collections-bar ${canScrollLeft ? 'has-left-shadow' : ''} ${canScrollRight ? 'has-right-shadow' : ''}`}>
            <div
              className="parent-categories-row"
              ref={categoryRowRef}
              onScroll={checkScroll}
            >
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

          {canScrollRight && (
            <button
              type="button"
              className="category-scroll-btn scroll-btn-right"
              onClick={() => scrollCategories('right')}
              aria-label="Scroll categories right"
            >
              <ChevronRight size={18} />
            </button>
          )}
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

export default Shop;

