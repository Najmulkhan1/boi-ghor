import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Review from "@/models/Review";
import Book from "@/models/Book";
import User from "@/models/User";

const isAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  await connectToDatabase();
  const user = await User.findById(session.user.id).select("role").lean();
  return user?.role === "admin";
};

// সব রিভিউ দেখা (GET)
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  
  await connectToDatabase();
  
  // রিভিউয়ের সাথে ইউজার এবং বইয়ের ডিটেইলস পপুলেট করে নিয়ে আসা
  const reviews = await Review.find()
    .sort({ createdAt: -1 })
    .populate("userId", "name email avatar")
    .populate("bookId", "title coverImage")
    .lean();
    
  return NextResponse.json({ reviews }, { status: 200 });
}

// রিভিউ ডিলিট করা (DELETE)
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  
  try {
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("id");
    
    await connectToDatabase();
    
    // রিভিউ ডিলিট করা
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) return NextResponse.json({ message: "রিভিউ পাওয়া যায়নি" }, { status: 404 });

    // ডিলিট করার পর ওই বইয়ের গড় রেটিং (Average Rating) পুনরায় হিসাব করা
    const stats = await Review.aggregate([
      { $match: { bookId: deletedReview.bookId } },
      { $group: { _id: "$bookId", avgRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } }
    ]);

    await Book.findByIdAndUpdate(deletedReview.bookId, {
      averageRating: stats.length > 0 ? parseFloat(stats[0].avgRating.toFixed(1)) : 0,
      totalReviews: stats.length > 0 ? stats[0].totalReviews : 0
    });

    return NextResponse.json({ message: "রিভিউ সফলভাবে ডিলিট করা হয়েছে" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Delete Failed" }, { status: 500 });
  }
}