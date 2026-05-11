import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Book from "@/models/Book";
import UserBook from "@/models/UserBook";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    
    // শুধু অ্যাডমিনরাই এই API কল করতে পারবে
    const user = await User.findById(session.user.id).select("role").lean();
    if (user?.role !== "admin") {
      return NextResponse.json({ message: "Forbidden Access" }, { status: 403 });
    }

    // ডাটাবেস থেকে মোট সংখ্যা বের করা
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalUnlocks = await UserBook.countDocuments(); // মোট কতবার বই আনলক বা ডাউনলোড হয়েছে
    
    // Order মডেল যদি থাকে, সেটির কাউন্ট (যদি আপনার Order মডেলের নাম অন্য কিছু হয়, সেটি পরিবর্তন করে নেবেন)
    let totalOrders = 0;
    try {
      const Order = (await import("@/models/Order")).default;
      totalOrders = await Order.countDocuments();
    } catch (e) {
      console.log("Order model might not be implemented yet.");
    }

    return NextResponse.json({ 
      totalUsers, 
      totalBooks, 
      totalUnlocks, 
      totalOrders 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}