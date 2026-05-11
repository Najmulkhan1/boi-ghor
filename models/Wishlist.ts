import mongoose, { Schema, model, models } from "mongoose";

const WishlistSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  },
  { timestamps: true }
);

// একই ইউজার যেন একই বই বারবার উইশলিস্টে যোগ করতে না পারে (Unique Index)
WishlistSchema.index({ userId: 1, bookId: 1 }, { unique: true });

const Wishlist = models.Wishlist || model("Wishlist", WishlistSchema);
export default Wishlist;