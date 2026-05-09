"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [address, setAddress] = useState({
    fullName: "", phone: "", email: "", addressLine1: "", city: "", postalCode: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    setIsMounted(true);
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/checkout");
    } else if (status === "authenticated" && session?.user?.email) {
      // ইউজারের ইমেইল স্টেটে সেট করা হলো
      setAddress((prev) => ({ ...prev, email: session.user.email as string }));
    }
  }, [status, router, session]);

  if (!isMounted || status === "loading") return <div className="text-center py-20">Loading...</div>;

  if (items.length === 0 && !isSuccess) {
    router.push("/cart");
    return null;
  }

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = 60;
  const totalAmount = subtotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.id]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress: address,
          paymentMethod,
          subtotal,
          shippingFee,
          totalAmount
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        clearCart(); 
        alert("আপনার অর্ডারটি সফলভাবে প্লেস করা হয়েছে!");
        router.push("/dashboard/orders"); 
      } else {
        const data = await res.json();
        alert(data.message || "অর্ডার প্লেস করতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      alert("সার্ভার এরর! দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">চেকআউট</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ডেলিভারি ঠিকানা</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">সম্পূর্ণ নাম *</Label>
                  <Input id="fullName" required placeholder="Ex: Nazmul Khan" onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">মোবাইল নাম্বার *</Label>
                  <Input id="phone" required placeholder="01XXXXXXXXX" onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">ইমেইল *</Label>
                  {/* defaultValue এর বদলে value বসানো হয়েছে */}
                  <Input id="email" type="email" required placeholder="example@email.com" onChange={handleInputChange} value={address.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">শহর / জেলা *</Label>
                  <Input id="city" required placeholder="Ex: Dhaka" onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine1">বিস্তারিত ঠিকানা (বাসা/রোড/এলাকা) *</Label>
                <Input id="addressLine1" required placeholder="House 12, Road 5, Block C..." onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">পোস্টাল কোড *</Label>
                <Input id="postalCode" required placeholder="1216" onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>পেমেন্ট মেথড</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="cod" onValueChange={setPaymentMethod} className="space-y-3">
                <div className="flex items-center space-x-3 border p-4 rounded-lg bg-blue-50 border-blue-200">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="font-semibold text-base cursor-pointer">Cash on Delivery (ক্যাশ অন ডেলিভারি)</Label>
                </div>
                <div className="flex items-center space-x-3 border p-4 rounded-lg opacity-50 cursor-not-allowed">
                  <RadioGroupItem value="bkash" id="bkash" disabled />
                  <Label htmlFor="bkash">bKash (Coming Soon)</Label>
                </div>
                <div className="flex items-center space-x-3 border p-4 rounded-lg opacity-50 cursor-not-allowed">
                  <RadioGroupItem value="card" id="card" disabled />
                  <Label htmlFor="card">Credit/Debit Card (Coming Soon)</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="sticky top-24">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>অর্ডার সামারি</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.bookId} className="flex justify-between text-sm">
                    <span className="text-gray-600 line-clamp-1 flex-grow pr-2">
                      {item.quantity}x {item.title}
                    </span>
                    <span className="font-medium">৳{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>সাবটোটাল</span>
                  <span className="font-semibold text-gray-900">৳{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>শিপিং চার্জ</span>
                  <span className="font-semibold text-gray-900">৳{shippingFee}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center pb-4">
                <span className="text-lg font-bold">সর্বমোট</span>
                <span className="text-2xl font-extrabold text-blue-700">৳{totalAmount}</span>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled={loading}>
                {loading ? "প্রসেস হচ্ছে..." : "অর্ডার কনফার্ম করুন"}
              </Button>
            </CardContent>
          </Card>
        </div>

      </form>
    </div>
  );
}