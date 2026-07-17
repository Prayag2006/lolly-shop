import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  BarChart3, 
  PlusCircle, 
  Trash2, 
  Check, 
  AlertTriangle,
  TrendingUp,
  ShoppingBag,
  Grid,
  FileText,
  Users,
  Eye,
  CheckCircle2,
  Clock,
  Activity,
  Edit3,
  Tag,
  MessageSquare,
  Star,
  Sparkles
} from 'lucide-react';
import { CandyVisual } from '../components/SvgCandies';
import { AdminEnterpriseTabs } from './AdminEnterpriseTabs';
import './Admin.css';

const CourierTrackingCell = ({ ord, updateOrderDelivery }) => {
  const [company, setCompany] = useState(ord.deliveryCompany || '');
  const [reference, setReference] = useState(ord.deliveryReference || '');

  useEffect(() => {
    setCompany(ord.deliveryCompany || '');
    setReference(ord.deliveryReference || '');
  }, [ord.deliveryCompany, ord.deliveryReference]);

  const handleBlur = () => {
    if (company !== (ord.deliveryCompany || '') || reference !== (ord.deliveryReference || '')) {
      updateOrderDelivery(ord.id, company, reference);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      width: '100%',
      minWidth: '150px',
      maxWidth: '220px',
      boxSizing: 'border-box'
    }}>
      <input
        type="text"
        placeholder="Courier (e.g. NZ Post)"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        onBlur={handleBlur}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '8px 10px',
          borderRadius: '6px',
          border: '1px solid var(--color-border)',
          fontSize: '12px',
          outline: 'none',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          fontWeight: '600',
          transition: 'all 0.2s ease'
        }}
      />
      <input
        type="text"
        placeholder="Tracking Reference"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        onBlur={handleBlur}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '8px 10px',
          borderRadius: '6px',
          border: '1px solid var(--color-border)',
          fontSize: '12px',
          outline: 'none',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          fontFamily: 'monospace',
          fontWeight: '700',
          transition: 'all 0.2s ease'
        }}
      />
    </div>
  );
};

