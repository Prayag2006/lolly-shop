import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Sun, Moon, Menu, X, User, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './Navbar.css';

export const Navbar = ({ onCartOpen }) => {
  const { theme, toggleTheme, getCartCount, currentUser, logout, categories } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

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

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Logo */}
        <Link to="/" className="logo-link">
          <div className="logo-text">
            Best <span>Lolly Shop</span>
          </div>
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
            
            {activeDropdown === 'category' && (
              <div className="dropdown-panel animate-fade-in">
                {(categories || []).map(cat => {
                  let emoji = '🍬';
                  const lowerCat = cat.toLowerCase();
                  if (lowerCat.includes('gumm')) emoji = '🍭';
                  else if (lowerCat.includes('choc')) emoji = '🍫';
                  else if (lowerCat.includes('lollipop') || lowerCat.includes('pop')) emoji = '🍭';
                  else if (lowerCat.includes('marsh') || lowerCat.includes('cloud')) emoji = '☁️';
                  else if (lowerCat.includes('sour')) emoji = '🍋';
                  else if (lowerCat.includes('gift') || lowerCat.includes('box')) emoji = '🎁';
                  
                  return (
                    <Link 
                      key={cat} 
                      to={`/shop?category=${encodeURIComponent(cat)}`} 
                      className="dropdown-item" 
                      onClick={() => setActiveDropdown(null)}
                    >
                      {emoji} {cat}
                    </Link>
                  );
                })}
              </div>
            )}
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
              <div className="dropdown-panel animate-fade-in">
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
              <div className="dropdown-panel animate-fade-in">
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
          {/* Theme Toggle */}
          <button className="icon-btn theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* User Auth Action (Profile dropdown if logged in, login icon if guest) */}
          {currentUser ? (
            <div className="nav-item-container user-menu-container">
              <button 
                className="icon-btn user-logged-btn" 
                onClick={(e) => handleDropdownToggle('userMenu', e)}
                title={currentUser.name}
              >
                <span className="user-initial">{currentUser.name.charAt(0)}</span>
              </button>
              
              {activeDropdown === 'userMenu' && (
                <div className="dropdown-panel user-dropdown animate-fade-in">
                  <div className="user-dropdown-header">
                    <strong>{currentUser.name}</strong>
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
              🚪 Log Out ({currentUser.name})
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
