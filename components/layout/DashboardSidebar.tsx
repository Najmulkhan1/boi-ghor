"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, BookOpen, Heart, MapPin, ShoppingBag, Wallet, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardSidebar() {
  const pathname = usePathname();

  // ড্যাশবোর্ডের মেনু লিস্ট
  const navItems = [
    { name: "প্রোফাইল", href: "/dashboard", icon: User },
    { name: "আমার লাইব্রেরি", href: "/dashboard/library", icon: BookOpen },
    { name: "পছন্দের তালিকা", href: "/dashboard/wishlist", icon: Heart },
    { name: "আমার ঠিকানা", href: "/dashboard/addresses", icon: MapPin },
    { name: "অর্ডার হিস্ট্রি", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "ক্রেডিট কিনুন", href: "/dashboard/buy-credits", icon: Wallet },
  ];

  return (
    <div className="w-full md:w-64 bg-white border border-gray-100 flex flex-col p-4 shadow-sm rounded-2xl">
      <div className="space-y-1 flex-grow">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="pt-4 border-t border-gray-100 mt-6">
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
        >
          <LogOut className="w-5 h-5" />
          লগআউট
        </button>
      </div>
    </div>
  );
}