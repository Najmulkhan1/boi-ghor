"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Pathname ইমপোর্ট
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import { 
  ShoppingCart, BookOpen, LayoutDashboard, 
  Library, Package, LogOut, Home, User 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // কন্ডিশনাল চেকিং: মাউন্ট হওয়ার আগে কিছু রিটার্ন করবে না (Hydration Fix)
  const isExcludedPage = pathname.startsWith("/dashboard") || 
                         pathname.startsWith("/admin") || 
                         pathname.startsWith("/author");

  if (!isMounted) return null; // সার্ভার এবং ক্লায়েন্টের মধ্যে পার্থক্য কমাবে
  if (isExcludedPage) return null; // এক্সক্লুডেড পেজে নেভবার দেখাবে না

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-2 ${
        isScrolled ? "mt-2" : "mt-0"
      }`}
    >
      <nav className={`mx-auto max-w-7xl transition-all duration-300 border rounded-2xl ${
        isScrolled 
          ? "bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl shadow-lg border-gray-200/50 dark:border-gray-800/50" 
          : "bg-white dark:bg-gray-950 border-transparent"
      }`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-500/20">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
              বই ঘর
            </span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/books">সব বই</NavLink>
            <NavLink href="/categories">ক্যাটাগরি</NavLink>
            <NavLink href="/authors">লেখক</NavLink>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <SearchBar />
            </div>
            <ThemeToggle />

            {/* Cart */}
            <Link href="/cart" className="relative p-2 group transition-all">
              <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-in zoom-in shadow-sm shadow-blue-500/50">
                  {totalItems}
                </span>
              )}
            </Link>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1" />

            {/* User Dropdown */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none hover:ring-2 hover:ring-blue-500/20 rounded-full transition-all">
                  <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-800">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 mt-2 rounded-xl border-gray-200 dark:border-gray-800 shadow-xl">
                  <div className="px-2 py-1.5 mb-1">
                    <p className="text-sm font-semibold truncate">{session.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownItem href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="ড্যাশবোর্ড" />
                  <DropdownItem href="/dashboard/library" icon={<Library className="h-4 w-4" />} label="আমার লাইব্রেরি" />
                  <DropdownItem href="/dashboard/orders" icon={<Package className="h-4 w-4" />} label="অর্ডারসমূহ" />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer rounded-lg py-2"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    লগআউট
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="hidden sm:flex text-blue-700 dark:text-blue-400">
                  <Link href="/login">লগিন</Link>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 rounded-xl px-5">
                  <Link href="/register">রেজিস্টার</Link>
                </Button>
              </div>
            )}

          </div>
        </div>
      </nav>
    </header>

    {/* Bottom Navigation for Mobile */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 pb-2 pt-1 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-around h-14 px-2">
        <BottomNavItem href="/" icon={<Home className="h-5 w-5" />} label="হোম" isActive={pathname === "/"} />
        <BottomNavItem href="/categories" icon={<Library className="h-5 w-5" />} label="ক্যাটাগরি" isActive={pathname === "/categories"} />
        
        {/* Floating Action Button for Books */}
        <div className="relative -top-5 flex justify-center w-full">
          <Link 
            href="/books" 
            className="flex items-center justify-center h-14 w-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full shadow-lg shadow-blue-500/40 text-white hover:scale-105 active:scale-95 transition-all"
          >
            <BookOpen className="h-6 w-6" />
          </Link>
        </div>

        <BottomNavItem href="/cart" icon={<ShoppingCart className="h-5 w-5" />} label="কার্ট" badge={totalItems} isActive={pathname === "/cart"} />
        <BottomNavItem href={session ? "/dashboard" : "/login"} icon={<User className="h-5 w-5" />} label={session ? "প্রোফাইল" : "লগিন"} isActive={pathname === "/dashboard" || pathname === "/login"} />
      </div>
    </nav>
    </>
  );
}

// NavLink Component
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 relative group transition-colors"
    >
      {children}
      <span className="absolute inset-x-4 bottom-1.5 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
    </Link>
  );
}

// Dropdown Item Component
function DropdownItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2 focus:bg-blue-50 dark:focus:bg-blue-950/30">
      <Link href={href} className="flex items-center">
        <span className="mr-2 text-gray-500">{icon}</span>
        {label}
      </Link>
    </DropdownMenuItem>
  );
}

// Bottom Nav Item Component
function BottomNavItem({ href, icon, label, isActive, badge }: { href: string; icon: React.ReactNode; label: string; isActive?: boolean; badge?: number }) {
  return (
    <Link href={href} className="relative flex flex-col items-center justify-center w-full h-full gap-1 group">
      <div className="relative">
        <div className={`transition-colors duration-300 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
          {icon}
        </div>
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1.5 -right-2 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm ring-2 ring-white dark:ring-gray-950">
            {badge}
          </span>
        )}
      </div>
      <span className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
        {label}
      </span>
    </Link>
  );
}