import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import UserBook from "@/models/UserBook";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Library, CheckCircle } from "lucide-react";
import MarkReadButton from "@/components/books/MarkReadButton";

export default async function MyLibraryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  await connectToDatabase();

  // ইউজারের আনলক করা বইগুলো আনা হচ্ছে
  const myBooks = await UserBook.find({ 
    userId: session.user.id, 
    canRead: true 
  })
    .populate("bookId", "title slug coverImage authorName")
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <Library className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-extrabold text-gray-900">আমার ডিজিটাল লাইব্রেরি</h1>
      </div>

      {myBooks.length === 0 ? (
        <Card className="text-center py-20 border-dashed">
          <CardContent>
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">আপনার লাইব্রেরি এখনো ফাঁকা!</h2>
            <p className="text-gray-500 mb-6">ক্রেডিট ব্যবহার করে ডিজিটাল বই আনলক করুন এবং পড়া শুরু করুন।</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/books">বই ব্রাউজ করুন</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {myBooks.map((record: any) => {
            const book = record.bookId;
            if (!book) return null;

            return (
              <Card key={record._id.toString()} className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow border-slate-200">
                <div className="relative h-56 w-full bg-gray-100 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={book.coverImage || "https://via.placeholder.com/300x400?text=No+Cover"} 
                    alt={book.title} 
                    className={`w-full h-full object-cover transition-all duration-300 ${record.isRead ? "grayscale-[30%] opacity-90" : "group-hover:scale-105"}`}
                  />
                  
                  {/* যদি পড়া শেষ হয়, তবে ছবির ওপরে একটি ব্যাজ দেখাবে */}
                  {record.isRead && (
                    <div className="absolute top-2 right-2 bg-emerald-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded shadow-sm flex items-center gap-1 font-medium">
                      <CheckCircle className="w-3 h-3" /> সমাপ্ত
                    </div>
                  )}
                  
                  {/* Progress bar placeholder */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
                    <div className={`h-full ${record.isRead ? "bg-emerald-500 w-full" : "bg-blue-600 w-[10%]"}`}></div>
                  </div>
                </div>

                <CardContent className="p-4 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className={`font-bold text-sm md:text-base leading-tight line-clamp-2 ${record.isRead ? "text-slate-600" : "text-slate-900"}`} title={book.title}>
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{book.authorName}</p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 mt-auto">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 gap-2 text-xs h-9 font-semibold" 
                      asChild
                    >
                      <Link href={`/books/${book.slug}/read`}>
                        <BookOpen className="w-3 h-3" /> {record.isRead ? "আবার পড়ুন" : "পড়া চালিয়ে যান"}
                      </Link>
                    </Button>
                    
                    {/* Mark as Read Button */}
                    <MarkReadButton 
                      bookId={book._id.toString()} 
                      initialStatus={record.isRead || false} 
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}