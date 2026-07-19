import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({
    marqueeText: "🍬 NZ'S FAVOURITE LOLLY SHOP — DELIVERING SWEET TREATS NATIONWIDE!",
    popupOffer: {
      enabled: true,
      delay: 3000,
      title: "🎉 Special Sweet Deal!",
      description: "Get 15% off on all sour gummies this weekend. Use code at checkout!",
      code: "SOUR15",
      image: ""
    }
  });
  
  const [categories, setCategories] = useState([]);
  const [mediaList, setMediaList] = useState([]);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('hc_cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0 && parsed[0].price > 40) {
        return [];
      }
      return parsed;
    }
    return [];
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('hc_theme') || 'light';
  });

  const [offers, setOffers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [redirects, setRedirects] = useState([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([]);
  const [customPages, setCustomPages] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [systemStatus, setSystemStatus] = useState({ dbStatus: 'Connected', uptime: '0s', memoryUsage: '0 MB', apiStatus: 'Operational' });
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hc_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // Fetch all DB details on Mount
  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchOrders();
    fetchContacts();
    fetchTestimonials();
    fetchSettings();
    fetchCategories();
    fetchMediaList();
    fetchOffers();
    fetchAuditLogs();
    fetchBlogPosts();
    fetchRedirects();
    fetchNewsletterSubscribers();
    fetchCustomPages();
    fetchStaffUsers();
    fetchSystemStatus();

    // Poll for new orders, contacts, and logs in real-time
    const pollInterval = setInterval(() => {
      fetchOrders();
      fetchContacts();
      fetchAuditLogs();
      fetchSystemStatus();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (res.ok && data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings from server:', err);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || '',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || [])
        },
        body: JSON.stringify(newSettings)
      });
      const data = await res.json();
      setSettings(data);
      return data;
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products from server:', err);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      const data = await res.json();
      if (Array.isArray(data)) {
        setBrands(data);
      }
    } catch (err) {
      console.error('Error fetching brands from server:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const headers = {};
      if (currentUser?.role === 'admin') {
        headers['X-User-Role'] = 'admin';
        headers['X-User-Permissions'] = JSON.stringify(currentUser?.permissions || []);
      }
      const res = await fetch('/api/orders', { headers });
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders from server:', err);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      const data = await res.json();
      if (Array.isArray(data)) {
        setContactSubmissions(data);
      }
    } catch (err) {
      console.error('Error retrieving contact requests:', err);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      if (Array.isArray(data)) {
        setTestimonials(data);
      }
    } catch (err) {
      console.error('Error fetching testimonials from server:', err);
    }
  };

  // LocalStorage Persistences
  useEffect(() => {
    localStorage.setItem('hc_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('hc_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('hc_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hc_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hc_currentUser');
    }
  }, [currentUser]);

  // Cart operations
  const getWeightPrice = (product, weight) => {
    if (product.weightPrices && product.weightPrices[weight]) {
      return Number(product.weightPrices[weight]);
    }
    if (weight === '250g') return Number((product.price * 2.2).toFixed(2));
    if (weight === '500g') return Number((product.price * 4.0).toFixed(2));
    if (weight === '1kg') return Number((product.price * 7.5).toFixed(2));
    return product.price;
  };

  const addToCart = (product, quantity = 1, weight = '100g') => {
    const weightPrice = getWeightPrice(product, weight);

    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id && item.selectedWeight === weight);
      if (existing) {
        return prevCart.map(item =>
          (item.id === product.id && item.selectedWeight === weight)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, price: weightPrice, selectedWeight: weight, quantity }];
    });
  };

  const updateCartQty = (productId, weight, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        (item.id === productId && item.selectedWeight === weight)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId, weight) => {
    setCart(prevCart =>
      prevCart.filter(item => !(item.id === productId && item.selectedWeight === weight))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Admin / DB Operations
  const addProduct = async (productData) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productData,
          inStock: productData.inStock !== undefined ? productData.inStock : true
        })
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(prev => [data, ...prev]);
        return data;
      } else {
        console.error('Server returned error adding product:', data);
        return null;
      }
    } catch (error) {
      console.error('Error adding product to DB:', error);
      return null;
    }
  };

  const updateProduct = async (productId, updates) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === productId ? data : p));
        return data;
      } else {
        console.error('Server returned error updating product:', data);
        return null;
      }
    } catch (error) {
      console.error('Error updating product in DB:', error);
      return null;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product from DB:', error);
    }
  };

  const updateProductStock = async (productId, inStock) => {
    try {
      const res = await fetch(`/api/products/${productId}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock })
      });
      const data = await res.json();
      setProducts(prev =>
        prev.map(p => (p.id === productId ? { ...p, inStock: data.inStock, quantity: data.quantity } : p))
      );
    } catch (error) {
      console.error('Error toggling stock in DB:', error);
    }
  };

  const updateProductQuantity = async (productId, quantity) => {
    try {
      const res = await fetch(`/api/products/${productId}/quantity`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      const data = await res.json();
      setProducts(prev =>
        prev.map(p => (p.id === productId ? { ...p, quantity: data.quantity, inStock: data.inStock } : p))
      );
      return data;
    } catch (error) {
      console.error('Error updating quantity in DB:', error);
    }
  };

  const addProductReview = async (productId, reviewData) => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      const data = await res.json();
      setProducts(prev => prev.map(p => p.id === productId ? data : p));
      return data;
    } catch (error) {
      console.error('Error adding product review:', error);
    }
  };

  const addTestimonial = async (testimonialData) => {
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialData)
      });
      const data = await res.json();
      setTestimonials(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding testimonial to DB:', error);
    }
  };

  const deleteProductReview = async (productId, reviewId) => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      setProducts(prev => prev.map(p => p.id === productId ? data : p));
      return data;
    } catch (error) {
      console.error('Error deleting product review:', error);
    }
  };

  const deleteTestimonial = async (testimonialId) => {
    try {
      await fetch(`/api/testimonials/${testimonialId}`, {
        method: 'DELETE'
      });
      setTestimonials(prev => prev.filter(t => String(t.id || t._id) !== String(testimonialId)));
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  const addBrand = async (brandData) => {
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandData)
      });
      const data = await res.json();
      setBrands(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding brand to DB:', error);
    }
  };

  const deleteBrand = async (brandId) => {
    try {
      await fetch(`/api/brands/${brandId}`, { method: 'DELETE' });
      setBrands(prev => prev.filter(b => b.id !== brandId));
    } catch (error) {
      console.error('Error deleting brand from DB:', error);
    }
  };

  const updateBrand = async (brandId, updates) => {
    try {
      const res = await fetch(`/api/brands/${brandId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      setBrands(prev => prev.map(b => b.id === brandId ? data : b));
    } catch (error) {
      console.error('Error updating brand in DB:', error);
    }
  };

  const placeOrder = async (customerDetails, orderTotal, shippingFee = 19) => {
    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-NZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      items: [...cart],
      total: orderTotal !== undefined ? orderTotal : (getCartTotal() + shippingFee),
      shipping: shippingFee,
      customer: {
        ...customerDetails,
        postalCode: customerDetails.zip || customerDetails.postalCode || ''
      },
      userEmail: currentUser?.email || '',
      status: 'Pending'
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Server error occurred while creating your order.');
      }
      setOrders(prev => [data, ...prev]);
      clearCart();
      return data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.role === 'admin') {
        headers['X-User-Role'] = 'admin';
        headers['X-User-Permissions'] = JSON.stringify(currentUser?.permissions || []);
      }
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      setOrders(prev =>
        prev.map(ord => (ord.id === orderId ? { ...ord, status: data.status } : ord))
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updateOrderDelivery = async (orderId, deliveryCompany, deliveryReference) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.role === 'admin') {
        headers['X-User-Role'] = 'admin';
        headers['X-User-Permissions'] = JSON.stringify(currentUser?.permissions || []);
      }
      const res = await fetch(`/api/orders/${orderId}/delivery`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ deliveryCompany, deliveryReference })
      });
      const data = await res.json();
      setOrders(prev =>
        prev.map(ord => (ord.id === orderId ? { ...ord, ...data } : ord))
      );
      return data;
    } catch (error) {
      console.error('Error updating order delivery tracking:', error);
    }
  };

  const removeOrderItem = async (orderId, itemId, selectedWeight) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.role === 'admin') {
        headers['X-User-Role'] = 'admin';
        headers['X-User-Permissions'] = JSON.stringify(currentUser?.permissions || []);
      }
      const res = await fetch(`/api/orders/${orderId}/remove-item`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ itemId, selectedWeight })
      });
      const data = await res.json();
      setOrders(prev =>
        prev.map(ord => (ord.id === orderId ? data : ord))
      );
      return data;
    } catch (error) {
      console.error('Error removing item from order:', error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const headers = { 'Content-Type': 'application/json', 'X-User-Role': 'admin' };
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Failed to delete order');
      setOrders(prev => prev.filter(ord => ord.id !== orderId));
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  };

  const clearAllOrders = async () => {
    try {
      const headers = { 'Content-Type': 'application/json', 'X-User-Role': 'admin' };
      const res = await fetch('/api/orders', { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Failed to clear orders');
      setOrders([]);
      return true;
    } catch (error) {
      console.error('Error clearing all orders:', error);
      return false;
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchMediaList = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (Array.isArray(data)) {
        setMediaList(data);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    }
  };

  const addCategory = async (catData) => {
    const payload = typeof catData === 'string' ? {
      name: catData,
      description: `All sweets in the ${catData} collection`,
      image: '',
      banner: '',
      displayOrder: categories.length,
      enabled: true
    } : catData;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || '',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || [])
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchCategories();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateCategory = async (id, catData) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || '',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || [])
        },
        body: JSON.stringify(catData)
      });
      if (res.ok) {
        await fetchCategories();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-Role': currentUser?.role || '',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || [])
        }
      });
      if (res.ok) {
        await fetchCategories();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const uploadMedia = async (filename, contentType, base64Data) => {
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || '',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || [])
        },
        body: JSON.stringify({ filename, contentType, base64Data })
      });
      const data = await res.json();
      if (res.ok) {
        await fetchMediaList();
        return data;
      }
      throw new Error(data.message || 'Upload error');
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const deleteMedia = async (filename) => {
    try {
      const res = await fetch(`/api/media/${filename}`, {
        method: 'DELETE',
        headers: {
          'X-User-Role': currentUser?.role || '',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || [])
        }
      });
      if (res.ok) {
        await fetchMediaList();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const addContactSubmission = async (submission) => {
    const newSubmission = {
      ...submission,
      submittedAt: new Date().toLocaleString('en-NZ')
    };

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubmission)
      });
      const data = await res.json();
      setContactSubmissions(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding contact submission:', error);
    }
  };

  const login = async (username, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Authentication request error:', error);
      return { success: false, message: 'Server connection error during login' };
    }
  };

  const loginWithGoogle = async (googleUser) => {
    try {
      const res = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: googleUser.displayName,
          email: googleUser.email
        })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Google Auth request error:', error);
      return { success: false, message: 'Server connection error during Google login' };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const payload = { ...profileData };
      if (!payload.email && currentUser?.email) {
        payload.email = currentUser.email;
      }
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        // Also update local storage if it's there
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Server connection error during profile update' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Registration request error:', error);
      return { success: false, message: 'Server connection error during registration' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Forgot password request error:', error);
      return { success: false, message: 'Server connection error' };
    }
  };

  const verifyResetToken = async (token) => {
    try {
      const res = await fetch(`/api/auth/verify-reset-token?token=${token}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Verify reset token error:', error);
      return { success: false, message: 'Server connection error' };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: 'Server connection error' };
    }
  };

  // ── ENTERPRISE OFFERS CRUD ──
  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/offers');
      const data = await res.json();
      if (Array.isArray(data)) setOffers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const addOffer = async (offerData) => {
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'admin',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || []),
          'X-User-Email': currentUser?.email || '',
          'X-User-Name': currentUser?.name || ''
        },
        body: JSON.stringify(offerData)
      });
      const data = await res.json();
      if (res.ok) {
        setOffers(prev => [data, ...prev]);
        return data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateOffer = async (id, updates) => {
    try {
      const res = await fetch(`/api/offers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'admin',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || []),
          'X-User-Email': currentUser?.email || '',
          'X-User-Name': currentUser?.name || ''
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (res.ok) {
        setOffers(prev => prev.map(o => o.id === id ? data : o));
        return data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteOffer = async (id) => {
    try {
      const res = await fetch(`/api/offers/${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-Role': currentUser?.role || 'admin',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || []),
          'X-User-Email': currentUser?.email || '',
          'X-User-Name': currentUser?.name || ''
        }
      });
      if (res.ok) {
        setOffers(prev => prev.filter(o => o.id !== id));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ── AUDIT LOGS ──
  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/audit-logs');
      const data = await res.json();
      if (Array.isArray(data)) setAuditLogs(data);
    } catch (e) {
      console.error(e);
    }
  };

  // ── BLOG POSTS CRUD ──
  const fetchBlogPosts = async () => {
    try {
      const res = await fetch('/api/blogposts');
      const data = await res.json();
      if (Array.isArray(data)) setBlogPosts(data);
    } catch (e) {
      console.error(e);
    }
  };

  const addBlogPost = async (postData) => {
    try {
      const res = await fetch('/api/blogposts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'admin',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || []),
          'X-User-Email': currentUser?.email || '',
          'X-User-Name': currentUser?.name || ''
        },
        body: JSON.stringify(postData)
      });
      const data = await res.json();
      if (res.ok) {
        setBlogPosts(prev => [data, ...prev]);
        return data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateBlogPost = async (id, updates) => {
    try {
      const res = await fetch(`/api/blogposts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'admin',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || []),
          'X-User-Email': currentUser?.email || '',
          'X-User-Name': currentUser?.name || ''
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (res.ok) {
        setBlogPosts(prev => prev.map(p => p.id === id ? data : p));
        return data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteBlogPost = async (id) => {
    try {
      const res = await fetch(`/api/blogposts/${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-Role': currentUser?.role || 'admin',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || []),
          'X-User-Email': currentUser?.email || '',
          'X-User-Name': currentUser?.name || ''
        }
      });
      if (res.ok) {
        setBlogPosts(prev => prev.filter(p => p.id !== id));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ── REDIRECTS CRUD ──
  const fetchRedirects = async () => {
    try {
      const res = await fetch('/api/redirects');
      const data = await res.json();
      if (Array.isArray(data)) setRedirects(data);
    } catch (e) {
      console.error(e);
    }
  };

  const addRedirect = async (redirectData) => {
    try {
      const res = await fetch('/api/redirects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'admin',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || []),
          'X-User-Email': currentUser?.email || '',
          'X-User-Name': currentUser?.name || ''
        },
        body: JSON.stringify(redirectData)
      });
      const data = await res.json();
      if (res.ok) {
        setRedirects(prev => [data, ...prev]);
        return data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteRedirect = async (id) => {
    try {
      const res = await fetch(`/api/redirects/${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-Role': currentUser?.role || 'admin',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || []),
          'X-User-Email': currentUser?.email || '',
          'X-User-Name': currentUser?.name || ''
        }
      });
      if (res.ok) {
        setRedirects(prev => prev.filter(r => r.id !== id));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ── NEWSLETTER SUBSCRIBERS ──
  const fetchNewsletterSubscribers = async () => {
    try {
      const res = await fetch('/api/newsletter-subscribers');
      const data = await res.json();
      if (Array.isArray(data)) setNewsletterSubscribers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const addNewsletterSubscriber = async (email) => {
    try {
      const res = await fetch('/api/newsletter-subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterSubscribers(prev => [data, ...prev]);
        return data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNewsletterSubscriber = async (id) => {
    try {
      const res = await fetch(`/api/newsletter-subscribers/${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-Role': currentUser?.role || 'admin',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || []),
          'X-User-Email': currentUser?.email || '',
          'X-User-Name': currentUser?.name || ''
        }
      });
      if (res.ok) {
        setNewsletterSubscribers(prev => prev.filter(s => s.id !== id));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ── CUSTOM PAGES CRUD ──
  const fetchCustomPages = async () => {
    try {
      const res = await fetch('/api/custom-pages');
      const data = await res.json();
      if (Array.isArray(data)) setCustomPages(data);
    } catch (e) {
      console.error(e);
    }
  };

  const addCustomPage = async (pageData) => {
    try {
      const res = await fetch('/api/custom-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'admin',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || []),
          'X-User-Email': currentUser?.email || '',
          'X-User-Name': currentUser?.name || ''
        },
        body: JSON.stringify(pageData)
      });
      const data = await res.json();
      if (res.ok) {
        setCustomPages(prev => [data, ...prev]);
        return data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateCustomPage = async (id, updates) => {
    try {
      const res = await fetch(`/api/custom-pages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'admin',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || []),
          'X-User-Email': currentUser?.email || '',
          'X-User-Name': currentUser?.name || ''
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (res.ok) {
        setCustomPages(prev => prev.map(p => p.id === id ? data : p));
        return data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCustomPage = async (id) => {
    try {
      const res = await fetch(`/api/custom-pages/${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-Role': currentUser?.role || 'admin',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || []),
          'X-User-Email': currentUser?.email || '',
          'X-User-Name': currentUser?.name || ''
        }
      });
      if (res.ok) {
        setCustomPages(prev => prev.filter(p => p.id !== id));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ── STAFF USERS CRUD ──
  const fetchStaffUsers = async () => {
    try {
      const res = await fetch('/api/users/staff', {
        headers: {
          'X-User-Role': currentUser?.role || 'admin'
        }
      });
      const data = await res.json();
      if (Array.isArray(data)) setStaffUsers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const addStaffUser = async (staffData) => {
    try {
      const res = await fetch('/api/users/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'admin',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || []),
          'X-User-Email': currentUser?.email || '',
          'X-User-Name': currentUser?.name || ''
        },
        body: JSON.stringify(staffData)
      });
      const data = await res.json();
      if (res.ok) {
        setStaffUsers(prev => [...prev, data]);
        return data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateStaffUser = async (id, updates) => {
    try {
      const res = await fetch(`/api/users/staff/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'admin',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || []),
          'X-User-Email': currentUser?.email || '',
          'X-User-Name': currentUser?.name || ''
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (res.ok) {
        setStaffUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
        return data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteStaffUser = async (id) => {
    try {
      const res = await fetch(`/api/users/staff/${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-Role': currentUser?.role || 'admin',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || []),
          'X-User-Email': currentUser?.email || '',
          'X-User-Name': currentUser?.name || ''
        }
      });
      if (res.ok) {
        setStaffUsers(prev => prev.filter(u => u.id !== id));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ── METRICS & BACKUPS ──
  const fetchSystemStatus = async () => {
    try {
      const res = await fetch('/api/system-status');
      const data = await res.json();
      if (data && data.success) setSystemStatus(data);
    } catch (e) {
      console.error(e);
    }
  };

  const backupDatabase = async () => {
    try {
      const res = await fetch('/api/database-backup', {
        method: 'POST',
        headers: {
          'X-User-Role': currentUser?.role || 'admin',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || []),
          'X-User-Email': currentUser?.email || '',
          'X-User-Name': currentUser?.name || ''
        }
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.error(e);
    }
  };

  const restoreDatabase = async (backupPayload) => {
    try {
      const res = await fetch('/api/database-restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'admin',
          'X-User-Permissions': JSON.stringify(currentUser?.permissions || []),
          'X-User-Email': currentUser?.email || '',
          'X-User-Name': currentUser?.name || ''
        },
        body: JSON.stringify({ backup: backupPayload })
      });
      const data = await res.json();
      if (res.ok) {
        fetchProducts();
        fetchBrands();
        fetchOrders();
        fetchCategories();
        fetchOffers();
        fetchCustomPages();
        fetchBlogPosts();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // ── UNDO / REDO UTIL ──
  const pushToUndo = (snapshot) => {
    setUndoStack(prev => [...prev, snapshot]);
    setRedoStack([]);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        theme,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,
        placeOrder,
        updateOrderStatus,
        contactSubmissions,
        addContactSubmission,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        mediaList,
        uploadMedia,
        deleteMedia,
        fetchMediaList,
        brands,
        addBrand,
        deleteBrand,
        updateBrand,
        currentUser,
        login,
        register,
        forgotPassword,
        verifyResetToken,
        resetPassword,
        loginWithGoogle,
        updateProfile,
        logout,
        addProductReview,
        testimonials,
        addTestimonial,
        deleteProductReview,
        deleteTestimonial,
        settings,
        updateSettings,
        updateProductQuantity,
        updateOrderDelivery,
        removeOrderItem,
        deleteOrder,
        clearAllOrders,
        // Enterprise features
        toggleTheme,
        offers,
        addOffer,
        updateOffer,
        deleteOffer,
        auditLogs,
        blogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        redirects,
        addRedirect,
        deleteRedirect,
        newsletterSubscribers,
        addNewsletterSubscriber,
        deleteNewsletterSubscriber,
        customPages,
        addCustomPage,
        updateCustomPage,
        deleteCustomPage,
        staffUsers,
        addStaffUser,
        updateStaffUser,
        deleteStaffUser,
        systemStatus,
        backupDatabase,
        restoreDatabase,
        undoStack,
        pushToUndo,
        redoStack,
        setUndoStack,
        setRedoStack
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
