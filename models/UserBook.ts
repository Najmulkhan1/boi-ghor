import mongoose, { Schema, model, models } from "mongoose";

const UserBookSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    status: { type: String, enum: ["wishlist", "reading", "finished"], default: "reading" },
    canRead: { type: Boolean, default: false },
    canDownload: { type: Boolean, default: false },
    lastReadPage: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// একই ইউজার যেন একই বই দুইবার আনলক করতে না পারে
UserBookSchema.index({ userId: 1, bookId: 1 }, { unique: true });

const UserBook = models.UserBook || model("UserBook", UserBookSchema);
export default UserBook;