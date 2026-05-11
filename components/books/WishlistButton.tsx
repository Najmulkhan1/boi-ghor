"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function WishlistButton({ bookId }: { bookId: string }) {
  const { data: session } = useSession();
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // পেজ লোড হওয়ার সময় ইউজার এই বইটি আগে যোগ করেছে কি না চেক করা
  useEffect(() => {
    if (session) {
      fetch("/api/wishlist")
        .then((res) => res.json())
        .then((data) => setIsAdded(data.wishlist.includes(bookId)));
    }
  }, [session, bookId]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // যেন কার্ডের লিঙ্কে ক্লিক না লেগে যায়
    if (!session) return router.push("/auth/login");

    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (res.ok) setIsAdded(data.added);
    } catch (error) {
      console.error("Wishlist error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`p-2 rounded-full transition-all border ${
        isAdded 
        ? "bg-red-50 border-red-200 text-red-500 shadow-sm" 
        : "bg-white border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-100"
      }`}
      title={isAdded ? "পছন্দের তালিকা থেকে সরান" : "পছন্দের তালিকায় যোগ করুন"}
    >
      <Heart className={`w-5 h-5 ${isAdded ? "fill-current" : ""}`} />
    </button>
  );
}