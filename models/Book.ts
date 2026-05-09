import mongoose, { Schema, model, models } from "mongoose";

const BookSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    pdfUrl: { type: String, required: false },
    coverImage: { type: String, required: true },
    categories: [{ type: String }],
    language: { type: String, required: true, default: "Bengali" },
    
    // Digital Pricing
    read_credits: { type: Number, default: 0 },
    download_credits: { type: Number, default: 0 },
    
    // Hard Copy Pricing & Stock
    hardCopyAvailable: { type: Boolean, default: false },
    hardCopyPrice: { type: Number, required: false },
    hardCopyStock: { type: Number, default: 0 },
    hardCopyWeight: { type: Number, required: false }, // in grams
    
    // Stats
    totalReviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReads: { type: Number, default: 0 },
    totalSold: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Book = models.Book || model("Book", BookSchema);

export default Book;