import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from './BlogPostsData';
import { SEO } from '../components/SEO';
import './Blog.css';

export const Blog = () => {
  const domain = typeof window !== 'undefined' ? window.location.origin : 'https://www.bestlollyshop.co.nz';
  
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Best Lolly Shop Blog",
    "description": "Guides, party ideas, and sweet recommendations from New Zealand's favorite lolly blog.",
    "publisher": {
      "@type": "Organization",
      "name": "Best Lolly Shop",
      "logo": `${domain}/logo.png`
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": "2026-07-01", // Default base date or parsed
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "url": `${domain}/blog/${post.slug}`
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": domain
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${domain}/blog`
      }
    ]
  };

  const schemas = [blogListSchema, breadcrumbSchema];

  // Visual gradients for cards
  const cardGradients = [
    'linear-gradient(135deg, #e72c83 0%, #f472b6 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
  ];

  return (
    <div className="blog-page">
      <SEO 
        title="Lolly Blog NZ | Ultimate Candy Guides & Party Ideas - Best Lolly Shop"
        description="Read the latest sweet guides, party lolly planning tips, and Kiwi nostalgia stories. Learn about bulk ordering and custom lolly gift hampers."
        schema={schemas}
      />
      
      {/* Blog Hero Banner */}
      <section className="blog-hero">
        <div className="blog-hero-glow glow-pink animate-pulse-slow"></div>
        <div className="blog-hero-glow glow-purple"></div>
        <div className="container">
          <div className="blog-hero-content">
            <span className="badge">
              <Sparkles size={13} style={{ marginRight: '5px' }} /> Sweet Insights
            </span>
            <h1>The Lolly Blog</h1>
            <p>Your ultimate destination for party styling, Kiwi confectionery nostalgia, bulk buying tips, and sweet guides in New Zealand.</p>
          </div>
        </div>
        <div className="blog-hero-fade"></div>
      </section>

      {/* Blog Grid */}
      <section className="blog-grid-section section-padding">
        <div className="container">
          <div className="blog-grid">
            {blogPosts.map((post, idx) => (
              <article key={post.slug} className="blog-card glass-card">
                {/* Visual Header */}
                <div className="blog-card-visual" style={{ background: cardGradients[idx % cardGradients.length] }}>
                  <div className="blog-card-mesh"></div>
                  <div className="blog-card-icon">🍬</div>
                </div>

                {/* Content */}
                <div className="blog-card-content">
                  <div className="blog-meta">
                    <span className="meta-item"><Calendar size={12} /> {post.date}</span>
                    <span className="meta-item"><Clock size={12} /> {post.readTime}</span>
                  </div>
                  
                  <h2 className="blog-title">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  
                  <p className="blog-excerpt">{post.excerpt}</p>
                  
                  <div className="blog-footer">
                    <span className="blog-author"><User size={12} /> By {post.author}</span>
                    <Link to={`/blog/${post.slug}`} className="read-more-link">
                      Read Guide <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
