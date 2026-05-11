import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import UserBook from "@/models/UserBook";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { bookId, isRead } = await req.json();
    await connectToDatabase();

    const updatedUserBook = await UserBook.findOneAndUpdate(
      { userId: session.user.id, bookId: bookId },
      { isRead: isRead }, // ট্রু বা ফলস সেট করা
      { new: true }
    );

    if (!updatedUserBook) {
      return NextResponse.json({ message: "বইটি আপনার লাইব্রেরিতে নেই!" }, { status: 404 });
    }

    return NextResponse.json({ message: "স্ট্যাটাস আপডেট হয়েছে", isRead: updatedUserBook.isRead }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "সার্ভার এরর" }, { status: 500 });
  }
}