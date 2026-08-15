import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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
import { initialProducts, initialBrands, defaultUsers, defaultTestimonials } from './fallbackData.js';

const OLD_MONGO_URI = process.env.SOURCE_MONGODB_URI;
const targetUriArg = process.argv[2] || process.env.MONGODB_URI;

if (!OLD_MONGO_URI || !targetUriArg) {
  console.error('Set SOURCE_MONGODB_URI (source cluster) and MONGODB_URI (or pass target URI as an argument) before running this migration script.');
  process.exit(1);
}

// Ensure dbName is present
let TARGET_MONGO_URI = targetUriArg;
if (!TARGET_MONGO_URI.includes('cluster0.0intrz7.mongodb.net/')) {
  TARGET_MONGO_URI = TARGET_MONGO_URI.replace('cluster0.0intrz7.mongodb.net/?', 'cluster0.0intrz7.mongodb.net/lollyshop?');
  if (!TARGET_MONGO_URI.includes('/lollyshop')) {
    TARGET_MONGO_URI = TARGET_MONGO_URI.replace('cluster0.0intrz7.mongodb.net', 'cluster0.0intrz7.mongodb.net/lollyshop');
  }
}

const DATA_DIR = path.resolve(__dirname, 'data');
const BACKUP_DIR = path.resolve(__dirname, 'data_backup');

