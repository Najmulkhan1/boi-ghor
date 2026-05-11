"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, BookOpen } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { data: session } = useSession();
  
  // Zustand hydration error ফিক্স করার জন্য isMounted state
  const [isMounted, setIsMounted] = useState(false);
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // কার্টের মোট আইটেম সংখ্যা হিসাব করা
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-700">
          <BookOpen className="h-6 w-6" />
          <span>বই ঘর</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          
          <Link href="/books" className="hover:text-blue-600">সব বই</Link>
          <Link href="/categories" className="hover:text-blue-600">ক্যাটাগরি</Link>
          <Link href="/authors" className="hover:text-blue-600">লেখক</Link>
          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
          {/* Cart Icon & Badge */}
          <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            {isMounted && totalItems > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {/* ... বাকি Auth এর কোড আগের মতোই থাকবে ... */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user?.image || ""} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild><Link href="/dashboard">ড্যাশবোর্ড</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/dashboard/library">আমার লাইব্রেরি (PDF)</Link></DropdownMenuItem> {/* এই লাইনটি নতুন */}
                <DropdownMenuItem asChild><Link href="/dashboard/orders">আমার অর্ডার (Hardcopy)</Link></DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer" onClick={() => signOut({ callbackUrl: '/' })}>
                  লগআউট
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="hidden sm:flex"><Link href="/login">লগিন</Link></Button>
              <Button asChild><Link href="/register">রেজিস্টার</Link></Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}