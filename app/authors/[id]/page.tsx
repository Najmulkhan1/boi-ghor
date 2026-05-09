import mongoose from "mongoose";
import { notFound } from "next/navigation";
import Link from "next/link"; // Link ইমপোর্ট করা হলো
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Book from "@/models/Book";
import BookCard from "@/components/books/BookCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Book as BookIcon, LayoutGrid, User as UserIcon } from "lucide-react";

export default async function AuthorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();

  // **ফিক্স: ID টি ভ্যালিড MongoDB ID কি না তা চেক করা হচ্ছে**
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return notFound();
  }

  const author = await User.findById(id).lean();

  if (!author || (author.role !== "author" && author.role !== "admin")) {
    return notFound();
  }

  // **ম্যাজিক লজিক:** যে কেউ আপলোড করুক, যদি authorId ম্যাচ করে অথবা authorName ম্যাচ করে, তবেই বই দেখাবে!
  const books = await Book.find({
    $or: [
      { authorId: id }, 
      { authorName: { $regex: new RegExp(`^${author.name}$`, "i") } }
    ]
  }).sort({ createdAt: -1 }).lean();

  const categories = Array.from(new Set(books.flatMap(book => book.categories || [])));

  const serializedBooks = books.map((book: any) => ({
    _id: book._id.toString(),
    title: book.title,
    slug: book.slug,
    authorName: book.authorName,
    coverImage: book.coverImage,
    read_credits: book.read_credits,
    download_credits: book.download_credits,
    hardCopyAvailable: book.hardCopyAvailable,
    hardCopyPrice: book.hardCopyPrice,
    averageRating: book.averageRating,
    totalReviews: book.totalReviews,
  }));

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="bg-white rounded-xl border p-6 md:p-10 mb-10 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <Avatar className="h-32 w-32 border-4 border-blue-50">
            <AvatarImage src={author.avatar || ""} />
            <AvatarFallback className="text-4xl bg-blue-100 text-blue-700">
              {author.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-grow text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{author.name}</h1>
              <p className="text-blue-600 font-medium mt-1 capitalize">Official Author Account</p>
            </div>
            
            {author.bio && <p className="text-gray-600 leading-relaxed max-w-2xl">{author.bio}</p>}

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border">
                <BookIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold">{books.length} টি বই</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border">
                <LayoutGrid className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold">{categories.length} টি ক্যাটাগরি</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-gray-500" />
            লেখকের বইয়ের ক্যাটাগরিগুলো
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, idx) => (
              // **ক্লিক করার লজিক:** Books পেজে ক্যাটাগরি ও লেখকের নাম প্যারামিটার হিসেবে পাঠানো হচ্ছে
              <Link key={idx} href={`/books?category=${encodeURIComponent(cat as string)}&author=${encodeURIComponent(author.name)}`}>
                <Badge variant="secondary" className="px-4 py-1 text-sm bg-white border shadow-sm hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors">
                  {cat}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-extrabold mb-8 text-gray-900">
          {author.name}-এর প্রকাশিত বইসমূহ
        </h2>
        {serializedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {serializedBooks.map((book) => <BookCard key={book._id} book={book} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-gray-500">এই লেখকের কোনো বই এখনো পাওয়া যায়নি।</p>
          </div>
        )}
      </div>
    </div>
  );
}