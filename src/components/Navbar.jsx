import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './Navbar.css';

const megaMenuData = [
  {
    title: 'NZ Lollies',
    items: ['Soft Lollies', 'Hard Lollies', 'Sour Lollies', 'Sweet Lollies', 'Sugar Coated', 'Mayceys', 'Finni', 'Pascals', 'Other', 'Sugar Free', 'Vegan', 'Jellybeans']
  },
  {
    title: 'Imported Lollies',
    items: ['Airheads', 'Cotton Candy', 'Theatre Boxes', 'Popping Candy', 'Novelty', 'Lollipops', 'Sugar Free', 'Vegan']
  },
  {
    title: 'Chocolates',
    items: ['Bars', 'Cadbury', 'Nestle', 'Whitakers', 'Imported Chocolates', 'Share bags', 'Sugar Free', 'Vegan']
  },
  {
    title: 'Drinks',
    items: ['Hydration', 'Cans', 'Bottles', 'Multi Pack', 'Sugar Free']
  },
  {
    title: 'Snacks',
    items: ['Chips', 'Tackies', 'Cheetos', 'Kool Aid']
  },
  {
    title: 'Bulk',
    items: ['Soft Lollies', 'Hard Lollies', 'Chocolates']
  },
  {
    title: 'TikTok Viral',
    items: ['Peel me lollies', 'Freeze Dried Candies']
  },
  {
    title: 'Pick by Colour',
    items: ['Red Colour', 'Blue Colour', 'Yellow Colour', 'Pink Colour', 'Black Colour']
  },
  {
    title: 'Confectionery',
    items: ['Toys', 'Toys with Lolly']
  },
  {
    title: 'Special / Clearance',
    items: ['Heading 1', 'Heading 2']
  }
];

