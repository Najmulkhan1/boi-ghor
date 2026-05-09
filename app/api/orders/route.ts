import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // ইউজার লগিন করা না থাকলে অর্ডার করতে পারবে না
    if (!session) {
      return NextResponse.json({ message: "অর্ডার করতে অনুগ্রহ করে লগিন করুন।" }, { status: 401 });
    }

    const body = await req.json();
    const { items, shippingAddress, paymentMethod, subtotal, shippingFee, totalAmount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "আপনার কার্ট ফাঁকা!" }, { status: 400 });
    }

    await connectToDatabase();

    // ইউনিক Order ID জেনারেট করা (যেমন: BG-2026-45982)
    const orderId = `BG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // ডাটাবেসে অর্ডার সেভ করা
    const newOrder = await Order.create({
      orderId,
      userId: session.user.id,
      items: items.map((item: any) => ({
        bookId: item.bookId,
        title: item.title,
        coverImage: item.coverImage,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: item.price * item.quantity,
      })),
      shippingAddress,
      payment: {
        method: paymentMethod,
        status: "pending", // COD এর জন্য ডিফল্ট pending
      },
      shippingFee,
      subtotal,
      totalAmount,
      status: "pending",
      statusHistory: [
        { status: "pending", note: "Order placed by user" }
      ]
    });

    return NextResponse.json(
      { message: "Order placed successfully", orderId: newOrder.orderId }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}