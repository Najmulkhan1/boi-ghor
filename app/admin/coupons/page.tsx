"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Ticket, Loader2, Plus, Trash2, Calendar, Percent, CircleDollarSign, Users, Tag } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderAmount: 0,
    validUntil: "",
    usageLimit: "",
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const payload = {
      ...formData,
      code: formData.code.toUpperCase(),
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
        alert("কুপন সফলভাবে তৈরি হয়েছে!");
        setFormData({ code: "", discountType: "percentage", discountValue: 0, minOrderAmount: 0, validUntil: "", usageLimit: "" });
        fetchCoupons();
      } else {
        alert(data.message);
      }
    } catch {
      alert("Error creating coupon");
    } finally {
      setCreating(false);
    }
  };

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

  const handleDelete = async (id: string) => {
    if (!confirm("কুপনটি ডিলিট করতে চান?")) return;
    const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setCoupons(prev => prev.filter(c => c._id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
        <div className="bg-amber-500/20 p-3 rounded-xl text-amber-400">
          <Ticket className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">কুপন ও ডিসকাউন্ট</h1>
          <p className="text-sm text-slate-500">অফার এবং প্রোমোকোড তৈরি করে সেলস বাড়ান।</p>
        </div>
        <div className="ml-auto bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700">
          <span className="text-slate-400 text-sm font-medium">{coupons.length} টি কুপন</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Coupon Form */}
        <div className="lg:col-span-1 h-fit sticky top-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border-b border-slate-800 px-6 py-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-white">নতুন কুপন তৈরি</h2>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              {/* Coupon Code */}
              <div className="space-y-1.5">
                <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">কুপন কোড *</Label>
                <Input
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="uppercase font-mono bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 focus:border-amber-500/50"
                  placeholder="BOIGHOR50"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">ধরন</Label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full text-sm rounded-lg p-2.5 h-10 bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
                  >
                    <option value="percentage">% শতাংশ</option>
                    <option value="fixed">৳ নির্ধারিত</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">পরিমাণ *</Label>
                  <Input
                    required
                    type="number"
                    min="1"
                    value={formData.discountValue || ""}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="bg-slate-800 border-slate-700 text-white focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* Min Order */}
              <div className="space-y-1.5">
                <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">ন্যূনতম অর্ডার (৳) — ঐচ্ছিক</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.minOrderAmount || ""}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                  placeholder="যেমন: ৫০০"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 focus:border-amber-500/50"
                />
              </div>

              {/* Usage Limit */}
              <div className="space-y-1.5">
                <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">ব্যবহারের লিমিট — ঐচ্ছিক</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="ফাঁকা = আনলিমিটেড"
                    className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 focus:border-amber-500/50"
                  />
                </div>
                <p className="text-[10px] text-slate-600">কতজন ইউজার এই কুপন ব্যবহার করতে পারবে।</p>
              </div>

              {/* Expiry Date */}
              <div className="space-y-1.5">
                <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">মেয়াদ শেষ *</Label>
                <Input
                  required
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white focus:border-amber-500/50 [color-scheme:dark]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold gap-2 mt-2"
                disabled={creating}
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ticket className="w-4 h-4" />}
                কুপন জেনারেট করুন
              </Button>
            </form>
          </div>
        </div>

        {/* Coupons List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">সকল কুপনসমূহ</h2>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin text-indigo-400 w-8 h-8" />
            </div>
          ) : coupons.length > 0 ? (
            <div className="space-y-3">
              {coupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className={`bg-slate-900 border rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5 transition-all hover:border-slate-600 ${
                    coupon.isActive ? "border-slate-700" : "border-slate-800 opacity-60"
                  }`}
                >
                  {/* Coupon Info */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Discount Icon */}
                    <div className={`p-3 rounded-xl shrink-0 ${
                      coupon.isActive
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-slate-800 text-slate-600"
                    }`}>
                      {coupon.discountType === "percentage"
                        ? <Percent className="w-5 h-5" />
                        : <CircleDollarSign className="w-5 h-5" />
                      }
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Code Badge */}
                        <span className="font-black text-white font-mono tracking-widest text-lg bg-slate-800 px-3 py-0.5 rounded-lg border border-slate-700">
                          {coupon.code}
                        </span>
                        {!coupon.isActive && (
                          <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold border border-slate-700">
                            Inactive
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-bold text-amber-400 mt-1">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}% ছাড়`
                          : `৳${coupon.discountValue} ছাড়`}
                        {coupon.minOrderAmount > 0 && (
                          <span className="text-xs text-slate-500 ml-2 font-normal">
                            (Min. ৳{coupon.minOrderAmount})
                          </span>
                        )}
                      </p>

                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        মেয়াদ: {new Date(coupon.validUntil).toLocaleDateString("bn-BD")}
                      </p>
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-4 sm:pt-0">
                    {/* Usage Stats */}
                    <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-center">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">ব্যবহার</p>
                      <p className="text-sm font-bold text-white">
                        <span className="text-amber-400">{coupon.usedCount}</span>
                        {coupon.usageLimit ? ` / ${coupon.usageLimit}` : " / ∞"}
                      </p>
                    </div>

                    {/* Toggle + Delete */}
                    <div className="flex items-center gap-4 border-l border-slate-800 pl-4">
                      <Switch
                        checked={coupon.isActive}
                        onCheckedChange={() => toggleActive(coupon._id, coupon.isActive)}
                      />
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900 border border-dashed border-slate-800 rounded-2xl">
              <Tag className="w-12 h-12 mx-auto mb-3 text-slate-700" />
              <p className="text-slate-500 font-medium">কোনো কুপন তৈরি করা হয়নি!</p>
              <p className="text-slate-600 text-sm mt-1">বাম দিকের ফর্ম থেকে নতুন কুপন তৈরি করুন।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}