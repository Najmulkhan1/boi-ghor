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
      return NextResponse.json({ message: "লগিন করা প্রয়োজন!" }, { status: 401 });
    }

    const { bookId } = await req.json();
    await connectToDatabase();

    const book = await Book.findById(bookId);
    if (!book || !book.pdfUrl) {
      return NextResponse.json({ message: "বইয়ের পিডিএফ পাওয়া যায়নি!" }, { status: 404 });
    }

    const user = await User.findById(session.user.id);
    let userBook = await UserBook.findOne({ userId: user._id, bookId: book._id });

    // যদি ইউজারের আগে থেকেই ডাউনলোড করার পারমিশন না থাকে
    if (!userBook?.canDownload) {
      const cost = book.download_credits || 0;

      if (user.credits < cost) {
        return NextResponse.json({ message: "আপনার পর্যাপ্ত ক্রেডিট নেই!" }, { status: 400 });
      }

      // ক্রেডিট কাটা
      user.credits -= cost;
      await user.save();

      // ট্রানজেকশন লগ রাখা
      await CreditTxn.create({
        userId: user._id,
        amount: cost,
        type: "download_book",
        description: `Downloaded book: ${book.title}`,
      });

      // UserBook আপডেট বা তৈরি করা (যাতে সে আজীবন ডাউনলোড করতে পারে)
      if (userBook) {
        userBook.canDownload = true;
        await userBook.save();
      } else {
        userBook = await UserBook.create({
          userId: user._id,
          bookId: book._id,
          canRead: false, // এটি শুধু ডাউনলোডের জন্য কিনছে
          canDownload: true,
        });
      }
    }

    // ক্লাউডিনারি লিংকে `fl_attachment` যোগ করে Force Download লিংক তৈরি করা
    const urlParts = book.pdfUrl.split('/upload/');
    const downloadUrl = `${urlParts[0]}/upload/fl_attachment/${urlParts[1]}`;

    return NextResponse.json({ downloadUrl, message: "ডাউনলোড শুরু হচ্ছে..." }, { status: 200 });

  } catch (error) {
    console.error("Download Error:", error);
    return NextResponse.json({ message: "সার্ভার এরর!" }, { status: 500 });
  }
}