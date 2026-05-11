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

// ইউজারের রোল বা ক্রেডিট আপডেট করা
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { userId, role, credits } = await req.json();
    await connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role, credits },
      { new: true }
    ).select("-passwordHash");

    return NextResponse.json({ message: "ইউজার সফলভাবে আপডেট হয়েছে!", user: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Update Failed" }, { status: 500 });
  }
}