import mongoose, { Schema, model, models } from "mongoose";

// সাব-ডকুমেন্ট হিসেবে Address Schema
const AddressSchema = new Schema({
  label: { type: String, required: false }, // "বাসা", "অফিস"
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, required: false },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: false }, // OAuth এর ক্ষেত্রে পাসওয়ার্ড নাও থাকতে পারে
    role: { 
      type: String, 
      enum: ["user", "author", "admin"], 
      default: "user" 
    },
    avatar: { type: String, required: false },
    credits: { type: Number, default: 0 },
    bio: { type: String, required: false },
    savedAddresses: [AddressSchema],
  },
  { timestamps: true }
);

// Next.js এ Hot Reloading এর সময় যেন মডেল ওভাররাইট না হয়, তাই এই চেকিং
const User = models.User || model("User", UserSchema);

export default User;