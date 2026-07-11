import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  mainCategory: { type: String, default: '' },
  price: { type: Number, required: true },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 1 },
  description: { type: String, default: '' },
  ingredients: { type: String, default: '' },
  nutrition: {
    calories: { type: String, default: 'N/A' },
    sugar: { type: String, default: 'N/A' },
    fat: { type: String, default: 'N/A' },
    protein: { type: String, default: 'N/A' }
  },
  gradient: { type: String, default: 'linear-gradient(135deg, #e72c83 0%, #ed5a9e 100%)' },
  image: { type: String, default: '' },
  inStock: { type: Boolean, default: true },
  quantity: { type: Number, default: 50 },
  isPopular: { type: Boolean, default: false },
  isNew: { type: Boolean, default: true },
  collections: { type: [String], default: [] },
  weightPrices: {
    '100g': { type: Number },
    '250g': { type: Number },
    '500g': { type: Number },
    '1kg': { type: Number }
  },
  reviews: { type: [reviewSchema], default: [] }
}, { timestamps: true, suppressReservedKeysWarning: true });

// Convert _id to id virtual on JSON serialization
productSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
