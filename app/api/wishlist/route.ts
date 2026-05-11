import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Wishlist from "@/models/Wishlist";

// ১. ইউজারের উইশলিস্টে থাকা বইগুলোর আইডি গেট করা
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ wishlist: [] });

  await connectToDatabase();
  const list = await Wishlist.find({ userId: session.user.id }).select("bookId").lean();
  const bookIds = list.map((item: any) => item.bookId.toString());

  return NextResponse.json({ wishlist: bookIds });
}

// ২. উইশলিস্টে যোগ করা বা রিমুভ করা (Toggle)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { bookId } = await req.json();
  await connectToDatabase();

  const existing = await Wishlist.findOne({ userId: session.user.id, bookId });

  if (existing) {
    await Wishlist.findByIdAndDelete(existing._id);
    return NextResponse.json({ message: "Removed from wishlist", added: false });
  } else {
    await Wishlist.create({ userId: session.user.id, bookId });
    return NextResponse.json({ message: "Added to wishlist", added: true });
  }
}