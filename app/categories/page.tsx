import Link from "next/link";
import connectToDatabase from "@/lib/db";
import Book from "@/models/Book";
import { Card, CardContent } from "@/components/ui/card";
import { BookType } from "lucide-react";

export default async function CategoriesPage() {
  await connectToDatabase();

  // ডাটাবেস থেকে ইউনিক ক্যাটাগরিগুলো বের করে আনা
  const categories = await Book.distinct("categories");

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">বইয়ের ধরণ (Categories)</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link key={cat} href={`/books?category=${encodeURIComponent(cat)}`}>
            <Card className="hover:border-blue-500 transition-all cursor-pointer group shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-600 transition-colors">
                  <BookType className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <span className="text-lg font-bold text-gray-700">{cat}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}