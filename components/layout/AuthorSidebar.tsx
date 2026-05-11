"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookPlus, Library, BarChart3, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AuthorSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "ওভারভিউ ও স্ট্যাটস", href: "/author", icon: BarChart3 },
    { name: "নতুন বই যুক্ত করুন", href: "/author/add-book", icon: BookPlus },
    { name: "আমার আপলোডকৃত বই", href: "/author/my-books", icon: Library },
    { name: "প্রোফাইল সেটিংস", href: "/dashboard", icon: Settings }, // সাধারণ ড্যাশবোর্ডে নিয়ে যাবে
  ];

  return (
    <div className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-4 shadow-xl rounded-2xl md:rounded-none md:min-h-[calc(100vh-80px)] text-slate-300">
      <div className="mb-8 px-4 py-2 border-b border-slate-700/50">
        <h2 className="text-xl font-bold text-white tracking-wide">Author Panel</h2>
        <p className="text-xs text-slate-400 mt-1">Manage your publications</p>
      </div>

      <div className="space-y-2 flex-grow">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/author");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
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
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
        >
          <LogOut className="w-5 h-5" />
          লগআউট
        </button>
      </div>
    </div>
  );
}