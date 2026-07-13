import { useEffect } from 'react';

/**
 * Dynamic SEO component that updates document head tags
 * and injects structured JSON-LD schemas inside a React SPA.
 */
export const SEO = ({ title, description, canonicalUrl, ogType, ogImage, schema }) => {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title || "Best Lolly Shop - New Zealand's Favourite Online Lolly Shop";

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description || "Shop the finest selection of lollies, sour gummies, imported chocolates and sweets online in New Zealand.");

    // 3. Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    
    // Clean URL parameters except category/search for SEO canonicalization
    const getCleanCanonical = () => {
      if (canonicalUrl) return canonicalUrl;
      if (typeof window === 'undefined') return "https://www.bestlollyshop.co.nz";
      try {
        const url = new URL(window.location.href);
        const cleanParams = new URLSearchParams();
        ['category', 'search'].forEach(param => {
          if (url.searchParams.has(param)) {
            cleanParams.set(param, url.searchParams.get(param));
          }
        });
        url.search = cleanParams.toString();
        return url.toString();
      } catch (e) {
        return window.location.href;
      }
    };
    
    const canonicalHref = getCleanCanonical();
    canonical.setAttribute('href', canonicalHref);

    // 4. Update Open Graph Meta Tags
    const ogTags = {
      'og:title': title || "Best Lolly Shop",
      'og:description': description || "Shop the finest selection of lollies online.",
      'og:type': ogType || 'website',
      'og:url': canonicalHref,
      'og:image': ogImage || `${window.location.origin}/logo.png`,
      'og:site_name': 'Best Lolly Shop'
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // 5. Update Twitter Card Meta Tags
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:title': title || "Best Lolly Shop",
      'twitter:description': description || "Shop the finest selection of lollies online.",
      'twitter:image': ogImage || `${window.location.origin}/logo.png`
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // 6. Inject Schema JSON-LD Script
    let schemaScript = document.getElementById('seo-schema-jsonld');
    if (schemaScript) {
      schemaScript.remove();
    }
    if (schema) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('id', 'seo-schema-jsonld');
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.textContent = JSON.stringify(schema);
      document.head.appendChild(schemaScript);
    }

    return () => {
      // Cleanup schema scripts on route transitions
      const currentSchema = document.getElementById('seo-schema-jsonld');
      if (currentSchema) {
        currentSchema.remove();
      }
    };
  }, [title, description, canonicalUrl, ogType, ogImage, schema]);

  return null;
};
