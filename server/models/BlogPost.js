import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  comment: { type: String, required: true },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

const blogPostSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, default: '' },
  author: { type: String, default: 'Admin' },
  category: { type: String, default: 'General' },
  tags: { type: [String], default: [] },
  featuredImage: { type: String, default: '' },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  published: { type: Boolean, default: true },
  scheduledDate: { type: String, default: '' },
  comments: { type: [commentSchema], default: [] }
}, { timestamps: true });

blogPostSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
blogPostSchema.set('toJSON', { virtuals: true });
blogPostSchema.set('toObject', { virtuals: true });

export const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);
