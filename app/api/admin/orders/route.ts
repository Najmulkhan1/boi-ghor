import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";

// সব অর্ডার গেট (GET) করা
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const admin = await User.findById(session.user.id).select("role").lean();
    if (admin?.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email avatar")
      .lean();
      
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// অর্ডার আপডেট (PUT) করা (Status, Payment Status & Tracking Number)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { orderId, status, trackingNumber, paymentStatus, adminNote } = await req.json();
    await connectToDatabase();

    // ইউজারের ডাটাবেস আপডেট লজিক
    const order = await Order.findById(orderId);
    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

    // স্ট্যাটাস হিস্টোরিতে নতুন এন্ট্রি যোগ করা
    if (status && status !== order.status) {
      order.statusHistory.push({
        status: status,
        changedAt: new Date(),
        note: `Status updated by Admin: ${session.user.name}`
      });
      order.status = status;
    }

    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (paymentStatus) order.payment.status = paymentStatus;
    if (adminNote !== undefined) order.adminNote = adminNote;

    await order.save();

    return NextResponse.json({ message: "অর্ডার সফলভাবে আপডেট হয়েছে!", order }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Update Failed" }, { status: 500 });
  }
}