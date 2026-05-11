"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Library, Edit, Trash2, Loader2, BookOpen, Download, DollarSign } from "lucide-react";

export default function AuthorMyBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/author/books");
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books);
      }
    } catch (error) {
      console.error("Failed to fetch books", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে "${title}" বইটি ডিলিট করতে চান? এটি আর ফিরিয়ে আনা যাবে না!`)) return;

    try {
      const res = await fetch(`/api/author/books?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        // ডাটাবেস থেকে ডিলিট হলে, স্ক্রিন থেকেও সাথে সাথে সরিয়ে দেওয়া
        setBooks(books.filter((book) => book._id !== id));
        alert("বইটি সফলভাবে ডিলিট হয়েছে।");
      } else {
        const data = await res.json();
        alert(data.message || "ডিলিট করতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      alert("সার্ভার এরর!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <Library className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">আমার আপলোডকৃত বই</h1>
            <p className="text-slate-500 text-sm">আপনার লেখা মোট বই: {books.length} টি</p>
          </div>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/author/add-book">নতুন বই যুক্ত করুন</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : books.length > 0 ? (
        <div className="space-y-4">
          {books.map((book) => (
            <Card key={book._id} className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-0 flex flex-col sm:flex-row">
                
                {/* Book Cover */}
                <div className="w-full sm:w-32 h-48 sm:h-auto bg-slate-100 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                </div>

                {/* Book Details */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{book.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {book.categories?.map((cat: string, i: number) => (
                        <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md font-medium">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Info */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-blue-500" /> পড়া: {book.read_credits > 0 ? `${book.read_credits} Credits` : "ফ্রি"}</span>
                    <span className="flex items-center gap-1"><Download className="w-4 h-4 text-emerald-500" /> ডাউনলোড: {book.download_credits > 0 ? `${book.download_credits} Credits` : "ফ্রি"}</span>
                    {book.hardCopyAvailable && (
                      <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-orange-500" /> হার্ডকপি: ৳{book.hardCopyPrice}</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-5 sm:border-l border-t sm:border-t-0 border-slate-100 flex sm:flex-col justify-center gap-3 bg-slate-50 sm:w-40 flex-shrink-0">
                  <Button asChild variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 gap-2">
                    <Link href={`/author/edit-book/${book._id}`}>
                      <Edit className="w-4 h-4" /> এডিট
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDelete(book._id, book.title)}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> মুছুন
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <Library className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">আপনি এখনো কোনো বই আপলোড করেননি!</h2>
          <p className="text-slate-500 mb-6">আপনার প্রথম বইটি আপলোড করে পাঠকদের সাথে শেয়ার করুন।</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/author/add-book">নতুন বই আপলোড করুন</Link>
          </Button>
        </div>
      )}
    </div>
  );
}