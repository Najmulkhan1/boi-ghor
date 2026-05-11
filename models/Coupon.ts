import mongoose, { Schema, model, models } from "mongoose";

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true }, // percentage = %, fixed = ৳
    discountValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 }, // কত টাকার অর্ডার করলে কুপন কাজ করবে
    validUntil: { type: Date, required: true }, // কুপনের মেয়াদ
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, default: null }, // কুপনটি সর্বোচ্চ কতবার ব্যবহার করা যাবে
    usedCount: { type: Number, default: 0 }, // কতবার ব্যবহার করা হয়েছে
  },
  { timestamps: true }
);

const Coupon = models.Coupon || model("Coupon", CouponSchema);
export default Coupon;