import mongoose, { Schema, model, models } from "mongoose";

const CreditTxnSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["purchase", "read", "download", "admin_add", "admin_remove","download_book"], required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: false },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const CreditTxn = models.CreditTxn || model("CreditTxn", CreditTxnSchema);
export default CreditTxn;