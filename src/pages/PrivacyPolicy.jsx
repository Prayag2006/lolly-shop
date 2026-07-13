import React, { useEffect } from 'react';
import { SEO } from '../components/SEO';
import './PrivacyPolicy.css';

export const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="privacy-page container">
      <SEO title="Privacy Policy - Best Lolly Shop NZ" description="Read our privacy policy detailing how we collect and protect your customer data in compliance with the New Zealand Privacy Act 2020." />
      <div className="glass-card privacy-card">
        <h1>Privacy Policy</h1>
        <p className="privacy-updated">Last Updated: July 2026</p>

        <section className="privacy-section">
          <h2>1. Commitment to Privacy</h2>
          <p>
            Best Lolly Shop ("we", "us", "our") is committed to protecting the privacy of our customers and visitors. 
            This Privacy Policy outlines how we collect, use, disclose, and protect your personal information in 
            strict compliance with the <strong>New Zealand Privacy Act 2020</strong>.
          </p>
        </section>

        <section className="privacy-section">
          <h2>2. Personal Information We Collect</h2>
          <p>We collect personal information necessary to provide our products and services to you, including:</p>
          <ul>
            <li><strong>Identity Information:</strong> Name, username, and role.</li>
            <li><strong>Contact Information:</strong> Email address, phone number, and physical delivery address.</li>
            <li><strong>Transaction Information:</strong> Details of products you purchase, order history, and payment status (note: we do not store full credit card details).</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information, and site interaction cookies.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use your personal information only for purposes permitted by New Zealand law, including:</p>
          <ul>
            <li>Processing and delivering your lolly orders.</li>
            <li>Communicating with you regarding your orders, shipping details, and support inquiries.</li>
            <li>Sending promotional offers and newsletters, provided you have explicitly opted in (complying with the <strong>NZ Unsolicited Electronic Messages Act 2007</strong>).</li>
            <li>Improving our website performance, layout, and shopping experience.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>4. Storage and Protection of Information</h2>
          <p>
            We take reasonable security safeguards to protect your personal information against loss, unauthorized access, 
            modification, or disclosure. All transaction processes are protected with secure SSL/TLS encryption. 
            Account passwords are cryptographically hashed using PBKDF2 with SHA-512, meaning plaintext passwords are never stored.
          </p>
        </section>

        <section className="privacy-section">
          <h2>5. Disclosure of Information</h2>
          <p>We will not sell, rent, or lease your personal information to third parties. We only share information with trusted partners to complete your orders:</p>
          <ul>
            <li><strong>Delivery Partners:</strong> Local New Zealand courier services (e.g., NZ Post) to deliver packages.</li>
            <li><strong>Payment Gateways:</strong> Secure PCI-DSS compliant credit card processors (Visa, Mastercard, Apple Pay, Google Pay).</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>6. Your Rights (Access and Correction)</h2>
          <p>
            Under the <strong>NZ Privacy Act 2020</strong>, you have the right to request access to any personal information we 
            hold about you, and to request correction of that information.
          </p>
          <p>
            If you wish to access or correct your details, please contact our Privacy Officer at 
            <a href="mailto:bestlollyshopnz@gmail.com"> bestlollyshopnz@gmail.com</a>. We will respond to your request within 20 working days.
          </p>
        </section>

        <section className="privacy-section">
          <h2>7. Cookies Policy</h2>
          <p>
            Our website uses cookies to store items in your shopping cart, manage active sessions, and track performance. 
            You can disable cookies in your browser settings, though some functions of the site may cease to work.
          </p>
        </section>

        <section className="privacy-section">
          <h2>8. Updates to this Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal obligations. 
            Any updates will be posted on this page with an updated "Last Updated" date.
          </p>
        </section>
      </div>
    </div>
  );
};
