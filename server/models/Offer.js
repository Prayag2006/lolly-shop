import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['coupon', 'promo', 'auto_discount', 'bogo', 'free_shipping', 'category_discount', 'product_discount', 'flash_sale', 'bundle'], 
    default: 'coupon' 
  },
  discountValue: { type: Number, default: 0 },
  discountType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
  minPurchase: { type: Number, default: 0 },
  buyQty: { type: Number, default: 0 },
  getYQty: { type: Number, default: 0 },
  buyProductId: { type: String, default: '' },
  getYProductId: { type: String, default: '' },
  freeGiftProductId: { type: String, default: '' },
  priority: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

offerSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
offerSchema.set('toJSON', { virtuals: true });
offerSchema.set('toObject', { virtuals: true });

export const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema);
