import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/Product.js';
import { User } from './models/User.js';
import { Brand } from './models/Brand.js';
import { Testimonial } from './models/Testimonial.js';
import { Settings } from './models/Settings.js';
import { initialProducts, initialBrands, defaultUsers, defaultTestimonials } from './fallbackData.js';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.log('Failed to set DNS servers in seed:', e.message);
}

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  console.log('Connecting to database:', mongoUri);
  
  try {
    await mongoose.connect(mongoUri);
    console.log('Successfully connected to MongoDB.');

    // Seed Brands
    const brandCount = await Brand.countDocuments();
    if (brandCount === 0) {
      await Brand.insertMany(initialBrands);
      console.log(`Seeded ${initialBrands.length} brands.`);
    } else {
      console.log('Brands already seeded.');
    }

    // Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany(defaultUsers);
      console.log(`Seeded ${defaultUsers.length} default users.`);
    } else {
      console.log('Users already seeded.');
    }

    // Seed Products - Clear old generic ones to replace with real NZ lollies
    console.log('Clearing existing product collection...');
    await Product.deleteMany({});
    
    // Map base prices into weightPrices
    const productsToSeed = initialProducts.map(p => ({
      ...p,
      weightPrices: {
        '100g': p.price,
        '250g': Number((p.price * 2.2).toFixed(2)),
        '500g': Number((p.price * 4.0).toFixed(2)),
        '1kg': Number((p.price * 7.5).toFixed(2))
      }
    }));
    await Product.insertMany(productsToSeed);
    console.log(`Seeded ${productsToSeed.length} products.`);

    // Seed Testimonials - Clear old ones first to sync NZ locations and reviews
    console.log('Clearing existing testimonial collection...');
    await Testimonial.deleteMany({});
    await Testimonial.insertMany(defaultTestimonials);
    console.log(`Seeded ${defaultTestimonials.length} testimonials.`);

    // Clear settings to trigger recreation with new NZ default settings
    console.log('Clearing existing settings collection...');
    await Settings.deleteMany({});
    console.log('Settings collection cleared.');

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();
