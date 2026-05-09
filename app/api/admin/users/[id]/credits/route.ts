import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import CreditTxn from "@/models/CreditTxn";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    // সিকিউরিটি চেক: শুধু অ্যাডমিন এটি করতে পারবে
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const { amount, action, description } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isAdd = action === "add";
    
    // রিমুভ করার সময় চেক করা ব্যালেন্স আছে কিনা
    if (!isAdd && user.credits < amount) {
      return NextResponse.json({ message: "পর্যাপ্ত ক্রেডিট নেই!" }, { status: 400 });
    }

    // ক্রেডিট আপডেট
    user.credits = isAdd ? user.credits + amount : user.credits - amount;
    await user.save();

    // ট্রানজেকশন লগ সেভ করা
    await CreditTxn.create({
      userId: user._id,
      amount: amount,
      type: isAdd ? "admin_add" : "admin_remove",
      description: description || `Admin ${isAdd ? "added" : "removed"} credits`,
    });

    return NextResponse.json({ message: "Credits updated successfully", credits: user.credits }, { status: 200 });
  } catch (error) {
    console.error("Credit Update Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}