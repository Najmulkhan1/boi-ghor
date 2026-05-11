"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Ticket, Loader2, Plus, Trash2, Calendar, Percent, CircleDollarSign, Users } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // ফর্মে নতুন কুপনের ডেটা
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderAmount: 0,
    validUntil: "",
    usageLimit: "", // কতবার ব্যবহার করা যাবে (ফাঁকা রাখলে আনলিমিটেড)
  });

  const fetchCoupons = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/coupons");
    if (res.ok) {
      const data = await res.json();
      setCoupons(data.coupons);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCoupons(); }, []);

  // কুপন তৈরি করা
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    const payload = {
      ...formData,
      code: formData.code.toUpperCase(),
      // যদি ইনপুট ফাঁকা থাকে, তবে null পাঠাবো (মানে আনলিমিটেড)
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null, 
    };

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("কুপন সফলভাবে তৈরি হয়েছে!");
        setFormData({ code: "", discountType: "percentage", discountValue: 0, minOrderAmount: 0, validUntil: "", usageLimit: "" });
        fetchCoupons();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error creating coupon");
    } finally {
      setCreating(false);
    }
  };

  // স্ট্যাটাস (Active/Inactive) আপডেট করা
  const toggleActive = async (id: string, currentStatus: boolean) => {
    const res = await fetch("/api/admin/coupons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !currentStatus }),
    });
    if (res.ok) {
      setCoupons(prev => prev.map(c => c._id === id ? { ...c, isActive: !currentStatus } : c));
    }
  };

  // কুপন ডিলিট করা
  const handleDelete = async (id: string) => {
    if (!confirm("কুপনটি ডিলিট করতে চান?")) return;
    const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setCoupons(prev => prev.filter(c => c._id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
          <Ticket className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">কুপন ও ডিসকাউন্ট</h1>
          <p className="text-sm text-slate-500">অফার এবং প্রোমোকোড তৈরি করে সেলস বাড়ান।</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* কুপন তৈরি করার ফর্ম */}
        <Card className="lg:col-span-1 shadow-sm border-slate-200 h-fit sticky top-24">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg flex items-center gap-2"><Plus className="w-5 h-5 text-indigo-600"/> নতুন কুপন তৈরি</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <Label>কুপন কোড (যেমন: EID2026)</Label>
                <Input required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="uppercase font-mono" placeholder="BOIGHOR50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>ডিসকাউন্টের ধরন</Label>
                  <select 
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                    className="w-full text-sm border-slate-200 rounded-md p-2 h-10 focus:ring-indigo-500"
                  >
                    <option value="percentage">শতাংশ (%)</option>
                    <option value="fixed">নির্ধারিত (৳)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>পরিমাণ</Label>
                  <Input required type="number" min="1" value={formData.discountValue || ""} onChange={(e) => setFormData({...formData, discountValue: Number(e.target.value)})} />
                </div>
              </div>

              <div className="space-y-1">
                <Label>ন্যূনতম অর্ডার অ্যামাউন্ট (৳) - (ঐচ্ছিক)</Label>
                <Input type="number" min="0" value={formData.minOrderAmount || ""} onChange={(e) => setFormData({...formData, minOrderAmount: Number(e.target.value)})} placeholder="যেমন: ৫০০ টাকার বেশি কিনলে" />
              </div>

              <div className="space-y-1">
                <Label>সর্বোচ্চ ব্যবহারের লিমিট (ঐচ্ছিক)</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="number" 
                    min="1" 
                    value={formData.usageLimit} 
                    onChange={(e) => setFormData({...formData, usageLimit: e.target.value})} 
                    placeholder="ফাঁকা রাখলে আনলিমিটেড" 
                    className="pl-9"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">কতজন ইউজার এই কুপনটি ব্যবহার করতে পারবে তা সেট করুন।</p>
              </div>

              <div className="space-y-1">
                <Label>মেয়াদ উত্তীর্ণের তারিখ</Label>
                <Input required type="date" value={formData.validUntil} onChange={(e) => setFormData({...formData, validUntil: e.target.value})} />
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2" disabled={creating}>
                {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Ticket className="w-4 h-4 mr-2" />}
                কুপন জেনারেট করুন
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* কুপনের লিস্ট */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-800">অ্যাক্টিভ কুপনসমূহ</h2>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-600" /></div>
          ) : coupons.length > 0 ? (
            <div className="grid gap-4">
              {coupons.map((coupon) => (
                <div key={coupon._id} className="flex flex-col sm:flex-row items-center justify-between p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow gap-4">
                  
                  {/* Coupon Details */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className={`p-3 rounded-lg ${coupon.isActive ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                      {coupon.discountType === "percentage" ? <Percent className="w-6 h-6" /> : <CircleDollarSign className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-lg text-slate-900 font-mono tracking-wider">{coupon.code}</h3>
                        {!coupon.isActive && <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-bold">Inactive</span>}
                      </div>
                      <p className="text-sm font-bold text-indigo-600">
                        {coupon.discountType === "percentage" ? `${coupon.discountValue}% ছাড়` : `৳${coupon.discountValue} ছাড়`}
                        {coupon.minOrderAmount > 0 && <span className="text-xs text-slate-500 ml-2 font-normal">(Min. ৳{coupon.minOrderAmount})</span>}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> মেয়াদ: {new Date(coupon.validUntil).toLocaleDateString('bn-BD')}
                      </p>
                    </div>
                  </div>

                  {/* Coupon Stats & Actions */}
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0">
                    <div className="text-center bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">ব্যবহার হয়েছে</p>
                      <p className="text-sm font-bold text-slate-800">
                        <span className="text-indigo-600">{coupon.usedCount}</span> 
                        {coupon.usageLimit ? ` / ${coupon.usageLimit} বার` : " (আনলিমিটেড)"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 border-l pl-4">
                      <Switch 
                        checked={coupon.isActive}
                        onCheckedChange={() => toggleActive(coupon._id, coupon.isActive)}
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon._id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
              <Ticket className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>কোনো কুপন তৈরি করা হয়নি!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}