import BookCard from "@/components/books/BookCard";
import connectToDatabase from "@/lib/db";
import Book from "@/models/Book";
import User from "@/models/User"; // User মডেল ইমপোর্ট করা হলো

export const dynamic = "force-dynamic";

export default async function BooksPage({ searchParams }: { searchParams: Promise<{ category?: string, author?: string,  q?: string}> }) {
  const { category, author, q } = await searchParams;

  await connectToDatabase();
  
  // ডাইনামিক ফিল্টার কুয়েরি তৈরি
  let query: any = {};
  if (category) {
    query.categories = { $regex: new RegExp(`^${category}$`, "i") };
  }
  if (author) {
    query.authorName = { $regex: new RegExp(`^${author}$`, "i") };
  }
  // সার্চ কোয়েরি থাকলে বইয়ের নাম অথবা লেখকের নামে খুঁজবে
  if (q) {
    query.$or = [
      { title: { $regex: new RegExp(q, "i") } },
      { authorName: { $regex: new RegExp(q, "i") } }
    ];
  }

  const books = await Book.find(query).sort({ createdAt: -1 }).lean();

  // **ম্যাজিক লজিক:** ডাটাবেস থেকে সব লেখককে একসাথে খুঁজে আনা হচ্ছে
  const allAuthors = await User.find({ role: { $in: ["author", "admin"] } }).lean();

  const serializedBooks = books.map((book: any) => {
    // বইয়ের লেখকের নামের সাথে ডাটাবেসের ইউজারদের নাম মিলিয়ে আসল লেখককে খুঁজে বের করা হচ্ছে (Case-insensitive)
    const actualAuthor = allAuthors.find((user: any) => 
      user.name.toLowerCase() === book.authorName.toLowerCase()
    );

    return {
      _id: book._id.toString(),
      // যদি আসল লেখক পাওয়া যায় তবে তার ID, না পেলে আপলোডারের ID, কোনোটিই না থাকলে "unknown"
      authorId: actualAuthor ? actualAuthor._id.toString() : (book.authorId ? book.authorId.toString() : "unknown"),
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
    };
  });

  // পেজের হেডিং ডাইনামিক করা
  let heading = "সব বই";
  if (q) heading = `"${q}" এর জন্য সার্চ রেজাল্ট`; // সার্চের হেডিং
  else if (category && author) heading = `${author} -এর ${category} বইসমূহ`;
  else if (category) heading = `ক্যাটাগরি: ${category}`;
  else if (author) heading = `লেখক: ${author}`;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{heading}</h1>
        <p className="text-gray-600 mt-2">আপনার পছন্দের ডিজিটাল এবং হার্ডকপি বইগুলো ব্রাউজ করুন</p>
      </div>

      {serializedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2   gap-6">
          {serializedBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">এখনো কোনো বই পাওয়া যায়নি!</p>
        </div>
      )}
    </div>
  );
}