"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        setError("ইমেইল বা পাসওয়ার্ড ভুল হয়েছে!");
      } else {
        router.push("/dashboard"); // লগিন সফল হলে ড্যাশবোর্ডে যাবে
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">লগিন করুন</CardTitle>
          <CardDescription className="text-center">আপনার বই ঘরের অ্যাকাউন্টে প্রবেশ করুন</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল অ্যাড্রেস</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                required 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "লগিন হচ্ছে..." : "লগিন"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">
            অ্যাকাউন্ট নেই? <Link href="/register" className="text-blue-600 hover:underline">নতুন অ্যাকাউন্ট তৈরি করুন</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}