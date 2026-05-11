"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function BookReviews({ bookId }: { bookId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // ফর্ম স্টেট
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const fetchReviews = async () => {
    const res = await fetch(`/api/reviews?bookId=${bookId}`);
    const data = await res.json();
    if (res.ok) setReviews(data.reviews);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("অনুগ্রহ করে স্টার রেটিং দিন!");
    
    setSubmitting(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, rating, comment }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (res.ok) {
      setRating(0);
      setComment("");
      fetchReviews(); // রিভিউ লিস্ট আপডেট করা
    } else {
      alert(data.message);
    }
  };

  if (loading) return <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" /></div>;

  return (
    <div className="mt-12 space-y-8">
      <h3 className="text-2xl font-bold text-gray-900 border-b pb-4">রেটিং এবং রিভিউ ({reviews.length})</h3>

      {/* Write a Review Section */}
      {session ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl border">
          <h4 className="font-semibold mb-4 text-gray-700">আপনার মতামত জানান</h4>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    (hoveredRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            required
            placeholder="বইটি সম্পর্কে আপনার মতামত লিখুন..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-4"
            rows={4}
          />
          <Button type="submit" disabled={submitting || rating === 0 || !comment} className="bg-blue-600 hover:bg-blue-700">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "রিভিউ সাবমিট করুন"}
          </Button>
        </form>
      ) : (
        <div className="bg-blue-50 p-6 rounded-xl text-center border border-blue-100">
          <p className="text-blue-800">রিভিউ দিতে চাইলে অনুগ্রহ করে লগিন করুন।</p>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-6 mt-8">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border-b pb-6 last:border-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                  {review.userId?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{review.userId?.name || "ইউজার"}</p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 ml-13 whitespace-pre-wrap">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>এখনো কেউ রিভিউ দেয়নি। প্রথম রিভিউটি আপনিই দিন!</p>
          </div>
        )}
      </div>
    </div>
  );
}