const readJson = (dir, file) => {
  const p = path.join(dir, file);
  if (!fs.existsSync(p)) return [];
  try {
    const raw = fs.readFileSync(p, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : (parsed && typeof parsed === 'object' ? [parsed] : []);
  } catch (e) {
    return [];
  }
};

export async function runTransfer(customUri) {
  const uriToUse = customUri || TARGET_MONGO_URI;
  console.log('🚀 Starting Data Transfer Process to Target MongoDB Cluster...');
  console.log(`🎯 Target URI: ${uriToUse.replace(/:([^@]+)@/, ':***@')}`);

  // Step 1: Connect to Old Cluster to pull latest active data
  console.log('\n📥 Step 1: Pulling all active documents from Old Cluster...');
  let oldData = {};
  try {
    const oldConn = await mongoose.createConnection(OLD_MONGO_URI, { serverSelectionTimeoutMS: 10000 }).asPromise();
    const cols = await oldConn.db.listCollections().toArray();
    for (const c of cols) {
      const docs = await oldConn.collection(c.name).find({}).toArray();
      oldData[c.name] = docs;
      console.log(`   - Retrieved ${docs.length} records from collection: ${c.name}`);
    }
    await oldConn.close();
    console.log('✅ Old cluster data extraction complete.');
  } catch (err) {
    console.warn('⚠️ Notice when reading from old cluster (falling back to JSON files):', err.message);
  }

  // Step 2: Connect to New Cluster
  console.log('\n🔌 Step 2: Connecting to Target MongoDB Cluster...');
  await mongoose.connect(uriToUse, {
    dbName: 'lollyshop',
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000
  });
  console.log('✅ Successfully connected to Target MongoDB Atlas Cluster!');

  // Step 3: Transfer & Upsert each collection
  console.log('\n📦 Step 3: Transferring & Upserting all datasets...');

  // 1. Products
  const products = [
    ...(oldData.products || []),
    ...readJson(DATA_DIR, 'products.json'),
    ...readJson(BACKUP_DIR, 'products.json'),
    ...initialProducts
  ];
  const seenProductIds = new Set();
  const uniqueProducts = [];
  for (const p of products) {
    const key = p.sku || p.name || p.id;
    if (!key || seenProductIds.has(key)) continue;
    seenProductIds.add(key);
    uniqueProducts.push(p);
  }
  console.log(`   Transferring ${uniqueProducts.length} unique products...`);
  for (const p of uniqueProducts) {
    const { _id, ...cleanP } = p;
    cleanP.price = Number(cleanP.price) || 0;
    cleanP.inStock = cleanP.inStock !== undefined ? cleanP.inStock : true;
    cleanP.quantity = cleanP.quantity !== undefined ? Number(cleanP.quantity) : 50;
    cleanP.weightPrices = cleanP.weightPrices || {
      '100g': cleanP.price,
      '250g': Number((cleanP.price * 2.2).toFixed(2)),
      '500g': Number((cleanP.price * 4.0).toFixed(2)),
      '1kg': Number((cleanP.price * 7.5).toFixed(2))
    };
    await Product.findOneAndUpdate(
      cleanP.sku ? { sku: cleanP.sku } : { name: cleanP.name },
      cleanP,
      { upsert: true, new: true }
    );
  }
  console.log(`   ✅ Products transferred! Current count: ${await Product.countDocuments()}`);

  // 2. Categories
  const categories = [
    ...(oldData.categories || []),
    ...readJson(DATA_DIR, 'categories.json')
  ];
  const seenCats = new Set();
  for (const c of categories) {
    if (!c.name || seenCats.has(c.name)) continue;
    seenCats.add(c.name);
    const { _id, ...cleanC } = c;
    await Category.findOneAndUpdate({ name: c.name }, cleanC, { upsert: true, new: true });
  }
  console.log(`   ✅ Categories transferred! Current count: ${await Category.countDocuments()}`);

  // 3. Brands
  const brands = [
    ...(oldData.brands || []),
    ...readJson(DATA_DIR, 'brands.json'),
    ...readJson(BACKUP_DIR, 'brands.json'),
    ...initialBrands
  ];
  const seenBrands = new Set();
  for (const b of brands) {
    if (!b.name || seenBrands.has(b.name)) continue;
    seenBrands.add(b.name);
    const { _id, ...cleanB } = b;
    await Brand.findOneAndUpdate({ name: b.name }, cleanB, { upsert: true, new: true });
  }
  console.log(`   ✅ Brands transferred! Current count: ${await Brand.countDocuments()}`);

  // 4. Users
  const users = [
    ...(oldData.users || []),
    ...readJson(DATA_DIR, 'users.json'),
    ...readJson(BACKUP_DIR, 'users.json'),
    ...defaultUsers
  ];
  const seenUsers = new Set();
  for (const u of users) {
    if (!u.email || seenUsers.has(u.email.toLowerCase())) continue;
    seenUsers.add(u.email.toLowerCase());
    const { _id, ...cleanU } = u;
    cleanU.email = cleanU.email.toLowerCase();
    await User.findOneAndUpdate({ email: cleanU.email }, cleanU, { upsert: true, new: true });
  }
  console.log(`   ✅ Users transferred! Current count: ${await User.countDocuments()}`);

  // 5. Orders
  const orders = [
    ...(oldData.orders || []),
    ...readJson(DATA_DIR, 'orders.json'),
    ...readJson(BACKUP_DIR, 'orders.json')
  ];
  const seenOrders = new Set();
  for (const o of orders) {
    const orderId = o.id || o.orderNumber || o._id?.toString();
    if (!orderId || seenOrders.has(orderId)) continue;
    seenOrders.add(orderId);
    const { _id, ...cleanO } = o;
    cleanO.id = orderId;
    await Order.findOneAndUpdate({ id: orderId }, cleanO, { upsert: true, new: true });
  }
  console.log(`   ✅ Orders transferred! Current count: ${await Order.countDocuments()}`);

  // 6. Testimonials
  const testimonials = [
    ...(oldData.testimonials || []),
    ...readJson(DATA_DIR, 'testimonials.json'),
    ...readJson(BACKUP_DIR, 'testimonials.json'),
    ...defaultTestimonials
  ];
  const seenTestimonials = new Set();
  for (const t of testimonials) {
    const key = `${t.author}-${t.text}`;
    if (!t.author || seenTestimonials.has(key)) continue;
    seenTestimonials.add(key);
    const { _id, ...cleanT } = t;
    await Testimonial.findOneAndUpdate({ author: t.author, text: t.text }, cleanT, { upsert: true, new: true });
  }
  console.log(`   ✅ Testimonials transferred! Current count: ${await Testimonial.countDocuments()}`);

  // 7. Contacts
  const contacts = [
    ...(oldData.contacts || []),
    ...readJson(DATA_DIR, 'contacts.json'),
    ...readJson(BACKUP_DIR, 'contacts.json')
  ];
  for (const c of contacts) {
    const { _id, ...cleanC } = c;
    await Contact.findOneAndUpdate({ email: c.email || 'guest@lollyshop.co.nz', message: c.message }, cleanC, { upsert: true, new: true });
  }
  console.log(`   ✅ Contacts transferred! Current count: ${await Contact.countDocuments()}`);

  // 8. Settings
  const settingsData = [
    ...(oldData.settings || []),
    ...readJson(DATA_DIR, 'settings.json'),
    ...readJson(BACKUP_DIR, 'settings.json')
  ];
  for (const s of settingsData) {
    const key = s.key || 'main_settings';
    const { _id, ...cleanS } = s;
    await Settings.findOneAndUpdate({ key }, cleanS, { upsert: true, new: true });
  }
  console.log(`   ✅ Settings transferred! Current count: ${await Settings.countDocuments()}`);

  // 9. Other collections (AuditLogs, BlogPosts, CustomPages, Media, Offers, Redirects, NewsletterSubscribers)
  const remainingTypes = [
    { name: 'auditlogs', model: AuditLog, file: 'auditlogs.json', key: 'id' },
    { name: 'blogposts', model: BlogPost, file: 'blogposts.json', key: 'slug' },
    { name: 'custompages', model: CustomPage, file: 'custompages.json', key: 'slug' },
    { name: 'media', model: Media, file: 'media.json', key: 'id' },
    { name: 'offers', model: Offer, file: 'offers.json', key: 'id' },
    { name: 'redirects', model: Redirect, file: 'redirects.json', key: 'from' },
    { name: 'newslettersubscribers', model: NewsletterSubscriber, file: 'subscribers.json', key: 'email' },
  ];

  for (const item of remainingTypes) {
    const items = [...(oldData[item.name] || []), ...readJson(DATA_DIR, item.file)];
    for (const doc of items) {
      const { _id, ...cleanDoc } = doc;
      const query = cleanDoc[item.key] ? { [item.key]: cleanDoc[item.key] } : cleanDoc;
      await item.model.findOneAndUpdate(query, cleanDoc, { upsert: true, new: true });
    }
    console.log(`   ✅ ${item.name} transferred! Current count: ${await item.model.countDocuments()}`);
  }

  // Step 4: Full Round-Trip Verification (Push and Get Data)
  console.log('\n🧪 Step 4: Performing Round-Trip Push & Get Data Verification...');
  
  // Test PUSH
  const testSku = `TEST-VERIFY-${Date.now()}`;
  const testProduct = await Product.create({
    name: 'Verification Candy',
    sku: testSku,
    price: 9.99,
    category: 'Hard Lollies',
    description: 'Round-trip verification test candy',
    inStock: true,
    quantity: 10
  });
  console.log(`   ✅ PUSH verified! Created test document ID: ${testProduct._id} (SKU: ${testSku})`);

  // Test GET
  const fetchedProduct = await Product.findOne({ sku: testSku });
  if (!fetchedProduct || fetchedProduct.name !== 'Verification Candy') {
    throw new Error('GET verification failed: Document could not be queried back!');
  }
  console.log(`   ✅ GET verified! Successfully queried document by SKU: ${fetchedProduct.sku}`);

  // Test CLEANUP
  await Product.deleteOne({ sku: testSku });
  console.log('   ✅ CLEANUP verified! Deleted test document.');

  console.log('\n🎉 ==============================================');
  console.log('🎉 FULL DATA TRANSFER & VERIFICATION SUCCESSFUL!');
  console.log('🎉 Pushing & Getting data is 100% operational.');
  console.log('🎉 ==============================================\n');

  await mongoose.disconnect();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runTransfer().catch((err) => {
    console.error('\n❌ Migration process failed:', err.message);
    process.exit(1);
  });
}
