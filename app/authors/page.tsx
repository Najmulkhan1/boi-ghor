import Link from "next/link";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, ChevronRight, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuthorsListPage() {
  await connectToDatabase();

  // ডাটাবেস থেকে শুধু "author" রোলের ইউজারদের খুঁজে বের করা হচ্ছে
  const authors = await User.find({ role: "author" }).sort({ name: 1 }).lean();

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-full mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">আমাদের লেখকবৃন্দ</h1>
          <p className="text-slate-500 mt-3 text-lg max-w-2xl mx-auto">
            বই ঘরের জনপ্রিয় এবং গুণী লেখকদের তালিকা। আপনার পছন্দের লেখকের প্রোফাইল ঘুরে দেখুন এবং তাদের লেখা বইগুলো পড়ুন।
          </p>
        </div>

        {/* Authors Grid */}
        {authors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {authors.map((author: any) => (
              <Link key={author._id.toString()} href={`/authors/${author._id.toString()}`}>
                <Card className="border-0 shadow-sm ring-1 ring-slate-200 rounded-2xl hover:shadow-lg hover:ring-indigo-300 transition-all cursor-pointer group bg-white h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    
                    {/* Avatar */}
                    <Avatar className="h-24 w-24 border-4 border-indigo-50 group-hover:border-indigo-100 transition-colors mb-4">
                      <AvatarImage src={author.avatar || ""} alt={author.name} />
                      <AvatarFallback className="text-3xl bg-indigo-100 text-indigo-700 font-bold">
                        {author.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Author Info */}
                    <h2 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {author.name}
                    </h2>
                    
                    {author.bio ? (
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                        {author.bio}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400 mt-2 italic">
                        অফিসিয়াল লেখক অ্যাকাউন্ট
                      </p>
                    )}

                    {/* View Profile Button / Link */}
                    <div className="mt-6 flex items-center justify-center gap-1 text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                      প্রোফাইল দেখুন <ChevronRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-lg">এখনো কোনো লেখক যুক্ত করা হয়নি!</p>
          </div>
        )}

      </div>
    </div>
  );
}