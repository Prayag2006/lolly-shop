import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { SEO } from '../components/SEO';
import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsOfService } from './TermsOfService';
import './CustomPage.css';

export const CustomPage = () => {
  const { slug } = useParams();
  const { customPages } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const cleanSlug = (slug || '').toLowerCase().trim();

  // Alias routing for built-in pages
  if (cleanSlug === 'privacy' || cleanSlug === 'privacy-policy') {
    return <PrivacyPolicy />;
  }

  if (cleanSlug === 'terms' || cleanSlug === 'terms-of-service') {
    return <TermsOfService />;
  }

  // Find dynamic CMS custom page
  const matchedPage = customPages?.find(
    p => p.slug?.toLowerCase().trim() === cleanSlug && p.enabled !== false
  );

  if (matchedPage) {
    return (
      <div className="custom-cms-page container">
        <SEO 
          title={`${matchedPage.seoTitle || matchedPage.title} - Best Lolly Shop NZ`} 
          description={matchedPage.seoDescription || `Read ${matchedPage.title} at Best Lolly Shop NZ.`} 
        />
        <div className="glass-card custom-cms-card">
          <h1>{matchedPage.title}</h1>
          <div 
            className="custom-page-content-wrapper" 
            dangerouslySetInnerHTML={{ __html: matchedPage.content || '' }} 
          />
        </div>
      </div>
    );
  }

  // Fallback 404 for non-existent dynamic pages
  return (
    <div className="custom-cms-page container">
      <SEO title="Page Not Found - Best Lolly Shop NZ" description="The requested page could not be found." />
      <div className="glass-card custom-cms-card not-found-card">
        <div className="not-found-icon">🍬</div>
        <h1>404 - Sweet Page Not Found</h1>
        <p>Sorry, the page <code>/{slug}</code> you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn-home-link">
          Back to Sweet Shop
        </Link>
      </div>
    </div>
  );
};

export default CustomPage;
