import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Book from "@/models/Book";
import UserBook from "@/models/UserBook";
import CreditTxn from "@/models/CreditTxn";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "লগিন করা প্রয়োজন" }, { status: 401 });
    }

    const { bookId } = await req.json();
    await connectToDatabase();

    const book = await Book.findById(bookId);
    const user = await User.findById(session.user.id);

    if (!book || !user) {
      return NextResponse.json({ message: "বই বা ইউজার পাওয়া যায়নি" }, { status: 404 });
    }

    // চেক করা হচ্ছে বইটি আগেই আনলক করা আছে কিনা
    const existingRecord = await UserBook.findOne({ userId: user._id, bookId: book._id });
    if (existingRecord && existingRecord.canRead) {
      return NextResponse.json({ message: "বইটি ইতিমধ্যেই আপনার লাইব্রেরিতে আছে", success: true }, { status: 200 });
    }

    // ক্রেডিট চেক করা
    if (user.credits < book.read_credits) {
      return NextResponse.json({ 
        message: `আপনার যথেষ্ট ক্রেডিট নেই। প্রয়োজন: ${book.read_credits}, আছে: ${user.credits}` 
      }, { status: 400 });
    }

    // ক্রেডিট কাটা এবং রেকর্ড সেভ করা (Transaction)
    user.credits -= book.read_credits;
    await user.save();

   // ১. আগে চেক করবো ডাটাবেসে এই বইয়ের কোনো রেকর্ড (যেমন ডাউনলোডের জন্য) আছে কি না
      let existingUserBook = await UserBook.findOne({ userId: user._id, bookId: book._id });

      if (existingUserBook) {
        // যদি আগে থেকেই রেকর্ড থাকে, তবে শুধু canRead টা true করে দেবো
        existingUserBook.canRead = true;
        await existingUserBook.save();
      } else {
        // যদি রেকর্ড না থাকে, তবে নতুন তৈরি করবো
        await UserBook.create({
          userId: user._id,
          bookId: book._id,
          canRead: true,
        });
      }

    if (book.read_credits > 0) {
      await CreditTxn.create({
        userId: user._id,
        amount: book.read_credits,
        type: "read",
        bookId: book._id,
        description: `Unlocked digital reading for book: ${book.title}`
      });
    }


   

    return NextResponse.json({ message: "বইটি সফলভাবে আনলক হয়েছে!", success: true }, { status: 200 });
  } catch (error) {
    console.error("Unlock Error:", error);
    return NextResponse.json({ message: "সার্ভার এরর" }, { status: 500 });
  }
}