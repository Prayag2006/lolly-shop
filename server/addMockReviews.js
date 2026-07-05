import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import dns from 'dns';
import { fileURLToPath } from 'url';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { Product } from './models/Product.js';

const mockReviewsPool = [
  { userName: "Sarah Jenkins", rating: 5, comment: "Absolutely delicious! The flavor is incredibly rich, and the packaging kept them perfectly fresh." },
  { userName: "Matthew Taylor", rating: 5, comment: "My new favorite! Highly recommend for anyone looking for authentic quality treats." },
  { userName: "Chloe Smith", rating: 4, comment: "Great texture and amazing flavor. Shipping was super quick to Wellington." },
  { userName: "Liam Wilson", rating: 5, comment: "Brought these for a family birthday and everyone loved them. Will definitely buy again." },
  { userName: "Emily Davis", rating: 4, comment: "Very tasty! A bit sweet for my preference, but the kids devoured them in minutes." },
  { userName: "James Wilson", rating: 5, comment: "Top-tier confectionery. The presentation is premium and the taste is state-of-the-art!" },
  { userName: "Jessica Taylor", rating: 5, comment: "Incredible value! The texture is perfectly chewy and the flavor bursts in your mouth." }
];

const run = async () => {
  const mongoUri = process.env.MONGODB_URI;
  console.log('Target MongoDB URI:', mongoUri);

  // 1. Update fallback JSON file database
  try {
    const jsonPath = path.resolve(__dirname, 'data/products.json');
    if (fs.existsSync(jsonPath)) {
      const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      console.log(`Found local products.json with ${products.length} products. Adding mock reviews...`);
      const updated = products.map((p, idx) => {
        const rev1 = mockReviewsPool[idx % mockReviewsPool.length];
        const rev2 = mockReviewsPool[(idx + 2) % mockReviewsPool.length];
        return {
          ...p,
          reviews: [
            { id: `r-${idx}-1`, userName: rev1.userName, rating: rev1.rating, comment: rev1.comment, createdAt: new Date().toISOString() },
            { id: `r-${idx}-2`, userName: rev2.userName, rating: rev2.rating, comment: rev2.comment, createdAt: new Date().toISOString() }
          ],
          reviewsCount: 2,
          rating: Number(((rev1.rating + rev2.rating) / 2).toFixed(1))
        };
      });
      fs.writeFileSync(jsonPath, JSON.stringify(updated, null, 2));
      console.log('Successfully updated local products.json file database with mock reviews.');
    }
  } catch (err) {
    console.error('Error updating local products.json database:', err);
  }

  // 2. Update MongoDB Atlas database
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB database. Fetching products...');
      const dbProducts = await Product.find({});
      console.log(`Found ${dbProducts.length} products in MongoDB. Updating reviews...`);
      
      let count = 0;
      for (let i = 0; i < dbProducts.length; i++) {
        const p = dbProducts[i];
        
        // Only add reviews if the product doesn't have any reviews already
        if (!p.reviews || p.reviews.length === 0) {
          const rev1 = mockReviewsPool[i % mockReviewsPool.length];
          const rev2 = mockReviewsPool[(i + 2) % mockReviewsPool.length];
          
          p.reviews = [
            { userName: rev1.userName, rating: rev1.rating, comment: rev1.comment },
            { userName: rev2.userName, rating: rev2.rating, comment: rev2.comment }
          ];
          p.reviewsCount = 2;
          p.rating = Number(((rev1.rating + rev2.rating) / 2).toFixed(1));
          
          await p.save();
          count++;
        }
      }
      console.log(`Successfully updated ${count} products in MongoDB with mock reviews.`);
    } catch (err) {
      console.error('Error updating MongoDB database:', err);
    } finally {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB.');
    }
  }
};

run();
