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

  const myBooks = await UserBook.find({ 
    userId: session.user.id, 
    canRead: true 
  })
    .populate("bookId", "title slug coverImage authorName")
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
        <div className="bg-indigo-500/20 p-3 rounded-xl text-indigo-400">
          <Library className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">আমার ডিজিটাল লাইব্রেরি</h1>
          <p className="text-slate-500 text-sm">আপনার আনলক করা সব বই এখানে আছে।</p>
        </div>
      </div>

      {myBooks.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-dashed border-slate-800 rounded-2xl">
          <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">আপনার লাইব্রেরি এখনো ফাঁকা!</h2>
          <p className="text-slate-500 mb-6">ক্রেডিট ব্যবহার করে ডিজিটাল বই আনলক করুন এবং পড়া শুরু করুন।</p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href="/books">বই ব্রাউজ করুন</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {myBooks.map((record: any) => {
            const book = record.bookId;
            if (!book) return null;

            return (
              <Card key={record._id.toString()} className="flex flex-col h-full overflow-hidden hover:shadow-lg hover:shadow-black/20 transition-all border-slate-800 bg-slate-900 group">
                <div className="relative h-56 w-full bg-slate-800 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={book.coverImage || "https://via.placeholder.com/300x400?text=No+Cover"} 
                    alt={book.title} 
                    className={`w-full h-full object-cover transition-transform duration-500 ${record.isRead ? "opacity-60" : "group-hover:scale-110"}`}
                  />
                  
                  {record.isRead && (
                    <div className="absolute top-2 right-2 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded shadow-sm flex items-center gap-1 font-bold tracking-wider uppercase">
                      <CheckCircle className="w-3 h-3" /> সমাপ্ত
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-700">
                    <div className={`h-full ${record.isRead ? "bg-emerald-500 w-full" : "bg-indigo-500 w-[10%]"}`}></div>
                  </div>
                </div>

                <CardContent className="p-4 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className={`font-bold text-sm leading-tight line-clamp-2 ${record.isRead ? "text-slate-400" : "text-white"}`} title={book.title}>
                      {book.title}
                    </h3>
                    <p className="text-xs text-indigo-400 mt-1">{book.authorName}</p>
                  </div>

                  <div className="flex flex-col gap-2 pt-3 border-t border-slate-800 mt-auto">
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-xs h-9 font-semibold" 
                      asChild
                    >
                      <Link href={`/books/${book.slug}/read`}>
                        <BookOpen className="w-3.5 h-3.5" /> {record.isRead ? "আবার পড়ুন" : "পড়া চালিয়ে যান"}
                      </Link>
                    </Button>
                    
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