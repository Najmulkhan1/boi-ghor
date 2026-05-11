import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Book from "@/models/Book";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    // যদি ২ অক্ষরের কম টাইপ করে, তবে ফাঁকা রেজাল্ট পাঠাবে
    if (!q || q.length < 2) {
      return NextResponse.json({ books: [] }, { status: 200 });
    }

    await connectToDatabase();

    // বইয়ের নাম বা লেখকের নাম দিয়ে খুঁজবে এবং সর্বোচ্চ ৫টি রেজাল্ট পাঠাবে
    const books = await Book.find({
      $or: [
        { title: { $regex: new RegExp(q, "i") } },
        { authorName: { $regex: new RegExp(q, "i") } },
      ],
    })
      .select("title slug authorName coverImage") // শুধু দরকারি ডাটাগুলো নিচ্ছি
      .limit(5)
      .lean();

    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ message: "Search failed" }, { status: 500 });
  }
}