import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, BookOpen } from "lucide-react";
import { IBook } from "@/types";

export default function BookCard({ book }: { book: IBook }) {
  const getSafeImageSrc = (src: string | undefined) => {
    if (!src) return "https://via.placeholder.com/300x450/e2e8f0/64748b?text=No+Cover";
    const isValid = src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/");
    return isValid ? src : "https://via.placeholder.com/300x450/e2e8f0/64748b?text=Invalid+Cover";
  };

  const finalImageSrc = getSafeImageSrc(book.coverImage);

  return (
    // মূল কন্টেইনার - খোলা বইয়ের আকৃতি
    <div className="group relative flex w-full aspect-[16/11] bg-[#faf9f6] rounded-md shadow-[4px_4px_15px_rgba(0,0,0,0.06),-4px_4px_15px_rgba(0,0,0,0.04)] border border-[#e8e4db] overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      
      {/* --- বইয়ের মাঝখানের ভাঁজ (Center Spine 3D Effect) --- */}
      <div className="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-transparent via-black/[0.08] to-transparent pointer-events-none z-20" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#d6caba] to-transparent pointer-events-none z-20" />

      {/* --- পাতার সাইডের পুরুত্ব (Page Edges) --- */}
      <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-white border-l border-[#e8e4db] rounded-l-sm z-10" />
      <div className="absolute right-0 top-1 bottom-1 w-0.5 bg-white border-r border-[#e8e4db] rounded-r-sm z-10" />

      {/* =========================================
          বাম দিকের পাতা (Left Page - Image)
      ========================================= */}
      <div className="w-1/2 relative p-2.5 sm:p-3 bg-gradient-to-r from-[#f0ebe1]/40 to-[#faf9f6] flex flex-col justify-center border-r border-black/[0.03]">
        
        {/* ইমেজের ফ্রেম (ছবির উপরেও বইয়ের পাতার মতো ফিল) */}
        <div className="relative w-full h-full rounded shadow-[2px_2px_8px_rgba(0,0,0,0.15)] overflow-hidden bg-slate-100 group-hover:shadow-[3px_3px_12px_rgba(0,0,0,0.2)] transition-shadow duration-300 z-10">
          <Image
            src={finalImageSrc}
            alt={book.title || "Book Cover"}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
        </div>

        {/* টপ ব্যাজ (ইমেজের উপর) */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
          {book.hardCopyAvailable && (
            <Badge className="bg-emerald-600/90 backdrop-blur-sm text-white px-1.5 py-0 text-[8px] sm:text-[9px] uppercase font-bold rounded shadow-sm border-none">
              Hard Copy
            </Badge>
          )}
          <Badge className="bg-blue-600/90 backdrop-blur-sm text-white px-1.5 py-0 text-[8px] sm:text-[9px] uppercase font-bold w-fit rounded shadow-sm border-none">
            Digital
          </Badge>
        </div>
      </div>

      {/* =========================================
          ডান দিকের পাতা (Right Page - Information)
      ========================================= */}
      <div className="w-1/2 relative p-2.5 sm:p-3 bg-gradient-to-l from-[#f0ebe1]/40 to-[#faf9f6] flex flex-col z-10">
        
        {/* রেটিং */}
        <div className="flex items-center gap-1 mb-1.5">
          <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
          <span className="text-[10px] sm:text-xs font-bold text-gray-700">{book.averageRating || "0"}</span>
        </div>

        {/* টাইটেল এবং লেখক */}
        <div className="mb-2">
          <Link href={`/books/${book.slug}`}>
            <h3 className="font-bold text-xs sm:text-sm text-gray-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2" title={book.title}>
              {book.title}
            </h3>
          </Link>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
            <Link href={`/authors/${book?.authorId}`} className="hover:text-blue-600 hover:underline transition-colors line-clamp-1">
              {book.authorName}
            </Link>
          </p>
        </div>

        {/* প্রাইসিং সেকশন */}
        <div className="mt-auto flex flex-col gap-1">
           <div className="flex items-center justify-between bg-blue-50/70 border border-blue-100/50 px-1.5 py-1 rounded">
              <span className="text-[8px] sm:text-[9px] uppercase font-bold text-blue-600/80">Digital</span>
              <span className="text-[10px] sm:text-xs font-extrabold text-blue-700">
                {book.read_credits} <span className="font-medium text-[9px]">Cr</span>
              </span>
           </div>
           
           {book.hardCopyAvailable && (
             <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-100/50 px-1.5 py-1 rounded">
                <span className="text-[8px] sm:text-[9px] uppercase font-bold text-emerald-600/80">Hard Copy</span>
                <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700">
                  ৳{book.hardCopyPrice}
                </span>
             </div>
           )}
        </div>

        {/* অ্যাকশন বাটনস */}
        <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-gray-200/60">
          {book.hardCopyAvailable && (
            <Button 
              size="sm"
              className="flex-1 bg-gray-900 hover:bg-black text-white h-7 sm:h-8 px-1 rounded-md"
            >
              <ShoppingCart className="w-3 h-3 sm:mr-1" />
              <span className="text-[10px] sm:text-xs hidden sm:inline-block">Buy</span>
            </Button>
          )}

          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 border-gray-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 h-7 sm:h-8 px-1 rounded-md transition-colors"
            asChild
          >
            <Link href={`/books/${book.slug}`} className="flex justify-center items-center">
              <BookOpen className="w-3 h-3 sm:mr-1" />
              <span className="text-[10px] sm:text-xs font-semibold">পড়ুন</span>
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}