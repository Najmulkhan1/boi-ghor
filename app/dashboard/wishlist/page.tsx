import connectToDatabase from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BookCard from "@/components/books/BookCard";
import { Heart } from "lucide-react";

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  await connectToDatabase();
  const wishlistItems = await Wishlist.find({ userId: session.user.id })
    .populate("bookId")
    .lean();

  const books = wishlistItems.map((item: any) => ({
    ...item.bookId,
    _id: item.bookId._id.toString(),
    authorId: item.bookId.authorId?.toString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
        <div className="bg-rose-500/20 p-3 rounded-xl text-rose-400">
          <Heart className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">আমার পছন্দের তালিকা</h1>
          <p className="text-slate-500 text-sm">ভবিষ্যতে কেনার বা পড়ার জন্য সেভ করে রাখা বইগুলো।</p>
        </div>
      </div>
      
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map((book: any) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900 rounded-2xl border border-dashed border-slate-800">
          <Heart className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <p className="text-white font-bold text-lg">আপনার পছন্দের তালিকায় কোনো বই নেই।</p>
          <p className="text-slate-500 text-sm mt-1">বইয়ের তালিকা থেকে আপনার পছন্দের বইগুলো যুক্ত করুন।</p>
        </div>
      )}
    </div>
  );
}