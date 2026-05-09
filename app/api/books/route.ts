import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Book from "@/models/Book";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // সিকিউরিটি চেক: ইউজার লগিন করা না থাকলে অথবা তার রোল admin/author না হলে আপলোড করতে পারবে না
    if (!session || !["admin", "author"].includes((session.user as any).role)) {
      return NextResponse.json({ message: "বই আপলোড করার অনুমতি আপনার নেই।" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title, description, authorName, coverImage, pdfUrl, language, categories,
      read_credits, download_credits,
      hardCopyAvailable, hardCopyPrice, hardCopyStock
    } = body;

    if (!title || !description || !authorName || !coverImage) {
      return NextResponse.json({ message: "Title, Description, Author Name, and Cover Image are required" }, { status: 400 });
    }

    await connectToDatabase();

    // Title থেকে স্বয়ংক্রিয়ভাবে একটি unique slug তৈরি করা
    const baseSlug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const uniqueSlug = `${baseSlug}-${Date.now()}`;

    const newBook = await Book.create({
      title,
      slug: uniqueSlug,
      description,
      authorId: session.user.id, // লগিন করা ইউজারের ID
      authorName,
      coverImage,
      pdfUrl,
      language: language || "Bengali",
      categories: Array.isArray(categories) 
    ? categories 
    : (typeof categories === 'string' ? categories.split(',').map((c: string) => c.trim()) : []),
      
      read_credits: Number(read_credits) || 0,
      download_credits: Number(download_credits) || 0,
      
      hardCopyAvailable: Boolean(hardCopyAvailable),
      hardCopyPrice: Number(hardCopyPrice) || 0,
      hardCopyStock: Number(hardCopyStock) || 0,
    });

    return NextResponse.json({ message: "Book created successfully", book: newBook }, { status: 201 });
  } catch (error) {
    console.error("Book Creation Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}