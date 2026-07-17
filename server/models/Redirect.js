import mongoose from 'mongoose';

const redirectSchema = new mongoose.Schema({
  fromPath: { type: String, required: true, unique: true },
  toPath: { type: String, required: true },
  statusCode: { type: Number, default: 301 }
}, { timestamps: true });

redirectSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
redirectSchema.set('toJSON', { virtuals: true });
redirectSchema.set('toObject', { virtuals: true });

export const Redirect = mongoose.models.Redirect || mongoose.model('Redirect', redirectSchema);
