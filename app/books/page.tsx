import BookCard from "@/components/books/BookCard";
import BookFilters from "@/components/books/BookFilters";
import PaginationControls from "@/components/books/PaginationControls";
import connectToDatabase from "@/lib/db";
import Book from "@/models/Book";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export default async function BooksPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ 
    category?: string, 
    author?: string, 
    q?: string, 
    format?: string, 
    sort?: string,
    page?: string 
  }> 
}) {
  const { category, author, q, format, sort, page } = await searchParams;

  const currentPage = Number(page) || 1;
  const limit = 12; 
  const skip = (currentPage - 1) * limit;

  await connectToDatabase();
  
  let query: any = {};
  if (category) query.categories = { $regex: new RegExp(`^${category}$`, "i") };
  if (author) query.authorName = { $regex: new RegExp(`^${author}$`, "i") };
  if (q) {
    query.$or = [
      { title: { $regex: new RegExp(q, "i") } },
      { authorName: { $regex: new RegExp(q, "i") } }
    ];
  }

  // Format Filter Logic
  if (format === "hardcopy") query.hardCopyAvailable = true;
  if (format === "pdf") query.read_credits = { $gt: 0 };

  // Sorting Logic
  let sortOption: any = { createdAt: -1 };
  if (sort === "price-low") sortOption = { hardCopyPrice: 1 };
  else if (sort === "price-high") sortOption = { hardCopyPrice: -1 };
  else if (sort === "points-low") sortOption = { read_credits: 1 };
  else if (sort === "points-high") sortOption = { read_credits: -1 };

  // Data Fetching
  const totalBooks = await Book.countDocuments(query);
  const totalPages = Math.ceil(totalBooks / limit);
  const books = await Book.find(query).sort(sortOption).skip(skip).limit(limit).lean();
  const allAuthors = await User.find({ role: { $in: ["author", "admin"] } }).lean();

  const serializedBooks = books.map((book: any) => {
    const actualAuthor = allAuthors.find((user: any) => 
      user.name.toLowerCase() === book.authorName.toLowerCase()
    );

    return {
      _id: book._id.toString(),
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

  // Dynamic Heading Logic
  let heading = "সব বই";
  if (q) heading = `"${q}" এর ফলাফল`;
  else if (category) heading = `${category} বইসমূহ`;
  else if (author) heading = `${author}-এর বই`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] mt-10 dark:bg-gray-950 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar - বাম পাশে */}
          <aside className="w-full lg:w-72 shrink-0">
            <BookFilters />
          </aside>

          {/* Main Content - ডান পাশে */}
          <main className="flex-1">
            <div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50">{heading}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">মোট {totalBooks} টি বই খুঁজে পাওয়া গেছে</p>
              </div>
            </div>

            {serializedBooks.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {serializedBooks.map((book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
                
                <PaginationControls currentPage={currentPage} totalPages={totalPages} />
              </>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-400 text-lg italic">কোনো বই খুঁজে পাওয়া যায়নি!</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}