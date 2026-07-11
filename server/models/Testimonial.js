import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'Customer' },
  quote: { type: String, required: true },
  rating: { type: Number, default: 5 },
  avatar: { type: String, default: '' }
}, { timestamps: true });

// Convert _id to id virtual on JSON serialization
testimonialSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
testimonialSchema.set('toJSON', { virtuals: true });
testimonialSchema.set('toObject', { virtuals: true });

export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
