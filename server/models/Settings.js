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
  }],
  megaMenu: {
    type: [{
      title: { type: String, required: true },
      items: { type: [String], default: [] }
    }],
    default: [
      {
        title: 'NZ Lollies',
        items: ['Soft Lollies', 'Hard Lollies', 'Sour Lollies', 'Sweet Lollies', 'Sugar Coated', 'Mayceys', 'Finni', 'Pascals', 'Other', 'Sugar Free', 'Vegan', 'Jellybeans']
      },
      {
        title: 'Imported Lollies',
        items: ['Airheads', 'Cotton Candy', 'Theatre Boxes', 'Popping Candy', 'Novelty', 'Lollipops', 'Sugar Free', 'Vegan']
      },
      {
        title: 'Chocolates',
        items: ['Bars', 'Cadbury', 'Nestle', 'Whitakers', 'Imported Chocolates', 'Share bags', 'Sugar Free', 'Vegan']
      },
      {
        title: 'Drinks',
        items: ['Hydration', 'Cans', 'Bottles', 'Multi Pack', 'Sugar Free']
      },
      {
        title: 'Snacks',
        items: ['Chips', 'Tackies', 'Cheetos', 'Kool Aid']
      },
      {
        title: 'Bulk',
        items: ['Soft Lollies', 'Hard Lollies', 'Chocolates']
      },
      {
        title: 'TikTok Viral',
        items: ['Peel me lollies', 'Freeze Dried Candies']
      },
      {
        title: 'Pick by Colour',
        items: ['Red Colour', 'Blue Colour', 'Yellow Colour', 'Pink Colour', 'Black Colour']
      },
      {
        title: 'Confectionery',
        items: ['Toys', 'Toys with Lolly']
      },
      {
        title: 'Special / Clearance',
        items: ['Heading 1', 'Heading 2']
      }
    ]
  }
}, { timestamps: true });

settingsSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
settingsSchema.set('toJSON', { virtuals: true });
settingsSchema.set('toObject', { virtuals: true });

export const Settings = mongoose.model('Settings', settingsSchema);
