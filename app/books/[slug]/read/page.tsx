import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Book from "@/models/Book";
import PDFViewer from "@/components/pdf/PDFViewer";
import Link from "next/link";
import { ArrowLeft, Maximize2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EnhancedPDFViewer from "@/components/pdf/EnhancedPDFViewer";

export default async function ReadBookPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);

  // ইউজার লগিন চেক
  if (!session) {
    redirect("/auth/login");
  }

  const { slug } = await params;
  await connectToDatabase();
  const book = await Book.findOne({ slug }).lean();

  if (!book) return notFound();

  // পিডিএফ চেক
  if (!book.pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">পিডিএফ পাওয়া যায়নি</h2>
          <p className="text-gray-500 mb-6">দুঃখিত, এই বইটির ডিজিটাল কপি এখনো লাইব্রেরিতে যুক্ত করা হয়নি।</p>
          <Button asChild className="w-full">
            <Link href={`/books/${slug}`}>ফিরে যান</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col overflow-hidden">
      
      {/* --- আধুনিক রিডার হেডার --- */}
      <header className="h-16 border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link 
              href={`/books/${slug}`} 
              className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all"
              title="ফিরে যান"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="hidden md:block">
              <h1 className="text-white font-medium text-sm line-clamp-1">{book.title}</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Reading Mode</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white sm:flex hidden">
              <Share2 className="w-4 h-4" />
            </Button>
            <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block"></div>
            <div className="flex items-center gap-2 bg-blue-600 px-3 py-1.5 rounded-md text-xs font-semibold text-white">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- পিডিএফ ভিউয়ার কন্টেইনার --- */}
      {/* 
          এখানে max-w-4xl ব্যবহার করা হয়েছে যাতে বড় স্ক্রিনে পিডিএফটি বেশি চওড়া না হয়ে যায়।
          h-[calc(100vh-64px)] দিয়ে হেডার বাদে বাকি পুরো স্ক্রিন হাইট সেট করা হয়েছে।
      */}
    

    <main className="flex-1 flex flex-col items-center bg-[#121212] overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-5xl mx-auto py-4 md:py-6 px-2 md:px-4">
          
          {/* নতুন প্রফেশনাল ভিউয়ার */}
          <div className="relative rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.7)] border border-white/5 bg-[#1e1e1e]">
             <EnhancedPDFViewer fileUrl={book.pdfUrl} />
          </div>

          <div className="mt-6 text-center text-gray-500 text-xs">
            © {new Date().getFullYear()} Your Library - Happy Reading
          </div>
        </div>
      </main>
      {/* কাস্টম স্ক্রলবার স্টাইল (অপশনাল) */}
    </div>
  );
}