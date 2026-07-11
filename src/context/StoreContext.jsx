import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({
    marqueeText: "🍬 NZ'S FAVORITE CANDY STORE — FREE SHIPPING ON ORDERS OVER $50! | 🍭 GET 10% OFF YOUR FIRST ORDER WITH CODE: SWEET10",
    popupOffer: {
      enabled: true,
      delay: 3000,
      title: "🎉 Special Sweet Deal!",
      description: "Get 15% off on all sour gummies this weekend. Use code at checkout!",
      code: "SOUR15",
      image: ""
    }
  });
  
  const [categories, setCategories] = useState(() => {
    const defaultCats = [
      'NZ Lollies', 'Soft Lollies', 'Hard Lollies', 'Sour Lollies', 'Sweet Lollies', 'Sugar Coated', 'Mayceys', 'Finni', 'Pascals', 'Other', 'Sugar Free', 'Vegan', 'Jellybeans',
      'Imported Lollies', 'Airheads', 'Cotton Candy', 'Theatre Boxes', 'Popping Candy', 'Novelty', 'Lollipops',
      'Chocolates', 'Bars', 'Cadbury', 'Nestle', 'Whitakers', 'Imported Chocolates', 'Share bags',
      'Drinks', 'Hydration', 'Cans', 'Bottles', 'Multi Pack',
      'Snacks', 'Chips', 'Tackies', 'Cheetos', 'Kool Aid',
      'Bulk',
      'TikTok Viral', 'Peel me lollies', 'Freeze Dried Candies',
      'Pick by Colour', 'Red Colour', 'Blue Colour', 'Yellow Colour', 'Pink Colour', 'Black Colour',
      'Confectionery', 'Toys', 'Toys with Lolly',
      'Special / Clearance', 'Heading 1', 'Heading 2'
    ];
    const saved = localStorage.getItem('hc_categories');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length <= 4 && parsed.includes('Gummies')) {
        return defaultCats;
      }
      return parsed;
    }
    return defaultCats;
  });

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

  const [theme] = useState('light');

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

    // Poll for new orders and contacts in real-time
    const pollInterval = setInterval(() => {
      fetchOrders();
      fetchContacts();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (res.ok && data && data.marqueeText) {
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
        headers: { 'Content-Type': 'application/json' },
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
    localStorage.setItem('hc_theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

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
      }
      const res = await fetch(`/api/orders/${orderId}/delivery`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ deliveryCompany, deliveryReference })
      });
      const data = await res.json();
      setOrders(prev =>
        prev.map(ord => (ord.id === orderId ? { ...ord, deliveryCompany: data.deliveryCompany, deliveryReference: data.deliveryReference } : ord))
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


  const addCategory = (categoryName) => {
    if (!categoryName) return false;
    const trimmed = categoryName.trim();
    if (categories.some(cat => cat.toLowerCase() === trimmed.toLowerCase())) {
      return false;
    }
    const capitalized = trimmed
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    setCategories(prev => [...prev, capitalized]);
    return true;
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

  const logout = () => {
    setCurrentUser(null);
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
        removeOrderItem
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
