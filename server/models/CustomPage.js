import mongoose from 'mongoose';

const customPageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' }
}, { timestamps: true });

customPageSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
customPageSchema.set('toJSON', { virtuals: true });
customPageSchema.set('toObject', { virtuals: true });

export const CustomPage = mongoose.models.CustomPage || mongoose.model('CustomPage', customPageSchema);
