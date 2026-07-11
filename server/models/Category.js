import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  banner: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  seoKeywords: { type: String, default: '' }
}, { timestamps: true });

categorySchema.virtual('id').get(function() {
  return this._id.toHexString();
});
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
