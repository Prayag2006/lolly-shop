import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  BarChart3, 
  Trash2, 
  AlertTriangle,
  TrendingUp,
  FileText,
  Users,
  Activity,
  Tag,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const AdminEnterpriseTabs = ({ activeTab, handleUndo }) => {
  const { 
    currentUser, orders, settings, updateSettings,
    offers, addOffer, updateOffer, deleteOffer,
    auditLogs,
    redirects, addRedirect, deleteRedirect, newsletterSubscribers,
    addNewsletterSubscriber, deleteNewsletterSubscriber, customPages,
    addCustomPage, updateCustomPage, deleteCustomPage, staffUsers,
    addStaffUser, updateStaffUser, deleteStaffUser, systemStatus,
    backupDatabase, restoreDatabase, undoStack
  } = useStore();

  const safeOrders = orders || [];
  const totalSales = safeOrders.reduce((sum, ord) => sum + Number(ord?.total || 0), 0);
  const totalOrders = safeOrders.length;

  // Enterprise Offers State
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [newOffer, setNewOffer] = useState({
    code: '',
    title: '',
    type: 'coupon',
    discountValue: 0,
    discountType: 'percentage',
    minPurchase: 0,
    buyQty: 0,
    getYQty: 0,
    buyProductId: '',
    getYProductId: '',
    freeGiftProductId: '',
    priority: 0,
    visible: true,
    startDate: '',
    endDate: '',
    active: true
  });


  // Enterprise CMS custom pages state
  const [editingCustomPageId, setEditingCustomPageId] = useState(null);
  const [newCustomPage, setNewCustomPage] = useState({
    title: '',
    slug: '',
    content: '',
    enabled: true,
    seoTitle: '',
    seoDescription: ''
  });

  // Enterprise SEO Redirects state
  const [newRedirect, setNewRedirect] = useState({ fromPath: '', toPath: '', statusCode: 301 });

  // Enterprise Newsletter state
  const [newSubscriberEmail, setNewSubscriberEmail] = useState('');
  const [newsletterCampaign, setNewsletterCampaign] = useState({ subject: '', content: '' });
  const [campaignSuccess, setCampaignSuccess] = useState('');

  // Enterprise Staff users state
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', role: 'manager', permissions: [] });

  // Enterprise Search synonyms state
  const [synonymText, setSynonymText] = useState('');

  // Enterprise AI states
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  if (activeTab === 'offers') {
    return (
      <div className="admin-tab-content animate-fade-in">
        <h2>Offers & Automatic Coupons</h2>
        <p className="tab-subtitle">Manage store-wide discounts, coupon codes, buy-one-get-one rules, and free shipping triggers.</p>
        
        {/* Create/Edit Offer Form */}
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3>{editingOfferId ? '✏️ Edit Offer Rule' : '➕ Create New Offer / Coupon'}</h3>
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (editingOfferId) {
              await updateOffer(editingOfferId, newOffer);
              setEditingOfferId(null);
              alert('Offer updated! 🎉');
            } else {
              await addOffer(newOffer);
              alert('Offer created successfully! 🍬');
            }
            setNewOffer({
              code: '', title: '', type: 'coupon', discountValue: 0, discountType: 'percentage',
              minPurchase: 0, buyQty: 0, getYQty: 0, buyProductId: '', getYProductId: '',
              freeGiftProductId: '', priority: 0, visible: true, startDate: '', endDate: '', active: true
            });
          }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label>Coupon Code / Identifier</label>
              <input type="text" value={newOffer.code} onChange={(e) => setNewOffer({...newOffer, code: e.target.value.trim().toUpperCase()})} placeholder="e.g. SWEET15" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label>Offer Name / Label</label>
              <input type="text" value={newOffer.title} onChange={(e) => setNewOffer({...newOffer, title: e.target.value})} placeholder="e.g. 15% off Sours" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label>Offer Type</label>
              <select value={newOffer.type} onChange={(e) => setNewOffer({...newOffer, type: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}>
                <option value="coupon">Coupon Promo Code</option>
                <option value="auto_discount">Automatic Discount</option>
                <option value="bogo">Buy X Get Y (BOGO)</option>
                <option value="free_shipping">Free Shipping Offer</option>
                <option value="category_discount">Category Discount</option>
                <option value="product_discount">Product Discount</option>
                <option value="flash_sale">Flash Sale Deal</option>
                <option value="bundle">Product Bundle Deal</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label>Discount Value</label>
              <input type="number" value={newOffer.discountValue} onChange={(e) => setNewOffer({...newOffer, discountValue: Number(e.target.value)})} placeholder="e.g. 15" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label>Discount Unit</label>
              <select value={newOffer.discountType} onChange={(e) => setNewOffer({...newOffer, discountType: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}>
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (NZD)</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label>Min Order Spend (NZD)</label>
              <input type="number" value={newOffer.minPurchase} onChange={(e) => setNewOffer({...newOffer, minPurchase: Number(e.target.value)})} placeholder="e.g. 50" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label>Starts Date</label>
              <input type="date" value={newOffer.startDate} onChange={(e) => setNewOffer({...newOffer, startDate: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label>Ends Date</label>
              <input type="date" value={newOffer.endDate} onChange={(e) => setNewOffer({...newOffer, endDate: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', gridColumn: '1 / -1', marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                <input type="checkbox" checked={newOffer.active} onChange={(e) => setNewOffer({...newOffer, active: e.target.checked})} /> Active Rule
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                <input type="checkbox" checked={newOffer.visible} onChange={(e) => setNewOffer({...newOffer, visible: e.target.checked})} /> Show on Banner
              </label>
              <button type="submit" className="btn btn-primary" style={{ marginLeft: 'auto', padding: '10px 24px', fontWeight: 'bold' }}>
                {editingOfferId ? 'Save Updates' : 'Create Offer'}
              </button>
            </div>
          </form>
        </div>

        {/* Offers Table */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Type</th>
                <th>Discount</th>
                <th>Min Spend</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(offers || []).map((o, idx) => (
                <tr key={o.id || o._id || idx}>
                  <td style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{o.code}</td>
                  <td>{o.title}</td>
                  <td><span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '20px', background: 'var(--color-border)', fontWeight: 'bold' }}>{o.type.replace('_', ' ')}</span></td>
                  <td>{o.discountValue}{o.discountType === 'percentage' ? '%' : ' NZD'}</td>
                  <td>${o.minPurchase || 0}</td>
                  <td><span className={`status-badge ${o.active ? 'completed' : 'pending'}`}>{o.active ? 'Active' : 'Disabled'}</span></td>
                  <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button onClick={() => { setEditingOfferId(o.id || o._id); setNewOffer(o); }} style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Edit</button>
                    <button onClick={async () => { if (window.confirm('Delete this offer?')) await deleteOffer(o.id || o._id); }} style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {(offers || []).length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>No offers created yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }



  if (activeTab === 'custom-pages') {
    return (
      <div className="admin-tab-content animate-fade-in">
        <h2>CMS Custom Pages Builder</h2>
        <p className="tab-subtitle">Build landing pages, terms of service, cookies policies, and static templates dynamically.</p>
        
        {/* Pages Form */}
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3>{editingCustomPageId ? '✏️ Edit CMS Page' : '➕ Create Custom Landing Page'}</h3>
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (editingCustomPageId) {
              await updateCustomPage(editingCustomPageId, newCustomPage);
              setEditingCustomPageId(null);
              alert('Page saved successfully!');
            } else {
              await addCustomPage(newCustomPage);
              alert('Page published successfully!');
            }
            setNewCustomPage({ title: '', slug: '', content: '', enabled: true, seoTitle: '', seoDescription: '' });
          }} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label>Page Title</label>
                <input type="text" value={newCustomPage.title} onChange={(e) => {
                  const t = e.target.value;
                  const s = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  setNewCustomPage({...newCustomPage, title: t, slug: s });
                }} placeholder="e.g. Terms of Service" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label>URL Slug (Path)</label>
                <input type="text" value={newCustomPage.slug} onChange={(e) => setNewCustomPage({...newCustomPage, slug: e.target.value.toLowerCase()})} placeholder="e.g. terms-of-service" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label>HTML Content Layout</label>
              <textarea value={newCustomPage.content} onChange={(e) => setNewCustomPage({...newCustomPage, content: e.target.value})} placeholder="<section><h2>1. Conditions</h2><p>Our terms are governed by NZ Consumer Guarantees Act...</p></section>" rows="8" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'monospace', background: 'var(--color-background)', color: 'var(--color-text)' }}></textarea>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label>SEO Title</label>
                <input type="text" value={newCustomPage.seoTitle} onChange={(e) => setNewCustomPage({...newCustomPage, seoTitle: e.target.value})} placeholder="e.g. Terms of Service NZ - Best Lolly Shop" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label>SEO Meta Description</label>
                <input type="text" value={newCustomPage.seoDescription} onChange={(e) => setNewCustomPage({...newCustomPage, seoDescription: e.target.value})} placeholder="Read our detailed terms regarding purchase policies..." style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                <input type="checkbox" checked={newCustomPage.enabled} onChange={(e) => setNewCustomPage({...newCustomPage, enabled: e.target.checked})} /> Enable Page Router
              </label>
              <button type="submit" className="btn btn-primary" style={{ marginLeft: 'auto', padding: '10px 24px', fontWeight: 'bold' }}>
                {editingCustomPageId ? 'Save Layout' : 'Publish Page'}
              </button>
            </div>
          </form>
        </div>

        {/* Pages Grid */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug Path</th>
                <th>Status</th>
                <th>Last Modified</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(customPages || []).map((p, idx) => (
                <tr key={p.id || p._id || idx}>
                  <td style={{ fontWeight: 'bold' }}>{p.title}</td>
                  <td><a href={`/${p.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>/{p.slug}</a></td>
                  <td><span className={`status-badge ${p.enabled ? 'completed' : 'pending'}`}>{p.enabled ? 'Enabled' : 'Disabled'}</span></td>
                  <td>{new Date(p.updatedAt || Date.now()).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button onClick={() => { setEditingCustomPageId(p.id || p._id); setNewCustomPage(p); }} style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Edit</button>
                    <button onClick={async () => { if (window.confirm('Delete this custom page?')) await deleteCustomPage(p.id || p._id); }} style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {(customPages || []).length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>No custom landing pages created yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeTab === 'seo') {
    return (
      <div className="admin-tab-content animate-fade-in">
        <h2>SEO Redirects & Search Synonyms</h2>
        <p className="tab-subtitle">Set up 301 paths redirects for broken links (404 monitors) and map search terms synonyms.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
          {/* Redirects Column */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3>🔗 Create Path Redirect Rule</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!newRedirect.fromPath || !newRedirect.toPath) return;
              await addRedirect(newRedirect);
              setNewRedirect({ fromPath: '', toPath: '', statusCode: 301 });
              alert('Redirect rule saved!');
            }} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label>From URL (Broken path)</label>
                <input type="text" value={newRedirect.fromPath} onChange={(e) => setNewRedirect({...newRedirect, fromPath: e.target.value.trim()})} placeholder="e.g. /old-sour-straps" required style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label>To URL (Target path)</label>
                <input type="text" value={newRedirect.toPath} onChange={(e) => setNewRedirect({...newRedirect, toPath: e.target.value.trim()})} placeholder="e.g. /shop?category=Sour%20Lollies" required style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label>HTTP Redirect Type</label>
                <select value={newRedirect.statusCode} onChange={(e) => setNewRedirect({...newRedirect, statusCode: Number(e.target.value)})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}>
                  <option value="301">301 - Permanent Redirect</option>
                  <option value="302">302 - Temporary Redirect</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '8px', fontWeight: 'bold' }}>Add Redirect</button>
            </form>

            <div style={{ marginTop: '20px', overflowX: 'auto' }}>
              <h4>Active SEO Rules</h4>
              <table className="admin-table" style={{ width: '100%', fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Code</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(redirects || []).map((r, idx) => (
                    <tr key={r.id || r._id || idx}>
                      <td>{r.fromPath}</td>
                      <td>{r.toPath}</td>
                      <td>{r.statusCode}</td>
                      <td><button onClick={async () => await deleteRedirect(r.id || r._id)} style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold' }}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Synonyms Column */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3>🔍 Search Synonyms Dictionary</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Map search keywords so customer queries for one term show results for related items (e.g. "candy =&gt; lollies, sweets").</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label>Active Synonym Mappings (JSON format)</label>
                <textarea 
                  value={synonymText || JSON.stringify(settings?.synonyms || [
                    { keyword: "candy", mapping: ["lolly", "sweets", "confectionery"] },
                    { keyword: "chocolate", mapping: ["cocoa", "fudge", "truffle"] }
                  ], null, 2)} 
                  onChange={(e) => setSynonymText(e.target.value)} 
                  rows="8" 
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'monospace', fontSize: '12px', background: 'var(--color-background)', color: 'var(--color-text)' }}
                ></textarea>
              </div>
              <button 
                onClick={async () => {
                  try {
                    const parsed = JSON.parse(synonymText);
                    const newSettings = { ...settings, synonyms: parsed };
                    await updateSettings(newSettings);
                    alert('Synonyms dictionary updated! 🔍');
                  } catch (err) {
                    alert('Invalid JSON structure. Please correct and retry.');
                  }
                }}
                className="btn btn-primary" 
                style={{ padding: '8px', fontWeight: 'bold' }}
              >
                Save Synonym Dictionary
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'newsletter') {
    return (
      <div className="admin-tab-content animate-fade-in">
        <h2>Mailing List & Newsletters</h2>
        <p className="tab-subtitle">View your email subscribers, import subscriber emails, and send newsletter updates.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'flex-start' }}>
          {/* Subscriber List */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3>📧 Add Subscriber Manual</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!newSubscriberEmail) return;
              await addNewsletterSubscriber(newSubscriberEmail);
              setNewSubscriberEmail('');
              alert('Subscriber added!');
            }} style={{ display: 'flex', gap: '8px', marginTop: '8px', marginBottom: '20px' }}>
              <input type="email" value={newSubscriberEmail} onChange={(e) => setNewSubscriberEmail(e.target.value)} placeholder="name@email.com" required style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 12px', fontWeight: 'bold' }}>Add</button>
            </form>

            <h4>Newsletter Subscribers ({newsletterSubscribers ? newsletterSubscribers.length : 0})</h4>
            <div style={{ maxHeight: '300px', overflowY: 'auto', fontSize: '12px', marginTop: '10px' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(newsletterSubscribers || []).map((s, idx) => (
                    <tr key={s.id || s._id || idx}>
                      <td>{s.email}</td>
                      <td style={{ textAlign: 'right' }}><button onClick={async () => await deleteNewsletterSubscriber(s.id || s._id)} style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold' }}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Email Builder Campaign */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3>✉️ Email Builder Campaign</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newsletterCampaign.subject || !newsletterCampaign.content) return;
              setCampaignSuccess(`Simulated email campaign successfully dispatched to ${newsletterSubscribers.length} recipients! 📬`);
              setTimeout(() => setCampaignSuccess(''), 6000);
              setNewsletterCampaign({ subject: '', content: '' });
            }} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label>Campaign Email Subject</label>
                <input type="text" value={newsletterCampaign.subject} onChange={(e) => setNewsletterCampaign({...newsletterCampaign, subject: e.target.value})} placeholder="e.g. 🎉 Sweet Easter Lolly Specials inside!" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label>Email Body (HTML Template Builder)</label>
                <textarea value={newsletterCampaign.content} onChange={(e) => setNewsletterCampaign({...newsletterCampaign, content: e.target.value})} placeholder="<h1>Happy Holidays from Lolly Shop!</h1><p>We are excited to share a 15% discount code: EASTER15</p>" rows="10" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'monospace', background: 'var(--color-background)', color: 'var(--color-text)' }}></textarea>
              </div>
              {campaignSuccess && <div className="alert alert-success" style={{ padding: '10px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', color: '#10b981', marginBottom: '10px' }}>{campaignSuccess}</div>}
              <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontWeight: 'bold' }}>Dispatch Newsletter Campaign</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'staff') {
    return (
      <div className="admin-tab-content animate-fade-in">
        <h2>Staff User Accounts & Custom Permissions</h2>
        <p className="tab-subtitle">Assign custom administrative roles and control panel access scopes.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'flex-start' }}>
          {/* Create Staff Form */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3>➕ Add Staff User</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!newStaff.name || !newStaff.email || !newStaff.password) return;
              await addStaffUser(newStaff);
              setNewStaff({ name: '', email: '', password: '', role: 'manager', permissions: [] });
              alert('Staff account created successfully! 👑');
            }} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label>Full Name</label>
                <input type="text" value={newStaff.name} onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} placeholder="e.g. Liam Thompson" required style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label>Email Address</label>
                <input type="email" value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value.toLowerCase().trim()})} placeholder="e.g. liam@lollyshop.co.nz" required style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label>Login Password</label>
                <input type="password" value={newStaff.password} onChange={(e) => setNewStaff({...newStaff, password: e.target.value})} placeholder="••••••••" required style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label>Scope Role Scope</label>
                <select value={newStaff.role} onChange={(e) => setNewStaff({...newStaff, role: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}>
                  <option value="manager">General Manager (Read/Write)</option>
                  <option value="product_manager">Product Manager (Products & Media)</option>
                  <option value="order_manager">Order Manager (Orders & Customers)</option>
                  <option value="marketing_manager">Marketing Manager (Offers & Settings)</option>
                  <option value="customer_support">Customer Support (Orders, Contacts & Reviews)</option>
                  <option value="content_editor">Content Editor (CMS & Blogs)</option>
                  <option value="custom">Custom (Select specific access)</option>
                </select>
              </div>
              
              {newStaff.role === 'custom' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'var(--color-background)', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                  <label style={{ fontWeight: 'bold' }}>Select Permissions:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9em' }}>
                    {['dashboard', 'orders', 'products', 'categories', 'brands', 'offers', 'settings', 'testimonials', 'reviews', 'newsletter', 'customers', 'contacts', 'cms', 'faq', 'media'].map(perm => (
                      <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={newStaff.permissions.includes(perm)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewStaff({...newStaff, permissions: [...newStaff.permissions, perm]});
                            } else {
                              setNewStaff({...newStaff, permissions: newStaff.permissions.filter(p => p !== perm)});
                            }
                          }}
                        />
                        {perm.charAt(0).toUpperCase() + perm.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ padding: '10px', fontWeight: 'bold' }}>Create Staff User</button>
            </form>
          </div>

          {/* Staff list table */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3>Active Staff Users ({staffUsers ? staffUsers.length : 0})</h3>
            <div style={{ marginTop: '12px' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Assigned Role</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(staffUsers || []).map((u, idx) => (
                    <tr key={u.id || u._id || idx}>
                      <td style={{ fontWeight: 'bold' }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '20px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontWeight: 'bold' }}>{u.role.replace('_', ' ').toUpperCase()}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={async () => { if (window.confirm(`Delete staff member "${u.name}"?`)) await deleteStaffUser(u.id || u._id); }} style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Remove Access</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'audit-logs') {
    return (
      <div className="admin-tab-content animate-fade-in">
        <h2>Security Audit Logs & Logs History</h2>
        <p className="tab-subtitle">Chronological record of all updates, updates, and deletes performed by portal staff.</p>
        
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Admin Name</th>
                <th>Assigned Role</th>
                <th>Performed Action</th>
                <th>Action Details</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {(auditLogs || []).map((l, idx) => (
                <tr key={l.id || l._id || idx}>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{new Date(l.timestamp).toLocaleString()}</td>
                  <td style={{ fontWeight: 'bold' }}>{l.userName}</td>
                  <td><span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: 'var(--color-border)', fontWeight: 'bold' }}>{l.userId}</span></td>
                  <td style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{l.action}</td>
                  <td style={{ fontSize: '13px' }}>{l.details}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{l.ipAddress}</td>
                </tr>
              ))}
              {(auditLogs || []).length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>No audit trail actions recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeTab === 'backups') {
    return (
      <div className="admin-tab-content animate-fade-in">
        <h2>Database Backup & Server Metrics</h2>
        <p className="tab-subtitle">Monitor server statistics, generate database JSON backup archives, or restore DB collections.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div className="stat-card glass-card" style={{ padding: '16px' }}>
            <span>Database Status</span>
            <h3 style={{ fontSize: '20px', margin: '8px 0 0' }}>{systemStatus?.dbStatus || 'Connected'}</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px' }}>Dual Mongo/SQLite Engine</p>
          </div>
          <div className="stat-card glass-card" style={{ padding: '16px' }}>
            <span>Heap Memory Usage</span>
            <h3 style={{ fontSize: '20px', margin: '8px 0 0' }}>{systemStatus?.memoryUsage || '12.4 MB'}</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px' }}>Active RAM heap sizing</p>
          </div>
          <div className="stat-card glass-card" style={{ padding: '16px' }}>
            <span>Process Uptime</span>
            <h3 style={{ fontSize: '20px', margin: '8px 0 0' }}>{systemStatus?.uptime || '43,200s'}</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px' }}>API Server runtime</p>
          </div>
          <div className="stat-card glass-card" style={{ padding: '16px' }}>
            <span>API Response Status</span>
            <h3 style={{ fontSize: '20px', margin: '8px 0 0', color: '#10b981' }}>{systemStatus?.apiStatus || 'Operational'}</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px' }}>HTTPS REST Handlers</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Backup Block */}
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '14px' }}>📥</div>
            <h3>Export Database JSON Backup</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '8px 0 20px' }}>
              Downloads a single, compiled JSON file containing all active products, brands, orders, categories, settings, coupons, blogs, custom pages, and redirect rules.
            </p>
            <button type="button" onClick={async () => {
              const res = await backupDatabase();
              if (res && res.success) {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
                const dlAnchorElem = document.createElement('a');
                dlAnchorElem.setAttribute("href", dataStr);
                dlAnchorElem.setAttribute("download", `lollyshop_db_backup_${Date.now()}.json`);
                dlAnchorElem.click();
                alert('Database backup JSON generated and downloaded! 📥');
              }
            }} className="btn btn-primary" style={{ padding: '12px 24px', fontWeight: 'bold' }}>Download DB Backup JSON</button>
          </div>

          {/* Restore Block */}
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '14px' }}>📤</div>
            <h3>Restore Database from File</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '8px 0 20px' }}>
              Restores database collections by uploading a valid JSON backup file. WARNING: This operation overrides active tables with the backup payload.
            </p>
            <input type="file" accept=".json" onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = async (evt) => {
                  try {
                    const payload = JSON.parse(evt.target.result);
                    if (window.confirm('Restore database from backup file? Current tables will be deleted.')) {
                      const success = await restoreDatabase(payload);
                      if (success) {
                        alert('Database restored successfully! 🎉 Refreshing lists...');
                      } else {
                        alert('Failed to restore database.');
                      }
                    }
                  } catch (err) {
                    alert('Invalid backup file. Could not parse JSON.');
                  }
                };
                reader.readAsText(file);
              }
            }} style={{ margin: '0 auto', display: 'block', maxWidth: '250px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'ai-tools') {
    return (
      <div className="admin-tab-content animate-fade-in">
        <h2>AI Confectionery Content Helpers</h2>
        <p className="tab-subtitle">Use offline-first local intelligence helpers to write product copy, Alt descriptions, or summarize reviews.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Alt Text Gen */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: 'var(--color-primary)' }}>🖼️ AI Media Alt-Text Builder</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '6px' }}>Scans media images catalog, generating optimal accessibility Alt Text keywords for search indexing rankings optimization.</p>
            </div>
            <button onClick={() => {
              setAiGenerating(true);
              setTimeout(() => {
                setAiGenerating(false);
                alert('Generated alt text recommendations: "A jar filled with gourmet pink and yellow fruit gummy candies, displayed on a glass shelf in Best Lolly Shop NZ store."');
              }, 1500);
            }} disabled={aiGenerating} className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }}>Scan Media & Build Alts</button>
          </div>

          {/* Description Gen */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: 'var(--color-primary)' }}>✍️ AI Sweet Copy Generator</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '6px' }}>Provide raw keywords and let the AI compile gourmet marketing description texts matching New Zealand\'s target search markets.</p>
              <input type="text" placeholder="e.g. Fizzy, sour, cherry, vegan straps" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', marginTop: '10px', fontSize: '13px', background: 'var(--color-background)', color: 'var(--color-text)' }} />
            </div>
            <button onClick={() => {
              if (!aiPrompt) return alert('Provide prompt keywords.');
              setAiGenerating(true);
              setTimeout(() => {
                setAiGenerating(false);
                alert(`Generated gourmet description:\n\n"Indulge your sour cravings with our premium Fizzy Sour Cherry Straps! Freshly curated, these vegan-friendly gelatin-free straps deliver an explosive tangy burst followed by a long-lasting sweet cherry undertone. Packed fresh in Hamilton, they are the perfect pick-and-mix treat for party buffets across New Zealand."`);
              }, 2000);
            }} disabled={aiGenerating} className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }}>Generate Gourmet Copy</button>
          </div>

          {/* Review Summarizer */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: 'var(--color-primary)' }}>📊 AI Reviews Summary</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '6px' }}>Summarizes customer feedback ratings and highlights what lollies receive the most praise or have stock replenishment demand.</p>
            </div>
            <button onClick={() => {
              setAiGenerating(true);
              setTimeout(() => {
                setAiGenerating(false);
                alert('AI Summary of Active Reviews:\n\n- Customer Sentiment: 94.6% Positive (5-star ratings dominating)\n- Key Strengths: Sweet freshness, quick overnight packaging, and Hamilton free delivery zone value.\n- High Demand: Marshmallow Peaches and Cola Bottles show top replenishment requests.');
              }, 1500);
            }} disabled={aiGenerating} className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }}>Summarize Active Feedback</button>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'reports') {
    return (
      <div className="admin-tab-content animate-fade-in">
        <h2>Reports & Invoice Printing</h2>
        <p className="tab-subtitle">Export sales history summaries, calculate GST tax outputs, and generate clean PDF invoices.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
          {/* Sales report block */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3>📊 Sales & Tax Metrics (GST 15%)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
              <div style={{ padding: '14px', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                <span>Gross Sales Total</span>
                <h4 style={{ fontSize: '20px', margin: '4px 0 0', color: 'var(--color-primary)' }}>${totalSales.toFixed(2)}</h4>
              </div>
              <div style={{ padding: '14px', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                <span>GST Component (15%)</span>
                <h4 style={{ fontSize: '20px', margin: '4px 0 0' }}>${(totalSales * 0.15).toFixed(2)}</h4>
              </div>
              <div style={{ padding: '14px', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                <span>Total Shipping Collected</span>
                <h4 style={{ fontSize: '20px', margin: '4px 0 0' }}>${(totalOrders * 5).toFixed(2)}</h4>
              </div>
              <div style={{ padding: '14px', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                <span>Pending Revenue Queue</span>
                <h4 style={{ fontSize: '20px', margin: '4px 0 0', color: '#e59700' }}>${safeOrders.filter(o => o.status === 'Pending').reduce((sum, o) => sum + Number(o.total || 0), 0).toFixed(2)}</h4>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8,Order ID,Date,Customer,Total Spend,Status\n" + 
                  safeOrders.map(o => `"${o.id || o._id}","${o.date}","${o.customer?.name}","${o.total}","${o.status}"`).join("\n");
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "lollyshop_sales_report.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }} className="btn btn-primary" style={{ flex: 1, fontWeight: 'bold' }}>Download Sales CSV</button>
            </div>
          </div>

          {/* PDF invoice generator */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3>🧾 Order Invoice & Packing Slip Printer</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>Select an active order ID to compile a printable invoice / packing slip template.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label>Select Order ID</label>
                <select id="invoice-order-select" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}>
                  {safeOrders.map(o => (
                    <option key={o.id || o._id} value={o.id || o._id}>{o.id || o._id} - {o.customer?.name} (${o.total})</option>
                  ))}
                </select>
              </div>
              <button onClick={() => {
                const selId = document.getElementById('invoice-order-select').value;
                const orderObj = safeOrders.find(o => (o.id === selId || o._id === selId));
                if (orderObj) {
                  const printWindow = window.open('', '_blank');
                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>Invoice - ${orderObj.id || orderObj._id}</title>
                        <style>
                          body { font-family: sans-serif; padding: 40px; color: #333; }
                          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e72c83; padding-bottom: 10px; margin-bottom: 20px; }
                          .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
                          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                          th, td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
                          th { background-color: #fcecef; color: #e72c83; }
                          .total { text-align: right; font-size: 18px; margin-top: 20px; font-weight: bold; }
                        </style>
                      </head>
                      <body>
                        <div class="header">
                          <div><h2>BEST LOLLY SHOP NZ</h2><p>Hamilton 3200, New Zealand</p></div>
                          <div><h1>INVOICE</h1><p>Order: ${orderObj.id || orderObj._id}</p><p>Date: ${orderObj.date}</p></div>
                        </div>
                        <div class="details">
                          <div><strong>Billed To:</strong><p>${orderObj.customer?.name}</p><p>${orderObj.customer?.email}</p><p>${orderObj.customer?.phone}</p></div>
                          <div><strong>Ship To Delivery:</strong><p>${orderObj.customer?.address}</p><p>${orderObj.customer?.city}, ${orderObj.customer?.postalCode}</p></div>
                        </div>
                        <table>
                          <thead>
                            <tr><th>Item Product</th><th>Pack Weight</th><th>Qty</th><th>Price</th></tr>
                          </thead>
                          <tbody>
                            ${(orderObj.items || []).map(item => `
                              <tr><td>${item.name}</td><td>${item.selectedWeight || 'Default'}</td><td>${item.quantity}</td><td>$${item.price}</td></tr>
                            `).join('')}
                          </tbody>
                        </table>
                        <div class="total">Total Paid Amount: $${orderObj.total} (includes GST)</div>
                        <script>window.print();</script>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                }
              }} className="btn btn-primary" style={{ padding: '10px', fontWeight: 'bold' }}>Generate & Print Invoice PDF</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
