import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Review from "@/models/Review";
import Book from "@/models/Book";

// রিভিউ ফেচ (Get) করার জন্য
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    await connectToDatabase();
    // রিভিউর সাথে ইউজারের নাম ও ছবি (avatar) নিয়ে আসা
    const reviews = await Review.find({ bookId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to load reviews" }, { status: 500 });
  }
}

// নতুন রিভিউ সাবমিট (Post) করার জন্য
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "লগিন করুন!" }, { status: 401 });

    const { bookId, rating, comment } = await req.json();
    if (!rating || !comment) return NextResponse.json({ message: "রেটিং এবং কমেন্ট দুটোই দিতে হবে।" }, { status: 400 });

    await connectToDatabase();

    // চেক করা ইউজার আগেই রিভিউ দিয়েছে কি না
    const existingReview = await Review.findOne({ userId: session.user.id, bookId });
    if (existingReview) {
      return NextResponse.json({ message: "আপনি ইতিমধ্যে এই বইটিতে রিভিউ দিয়েছেন!" }, { status: 400 });
    }

    // নতুন রিভিউ তৈরি
    await Review.create({ userId: session.user.id, bookId, rating, comment });

    // বইয়ের Average Rating আপডেট করা
    const allReviews = await Review.find({ bookId });
    const totalReviews = allReviews.length;
    const averageRating = (allReviews.reduce((sum, rev) => sum + rev.rating, 0) / totalReviews).toFixed(1);

    await Book.findByIdAndUpdate(bookId, { totalReviews, averageRating: Number(averageRating) });

    return NextResponse.json({ message: "রিভিউ সফলভাবে যোগ করা হয়েছে!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "সার্ভার এরর!" }, { status: 500 });
  }
}