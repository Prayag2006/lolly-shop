import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  message: { type: String, required: true },
  submittedAt: { type: String, required: true }
}, { timestamps: true });

contactSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
contactSchema.set('toJSON', { virtuals: true });
contactSchema.set('toObject', { virtuals: true });

export const Contact = mongoose.model('Contact', contactSchema);
