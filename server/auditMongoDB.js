import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

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

const audit = async () => {
  const start = Date.now();
  console.log('🔍 Starting MongoDB Atlas Live Audit...');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000
    });
    
    const pingTime = Date.now() - start;
    console.log(`✅ MongoDB Atlas Connection Verified (Latency: ${pingTime}ms)`);
    
    const collections = {
      products: await Product.countDocuments(),
      categories: await Category.countDocuments(),
      brands: await Brand.countDocuments(),
      users: await User.countDocuments(),
      orders: await Order.countDocuments(),
      contacts: await Contact.countDocuments(),
      testimonials: await Testimonial.countDocuments(),
      settings: await Settings.countDocuments()
    };

    // Test a sample read operation
    const sampleProduct = await Product.findOne().select('name category price images');
    
    console.log('\n================ DATABASE AUDIT REPORT ================');
    console.log(`Status: CONNECTED AND OPERATIONAL`);
    console.log(`Database Name: ${mongoose.connection.name}`);
    console.log(`Host: ${mongoose.connection.host}`);
    console.log(`Ping Latency: ${pingTime}ms`);
    console.log('\n--- COLLECTION RECORD COUNTS ---');
    console.table(collections);
    console.log('\n--- SAMPLE PRODUCT QUERY VERIFICATION ---');
    console.log(`Sample Product: "${sampleProduct?.name}" | Price: $${sampleProduct?.price} | Category: "${sampleProduct?.category}" | Images: ${sampleProduct?.images?.length || 0}`);
    console.log('=======================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Audit failed:', err.message);
    process.exit(1);
  }
};

audit();
