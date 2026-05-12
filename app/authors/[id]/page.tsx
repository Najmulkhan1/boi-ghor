import mongoose from "mongoose";
import { notFound } from "next/navigation";
import Link from "next/link";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Book from "@/models/Book";
import BookCard from "@/components/books/BookCard";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Library, 
  User as UserIcon, 
  Feather, 
  Globe, 
  Award,
  BookMarked
} from "lucide-react";

export default async function AuthorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();

  if (!mongoose.Types.ObjectId.isValid(id)) return notFound();

  const author = await User.findById(id).lean();

  if (!author || (author.role !== "author" && author.role !== "admin")) {
    return notFound();
  }

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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 pb-20">
      {/* Hero Header Section */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 rotate-12"><BookOpen size={120} /></div>
          <div className="absolute bottom-10 right-20 -rotate-12"><Feather size={100} /></div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-24 relative z-10">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-blue-500/5 border border-white/20 dark:border-gray-800 p-6 md:p-10 mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Author Avatar */}
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <Avatar className="h-40 w-40 border-8 border-white dark:border-gray-900 shadow-2xl relative">
                <AvatarImage src={author.avatar || ""} className="object-cover" />
                <AvatarFallback className="text-5xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  {author.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 right-4 bg-blue-600 text-white p-2 rounded-full border-4 border-white dark:border-gray-900">
                <Award size={20} />
              </div>
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <div className="space-y-2">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  {author.name}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 border-none px-3 py-1">
                    <Feather className="w-3 h-3 mr-1" /> অফিসিয়াল লেখক
                  </Badge>
                  <span className="text-gray-400">|</span>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Globe className="w-4 h-4 mr-1" /> সাহিত্য বিশারদ
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">জীবনী</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg italic max-w-3xl">
                  {author.bio || "বই ঘরের একজন নিয়মিত লেখক যিনি তার লেখনীর মাধ্যমে সাহিত্য জগতকে সমৃদ্ধ করছেন।"}
                </p>
              </div>

              {/* Stats Box */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/30 px-6 py-3 rounded-2xl border border-blue-100 dark:border-blue-900/50">
                  <div className="bg-blue-600 p-2 rounded-lg text-white">
                    <Library size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">মোট বই</p>
                    <p className="text-xl font-black text-blue-700 dark:text-blue-400">{books.length}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-950/30 px-6 py-3 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                  <div className="bg-indigo-600 p-2 rounded-lg text-white">
                    <BookMarked size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">ক্যাটাগরি</p>
                    <p className="text-xl font-black text-indigo-700 dark:text-indigo-400">{categories.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        {categories.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">লেখনীর বিষয়সমূহ</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat, idx) => (
                <Link key={idx} href={`/books?category=${encodeURIComponent(cat as string)}&author=${encodeURIComponent(author.name)}`}>
                  <Badge variant="outline" className="px-6 py-2.5 text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer transition-all rounded-xl">
                    {cat}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Books Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">প্রকাশিত বইসমূহ</h2>
            </div>
            <Link href="/books" className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline">
              সব দেখুন
            </Link>
          </div>

          {serializedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {serializedBooks.map((book) => (
                <div key={book._id} className="transition-transform duration-300 hover:-translate-y-2">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              <div className="bg-gray-50 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookMarked className="text-gray-300 w-10 h-10" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">এই লেখকের কোনো বই এখনো পাওয়া যায়নি।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}