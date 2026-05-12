"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, BookOpen } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { Button } from "@/components/ui/button";

export default function MobileAdminNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-lg dark:text-white">বই ঘর <span className="text-xs text-blue-600 uppercase">Admin</span></span>
      </Link>

      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
      </Button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-gray-900 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
              <span className="font-bold text-blue-600 uppercase text-sm tracking-widest">মেনুবার</span>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="h-full overflow-y-auto pb-20" onClick={() => setIsOpen(false)}>
              <AdminSidebar />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}