import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Book from "@/models/Book";

// GET: এডিট করার জন্য নির্দিষ্ট একটি বইয়ের ডেটা আনা
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    
    const book = await Book.findById(id).lean();
    if (!book || book.authorId.toString() !== session.user.id) {
      return NextResponse.json({ message: "বইটি পাওয়া যায়নি!" }, { status: 404 });
    }

    return NextResponse.json({ book }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// PUT: বইয়ের ডেটা আপডেট করা
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectToDatabase();

    const book = await Book.findById(id);
    if (!book || book.authorId.toString() !== session.user.id) {
      return NextResponse.json({ message: "বইটি আপডেট করার পারমিশন নেই!" }, { status: 403 });
    }

    // ডেটা আপডেট করা
    const updatedBook = await Book.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json({ message: "বই সফলভাবে আপডেট করা হয়েছে!", book: updatedBook }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}