import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './CustomDropdown.css';

export const CustomDropdown = ({ options, value, onChange, placeholder = 'Select option', icon: Icon, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue, e) => {
    e.stopPropagation();
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`lolly-dropdown ${isOpen ? 'open' : ''} ${className}`} ref={dropdownRef}>
      <button 
        type="button" 
        className="lolly-dropdown-toggle" 
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="lolly-dropdown-toggle-left">
          {Icon && <Icon size={16} className="lolly-dropdown-left-icon" />}
          <span className="lolly-dropdown-label">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown size={14} className="lolly-dropdown-arrow" />
      </button>

      {isOpen && (
        <ul className="lolly-dropdown-menu glass-card" role="listbox">
          {options.map((opt) => (
            <li 
              key={opt.value}
              className={`lolly-dropdown-item ${opt.value === value ? 'active' : ''}`}
              role="option"
              aria-selected={opt.value === value}
              onClick={(e) => handleSelect(opt.value, e)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
