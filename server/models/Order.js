import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String },
  price: { type: Number, required: true },
  selectedWeight: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String }
});

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // ORD-xxxxxx
  date: { type: String, required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  shipping: { type: Number, default: 19 },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  userEmail: { type: String },
  status: { type: String, enum: ['Pending', 'Processing', 'Packing', 'Out for Delivery', 'Completed', 'Cancelled'], default: 'Pending' },
  deliveryCompany: { type: String, default: '' },
  deliveryReference: { type: String, default: '' },
  feedback: {
    rating: { type: Number },
    comment: { type: String }
  }
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
