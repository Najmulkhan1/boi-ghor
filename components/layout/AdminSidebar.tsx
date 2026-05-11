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
  ShieldCheck
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
    <div className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col p-4 shadow-2xl rounded-2xl md:rounded-none md:min-h-screen text-slate-300">
      <div className="mb-8 px-4 py-4 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-indigo-500/20 p-2 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Admin</h2>
          <p className="text-xs text-slate-400 mt-0.5">Control Panel</p>
        </div>
      </div>

      <div className="space-y-2 flex-grow">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-800 mt-6">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
        >
          <LogOut className="w-5 h-5" />
          লগআউট
        </button>
      </div>
    </div>
  );
}