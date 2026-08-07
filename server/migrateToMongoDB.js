import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore DNS config error
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { Product } from './models/Product.js';
import { Brand } from './models/Brand.js';
import { User } from './models/User.js';
import { Contact } from './models/Contact.js';
import { Order } from './models/Order.js';
import { Testimonial } from './models/Testimonial.js';
import { Settings } from './models/Settings.js';
import { Category } from './models/Category.js';
import { Media } from './models/Media.js';
import { Offer } from './models/Offer.js';
import { AuditLog } from './models/AuditLog.js';
import { BlogPost } from './models/BlogPost.js';
import { Redirect } from './models/Redirect.js';
import { NewsletterSubscriber } from './models/NewsletterSubscriber.js';
import { CustomPage } from './models/CustomPage.js';

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('❌ MONGODB_URI is not defined in .env file!');
  process.exit(1);
}

const DATA_DIR = path.resolve(__dirname, 'data');

const loadJsonData = (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err.message);
    return [];
  }
};

const migrateData = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000
    });
    console.log('✅ Connected to MongoDB Atlas successfully!\n');

    // 1. Products Migration
    const products = loadJsonData('products.json');
    if (products.length > 0) {
      console.log(`📦 Migrating ${products.length} products to MongoDB...`);
      for (const p of products) {
        const query = p.sku ? { sku: p.sku } : { name: p.name };
        const cleanProduct = {
          name: p.name,
          category: p.category || p.mainCategory || 'General',
          mainCategory: p.mainCategory || '',
          price: Number(p.price) || 0,
          salePrice: p.salePrice ? Number(p.salePrice) : null,
          sku: p.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
          rating: Number(p.rating) || 5.0,
          reviewsCount: Number(p.reviewsCount) || 1,
          description: p.description || '',
          longDescription: p.longDescription || p.description || '',
          ingredients: p.ingredients || '',
          nutrition: p.nutrition || { calories: '120 kcal', sugar: '20g', fat: '0g', protein: '1g' },
          gradient: p.gradient || 'linear-gradient(135deg, #e72c83 0%, #ed5a9e 100%)',
          image: p.image || '',
          images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []),
          inStock: p.inStock !== undefined ? p.inStock : true,
          quantity: Number(p.quantity) || 50,
          isPopular: !!p.isPopular,
          isNew: p.isNew !== undefined ? !!p.isNew : true,
          collections: Array.isArray(p.collections) ? p.collections : [],
          weightPrices: p.weightPrices || {
            '100g': Number(p.price) || 0,
            '250g': Number(((Number(p.price) || 0) * 2.2).toFixed(2)),
            '500g': Number(((Number(p.price) || 0) * 4.0).toFixed(2)),
            '1kg': Number(((Number(p.price) || 0) * 7.5).toFixed(2))
          },
          reviews: Array.isArray(p.reviews) ? p.reviews : []
        };
        await Product.findOneAndUpdate(query, cleanProduct, { upsert: true, new: true });
      }
      console.log(`✅ Products migration complete! (Total in DB: ${await Product.countDocuments()})\n`);
    }

    // 2. Categories Migration
    const categories = loadJsonData('categories.json');
    if (categories.length > 0) {
      console.log(`📂 Migrating ${categories.length} categories to MongoDB...`);
      for (const cat of categories) {
        if (!cat.name) continue;
        await Category.findOneAndUpdate({ name: cat.name }, cat, { upsert: true, new: true });
      }
      console.log(`✅ Categories migration complete! (Total in DB: ${await Category.countDocuments()})\n`);
    }

    // 3. Brands Migration
    const brands = loadJsonData('brands.json');
    if (brands.length > 0) {
      console.log(`🏷️ Migrating ${brands.length} brands to MongoDB...`);
      for (const brand of brands) {
        if (!brand.name) continue;
        await Brand.findOneAndUpdate({ name: brand.name }, brand, { upsert: true, new: true });
      }
      console.log(`✅ Brands migration complete! (Total in DB: ${await Brand.countDocuments()})\n`);
    }

    // 4. Users Migration
    const users = loadJsonData('users.json');
    if (users.length > 0) {
      console.log(`👤 Migrating ${users.length} users to MongoDB...`);
      for (const u of users) {
        if (!u.email) continue;
        await User.findOneAndUpdate({ email: u.email.toLowerCase() }, u, { upsert: true, new: true });
      }
      console.log(`✅ Users migration complete! (Total in DB: ${await User.countDocuments()})\n`);
    }

    // 5. Orders Migration
    const orders = loadJsonData('orders.json');
    if (orders.length > 0) {
      console.log(`🛒 Migrating ${orders.length} orders to MongoDB...`);
      for (const ord of orders) {
        const orderId = ord.id || ord.orderNumber || `ORD-${Date.now()}`;
        const { _id, ...cleanOrd } = ord;
        await Order.findOneAndUpdate({ id: orderId }, { ...cleanOrd, id: orderId }, { upsert: true, new: true });
      }
      console.log(`✅ Orders migration complete! (Total in DB: ${await Order.countDocuments()})\n`);
    }

    // 6. Contacts Migration
    const contacts = loadJsonData('contacts.json');
    if (contacts.length > 0) {
      console.log(`📩 Migrating ${contacts.length} contact messages to MongoDB...`);
      for (const c of contacts) {
        const { id, _id, ...cleanC } = c;
        await Contact.findOneAndUpdate({ email: c.email || 'guest@lollyshop.co.nz', message: c.message }, cleanC, { upsert: true, new: true });
      }
      console.log(`✅ Contacts migration complete! (Total in DB: ${await Contact.countDocuments()})\n`);
    }

    // 7. Testimonials Migration
    const testimonials = loadJsonData('testimonials.json');
    if (testimonials.length > 0) {
      console.log(`💬 Migrating ${testimonials.length} testimonials to MongoDB...`);
      for (const t of testimonials) {
        if (!t.author) continue;
        await Testimonial.findOneAndUpdate({ author: t.author, text: t.text }, t, { upsert: true, new: true });
      }
      console.log(`✅ Testimonials migration complete! (Total in DB: ${await Testimonial.countDocuments()})\n`);
    }

    // 8. Settings Migration
    const settingsData = loadJsonData('settings.json');
    if (settingsData.length > 0) {
      console.log(`⚙️ Migrating Settings to MongoDB...`);
      for (const s of settingsData) {
        const key = s.key || 'main_settings';
        await Settings.findOneAndUpdate({ key }, s, { upsert: true, new: true });
      }
      console.log(`✅ Settings migration complete! (Total in DB: ${await Settings.countDocuments()})\n`);
    }

    console.log('🎉 MIGRATION SUCCESSFUL! All records transferred to MongoDB Atlas!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
};

migrateData();
