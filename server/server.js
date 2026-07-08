import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dns from 'dns';
import { fileURLToPath } from 'url';
import { ensureDatabase, sqlReady } from './db.js';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.log('Failed to set DNS servers:', e.message);
}
import { Product, User, Order, Contact, Brand, Testimonial, Settings } from './db.js';
import { initialProducts, initialBrands, defaultUsers, defaultTestimonials } from './fallbackData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Secure cryptographic password hashing helpers (PBKDF2)
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, hashedPassword) => {
  if (!hashedPassword) return false;
  if (!hashedPassword.includes(':')) {
    // Backwards compatibility for plain-text fallback accounts (e.g. seeded demo accounts)
    return password === hashedPassword;
  }
  const [salt, originalHash] = hashedPassword.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return hash === originalHash;
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

ensureDatabase();

const sqlAvailable = () => sqlReady();

// ── LOCAL FILE DATABASE UTILITIES ──
const DATA_DIR = process.env.VERCEL
  ? path.resolve('/tmp', 'lollyshop-data')
  : path.resolve(__dirname, 'data');
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.log('Local data directory check deferred (expected in read-only serverless environment):', err.message);
}

const getLocalFile = (filename) => path.join(DATA_DIR, filename);

const localCache = {};

const readLocalData = (filename, defaultVal = []) => {
  const file = getLocalFile(filename);
  try {
    if (!fs.existsSync(file)) {
      try {
        fs.writeFileSync(file, JSON.stringify(defaultVal, null, 2));
      } catch (writeErr) {
        // Safe to ignore on serverless environments
      }
      return defaultVal;
    }
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (err) {
    if (!localCache[filename]) {
      localCache[filename] = defaultVal;
    }
    return localCache[filename];
  }
};

const writeLocalData = (filename, data) => {
  try {
    fs.writeFileSync(getLocalFile(filename), JSON.stringify(data, null, 2));
  } catch (err) {
    localCache[filename] = data;
  }
};

// Map seed products to include weightPrices
const seededProducts = initialProducts.map((p, idx) => ({
  id: `p-${idx + 1}`,
  ...p,
  weightPrices: p.weightPrices || {
    '100g': p.price,
    '250g': Number((p.price * 2.2).toFixed(2)),
    '500g': Number((p.price * 4.0).toFixed(2)),
    '1kg': Number((p.price * 7.5).toFixed(2))
  }
}));

const seededBrands = initialBrands.map((b, idx) => ({
  id: `b-${idx + 1}`,
  ...b
}));

const seededUsers = defaultUsers.map((u, idx) => ({
  id: `u-${idx + 1}`,
  ...u
}));

const seededTestimonials = defaultTestimonials.map((t, idx) => ({
  id: `t-${idx + 1}`,
  ...t
}));

const defaultSettings = {
  marqueeText: "🍬 NZ'S FAVORITE CANDY STORE — FREE SHIPPING ON ORDERS OVER $50! | 🍭 GET 10% OFF YOUR FIRST ORDER WITH CODE: SWEET10",
  popupOffer: {
    enabled: true,
    delay: 3000,
    title: "🎉 Special Sweet Deal!",
    description: "Get 15% off on all sour gummies this weekend. Use code at checkout!",
    code: "SOUR15",
    image: ""
  },
  popupOffers: [
    {
      enabled: true,
      delay: 3000,
      title: "🎉 Special Sweet Deal!",
      description: "Get 15% off on all sour gummies this weekend. Use code at checkout!",
      code: "SOUR15",
      image: ""
    },
    {
      enabled: true,
      delay: 6000,
      title: "🍬 Weekend Choc Treat!",
      description: "Double the joy with 20% off all Swiss chocolates. Code: CHOCO20",
      code: "CHOCO20",
      image: ""
    }
  ],
  megaMenu: [
    {
      title: 'NZ Lollies',
      items: ['Soft Lollies', 'Hard Lollies', 'Sour Lollies', 'Sweet Lollies', 'Sugar Coated', 'Mayceys', 'Finni', 'Pascals', 'Other', 'Sugar Free', 'Vegan', 'Jellybeans']
    },
    {
      title: 'Imported Lollies',
      items: ['Airheads', 'Cotton Candy', 'Theatre Boxes', 'Popping Candy', 'Novelty', 'Lollipops', 'Sugar Free', 'Vegan']
    },
    {
      title: 'Chocolates',
      items: ['Bars', 'Cadbury', 'Nestle', 'Whitakers', 'Imported Chocolates', 'Share bags', 'Sugar Free', 'Vegan']
    },
    {
      title: 'Drinks',
      items: ['Hydration', 'Cans', 'Bottles', 'Multi Pack', 'Sugar Free']
    },
    {
      title: 'Snacks',
      items: ['Chips', 'Tackies', 'Cheetos', 'Kool Aid']
    },
    {
      title: 'Bulk',
      items: ['Soft Lollies', 'Hard Lollies', 'Chocolates']
    },
    {
      title: 'TikTok Viral',
      items: ['Peel me lollies', 'Freeze Dried Candies']
    },
    {
      title: 'Pick by Colour',
      items: ['Red Colour', 'Blue Colour', 'Yellow Colour', 'Pink Colour', 'Black Colour']
    },
    {
      title: 'Confectionery',
      items: ['Toys', 'Toys with Lolly']
    },
    {
      title: 'Special / Clearance',
      items: ['Heading 1', 'Heading 2']
    }
  ]
};

// Pre-initialize local files
readLocalData('products.json', seededProducts);
readLocalData('brands.json', seededBrands);
readLocalData('users.json', seededUsers);
readLocalData('testimonials.json', seededTestimonials);
readLocalData('orders.json', []);
readLocalData('contacts.json', []);
readLocalData('settings.json', defaultSettings);

// ── PRODUCTS API ──
app.get('/api/products', async (req, res) => {
  try {
    if (sqlAvailable()) {
      const products = await Product.find().sort({ createdAt: -1 });
      res.json(products);
    } else {
      const products = readLocalData('products.json', seededProducts);
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    if (sqlAvailable()) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } else {
      const products = readLocalData('products.json', seededProducts);
      const product = products.find(p => String(p.id) === String(req.params.id));
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product', error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    if (req.body.quantity !== undefined) {
      req.body.quantity = Math.max(0, Number(req.body.quantity) || 0);
      req.body.inStock = req.body.quantity > 0;
    } else {
      req.body.quantity = 50;
      req.body.inStock = true;
    }

    if (sqlAvailable()) {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.status(201).json(newProduct);
    } else {
      const products = readLocalData('products.json', seededProducts);
      const newProduct = {
        id: `p-${Date.now()}`,
        ...req.body,
        weightPrices: req.body.weightPrices || {
          '100g': req.body.price,
          '250g': Number((req.body.price * 2.2).toFixed(2)),
          '500g': Number((req.body.price * 4.0).toFixed(2)),
          '1kg': Number((req.body.price * 7.5).toFixed(2))
        },
        createdAt: new Date().toISOString()
      };
      products.unshift(newProduct);
      writeLocalData('products.json', products);
      res.status(201).json(newProduct);
    }
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    if (req.body.quantity !== undefined) {
      req.body.quantity = Math.max(0, Number(req.body.quantity) || 0);
      req.body.inStock = req.body.quantity > 0;
    }

    if (sqlAvailable()) {
      const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: 'Product not found' });
      res.json(updated);
    } else {
      const products = readLocalData('products.json', seededProducts);
      const index = products.findIndex(p => String(p.id) === String(req.params.id));
      if (index === -1) return res.status(404).json({ message: 'Product not found' });
      
      const updatedProduct = {
        ...products[index],
        ...req.body,
        weightPrices: req.body.weightPrices || products[index].weightPrices,
        updatedAt: new Date().toISOString()
      };
      products[index] = updatedProduct;
      writeLocalData('products.json', products);
      res.json(updatedProduct);
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    if (sqlAvailable()) {
      const deleted = await Product.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Product not found' });
      res.json({ message: 'Product successfully deleted' });
    } else {
      const products = readLocalData('products.json', seededProducts);
      const filtered = products.filter(p => String(p.id) !== String(req.params.id));
      if (products.length === filtered.length) {
        return res.status(404).json({ message: 'Product not found' });
      }
      writeLocalData('products.json', filtered);
      res.json({ message: 'Product successfully deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

app.put('/api/products/:id/stock', async (req, res) => {
  try {
    const { inStock } = req.body;
    if (sqlAvailable()) {
      // If toggled to In Stock but quantity is 0, give it a default stock of 10
      const updateData = { inStock };
      if (inStock) {
        const prod = await Product.findById(req.params.id);
        if (prod && (!prod.quantity || prod.quantity <= 0)) {
          updateData.quantity = 10;
        }
      } else {
        updateData.quantity = 0;
      }

      const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!updated) return res.status(404).json({ message: 'Product not found' });
      res.json(updated);
    } else {
      const products = readLocalData('products.json', seededProducts);
      const index = products.findIndex(p => String(p.id) === String(req.params.id));
      if (index === -1) return res.status(404).json({ message: 'Product not found' });
      
      products[index].inStock = inStock;
      if (inStock) {
        if (!products[index].quantity || products[index].quantity <= 0) {
          products[index].quantity = 10;
        }
      } else {
        products[index].quantity = 0;
      }
      writeLocalData('products.json', products);
      res.json(products[index]);
    }
  } catch (error) {
    res.status(400).json({ message: 'Error toggling product stock status', error: error.message });
  }
});

app.put('/api/products/:id/quantity', async (req, res) => {
  try {
    let { quantity } = req.body;
    quantity = Math.max(0, Number(quantity) || 0);
    const inStock = quantity > 0;

    if (sqlAvailable()) {
      const updated = await Product.findByIdAndUpdate(req.params.id, { quantity, inStock }, { new: true });
      if (!updated) return res.status(404).json({ message: 'Product not found' });
      res.json(updated);
    } else {
      const products = readLocalData('products.json', seededProducts);
      const index = products.findIndex(p => p.id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Product not found' });
      
      products[index].quantity = quantity;
      products[index].inStock = inStock;
      writeLocalData('products.json', products);
      res.json(products[index]);
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating product quantity', error: error.message });
  }
});

app.post('/api/products/:id/reviews', async (req, res) => {
  try {
    const { userName, rating, comment } = req.body;
    const rate = Number(rating);
    if (!userName || isNaN(rate) || rate < 1 || rate > 5 || !comment) {
      return res.status(400).json({ message: 'Missing or invalid review fields' });
    }

    if (sqlAvailable()) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      
      const newReview = { userName, rating: rate, comment };
      product.reviews = product.reviews || [];
      product.reviews.push(newReview);
      
      const totalReviews = product.reviews.length;
      const totalRatingSum = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
      product.reviewsCount = totalReviews;
      product.rating = Number((totalRatingSum / totalReviews).toFixed(1));
      
      await product.save();
      res.status(201).json(product);
    } else {
      const products = readLocalData('products.json', seededProducts);
      const index = products.findIndex(p => p.id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Product not found' });
      
      const product = products[index];
      product.reviews = product.reviews || [];
      const newReview = {
        id: `r-${Date.now()}`,
        userName,
        rating: rate,
        comment,
        createdAt: new Date().toISOString()
      };
      product.reviews.push(newReview);
      
      const totalReviews = product.reviews.length;
      const totalRatingSum = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
      product.reviewsCount = totalReviews;
      product.rating = Number((totalRatingSum / totalReviews).toFixed(1));
      
      products[index] = product;
      writeLocalData('products.json', products);
      res.status(201).json(product);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
});

app.delete('/api/products/:id/reviews/:reviewId', async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    if (sqlAvailable()) {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      
      product.reviews = product.reviews.filter(r => r._id.toString() !== reviewId);
      
      const totalReviews = product.reviews.length;
      if (totalReviews > 0) {
        const totalRatingSum = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
        product.reviewsCount = totalReviews;
        product.rating = Number((totalRatingSum / totalReviews).toFixed(1));
      } else {
        product.reviewsCount = 0;
        product.rating = 5.0;
      }
      
      await product.save();
      res.json(product);
    } else {
      const products = readLocalData('products.json', seededProducts);
      const index = products.findIndex(p => p.id === id);
      if (index === -1) return res.status(404).json({ message: 'Product not found' });
      
      const product = products[index];
      product.reviews = (product.reviews || []).filter(r => String(r.id || r._id) !== String(reviewId));
      
      const totalReviews = product.reviews.length;
      if (totalReviews > 0) {
        const totalRatingSum = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
        product.reviewsCount = totalReviews;
        product.rating = Number((totalRatingSum / totalReviews).toFixed(1));
      } else {
        product.reviewsCount = 0;
        product.rating = 5.0;
      }
      
      products[index] = product;
      writeLocalData('products.json', products);
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
});

// ── BRANDS API ──
app.get('/api/brands', async (req, res) => {
  try {
    if (sqlAvailable()) {
      const brands = await Brand.find();
      res.json(brands);
    } else {
      const brands = readLocalData('brands.json', seededBrands);
      res.json(brands);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching brands', error: error.message });
  }
});

app.post('/api/brands', async (req, res) => {
  try {
    if (sqlAvailable()) {
      const newBrand = new Brand(req.body);
      await newBrand.save();
      res.status(201).json(newBrand);
    } else {
      const brands = readLocalData('brands.json', seededBrands);
      const newBrand = {
        id: `b-${Date.now()}`,
        ...req.body
      };
      brands.push(newBrand);
      writeLocalData('brands.json', brands);
      res.status(201).json(newBrand);
    }
  } catch (error) {
    res.status(400).json({ message: 'Error creating brand', error: error.message });
  }
});

app.put('/api/brands/:id', async (req, res) => {
  try {
    if (sqlAvailable()) {
      const updated = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: 'Brand not found' });
      res.json(updated);
    } else {
      const brands = readLocalData('brands.json', seededBrands);
      const index = brands.findIndex(b => b.id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Brand not found' });
      
      const updatedBrand = {
        ...brands[index],
        ...req.body
      };
      brands[index] = updatedBrand;
      writeLocalData('brands.json', brands);
      res.json(updatedBrand);
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating brand', error: error.message });
  }
});

app.delete('/api/brands/:id', async (req, res) => {
  try {
    if (sqlAvailable()) {
      const deleted = await Brand.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Brand not found' });
      res.json({ message: 'Brand successfully deleted' });
    } else {
      const brands = readLocalData('brands.json', seededBrands);
      const filtered = brands.filter(b => b.id !== req.params.id);
      if (brands.length === filtered.length) {
        return res.status(404).json({ message: 'Brand not found' });
      }
      writeLocalData('brands.json', filtered);
      res.json({ message: 'Brand successfully deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting brand', error: error.message });
  }
});

// ── ORDERS API ──
app.get('/api/orders', async (req, res) => {
  try {
    if (sqlAvailable()) {
      const orders = await Order.find().sort({ createdAt: -1 });
      res.json(orders);
    } else {
      const orders = readLocalData('orders.json', []);
      res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// helper to send order confirmation email with receipt, invoice, and tracking link
const sendOrderConfirmationEmail = async (order, isUpdate = false) => {
  try {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      console.log('Skipping order confirmation email: SMTP credentials not set.');
      return;
    }

    let transporter;
    if (host && host.includes('gmail.com')) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: smtpUser, pass: smtpPass }
      });
    } else if (host) {
      transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: { user: smtpUser, pass: smtpPass }
      });
    } else {
      console.log('Skipping order confirmation email: SMTP host not set.');
      return;
    }

    const trackingLink = `http://localhost:5173/track-order/${order.id}`;

    // Format invoice items
    const itemsHtml = order.items.map(item => `
      <tr style="border-bottom: 1px solid #f1eff5; font-size: 14px;">
        <td style="padding: 12px 5px; color: #2d2645; font-weight: 600;">
          ${item.name} <br/>
          <span style="font-size: 11px; color: #8c859d; font-weight: 500; text-transform: uppercase;">Weight: ${item.selectedWeight}</span>
        </td>
        <td style="padding: 12px 5px; color: #615a75; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 5px; color: #615a75; text-align: right;">$${Number(item.price).toFixed(2)}</td>
        <td style="padding: 12px 5px; color: #2d2645; font-weight: 700; text-align: right;">$${Number(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const isTestEmail = order.customer.email.toLowerCase().includes('test') || 
                        order.customer.email.toLowerCase() === 'prayagkansara05@gmail.com';
    const shouldBcc = !isUpdate && !isTestEmail;

    const info = await transporter.sendMail({
      from: `"Lolly Shop Orders" <${smtpUser}>`,
      to: order.customer.email,
      ...(shouldBcc ? { bcc: 'bestlollyshopnz@gmail.com' } : {}),
      subject: isUpdate 
        ? `Lolly Shop - Order Updated! Revised Receipt & Invoice ${order.id}` 
        : `Lolly Shop - Order Confirmed! Receipt & Invoice ${order.id}`,
      text: isUpdate 
        ? `Your order ${order.id} has been updated. Track your live delivery here: ${trackingLink}` 
        : `Thank you for your order, ${order.customer.name}! Order ID: ${order.id}. Track your live delivery here: ${trackingLink}`,
      html: `
        <div style="background-color: #faf9fc; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(79, 70, 229, 0.05); border: 1px solid #f1eff5;">
            <!-- Brand Banner Header -->
            <div style="background: linear-gradient(135deg, #e72c83 0%, #9013fe 100%); padding: 35px 20px; text-align: center;">
              <span style="font-size: 40px; display: block; margin-bottom: 10px;">🍬</span>
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Lolly Shop</h1>
              <p style="color: rgba(255,255,255,0.85); font-size: 13px; margin: 5px 0 0 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                ${isUpdate ? 'Order Updated & Revised Invoice' : 'Order Confirmation & Invoice'}
              </p>
            </div>
            
            <!-- Email Body Content -->
            <div style="padding: 45px 35px;">
              <h2 style="color: #2d2645; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
                ${isUpdate ? 'Your Order Has Been Updated!' : 'Thank You for Your Order!'}
              </h2>
              
              <p style="color: #615a75; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                Hi <strong>${order.customer.name}</strong>,
              </p>
              
              <p style="color: #615a75; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                ${isUpdate 
                  ? 'We have adjusted your order contents as requested or based on stock availability. Please find your revised order details below:' 
                  : 'Your order has been confirmed and is currently being prepared by our sweet experts. Below is your detailed receipt and invoice:'
                }
              </p>
              
              <!-- Order Info Metadata Grid -->
              <div style="background-color: #faf9fc; border-radius: 12px; padding: 20px; margin-bottom: 30px; border: 1px solid #f1eff5;">
                <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;"><span style="color: #8c859d; font-weight: 600;">Order ID:</span><span style="color: #2d2645; font-weight: 700; font-family: monospace;">${order.id}</span></div>
                <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;"><span style="color: #8c859d; font-weight: 600;">Order Date:</span><span style="color: #2d2645; font-weight: 600;">${order.date || new Date().toLocaleDateString('en-NZ')}</span></div>
                <div style="display: flex; justify-content: space-between; font-size: 14px;"><span style="color: #8c859d; font-weight: 600;">Delivery Status:</span><span style="color: #e72c83; font-weight: 700; text-transform: uppercase; font-size: 12px;">${order.status || 'Processing'}</span></div>
              </div>
              
              <!-- Shipping Address Box -->
              <div style="background-color: #ffffff; border-radius: 12px; padding: 20px; margin-bottom: 35px; border: 1px solid #f1eff5; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                <h3 style="color: #2d2645; font-size: 14px; font-weight: 700; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #faf9fc; padding-bottom: 8px;">📍 Shipping Address</h3>
                <p style="color: #615a75; font-size: 14px; line-height: 1.5; margin: 0;">
                  <strong>${order.customer.name}</strong><br/>
                  ${order.customer.address}<br/>
                  ${order.customer.city}, ${order.customer.postalCode}<br/>
                  📞 ${order.customer.phone}
                </p>
              </div>

              <!-- Invoice Items Table -->
              <h3 style="color: #2d2645; font-size: 14px; font-weight: 700; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px;">📋 Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 30px;">
                <thead>
                  <tr style="border-bottom: 2px solid #f1eff5;">
                    <th style="padding: 10px 5px; font-size: 13px; color: #8c859d; font-weight: 700; text-transform: uppercase;">Item / Weight</th>
                    <th style="padding: 10px 5px; font-size: 13px; color: #8c859d; font-weight: 700; text-transform: uppercase; text-align: center;">Qty</th>
                    <th style="padding: 10px 5px; font-size: 13px; color: #8c859d; font-weight: 700; text-transform: uppercase; text-align: right;">Price</th>
                    <th style="padding: 10px 5px; font-size: 13px; color: #8c859d; font-weight: 700; text-transform: uppercase; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr style="border-bottom: 1.5px solid #f1eff5; font-size: 14px;">
                    <td style="padding: 12px 5px; color: #2d2645; font-weight: 600;">
                      Flat Shipping Fee <br/>
                      <span style="font-size: 11px; color: #8c859d; font-weight: 500; text-transform: uppercase;">Courier Delivery</span>
                    </td>
                    <td style="padding: 12px 5px; color: #615a75; text-align: center;">1</td>
                    <td style="padding: 12px 5px; color: #615a75; text-align: right;">$${Number(order.shipping !== undefined ? order.shipping : 19).toFixed(2)}</td>
                    <td style="padding: 12px 5px; color: #2d2645; font-weight: 700; text-align: right;">$${Number(order.shipping !== undefined ? order.shipping : 19).toFixed(2)}</td>
                  </tr>
                  <tr style="border-top: 2px solid #f1eff5;">
                    <td colspan="2"></td>
                    <td style="padding: 15px 5px; font-size: 15px; color: #2d2645; font-weight: 700; text-align: right;">Grand Total:</td>
                    <td style="padding: 15px 5px; font-size: 18px; color: #e72c83; font-weight: 800; text-align: right;">$${Number(order.total).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <!-- Realtime Delivery Locator Button -->
              <div style="background-color: #f7f6f9; border-radius: 16px; padding: 25px 20px; text-align: center; border: 1.5px dashed #e1dde6; margin-bottom: 30px;">
                <h4 style="margin: 0 0 10px 0; color: #2d2645; font-size: 15px; font-weight: 700;">🚚 Live Delivery Tracking</h4>
                <p style="margin: 0 0 20px 0; color: #615a75; font-size: 13px; line-height: 1.4;">Track your sweet package in real-time as the driver routes to your location!</p>
                <a href="${trackingLink}" style="background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%); color: #ffffff; padding: 14px 32px; border-radius: 50px; font-weight: 700; font-size: 14px; text-decoration: none; display: inline-block; box-shadow: 0 6px 18px rgba(79, 172, 254, 0.35); text-transform: uppercase; letter-spacing: 0.8px;">
                  Locate Delivery Live ➔
                </a>
              </div>

              <!-- Fallback Direct URL -->
              <p style="font-size: 11px; color: #8c859d; text-align: center; margin: 0;">
                Or copy and paste this link into your browser:<br/>
                <a href="${trackingLink}" style="color: #00b4d8; text-decoration: none; font-weight: 600;">${trackingLink}</a>
              </p>
            </div>
            
            <!-- Email Footer -->
            <div style="background-color: #faf9fc; padding: 25px 35px; border-top: 1px solid #f1eff5; text-align: center;">
              <p style="font-size: 11px; color: #b4afc4; margin: 0 0 8px 0; line-height: 1.5;">
                Need help with your order? Reply directly to this email or contact us at <a href="mailto:BestLollyShop@gmail.com" style="color: #e72c83; text-decoration: none; font-weight: 600;">BestLollyShop@gmail.com</a>.
              </p>
              <p style="font-size: 11px; color: #b4afc4; margin: 0;">
                © 2026 Lolly Shop New Zealand. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    });
    console.log(`[Order Confirmation] Email successfully sent to ${order.customer.email}. MessageID: ${info.messageId}`);
  } catch (err) {
    console.error('Error sending order confirmation email:', err);
  }
};

app.post('/api/orders', async (req, res) => {
  try {
    if (sqlAvailable()) {
      const newOrder = new Order(req.body);
      await newOrder.save();

      // Deduct product stock quantities in MongoDB
      for (const item of req.body.items || []) {
        const prod = await Product.findById(item.id);
        if (prod) {
          prod.quantity = Math.max(0, (prod.quantity !== undefined ? prod.quantity : 50) - item.quantity);
          prod.inStock = prod.quantity > 0;
          await prod.save();
        }
      }

      sendOrderConfirmationEmail(newOrder);
      res.status(201).json(newOrder);
    } else {
      const orders = readLocalData('orders.json', []);
      const newOrder = {
        ...req.body,
        createdAt: new Date().toISOString()
      };
      orders.unshift(newOrder);
      writeLocalData('orders.json', orders);

      // Deduct product stock quantities locally
      const localProducts = readLocalData('products.json', seededProducts);
      for (const item of req.body.items || []) {
        const index = localProducts.findIndex(p => p.id === item.id);
        if (index !== -1) {
          const currentQty = localProducts[index].quantity !== undefined ? localProducts[index].quantity : 50;
          localProducts[index].quantity = Math.max(0, currentQty - item.quantity);
          localProducts[index].inStock = localProducts[index].quantity > 0;
        }
      }
      writeLocalData('products.json', localProducts);

      sendOrderConfirmationEmail(newOrder);
      res.status(201).json(newOrder);
    }
  } catch (error) {
    res.status(400).json({ message: 'Error creating order', error: error.message });
  }
});

// helper to send order dispatched email with courier details
const sendOrderDispatchedEmail = async (order) => {
  try {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      console.log('Skipping order dispatched email: SMTP credentials not set.');
      return;
    }

    let transporter;
    if (host && host.includes('gmail.com')) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: smtpUser, pass: smtpPass }
      });
    } else if (host) {
      transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: { user: smtpUser, pass: smtpPass }
      });
    } else {
      console.log('Skipping order dispatched email: SMTP host not set.');
      return;
    }

    const trackingLink = `http://localhost:5173/track-order/${order.id}`;

    // Format invoice items
    const itemsHtml = (order.items || []).map(item => `
      <tr style="border-bottom: 1px solid #f1eff5; font-size: 14px;">
        <td style="padding: 12px 5px; color: #2d2645; font-weight: 600;">
          ${item.name || ''} <br/>
          <span style="font-size: 11px; color: #8c859d; font-weight: 500; text-transform: uppercase;">Weight: ${item.selectedWeight || ''}</span>
        </td>
        <td style="padding: 12px 5px; color: #615a75; text-align: center;">${item.quantity || 1}</td>
        <td style="padding: 12px 5px; color: #615a75; text-align: right;">$${Number(item.price || 0).toFixed(2)}</td>
        <td style="padding: 12px 5px; color: #2d2645; font-weight: 700; text-align: right;">$${Number((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
      </tr>
    `).join('');

    const info = await transporter.sendMail({
      from: `"Lolly Shop Deliveries" <${smtpUser}>`,
      to: order.customer.email,
      subject: `Lolly Shop - Package Dispatched! ORD-${order.id}`,
      text: `Your Lolly Shop order ${order.id} has been dispatched via ${order.deliveryCompany}! Tracking Reference: ${order.deliveryReference}. Track your live delivery here: ${trackingLink}`,
      html: `
        <div style="background-color: #faf9fc; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(79, 70, 229, 0.05); border: 1px solid #f1eff5;">
            <!-- Brand Banner Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #0284c7 100%); padding: 35px 20px; text-align: center;">
              <span style="font-size: 40px; display: block; margin-bottom: 10px;">🚚</span>
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Package Dispatched!</h1>
              <p style="color: rgba(255,255,255,0.85); font-size: 13px; margin: 5px 0 0 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">On Its Way to You</p>
            </div>
            
            <!-- Email Body Content -->
            <div style="padding: 45px 35px;">
              <h2 style="color: #2d2645; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">Your Sweets are Shipped!</h2>
              
              <p style="color: #615a75; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                Hi <strong>${order.customer.name}</strong>,
              </p>
              
              <p style="color: #615a75; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                Great news! Your handpicked candy treasures have been handed over to our local delivery partner <strong>${order.deliveryCompany}</strong> for fast courier delivery.
              </p>

              <!-- Tracking Reference Card -->
              <div style="background: #faf9fc; border: 1.5px solid #e1dde6; padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
                <span style="display: block; font-size: 10px; font-weight: 800; color: #10b981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
                  Delivery Company
                </span>
                <strong style="display: block; font-size: 18px; color: #2d2645; margin-bottom: 16px;">
                  ${order.deliveryCompany}
                </strong>
                <span style="display: block; font-size: 10px; font-weight: 800; color: #10b981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
                  Tracking Reference ID
                </span>
                <strong style="display: block; font-size: 20px; font-family: monospace; color: #2d2645; background: #ffffff; padding: 8px 15px; border-radius: 8px; border: 1px solid #f1eff5; display: inline-block;">
                  ${order.deliveryReference}
                </strong>
              </div>

              <!-- Tracking Action Button -->
              <div style="text-align: center; margin-bottom: 35px;">
                <a href="${trackingLink}" style="background: linear-gradient(135deg, #e72c83 0%, #9013fe 100%); color: #ffffff; padding: 14px 32px; border-radius: 50px; font-weight: 700; font-size: 14px; text-decoration: none; display: inline-block; box-shadow: 0 10px 20px rgba(231, 44, 131, 0.25);">
                  Track Delivery Live ➔
                </a>
              </div>
              
              <!-- Customer Details Column -->
              <div style="background-color: #faf9fc; border-radius: 16px; padding: 25px; border: 1px solid #f1eff5; margin-bottom: 35px;">
                <h4 style="margin: 0 0 10px 0; color: #2d2645; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Shipping Address</h4>
                <p style="color: #615a75; font-size: 14px; line-height: 1.5; margin: 0;">
                  <strong>${order.customer.name}</strong><br/>
                  ${order.customer.address}<br/>
                  ${order.customer.city}, ${order.customer.postalCode}<br/>
                  📞 ${order.customer.phone}
                </p>
              </div>

              <!-- Order Summary Items Table -->
              <h3 style="color: #2d2645; font-size: 14px; font-weight: 700; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px;">📋 Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 30px;">
                <thead>
                  <tr style="border-bottom: 2px solid #f1eff5;">
                    <th style="padding: 10px 5px; font-size: 13px; color: #8c859d; font-weight: 700; text-transform: uppercase;">Item / Weight</th>
                    <th style="padding: 10px 5px; font-size: 13px; color: #8c859d; font-weight: 700; text-transform: uppercase; text-align: center;">Qty</th>
                    <th style="padding: 10px 5px; font-size: 13px; color: #8c859d; font-weight: 700; text-transform: uppercase; text-align: right;">Price</th>
                    <th style="padding: 10px 5px; font-size: 13px; color: #8c859d; font-weight: 700; text-transform: uppercase; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr style="border-bottom: 1.5px solid #f1eff5; font-size: 14px;">
                    <td style="padding: 12px 5px; color: #2d2645; font-weight: 600;">
                      Flat Shipping Fee <br/>
                      <span style="font-size: 11px; color: #8c859d; font-weight: 500; text-transform: uppercase;">Courier Delivery</span>
                    </td>
                    <td style="padding: 12px 5px; color: #615a75; text-align: center;">1</td>
                    <td style="padding: 12px 5px; color: #615a75; text-align: right;">$${Number(order.shipping !== undefined ? order.shipping : 19).toFixed(2)}</td>
                    <td style="padding: 12px 5px; color: #2d2645; font-weight: 700; text-align: right;">$${Number(order.shipping !== undefined ? order.shipping : 19).toFixed(2)}</td>
                  </tr>
                  <tr style="font-size: 16px;">
                    <td colspan="3" style="padding: 20px 5px 10px 5px; color: #8c859d; font-weight: 700; text-transform: uppercase; text-align: right;">Grand Total:</td>
                    <td style="padding: 20px 5px 10px 5px; color: #e72c83; font-weight: 800; text-align: right;">$${Number(order.total || 0).toFixed(2)} NZD</td>
                  </tr>
                </tbody>
              </table>
              
              <p style="font-size: 11px; color: #8c859d; margin: 0; text-align: center;">
                If you have any questions or need to make changes to your delivery, please contact our support team.
              </p>
            </div>
            
            <!-- Email Footer -->
            <div style="background-color: #faf9fc; padding: 25px 35px; border-top: 1px solid #f1eff5; text-align: center;">
              <p style="font-size: 11px; color: #b4afc4; margin: 0 0 8px 0; line-height: 1.5;">
                © 2026 Lolly Shop New Zealand. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    });
    console.log(`[Order Dispatched] Email successfully sent to ${order.customer.email}. MessageID: ${info.messageId}`);
  } catch (err) {
    console.error('Error sending order dispatched email:', err);
  }
};

// helper to send delivery complete email with rating review options and final invoice details
const sendDeliveryCompleteEmail = async (order) => {
  try {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      console.log('Skipping delivery completed email: SMTP credentials not set.');
      return;
    }

    let transporter;
    if (host && host.includes('gmail.com')) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: smtpUser, pass: smtpPass }
      });
    } else if (host) {
      transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: { user: smtpUser, pass: smtpPass }
      });
    } else {
      console.log('Skipping delivery completed email: SMTP host not set.');
      return;
    }

    const ratingLink = (stars) => `http://localhost:5173/track-order/${order.id}?rating=${stars}`;
    const trackingLink = `http://localhost:5173/track-order/${order.id}`;

    // Format invoice items
    const itemsHtml = (order.items || []).map(item => `
      <tr style="border-bottom: 1px solid #f1eff5; font-size: 14px;">
        <td style="padding: 12px 5px; color: #2d2645; font-weight: 600;">
          ${item.name || ''} <br/>
          <span style="font-size: 11px; color: #8c859d; font-weight: 500; text-transform: uppercase;">Weight: ${item.selectedWeight || ''}</span>
        </td>
        <td style="padding: 12px 5px; color: #615a75; text-align: center;">${item.quantity || 1}</td>
        <td style="padding: 12px 5px; color: #615a75; text-align: right;">$${Number(item.price || 0).toFixed(2)}</td>
        <td style="padding: 12px 5px; color: #2d2645; font-weight: 700; text-align: right;">$${Number((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
      </tr>
    `).join('');

    const info = await transporter.sendMail({
      from: `"Lolly Shop Deliveries" <${smtpUser}>`,
      to: order.customer.email,
      subject: `Lolly Shop - Package Delivered! ORD-${order.id}`,
      text: `Your Lolly Shop order ${order.id} has been delivered successfully! Please rate your confections here: ${ratingLink(5)}`,
      html: `
        <div style="background-color: #faf9fc; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(79, 70, 229, 0.05); border: 1px solid #f1eff5;">
            <!-- Brand Banner Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 35px 20px; text-align: center;">
              <span style="font-size: 40px; display: block; margin-bottom: 10px;">🎁</span>
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Delivered!</h1>
              <p style="color: rgba(255,255,255,0.85); font-size: 13px; margin: 5px 0 0 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your Sweet Package Has Arrived</p>
            </div>
            
            <!-- Email Body Content -->
            <div style="padding: 45px 35px;">
              <h2 style="color: #2d2645; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px; text-align: center;">We Hope You Love Your Treats!</h2>
              
              <p style="color: #615a75; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                Hi <strong>${order.customer.name}</strong>,
              </p>
              
              <p style="color: #615a75; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                Your confections order <strong>${order.id}</strong> has been successfully hand-delivered by ${order.deliveryCompany || 'Charlie'} to your shipping address.
              </p>

              <!-- Feedback / Star Ratings Container -->
              <div style="background-color: #faf9fc; border-radius: 16px; padding: 30px 20px; border: 1.5px dashed #e1dde6; margin-bottom: 35px; text-align: center;">
                <h4 style="margin: 0 0 8px 0; color: #2d2645; font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">⭐ Rate Your Candies ⭐</h4>
                <p style="margin: 0 0 20px 0; color: #615a75; font-size: 13px; line-height: 1.4;">How delicious were your confections? Click a star to submit your rating:</p>
                
                <div style="margin-bottom: 20px;">
                  <a href="${ratingLink(1)}" style="text-decoration: none; font-size: 32px; margin: 0 4px;">⭐</a>
                  <a href="${ratingLink(2)}" style="text-decoration: none; font-size: 32px; margin: 0 4px;">⭐</a>
                  <a href="${ratingLink(3)}" style="text-decoration: none; font-size: 32px; margin: 0 4px;">⭐</a>
                  <a href="${ratingLink(4)}" style="text-decoration: none; font-size: 32px; margin: 0 4px;">⭐</a>
                  <a href="${ratingLink(5)}" style="text-decoration: none; font-size: 32px; margin: 0 4px;">⭐</a>
                </div>
                
                <a href="${ratingLink(5)}" style="background: linear-gradient(135deg, #e72c83 0%, #9013fe 100%); color: #ffffff; padding: 12px 28px; border-radius: 50px; font-weight: 700; font-size: 13px; text-decoration: none; display: inline-block; box-shadow: 0 6px 15px rgba(231, 44, 131, 0.3);">
                  Write A Comment ➔
                </a>
              </div>

              <!-- Customer Shipping Details -->
              <div style="background-color: #faf9fc; border-radius: 16px; padding: 25px; border: 1px solid #f1eff5; margin-bottom: 35px;">
                <h4 style="margin: 0 0 10px 0; color: #2d2645; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Shipping Address</h4>
                <p style="color: #615a75; font-size: 14px; line-height: 1.5; margin: 0;">
                  <strong>${order.customer.name}</strong><br/>
                  ${order.customer.address}<br/>
                  ${order.customer.city}, ${order.customer.postalCode}<br/>
                  📞 ${order.customer.phone}
                </p>
              </div>

              <!-- Order Summary Items Table -->
              <h3 style="color: #2d2645; font-size: 14px; font-weight: 700; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px;">📋 Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 30px;">
                <thead>
                  <tr style="border-bottom: 2px solid #f1eff5;">
                    <th style="padding: 10px 5px; font-size: 13px; color: #8c859d; font-weight: 700; text-transform: uppercase;">Item / Weight</th>
                    <th style="padding: 10px 5px; font-size: 13px; color: #8c859d; font-weight: 700; text-transform: uppercase; text-align: center;">Qty</th>
                    <th style="padding: 10px 5px; font-size: 13px; color: #8c859d; font-weight: 700; text-transform: uppercase; text-align: right;">Price</th>
                    <th style="padding: 10px 5px; font-size: 13px; color: #8c859d; font-weight: 700; text-transform: uppercase; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr style="border-bottom: 1.5px solid #f1eff5; font-size: 14px;">
                    <td style="padding: 12px 5px; color: #2d2645; font-weight: 600;">
                      Flat Shipping Fee <br/>
                      <span style="font-size: 11px; color: #8c859d; font-weight: 500; text-transform: uppercase;">Courier Delivery</span>
                    </td>
                    <td style="padding: 12px 5px; color: #615a75; text-align: center;">1</td>
                    <td style="padding: 12px 5px; color: #615a75; text-align: right;">$${Number(order.shipping !== undefined ? order.shipping : 19).toFixed(2)}</td>
                    <td style="padding: 12px 5px; color: #2d2645; font-weight: 700; text-align: right;">$${Number(order.shipping !== undefined ? order.shipping : 19).toFixed(2)}</td>
                  </tr>
                  <tr style="font-size: 16px;">
                    <td colspan="3" style="padding: 20px 5px 10px 5px; color: #8c859d; font-weight: 700; text-transform: uppercase; text-align: right;">Grand Total:</td>
                    <td style="padding: 20px 5px 10px 5px; color: #e72c83; font-weight: 800; text-align: right;">$${Number(order.total || 0).toFixed(2)} NZD</td>
                  </tr>
                </tbody>
              </table>
              
              <p style="font-size: 11px; color: #8c859d; margin: 0; text-align: center;">
                If you have any feedback or concerns regarding your delivery, please reply directly to this email or track details on <a href="${trackingLink}">your tracking page</a>.
              </p>
            </div>
            
            <!-- Email Footer -->
            <div style="background-color: #faf9fc; padding: 25px 35px; border-top: 1px solid #f1eff5; text-align: center;">
              <p style="font-size: 11px; color: #b4afc4; margin: 0 0 8px 0; line-height: 1.5;">
                © 2026 Lolly Shop New Zealand. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    });
    console.log(`[Delivery Completed] Email successfully sent to ${order.customer.email}. MessageID: ${info.messageId}`);
  } catch (err) {
    console.error('Error sending delivery completed email:', err);
  }
};

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (sqlAvailable()) {
      const updated = await Order.findOneAndUpdate({ id: req.params.id }, { status }, { new: true });
      if (!updated) return res.status(404).json({ message: 'Order not found' });
      if (status === 'Completed') {
        sendDeliveryCompleteEmail(updated);
      }
      res.json(updated);
    } else {
      const orders = readLocalData('orders.json', []);
      const index = orders.findIndex(o => o.id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Order not found' });
      
      orders[index].status = status;
      writeLocalData('orders.json', orders);
      if (status === 'Completed') {
        sendDeliveryCompleteEmail(orders[index]);
      }
      res.json(orders[index]);
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating order status', error: error.message });
  }
});

app.put('/api/orders/:id/delivery', async (req, res) => {
  try {
    const { deliveryCompany, deliveryReference } = req.body;
    if (sqlAvailable()) {
      const oldOrder = await Order.findOne({ id: req.params.id });
      
      const updated = await Order.findOneAndUpdate(
        { id: req.params.id }, 
        { deliveryCompany, deliveryReference }, 
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: 'Order not found' });
      
      const wasEmptyBefore = !oldOrder?.deliveryCompany || !oldOrder?.deliveryReference;
      const isFilledNow = deliveryCompany && deliveryReference;
      const isChanged = oldOrder?.deliveryCompany !== deliveryCompany || oldOrder?.deliveryReference !== deliveryReference;
      
      if (isFilledNow && (wasEmptyBefore || isChanged)) {
        updated.status = 'Out for Delivery';
        await updated.save();
        sendOrderDispatchedEmail(updated);
      }
      res.json(updated);
    } else {
      const orders = readLocalData('orders.json', []);
      const index = orders.findIndex(o => o.id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Order not found' });
      
      const oldOrder = { ...orders[index] };
      orders[index].deliveryCompany = deliveryCompany || '';
      orders[index].deliveryReference = deliveryReference || '';
      
      const wasEmptyBefore = !oldOrder.deliveryCompany || !oldOrder.deliveryReference;
      const isFilledNow = deliveryCompany && deliveryReference;
      const isChanged = oldOrder.deliveryCompany !== deliveryCompany || oldOrder.deliveryReference !== deliveryReference;
      
      if (isFilledNow && (wasEmptyBefore || isChanged)) {
        orders[index].status = 'Out for Delivery';
        sendOrderDispatchedEmail(orders[index]);
      }
      writeLocalData('orders.json', orders);
      res.json(orders[index]);
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating order tracking details', error: error.message });
  }
});

app.put('/api/orders/:id/remove-item', async (req, res) => {
  try {
    const { itemId, selectedWeight } = req.body;
    if (sqlAvailable()) {
      const order = await Order.findOne({ id: req.params.id });
      if (!order) return res.status(404).json({ message: 'Order not found' });

      const itemToRemove = order.items.find(item => String(item.id) === String(itemId) && item.selectedWeight === selectedWeight);
      if (itemToRemove) {
        order.items = order.items.filter(item => !(String(item.id) === String(itemId) && item.selectedWeight === selectedWeight));
        const itemsSubtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        order.total = itemsSubtotal + (order.shipping !== undefined ? order.shipping : 19);
        await order.save();
        sendOrderConfirmationEmail(order, true);
      }
      res.json(order);
    } else {
      const orders = readLocalData('orders.json', []);
      const index = orders.findIndex(o => o.id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Order not found' });

      const order = orders[index];
      const itemToRemove = order.items.find(item => String(item.id) === String(itemId) && item.selectedWeight === selectedWeight);
      if (itemToRemove) {
        order.items = order.items.filter(item => !(String(item.id) === String(itemId) && item.selectedWeight === selectedWeight));
        const itemsSubtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        order.total = itemsSubtotal + (order.shipping !== undefined ? order.shipping : 19);
        writeLocalData('orders.json', orders);
        sendOrderConfirmationEmail(order, true);
      }
      res.json(order);
    }
  } catch (error) {
    res.status(400).json({ message: 'Error removing item from order', error: error.message });
  }
});

app.put('/api/orders/:id/feedback', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (sqlAvailable()) {
      const updated = await Order.findOneAndUpdate(
        { id: req.params.id },
        { feedback: { rating: Number(rating), comment } },
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: 'Order not found' });
      res.json(updated);
    } else {
      const orders = readLocalData('orders.json', []);
      const index = orders.findIndex(o => o.id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Order not found' });
      
      orders[index].feedback = { rating: Number(rating), comment };
      writeLocalData('orders.json', orders);
      res.json(orders[index]);
    }
  } catch (error) {
    res.status(400).json({ message: 'Error saving feedback', error: error.message });
  }
});

// ── TESTIMONIALS API ──
app.get('/api/testimonials', async (req, res) => {
  try {
    if (sqlAvailable()) {
      const count = await Testimonial.countDocuments();
      if (count === 0) {
        await Testimonial.insertMany(defaultTestimonials);
      }
      const testimonials = await Testimonial.find().sort({ createdAt: -1 });
      res.json(testimonials);
    } else {
      const testimonials = readLocalData('testimonials.json', seededTestimonials);
      res.json(testimonials);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testimonials', error: error.message });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const { name, role, quote, rating } = req.body;
    if (!name || !quote) {
      return res.status(400).json({ message: 'Name and quote are required' });
    }

    const newTestimonial = {
      name,
      role: role || 'Customer',
      quote,
      rating: Number(rating) || 5,
      avatar: name.charAt(0).toUpperCase()
    };

    if (sqlAvailable()) {
      const doc = new Testimonial(newTestimonial);
      await doc.save();
      res.status(201).json(doc);
    } else {
      const testimonials = readLocalData('testimonials.json', seededTestimonials);
      const doc = {
        id: `t-${Date.now()}`,
        ...newTestimonial,
        createdAt: new Date().toISOString()
      };
      testimonials.unshift(doc);
      writeLocalData('testimonials.json', testimonials);
      res.status(201).json(doc);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating testimonial', error: error.message });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (sqlAvailable()) {
      const deleted = await Testimonial.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'Testimonial not found' });
      res.json({ message: 'Testimonial successfully deleted' });
    } else {
      const testimonials = readLocalData('testimonials.json', seededTestimonials);
      const filtered = testimonials.filter(t => String(t.id || t._id) !== String(id));
      if (testimonials.length === filtered.length) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }
      writeLocalData('testimonials.json', filtered);
      res.json({ message: 'Testimonial successfully deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting testimonial', error: error.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // Accept both single-message and multi-turn conversation from the frontend
    const clientMessages = Array.isArray(req.body?.messages) && req.body.messages.length
      ? req.body.messages
      : [{ role: 'user', content: req.body?.message || req.body?.text || '' }];

    const lastUserMsg = clientMessages.filter(m => (m.role || 'user') !== 'assistant').slice(-1)[0]?.content || '';
    if (!String(lastUserMsg).trim()) {
      return res.status(400).json({ message: 'Missing chat message' });
    }

    // ── LOLLY SHOP PERSONA SYSTEM PROMPT ──────────────────────────────────────
    const systemPrompt = `You are "Lolly", the bubbly, sweet-obsessed AI assistant for Lolly Shop — New Zealand's most delightful online lolly store! 🍭

YOUR PERSONALITY:
- You speak with infectious enthusiasm, warmth, and lolly-flavoured charm
- Every response drips with sweetness — use playful wordplay like "sweet news!", "oh sugar!", "that's the cherry on top!"
- You LOVE lollies, sweets, and confectionery with your whole heart 💖
- You're knowledgeable, helpful, and always steer conversations towards our magical world of sweets
- You use emojis generously: 🍭🍬🍫🍋🍑🎀🌈🎉✨💖🍓🍒

LOLLY SHOP KNOWLEDGE BASE:
🏪 STORE: Lolly Shop NZ — premium quality sweets shipped across New Zealand
🚚 SHIPPING: FREE express shipping on orders over $50 NZD | Flat $5 NZD for smaller orders | 3-5 business days
💰 PRICING: Customisable bag sizes — 100g | 250g | 500g | 1kg (bigger bags = better value!)
🎟️ DISCOUNT: Use code SWEET10 for 10% OFF any order!
📧 SUPPORT: BestLollyShop@gmail.com | Contact form on the website
🔄 RETURNS: Due to food safety, opened packs can't be returned — but damaged orders? We'll fix it!

⭐ STAR PRODUCTS:
🍬 Gummies & Chews: Sour Neon Worms (tangy-coated bliss!), Fuzzy Peach Rings (juicy & chewy), Raspberry Straps, Berry Rings
🍫 Chocolates: Premium Dark Truffles (Belgian ganache!), Sea Salt Caramel Bar, Milk Choc Buttons
🍭 Lollipops: Rainbow Carousel Lollipop (retro vibes!), Blueberry Bubble Pop (bubblegum surprise inside!)
🌟 Fan Favourites: Raspberry Sherbet Bombs, Cola Bottles, Watermelon Slices, Strawberry Clouds
🌿 DIETARY: Many options are gluten-free & gelatin-free — check product pages for ingredients

CONVERSATION RULES:
1. ALWAYS answer the user's question helpfully and directly first
2. If asked about non-lolly topics (weather, coding, news, etc.), give a cheeky, sweet twist: "Oh that reminds me of our..."
3. Recommend 1-3 specific products naturally in your response when relevant
4. End EVERY response with either a question to keep conversation going OR a fun sweet fact/tip
5. Keep responses concise (2-4 short paragraphs max) — no walls of text!
6. Never sound robotic. Be warm, playful, and human-like
7. If asked about the admin portal: username=admin password=admin123 🔑

EXAMPLE STYLE:
User: "Do you have anything for a kids party?"
Lolly: "Oh sugar, do we EVER! 🎉🍭 For a kids' party, you absolutely cannot go wrong with our Rainbow Carousel Lollipops — they're Instagram-worthy AND delicious! Pair them with a 1kg bag of Sour Neon Worms for a tangy party bowl that'll have the little ones doing happy dances! 🐛✨ Don't forget code SWEET10 for 10% off — more lollies for less! 💖 How many guests are you expecting?"`;

    // ── FALLBACK (no API key) ──────────────────────────────────────────────────
    if (!apiKey) {
      const textLower = lastUserMsg.toLowerCase();
      let responseText;
      if (textLower.match(/hello|hi\b|hey|howdy|morning|evening/)) {
        responseText = "Hello gorgeous! Welcome to Lolly Shop! 🍭✨ Oh sugar, am I glad you're here! Whether you're craving tangy Sour Neon Worms, dreamy Belgian Dark Truffles, or iconic Rainbow Lollipops — you've found your sweet paradise! 🌈 What delicious craving can I help satisfy today?";
      } else if (textLower.match(/ship|deliver|postage|arrival/)) {
        responseText = "Sweet news on shipping! 🚚💨 We offer FREE express delivery across New Zealand on orders over $50 NZD! For smaller orders it's just a flat $5 — still a sweet deal! Your treats arrive in 3-5 business days, packed with love and care. Want to know which products qualify for free shipping? 🍬";
      } else if (textLower.match(/discount|coupon|promo|code|sale|offer/)) {
        responseText = "Oh you clever sweet-hunter! 🎟️✨ Use coupon code **SWEET10** at checkout for a juicy 10% OFF your entire order! The more you buy, the more you save — especially with our 1kg bags which are already our best value option! Ready to fill your cart? 🛒💖";
      } else if (textLower.match(/vegan|vegetarian|halal|gelatin|gluten|allerg/)) {
        responseText = "We LOVE catering to all our sweet friends! 🌿💚 Many of our lollies are gluten-free and gelatin-free — look for the dietary badges on each product page for exact details. Our Sugar-Free Berry Chews and most of our hard lollies are great starting points! Want me to suggest some specific options? 🍬";
      } else if (textLower.match(/best|popular|top|recommend|favourite|favorite/)) {
        responseText = "Oh picking favourites is SO hard when everything is delicious! 🏆🍭 But our absolute crowd-pleasers are: 1️⃣ Sour Neon Worms (tangy & irresistible!), 2️⃣ Premium Dark Truffles (pure Belgian bliss! 🍫), and 3️⃣ Raspberry Sherbet Bombs (one pop and you'll be hooked!). Want a 250g taster of any of these? 😋";
      } else {
        responseText = `Ooh, that's a sweet thought! 🍭 But speaking of sweet things — have you tried our legendary Sour Neon Worms yet? They're basically edible magic! ✨ Or maybe our Premium Dark Truffles are calling your name? 🍫 Use code SWEET10 for 10% off and treat yourself today! What flavour profile are you feeling — fruity & tangy, or rich & chocolatey? 🍋🍫`;
      }
      return res.json({ reply: responseText });
    }

    // ── GEMINI 1.5 FLASH CALL ─────────────────────────────────────────────────
    // Build multi-turn contents array for Gemini format
    const geminiContents = clientMessages.slice(-12).map(m => ({
      role: (m.role === 'assistant' || m.role === 'bot') ? 'model' : 'user',
      parts: [{ text: String(m.content || m.text || '') }]
    }));

    // Ensure the last turn is from the user
    if (!geminiContents.length || geminiContents[geminiContents.length - 1].role !== 'user') {
      geminiContents.push({ role: 'user', parts: [{ text: String(lastUserMsg) }] });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: geminiContents,
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 600,
          topP: 0.95
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText);
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text
      || data.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n')
      || "Oh sugar! 🍭 My sweet thoughts got tangled for a moment! Could you ask me again? I'm all ears and ready to help!";

    return res.json({ reply: replyText.trim() });
  } catch (error) {
    console.error('Error in chatbot API:', error);
    return res.status(500).json({ message: 'Error processing chatbot request', error: error.message });
  }
});

// ── CONTACT SUBMISSIONS API ──
app.get('/api/contacts', async (req, res) => {
  try {
    if (sqlAvailable()) {
      const submissions = await Contact.find().sort({ createdAt: -1 });
      res.json(submissions);
    } else {
      const submissions = readLocalData('contacts.json', []);
      res.json(submissions);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact requests', error: error.message });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    if (sqlAvailable()) {
      const newSubmission = new Contact(req.body);
      await newSubmission.save();
      res.status(201).json(newSubmission);
    } else {
      const submissions = readLocalData('contacts.json', []);
      const newSubmission = {
        id: `c-${Date.now()}`,
        ...req.body,
        createdAt: new Date().toISOString()
      };
      submissions.unshift(newSubmission);
      writeLocalData('contacts.json', submissions);
      res.status(201).json(newSubmission);
    }
  } catch (error) {
    res.status(400).json({ message: 'Error submitting contact form', error: error.message });
  }
});

// ── AUTH API ──
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const u = username.trim().toLowerCase();

    let queryEmail = u;
    if (u === 'admin') queryEmail = 'admin@lollyshop.co.nz';
    if (u === 'user') queryEmail = 'john@gmail.com';

    if (sqlAvailable()) {
      const user = await User.findOne({ email: { $regex: new RegExp(`^${queryEmail}$`, 'i') } });
      if (!user || !verifyPassword(password, user.password)) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
      res.json({
        success: true,
        user: { name: user.name, email: user.email, role: user.role }
      });
    } else {
      const users = readLocalData('users.json', seededUsers);
      const user = users.find(usr => usr.email.toLowerCase() === queryEmail.toLowerCase());
      if (!user || !verifyPassword(password, user.password)) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
      res.json({
        success: true,
        user: { name: user.name, email: user.email, role: user.role }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server authentication error', error: error.message });
  }
});

app.post('/api/auth/google-login', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    if (sqlAvailable()) {
      let user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
      if (!user) {
        // Register new Google user
        user = new User({
          name: name || 'Google User',
          email,
          password: `google-auth-${Date.now()}`,
          role: 'user'
        });
        await user.save();
      }
      res.json({
        success: true,
        user: { name: user.name, email: user.email, role: user.role }
      });
    } else {
      const users = readLocalData('users.json', seededUsers);
      let user = users.find(usr => usr.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        // Register new Google user in fallback JSON
        user = {
          id: `u-${Date.now()}`,
          name: name || 'Google User',
          email,
          password: `google-auth-${Date.now()}`,
          role: 'user'
        };
        users.push(user);
        writeLocalData('users.json', users);
      }
      res.json({
        success: true,
        user: { name: user.name, email: user.email, role: user.role }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Google authentication error', error: error.message });
  }
});

// ── REGISTER API ──
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const emailNorm = email.trim().toLowerCase();

    if (sqlAvailable()) {
      const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${emailNorm}$`, 'i') } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const user = new User({
        name,
        email: emailNorm,
        password: hashPassword(password),
        role: 'user'
      });
      await user.save();

      res.json({
        success: true,
        user: { name: user.name, email: user.email, role: user.role }
      });
    } else {
      const users = readLocalData('users.json', seededUsers);
      const existingUser = users.find(usr => usr.email.toLowerCase() === emailNorm);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const newUser = {
        id: `u-${Date.now()}`,
        name,
        email: emailNorm,
        password: hashPassword(password),
        role: 'user'
      };
      users.push(newUser);
      writeLocalData('users.json', users);

      res.json({
        success: true,
        user: { name: newUser.name, email: newUser.email, role: newUser.role }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration error', error: error.message });
  }
});

// ── FORGOT PASSWORD API ──
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const emailNorm = email.trim().toLowerCase();
    let userDetails = null;

    // Generate secure random hex token
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour expiration

    if (sqlAvailable()) {
      const user = await User.findOne({ email: { $regex: new RegExp(`^${emailNorm}$`, 'i') } });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User with this email not found' });
      }
      user.resetPasswordToken = token;
      user.resetPasswordExpires = expires;
      await user.save();
      userDetails = user;
    } else {
      const users = readLocalData('users.json', seededUsers);
      const index = users.findIndex(usr => usr.email.toLowerCase() === emailNorm);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'User with this email not found' });
      }
      users[index].resetPasswordToken = token;
      users[index].resetPasswordExpires = expires.toISOString();
      writeLocalData('users.json', users);
      userDetails = users[index];
    }

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    // Nodemailer Email Sending logic
    let transporter;
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    let isFallback = false;
    let etherealAccount = null;

    if (host && smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: { user: smtpUser, pass: smtpPass }
      });
    } else {
      isFallback = true;
      etherealAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: etherealAccount.user,
          pass: etherealAccount.pass
        }
      });
    }

    const info = await transporter.sendMail({
      from: `"Lolly Shop Support" <${smtpUser || 'support@lollyshop.co.nz'}>`,
      to: emailNorm,
      subject: "Lolly Shop - Password Reset Link",
      text: `Hello ${userDetails.name},\n\nYou requested to reset your password. Please use the following link to reset it:\n\n${resetLink}\n\nThis link is valid for 1 hour.`,
      html: `
        <div style="background-color: #faf9fc; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(79, 70, 229, 0.05); border: 1px solid #f1eff5;">
            <!-- Brand Banner Header -->
            <div style="background: linear-gradient(135deg, #e72c83 0%, #9013fe 100%); padding: 35px 20px; text-align: center;">
              <span style="font-size: 40px; display: block; margin-bottom: 10px;">🍬</span>
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Lolly Shop</h1>
            </div>
            
            <!-- Email Body Content -->
            <div style="padding: 40px 35px;">
              <h2 style="color: #2d2645; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">Password Reset Request</h2>
              
              <p style="color: #615a75; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                Hi <strong>${userDetails.name}</strong>,
              </p>
              
              <p style="color: #615a75; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                We received a request to reset the password for your Lolly Shop account. Click the button below to secure your account and set a new password:
              </p>
              
              <!-- Reset CTA Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="${resetLink}" style="background: linear-gradient(135deg, #e72c83 0%, #a855f7 100%); color: #ffffff; padding: 16px 36px; border-radius: 50px; font-weight: 700; font-size: 15px; text-decoration: none; display: inline-block; box-shadow: 0 6px 20px rgba(231, 44, 131, 0.4); text-transform: uppercase; letter-spacing: 0.8px; transition: all 0.3s ease;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #8c859d; font-size: 13px; line-height: 1.5; margin-top: 30px; margin-bottom: 15px;">
                ⚠️ <strong>Important Note:</strong> This security link is only active for <strong>1 hour</strong>. After that, you will need to request a new one.
              </p>
              
              <!-- Direct URL Fallback -->
              <div style="background-color: #f7f6f9; border-radius: 10px; padding: 15px; margin: 25px 0; border: 1px dashed #e1dde6;">
                <p style="margin: 0 0 6px 0; font-size: 12px; color: #8c859d; font-weight: 600;">Button not working? Copy and paste this link in your browser:</p>
                <p style="margin: 0; font-size: 12px; word-break: break-all;">
                  <a href="${resetLink}" style="color: #e72c83; text-decoration: none; font-weight: 600;">${resetLink}</a>
                </p>
              </div>
            </div>
            
            <!-- Email Footer -->
            <div style="background-color: #faf9fc; padding: 25px 35px; border-top: 1px solid #f1eff5; text-align: center;">
              <p style="font-size: 11px; color: #b4afc4; margin: 0 0 8px 0; line-height: 1.5;">
                If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
              <p style="font-size: 11px; color: #b4afc4; margin: 0;">
                © 2026 Lolly Shop New Zealand. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    });

    let previewUrl = null;
    if (isFallback) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`\n==================================================`);
      console.log(`[Forgot Password] Ethereal Reset Link Email sent to ${emailNorm}`);
      console.log(`Reset Link: ${resetLink}`);
      console.log(`Preview URL: ${previewUrl}`);
      console.log(`==================================================\n`);
    }

    res.json({
      success: true,
      message: 'A password reset link has been sent to your email inbox.',
      previewUrl: previewUrl
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Error processing forgot password request', error: error.message });
  }
});

// ── VERIFY RESET PASSWORD TOKEN API ──
app.get('/api/auth/verify-reset-token', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    if (sqlAvailable()) {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
      });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Password reset link is invalid or has expired.' });
      }
      res.json({ success: true, message: 'Token is valid' });
    } else {
      const users = readLocalData('users.json', seededUsers);
      const user = users.find(usr => 
        usr.resetPasswordToken === token && 
        usr.resetPasswordExpires && 
        new Date(usr.resetPasswordExpires) > new Date()
      );
      if (!user) {
        return res.status(400).json({ success: false, message: 'Password reset link is invalid or has expired.' });
      }
      res.json({ success: true, message: 'Token is valid' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Token verification error', error: error.message });
  }
});

// ── RESET PASSWORD SAVE API ──
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    if (sqlAvailable()) {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
      });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Password reset link is invalid or has expired.' });
      }

      user.password = hashPassword(password);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({ success: true, message: 'Password reset successful! You can now log in.' });
    } else {
      const users = readLocalData('users.json', seededUsers);
      const index = users.findIndex(usr => 
        usr.resetPasswordToken === token && 
        usr.resetPasswordExpires && 
        new Date(usr.resetPasswordExpires) > new Date()
      );
      if (index === -1) {
        return res.status(400).json({ success: false, message: 'Password reset link is invalid or has expired.' });
      }

      users[index].password = hashPassword(password);
      users[index].resetPasswordToken = undefined;
      users[index].resetPasswordExpires = undefined;
      writeLocalData('users.json', users);

      res.json({ success: true, message: 'Password reset successful! You can now log in.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Password reset execution error', error: error.message });
  }
});

// ── SETTINGS API ──
app.get('/api/settings', async (req, res) => {
  try {
    if (sqlAvailable()) {
      let settings = await Settings.findOne({ key: 'main_settings' });
      if (!settings) {
        settings = new Settings({ key: 'main_settings', ...defaultSettings });
        await settings.save();
      } else if (!settings.megaMenu || settings.megaMenu.length === 0) {
        settings.megaMenu = defaultSettings.megaMenu;
        await settings.save();
      }
      res.json(settings);
    } else {
      const settings = readLocalData('settings.json', defaultSettings);
      res.json(settings);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving settings', error: error.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    if (sqlAvailable()) {
      const updated = await Settings.findOneAndUpdate(
        { key: 'main_settings' },
        req.body,
        { new: true, upsert: true }
      );
      res.json(updated);
    } else {
      writeLocalData('settings.json', req.body);
      res.json(req.body);
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating settings', error: error.message });
  }
});




if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
  });
}

export default app;
// Nodemon refresh for Mongoose connection debugging
