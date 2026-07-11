import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  svgType: { type: String, default: 'bazooka' },
  image: { type: String, default: '' }
}, { timestamps: true });

brandSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
brandSchema.set('toJSON', { virtuals: true });
brandSchema.set('toObject', { virtuals: true });

export const Brand = mongoose.models.Brand || mongoose.model('Brand', brandSchema);
