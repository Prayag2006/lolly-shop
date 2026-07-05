import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: { type: String, default: 'main_settings', unique: true },
  marqueeText: { type: String, default: "🍬 NZ'S FAVORITE CANDY STORE — FREE SHIPPING ON ORDERS OVER $50! 🍭 GET 10% OFF YOUR FIRST ORDER WITH CODE: SWEET10" },
  popupOffer: {
    enabled: { type: Boolean, default: true },
    delay: { type: Number, default: 3000 },
    title: { type: String, default: "🎉 Special Sweet Deal!" },
    description: { type: String, default: "Get 15% off on all sour gummies this weekend. Use code at checkout!" },
    code: { type: String, default: "SOUR15" },
    image: { type: String, default: "" }
  },
  popupOffers: [{
    enabled: { type: Boolean, default: true },
    delay: { type: Number, default: 3000 },
    title: { type: String, default: "🎉 Special Sweet Deal!" },
    description: { type: String, default: "Get 15% off on all sour gummies this weekend. Use code at checkout!" },
    code: { type: String, default: "SOUR15" },
    image: { type: String, default: "" }
  }]
}, { timestamps: true });

settingsSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
settingsSchema.set('toJSON', { virtuals: true });
settingsSchema.set('toObject', { virtuals: true });

export const Settings = mongoose.model('Settings', settingsSchema);
