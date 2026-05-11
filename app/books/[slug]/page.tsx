import { notFound } from "next/navigation";
import Link from "next/link";
import connectToDatabase from "@/lib/db";
import Book from "@/models/Book";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  BookOpen,
  Download,
  ShoppingCart,
  Truck,
  ShieldCheck,
} from "lucide-react";
import AddToCartButton from "@/components/books/AddToCartButton";
import UnlockReadButton from "@/components/books/UnlockReadButton";
import User from "@/models/User";
import DownloadButton from "@/components/books/DownloadButton";
import UserBook from "@/models/UserBook";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BookReviews from "@/components/books/BookReviews";

// params এর টাইপ Promise হিসেবে ডিফাইন করা হলো
export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // params কে await করে slug বের করে আনা হলো
  const { slug } = await params;

  await connectToDatabase();

  // এখন params.slug এর বদলে সরাসরি slug ব্যবহার করা যাবে
  const book = await Book.findOne({ slug }).lean();

  if (!book) {
    return notFound();
  }

  // **ফিক্স:** লেখকের নাম দিয়ে আসল লেখকের User ID খুঁজে বের করা
  const actualAuthor = await User.findOne({
    name: { $regex: new RegExp(`^${book.authorName}$`, "i") },
    role: { $in: ["author", "admin"] },
  })
    .select("_id")
    .lean();

  // ... (বই ফাইন্ড করার পর)
  const session = await getServerSession(authOptions);
  let hasDownloadAccess = false;

  if (session) {
    const userBook = await UserBook.findOne({
      userId: session.user.id,
      bookId: book._id,
    }).lean();

    if (userBook?.canDownload) {
      hasDownloadAccess = true;
    }
  }

  // যদি আসল লেখকের প্রোফাইল না পাওয়া যায়, তবে আপলোডারের ID-ই ব্যবহার করবে
  const authorProfileId = actualAuthor
    ? actualAuthor._id.toString()
    : book.authorId.toString();

  const serializedBook = {
    ...book,
    _id: book._id.toString(),
    authorId: book.authorId.toString(),
    createdAt: book.createdAt?.toString(),
    updatedAt: book.updatedAt?.toString(),
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column - Book Cover */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="rounded-lg overflow-hidden border shadow-sm bg-gray-50 aspect-[2/3] relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={serializedBook.coverImage}
              alt={serializedBook.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Middle Column - Book Details */}
        <div className="md:col-span-8 lg:col-span-5 flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {serializedBook.title}
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              লেখক:{" "}
              <Link
                href={`/authors/${serializedBook.authorProfileId}`}
                className="text-blue-600 hover:underline ml-1"
              >
                {serializedBook.authorName}
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center text-yellow-500">
              <Star className="w-5 h-5 fill-current" />
              <span className="ml-1 font-bold text-gray-700">
                {serializedBook.averageRating || "0.0"}
              </span>
              <span className="ml-1 text-gray-500">
                ({serializedBook.totalReviews || 0} reviews)
              </span>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-gray-500">
              {serializedBook.language || "Bengali"}
            </span>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex gap-1">
              {(serializedBook.categories || []).map((cat, index) => (
                <Badge key={index} variant="secondary">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-bold text-lg mb-2">বইয়ের সারাংশ</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {serializedBook.description}
            </p>
          </div>
        </div>

        {/* Right Column - Actions & Pricing */}
        <div className="md:col-span-12 lg:col-span-4 space-y-6">
          {/* Digital Copy Card */}
          <Card className="border-blue-100 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-600">📱 Digital Version</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">অনলাইনে পড়ুন:</span>
                  <span className="font-bold text-blue-700">
                    {serializedBook.read_credits} Credits
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ডাউনলোড করুন:</span>
                  <span className="font-bold text-blue-400">
                    {serializedBook.download_credits} Credits
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <UnlockReadButton
                  bookId={serializedBook._id}
                  slug={serializedBook.slug}
                  readCredits={serializedBook.read_credits}
                />
                {book.pdfUrl && (
                  <div>
                    <DownloadButton
                      bookId={serializedBook._id}
                      downloadCredits={serializedBook.download_credits}
                      hasAccess={hasDownloadAccess}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Hard Copy Card (Only if available) */}
          {serializedBook.hardCopyAvailable && (
            <Card className="border-green-100 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-600">📦 Printed Hard Copy</Badge>
                </div>

                <div className="flex justify-between items-end">
                  <span className="text-3xl font-extrabold text-gray-900">
                    ৳{serializedBook.hardCopyPrice}
                  </span>
                  {serializedBook.hardCopyStock > 0 ? (
                    <span className="text-sm font-medium text-green-600">
                      In Stock ({serializedBook.hardCopyStock})
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-red-600">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <AddToCartButton book={serializedBook} />
                  <Button
                    variant="secondary"
                    className="w-full"
                    disabled={serializedBook.hardCopyStock <= 0}
                  >
                    এখনই কিনুন
                  </Button>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <span>সারা বাংলাদেশে হোম ডেলিভারি</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-gray-400" />
                    <span>অরিজিনাল প্রিন্টেড কপি গ্যারান্টি</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {/* Book Reviews Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <BookReviews bookId={serializedBook._id} />
      </div>
    </div>
  );
}
