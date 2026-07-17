import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { SEO } from '../components/SEO';
import './TermsOfService.css';

export const TermsOfService = () => {
  const { customPages } = useStore();
  const termsPage = customPages?.find(p => (p.slug === 'terms' || p.slug === 'terms-of-service') && p.enabled);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (termsPage) {
    return (
      <div className="terms-page container">
        <SEO title={termsPage.seoTitle || termsPage.title} description={termsPage.seoDescription} />
        <div className="glass-card terms-card">
          <h1>{termsPage.title}</h1>
          <div className="custom-page-content-wrapper" dangerouslySetInnerHTML={{ __html: termsPage.content }} />
        </div>
      </div>
    );
  }

  return (
    <div className="terms-page container">
      <SEO title="Terms of Service - Best Lolly Shop NZ" description="Read our terms of service governing purchases and deliveries under the New Zealand Consumer Guarantees Act." />
      <div className="glass-card terms-card">
        <h1>Terms of Service</h1>
        <p className="terms-updated">Last Updated: July 2026</p>

        <section className="terms-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Best Lolly Shop ("we", "us", "our"). By accessing or using our website and purchasing our products, 
            you agree to be bound by these Terms of Service. Please read them carefully. These terms are governed by the 
            laws of New Zealand.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Compliance and Consumer Guarantees</h2>
          <p>
            Nothing in these terms limits or excludes your rights under the <strong>New Zealand Consumer Guarantees Act 1993 (CGA)</strong> 
            or the <strong>Fair Trading Act 1986 (FTA)</strong>. If you are purchasing products for personal or domestic use, 
            you receive all guarantees and rights provided under the CGA.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. Product Pricing and Information</h2>
          <p>
            All prices listed on our website are in <strong>New Zealand Dollars (NZD)</strong> and are inclusive of GST (Goods and 
            Services Tax) unless stated otherwise. We make every effort to display product details, descriptions, ingredients, 
            and pricing accurately. In the event of a listing error, we reserve the right to cancel affected orders and issue a full refund.
          </p>
        </section>

        <section className="terms-section">
          <h2>4. Payments and Security</h2>
          <p>
            We process payments through secure, PCI-DSS compliant credit card gateways (supporting Visa, Mastercard, Google Pay, Apple Pay, 
            and Shop Pay). To protect your financial security, your complete credit card information is encrypted and is never stored on our servers.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Shipping and Delivery</h2>
          <p>
            We deliver products exclusively to physical addresses within New Zealand. Delivery times (typically 3-5 business days) 
            are estimates. We are not responsible for courier delays beyond our control, but will assist in tracking shipments and resolving delivery disputes.
          </p>
        </section>

        <section className="terms-section">
          <h2>6. Returns, Exchanges, and Refunds</h2>
          <p>
            Please choose carefully, as we are not required to provide a refund or replacement for change of mind. 
            However, under the CGA:
          </p>
          <ul>
            <li>If a product is faulty, damaged during transit, or does not match its description, we will meet our obligations under the CGA to provide a replacement, remedy, or refund.</li>
            <li>Due to food safety regulations, we cannot accept returns on opened lolly packaging unless the goods themselves are faulty.</li>
          </ul>
          <p>For return inquiries, please contact us at <a href="mailto:bestlollyshopnz@gmail.com">bestlollyshopnz@gmail.com</a>.</p>
        </section>

        <section className="terms-section">
          <h2>7. User Accounts</h2>
          <p>
            If you create an account on our site, you are responsible for maintaining the confidentiality of your credentials. 
            You agree to notify us immediately of any unauthorized use of your account. We employ secure cryptographic hashing 
            (PBKDF2 SHA-512) to protect user passwords.
          </p>
        </section>

        <section className="terms-section">
          <h2>8. Intellectual Property</h2>
          <p>
            All content, graphics, logo text, images, and layout designs on this website are the intellectual property of Best Lolly Shop 
            and are protected by New Zealand and international copyright laws.
          </p>
        </section>

        <section className="terms-section">
          <h2>9. Amendments to Terms</h2>
          <p>
            We reserve the right to amend these Terms of Service at any time. Your continued use of the website following any 
            changes constitutes acceptance of the new terms.
          </p>
        </section>
      </div>
    </div>
  );
};
