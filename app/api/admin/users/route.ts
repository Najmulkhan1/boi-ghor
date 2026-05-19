import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

// সব ইউজার লিস্ট আনা
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    
    // শুধু অ্যাডমিন চেক
    const admin = await User.findById(session.user.id).select("role").lean();
    if (admin?.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const users = await User.find().sort({ createdAt: -1 }).select("-passwordHash").lean();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// ইউজারের যেকোনো তথ্য (রোল, ক্রেডিট, নাম, ছবি) আপডেট করা
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // অ্যাডমিন সিকিউরিটি চেক (যাতে অন্য কেউ আপডেট করতে না পারে)
    await connectToDatabase();
    const admin = await User.findById(session.user.id).select("role").lean();
    if (admin?.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const body = await req.json();
    
    // 💡 ম্যাজিক লজিক: userId বাদে বাকি সব ডেটা (name, avatar, role, credits) updateData তে চলে আসবে
    const { userId, ...updateData } = body; 

    if (!userId) return NextResponse.json({ message: "User ID required" }, { status: 400 });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData }, // $set ব্যবহার করায় যা আসবে তাই আপডেট হবে
      { new: true }
    ).select("-passwordHash");

    return NextResponse.json({ message: "ইউজার সফলভাবে আপডেট হয়েছে!", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("User Update Error:", error);
    return NextResponse.json({ message: "Update Failed" }, { status: 500 });
  }
}