"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong!");
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
          <CardTitle className="text-2xl text-center">নতুন অ্যাকাউন্ট তৈরি করুন</CardTitle>
          <CardDescription className="text-center">বই ঘরে আপনাকে স্বাগতম!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">আপনার নাম</Label>
              <Input 
                id="name" 
                placeholder="Ex: Nazmul Khan" 
                required 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
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
              {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "রেজিস্টার করুন"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">
            আগে থেকেই অ্যাকাউন্ট আছে? <Link href="/login" className="text-blue-600 hover:underline">লগিন করুন</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}