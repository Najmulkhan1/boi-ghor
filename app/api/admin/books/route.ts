import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Book from "@/models/Book";
import User from "@/models/User";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const { bookId, ...updateData } = data;

    await connectToDatabase();

    const admin = await User.findById(session.user.id).select("role").lean();
    if (admin?.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    // ফিল্ডের নাম hardCopyStock দিয়ে চেক করা হচ্ছে
    if (updateData.hardCopyStock !== undefined) {
      updateData.hardCopyStock = Number(updateData.hardCopyStock);
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $set: updateData },
      { new: true } 
    );

    if (!updatedBook) return NextResponse.json({ message: "Book not found" }, { status: 404 });

    return NextResponse.json({ message: "Success", book: updatedBook }, { status: 200 });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Update Failed" }, { status: 500 });
  }
}

// GET method আগের মতোই থাকবে
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    await connectToDatabase();
    const books = await Book.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}


// GET এবং PUT মেথডের নিচে এই অংশটি যোগ করুন
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const admin = await User.findById(session.user.id).select("role").lean();
    if (admin?.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { books } = body;

    if (!books || !Array.isArray(books) || books.length === 0) {
      return NextResponse.json({ message: "কোনো ডেটা পাওয়া যায়নি!" }, { status: 400 });
    }

    await connectToDatabase();

    // সব বইয়ের সাথে অ্যাডমিনের ID যুক্ত করে দেওয়া হচ্ছে (যেহেতু authorId রিকোয়ার্ড থাকে)
    const booksWithAuthor = books.map((book: any) => ({
      ...book,
      authorId: session.user.id, 
      coverImage: book.coverImage || "https://via.placeholder.com/150", // ডিফল্ট ইমেজ
      hardCopyAvailable: book.hardCopyStock > 0
    }));

    // একসাথে সব ডেটা ইনসার্ট করা (Bulk Insert)
    const insertedBooks = await Book.insertMany(booksWithAuthor);

    return NextResponse.json({ message: `${insertedBooks.length} টি বই সফলভাবে যুক্ত হয়েছে!`, insertedBooks }, { status: 201 });
  } catch (error) {
    console.error("Bulk Insert Error:", error);
    return NextResponse.json({ message: "Bulk Add Failed" }, { status: 500 });
  }
}