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
  subtotal: { type: Number },
  couponCode: { type: String, default: '' },
  discountAmount: { type: Number, default: 0 },
  shipping: { type: Number, default: 19 },
  actualShipping: { type: Number, default: 19 },
  freeShippingApplied: { type: Boolean, default: false },
  freeShippingReason: { type: String, default: '' },
  // Without this in the schema, `order.paymentStatus = 'Paid'` would silently be dropped on
  // save (mongoose strict mode ignores undeclared paths) — and confirm-payment's idempotency
  // check ("if already Paid, return early") would never actually trigger, letting a repeated
  // confirmation call (e.g. the customer refreshing the Stripe success page) deduct stock twice
  // for the same payment.
  paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
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

orderSchema.index({ createdAt: -1 });

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
