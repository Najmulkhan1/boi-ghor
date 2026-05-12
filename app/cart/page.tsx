"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, updateQuantity } = useCartStore();

  // Hydration mismatch এড়ানোর জন্য
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // হিসাব-নিকাশ
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = subtotal > 0 ? 60 : 0; // আপাতত ডিফল্ট শিপিং ৳৬০ ধরা হলো
  const grandTotal = subtotal + shippingFee;

  // কার্ট ফাঁকা থাকলে যা দেখাবে
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <ShoppingBag className="w-24 h-24 text-gray-200 dark:text-gray-700 mb-6" />
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">আপনার কার্ট একদম ফাঁকা!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">হার্ডকপি বই কিনে কার্ট ভর্তি করুন।</p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
          <Link href="/books">বই ব্রাউজ করুন</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pb-20">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 mb-8">আপনার শপিং কার্ট</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side - Cart Items */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <Card key={item.bookId} className="overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
                
                {/* Book Cover */}
                <div className="w-20 h-28 bg-gray-100 dark:bg-gray-800 rounded flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.coverImage} 
                    alt={item.title} 
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Info & Controls */}
                <div className="flex-grow flex flex-col sm:flex-row justify-between items-center w-full gap-4">
                  <div className="text-center sm:text-left flex-grow">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-1">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mt-1">৳{item.price}</p>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-1 rounded-md border border-gray-200 dark:border-gray-700">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => item.quantity > 1 ? updateQuantity(item.bookId, item.quantity - 1) : removeItem(item.bookId)}
                    >
                      {item.quantity > 1 ? <Minus className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                    </Button>
                    <span className="font-semibold w-6 text-center text-gray-900 dark:text-gray-100">{item.quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Item Subtotal & Remove */}
                  <div className="flex flex-col items-end gap-2 min-w-[80px]">
                    <span className="font-bold text-lg text-gray-900 dark:text-gray-100">৳{item.price * item.quantity}</span>
                    <button 
                      onClick={() => removeItem(item.bookId)}
                      className="text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> বাদ দিন
                    </button>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Side - Order Summary */}
        <div className="lg:col-span-4">
          <Card className="sticky top-24 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-bold border-b border-gray-200 dark:border-gray-800 pb-4 text-gray-900 dark:text-gray-100">অর্ডার সামারি</h3>
              
              <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>সাবটোটাল ({items.reduce((acc, item) => acc + item.quantity, 0)} আইটেম)</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">৳{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>শিপিং চার্জ (ঢাকা)</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">৳{shippingFee}</span>
                </div>
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-800" />

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">সর্বমোট</span>
                <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">৳{grandTotal}</span>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 h-12 text-lg gap-2 mt-4" asChild>
                <Link href="/checkout">
                  চেকআউট করুন <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
      </div>
    </div>
  );
}