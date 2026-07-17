import mongoose from 'mongoose';

const newsletterSubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

newsletterSubscriberSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
newsletterSubscriberSchema.set('toJSON', { virtuals: true });
newsletterSubscriberSchema.set('toObject', { virtuals: true });

export const NewsletterSubscriber = mongoose.models.NewsletterSubscriber || mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
