import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const user = await User.findById(session.user.id).select("savedAddresses").lean();
    
    return NextResponse.json({ addresses: user?.savedAddresses || [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "সার্ভার এরর" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // আপনার AddressSchema এর ফিল্ডগুলো নেওয়া হচ্ছে
    const { label, fullName, phone, addressLine1, addressLine2, city, postalCode, isDefault } = await req.json();
    await connectToDatabase();

    const user = await User.findById(session.user.id);

    // যদি নতুনটি ডিফল্ট হয়, তবে আগের সবগুলোর ডিফল্ট false করে দেওয়া
    if (isDefault) {
      user.savedAddresses.forEach((addr: any) => addr.isDefault = false);
    }

    // নতুন ঠিকানা পুশ করা
    user.savedAddresses.push({ label, fullName, phone, addressLine1, addressLine2, city, postalCode, isDefault });
    await user.save();

    return NextResponse.json({ message: "ঠিকানা সেভ হয়েছে!", addresses: user.savedAddresses }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "ঠিকানা সেভ করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get("id");

    await connectToDatabase();
    const user = await User.findById(session.user.id);
    
    user.savedAddresses = user.savedAddresses.filter((addr: any) => addr._id.toString() !== addressId);
    await user.save();

    return NextResponse.json({ message: "ঠিকানা ডিলিট হয়েছে", addresses: user.savedAddresses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "সার্ভার এরর" }, { status: 500 });
  }
}


// ঠিকানা আপডেট (Edit) করার জন্য
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get("id");

    const { label, fullName, phone, addressLine1, addressLine2, city, postalCode, isDefault } = await req.json();
    await connectToDatabase();

    const user = await User.findById(session.user.id);
    
    // নির্দিষ্ট ঠিকানার সাব-ডকুমেন্ট খুঁজে বের করা
    const address = user.savedAddresses.id(addressId);
    if (!address) return NextResponse.json({ message: "Address not found" }, { status: 404 });

    // যদি এটি ডিফল্ট হয়, তবে বাকিগুলোর ডিফল্ট false করা
    if (isDefault) {
      user.savedAddresses.forEach((addr: any) => addr.isDefault = false);
    }

    // ডেটা আপডেট করা
    address.set({ label, fullName, phone, addressLine1, addressLine2, city, postalCode, isDefault });
    await user.save();

    return NextResponse.json({ message: "ঠিকানা আপডেট হয়েছে!", addresses: user.savedAddresses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "সার্ভার এরর" }, { status: 500 });
  }
}