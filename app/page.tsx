import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import TrendingSection from "@/components/home/TrendingSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import QuoteSlider from "@/components/home/QuoteSlider";
import CategoriesSection from "@/components/home/CategoriesSection";
import MarqueeAndAuthors from "@/components/home/AuthorsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import PricingSection from "@/components/home/PricingSection";
import FooterSection from "@/components/home/FooterSection";
import connectToDatabase from "@/lib/db";
import Book from "@/models/Book";
import User from "@/models/User";

export const dynamic = "force-dynamic";

// Category emojis & colors mapping
const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  "Islamic":       { emoji: "🕌", color: "from-emerald-500 to-teal-600" },
  "Self-Help":     { emoji: "🌟", color: "from-indigo-500 to-violet-600" },
  "Novel":         { emoji: "📖", color: "from-rose-500 to-pink-600" },
  "উপন্যাস":       { emoji: "📖", color: "from-rose-500 to-pink-600" },
  "Programming":   { emoji: "💻", color: "from-sky-500 to-cyan-600" },
  "Thriller":      { emoji: "🔍", color: "from-amber-500 to-orange-600" },
  "Science":       { emoji: "🔬", color: "from-purple-500 to-fuchsia-600" },
  "Children":      { emoji: "🌈", color: "from-lime-500 to-green-600" },
  "History":       { emoji: "🏛️", color: "from-yellow-500 to-amber-600" },
  "Biography":     { emoji: "📝", color: "from-teal-500 to-cyan-600" },
  "default":       { emoji: "📚", color: "from-slate-500 to-gray-600" },
};

export default async function HomePage() {
  await connectToDatabase();

  // ── Stats ──
  const totalUsers = await User.countDocuments();
  const totalBooks = await Book.countDocuments();
  const totalAuthors = await User.countDocuments({ role: { $in: ["author", "admin"] } });

  // ── Trending Books (latest 8 books) ──
  const rawBooks = await Book.find({})
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  const trendingBooks = rawBooks.map((book: any) => ({
    _id: book._id.toString(),
    title: book.title,
    slug: book.slug,
    authorName: book.authorName,
    coverImage: book.coverImage,
    hardCopyPrice: book.hardCopyPrice || 0,
    read_credits: book.read_credits || 0,
    averageRating: book.averageRating || 0,
    totalReviews: book.totalReviews || 0,
    hardCopyAvailable: book.hardCopyAvailable || false,
    categories: book.categories || [],
  }));

  // ── Categories ──
  const allDistinctCategories: string[] = await Book.distinct("categories");
  const validCategories = allDistinctCategories.filter((c) => c && c.trim() !== "");

  // If no categories in DB, show total books count under a general label
  const categoryData =
    validCategories.length > 0
      ? await Promise.all(
          validCategories.map(async (cat) => {
            const count = await Book.countDocuments({ categories: cat });
            const meta = CATEGORY_META[cat] ?? CATEGORY_META["default"];
            return { name: cat, count, ...meta };
          })
        )
      : [{ name: "সকল বই", count: totalBooks, ...CATEGORY_META["default"] }];

  // ── Authors ──
  const rawAuthors = await User.find({ role: { $in: ["author", "admin"] } })
    .lean();

  const authors = await Promise.all(
    rawAuthors.map(async (user: any) => {
      const bookCount = await Book.countDocuments({ authorName: user.name });
      return {
        _id: user._id.toString(),
        name: user.name,
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=120`,
        bio: user.bio || "",
        bookCount,
      };
    })
  );

  // ── Marquee Books (book titles from DB) ──
  const allBookTitles = await Book.find({}, "title").lean();
  const marqueeBooks = allBookTitles.map((b: any) => b.title);

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden">
      <HeroSection totalBooks={totalBooks} totalUsers={totalUsers} />
      <StatsSection totalUsers={totalUsers} totalBooks={totalBooks} totalAuthors={totalAuthors} />
      <TrendingSection books={trendingBooks} />
      <HowItWorksSection />
      <QuoteSlider />
      <CategoriesSection categories={categoryData} />
      <MarqueeAndAuthors authors={authors} marqueeBooks={marqueeBooks} />
      <NewsletterSection />
      <PricingSection />
      <FooterSection />
    </div>
  );
}