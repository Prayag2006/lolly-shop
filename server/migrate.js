import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Resolve DNS issues
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.log('Failed to set DNS servers:', e.message);
}

// Import models
import { Product } from './models/Product.js';
import { Brand } from './models/Brand.js';
import { User } from './models/User.js';
import { Contact } from './models/Contact.js';
import { Order } from './models/Order.js';
import { Testimonial } from './models/Testimonial.js';
import { Settings } from './models/Settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BACKUP_DIR = path.resolve(__dirname, 'data_backup');

// Maps collection filenames to mongoose models
const modelMapping = [
  { file: 'products.json', model: Product, name: 'Product' },
  { file: 'brands.json', model: Brand, name: 'Brand' },
  { file: 'users.json', model: User, name: 'User' },
  { file: 'contacts.json', model: Contact, name: 'Contact' },
  { file: 'orders.json', model: Order, name: 'Order' },
  { file: 'testimonials.json', model: Testimonial, name: 'Testimonial' },
  { file: 'settings.json', model: Settings, name: 'Settings' }
];

// Helper to recursively convert 24-character hex strings to ObjectIds
const convertIds = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(convertIds);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === '_id' && typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value)) {
        newObj[key] = new mongoose.Types.ObjectId(value);
      } else {
        newObj[key] = convertIds(value);
      }
    }
    return newObj;
  }
  return obj;
};

async function migrate() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Error: MONGODB_URI is not set in your .env file.');
    process.exit(1);
  }

  console.log('Connecting to target database:', uri);
  try {
    await mongoose.connect(uri);
    console.log('Successfully connected to target database!');

    for (const item of modelMapping) {
      const filepath = path.join(BACKUP_DIR, item.file);
      if (!fs.existsSync(filepath)) {
        console.log(`Skipping: ${item.file} not found in backup.`);
        continue;
      }

      console.log(`Migrating: Reading data from ${item.file}...`);
      const rawData = fs.readFileSync(filepath, 'utf-8');
      const documents = JSON.parse(rawData);

      if (!Array.isArray(documents)) {
        console.log(`Skipping ${item.name}: Backup data is not an array.`);
        continue;
      }

      // 1. Clear target collection
      console.log(`Migrating: Clearing target collection for ${item.name}...`);
      await item.model.deleteMany({});

      if (documents.length === 0) {
        console.log(`Migrating: No documents to insert for ${item.name}.`);
        continue;
      }

      // 2. Convert raw strings to ObjectIds and prepare documents
      console.log(`Migrating: Converting IDs and preparing ${documents.length} documents...`);
      const preparedDocs = convertIds(documents);

      // 3. Insert documents
      console.log(`Migrating: Inserting ${preparedDocs.length} documents into ${item.name}...`);
      await item.model.insertMany(preparedDocs);
      console.log(`Migrating: Successfully migrated ${preparedDocs.length} records into ${item.name}!`);
    }

    console.log('\n=============================================');
    console.log('Database migration completed successfully!');
    console.log('=============================================');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
}

migrate();
