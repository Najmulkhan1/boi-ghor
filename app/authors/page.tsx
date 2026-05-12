import Link from "next/link";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Book from "@/models/Book"; // বইয়ের সংখ্যা দেখানোর জন্য
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, ChevronRight, BookOpen, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuthorsListPage() {
  await connectToDatabase();

  // ডাটাবেস থেকে লেখক এবং তাদের বইয়ের সংখ্যা আনার চেষ্টা
  const authors = await User.find({ role: "author" }).sort({ name: 1 }).lean();

  return (
    <div className="min-h-screen bg-[#f8fafc] mt-10 dark:bg-gray-950 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500/10 to-transparent -z-10" />
      <div className="absolute top-20 right-[-10%] w-[40%] h-[400px] bg-blue-400/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 py-16 max-w-7xl relative">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-sm font-bold tracking-wide uppercase">
            <Star className="w-4 h-4 fill-current" />
            আমাদের গর্ব
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            গুণী <span className="text-indigo-600">লেখকবৃন্দ</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            জ্ঞানের আলো ছড়িয়ে দেওয়া মানুষগুলোর সাথে পরিচিত হোন। তাঁদের প্রোফাইল ঘুরে দেখুন এবং পছন্দের বইগুলো সংগ্রহ করুন।
          </p>
        </div>

        {/* Authors Grid */}
        {authors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {authors.map((author: any) => (
              <Link key={author._id.toString()} href={`/authors/${author._id.toString()}`} className="group">
                <Card className="relative overflow-hidden border-0 shadow-sm ring-1 ring-slate-200 dark:ring-gray-800 rounded-3xl bg-white dark:bg-gray-900 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-indigo-500/10 group-hover:ring-indigo-500/50">
                  
                  {/* Top Decorative bar */}
                  <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <CardContent className="p-8 flex flex-col items-center">
                    {/* Avatar Container */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                      <Avatar className="h-28 w-28 border-4 border-white dark:border-gray-800 shadow-xl relative z-10 transition-transform duration-500 group-hover:scale-105">
                        <AvatarImage src={author.avatar || ""} alt={author.name} className="object-cover" />
                        <AvatarFallback className="text-4xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold">
                          {author.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    {/* Author Info */}
                    <div className="text-center space-y-2">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {author.name}
                      </h2>
                      
                      <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-widest">
                        <BookOpen className="w-3 h-3" />
                        অফিসিয়াল লেখক
                      </div>

                      <p className="text-sm text-slate-500 dark:text-gray-400 line-clamp-2 pt-2 leading-relaxed">
                        {author.bio || "বই ঘরের একজন নিয়মিত লেখক যিনি সাহিত্যের মাধ্যমে আলো ছড়িয়ে দিচ্ছেন।"}
                      </p>
                    </div>

                    {/* Footer Action */}
                    <div className="mt-8 pt-6 border-t border-slate-50 dark:border-gray-800 w-full flex items-center justify-center">
                      <div className="flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                        প্রোফাইল দেখুন 
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center py-20 px-6 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-gray-800">
            <div className="w-20 h-20 bg-slate-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">কোনো লেখক নেই</h3>
            <p className="text-slate-500 dark:text-gray-400">এই মুহূর্তে আমাদের তালিকায় কোনো লেখক যুক্ত করা হয়নি। অনুগ্রহ করে পরে চেষ্টা করুন।</p>
          </div>
        )}
      </div>
    </div>
  );
}