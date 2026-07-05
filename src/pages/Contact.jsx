import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import './Contact.css';

export const Contact = () => {
  const { addContactSubmission } = useStore();
  const [searchParams] = useSearchParams();
  const defaultTopic = searchParams.get('topic') || 'General Inquiry';
  const [topic, setTopic] = useState(defaultTopic);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const topics = [
    'Wholesale Lollies',
    'Custom Branded Bags',
    'Corporate Gifting',
    'Product Inquiry',
    'Bulk Order Request',
    'General Inquiry'
  ];

  useEffect(() => {
    setTopic(defaultTopic);
  }, [defaultTopic]);

  useEffect(() => {
    const handleClose = () => setDropdownOpen(false);
    document.addEventListener('click', handleClose);
    return () => document.removeEventListener('click', handleClose);
  }, []);

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    setDropdownOpen(prev => !prev);
  };

  const handleSelectOption = (opt) => {
    setTopic(opt);
    setDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      return;
    }

    addContactSubmission({
      subject: topic,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
      submittedAt: new Date().toLocaleString('en-NZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="contact-page container">
      <div className="contact-card glass-card">
        <div className="contact-hero">
          <div>
            <h1>Contact Us</h1>
            <p>Choose a topic and tell us your requirements. Our team will reach out with a sweet solution.</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row two-cols">
            <div className="form-group custom-select-group">
              <label>Topic</label>
              <div className="custom-select-wrapper">
                <button
                  type="button"
                  className={`custom-select-trigger ${dropdownOpen ? 'open' : ''}`}
                  onClick={handleDropdownClick}
                >
                  <span>{topic}</span>
                  <span className="custom-select-arrow"></span>
                </button>
                
                {dropdownOpen && (
                  <div className="custom-select-dropdown animate-fade-in">
                    {topics.map((t) => (
                      <div
                        key={t}
                        className={`custom-select-option ${topic === t ? 'selected' : ''}`}
                        onClick={() => handleSelectOption(t)}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jane Doe"
                required
              />
            </div>
          </div>

          <div className="form-row two-cols">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. jane@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your requirement, event, quantity, or any questions."
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary form-submit-btn">
              Submit Request
            </button>
          </div>

          {submitted && (
            <div className="form-success-banner contact-success">
              Thank you! Your request is submitted and visible in the admin panel.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
