"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  userId: string;
  userName: string;
  currentCredits: number;
}

export default function AdjustCreditDialog({ userId, userName, currentCredits }: Props) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number | "">("");
  const [action, setAction] = useState<"add" | "remove">("add");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/credits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), action, description }),
      });

      if (res.ok) {
        alert("ক্রেডিট আপডেট সফল হয়েছে!");
        setOpen(false); // Modal বন্ধ করা
        setAmount("");
        setDescription("");
        router.refresh(); // পেজ রিফ্রেশ করে নতুন ডাটা দেখানো
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (error) {
      alert("সার্ভার এরর!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
          ক্রেডিট ম্যানেজ
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{userName}-এর ক্রেডিট আপডেট করুন</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
              বর্তমান ক্রেডিট ব্যালেন্স: <strong className="text-xl text-blue-600">{currentCredits}</strong>
            </p>
          </div>
          
          {/* Action Toggle (Add or Remove) */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              type="button" 
              variant={action === "add" ? "default" : "outline"} 
              onClick={() => setAction("add")} 
              className={action === "add" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              যোগ করুন (+)
            </Button>
            <Button 
              type="button" 
              variant={action === "remove" ? "default" : "outline"} 
              onClick={() => setAction("remove")} 
              className={action === "remove" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              কেটে নিন (-)
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">ক্রেডিট পরিমাণ *</Label>
            <Input id="amount" type="number" min="1" required value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Ex: 50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">নোট / কারণ (ঐচ্ছিক)</Label>
            <Input id="desc" placeholder="Ex: বিকাশে পেমেন্ট বা প্রমোশনাল বোনাস" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>বাতিল</Button>
            <Button type="submit" disabled={loading || !amount || amount <= 0}>
              {loading ? "আপডেট হচ্ছে..." : "কনফার্ম করুন"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}