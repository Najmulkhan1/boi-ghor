import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, ShoppingBag } from "lucide-react";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-blue-50 py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            আপনার পছন্দের সব বই <br className="hidden md:block" /> 
            <span className="text-blue-600">এক ঠিকানায়</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            ডিজিটাল ফরম্যাটে পিডিএফ পড়ুন অথবা হার্ডকপি অর্ডার করে হোম ডেলিভারি নিন। বই পড়ার এক নতুন অভিজ্ঞতা!
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/books">
                <BookOpen className="w-5 h-5" />
                বই পড়া শুরু করুন
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="/books?type=hardcopy">
                <ShoppingBag className="w-5 h-5" />
                হার্ডকপি কিনুন
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Placeholder for New Arrivals / Featured Books */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">নতুন যুক্ত হওয়া বইসমূহ</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* এই জায়গায় আমরা পরে Database থেকে ডাটা এনে BookCard দেখাবো */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-64 flex items-center justify-center">
              <span className="text-gray-400">Book {i} Placeholder</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}