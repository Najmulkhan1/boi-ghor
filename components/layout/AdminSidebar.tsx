"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Library, 
  Ticket, 
  MessageSquare, 
  LogOut,
  ShieldCheck,
  BookOpen,
  ArrowLeft
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "ওভারভিউ ও অ্যানালিটিক্স", href: "/admin", icon: LayoutDashboard },
    { name: "অর্ডার ম্যানেজমেন্ট", href: "/admin/orders", icon: ShoppingBag },
    { name: "বই ও স্টক ম্যানেজ", href: "/admin/books", icon: Library },
    { name: "ইউজার ও রোল", href: "/admin/users", icon: Users },
    { name: "কুপন ও ডিসকাউন্ট", href: "/admin/coupons", icon: Ticket },
    { name: "রিভিউ মডারেশন", href: "/admin/reviews", icon: MessageSquare },
  ];

  return (
    <div className="h-full bg-[#0f172a] border-r border-slate-800 flex flex-col p-4 text-slate-300">
      
      {/* লোগো সেকশন - এখানে ক্লিক করলে হোমপেজে যাবে */}
      <div className="mb-8 px-2 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-500/20">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-white leading-none">বই ঘর</span>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* নেভিগেশন আইটেমস */}
      <div className="space-y-1 flex-grow">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[2px] px-4 mb-2">মেনু</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                  : "hover:bg-slate-800/50 hover:text-white text-slate-400"
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "group-hover:text-indigo-400"}`} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* নিচের অংশ - হোমপেজে ফেরার বাটন এবং লগআউট */}
      <div className="pt-4 space-y-2 border-t border-slate-800">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          মূল ওয়েবসাইট
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left text-sm"
        >
          <LogOut className="w-5 h-5" />
          লগআউট
        </button>
      </div>
    </div>
  );
}