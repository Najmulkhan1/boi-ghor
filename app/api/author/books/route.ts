import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Book from "@/models/Book";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    
    // শুধু Author বা Admin রাই বই আপলোড করতে পারবে
    const user = await User.findById(session.user.id).select("role name").lean();
    if (user?.role !== "author" && user?.role !== "admin") {
      return NextResponse.json({ message: "আপনার এই পারমিশন নেই!" }, { status: 403 });
    }

    const body = await req.json();
    
    // Slug তৈরি করা (বইয়ের নাম থেকে, স্পেসকে হাইফেন দিয়ে পরিবর্তন করে)
    const generatedSlug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    // নতুন বইয়ের অবজেক্ট তৈরি
    const newBook = await Book.create({
      ...body,
      slug: body.slug || generatedSlug,
      authorId: user._id,           // যিনি আপলোড করছেন, অটোমেটিক তার ID বসবে
      authorName: user.name,        // যিনি আপলোড করছেন, অটোমেটিক তার নাম বসবে
    });

    return NextResponse.json({ message: "বই সফলভাবে যুক্ত করা হয়েছে!", book: newBook }, { status: 201 });

  } catch (error) {
    console.error("Book Add Error:", error);
    return NextResponse.json({ message: "সার্ভার এরর, বইটি সেভ করা যায়নি।" }, { status: 500 });
  }
}


// GET: লেখকের নিজের আপলোড করা বইগুলো আনা
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    
    // ডাটাবেস থেকে শুধু লগিন করা লেখকের বইগুলোই খুঁজবে
    const books = await Book.find({ authorId: session.user.id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// DELETE: বই ডিলিট করা
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("id");

    await connectToDatabase();

    // বইয়ের মালিকানা চেক করা (যেন অন্য কেউ ডিলিট করতে না পারে)
    const book = await Book.findById(bookId);
    if (!book || book.authorId.toString() !== session.user.id) {
      return NextResponse.json({ message: "বইটি পাওয়া যায়নি বা ডিলিট করার পারমিশন নেই!" }, { status: 403 });
    }

    await Book.findByIdAndDelete(bookId);

    return NextResponse.json({ message: "বইটি সফলভাবে ডিলিট করা হয়েছে!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}