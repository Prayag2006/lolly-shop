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
  Star
} from 'lucide-react';
import { CandyVisual } from '../components/SvgCandies';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '160px' }}>
      <input
        type="text"
        placeholder="Courier (e.g. NZ Post)"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        onBlur={handleBlur}
        style={{
          padding: '6px 8px',
          borderRadius: '6px',
          border: '1px solid var(--color-border)',
          fontSize: '12px',
          outline: 'none',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          fontWeight: '600'
        }}
      />
      <input
        type="text"
        placeholder="Tracking Reference"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        onBlur={handleBlur}
        style={{
          padding: '6px 8px',
          borderRadius: '6px',
          border: '1px solid var(--color-border)',
          fontSize: '12px',
          outline: 'none',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          fontFamily: 'monospace',
          fontWeight: '700'
        }}
      />
    </div>
  );
};

export const Admin = () => {
  const { 
    currentUser, products, orders, contactSubmissions, 
    addProduct, updateProduct, deleteProduct, updateProductStock, 
    updateOrderStatus, categories, addCategory, brands, 
    addBrand, deleteBrand, updateBrand, testimonials, 
    deleteProductReview, deleteTestimonial,
    settings, updateSettings, updateProductQuantity, updateOrderDelivery, removeOrderItem
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
  const [productImageSource, setProductImageSource] = useState('url'); // 'url' | 'upload'
  const [formSuccess, setFormSuccess] = useState('');
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [categoryMessage, setCategoryMessage] = useState('');

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

  // Stats calculation
  const totalSales = safeOrders.reduce((sum, ord) => sum + Number(ord?.total || 0), 0) + 2220.50; // Include NZD baseline sales
  const totalOrders = safeOrders.length + 10; // baseline count
  const avgOrderVal = totalOrders > 0 ? (totalSales / totalOrders) : 0;
  const catalogCount = safeProducts.length;

  // Order status counts
  const pendingOrdersCount = safeOrders.filter(o => o && (o.status === 'Processing' || o.status === 'Pending')).length + 3; // baseline pending
  const completedOrdersCount = safeOrders.filter(o => o && o.status === 'Completed').length + 7; // baseline completed

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
    const numId = Number(id);
    if (productSalesMap[numId]) {
      productSalesMap[numId].qty += simulatedSales[numId].qty;
      productSalesMap[numId].revenue += simulatedSales[numId].revenue;
    }
  });

  const topSellingProducts = Object.values(productSalesMap).sort((a, b) => b.qty - a.qty);

  const resetProductForm = () => {
    setEditingProductId(null);
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

    const payload = {
      name: newProduct.name,
      category: newProduct.category,
      mainCategory: newProduct.mainCategory || '',
      price: Number(newProduct.price),
      weightPrices: {
        '100g': Number(newProduct.price100g || newProduct.price),
        '250g': Number(newProduct.price250g || Number(newProduct.price) * 2.2),
        '500g': Number(newProduct.price500g || Number(newProduct.price) * 4.0),
        '1kg': Number(newProduct.price1kg || Number(newProduct.price) * 7.5)
      },
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
          </nav>
        </aside>

        {/* Main Content Side */}
        <main className="admin-content-area">
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
                      <span className="m-val">14,840</span>
                      <span className="m-label">Pageviews</span>
                    </div>
                    <div className="metric-box">
                      <span className="m-badge badge-up">+12.6%</span>
                      <span className="m-val">3,120</span>
                      <span className="m-label">Unique Visitors</span>
                    </div>
                    <div className="metric-box live-box">
                      <span className="m-val active-pulse">
                        <Activity size={16} className="live-pulse-icon" /> 18
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
                          <span className="p-cell-category">{p.collections?.join(', ') || '—'}</span>
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
                        <td style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
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
              <h2>Customer Order Sheets</h2>
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
                                        gap: '6px',
                                        background: 'rgba(231, 44, 131, 0.05)',
                                        border: '1px solid rgba(231, 44, 131, 0.15)',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '12px'
                                      }}
                                    >
                                      {item.image && (
                                        <img 
                                          src={item.image} 
                                          alt={item.name || ''} 
                                          style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                      )}
                                      <span style={{ fontWeight: '700' }}>x{item.quantity || 1}</span>
                                      <small style={{ color: 'var(--color-primary)', fontWeight: '800' }}>({item.selectedWeight || ''})</small>
                                      <button
                                        onClick={() => {
                                          if (window.confirm(`Are you sure you want to cancel "${item.name}" (${item.selectedWeight}) from this order?`)) {
                                            removeOrderItem(ord.id, item.id, item.selectedWeight);
                                          }
                                        }}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          color: '#ef4444',
                                          fontWeight: '900',
                                          cursor: 'pointer',
                                          padding: '0 0 0 4px',
                                          fontSize: '14px',
                                          lineHeight: 1,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                        }}
                                        title={`Cancel ${item.name} (${item.selectedWeight})`}
                                      >
                                        ×
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

                  <h3 className="form-section-title">Weight-based Pricing</h3>
                  <div className="form-row four-cols">
                    <div className="form-group">
                      <label htmlFor="p100g">100g Price</label>
                      <input
                        type="number"
                        id="p100g"
                        step="0.01"
                        min="0"
                        placeholder="Same as base price"
                        value={newProduct.price100g}
                        onChange={(e) => setNewProduct({ ...newProduct, price100g: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="p250g">250g Price</label>
                      <input
                        type="number"
                        id="p250g"
                        step="0.01"
                        min="0"
                        placeholder="e.g. 19.58"
                        value={newProduct.price250g}
                        onChange={(e) => setNewProduct({ ...newProduct, price250g: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="p500g">500g Price</label>
                      <input
                        type="number"
                        id="p500g"
                        step="0.01"
                        min="0"
                        placeholder="e.g. 35.60"
                        value={newProduct.price500g}
                        onChange={(e) => setNewProduct({ ...newProduct, price500g: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="p1kg">1kg Price</label>
                      <input
                        type="number"
                        id="p1kg"
                        step="0.01"
                        min="0"
                        placeholder="e.g. 67.50"
                        value={newProduct.price1kg}
                        onChange={(e) => setNewProduct({ ...newProduct, price1kg: e.target.value })}
                      />
                    </div>
                  </div>

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
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px', color: 'var(--color-primary)' }}>📢 Marquee Banner Announcements</h3>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Announcements Text</label>
                    <textarea
                      rows="3"
                      value={tempSettings.marqueeText}
                      onChange={(e) => setTempSettings(prev => ({ ...prev, marqueeText: e.target.value }))}
                      placeholder="Use | to separate multiple announcements. e.g. Announcement 1 | Announcement 2"
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-border)',
                        background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '14px', outline: 'none'
                      }}
                    />
                    <small style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>
                      Tip: Separate announcements with a vertical bar symbol (<code>|</code>) to render multiple scrolling messages.
                    </small>
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
        </main>
      </div>
    </div>
  );
};
