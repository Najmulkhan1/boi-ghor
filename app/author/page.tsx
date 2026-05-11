"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Star, MessageSquare, Loader2, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthorDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/author/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-medium">ড্যাশবোর্ড লোড হচ্ছে...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "মোট বই",
      value: stats?.totalBooks || 0,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
    },
    {
      title: "মোট পাঠক (Unlocks)",
      value: stats?.totalReaders || 0,
      icon: Users,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      borderColor: "border-emerald-200",
    },
    {
      title: "মোট রিভিউ",
      value: stats?.totalReviews || 0,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-200",
    },
    {
      title: "গড় রেটিং",
      value: `${stats?.avgRating} / 5.0`,
      icon: Star,
      color: "text-amber-500",
      bgColor: "bg-amber-100",
      borderColor: "border-amber-200",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold mb-2">স্বাগতম, {session?.user?.name}! 👋</h1>
          <p className="text-blue-100 text-lg max-w-xl">
            আপনার Author Dashboard-এ আপনাকে স্বাগতম। এখান থেকে আপনি আপনার বইয়ের স্ট্যাটাস দেখতে এবং নতুন বই প্রকাশ করতে পারবেন।
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button asChild className="bg-white text-blue-700 hover:bg-blue-50 font-bold border-0">
              <Link href="/author/add-book">নতুন বই প্রকাশ করুন</Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent border-blue-300 text-white hover:bg-blue-600/50">
              <Link href="/author/my-books">আমার বইগুলো দেখুন</Link>
            </Button>
          </div>
        </div>
        {/* Background decorative element */}
        <TrendingUp className="absolute right-0 bottom-0 w-64 h-64 text-white opacity-10 translate-x-10 translate-y-10" />
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-slate-500" /> একনজরে পরিসংখ্যান
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`border-2 ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow`}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${stat.bgColor} ${stat.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm font-semibold mb-1">{stat.title}</p>
                    <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-2">আপনার পাবলিক প্রোফাইল</h3>
          <p className="text-slate-500 text-sm mb-4">পাঠকরা আপনাকে কীভাবে দেখে তা চেক করুন।</p>
          <Button asChild variant="outline" className="w-full gap-2">
            <Link href={`/authors/${session?.user?.id}`}>
              প্রোফাইল ভিজিট করুন <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-2">হেল্প ও সাপোর্ট</h3>
          <p className="text-slate-500 text-sm mb-4">যেকোনো টেকনিক্যাল সমস্যার জন্য অ্যাডমিনের সাথে যোগাযোগ করুন।</p>
          <Button asChild variant="outline" className="w-full gap-2">
            <Link href="mailto:support@boighor.com">
              ইমেইল করুন
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// BarChart3 আইকনটি উপরে ইমপোর্ট করতে ভুলে গেলে এই লাইনটি ফাইলের একদম উপরে ইমপোর্টের সাথে যোগ করে দিন:
import { BarChart3 } from "lucide-react";