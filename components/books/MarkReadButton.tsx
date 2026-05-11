"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  bookId: string;
  initialStatus: boolean;
}

export default function MarkReadButton({ bookId, initialStatus }: Props) {
  const [isRead, setIsRead] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleStatus = async () => {
    setLoading(true);
    const newStatus = !isRead;
    
    try {
      const res = await fetch("/api/user/books/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, isRead: newStatus }),
      });

      if (res.ok) {
        setIsRead(newStatus);
        router.refresh(); 
      } else {
        alert("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error("Mark Read Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant={isRead ? "default" : "outline"} 
      size="sm" 
      onClick={toggleStatus} 
      disabled={loading}
      className={`w-full gap-2 h-9 text-xs font-semibold transition-colors ${
        isRead 
          ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600" 
          : "text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50"
      }`}
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : isRead ? (
        <><CheckCircle2 className="w-4 h-4" /> পড়া সম্পন্ন</>
      ) : (
        <><Circle className="w-4 h-4" /> পড়া বাকি</>
      )}
    </Button>
  );
}