"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2 } from "lucide-react";

interface Props {
  bookId: string;
  slug: string;
  readCredits: number;
}

export default function UnlockReadButton({ bookId, slug, readCredits }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUnlockAndRead = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/library/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      const data = await res.json();

      if (res.ok) {
        // আনলক সফল হলে রিডিং পেজে পাঠিয়ে দেবে
        router.push(`/books/${slug}/read`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleUnlockAndRead}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <BookOpen className="w-4 h-4" />
      )}
      {readCredits > 0 ? `${readCredits} ক্রেডিট দিয়ে পড়ুন` : "ফ্রি পড়ুন"}
    </Button>
  );
}