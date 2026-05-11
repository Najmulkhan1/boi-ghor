import connectToDatabase from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BookCard from "@/components/books/BookCard";

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
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">আমার পছন্দের তালিকা</h1>
      
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map((book: any) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
          <p className="text-gray-500 text-lg">আপনার পছন্দের তালিকায় কোনো বই নেই।</p>
        </div>
      )}
    </div>
  );
}