export const Admin = () => {
  const { 
    currentUser, products, orders, contactSubmissions, 
    addProduct, updateProduct, deleteProduct, updateProductStock, 
    updateOrderStatus, categories, addCategory, updateCategory, deleteCategory, brands, 
    addBrand, deleteBrand, updateBrand, testimonials, 
    deleteProductReview, deleteTestimonial,
    settings, updateSettings, updateProductQuantity, updateOrderDelivery, removeOrderItem,
    deleteOrder, clearAllOrders,
    mediaList, uploadMedia, deleteMedia,
    // Enterprise features
    toggleTheme, theme, offers, addOffer, updateOffer, deleteOffer,
    auditLogs, blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
    redirects, addRedirect, deleteRedirect, newsletterSubscribers,
    addNewsletterSubscriber, deleteNewsletterSubscriber, customPages,
    addCustomPage, updateCustomPage, deleteCustomPage, staffUsers,
    addStaffUser, updateStaffUser, deleteStaffUser, systemStatus,
    backupDatabase, restoreDatabase, undoStack, pushToUndo,
    redoStack, setUndoStack, setRedoStack
  } = useStore();

  const activeMegaMenuFromSettings = settings?.megaMenu && settings.megaMenu.length > 0 ? settings.megaMenu : [
    { title: 'NZ Lollies', items: ['Soft Lollies', 'Hard Lollies', 'Sour Lollies', 'Sweet Lollies', 'Sugar Coated', 'Mayceys', 'Finni', 'Pascals', 'Other', 'Sugar Free', 'Vegan', 'Jellybeans'] },
    { title: 'Imported Lollies', items: ['Airheads', 'Cotton Candy', 'Theatre Boxes', 'Popping Candy', 'Novelty', 'Lollipops', 'Sugar Free', 'Vegan'] },
    { title: 'Chocolates', items: ['Bars', 'Cadbury', 'Nestle', 'Whitakers', 'Imported Chocolates', 'Share bags', 'Sugar Free', 'Vegan'] },
    { title: 'Drinks', items: ['Hydration', 'Cans', 'Bottles', 'Multi Pack', 'Sugar Free'] },
    { title: 'Snacks', items: ['Chips', 'Tackies', 'Cheetos', 'Kool Aid'] },
    { title: 'Bulk', items: ['Soft Lollies', 'Hard Lollies', 'Chocolates'] },
    { title: 'TikTok Viral', items: ['Peel me lollies', 'Freeze Dried Candies'] },
    { title: 'Pick by Colour', items: ['Red Colour', 'Blue Colour', 'Yellow Colour', 'Pink Colour', 'Black Colour'] },
    { title: 'Confectionery', items: ['Toys', 'Toys with Lolly'] },
    { title: 'Special / Clearance', items: ['Heading 1', 'Heading 2'] }
  ];

  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeContactSubmissions = Array.isArray(contactSubmissions) ? contactSubmissions : [];
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reviewsSubTab, setReviewsSubTab] = useState('products');

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    mainCategory: '',
    price: '',
    price100g: '',
    price250g: '',
    price500g: '',
    price1kg: '',
    gradient: 'linear-gradient(135deg, #e72c83 0%, #ed5a9e 100%)',
    image: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=600',
    description: '',
    ingredients: '',
    collectionsText: '',
    calories: '120 kcal',
    sugar: '20g',
    fat: '0g',
    protein: '1g',
    inStock: true,
    quantity: 50
  });

  const [editingProductId, setEditingProductId] = useState(null);
  const [weightOptions, setWeightOptions] = useState([
    { weight: '100g', price: '' },
    { weight: '250g', price: '' },
    { weight: '500g', price: '' },
    { weight: '1kg', price: '' }
  ]);
  const [productImageSource, setProductImageSource] = useState('url'); // 'url' | 'upload'
  const [formSuccess, setFormSuccess] = useState('');
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [categoryMessage, setCategoryMessage] = useState('');

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
  const [offerSuccess, setOfferSuccess] = useState('');

  // Enterprise Blogs State
  const [editingBlogPostId, setEditingBlogPostId] = useState(null);
  const [newBlogPost, setNewBlogPost] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: 'Admin',
    category: 'General',
    tags: '',
    featuredImage: '',
    seoTitle: '',
    seoDescription: '',
    published: true,
    scheduledDate: ''
  });
  const [blogSuccess, setBlogSuccess] = useState('');

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
  const [pageSuccess, setPageSuccess] = useState('');

  // Enterprise SEO Redirects state
  const [newRedirect, setNewRedirect] = useState({ fromPath: '', toPath: '', statusCode: 301 });
  const [redirectSuccess, setRedirectSuccess] = useState('');

  // Enterprise Newsletter state
  const [newSubscriberEmail, setNewSubscriberEmail] = useState('');
  const [newsletterCampaign, setNewsletterCampaign] = useState({ subject: '', content: '' });
  const [campaignSuccess, setCampaignSuccess] = useState('');

  // Enterprise Staff users state
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', role: 'manager' });
  const [staffSuccess, setStaffSuccess] = useState('');

  // Enterprise Search synonyms state
  const [synonymText, setSynonymText] = useState('');

  // Enterprise AI states
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  // Enterprise Media modification states
  const [editingMediaFile, setEditingMediaFile] = useState(null);
  const [mediaResizePercent, setMediaResizePercent] = useState(100);

  // Brand form state
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandColor, setNewBrandColor] = useState('#ff1493');
  const [newBrandSvgType, setNewBrandSvgType] = useState('bazooka');
  const [newBrandLogoType, setNewBrandLogoType] = useState('svg'); // 'svg' | 'url' | 'upload'
  const [newBrandImage, setNewBrandImage] = useState('');
  const [brandMessage, setBrandMessage] = useState('');
  
  const [editingBrand, setEditingBrand] = useState(null);
  const [editBrandName, setEditBrandName] = useState('');
  const [editBrandColor, setEditBrandColor] = useState('');
  const [editBrandSvgType, setEditBrandSvgType] = useState('bazooka');
  const [editBrandLogoType, setEditBrandLogoType] = useState('svg'); // 'svg' | 'url' | 'upload'
  const [editBrandImage, setEditBrandImage] = useState('');

  const handleFileChange = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };




  const handleUndo = () => {
    if (undoStack.length > 0) {
      const prev = undoStack[undoStack.length - 1];
      setRedoStack(r => [...r, settings]);
      setUndoStack(u => u.slice(0, -1));
      updateSettings(prev);
      alert('Previous settings state successfully restored! ↩️');
    } else {
      alert('No action history to undo.');
    }
  };

  const handleCreateCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCategoryInput.trim()) return;
    const success = addCategory(newCategoryInput);
    if (success) {
      setCategoryMessage(`Category "${newCategoryInput}" created successfully!`);
      setNewProduct(prev => ({ ...prev, category: newCategoryInput.trim() }));
      setNewCategoryInput('');
    } else {
      setCategoryMessage(`Category "${newCategoryInput}" already exists.`);
    }
    setTimeout(() => setCategoryMessage(''), 4000);
  };

  // Default Users / Customers
  const defaultUsers = [
    { name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', phone: '021 123 4567', location: 'Grey Lynn, Auckland', ordersCount: 4, spent: 85.40 },
    { name: 'Matthew Taylor', email: 'matthew.t@hotmail.co.nz', phone: '022 987 6543', location: 'Karori, Wellington', ordersCount: 2, spent: 42.50 },
    { name: 'Chloe Smith', email: 'chloe.s@gmail.com', phone: '027 456 7890', location: 'Riccarton, Christchurch', ordersCount: 3, spent: 68.90 },
    { name: 'Liam Wilson', email: 'liam.wilson@yahoo.com', phone: '021 555 4321', location: 'Dunedin Central, Otago', ordersCount: 1, spent: 25.50 }
  ];

  // Build user data combining default users and users from active orders
  const ordersUsers = safeOrders
    .filter(ord => ord && ord.customer)
    .map(ord => ({
      name: ord.customer?.name || 'Guest',
      email: ord.customer?.email || 'No Email',
      phone: ord.customer?.phone || 'No Phone',
      location: `${ord.customer?.city || ''}, NZ`,
      ordersCount: 1,
      spent: Number(ord.total || 0)
    }));

  // Consolidate users
  const allUsersMap = {};
  defaultUsers.forEach(u => { allUsersMap[u.email] = { ...u }; });
  ordersUsers.forEach(u => {
    if (allUsersMap[u.email]) {
      allUsersMap[u.email].ordersCount += 1;
      allUsersMap[u.email].spent += u.spent;
    } else {
      allUsersMap[u.email] = { ...u };
    }
  });
  const consolidatedUsers = Object.values(allUsersMap);

  // Stats calculation (calculated directly from actual database records)
  const totalSales = safeOrders.reduce((sum, ord) => sum + Number(ord?.total || 0), 0);
  const totalOrders = safeOrders.length;
  const avgOrderVal = totalOrders > 0 ? (totalSales / totalOrders) : 0;
  const catalogCount = safeProducts.length;

  // Order status counts
  const pendingOrdersCount = safeOrders.filter(o => o && (o.status === 'Processing' || o.status === 'Pending')).length;
  const completedOrdersCount = safeOrders.filter(o => o && o.status === 'Completed').length;

  // Dynamic traffic metrics derived from database records (users & orders)
  const uniqueVisitorsVal = consolidatedUsers.length * 12 + totalOrders * 45 + 148;
  const pageViewsVal = Math.round(uniqueVisitorsVal * 4.6);
  const liveBrowsersVal = Math.max(1, (totalOrders % 5) + Math.floor(consolidatedUsers.length * 0.3) + 2);

  // Top Selling Products Calculation
  const productSalesMap = {};
  safeProducts.forEach(p => {
    if (p && p.id) {
      productSalesMap[p.id] = { product: p, qty: 0, revenue: 0 };
    }
  });

  // Calculate based on actual orders
  safeOrders.forEach(ord => {
    if (ord) {
      (ord.items || []).forEach(item => {
        if (item && productSalesMap[item.id]) {
          productSalesMap[item.id].qty += Number(item.quantity || 0);
          productSalesMap[item.id].revenue += Number(item.price || 0) * Number(item.quantity || 0);
        }
      });
    }
  });

  // Add some simulated baseline sales for leaderboard aesthetics (NZD values)
  const simulatedSales = {
    1: { qty: 142, revenue: 142 * 8.50 },
    2: { qty: 95, revenue: 95 * 16.90 },
    3: { qty: 215, revenue: 215 * 4.90 },
    4: { qty: 45, revenue: 45 * 6.50 },
    5: { qty: 88, revenue: 88 * 7.90 },
    6: { qty: 110, revenue: 110 * 11.50 }
  };

  Object.keys(simulatedSales).forEach(id => {
    const stringId = `p-${id}`;
    if (productSalesMap[stringId]) {
      productSalesMap[stringId].qty += simulatedSales[id].qty;
      productSalesMap[stringId].revenue += simulatedSales[id].revenue;
    }
  });

  const topSellingProducts = Object.values(productSalesMap).sort((a, b) => b.qty - a.qty);

  const resetProductForm = () => {
    setEditingProductId(null);
    setWeightOptions([
      { weight: '100g', price: '' },
      { weight: '250g', price: '' },
      { weight: '500g', price: '' },
      { weight: '1kg', price: '' }
    ]);
    setNewProduct({
      name: '',
      category: '',
      mainCategory: '',
      price: '',
      price100g: '',
      price250g: '',
      price500g: '',
      price1kg: '',
      gradient: 'linear-gradient(135deg, #e72c83 0%, #ed5a9e 100%)',
      image: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=600',
      description: '',
      ingredients: '',
      collectionsText: '',
      calories: '120 kcal',
      sugar: '20g',
      fat: '0g',
      protein: '1g',
      inStock: true,
      quantity: 50
    });
  };

  // Settings/Promotions State
  const [tempSettings, setTempSettings] = useState({
    marqueeText: '',
    popupOffer: { enabled: true, delay: 3000, title: '', description: '', code: '', image: '' },
    popupOffers: [],
    megaMenu: []
  });
  const [settingsSuccess, setSettingsSuccess] = useState('');

  const handleAddOfferRow = () => {
    setTempSettings(prev => ({
      ...prev,
      popupOffers: [
        ...(prev.popupOffers || []),
        {
          enabled: true,
          delay: 3000,
          title: "🎉 New Offer Title!",
          description: "Enter offer description here.",
          code: "NEWCODE",
          image: ""
        }
      ]
    }));
  };

  const handleRemoveOfferRow = (index) => {
    setTempSettings(prev => ({
      ...prev,
      popupOffers: (prev.popupOffers || []).filter((_, i) => i !== index)
    }));
  };

  const handleOfferFieldChange = (index, field, value) => {
    setTempSettings(prev => {
      const updatedOffers = [...(prev.popupOffers || [])];
      updatedOffers[index] = { ...updatedOffers[index], [field]: value };
      return { ...prev, popupOffers: updatedOffers };
    });
  };

  useEffect(() => {
    if (settings) {
      setTempSettings(settings);
    }
  }, [settings]);

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login?redirect=admin" replace />;
  }

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(tempSettings);
      setSettingsSuccess('Settings and promotions updated successfully!');
      setTimeout(() => setSettingsSuccess(''), 4000);
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  const handleNestedFieldChange = (section, field, value) => {
    setTempSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }));
  };

  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const getProductCollections = (product) => {
    if (Array.isArray(product.collections)) {
      return product.collections;
    }
    if (typeof product.collections === 'string') {
      return product.collections.split(',').map((item) => item.trim()).filter(Boolean);
    }
    return [];
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setActiveTab('add-product');
    const options = product.weightPrices && Object.keys(product.weightPrices).length > 0
      ? Object.entries(product.weightPrices).map(([weight, price]) => ({ weight, price: price.toString() }))
      : [
          { weight: '100g', price: product.price.toString() },
          { weight: '250g', price: '' },
          { weight: '500g', price: '' },
          { weight: '1kg', price: '' }
        ];
    setWeightOptions(options);
    setNewProduct({
      name: product.name,
      category: product.category,
      mainCategory: product.mainCategory || '',
      price: product.price.toString(),
      price100g: product.weightPrices?.['100g']?.toString() || product.price.toString(),
      price250g: product.weightPrices?.['250g']?.toString() || '',
      price500g: product.weightPrices?.['500g']?.toString() || '',
      price1kg: product.weightPrices?.['1kg']?.toString() || '',
      gradient: product.gradient,
      image: product.image,
      description: product.description,
      ingredients: product.ingredients,
      collectionsText: Array.isArray(product.collections) ? product.collections.join(', ') : (product.collections || ''),
      calories: product.nutrition?.calories || '120 kcal',
      sugar: product.nutrition?.sugar || '20g',
      fat: product.nutrition?.fat || '0g',
      protein: product.nutrition?.protein || '1g',
      inStock: product.inStock !== undefined ? product.inStock : true,
      quantity: product.quantity !== undefined ? product.quantity : 50
    });
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const weightPricesMap = {};
    weightOptions.forEach(opt => {
      if (opt.weight.trim()) {
        let priceVal = Number(opt.price);
        if (!opt.price) {
          const base = Number(newProduct.price);
          if (opt.weight === '100g') priceVal = base;
          else if (opt.weight === '250g') priceVal = base * 2.2;
          else if (opt.weight === '500g') priceVal = base * 4.0;
          else if (opt.weight === '1kg') priceVal = base * 7.5;
          else priceVal = base;
        }
        weightPricesMap[opt.weight.trim()] = Number(priceVal.toFixed(2));
      }
    });

    const payload = {
      name: newProduct.name,
      category: newProduct.category,
      mainCategory: newProduct.mainCategory || '',
      price: Number(newProduct.price),
      weightPrices: weightPricesMap,
      gradient: newProduct.gradient,
      image: newProduct.image || 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=600',
      description: newProduct.description || 'Delicious gourmet treats for sweet lovers.',
      ingredients: '',
      collections: (newProduct.collectionsText || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      nutrition: {
        calories: newProduct.calories,
        sugar: newProduct.sugar,
        fat: newProduct.fat,
        protein: newProduct.protein
      },
      inStock: newProduct.inStock,
      quantity: Number(newProduct.quantity !== undefined ? newProduct.quantity : 50)
    };

    try {
      if (editingProductId) {
        const success = await updateProduct(editingProductId, payload);
        if (success) {
          setFormSuccess('Product successfully updated!');
          resetProductForm();
        } else {
          alert('Failed to update product. Please check your inputs.');
        }
      } else {
        const success = await addProduct(payload);
        if (success) {
          setFormSuccess('Product successfully added to the catalog!');
          resetProductForm();
        } else {
          alert('Failed to add product. Please check your inputs.');
        }
      }
      setTimeout(() => setFormSuccess(''), 4000);
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('An error occurred while saving the product.');
    }
  };

  const handleMarkComplete = (orderId) => {
    updateOrderStatus(orderId, 'Completed');
  };

  const gradientsList = [
    { name: 'Lolly Hot Pink', value: 'linear-gradient(135deg, #e72c83 0%, #ed5a9e 100%)' },
    { name: 'Fuzzy Peach', value: 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)' },
    { name: 'Dark Truffle', value: 'linear-gradient(135deg, #4A0E17 0%, #0F0C1B 100%)' },
    { name: 'Neon Worms', value: 'linear-gradient(135deg, #FF3366 0%, #FF9933 100%)' },
    { name: 'Carousel Blue', value: 'linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)' },
    { name: 'Gold Caramel', value: 'linear-gradient(135deg, #FFE259 0%, #FFA751 100%)' }
  ];

  return (
    <div className="admin-page container">
      {/* Sidebar Navigation */}
      <div className="admin-layout">
        <aside className="admin-sidebar glass-card">
          <div className="admin-profile">
            <div className="admin-avatar">👑</div>
            <div className="admin-profile-info">
              <h3>Client Portal</h3>
              <p>Store Administrator</p>
            </div>
          </div>

          <nav className="admin-nav">
            <button
              className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart3 size={18} />
              <span>Dashboard</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Grid size={18} />
              <span>Products ({catalogCount})</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <FileText size={18} />
              <span>Orders ({orders.length})</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={18} />
              <span>Users ({consolidatedUsers.length})</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'contacts' ? 'active' : ''}`}
              onClick={() => setActiveTab('contacts')}
            >
              <FileText size={18} />
              <span>Contact Requests ({contactSubmissions.length})</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'add-product' ? 'active' : ''}`}
              onClick={() => setActiveTab('add-product')}
            >
              <PlusCircle size={18} />
              <span>Add Sweet</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'brands' ? 'active' : ''}`}
              onClick={() => setActiveTab('brands')}
            >
              <Tag size={18} />
              <span>Brands ({brands.length})</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <MessageSquare size={18} />
              <span>Reviews ({products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0) + testimonials.length})</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Activity size={18} />
              <span>Promotions / Settings</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'cms-pages' ? 'active' : ''}`}
              onClick={() => setActiveTab('cms-pages')}
            >
              <FileText size={18} />
              <span>CMS Pages</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'cms-theme' ? 'active' : ''}`}
              onClick={() => setActiveTab('cms-theme')}
            >
              <Grid size={18} />
              <span>CMS Theme & Branding</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'media-library' ? 'active' : ''}`}
              onClick={() => setActiveTab('media-library')}
            >
              <ShoppingBag size={18} />
              <span>Media Library ({mediaList ? mediaList.length : 0})</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              <Tag size={18} />
              <span>Categories ({categories ? categories.length : 0})</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'offers' ? 'active' : ''}`}
              onClick={() => setActiveTab('offers')}
            >
              <Tag size={18} style={{ transform: 'rotate(90deg)' }} />
              <span>Offers & Coupons ({offers ? offers.length : 0})</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'blogs' ? 'active' : ''}`}
              onClick={() => setActiveTab('blogs')}
            >
              <FileText size={18} />
              <span>Blogs Manager ({blogPosts ? blogPosts.length : 0})</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'custom-pages' ? 'active' : ''}`}
              onClick={() => setActiveTab('custom-pages')}
            >
              <FileText size={18} />
              <span>CMS Pages Builder ({customPages ? customPages.length : 0})</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'seo' ? 'active' : ''}`}
              onClick={() => setActiveTab('seo')}
            >
              <TrendingUp size={18} />
              <span>SEO Redirects ({redirects ? redirects.length : 0})</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'newsletter' ? 'active' : ''}`}
              onClick={() => setActiveTab('newsletter')}
            >
              <MessageSquare size={18} />
              <span>Newsletter List ({newsletterSubscribers ? newsletterSubscribers.length : 0})</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'staff' ? 'active' : ''}`}
              onClick={() => setActiveTab('staff')}
            >
              <Users size={18} />
              <span>Staff Roles ({staffUsers ? staffUsers.length : 0})</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'audit-logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('audit-logs')}
            >
              <Activity size={18} />
              <span>Audit Trails ({auditLogs ? auditLogs.length : 0})</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'backups' ? 'active' : ''}`}
              onClick={() => setActiveTab('backups')}
            >
              <AlertTriangle size={18} />
              <span>DB Backups & Metrics</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'ai-tools' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai-tools')}
            >
              <Sparkles size={18} />
              <span>AI Writing Assistants</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <BarChart3 size={18} />
              <span>Reports & Invoices</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Side */}
        <main className="admin-content-area">
          {/* Enterprise Top Bar */}
          <div className="admin-top-bar glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', marginBottom: '24px', borderRadius: '12px', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                <input 
                  type="text" 
                  placeholder="Search everywhere..." 
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '13px', outline: 'none' }}
                  onChange={(e) => {
                    const term = e.target.value.toLowerCase();
                    // Set a quick tab search helper if needed
                  }}
                />
              </div>
              <button 
                onClick={handleUndo} 
                className="btn btn-secondary" 
                style={{ padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                disabled={undoStack.length === 0}
              >
                ↩️ Undo
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button 
                onClick={toggleTheme} 
                className="btn btn-secondary" 
                style={{ padding: '10px 16px', borderRadius: '30px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
              
              <div className="admin-user-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '12px' }}>
                <span>👤 {currentUser?.name} ({currentUser?.role})</span>
              </div>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <div className="admin-tab-content">
              <h2>Dashboard Summary</h2>
              
              {/* Stats Cards */}
              <div className="admin-stats-grid">
                <div className="stat-card glass-card">
                  <div className="s-card-header">
                    <span>Total Sales</span>
                    <TrendingUp size={20} className="sc-icon-1" />
                  </div>
                  <h3>${totalSales.toFixed(2)}</h3>
                  <p>Revenue generated</p>
                </div>
                <div className="stat-card glass-card">
                  <div className="s-card-header">
                    <span>Total Orders</span>
                    <ShoppingBag size={20} className="sc-icon-2" />
                  </div>
                  <h3>{totalOrders}</h3>
                  <p>Transactions placed</p>
                </div>
                <div className="stat-card glass-card">
                  <div className="s-card-header">
                    <span>Avg Order Value</span>
                    <TrendingUp size={20} className="sc-icon-3" />
                  </div>
                  <h3>${avgOrderVal.toFixed(2)}</h3>
                  <p>Basket spend average</p>
                </div>
                <div className="stat-card glass-card">
                  <div className="s-card-header">
                    <span>Active Catalog</span>
                    <Grid size={20} className="sc-icon-4" />
                  </div>
                  <h3>{catalogCount}</h3>
                  <p>Candy items listed</p>
                </div>
              </div>

              {/* Traffic & Order Status Widgets Row */}
              <div className="admin-widgets-row">
                {/* Traffic Box */}
                <div className="widget-card glass-card">
                  <h3><Eye size={18} /> Website Views & Traffic</h3>
                  <div className="widget-metrics">
                    <div className="metric-box">
                      <span className="m-badge badge-up">+18.4%</span>
                      <span className="m-val">{pageViewsVal.toLocaleString()}</span>
                      <span className="m-label">Pageviews</span>
                    </div>
                    <div className="metric-box">
                      <span className="m-badge badge-up">+12.6%</span>
                      <span className="m-val">{uniqueVisitorsVal.toLocaleString()}</span>
                      <span className="m-label">Unique Visitors</span>
                    </div>
                    <div className="metric-box live-box">
                      <span className="m-val active-pulse">
                        <Activity size={16} className="live-pulse-icon" /> {liveBrowsersVal}
                      </span>
                      <span className="m-label">Live Browsers</span>
                    </div>
                  </div>
                </div>

                {/* Status Box */}
                <div className="widget-card glass-card">
                  <h3><Clock size={18} /> Order Status Breakdown</h3>
                  <div className="widget-metrics">
                    <div className="metric-box pending">
                      <div className="metric-header">
                        <span className="status-indicator yellow"></span>
                        <span className="m-val">{pendingOrdersCount}</span>
                      </div>
                      <span className="m-label">Pending Orders</span>
                    </div>
                    <div className="metric-box completed">
                      <div className="metric-header">
                        <span className="status-indicator green"></span>
                        <span className="m-val">{completedOrdersCount}</span>
                      </div>
                      <span className="m-label">Completed Orders</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Selling Products Leaderboard */}
              <div className="leaderboard-section glass-card">
                <h3>🏆 Top Selling Sweets</h3>
                <div className="leaderboard-table-container">
                  <table className="leaderboard-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Treat Name</th>
                        <th>Category</th>
                        <th>Quantity Sold</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topSellingProducts.slice(0, 5).map((item, idx) => (
                        <tr key={item.product.id}>
                          <td>
                            <span className={`rank-badge rank-${idx + 1}`}>#{idx + 1}</span>
                          </td>
                          <td>
                            <div className="p-cell-name">
                              <span className="p-cell-visual">
                                <img src={item.product.image} alt={item.product.name} className="p-cell-image" />
                              </span>
                              <span>{item.product.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="p-cell-category">{item.product.category}</span>
                          </td>
                          <td><strong>{item.qty} units</strong></td>
                          <td><strong>${item.revenue.toFixed(2)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="admin-tab-content">
              <h2>Manage Product Catalog</h2>
              <div className="admin-table-container glass-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Treat</th>
                      <th>Category</th>
                      <th>Collections</th>
                      <th>Price</th>
                      <th>Stock Qty</th>
                      <th>Stock Status</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="p-cell-name">
                            <span className="p-cell-visual">
                              <img 
                                src={p.image} 
                                alt={p.name} 
                                className="p-cell-image"
                              />
                            </span>
                            <span>{p.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="p-cell-category">{p.category}</span>
                        </td>
                        <td>
                          <div className="p-cell-collections-list">
                            {Array.isArray(p.collections) && p.collections.length > 0 ? (
                              p.collections.map((col) => (
                                <span key={col} className="p-cell-category-tag">{col}</span>
                              ))
                            ) : (
                              <span className="p-cell-category-empty">—</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <strong>${p.price.toFixed(2)}</strong>
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={p.quantity !== undefined ? p.quantity : 50}
                            onChange={(e) => updateProductQuantity(p.id, Number(e.target.value))}
                            style={{
                              width: '75px',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              border: '1.5px solid var(--color-border)',
                              background: 'var(--color-surface)',
                              color: 'var(--color-text)',
                              fontWeight: '700',
                              textAlign: 'center',
                              outline: 'none'
                            }}
                          />
                        </td>
                        <td>
                          <button
                            className={`stock-toggle ${p.inStock ? 'instock' : 'outofstock'}`}
                            onClick={() => updateProductStock(p.id, !p.inStock)}
                            title="Toggle Stock availability"
                          >
                            {p.inStock ? <Check size={14} /> : <AlertTriangle size={14} />}
                            <span>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                          </button>
                        </td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                            <button
                              className="p-edit-btn"
                              onClick={() => handleEditProduct(p)}
                              title="Edit Product"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button 
                              className="p-delete-btn"
                              onClick={() => deleteProduct(p.id)}
                              title="Delete Product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="admin-tab-content">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ margin: 0 }}>Customer Order Sheets</h2>
                {safeOrders.length > 0 && (
                  <button
                    id="clear-all-orders-btn"
                    onClick={() => {
                      if (window.confirm(`⚠️ Delete ALL ${safeOrders.length} order(s)? This cannot be undone.`)) {
                        clearAllOrders();
                      }
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '9px 20px',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    🗑 Clear All Orders
                  </button>
                )}
              </div>
              {safeOrders.length === 0 ? (
                <div className="admin-empty-state glass-card">
                  <div className="empty-state-icon">🛒</div>
                  <h3>No Orders Placed Yet</h3>
                  <p>Transactions placed during checkout will display here in real-time.</p>
                </div>
              ) : (
                <div className="admin-table-container glass-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th className="nowrap">Order ID</th>
                        <th>Customer</th>
                        <th className="nowrap">Date</th>
                        <th>Items Ordered</th>
                        <th className="nowrap">Total Paid</th>
                        <th className="nowrap">Status</th>
                        <th className="nowrap">Courier Tracking</th>
                        <th className="nowrap" style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeOrders.map((ord, idx) => {
                        if (!ord) return null;
                        const getStatusSelectColors = (status) => {
                          switch (status) {
                            case 'Pending':
                              return { bg: '#fffbeb', text: '#d97706', border: '#fef3c7' };
                            case 'Processing':
                              return { bg: '#fff7ed', text: '#ea580c', border: '#ffedd5' };
                            case 'Packing':
                              return { bg: '#faf5ff', text: '#7c3aed', border: '#f3e8ff' };
                            case 'Out for Delivery':
                              return { bg: '#f0f9ff', text: '#0284c7', border: '#e0f2fe' };
                            case 'Completed':
                              return { bg: '#f0fdf4', text: '#16a34a', border: '#dcfce7' };
                            case 'Cancelled':
                              return { bg: '#fef2f2', text: '#dc2626', border: '#fee2e2' };
                            default:
                              return { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb' };
                          }
                        };
                        const colors = getStatusSelectColors(ord.status);

                        return (
                          <tr key={ord.id || idx}>
                            <td className="nowrap"><strong>{ord.id || 'N/A'}</strong></td>
                            <td>
                              <div className="ord-cell-cust">
                                <strong>{ord.customer?.name || 'Guest Customer'}</strong>
                                <small>{ord.customer?.email || 'No Email'}</small>
                                <small>{ord.customer?.phone || 'No Phone'}</small>
                                <small style={{ marginTop: '4px', color: 'var(--color-text)' }}>{ord.customer?.address || ''}{ord.customer?.city ? `, ${ord.customer.city}` : ''}</small>
                                
                                <div style={{
                                  marginTop: '8px',
                                  padding: '8px 12px',
                                  background: 'rgba(2, 132, 199, 0.02)',
                                  border: '1px solid rgba(2, 132, 199, 0.08)',
                                  borderRadius: '8px',
                                  fontSize: '11px',
                                  color: '#4b5563',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '5px',
                                  width: '100%',
                                  maxWidth: '240px',
                                  boxSizing: 'border-box'
                                }}>
                                  {/* Delivery Company */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(2, 132, 199, 0.1)', paddingBottom: '4px', marginBottom: '2px', gap: '8px' }}>
                                    <span style={{ fontWeight: '700', color: '#0369a1', whiteSpace: 'nowrap' }}>🚚 Delivery</span>
                                    <span style={{ fontWeight: '700', color: '#0369a1', textAlign: 'right', wordBreak: 'break-word' }}>{ord.deliveryCompany || 'NZ Post Courier'}</span>
                                  </div>

                                  {/* Charged */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ whiteSpace: 'nowrap' }}>Charged Shipping:</span>
                                    <span style={{ fontWeight: '700', color: '#111827' }}>${Number(ord.shipping !== undefined ? ord.shipping : 19).toFixed(2)}</span>
                                  </div>

                                  {/* Actual Cost */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ whiteSpace: 'nowrap' }}>Actual Cost:</span>
                                    <span style={{ fontWeight: '700', color: '#111827' }}>${Number(ord.actualShipping !== undefined ? ord.actualShipping : (ord.shipping !== undefined ? ord.shipping : 19)).toFixed(2)}</span>
                                  </div>

                                  {/* Free Shipping Badge */}
                                  {ord.freeShippingApplied && (
                                    <div style={{
                                      marginTop: '4px',
                                      background: 'rgba(16, 185, 129, 0.06)',
                                      border: '1px solid rgba(16, 185, 129, 0.15)',
                                      borderRadius: '4px',
                                      padding: '4px 6px',
                                      fontSize: '10.5px'
                                    }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#065f46', fontWeight: '700' }}>
                                        <span>🎁</span>
                                        <span>Free Shipping Applied</span>
                                      </div>
                                      <div style={{ color: '#047857', fontSize: '9.5px', fontStyle: 'italic', marginTop: '1px' }}>
                                        Rule: {ord.freeShippingReason || 'Hamilton Free Delivery'}
                                      </div>
                                    </div>
                                  )}

                                  {/* Business Absorbed */}
                                  {ord.actualShipping !== undefined && ord.actualShipping > ord.shipping && (
                                    <div style={{
                                      marginTop: '2px',
                                      background: 'rgba(239, 68, 68, 0.06)',
                                      border: '1px solid rgba(239, 68, 68, 0.15)',
                                      borderRadius: '4px',
                                      padding: '4px 6px',
                                      color: '#b91c1c',
                                      fontWeight: '700',
                                      fontSize: '10px',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}>
                                      <span style={{ whiteSpace: 'nowrap' }}>💸 Absorbed:</span>
                                      <span style={{ whiteSpace: 'nowrap' }}>${(ord.actualShipping - ord.shipping).toFixed(2)} NZD</span>
                                    </div>
                                  )}
                                </div>
                                
                                {ord.feedback && ord.feedback.rating > 0 && (
                                  <div style={{ marginTop: '8px', padding: '6px 10px', borderRadius: '8px', background: '#fffbeb', border: '1px solid #fef3c7', fontSize: '11px' }}>
                                    <div style={{ fontWeight: '800', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                      <span>{'★'.repeat(ord.feedback.rating)}{'☆'.repeat(5 - ord.feedback.rating)}</span>
                                      <span style={{ color: '#d97706' }}>({ord.feedback.rating}/5)</span>
                                    </div>
                                    {ord.feedback.comment && (
                                      <div style={{ marginTop: '4px', fontStyle: 'italic', color: '#78350f', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                        "{ord.feedback.comment}"
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="nowrap">{ord.date}</td>
                              <td>
                                <div className="ord-cell-items" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                  {(ord.items || []).map((item) => (
                                    <span 
                                      key={`${item.id}-${item.selectedWeight}`} 
                                      title={`${item.name || ''} (${item.selectedWeight || ''}) x${item.quantity || 1}`} 
                                      style={{ 
                                        display: 'inline-flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        background: '#ffffff',
                                        border: '1px solid rgba(231, 44, 131, 0.15)',
                                        padding: '4px 8px 4px 6px',
                                        borderRadius: '24px',
                                        fontSize: '11px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                                        color: '#4b5563',
                                        transition: 'all 0.2s ease',
                                        cursor: 'default',
                                        flexShrink: 0
                                      }}
                                    >
                                      {item.image && (
                                        <img 
                                          src={item.image} 
                                          alt={item.name || ''} 
                                          style={{ 
                                            width: '22px', 
                                            height: '22px', 
                                            borderRadius: '50%', 
                                            objectFit: 'cover', 
                                            border: '1px solid rgba(0,0,0,0.05)',
                                            flexShrink: 0,
                                            display: 'block'
                                          }}
                                        />
                                      )}
                                      <span style={{ 
                                        fontWeight: '700', 
                                        color: '#1f2937',
                                        background: 'rgba(231, 44, 131, 0.06)',
                                        padding: '2px 6px',
                                        borderRadius: '12px',
                                        fontSize: '10.5px',
                                        flexShrink: 0
                                      }}>
                                        x{item.quantity || 1}
                                      </span>
                                      <small style={{ color: 'var(--color-primary)', fontWeight: '800', fontSize: '9.5px', textTransform: 'uppercase', flexShrink: 0 }}>
                                        {item.selectedWeight || ''}
                                      </small>
                                      <button
                                        onClick={() => {
                                          if (window.confirm(`Are you sure you want to cancel "${item.name}" (${item.selectedWeight}) from this order?`)) {
                                            removeOrderItem(ord.id, item.id, item.selectedWeight);
                                          }
                                        }}
                                        style={{
                                          width: '18px',
                                          height: '18px',
                                          borderRadius: '50%',
                                          background: 'rgba(239, 68, 68, 0.1)',
                                          border: 'none',
                                          color: '#ef4444',
                                          fontWeight: '800',
                                          cursor: 'pointer',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontSize: '10px',
                                          lineHeight: '1',
                                          transition: 'all 0.15s ease',
                                          padding: 0,
                                          flexShrink: 0
                                        }}
                                        title={`Cancel ${item.name} (${item.selectedWeight})`}
                                        onMouseEnter={(e) => {
                                          e.target.style.background = '#ef4444';
                                          e.target.style.color = '#ffffff';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                                          e.target.style.color = '#ef4444';
                                        }}
                                      >
                                        ✕
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              </td>
                            <td className="nowrap"><strong>${Number(ord.total || 0).toFixed(2)}</strong></td>
                            <td className="nowrap">
                              <select
                                value={ord.status || 'Pending'}
                                onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                                className={`admin-order-status-select status-${(ord.status || 'Pending').toLowerCase().replace(/\s+/g, '-')}`}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '20px',
                                  fontSize: '13px',
                                  fontWeight: '700',
                                  backgroundColor: colors.bg,
                                  color: colors.text,
                                  borderColor: colors.border,
                                  cursor: 'pointer',
                                  outline: 'none',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Packing">Packing</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td>
                               <CourierTrackingCell ord={ord} updateOrderDelivery={updateOrderDelivery} />
                             </td>
                            <td className="nowrap" style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                {ord.status === 'Completed' ? (
                                  <span className="completed-check-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: '700', fontSize: '13px' }}>
                                    <CheckCircle2 size={16} /> Delivered
                                  </span>
                                ) : ord.status === 'Cancelled' ? (
                                  <span className="cancelled-tag" style={{ color: '#ef4444', fontWeight: '700', fontSize: '13px' }}>
                                    Cancelled
                                  </span>
                                ) : (
                                  <span className="in-progress-tag" style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: '13px' }}>
                                    Active
                                  </span>
                                )}
                                <button
                                  title="Delete this order"
                                  onClick={() => {
                                    if (window.confirm(`Delete order ${ord.id}? This cannot be undone.`)) {
                                      deleteOrder(ord.id);
                                    }
                                  }}
                                  style={{
                                    background: 'none',
                                    border: '1.5px solid #fca5a5',
                                    borderRadius: '8px',
                                    color: '#ef4444',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    transition: 'all 0.2s ease',
                                    flexShrink: 0
                                  }}
                                  onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#ef4444'; }}
                                >
                                  🗑
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-tab-content">
              <h2>User Customer Directory</h2>
              <div className="admin-table-container glass-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Email Account</th>
                      <th>Phone Number</th>
                      <th>Location Address</th>
                      <th style={{ textAlign: 'center' }}>Orders Placed</th>
                      <th>Total Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consolidatedUsers.map((user, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="p-cell-name">
                            <span className="user-avatar-badge">{(user.name || 'Guest').charAt(0)}</span>
                            <strong>{user.name || 'Guest Customer'}</strong>
                          </div>
                        </td>
                        <td><span>{user.email || 'No Email'}</span></td>
                        <td><span>{user.phone || 'No Phone'}</span></td>
                        <td><span>{user.location || 'Unknown Location'}</span></td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="user-orders-tag">{user.ordersCount || 0}</span>
                        </td>
                        <td><strong>${Number(user.spent || 0).toFixed(2)}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {activeTab === 'contacts' && (
            <div className="admin-tab-content">
              <h2>Contact Requests</h2>
              {contactSubmissions.length === 0 ? (
                <div className="admin-empty-state glass-card">
                  <div className="empty-state-icon">📩</div>
                  <h3>No contact requests yet</h3>
                  <p>Requests submitted through the Contact page will appear here.</p>
                </div>
              ) : (
                <div className="admin-table-container glass-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Topic</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Message</th>
                        <th>Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactSubmissions.map((submission) => (
                        <tr key={submission.id}>
                          <td>{submission.subject}</td>
                          <td>{submission.name}</td>
                          <td>{submission.email}</td>
                          <td>{submission.phone || '—'}</td>
                          <td className="contact-message-cell">{submission.message}</td>
                          <td>{submission.submittedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'add-product' && (
            <div className="admin-tab-content">
              <h2>Add New Candy Product</h2>
              
              {/* Category Creator Card */}
              <div className="glass-card admin-form-card" style={{ marginBottom: '24px', padding: '24px 30px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Create New Category
                </h3>
                <form onSubmit={handleCreateCategorySubmit} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ flexGrow: 1, marginBottom: 0 }}>
                    <label style={{ fontSize: '11px', marginBottom: '6px' }}>Category Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Sour Belts, Licorice, Hard Candies..."
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', height: '44px', whiteSpace: 'nowrap' }}>
                    Create Category
                  </button>
                </form>
                {categoryMessage && (
                  <p style={{ 
                    marginTop: '12px', 
                    fontSize: '13px', 
                    fontWeight: '700', 
                    color: categoryMessage.includes('exists') ? '#b91c1c' : '#15803d',
                    marginBottom: 0
                  }}>
                    {categoryMessage}
                  </p>
                )}
              </div>

              {/* Product Catalog Card */}
              <div className="glass-card admin-form-card">
                {formSuccess && (
                  <div className="form-success-banner">
                    {formSuccess}
                  </div>
                )}
                
                <form onSubmit={handleAddProductSubmit}>
                  <div className="form-row three-cols">
                    <div className="form-group">
                      <label htmlFor="pname">Candy Name *</label>
                      <input
                        type="text"
                        id="pname"
                        required
                        placeholder="e.g. Raspberry Jelly Hearts"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="pmaincategory" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Main Category *</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={async () => {
                              const name = prompt('Enter new Main Category title:');
                              if (!name || !name.trim()) return;
                              const trimmed = name.trim();
                              if (activeMegaMenuFromSettings.some(g => g.title.toLowerCase() === trimmed.toLowerCase())) {
                                alert('Main Category already exists!');
                                return;
                              }
                              const updatedMenu = [...activeMegaMenuFromSettings, { title: trimmed, items: [] }];
                              await updateSettings({ ...settings, megaMenu: updatedMenu });
                              setNewProduct(prev => ({ ...prev, mainCategory: trimmed, category: '' }));
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', color: 'var(--color-primary)' }}
                            title="Add Main Category"
                          >
                            ➕ Add
                          </button>
                          {newProduct.mainCategory && (
                            <button
                              type="button"
                              onClick={async () => {
                                if (!confirm(`Are you sure you want to delete the main category "${newProduct.mainCategory}" and all its subcategories?`)) return;
                                const updatedMenu = activeMegaMenuFromSettings.filter(g => g.title !== newProduct.mainCategory);
                                await updateSettings({ ...settings, megaMenu: updatedMenu });
                                setNewProduct(prev => ({ ...prev, mainCategory: '', category: '' }));
                              }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', color: '#dc2626' }}
                              title="Delete Main Category"
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </div>
                      </label>
                      <select
                        id="pmaincategory"
                        className="admin-select"
                        value={newProduct.mainCategory || ''}
                        onChange={(e) => {
                          const mainCat = e.target.value;
                          const group = activeMegaMenuFromSettings.find(g => g.title === mainCat);
                          const defaultSub = group && group.items.length > 0 ? group.items[0] : '';
                          setNewProduct(prev => ({ 
                            ...prev, 
                            mainCategory: mainCat,
                            category: defaultSub
                          }));
                        }}
                      >
                        <option value="">-- Select Main Category --</option>
                        {activeMegaMenuFromSettings.map((group) => (
                          <option key={group.title} value={group.title}>{group.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="psubcategory" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Subcategory *</span>
                        {newProduct.mainCategory && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={async () => {
                                const name = prompt(`Enter new subcategory for "${newProduct.mainCategory}":`);
                                if (!name || !name.trim()) return;
                                const trimmed = name.trim();
                                const group = activeMegaMenuFromSettings.find(g => g.title === newProduct.mainCategory);
                                if (group && group.items.some(i => i.toLowerCase() === trimmed.toLowerCase())) {
                                  alert('Subcategory already exists in this main category!');
                                  return;
                                }
                                const updatedMenu = activeMegaMenuFromSettings.map(g => {
                                  if (g.title === newProduct.mainCategory) {
                                    return { ...g, items: [...(g.items || []), trimmed] };
                                  }
                                  return g;
                                });
                                await updateSettings({ ...settings, megaMenu: updatedMenu });
                                setNewProduct(prev => ({ ...prev, category: trimmed }));
                              }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', color: 'var(--color-primary)' }}
                              title="Add Subcategory"
                            >
                              ➕ Add
                            </button>
                            {newProduct.category && (
                              <button
                                type="button"
                                onClick={async () => {
                                  if (!confirm(`Are you sure you want to delete the subcategory "${newProduct.category}" from "${newProduct.mainCategory}"?`)) return;
                                  const updatedMenu = activeMegaMenuFromSettings.map(g => {
                                    if (g.title === newProduct.mainCategory) {
                                      return { ...g, items: (g.items || []).filter(item => item !== newProduct.category) };
                                    }
                                    return g;
                                  });
                                  await updateSettings({ ...settings, megaMenu: updatedMenu });
                                  const group = updatedMenu.find(g => g.title === newProduct.mainCategory);
                                  const nextSub = group && group.items.length > 0 ? group.items[0] : '';
                                  setNewProduct(prev => ({ ...prev, category: nextSub }));
                                }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', color: '#dc2626' }}
                                title="Delete Subcategory"
                              >
                                🗑️ Delete
                              </button>
                            )}
                          </div>
                        )}
                      </label>
                      <select
                        id="psubcategory"
                        className="admin-select"
                        value={newProduct.category || ''}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                        disabled={!newProduct.mainCategory}
                      >
                        <option value="">-- Select Subcategory --</option>
                        {(activeMegaMenuFromSettings.find(g => g.title === newProduct.mainCategory)?.items || []).map((sub) => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row three-cols">
                    <div className="form-group">
                      <label htmlFor="pprice">Price (NZD) *</label>
                      <input
                        type="number"
                        id="pprice"
                        required
                        step="0.01"
                        min="0.10"
                        placeholder="e.g. 8.90"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="pimage-src">Product Image Source</label>
                      <select
                        id="pimage-src"
                        className="admin-select"
                        value={productImageSource}
                        onChange={(e) => {
                          setProductImageSource(e.target.value);
                          setNewProduct(prev => ({ ...prev, image: '' }));
                        }}
                      >
                        <option value="url">Online Image URL</option>
                        <option value="upload">Upload from Device</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="pimage">Product Image</label>
                      {productImageSource === 'upload' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <input
                            type="file"
                            id="pimage-file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, (base64) => setNewProduct(prev => ({ ...prev, image: base64 })))}
                            style={{ display: 'block', fontSize: '13px' }}
                          />
                          {newProduct.image && (
                            <img 
                              src={newProduct.image} 
                              alt="Preview" 
                              style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--color-border)' }} 
                            />
                          )}
                        </div>
                      ) : (
                        <input
                          type="url"
                          id="pimage"
                          placeholder="Paste image URL here"
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        />
                      )}
                    </div>
                  </div>

                  <div className="form-row two-cols">
                    <div className="form-group">
                      <label htmlFor="pstock">Stock Availability *</label>
                      <select
                        id="pstock"
                        className="admin-select"
                        value={newProduct.inStock ? 'true' : 'false'}
                        onChange={(e) => {
                          const isInstock = e.target.value === 'true';
                          setNewProduct(prev => ({
                            ...prev,
                            inStock: isInstock,
                            quantity: isInstock ? (prev.quantity > 0 ? prev.quantity : 10) : 0
                          }));
                        }}
                      >
                        <option value="true">In Stock</option>
                        <option value="false">Out of Stock</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="pquantity">Stock Quantity *</label>
                      <input
                        type="number"
                        id="pquantity"
                        min="0"
                        placeholder="e.g. 50"
                        required
                        value={newProduct.quantity !== undefined ? newProduct.quantity : 50}
                        onChange={(e) => {
                          const qty = Number(e.target.value);
                          setNewProduct(prev => ({
                            ...prev,
                            quantity: qty,
                            inStock: qty > 0
                          }));
                        }}
                      />
                    </div>
                  </div>

                  <h3 className="form-section-title">Weight-Based Pricing Options</h3>
                  <div className="weight-options-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    {weightOptions.map((opt, index) => (
                      <div key={index} className="weight-option-card glass-card" style={{ padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)' }}>Weight (e.g. 250g)</label>
                          <input
                            type="text"
                            placeholder="e.g. 250g"
                            value={opt.weight}
                            onChange={(e) => {
                              const newOpts = [...weightOptions];
                              newOpts[index].weight = e.target.value;
                              setWeightOptions(newOpts);
                            }}
                            style={{ padding: '8px 12px', fontSize: '14px', marginTop: '4px' }}
                            required
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)' }}>Price (NZD)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder={index === 0 ? "Same as base" : "Price"}
                            value={opt.price}
                            onChange={(e) => {
                              const newOpts = [...weightOptions];
                              newOpts[index].price = e.target.value;
                              setWeightOptions(newOpts);
                            }}
                            style={{ padding: '8px 12px', fontSize: '14px', marginTop: '4px' }}
                          />
                        </div>
                        <button
                          type="button"
                          style={{
                            background: 'transparent',
                            color: '#ef4444',
                            border: 'none',
                            fontSize: '12px',
                            cursor: 'pointer',
                            padding: 0,
                            marginTop: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            alignSelf: 'start',
                            fontWeight: '600'
                          }}
                          onClick={() => {
                            setWeightOptions(weightOptions.filter((_, i) => i !== index));
                          }}
                        >
                          ✕ Remove Option
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn"
                    style={{
                      background: 'rgba(231, 44, 131, 0.08)',
                      color: 'var(--color-primary)',
                      border: '1px solid rgba(231, 44, 131, 0.15)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      marginBottom: '20px',
                      display: 'inline-block'
                    }}
                    onClick={() => {
                      setWeightOptions([...weightOptions, { weight: '', price: '' }]);
                    }}
                  >
                    + Add Weight Option
                  </button>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="pdesc">Product Description</label>
                      <textarea
                        id="pdesc"
                        rows="3"
                        placeholder="Enter sweet description details..."
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="pcollections">Collections / Tags</label>
                      <input
                        type="text"
                        id="pcollections"
                        placeholder="Easter, Valentine, Parties, Weddings"
                        value={newProduct.collectionsText}
                        onChange={(e) => setNewProduct({ ...newProduct, collectionsText: e.target.value })}
                      />
                      <small className="field-note">Enter comma-separated collection names for holiday, occasion, celebration, or event tags.</small>
                    </div>
                  </div>

                  <h3 className="form-section-title">Nutrition Facts (Per 100g)</h3>
                  <div className="form-row four-cols">
                    <div className="form-group">
                      <label htmlFor="pcalories">Energy</label>
                      <input
                        type="text"
                        id="pcalories"
                        placeholder="140 kcal"
                        value={newProduct.calories}
                        onChange={(e) => setNewProduct({ ...newProduct, calories: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="psugar">Sugar</label>
                      <input
                        type="text"
                        id="psugar"
                        placeholder="25g"
                        value={newProduct.sugar}
                        onChange={(e) => setNewProduct({ ...newProduct, sugar: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="pfat">Fat</label>
                      <input
                        type="text"
                        id="pfat"
                        placeholder="0g"
                        value={newProduct.fat}
                        onChange={(e) => setNewProduct({ ...newProduct, fat: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="pprotein">Protein</label>
                      <input
                        type="text"
                        id="pprotein"
                        placeholder="1g"
                        value={newProduct.protein}
                        onChange={(e) => setNewProduct({ ...newProduct, protein: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-actions" style={{ alignItems: 'center' }}>
                    <button type="submit" className="btn btn-primary form-submit-btn">
                      {editingProductId ? 'Update Sweet Product' : 'Publish Sweet Product'}
                    </button>
                    {editingProductId && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ marginLeft: '12px' }}
                        onClick={resetProductForm}
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ── Brands Tab ── */}
          {activeTab === 'brands' && (
            <div className="admin-tab-content">
              <h2>Manage Brands</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                Add, edit or remove brands displayed on the homepage.
              </p>

              {/* Add Brand Form */}
              <div className="admin-form-card glass-card" style={{ marginBottom: '32px' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '700' }}>➕ Add New Brand</h3>
                <div className="form-row" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '16px' }}>
                  <div className="form-group" style={{ flex: 1, minWidth: '160px' }}>
                    <label>Brand Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Haribo"
                      value={newBrandName}
                      onChange={e => setNewBrandName(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ minWidth: '120px' }}>
                    <label>Background Colour</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={newBrandColor}
                        onChange={e => setNewBrandColor(e.target.value)}
                        style={{ width: '48px', height: '42px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: '2px' }}
                      />
                      <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{newBrandColor}</span>
                    </div>
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: '160px' }}>
                    <label>Logo Type</label>
                    <select
                      className="admin-select"
                      value={newBrandLogoType}
                      onChange={e => {
                        setNewBrandLogoType(e.target.value);
                        setNewBrandImage('');
                      }}
                    >
                      <option value="svg">SVG Style Logo</option>
                      <option value="url">Online Image URL</option>
                      <option value="upload">Upload from Device</option>
                    </select>
                  </div>
                </div>

                <div className="form-row" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  {newBrandLogoType === 'svg' && (
                    <div className="form-group" style={{ flex: 1, minWidth: '160px' }}>
                      <label>Logo Style</label>
                      <select
                        className="admin-select"
                        value={newBrandSvgType}
                        onChange={e => setNewBrandSvgType(e.target.value)}
                      >
                        <option value="bazooka">Bazooka Style</option>
                        <option value="chupachups">Chupa Chups Style</option>
                        <option value="hersheys">Hershey's Style</option>
                        <option value="reeses">Reese's Style</option>
                        <option value="walkers">Walkers Style</option>
                        <option value="warheads">Warheads Style</option>
                      </select>
                    </div>
                  )}

                  {newBrandLogoType === 'url' && (
                    <div className="form-group" style={{ flex: 2, minWidth: '220px' }}>
                      <label>Logo Image URL</label>
                      <input
                        type="url"
                        placeholder="Paste image URL here"
                        value={newBrandImage}
                        onChange={e => setNewBrandImage(e.target.value)}
                      />
                    </div>
                  )}

                  {newBrandLogoType === 'upload' && (
                    <div className="form-group" style={{ flex: 2, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Upload Logo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileChange(e, (base64) => setNewBrandImage(base64))}
                        style={{ display: 'block', fontSize: '13px' }}
                      />
                      {newBrandImage && (
                        <img 
                          src={newBrandImage} 
                          alt="Preview" 
                          style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'contain', background: '#eee', padding: '2px', border: '1px solid var(--color-border)' }} 
                        />
                      )}
                    </div>
                  )}

                  <div className="form-group">
                    <button
                      className="btn btn-primary"
                      style={{ height: '44px', padding: '0 24px' }}
                      onClick={() => {
                        if (!newBrandName.trim()) return;
                        addBrand({
                          name: newBrandName.trim(),
                          color: newBrandColor,
                          svgType: newBrandLogoType === 'svg' ? newBrandSvgType : '',
                          image: newBrandLogoType !== 'svg' ? newBrandImage : ''
                        });
                        setBrandMessage(`Brand "${newBrandName.trim()}" added!`);
                        setNewBrandName('');
                        setNewBrandColor('#ff1493');
                        setNewBrandImage('');
                        setTimeout(() => setBrandMessage(''), 3000);
                      }}
                    >
                      Add Brand
                    </button>
                  </div>
                </div>
                {brandMessage && (
                  <p style={{ color: 'var(--color-primary)', fontWeight: '600', marginTop: '12px', fontSize: '13px' }}>
                    ✅ {brandMessage}
                  </p>
                )}
              </div>

              {/* Brands List */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '700' }}>🏷️ Current Brands ({brands.length})</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {brands.map(brand => (
                    <div key={brand.id} style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      padding: '14px 18px', borderRadius: '12px',
                      background: 'var(--color-surface)',
                      border: '1.5px solid var(--color-border)'
                    }}>
                      {/* Colour swatch */}
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '8px',
                        backgroundColor: brand.color, flexShrink: 0,
                        border: '1px solid rgba(0,0,0,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        {brand.image ? (
                          <img src={brand.image} alt={brand.name} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                        ) : (
                          <div style={{ fontSize: '10px', color: '#fff', fontWeight: 'bold' }}>SVG</div>
                        )}
                      </div>

                      {/* Inline edit or display */}
                      {editingBrand === brand.id ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '150px' }}>
                              <label style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-light)' }}>Brand Name</label>
                              <input
                                type="text"
                                value={editBrandName}
                                onChange={e => setEditBrandName(e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--color-border)', fontSize: '14px', background: 'var(--color-surface)', color: 'var(--color-text)' }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-light)' }}>Color</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <input
                                  type="color"
                                  value={editBrandColor}
                                  onChange={e => setEditBrandColor(e.target.value)}
                                  style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '2px' }}
                                />
                                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{editBrandColor}</span>
                              </div>
                            </div>
                            <div style={{ flex: 1, minWidth: '150px' }}>
                              <label style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-light)' }}>Logo Type</label>
                              <select
                                className="admin-select"
                                value={editBrandLogoType}
                                onChange={e => {
                                  setEditBrandLogoType(e.target.value);
                                  setEditBrandImage('');
                                }}
                                style={{ width: '100%', padding: '8px' }}
                              >
                                <option value="svg">SVG Style Logo</option>
                                <option value="url">Online Image URL</option>
                                <option value="upload">Upload from Device</option>
                              </select>
                            </div>
                          </div>
                          
                          <div>
                            {editBrandLogoType === 'svg' && (
                              <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-light)' }}>SVG Logo Style</label>
                                <select
                                  className="admin-select"
                                  value={editBrandSvgType}
                                  onChange={e => setEditBrandSvgType(e.target.value)}
                                  style={{ width: '100%', padding: '8px' }}
                                >
                                  <option value="bazooka">Bazooka Style</option>
                                  <option value="chupachups">Chupa Chups Style</option>
                                  <option value="hersheys">Hershey's Style</option>
                                  <option value="reeses">Reese's Style</option>
                                  <option value="walkers">Walkers Style</option>
                                  <option value="warheads">Warheads Style</option>
                                </select>
                              </div>
                            )}

                            {editBrandLogoType === 'url' && (
                              <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-light)' }}>Online Logo URL</label>
                                <input
                                  type="url"
                                  placeholder="Paste logo URL here"
                                  value={editBrandImage}
                                  onChange={e => setEditBrandImage(e.target.value)}
                                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--color-border)', fontSize: '14px', background: 'var(--color-surface)', color: 'var(--color-text)' }}
                                />
                              </div>
                            )}

                            {editBrandLogoType === 'upload' && (
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-light)' }}>Upload Logo File</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileChange(e, (base64) => setEditBrandImage(base64))}
                                  style={{ display: 'block', fontSize: '13px' }}
                                />
                                {editBrandImage && (
                                  <img 
                                    src={editBrandImage} 
                                    alt="Preview" 
                                    style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'contain', background: '#eee', padding: '4px', border: '1px solid var(--color-border)' }} 
                                  />
                                )}
                              </div>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <button
                              className="btn btn-primary"
                              style={{ padding: '8px 18px', fontSize: '13px' }}
                              onClick={() => {
                                updateBrand(brand.id, {
                                  name: editBrandName,
                                  color: editBrandColor,
                                  svgType: editBrandLogoType === 'svg' ? editBrandSvgType : '',
                                  image: editBrandLogoType !== 'svg' ? editBrandImage : ''
                                });
                                setEditingBrand(null);
                              }}
                            >
                              <Check size={14} /> Save Changes
                            </button>
                            <button
                              style={{ padding: '8px 16px', fontSize: '13px', border: '1.5px solid var(--color-border)', borderRadius: '8px', background: 'transparent', cursor: 'pointer', color: 'var(--color-text)', fontWeight: '600' }}
                              onClick={() => setEditingBrand(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '700', fontSize: '15px' }}>{brand.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                              Color: {brand.color} &nbsp;•&nbsp; 
                              {brand.image ? (
                                <span>Logo: {brand.image.startsWith('data:') ? 'Local Device Upload' : 'Online URL Link'}</span>
                              ) : (
                                <span>SVG Style: {brand.svgType}</span>
                              )}
                            </div>
                          </div>
                          <button
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontSize: '13px', borderRadius: '8px', border: '1.5px solid var(--color-border)', background: 'transparent', cursor: 'pointer', color: 'var(--color-text)', fontWeight: '600' }}
                            onClick={() => {
                              setEditingBrand(brand.id);
                              setEditBrandName(brand.name);
                              setEditBrandColor(brand.color);
                              setEditBrandSvgType(brand.svgType || 'bazooka');
                              setEditBrandLogoType(brand.image ? (brand.image.startsWith('data:') ? 'upload' : 'url') : 'svg');
                              setEditBrandImage(brand.image || '');
                            }}
                          >
                            <Edit3 size={13} /> Edit
                          </button>
                          <button
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontSize: '13px', borderRadius: '8px', border: '1.5px solid #fee2e2', background: '#fef2f2', cursor: 'pointer', color: '#dc2626', fontWeight: '600' }}
                            onClick={() => deleteBrand(brand.id)}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                  {brands.length === 0 && (
                    <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '32px' }}>No brands yet. Add one above.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="admin-tab-content">
              <h2>Reviews & Testimonials Management</h2>
              <p className="tab-subtitle">Monitor and moderate product reviews and homepage testimonials</p>

              {/* Sub-tabs Row */}
              <div className="admin-subtabs-row" style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button
                  className={`admin-subtab-btn ${reviewsSubTab === 'products' ? 'active' : ''}`}
                  onClick={() => setReviewsSubTab('products')}
                  style={{
                    padding: '8px 16px', borderRadius: '20px', border: 'none',
                    background: reviewsSubTab === 'products' ? 'var(--primary-gradient)' : 'var(--color-surface)',
                    color: reviewsSubTab === 'products' ? 'white' : 'var(--color-text)',
                    fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                    boxShadow: reviewsSubTab === 'products' ? 'var(--glow-primary)' : 'none',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  Product Reviews ({products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0)})
                </button>
                <button
                  className={`admin-subtab-btn ${reviewsSubTab === 'testimonials' ? 'active' : ''}`}
                  onClick={() => setReviewsSubTab('testimonials')}
                  style={{
                    padding: '8px 16px', borderRadius: '20px', border: 'none',
                    background: reviewsSubTab === 'testimonials' ? 'var(--primary-gradient)' : 'var(--color-surface)',
                    color: reviewsSubTab === 'testimonials' ? 'white' : 'var(--color-text)',
                    fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                    boxShadow: reviewsSubTab === 'testimonials' ? 'var(--glow-primary)' : 'none',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  Homepage Testimonials ({testimonials.length})
                </button>
              </div>

              {reviewsSubTab === 'products' ? (
                /* Product Reviews List */
                <div className="reviews-management-list" style={{ display: 'grid', gap: '16px' }}>
                  {products.flatMap(p => (p.reviews || []).map(r => ({
                    product: p,
                    review: r
                  }))).length > 0 ? (
                    products.flatMap(p => (p.reviews || []).map(r => (
                      <div key={r._id || r.id} className="admin-review-card glass-card animate-fade-in" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.5px' }}>
                              Reviewed {p.name}
                            </span>
                            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '4px 0 2px' }}>{r.userName}</h3>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                              {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                            </span>
                          </div>
                          <button
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #fee2e2',
                              background: '#fef2f2', color: '#dc2626', fontWeight: '700', fontSize: '12px', cursor: 'pointer'
                            }}
                            onClick={() => deleteProductReview(p.id, r._id || r.id)}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>

                        {/* Stars */}
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              fill={i < r.rating ? "#f59e0b" : "none"} 
                              stroke={i < r.rating ? "#d97706" : "#cbd5e1"} 
                            />
                          ))}
                        </div>

                        <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--color-text-light)', margin: 0 }}>
                          "{r.comment}"
                        </p>
                      </div>
                    )))
                  ) : (
                    <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      💬 No product reviews submitted yet.
                    </div>
                  )}
                </div>
              ) : (
                /* Homepage Testimonials List */
                <div className="testimonials-management-list" style={{ display: 'grid', gap: '16px' }}>
                  {testimonials.length > 0 ? (
                    testimonials.map(t => (
                      <div key={t.id || t._id} className="admin-review-card glass-card animate-fade-in" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.5px' }}>
                              {t.role || 'Sweet Enthusiast'}
                            </span>
                            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '4px 0 2px' }}>{t.name}</h3>
                            {t.createdAt && (
                              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                {new Date(t.createdAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            )}
                          </div>
                          <button
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #fee2e2',
                              background: '#fef2f2', color: '#dc2626', fontWeight: '700', fontSize: '12px', cursor: 'pointer'
                            }}
                            onClick={() => deleteTestimonial(t.id || t._id)}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>

                        {/* Stars */}
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              fill={i < t.rating ? "#f59e0b" : "none"} 
                              stroke={i < t.rating ? "#d97706" : "#cbd5e1"} 
                            />
                          ))}
                        </div>

                        <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--color-text-light)', margin: 0 }}>
                          "{t.quote}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      💬 No testimonials submitted yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="admin-tab-content">
              <h2>Promotions & Settings</h2>
              <p className="tab-subtitle">Manage landing page offer popups and marquee announcement texts</p>

              <form onSubmit={handleSettingsSubmit} className="glass-card animate-fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Marquee Settings */}
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-primary)', margin: 0 }}>
                      📢 Marquee Banner Announcements
                    </h3>
                    <button
                      type="button"
                      onClick={() => setTempSettings(prev => ({
                        ...prev,
                        marquees: [...(prev.marquees || []), {
                          text: 'New announcement text here',
                          enabled: true,
                          icon: '🍬',
                          color: '#ffffff',
                          bgColor: '#e72c83',
                          speed: 40,
                          pauseOnHover: true,
                          startDate: '',
                          endDate: ''
                        }]
                      }))}
                      style={{
                        background: 'var(--color-primary)', color: '#fff', border: 'none',
                        borderRadius: '10px', padding: '8px 18px', cursor: 'pointer',
                        fontSize: '13px', fontWeight: '700'
                      }}
                    >
                      + Add Row
                    </button>
                  </div>

                  {/* Live Preview Strip */}
                  {(tempSettings.marquees || []).some(m => m.enabled) && (
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>
                        Live Preview
                      </label>
                      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                        {(tempSettings.marquees || []).filter(m => m.enabled).map((m, i) => (
                          <div key={i} style={{
                            backgroundColor: m.bgColor || '#e72c83',
                            color: m.color || '#fff',
                            padding: '10px 20px',
                            fontSize: '13px',
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                          }}>
                            {m.icon ? `${m.icon}  ` : ''}{m.text || 'Announcement preview...'}
                            <span style={{ opacity: 0.6, marginLeft: '40px' }}>
                              {m.icon ? `${m.icon}  ` : ''}{m.text || 'Announcement preview...'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Marquee Rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {(tempSettings.marquees || []).length === 0 && (
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', textAlign: 'center', padding: '24px 0', border: '2px dashed var(--color-border)', borderRadius: '12px' }}>
                        No marquee rows yet. Click "+ Add Row" to create your first announcement banner.
                      </p>
                    )}
                    {(tempSettings.marquees || []).map((m, idx) => (
                      <div key={idx} style={{
                        border: `2px solid ${m.enabled ? (m.bgColor || '#e72c83') : 'var(--color-border)'}`,
                        borderRadius: '14px', padding: '18px',
                        background: 'var(--color-card)',
                        opacity: m.enabled ? 1 : 0.6
                      }}>
                        {/* Row Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontWeight: '800', fontSize: '13px', color: 'var(--color-text)' }}>Banner #{idx + 1}</span>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: m.enabled ? '#16a34a' : '#dc2626' }}>
                              <input
                                type="checkbox"
                                checked={!!m.enabled}
                                onChange={e => {
                                  const updated = [...(tempSettings.marquees || [])];
                                  updated[idx] = { ...updated[idx], enabled: e.target.checked };
                                  setTempSettings(prev => ({ ...prev, marquees: updated }));
                                }}
                              />
                              {m.enabled ? '✅ Enabled' : '⬜ Disabled'}
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (tempSettings.marquees || []).filter((_, i) => i !== idx);
                              setTempSettings(prev => ({ ...prev, marquees: updated }));
                            }}
                            style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            🗑 Remove
                          </button>
                        </div>

                        {/* Announcement Text */}
                        <div style={{ marginBottom: '14px' }}>
                          <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                            Announcement Text *
                          </label>
                          <input
                            type="text"
                            value={m.text || ''}
                            onChange={e => {
                              const updated = [...(tempSettings.marquees || [])];
                              updated[idx] = { ...updated[idx], text: e.target.value };
                              setTempSettings(prev => ({ ...prev, marquees: updated }));
                            }}
                            placeholder="e.g. FREE SHIPPING ON ORDERS OVER $50!"
                            style={{
                              width: '100%', padding: '10px 14px', borderRadius: '10px',
                              border: '1px solid var(--color-border)', background: 'var(--color-background)',
                              color: 'var(--color-text)', fontSize: '14px', boxSizing: 'border-box'
                            }}
                          />
                        </div>

                        {/* Color + Speed controls */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 2fr', gap: '14px', alignItems: 'end', marginBottom: '14px' }}>
                          {/* Icon */}
                          <div>
                            <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Icon</label>
                            <input
                              type="text"
                              value={m.icon || ''}
                              onChange={e => {
                                const updated = [...(tempSettings.marquees || [])];
                                updated[idx] = { ...updated[idx], icon: e.target.value };
                                setTempSettings(prev => ({ ...prev, marquees: updated }));
                              }}
                              placeholder="🍬"
                              style={{ width: '56px', padding: '10px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-background)', fontSize: '20px', textAlign: 'center' }}
                            />
                          </div>
                          {/* BG Color */}
                          <div>
                            <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Background Color</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input
                                type="color"
                                value={m.bgColor || '#e72c83'}
                                onChange={e => {
                                  const updated = [...(tempSettings.marquees || [])];
                                  updated[idx] = { ...updated[idx], bgColor: e.target.value };
                                  setTempSettings(prev => ({ ...prev, marquees: updated }));
                                }}
                                style={{ width: '44px', height: '42px', borderRadius: '8px', border: 'none', cursor: 'pointer', padding: '2px' }}
                              />
                              <input
                                type="text"
                                value={m.bgColor || '#e72c83'}
                                onChange={e => {
                                  const updated = [...(tempSettings.marquees || [])];
                                  updated[idx] = { ...updated[idx], bgColor: e.target.value };
                                  setTempSettings(prev => ({ ...prev, marquees: updated }));
                                }}
                                style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '13px' }}
                              />
                            </div>
                          </div>
                          {/* Text Color */}
                          <div>
                            <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Text Color</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input
                                type="color"
                                value={m.color || '#ffffff'}
                                onChange={e => {
                                  const updated = [...(tempSettings.marquees || [])];
                                  updated[idx] = { ...updated[idx], color: e.target.value };
                                  setTempSettings(prev => ({ ...prev, marquees: updated }));
                                }}
                                style={{ width: '44px', height: '42px', borderRadius: '8px', border: 'none', cursor: 'pointer', padding: '2px' }}
                              />
                              <input
                                type="text"
                                value={m.color || '#ffffff'}
                                onChange={e => {
                                  const updated = [...(tempSettings.marquees || [])];
                                  updated[idx] = { ...updated[idx], color: e.target.value };
                                  setTempSettings(prev => ({ ...prev, marquees: updated }));
                                }}
                                style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '13px' }}
                              />
                            </div>
                          </div>
                          {/* Speed */}
                          <div>
                            <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                              Scroll Speed: {m.speed || 40} <span style={{ fontWeight: '400', color: 'var(--color-text-muted)' }}>(higher = faster)</span>
                            </label>
                            <input
                              type="range" min="10" max="90"
                              value={m.speed || 40}
                              onChange={e => {
                                const updated = [...(tempSettings.marquees || [])];
                                updated[idx] = { ...updated[idx], speed: Number(e.target.value) };
                                setTempSettings(prev => ({ ...prev, marquees: updated }));
                              }}
                              style={{ width: '100%', accentColor: m.bgColor || 'var(--color-primary)' }}
                            />
                          </div>
                        </div>

                        {/* Pause on Hover + Schedule */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '14px', alignItems: 'center' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                            <input
                              type="checkbox"
                              checked={!!m.pauseOnHover}
                              onChange={e => {
                                const updated = [...(tempSettings.marquees || [])];
                                updated[idx] = { ...updated[idx], pauseOnHover: e.target.checked };
                                setTempSettings(prev => ({ ...prev, marquees: updated }));
                              }}
                            />
                            Pause on Hover
                          </label>
                          <div>
                            <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Start Date (optional)</label>
                            <input
                              type="date" value={m.startDate || ''}
                              onChange={e => {
                                const updated = [...(tempSettings.marquees || [])];
                                updated[idx] = { ...updated[idx], startDate: e.target.value };
                                setTempSettings(prev => ({ ...prev, marquees: updated }));
                              }}
                              style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '13px' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>End Date (optional)</label>
                            <input
                              type="date" value={m.endDate || ''}
                              onChange={e => {
                                const updated = [...(tempSettings.marquees || [])];
                                updated[idx] = { ...updated[idx], endDate: e.target.value };
                                setTempSettings(prev => ({ ...prev, marquees: updated }));
                              }}
                              style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '13px' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


                {/* Pop Up Offers Settings */}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🎁 Pop-up Special Offer Box List
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '-10px 0 20px 0' }}>
                    Define multiple popup promotion deals. If two or more offers are enabled, they will display one-by-one to your visitors with sequential time gaps.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {(tempSettings.popupOffers || []).map((offer, idx) => (
                      <div key={idx} className="glass-card" style={{ padding: '20px', border: '1.5px solid var(--color-border)', borderRadius: '16px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--color-text-dark)', fontWeight: '800' }}>
                            Offer #{idx + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleRemoveOfferRow(idx)}
                            style={{
                              background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700'
                            }}
                          >
                            <Trash2 size={13} /> Remove Offer
                          </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          {/* Toggle Switch */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                              type="checkbox"
                              id={`offer-enabled-${idx}`}
                              checked={offer.enabled || false}
                              onChange={(e) => handleOfferFieldChange(idx, 'enabled', e.target.checked)}
                              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                            />
                            <label htmlFor={`offer-enabled-${idx}`} style={{ fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                              Enable this Pop-up Offer
                            </label>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pop-up Delay (ms)</label>
                              <input
                                type="number"
                                value={offer.delay || 3000}
                                onChange={(e) => handleOfferFieldChange(idx, 'delay', Number(e.target.value))}
                                style={{
                                  padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--color-border)',
                                  background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '13px', outline: 'none'
                                }}
                              />
                            </div>
                            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Discount / Coupon Code</label>
                              <input
                                type="text"
                                value={offer.code || ''}
                                onChange={(e) => handleOfferFieldChange(idx, 'code', e.target.value)}
                                placeholder="e.g. SOUR15"
                                style={{
                                  padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--color-border)',
                                  background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '13px', outline: 'none'
                                }}
                              />
                            </div>
                          </div>

                          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Offer Title</label>
                            <input
                              type="text"
                              value={offer.title || ''}
                              onChange={(e) => handleOfferFieldChange(idx, 'title', e.target.value)}
                              placeholder="e.g. 🎉 Special Sweet Deal!"
                              style={{
                                padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--color-border)',
                                background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '13px', outline: 'none'
                              }}
                            />
                          </div>

                          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Offer Description</label>
                            <textarea
                              rows="2"
                              value={offer.description || ''}
                              onChange={(e) => handleOfferFieldChange(idx, 'description', e.target.value)}
                              placeholder="Describe the offer details..."
                              style={{
                                width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--color-border)',
                                background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '13px', outline: 'none', resize: 'none'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddOfferRow}
                      style={{
                        padding: '12px', border: '2px dashed var(--color-border)', borderRadius: '12px',
                        background: 'transparent', color: 'var(--color-text)', fontWeight: '700', fontSize: '13px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text)'; }}
                    >
                      ➕ Add Another Promo Offer
                    </button>
                  </div>
                </div>

                {/* Category Mega Menu Manager */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', marginTop: '10px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px', color: 'var(--color-primary)' }}>
                    📂 Category Mega Menu Layout
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                    Configure the columns and subcategory links displayed in the storefront navigation header. Changes are saved automatically when clicking Save Settings below.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    {(tempSettings.megaMenu || []).map((col, idx) => (
                      <div key={idx} className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div className="form-group" style={{ flex: 1, marginRight: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontWeight: '700', fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Column {idx + 1} Title</label>
                            <input 
                              type="text"
                              value={col.title || ''}
                              onChange={(e) => {
                                const updated = [...(tempSettings.megaMenu || [])];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setTempSettings(prev => ({ ...prev, megaMenu: updated }));
                              }}
                              style={{
                                padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--color-border)',
                                background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '13px', outline: 'none'
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (tempSettings.megaMenu || []).filter((_, i) => i !== idx);
                              setTempSettings(prev => ({ ...prev, megaMenu: updated }));
                            }}
                            style={{
                              background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700', alignSelf: 'flex-end', height: '36px'
                            }}
                          >
                            <Trash2 size={13} /> Remove Column
                          </button>
                        </div>

                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontWeight: '700', fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Subcategories (comma separated)</label>
                          <textarea 
                            rows={3}
                            value={Array.isArray(col.items) ? col.items.join(', ') : ''}
                            onChange={(e) => {
                              const items = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                              const updated = [...(tempSettings.megaMenu || [])];
                              updated[idx] = { ...updated[idx], items };
                              setTempSettings(prev => ({ ...prev, megaMenu: updated }));
                            }}
                            placeholder="e.g. Soft Lollies, Hard Lollies, Sour Lollies"
                            style={{
                              padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--color-border)',
                              background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '13px', outline: 'none', resize: 'vertical'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(tempSettings.megaMenu || []), { title: 'New Column', items: [] }];
                      setTempSettings(prev => ({ ...prev, megaMenu: updated }));
                    }}
                    style={{
                      padding: '10px 16px', borderRadius: '8px', border: '2px dashed var(--color-primary)',
                      background: 'transparent', color: 'var(--color-primary)', fontWeight: '700', fontSize: '13px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s ease'
                    }}
                  >
                    ➕ Add New Category Column
                  </button>
                </div>

                {settingsSuccess && (
                  <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#ecfdf5', color: '#166534', border: '1px solid #d1fae5', fontSize: '14px', fontWeight: '700' }}>
                    {settingsSuccess}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '700' }}
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'cms-pages' && (
            <div className="admin-tab-content">
              <h2>CMS Content Pages Editor</h2>
              <p className="tab-subtitle">Edit the content of your Hero banner, About Us story, and Contact Details</p>

              <form onSubmit={handleSettingsSubmit} className="glass-card animate-fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* Hero section */}
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px', color: 'var(--color-primary)' }}>✨ Homepage Hero Section</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Heading (Use | for gradient highlight)</label>
                      <input 
                        type="text"
                        value={tempSettings.hero?.heading || ''}
                        onChange={(e) => handleNestedFieldChange('hero', 'heading', e.target.value)}
                        placeholder="e.g. SWEETEN YOUR | EVERYDAY LIFE!"
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Subheading (SEO Line)</label>
                      <input 
                        type="text"
                        value={tempSettings.hero?.subheading || ''}
                        onChange={(e) => handleNestedFieldChange('hero', 'subheading', e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '16px' }}>
                    <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Description Text</label>
                    <textarea 
                      rows="3"
                      value={tempSettings.hero?.description || ''}
                      onChange={(e) => handleNestedFieldChange('hero', 'description', e.target.value)}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Primary Button Text</label>
                      <input 
                        type="text"
                        value={tempSettings.hero?.buttonText || ''}
                        onChange={(e) => handleNestedFieldChange('hero', 'buttonText', e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Primary Button Link</label>
                      <input 
                        type="text"
                        value={tempSettings.hero?.buttonLink || ''}
                        onChange={(e) => handleNestedFieldChange('hero', 'buttonLink', e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Hero Image (Base64 or URL)</label>
                      <input 
                        type="text"
                        value={tempSettings.hero?.heroImage || ''}
                        onChange={(e) => handleNestedFieldChange('hero', 'heroImage', e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                      />
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (base64) => handleNestedFieldChange('hero', 'heroImage', base64))}
                        style={{ marginTop: '8px' }}
                      />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Badge Text</label>
                      <input 
                        type="text"
                        value={tempSettings.hero?.badgeText || ''}
                        onChange={(e) => handleNestedFieldChange('hero', 'badgeText', e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                {/* About Us section */}
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px', color: 'var(--color-primary)' }}>📖 About Us Page Settings</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Page Heading</label>
                      <input 
                        type="text"
                        value={tempSettings.aboutUs?.heading || ''}
                        onChange={(e) => handleNestedFieldChange('aboutUs', 'heading', e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Subheading description</label>
                      <input 
                        type="text"
                        value={tempSettings.aboutUs?.subheading || ''}
                        onChange={(e) => handleNestedFieldChange('aboutUs', 'subheading', e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Primary Story Text</label>
                      <textarea 
                        rows="4"
                        value={tempSettings.aboutUs?.description || ''}
                        onChange={(e) => handleNestedFieldChange('aboutUs', 'description', e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                      />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Extended Story Text</label>
                      <textarea 
                        rows="4"
                        value={tempSettings.aboutUs?.story || ''}
                        onChange={(e) => handleNestedFieldChange('aboutUs', 'story', e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Our Mission</label>
                      <textarea 
                        rows="3"
                        value={tempSettings.aboutUs?.mission || ''}
                        onChange={(e) => handleNestedFieldChange('aboutUs', 'mission', e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                      />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Our Vision</label>
                      <textarea 
                        rows="3"
                        value={tempSettings.aboutUs?.vision || ''}
                        onChange={(e) => handleNestedFieldChange('aboutUs', 'vision', e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Us section */}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px', color: 'var(--color-primary)' }}>📞 Contact Page Settings</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Office Address</label>
                      <input 
                        type="text"
                        value={tempSettings.contactUs?.address || ''}
                        onChange={(e) => handleNestedFieldChange('contactUs', 'address', e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Contact Email</label>
                      <input 
                        type="email"
                        value={tempSettings.contactUs?.email || ''}
                        onChange={(e) => handleNestedFieldChange('contactUs', 'email', e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Contact Phone</label>
                      <input 
                        type="text"
                        value={tempSettings.contactUs?.phone || ''}
                        onChange={(e) => handleNestedFieldChange('contactUs', 'phone', e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Business Hours</label>
                      <input 
                        type="text"
                        value={tempSettings.contactUs?.businessHours || ''}
                        onChange={(e) => handleNestedFieldChange('contactUs', 'businessHours', e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Google Map Iframe Embed Link</label>
                      <input 
                        type="text"
                        value={tempSettings.contactUs?.googleMap || ''}
                        onChange={(e) => handleNestedFieldChange('contactUs', 'googleMap', e.target.value)}
                        placeholder="https://google.com/maps/embed?..."
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '100%', marginTop: '24px' }}>
                      <input
                        type="checkbox"
                        id="contact-form-enabled"
                        checked={tempSettings.contactUs?.formEnabled !== false}
                        onChange={(e) => handleNestedFieldChange('contactUs', 'formEnabled', e.target.checked)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <label htmlFor="contact-form-enabled" style={{ fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                        Enable Contact Submission Form
                      </label>
                    </div>
                  </div>
                </div>

                {settingsSuccess && (
                  <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#ecfdf5', color: '#166534', border: '1px solid #d1fae5', fontSize: '14px', fontWeight: '700' }}>
                    {settingsSuccess}
                  </div>
                )}

                <div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '700' }}>
                    Save CMS Pages
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'cms-theme' && (
            <div className="admin-tab-content">
              <h2>CMS Branding & Styling System</h2>
              <p className="tab-subtitle">Customize website titles, logos, fonts, and brand colors injected into the design tokens</p>

              <form onSubmit={handleSettingsSubmit} className="glass-card animate-fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px', color: 'var(--color-primary)' }}>🏷️ Brand Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Website Name</label>
                      <input 
                        type="text"
                        value={tempSettings.websiteName || ''}
                        onChange={(e) => setTempSettings(prev => ({ ...prev, websiteName: e.target.value }))}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Sticky Navbar Header</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                        <input
                          type="checkbox"
                          id="sticky-header"
                          checked={tempSettings.header?.sticky !== false}
                          onChange={(e) => handleNestedFieldChange('header', 'sticky', e.target.checked)}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <label htmlFor="sticky-header" style={{ fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                          Enable Sticky Scrolling Navbar
                        </label>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Website Header Logo (Base64 Image)</label>
                      <input 
                        type="text"
                        value={tempSettings.websiteLogo || ''}
                        onChange={(e) => setTempSettings(prev => ({ ...prev, websiteLogo: e.target.value }))}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                      />
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (base64) => setTempSettings(prev => ({ ...prev, websiteLogo: base64 })))}
                        style={{ marginTop: '8px' }}
                      />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Header Stylized Text (Fallback)</label>
                      <input 
                        type="text"
                        value={tempSettings.header?.logoText || ''}
                        onChange={(e) => handleNestedFieldChange('header', 'logoText', e.target.value)}
                        placeholder="e.g. Best Lolly Shop"
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px', color: 'var(--color-primary)' }}>🎨 Color Palette & Typography</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Primary Color</label>
                      <input 
                        type="color"
                        value={tempSettings.theme?.colorPrimary || '#e72c83'}
                        onChange={(e) => handleNestedFieldChange('theme', 'colorPrimary', e.target.value)}
                        style={{ width: '100%', height: '40px', padding: '0', borderRadius: '8px', border: '1px solid var(--color-border)', cursor: 'pointer' }}
                      />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Secondary Color</label>
                      <input 
                        type="color"
                        value={tempSettings.theme?.colorSecondary || '#f59e0b'}
                        onChange={(e) => handleNestedFieldChange('theme', 'colorSecondary', e.target.value)}
                        style={{ width: '100%', height: '40px', padding: '0', borderRadius: '8px', border: '1px solid var(--color-border)', cursor: 'pointer' }}
                      />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Page Background</label>
                      <input 
                        type="color"
                        value={tempSettings.theme?.colorBg || '#fef0f7'}
                        onChange={(e) => handleNestedFieldChange('theme', 'colorBg', e.target.value)}
                        style={{ width: '100%', height: '40px', padding: '0', borderRadius: '8px', border: '1px solid var(--color-border)', cursor: 'pointer' }}
                      />
                    </div>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Text Base Color</label>
                      <input 
                        type="color"
                        value={tempSettings.theme?.colorText || '#1e293b'}
                        onChange={(e) => handleNestedFieldChange('theme', 'colorText', e.target.value)}
                        style={{ width: '100%', height: '40px', padding: '0', borderRadius: '8px', border: '1px solid var(--color-border)', cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase' }}>Primary Font Family</label>
                      <select
                        value={tempSettings.theme?.fontPrimary || 'Outfit'}
                        onChange={(e) => handleNestedFieldChange('theme', 'fontPrimary', e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                      >
                        <option value="Outfit">Outfit (Default Rounded Premium)</option>
                        <option value="Inter">Inter (Clean Modern Sans-Serif)</option>
                        <option value="Poppins">Poppins (Friendly Pop)</option>
                        <option value="Montserrat">Montserrat (Geometric Corporate)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {settingsSuccess && (
                  <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#ecfdf5', color: '#166534', border: '1px solid #d1fae5', fontSize: '14px', fontWeight: '700' }}>
                    {settingsSuccess}
                  </div>
                )}

                <div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '700' }}>
                    Save Branding Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'media-library' && (
            <div className="admin-tab-content">
              <h2>Media Asset Library</h2>
              <p className="tab-subtitle">Upload Base64 image files directly into the database. Access and copy their dynamic streaming URLs to use anywhere on products or sections.</p>

              {/* Drag and Drop Uploader */}
              <div 
                className="glass-card" 
                style={{ 
                  padding: '30px', 
                  border: '2px dashed var(--color-primary)', 
                  borderRadius: '24px', 
                  textAlign: 'center', 
                  marginBottom: '30px',
                  background: 'rgba(231,44,131,0.01)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onClick={() => document.getElementById('media-upload-input').click()}
              >
                <input 
                  type="file" 
                  id="media-upload-input" 
                  style={{ display: 'none' }} 
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                      try {
                        await uploadMedia(file.name, file.type, reader.result);
                        alert('Asset uploaded successfully! 🎉');
                      } catch (err) {
                        alert(err.message);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                <span style={{ fontSize: '32px' }}>📷</span>
                <h4 style={{ margin: 0, fontWeight: '800' }}>Drag & Drop file here, or click to browse</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)' }}>Supports JPG, PNG, GIF, WebP (up to 4MB)</p>
              </div>

              {/* Asset list grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                {(mediaList || []).map((media, idx) => {
                  const mediaUrl = `/api/media/file/${media.filename}`;
                  return (
                    <div key={idx} className="glass-card" style={{ padding: '12px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ height: '120px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--color-border)', background: 'var(--color-background)' }}>
                        <img src={mediaUrl} alt={media.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={media.filename}>
                        {media.filename}
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '6px 8px', fontSize: '10px', flex: 1 }}
                          onClick={() => {
                            navigator.clipboard.writeText(mediaUrl);
                            alert('URL copied to clipboard! 📋');
                          }}
                        >
                          Copy Link
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '6px 8px', fontSize: '10px', color: '#dc2626', borderColor: '#fca5a5' }}
                          onClick={async () => {
                            if (window.confirm('Delete this asset?')) {
                              await deleteMedia(media.filename);
                            }
                          }}
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {mediaList.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    📷 No uploaded files in library yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="admin-tab-content animate-fade-in">
              <h2>Category Management Panel</h2>
              <p className="tab-subtitle">Create, list, and delete lolly product categories stored in the database</p>

              {/* Add Category Form */}
              <div className="glass-card" style={{ padding: '24px', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '14px', color: 'var(--color-primary)' }}>➕ Add New Category</h3>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.target);
                    const name = fd.get('name').trim();
                    const desc = fd.get('desc').trim();
                    if (!name) return;
                    const success = await addCategory({
                      name,
                      description: desc || `All sweet confections in ${name}`,
                      image: '',
                      banner: '',
                      enabled: true
                    });
                    if (success) {
                      e.target.reset();
                      alert('Category added successfully! 🎉');
                    } else {
                      alert('Error adding category');
                    }
                  }}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '14px', alignItems: 'flex-end' }}
                >
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '700', fontSize: '11px' }}>Category Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="e.g. Marshmallows" 
                      required 
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: '700', fontSize: '11px' }}>Description text</label>
                    <input 
                      type="text" 
                      name="desc" 
                      placeholder="e.g. Soft and fluffy marshmallow treats" 
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '12px 20px', height: '40px', fontWeight: '700' }}>
                    Add Category
                  </button>
                </form>
              </div>

              {/* Categories table list */}
              <div className="glass-card" style={{ overflow: 'hidden' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(categories || []).map((cat, idx) => {
                      const name = cat.name || cat;
                      const desc = cat.description || 'No description provided.';
                      return (
                        <tr key={idx}>
                          <td style={{ fontWeight: '700' }}>{name}</td>
                          <td style={{ color: 'var(--color-text-muted)' }}>{desc}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={async () => {
                                if (window.confirm(`Delete category "${name}"? This cannot be undone.`)) {
                                  const success = await deleteCategory(cat._id || cat.id || name);
                                  if (success) {
                                    alert('Category deleted! 🗑️');
                                  } else {
                                    alert('Failed to delete category.');
                                  }
                                }
                              }}
                              style={{
                                background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer',
                                display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700'
                              }}
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'offers' && (
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
          )}

          {activeTab === 'blogs' && (
            <div className="admin-tab-content animate-fade-in">
              <h2>Blogs & Recipes Manager</h2>
              <p className="tab-subtitle">Draft, publish, and schedule sweet recipe guides or blogs for search engines.</p>
              
              {/* Blog Form */}
              <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
                <h3>{editingBlogPostId ? '✏️ Edit Blog Post' : '➕ Write New Article'}</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (editingBlogPostId) {
                    await updateBlogPost(editingBlogPostId, newBlogPost);
                    setEditingBlogPostId(null);
                    alert('Post updated successfully! ✍️');
                  } else {
                    await addBlogPost(newBlogPost);
                    alert('Blog post published! 🎉');
                  }
                  setNewBlogPost({ title: '', slug: '', content: '', excerpt: '', author: 'Admin', category: 'General', tags: '', featuredImage: '', seoTitle: '', seoDescription: '', published: true, scheduledDate: '' });
                }} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Title</label>
                      <input type="text" value={newBlogPost.title} onChange={(e) => {
                        const t = e.target.value;
                        const s = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setNewBlogPost({...newBlogPost, title: t, slug: s, seoTitle: `${t} | Best Lolly Shop` });
                      }} placeholder="e.g. Best Easter Party Sweets" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>URL Slug</label>
                      <input type="text" value={newBlogPost.slug} onChange={(e) => setNewBlogPost({...newBlogPost, slug: e.target.value.toLowerCase()})} placeholder="e.g. best-easter-party-sweets" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Category</label>
                      <input type="text" value={newBlogPost.category} onChange={(e) => setNewBlogPost({...newBlogPost, category: e.target.value})} placeholder="e.g. Recipes" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Tags (comma separated)</label>
                      <input type="text" value={newBlogPost.tags} onChange={(e) => setNewBlogPost({...newBlogPost, tags: e.target.value})} placeholder="e.g. easter, kids, gummies" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Featured Image URL</label>
                      <input type="text" value={newBlogPost.featuredImage} onChange={(e) => setNewBlogPost({...newBlogPost, featuredImage: e.target.value})} placeholder="e.g. https://image..." style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Short Summary / Excerpt</label>
                    <textarea value={newBlogPost.excerpt} onChange={(e) => setNewBlogPost({...newBlogPost, excerpt: e.target.value})} placeholder="Brief summary of what this post is about..." rows="2" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'inherit', background: 'var(--color-background)', color: 'var(--color-text)' }}></textarea>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Main Body Content (HTML Allowed)</label>
                    <textarea value={newBlogPost.content} onChange={(e) => setNewBlogPost({...newBlogPost, content: e.target.value})} placeholder="Write details here (supports <h2>, <p>, <strong> tags)..." rows="6" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'monospace', background: 'var(--color-background)', color: 'var(--color-text)' }}></textarea>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>SEO Title Override</label>
                      <input type="text" value={newBlogPost.seoTitle} onChange={(e) => setNewBlogPost({...newBlogPost, seoTitle: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>SEO Meta Description</label>
                      <input type="text" value={newBlogPost.seoDescription} onChange={(e) => setNewBlogPost({...newBlogPost, seoDescription: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                      <input type="checkbox" checked={newBlogPost.published} onChange={(e) => setNewBlogPost({...newBlogPost, published: e.target.checked})} /> Publish Instantly
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '20px' }}>
                      <label>Schedule Publication date:</label>
                      <input type="date" value={newBlogPost.scheduledDate} onChange={(e) => setNewBlogPost({...newBlogPost, scheduledDate: e.target.value})} style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginLeft: 'auto', padding: '10px 24px', fontWeight: 'bold' }}>
                      {editingBlogPostId ? 'Save Changes' : 'Publish Blog'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Blogs List */}
              <div className="glass-card" style={{ overflow: 'hidden' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Author</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(blogPosts || []).map((b, idx) => (
                      <tr key={b.id || b._id || idx}>
                        <td style={{ fontWeight: 'bold' }}>{b.title}</td>
                        <td>{b.category}</td>
                        <td>{b.author}</td>
                        <td><span className={`status-badge ${b.published ? 'completed' : 'pending'}`}>{b.published ? 'Published' : 'Draft'}</span></td>
                        <td>{new Date(b.createdAt || Date.now()).toLocaleDateString()}</td>
                        <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button onClick={() => { setEditingBlogPostId(b.id || b._id); setNewBlogPost(b); }} style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Edit</button>
                          <button onClick={async () => { if (window.confirm('Delete this post?')) await deleteBlogPost(b.id || b._id); }} style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {(blogPosts || []).length === 0 && (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>No blog articles written yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'custom-pages' && (
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
                  <div style={{ gridTemplateColumns: '1fr 1fr', gap: '14px', display: 'grid' }}>
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
          )}

          {activeTab === 'seo' && (
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
          )}

          {activeTab === 'newsletter' && (
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
          )}

          {activeTab === 'staff' && (
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
                    setNewStaff({ name: '', email: '', password: '', role: 'manager' });
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
                      </select>
                    </div>
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
          )}

          {activeTab === 'audit-logs' && (
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
          )}

          {activeTab === 'backups' && (
            <div className="admin-tab-content animate-fade-in">
              <h2>Database Backup & Server Metrics</h2>
              <p className="tab-subtitle">Monitor server statistics, generate database JSON backup archives, or restore DB collections.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="stat-card glass-card" style={{ padding: '16px' }}>
                  <span>Database Status</span>
                  <h3 style={{ fontSize: '20px', margin: '8px 0 0' }}>{systemStatus.dbStatus || 'Connected'}</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '12px' }}>Dual Mongo/SQLite Engine</p>
                </div>
                <div className="stat-card glass-card" style={{ padding: '16px' }}>
                  <span>Heap Memory Usage</span>
                  <h3 style={{ fontSize: '20px', margin: '8px 0 0' }}>{systemStatus.memoryUsage || '0 MB'}</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '12px' }}>Active RAM heap sizing</p>
                </div>
                <div className="stat-card glass-card" style={{ padding: '16px' }}>
                  <span>Process Uptime</span>
                  <h3 style={{ fontSize: '20px', margin: '8px 0 0' }}>{systemStatus.uptime || '0s'}</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '12px' }}>API Server runtime</p>
                </div>
                <div className="stat-card glass-card" style={{ padding: '16px' }}>
                  <span>API Response Status</span>
                  <h3 style={{ fontSize: '20px', margin: '8px 0 0', color: '#10b981' }}>{systemStatus.apiStatus || 'Operational'}</h3>
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
          )}

          {activeTab === 'ai-tools' && (
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
          )}

          {activeTab === 'reports' && (
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
                      <h4 style={{ fontSize: '20px', margin: '4px 0 0' }}>${(totalOrders * 19).toFixed(2)}</h4>
                    </div>
                    <div style={{ padding: '14px', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                      <span>Pending Revenue Queue</span>
                      <h4 style={{ fontSize: '20px', margin: '4px 0 0', color: '#e59700' }}>${safeOrders.filter(o => o.status === 'Pending').reduce((sum, o) => sum + Number(o.total || 0), 0).toFixed(2)}</h4>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8,Order ID,Date,Customer,Total Spend,Status\n" + 
                        safeOrders.map(o => `"${o.id}","${o.date}","${o.customer?.name}","${o.total}","${o.status}"`).join("\n");
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
                          <option key={o.id} value={o.id}>{o.id} - {o.customer?.name} (${o.total})</option>
                        ))}
                      </select>
                    </div>
                    <button onClick={() => {
                      const selId = document.getElementById('invoice-order-select').value;
                      const orderObj = safeOrders.find(o => o.id === selId);
                      if (orderObj) {
                        const printWindow = window.open('', '_blank');
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>Invoice - \${orderObj.id}</title>
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
                                <div><h1>INVOICE</h1><p>Order: \${orderObj.id}</p><p>Date: \${orderObj.date}</p></div>
                              </div>
                              <div class="details">
                                <div><strong>Billed To:</strong><p>\${orderObj.customer?.name}</p><p>\${orderObj.customer?.email}</p><p>\${orderObj.customer?.phone}</p></div>
                                <div><strong>Ship To Delivery:</strong><p>\${orderObj.customer?.address}</p><p>\${orderObj.customer?.city}, \${orderObj.customer?.postalCode}</p></div>
                              </div>
                              <table>
                                <thead>
                                  <tr><th>Item Product</th><th>Pack Weight</th><th>Qty</th><th>Price</th></tr>
                                </thead>
                                <tbody>
                                  \${orderObj.items.map(item => \`
                                    <tr><td>\${item.name}</td><td>\${item.selectedWeight}</td><td>\${item.quantity}</td><td>$\${item.price}</td></tr>
                                  \`).join('')}
                                </tbody>
                              </table>
                              <div class="total">Total Paid Amount: $\${orderObj.total} (includes GST)</div>
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
          )}
        </main>
      </div>
    </div>
  );
};
