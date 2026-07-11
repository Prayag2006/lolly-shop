import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true, unique: true },
  contentType: { type: String, required: true },
  base64Data: { type: String, required: true },
  sizeBytes: { type: Number, default: 0 },
  folder: { type: String, default: 'uploads' }
}, { timestamps: true });

mediaSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
mediaSchema.set('toJSON', { virtuals: true });
mediaSchema.set('toObject', { virtuals: true });

export const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);
