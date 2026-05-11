import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Coupon from "@/models/Coupon";
import User from "@/models/User";

const isAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  await connectToDatabase();
  const user = await User.findById(session.user.id).select("role").lean();
  return user?.role === "admin";
};

// কুপন দেখা (GET)
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  await connectToDatabase();
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ coupons }, { status: 200 });
}

// নতুন কুপন তৈরি করা (POST)
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  try {
    const body = await req.json();
    await connectToDatabase();
    const newCoupon = await Coupon.create(body);
    return NextResponse.json({ message: "কুপন তৈরি হয়েছে", coupon: newCoupon }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) return NextResponse.json({ message: "এই কুপন কোডটি আগেই তৈরি করা হয়েছে!" }, { status: 400 });
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// কুপনের স্ট্যাটাস আপডেট করা (PUT)
export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  try {
    const { id, isActive } = await req.json();
    await connectToDatabase();
    const updated = await Coupon.findByIdAndUpdate(id, { isActive }, { new: true });
    return NextResponse.json({ message: "আপডেট হয়েছে", coupon: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Update Failed" }, { status: 500 });
  }
}

// কুপন ডিলিট করা (DELETE)
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await connectToDatabase();
    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ message: "কুপন ডিলিট করা হয়েছে" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Delete Failed" }, { status: 500 });
  }
}