"use client";

import { useState, useEffect } from "react";
import { Users, Library, Unlock, ShoppingBag, Loader2, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

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
        <Loader2 className="w-12 h-12 animate-spin text-indigo-400 mb-4" />
        <p className="text-slate-400 font-medium">প্ল্যাটফর্ম ডেটা লোড হচ্ছে...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "মোট ইউজার",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      href: "/admin/users",
      border: "border-blue-500/20",
    },
    {
      title: "মোট আপলোডকৃত বই",
      value: stats?.totalBooks ?? 0,
      icon: Library,
      gradient: "from-violet-500 to-purple-600",
      iconBg: "bg-violet-500/20",
      iconColor: "text-violet-400",
      href: "/admin/books",
      border: "border-violet-500/20",
    },
    {
      title: "ডিজিটাল আনলক/ডাউনলোড",
      value: stats?.totalUnlocks ?? 0,
      icon: Unlock,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      href: "/admin",
      border: "border-emerald-500/20",
    },
    {
      title: "ফিজিক্যাল অর্ডার",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      gradient: "from-orange-500 to-amber-600",
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-400",
      href: "/admin/orders",
      border: "border-orange-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-indigo-600/20 to-violet-600/10 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold mb-2 text-white">সিস্টেম ওভারভিউ 🚀</h1>
          <p className="text-slate-400 text-base max-w-2xl">
            বই ঘর (Boi Ghor) এর সম্পূর্ণ প্ল্যাটফর্মের রিয়েল-টাইম ডেটা এবং পরিসংখ্যান।
          </p>
        </div>
        <TrendingUp className="absolute right-6 bottom-6 w-48 h-48 text-indigo-500/10" />
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">প্লাটফর্ম সামারি</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                href={stat.href}
                className={`group bg-slate-900 rounded-2xl border ${stat.border} hover:border-opacity-60 p-6 flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 transition-all duration-200`}
              >
                <div className={`w-12 h-12 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white leading-none mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                </div>
                <div className={`h-0.5 w-full rounded-full bg-gradient-to-r ${stat.gradient} opacity-40 group-hover:opacity-80 transition-opacity`} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">কুইক অ্যাকশন</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: ShoppingBag,
              iconBg: "bg-indigo-500/20",
              iconColor: "text-indigo-400",
              title: "অর্ডার স্ট্যাটাস আপডেট",
              desc: "নতুন অর্ডারগুলো কনফার্ম এবং ট্র্যাকিং বসান।",
              href: "/admin/orders",
              label: "অর্ডার ম্যানেজ করুন",
            },
            {
              icon: Users,
              iconBg: "bg-emerald-500/20",
              iconColor: "text-emerald-400",
              title: "ইউজার ও রোল কন্ট্রোল",
              desc: "ইউজারদের লেখক বা অ্যাডমিন রোল দিন এবং ক্রেডিট ম্যানেজ করুন।",
              href: "/admin/users",
              label: "ইউজার ম্যানেজ করুন",
            },
            {
              icon: Library,
              iconBg: "bg-violet-500/20",
              iconColor: "text-violet-400",
              title: "বই ও স্টক ম্যানেজমেন্ট",
              desc: "নতুন বই যোগ করুন বা হার্ডকপির স্টক আপডেট করুন।",
              href: "/admin/books",
              label: "বই ম্যানেজ করুন",
            },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-3 hover:border-slate-700 transition-colors">
                <div className={`w-11 h-11 rounded-xl ${action.iconBg} ${action.iconColor} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{action.title}</h3>
                  <p className="text-slate-500 text-sm">{action.desc}</p>
                </div>
                <Link
                  href={action.href}
                  className="mt-auto w-full text-center py-2 px-4 rounded-xl border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800 hover:text-white hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2"
                >
                  {action.label} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}