const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://najmulislam624_db_user:PP6MlVlGaRCqGSFQ@boi-ghor.bmt1zx4.mongodb.net/?appName=boi-ghor";

const BookSchema = new mongoose.Schema({}, { strict: false });
const Book = mongoose.models.Book || mongoose.model("Book", BookSchema);

async function checkBooks() {
  try {
    await mongoose.connect(MONGODB_URI);
    const books = await Book.find({}, "title authorName categories isFeatured").lean();
    console.log("All Books in DB:", JSON.stringify(books, null, 2));
    await mongoose.disconnect();
  } catch (error) {
    console.log("Error:", error);
  }
}

checkBooks();
