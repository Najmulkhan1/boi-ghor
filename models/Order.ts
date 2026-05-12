import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true }, // e.g. "BG-2026-00123"
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
        title: { type: String, required: true },
        coverImage: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true },
        subtotal: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, required: false },
      division: { type: String, required: false },
      district: { type: String, required: false },
      upazila: { type: String, required: false },
      city: { type: String, required: false },
      postalCode: { type: String, required: false },
      deliveryNote: { type: String, required: false },
    },
    payment: {
      method: { type: String, enum: ["card", "bkash", "nagad", "cod"], required: true },
      status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
      transactionId: { type: String, required: false },
      paidAt: { type: Date, required: false },
    },
    couponCode: { type: String, required: false },
    discountAmount: { type: Number, default: 0 },
    shippingFee: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"], 
      default: "pending" 
    },
    trackingNumber: { type: String, required: false },
    adminNote: { type: String, required: false },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        note: { type: String, required: false },
      },
    ],
    estimatedDelivery: { type: Date, required: false },
  },
  { timestamps: true }
);

const Order = models.Order || model("Order", OrderSchema);

export default Order;