"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  bookId: string;
  downloadCredits: number;
  hasAccess: boolean;
}

export default function DownloadButton({ bookId, downloadCredits, hasAccess }: Props) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDownload = async () => {
    if (!session) {
      router.push("/auth/login");
      return;
    }

    // যদি আগে কেনা না থাকে, তবে ইউজারের পারমিশন নেওয়া
    if (!hasAccess && downloadCredits > 0) {
      const confirmPurchase = window.confirm(
        `এই বইটি ডাউনলোড করতে ${downloadCredits} ক্রেডিট কাটা হবে। আপনি কি রাজি?`
      );
      if (!confirmPurchase) return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/books/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      const data = await res.json();

      if (res.ok) {
        // নতুন একটি লুকানো <a> ট্যাগ বানিয়ে অটোমেটিক ক্লিক করে ডাউনলোড শুরু করা
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.setAttribute("download", "true");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // ব্যালেন্স আপডেট দেখানোর জন্য পেজ রিফ্রেশ
        if (!hasAccess) router.refresh(); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("ডাউনলোড ফেইল হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      disabled={loading} 
      className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
    >
      {loading ? (
        <><Loader2 className="w-4 h-4 animate-spin" /> প্রসেসিং...</>
      ) : hasAccess ? (
        <><Download className="w-4 h-4" /> পিডিএফ ডাউনলোড করুন</>
      ) : (
        <><Download className="w-4 h-4" /> ডাউনলোড ({downloadCredits} Credits)</>
      )}
    </Button>
  );
}