import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Book from "@/models/Book";
import UserBook from "@/models/UserBook";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const authorId = session.user.id;

    // ১. লেখকের মোট বইয়ের সংখ্যা
    const totalBooks = await Book.countDocuments({ authorId });

    // লেখকের সব বইয়ের ID এবং রিভিউ ডেটা নিয়ে আসা
    const authorBooks = await Book.find({ authorId }).select("_id totalReviews averageRating").lean();
    const bookIds = authorBooks.map((book) => book._id);

    // ২. মোট পাঠক (কতজন ইউজার এই লেখকের বইগুলো আনলক বা ডাউনলোড করেছে)
    const totalReaders = await UserBook.countDocuments({ bookId: { $in: bookIds } });

    // ৩. মোট রিভিউ এবং গড় রেটিং হিসাব করা
    let totalReviews = 0;
    let sumRating = 0;
    let booksWithRating = 0;

    authorBooks.forEach((book: any) => {
      totalReviews += (book.totalReviews || 0);
      if (book.averageRating && book.averageRating > 0) {
        sumRating += book.averageRating;
        booksWithRating++;
      }
    });

    const avgRating = booksWithRating > 0 ? (sumRating / booksWithRating).toFixed(1) : "0.0";

    return NextResponse.json({
      totalBooks,
      totalReaders,
      totalReviews,
      avgRating
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}