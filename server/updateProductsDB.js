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

export const productsToKeep = [
  {
    id: "p-glo-hearts",
    name: "GLO HEARTS (MAYCEYS)",
    category: "Hard Lollies",
    mainCategory: "NZ Lollies",
    price: 15.99,
    rating: 5.0,
    reviewsCount: 48,
    description: "Mayceys Glo Hearts are iconic New Zealand hard candy hearts with a bright, sweet fruit flavor! Perfect for parties, weddings, Valentine's, and special occasions.",
    ingredients: "Sugar, Glucose Syrup, Water, Food Acid (Citric Acid), Flavors, Colors (124).",
    nutrition: { calories: "145 kcal", sugar: "28g", fat: "0g", protein: "0g" },
    gradient: "linear-gradient(135deg, #FF0055 0%, #FF66B2 100%)",
    image: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&q=80&w=600"],
    inStock: true,
    quantity: 100,
    isPopular: true,
    isNew: true,
    collections: [
      "Parties", "Weddings", "Valentine", "Halloween", "Christmas", "Birthdays",
      "Gifts", "NZFavourites", "KiwiFavourites", "NZLollies", "KiwiLollies", "NZCandy", "KiwiClassics", "Mayceys", "Sweet Lollies"
    ],
    weightPrices: {
      "100g": 15.99,
      "250g": 35.18,
      "500g": 63.96,
      "1kg": 119.93
    }
  },
  {
    id: "p-jersey-caramel",
    name: "JERSEY CARAMEL",
    category: "Hard Lollies",
    mainCategory: "NZ Lollies",
    price: 13.99,
    rating: 4.9,
    reviewsCount: 36,
    description: "Classic Jersey Caramel lollies featuring smooth, rich caramel layers with a soft fudge center. A timeless Kiwi candy classic loved by generations!",
    ingredients: "Sugar, Glucose Syrup, Condensed Milk, Vegetable Oil, Wheat Flour, Caramel Flavor, Salt.",
    nutrition: { calories: "160 kcal", sugar: "24g", fat: "4.5g", protein: "1.2g" },
    gradient: "linear-gradient(135deg, #D4A373 0%, #FAEDCD 100%)",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=600"],
    inStock: true,
    quantity: 100,
    isPopular: true,
    isNew: false,
    collections: [
      "Parties", "Weddings", "Halloween", "Christmas", "Birthdays", "Gifts",
      "Kids", "NZ Favourites", "Kiwi Favourites", "Sweet Lollies"
    ],
    weightPrices: {
      "100g": 13.99,
      "250g": 30.78,
      "500g": 55.96,
      "1kg": 104.93
    }
  },
  {
    id: "p-fizzers",
    name: "FIZZERS",
    category: "Sour Lollies",
    mainCategory: "NZ Lollies",
    price: 0.99,
    rating: 4.8,
    reviewsCount: 52,
    description: "Tangy, mouth-watering sour fizzy candy rolls! Packed with fruity flavor and an electrifying fizz in every bite.",
    ingredients: "Sugar, Acidity Regulators (Malic Acid, Tartaric Acid), Sodium Bicarbonate, Glucose Syrup, Flavors, Colors.",
    nutrition: { calories: "95 kcal", sugar: "21g", fat: "0g", protein: "0g" },
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    image: "https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&q=80&w=600",
    images: ["https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&q=80&w=600"],
    inStock: true,
    quantity: 100,
    isPopular: true,
    isNew: false,
    collections: [
      "NZ Favourites", "kiwis Favourites", "Parties", "Weddings", "Halloween",
      "Christmas", "Birthdays", "Gifts", "Kids"
    ],
    weightPrices: {
      "100g": 0.99,
      "250g": 2.18,
      "500g": 3.96,
      "1kg": 7.43
    }
  }
];

const updateDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Clearing existing product collection in MongoDB...');
    await Product.deleteMany({});
    
    console.log('Inserting 3 selected products into MongoDB...');
    await Product.insertMany(productsToKeep);
    
    const count = await Product.countDocuments();
    console.log(`Success! MongoDB now contains exactly ${count} products.`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error updating database:', err);
    process.exit(1);
  }
};

if (process.argv[1] && process.argv[1].endsWith('updateProductsDB.js')) {
  updateDB();
}
