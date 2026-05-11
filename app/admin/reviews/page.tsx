"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2, Search, Star, Trash2, BookOpen, Calendar } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/reviews");
    if (res.ok) {
      const data = await res.json();
      setReviews(data.reviews);
    }
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই রিভিউটি ডিলিট করতে চান? এই অ্যাকশনটি বাতিল করা যাবে না।")) return;
    
    setDeletingId(id);
    const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
    
    if (res.ok) {
      setReviews(prev => prev.filter(r => r._id !== id));
    } else {
      alert("রিভিউ ডিলিট করতে সমস্যা হয়েছে।");
    }
    setDeletingId(null);
  };

  const filteredReviews = reviews.filter(review => 
    review.userId?.name.toLowerCase().includes(search.toLowerCase()) || 
    review.bookId?.title.toLowerCase().includes(search.toLowerCase()) ||
    review.comment?.toLowerCase().includes(search.toLowerCase())
  );

  // স্টার রেটিং রেন্ডার করার ফাংশন
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
    ));
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-rose-100 p-3 rounded-xl text-rose-600">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">রিভিউ মডারেশন</h1>
            <p className="text-sm text-slate-500">ইউজারদের দেওয়া সব রেটিং ও রিভিউ মনিটর করুন।</p>
          </div>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="ইউজার, বই বা কমেন্ট খুঁজুন..." 
            className="pl-10 h-10 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.length > 0 ? filteredReviews.map((review) => (
          <div key={review._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            
            {/* Book Info */}
            <div className="flex gap-3 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
              {review.bookId ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={review.bookId.coverImage} className="w-10 h-14 object-cover rounded shadow-sm" alt="Book Cover" />
                  <div>
                    <p className="text-sm font-bold text-slate-800 line-clamp-1">{review.bookId.title}</p>
                    <div className="flex gap-1 mt-1">{renderStars(review.rating)}</div>
                  </div>
                </>
              ) : (
                <p className="text-xs text-red-500 font-bold flex items-center gap-1"><BookOpen className="w-3 h-3"/> বই ডিলিট করা হয়েছে</p>
              )}
            </div>

            {/* User & Comment */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                  {review.userId?.avatar ? (
                     <img src={review.userId.avatar} className="w-full h-full object-cover" alt="User" />
                  ) : review.userId?.name.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{review.userId?.name || "Unknown User"}</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> 
                    {new Date(review.createdAt).toLocaleDateString('bn-BD')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200 min-h-[60px]">
                "{review.comment}"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
              <Button 
                variant="destructive" 
                size="sm" 
                className="gap-2 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-500 hover:text-white transition-colors"
                onClick={() => handleDelete(review._id)}
                disabled={deletingId === review._id}
              >
                {deletingId === review._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                রিভিউ ডিলিট করুন
              </Button>
            </div>

          </div>
        )) : (
          <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50 text-slate-300" />
            <p>কোনো রিভিউ খুঁজে পাওয়া যায়নি!</p>
          </div>
        )}
      </div>
    </div>
  );
}