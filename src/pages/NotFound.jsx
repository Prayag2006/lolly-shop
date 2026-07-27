import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import './CustomPage.css';

export const NotFound = () => {
  return (
    <div className="custom-cms-page container">
      <SEO title="Page Not Found - Best Lolly Shop NZ" description="The requested page could not be found." />
      <div className="glass-card custom-cms-card not-found-card">
        <div className="not-found-icon">🍬</div>
        <h1>404 - Sweet Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn-home-link">
          Back to Sweet Shop
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
