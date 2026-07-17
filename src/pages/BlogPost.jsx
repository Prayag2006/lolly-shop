import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { blogPosts } from './BlogPostsData';
import { useStore } from '../context/StoreContext';
import { SEO } from '../components/SEO';
import './BlogPost.css';

export const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { blogPosts: dbBlogPosts } = useStore();

  const activeBlogPosts = dbBlogPosts && dbBlogPosts.length > 0 ? dbBlogPosts : blogPosts;
  const post = activeBlogPosts.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!post) {
    return (
      <div className="container blog-not-found">
        <div className="glass-card not-found-card">
          <h2>🍭 Article Not Found</h2>
          <p>We couldn't find the sweet guide you are looking for.</p>
          <button className="btn btn-primary" onClick={() => navigate('/blog')}>
            Back to Sweet Blog
          </button>
        </div>
      </div>
    );
  }

  const domain = typeof window !== 'undefined' ? window.location.origin : 'https://www.bestlollyshop.co.nz';
  const postUrl = `${domain}/blog/${post.slug}`;

  // Article Schema markup
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": "2026-07-01",
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Best Lolly Shop",
      "logo": `${domain}/logo.png`
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    }
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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": postUrl
      }
    ]
  };

  const schemas = [articleSchema, breadcrumbSchema];

  // Recommend other articles
  const otherPosts = activeBlogPosts.filter(p => p.slug !== slug).slice(0, 3);

  return (
    <div className="blog-post-page">
      <SEO 
        title={post.metaTitle || `${post.title} | Best Lolly Shop Blog`}
        description={post.metaDesc || post.excerpt}
        schema={schemas}
      />

      <div className="container blog-post-container">
        {/* Back Link */}
        <Link to="/blog" className="back-to-blog-link">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <div className="blog-post-layout">
          {/* Main Content */}
          <main className="blog-post-main">
            <article className="blog-post-article glass-card">
              {/* Header */}
              <header className="article-header">
                <h1 className="article-title">{post.title}</h1>
                
                <div className="article-meta">
                  <span className="meta-item"><Calendar size={14} /> {post.date}</span>
                  <span className="meta-item"><Clock size={14} /> {post.readTime}</span>
                  <span className="meta-item"><User size={14} /> By {post.author}</span>
                </div>
              </header>

              {/* Body */}
              <div 
                className="article-body-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Gifting Call to Action */}
              <div className="article-cta-box">
                <div className="cta-mesh"></div>
                <div className="cta-content">
                  <Sparkles size={32} className="cta-sparkle animate-pulse-slow" />
                  <h3>Craving Sweet Treats?</h3>
                  <p>Discover New Zealand's finest range of bulk lollies, kiwi retro classics, chocolates, and custom pick & mix bags. High quality and fresh stock delivered fast NZ-wide.</p>
                  <Link to={post.ctaLink || '/shop'} className="btn btn-primary cta-button">
                    {post.ctaText || 'Explore Sweet Shop'} <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          </main>

          {/* Sidebar */}
          <aside className="blog-post-sidebar">
            <div className="sidebar-widget glass-card">
              <h3>Other Sweet Guides</h3>
              <ul className="sidebar-links">
                {otherPosts.map(p => (
                  <li key={p.slug}>
                    <Link to={`/blog/${p.slug}`}>
                      <span className="sidebar-link-title">{p.title}</span>
                      <span className="sidebar-link-date">{p.date}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-widget promo-widget glass-card">
              <div className="promo-candy">🍬</div>
              <h3>10% OFF YOUR FIRST ORDER</h3>
              <p>Get fresh lollies delivered NZ-wide. Use code at checkout:</p>
              <div className="promo-code">SWEET10</div>
              <Link to="/shop" className="btn btn-secondary">Shop Now</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
