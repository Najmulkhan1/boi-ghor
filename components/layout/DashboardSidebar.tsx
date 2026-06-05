"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, BookOpen, Heart, MapPin, ShoppingBag, Wallet, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "প্রোফাইল", href: "/dashboard", icon: User },
    { name: "আমার লাইব্রেরি", href: "/dashboard/library", icon: BookOpen },
    { name: "পছন্দের তালিকা", href: "/dashboard/wishlist", icon: Heart },
    { name: "আমার ঠিকানা", href: "/dashboard/addresses", icon: MapPin },
    { name: "অর্ডার হিস্ট্রি", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "ক্রেডিট কিনুন", href: "/dashboard/buy-credits", icon: Wallet },
  ];

  return (
    <div className="w-full bg-[#161b27] border border-slate-800 flex flex-col p-3 rounded-2xl">
      <div className="space-y-1 flex-grow">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400"}`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="pt-3 border-t border-slate-800 mt-4">
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          লগআউট
        </button>
      </div>
    </div>
  );
}