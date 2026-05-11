"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Library, Unlock, ShoppingBag, Loader2, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-medium">প্ল্যাটফর্ম ডেটা লোড হচ্ছে...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "মোট ইউজার",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
      href: "/admin/users"
    },
    {
      title: "মোট আপলোডকৃত বই",
      value: stats?.totalBooks || 0,
      icon: Library,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-200",
      href: "/admin/books"
    },
    {
      title: "ডিজিটাল আনলক/ডাউনলোড",
      value: stats?.totalUnlocks || 0,
      icon: Unlock,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      borderColor: "border-emerald-200",
      href: "/admin"
    },
    {
      title: "ফিজিক্যাল অর্ডার",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-200",
      href: "/admin/orders"
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome & Overview Header */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold mb-2 text-white">সিস্টেম ওভারভিউ 🚀</h1>
          <p className="text-indigo-200 text-lg max-w-2xl">
            বই ঘর (Boi Ghor) এর সম্পূর্ণ প্ল্যাটফর্মের রিয়েল-টাইম ডেটা এবং পরিসংখ্যান। এখান থেকে আপনি পুরো সিস্টেম মনিটর করতে পারবেন।
          </p>
        </div>
        <TrendingUp className="absolute right-0 bottom-0 w-64 h-64 text-indigo-500 opacity-20 translate-x-10 translate-y-10" />
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">প্লাটফর্ম সামারি</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`border-2 ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-4 rounded-2xl ${stat.bgColor} ${stat.color} transition-transform group-hover:scale-110`}>
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-slate-900 mb-1">{stat.value}</h3>
                    <p className="text-slate-500 text-sm font-semibold">{stat.title}</p>
                  </div>
                </CardContent>
                <Link href={stat.href} className="absolute inset-0 z-10">
                  <span className="sr-only">Go to {stat.title}</span>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 mt-10">কুইক অ্যাকশন</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-start">
            <ShoppingBag className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="font-bold text-slate-800 mb-1">অর্ডার স্ট্যাটাস আপডেট</h3>
            <p className="text-slate-500 text-sm mb-4">নতুন অর্ডারগুলো কনফার্ম এবং ট্র্যাকিং বসান।</p>
            <Button asChild variant="outline" className="mt-auto w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50">
              <Link href="/admin/orders">অর্ডার ম্যানেজ করুন <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-start">
            <Users className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="font-bold text-slate-800 mb-1">ইউজার ও রোল কন্ট্রোল</h3>
            <p className="text-slate-500 text-sm mb-4">ইউজারদের লেখক বা অ্যাডমিন রোল দিন এবং ক্রেডিট ম্যানেজ করুন।</p>
            <Button asChild variant="outline" className="mt-auto w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50">
              <Link href="/admin/users">ইউজার ম্যানেজ করুন <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-start">
            <Library className="w-8 h-8 text-indigo-600 mb-3" />
            <h3 className="font-bold text-slate-800 mb-1">বই ও স্টক ম্যানেজমেন্ট</h3>
            <p className="text-slate-500 text-sm mb-4">নতুন বই যোগ করুন বা হার্ডকপির স্টক আপডেট করুন।</p>
            <Button asChild variant="outline" className="mt-auto w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50">
              <Link href="/admin/books">বই ম্যানেজ করুন <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}