export const Navbar = ({ onCartOpen }) => {
  const { theme, getCartCount, currentUser, logout, categories, settings } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState(null);
  const location = useLocation();

  const activeMegaMenuFromSettings = settings?.megaMenu && settings.megaMenu.length > 0 ? settings.megaMenu : megaMenuData;
  const standardCategories = new Set(activeMegaMenuFromSettings.flatMap(group => [group.title, ...group.items]));
  const customCategories = (categories || []).filter(cat => cat && !standardCategories.has(cat));
  
  const activeMegaMenuData = [...activeMegaMenuFromSettings];
  if (customCategories.length > 0) {
    activeMegaMenuData.push({
      title: 'More Sweets',
      items: customCategories
    });
  }

  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [location]);

  // Click outside close behavior
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdown(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleDropdownToggle = (menuName, e) => {
    e.stopPropagation();
    setActiveDropdown(prev => prev === menuName ? null : menuName);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const isSticky = settings?.header?.sticky !== false;

  return (
    <nav className="navbar" style={{ position: isSticky ? 'sticky' : 'relative' }}>
      <div className="container nav-container">
        {/* Logo */}
        <Link to="/" className="logo-link">
          {settings?.websiteLogo ? (
            <img src={settings.websiteLogo} alt={settings.websiteName || 'Best Lolly Shop'} className="logo-image" style={{ maxHeight: '40px', objectFit: 'contain' }} />
          ) : (
            <div className="logo-text">
              {settings?.header?.logoText ? (
                <>
                  {settings.header.logoText.split(' ').slice(0, -1).join(' ')} <span>{settings.header.logoText.split(' ').slice(-1)[0]}</span>
                </>
              ) : (
                <>Best <span>Lolly Shop</span></>
              )}
            </div>
          )}
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-links">
          <Link to="/shop" className={`nav-link ${location.pathname === '/shop' && !location.search ? 'active' : ''}`}>Shop All</Link>

          {/* Category Dropdown */}
          <div className="nav-item-container">
            <span 
              className={`nav-link ${activeDropdown === 'category' || (location.pathname === '/shop' && location.search.includes('category')) ? 'active' : ''}`}
              onClick={(e) => handleDropdownToggle('category', e)}
              style={{ cursor: 'pointer' }}
            >
              Category <ChevronDown size={12} className="chevron-icon" />
            </span>
          </div>



          {/* Personalised Dropdown */}
          <div className="nav-item-container">
            <span 
              className={`nav-link ${activeDropdown === 'personalised' ? 'active' : ''}`}
              onClick={(e) => handleDropdownToggle('personalised', e)}
              style={{ cursor: 'pointer' }}
            >
              Personalised <ChevronDown size={12} className="chevron-icon" />
            </span>
            {activeDropdown === 'personalised' && (
              <div className="dropdown-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <Link to="/contact?topic=Custom+Gift+Boxes" className="dropdown-item" onClick={() => setActiveDropdown(null)}>🎁 Custom Gift Boxes</Link>
                <Link to="/contact?topic=Build+a+Sweet+Jar" className="dropdown-item" onClick={() => setActiveDropdown(null)}>🍯 Build a Sweet Jar</Link>
                <Link to="/contact?topic=Event+Platters" className="dropdown-item" onClick={() => setActiveDropdown(null)}>🍽️ Event Platters</Link>
              </div>
            )}
          </div>

          {/* Business & Promotional Dropdown */}
          <div className="nav-item-container">
            <span 
              className={`nav-link ${activeDropdown === 'business' ? 'active' : ''}`}
              onClick={(e) => handleDropdownToggle('business', e)}
              style={{ cursor: 'pointer' }}
            >
              Business & Promotional <ChevronDown size={12} className="chevron-icon" />
            </span>
            {activeDropdown === 'business' && (
              <div className="dropdown-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <Link to="/contact?topic=Wholesale+Lollies" className="dropdown-item" onClick={() => setActiveDropdown(null)}>📦 Wholesale Lollies</Link>
                <Link to="/contact?topic=Custom+Branded+Bags" className="dropdown-item" onClick={() => setActiveDropdown(null)}>🏷️ Custom Branded Bags</Link>
                <Link to="/contact?topic=Corporate+Gifting" className="dropdown-item" onClick={() => setActiveDropdown(null)}>🏢 Corporate Gifting</Link>
              </div>
            )}
          </div>
          
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/contact" className="nav-link">Contact Us</Link>
        </div>

        {/* Nav Actions */}
        <div className="nav-actions">

          {/* User Auth Action (Profile dropdown if logged in, login icon if guest) */}
          {currentUser ? (
            <div className="nav-item-container user-menu-container">
              <button 
                className="icon-btn user-logged-btn" 
                onClick={(e) => handleDropdownToggle('userMenu', e)}
                title={currentUser.name || currentUser.email || 'User'}
              >
                {currentUser.name && currentUser.name.trim().length > 0
                  ? <span className="user-initial">{currentUser.name.trim().charAt(0).toUpperCase()}</span>
                  : <User size={18} />
                }
              </button>
              
              {activeDropdown === 'userMenu' && (
                <div className="dropdown-panel user-dropdown animate-fade-in" onClick={(e) => e.stopPropagation()}>
                  <div className="user-dropdown-header">
                    <strong>{currentUser.name || currentUser.email || 'User'}</strong>
                    <small>{currentUser.email}</small>
                  </div>
                  {currentUser.role === 'admin' ? (
                    <Link to="/admin" className="dropdown-item" onClick={() => setActiveDropdown(null)}>👑 Admin Dashboard</Link>
                  ) : (
                    <Link to="/profile" className="dropdown-item" onClick={() => setActiveDropdown(null)}>👤 My Profile</Link>
                  )}
                  <button 
                    className="dropdown-item logout-btn" 
                    onClick={() => { logout(); setActiveDropdown(null); }}
                  >
                    🚪 Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="icon-btn login-btn" title="Sign In / Admin Access">
              <User size={20} />
            </Link>
          )}

          {/* Cart Icon with badge */}
          <button className="icon-btn cart-btn" onClick={onCartOpen} aria-label="Open Cart">
            <ShoppingBag size={20} />
            {getCartCount() > 0 && (
              <span className="cart-badge animate-pop">{getCartCount()}</span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="icon-btn mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {activeDropdown === 'category' && (
          <div className="mega-menu-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
            {activeMegaMenuData.map((group) => {
              const getGroupIcon = (title) => {
                const lower = title.toLowerCase();
                if (lower.includes('nz')) return '🇳🇿';
                if (lower.includes('imported')) return '✈️';
                if (lower.includes('choc')) return '🍫';
                if (lower.includes('drink')) return '🥤';
                if (lower.includes('snack')) return '🍿';
                if (lower.includes('bulk')) return '📦';
                if (lower.includes('tiktok') || lower.includes('viral')) return '🔥';
                if (lower.includes('colour') || lower.includes('color') || lower.includes('pick')) return '🎨';
                if (lower.includes('confectionery')) return '🧸';
                if (lower.includes('clearance') || lower.includes('special')) return '🏷️';
                return '🍬';
              };

              return (
                <div key={group.title} className="mega-menu-column">
                  <Link 
                    to={`/shop?category=${encodeURIComponent(group.title)}`} 
                    className="mega-menu-title"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <span className="mega-menu-title-icon" style={{ marginRight: '6px' }}>
                      {getGroupIcon(group.title)}
                    </span>
                    {group.title}
                  </Link>
                  {group.items.map((item) => (
                    <Link
                      key={item}
                      to={`/shop?category=${encodeURIComponent(item)}`}
                      className="mega-menu-item"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Collapsible Mobile Categories Accordion */}
          <div className="mobile-category-accordion" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '8px' }}>
            <button 
              className="mobile-nav-link accordion-toggle-btn"
              onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', padding: '12px 16px', color: 'var(--color-text)', fontWeight: '700', fontSize: '15px' }}
            >
              <span>🍬 Browse Categories</span>
              <ChevronDown size={18} style={{ transform: mobileCategoriesOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease', color: 'var(--color-primary)' }} />
            </button>
            
            {mobileCategoriesOpen && (
              <div className="mobile-accordion-content" style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                {activeMegaMenuData.map((group) => (
                  <div key={group.title} className="mobile-accordion-group" style={{ background: 'rgba(231, 44, 131, 0.02)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(231, 44, 131, 0.05)' }}>
                    <button
                      className="mobile-group-toggle"
                      onClick={() => setOpenMobileGroup(openMobileGroup === group.title ? null : group.title)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', border: 'none', background: 'none', textAlign: 'left', color: 'var(--color-primary)', fontWeight: '800', padding: '4px 0', fontSize: '13.5px', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      <span>{group.title}</span>
                      <ChevronDown size={14} style={{ transform: openMobileGroup === group.title ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s ease' }} />
                    </button>
                    
                    {openMobileGroup === group.title && (
                      <div className="mobile-subgroup-links" style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '10px', marginTop: '4px', borderLeft: '1.5px solid var(--color-primary)' }}>
                        <Link 
                          to={`/shop?category=${encodeURIComponent(group.title)}`}
                          className="mobile-subgroup-link"
                          onClick={() => setMobileMenuOpen(false)}
                          style={{ fontSize: '12.5px', color: 'var(--color-text)', textDecoration: 'none', padding: '3px 0', display: 'block', fontWeight: 'bold' }}
                        >
                          View All {group.title}
                        </Link>
                        {group.items.map((item) => (
                          <Link
                            key={item}
                            to={`/shop?category=${encodeURIComponent(item)}`}
                            className="mobile-subgroup-link"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ fontSize: '12.5px', color: 'var(--color-text-light)', textDecoration: 'none', padding: '3px 0', display: 'block' }}
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {currentUser && currentUser.role === 'admin' && (
            <Link
              to="/admin"
              className="mobile-nav-link admin-link-mobile"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={18} style={{ marginRight: '8px' }} /> Admin Dashboard
            </Link>
          )}
          {currentUser && currentUser.role !== 'admin' && (
            <Link
              to="/profile"
              className="mobile-nav-link profile-link-mobile"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={18} style={{ marginRight: '8px' }} /> My Profile
            </Link>
          )}
          {currentUser ? (
            <button
              className="mobile-nav-link mobile-logout-btn"
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              🚪 Log Out{currentUser.name ? ` (${currentUser.name})` : ''}
            </button>
          ) : (
            <Link
              to="/login"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={18} style={{ marginRight: '8px' }} /> Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
