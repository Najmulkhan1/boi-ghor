"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // ড্রপডাউনের বাইরে ক্লিক করলে যেন বন্ধ হয়ে যায়, সেজন্য Ref
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live Search Fetching (Debounced)
  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      setIsOpen(true);
      
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.books);
        }
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setLoading(false);
      }
    };

    // ইউজার টাইপ করা থামানোর ৩০০ মিলি-সেকেন্ড পর API কল হবে (সার্ভার লোড কমানোর জন্য)
    const timeoutId = setTimeout(fetchResults, 300); 
    return () => clearTimeout(timeoutId);
  }, [query]);

  // এন্টার চাপলে বা সার্চ আইকনে ক্লিক করলে ফুল সার্চ পেজে যাবে
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/books?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative hidden md:block w-64 lg:w-80 z-50" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="বই বা লেখকের নাম খুঁজুন..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="pr-10 rounded-full bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
          <Search className="w-5 h-5" />
        </button>
      </form>

      {/* Live Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[400px]">
          {loading ? (
            <div className="p-5 flex items-center justify-center text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> খুঁজছি...
            </div>
          ) : results.length > 0 ? (
            <div className="overflow-y-auto py-2">
              {results.map((book) => (
                <Link 
                  key={book._id} 
                  href={`/books/${book.slug}`}
                  onClick={() => { setIsOpen(false); setQuery(""); }}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-10 h-14 bg-gray-100 rounded shadow-sm flex-shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={book.coverImage || "https://via.placeholder.com/40x56"} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{book.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{book.authorName}</p>
                  </div>
                </Link>
              ))}
              
              {/* See all results button */}
              <div className="px-4 py-3 border-t text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <button 
                  onClick={() => handleSearch()}
                  className="text-sm font-semibold text-blue-600 w-full"
                >
                  সব রেজাল্ট দেখুন
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 text-sm">
              "{query}" নামে কোনো বই পাওয়া যায়নি!
            </div>
          )}
        </div>
      )}
    </div>
  );
}