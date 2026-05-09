import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    // সিকিউরিটি: ইউজার অ্যাডমিন না হলে আপডেট করতে পারবে না
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    await connectToDatabase();

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status,
        $push: {
          statusHistory: { status, note: `Status updated to ${status} by admin` }
        }
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order status updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Order Update Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}