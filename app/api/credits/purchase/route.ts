import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import CreditTxn from "@/models/CreditTxn";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { planName, creditsToAdd, price } = await req.json();

    await connectToDatabase();
    const user = await User.findById(session.user.id);

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // ১. ইউজারের ক্রেডিট আপডেট করা
    user.credits += creditsToAdd;
    await user.save();

    // ২. ট্রানজেকশন রেকর্ড রাখা
    await CreditTxn.create({
      userId: user._id,
      amount: creditsToAdd,
      type: "admin_add", // এখানে আমরা অ্যাডমিন অ্যাড টাইপ দিচ্ছি বা নতুন টাইপ "purchase" যোগ করতে পারেন
      description: `Purchased ${planName} Plan (${creditsToAdd} Credits) for ৳${price}`,
    });

    return NextResponse.json({ 
      message: "ক্রেডিট সফলভাবে যোগ করা হয়েছে!", 
      newBalance: user.credits 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "সার্ভার এরর" }, { status: 500 });
  }
}