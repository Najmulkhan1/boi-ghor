import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// একজন ইউজার একটি বইয়ে যেন একটির বেশি রিভিউ দিতে না পারে
ReviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

const Review = models.Review || model("Review", ReviewSchema);
export default Review;