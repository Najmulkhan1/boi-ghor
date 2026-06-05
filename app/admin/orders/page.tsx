"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag, Loader2, Truck,
  MapPin, User, Mail, Calendar, Package
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20   text-blue-400   border-blue-500/30",
  shipped:   "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-red-500/20    text-red-400    border-red-500/30",
};

const PAYMENT_COLORS: Record<string, string> = {
  pending:  "bg-yellow-500/20 text-yellow-400",
  paid:     "bg-emerald-500/20 text-emerald-400",
  failed:   "bg-red-500/20    text-red-400",
  refunded: "bg-slate-700     text-slate-400",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    const res = await fetch("/api/admin/orders");
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdate = async (orderId: string, payload: any) => {
    setUpdating(orderId);
    const res = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, ...payload }),
    });
    if (res.ok) fetchOrders();
    setUpdating(null);
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-indigo-400 w-8 h-8" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/20 p-3 rounded-xl text-indigo-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
              অর্ডার ম্যানেজমেন্ট
              <span className="text-sm bg-slate-800 border border-slate-700 text-slate-400 px-3 py-0.5 rounded-full font-medium">
                {orders.length} টি
              </span>
            </h1>
            <p className="text-slate-500 text-sm">সকল ফিজিক্যাল অর্ডার এখানে দেখুন ও আপডেট করুন।</p>
          </div>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors">
              {/* Card Header */}
              <div className="bg-slate-800/50 border-b border-slate-800 px-5 py-3 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <span className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 font-mono text-sm font-bold text-white">
                    {order.orderId}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[order.status] || "bg-slate-700 text-slate-400 border-slate-600"}`}>
                    {order.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${PAYMENT_COLORS[order.payment.status] || "bg-slate-700 text-slate-400"}`}>
                    💳 {order.payment.status}
                  </span>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Customer Info */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">কাস্টমার তথ্য</p>
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{order.shippingAddress.fullName}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" /> {order.shippingAddress.email}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{order.shippingAddress.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-800 p-2 rounded-xl text-slate-500 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {order.shippingAddress.addressLine1}
                      {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`},{" "}
                      {order.shippingAddress.city} - {order.shippingAddress.postalCode}
                    </p>
                  </div>
                </div>

                {/* 2. Items */}
                <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">অর্ডার আইটেমস</p>
                  <div className="space-y-3">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex gap-3 items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.coverImage} className="w-10 h-14 object-cover rounded shadow-sm" alt="" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white line-clamp-1">{item.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Qty: {item.quantity} × ৳{item.unitPrice}</p>
                        </div>
                        <p className="text-xs font-bold text-white shrink-0">৳{item.subtotal}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-dashed border-slate-700 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-400">মোট টাকা</span>
                    <span className="text-lg font-black text-indigo-400">৳{order.totalAmount}</span>
                  </div>
                </div>

                {/* 3. Admin Controls */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">অ্যাডমিন কন্ট্রোল</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">অর্ডার স্ট্যাটাস</label>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdate(order._id, { status: e.target.value })}
                        className="w-full text-sm border border-slate-700 rounded-lg p-2.5 bg-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer"
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="confirmed">✅ Confirmed</option>
                        <option value="shipped">🚚 Shipped</option>
                        <option value="delivered">📦 Delivered</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">পেমেন্ট স্ট্যাটাস</label>
                      <select
                        value={order.payment.status}
                        onChange={(e) => handleUpdate(order._id, { paymentStatus: e.target.value })}
                        className="w-full text-sm border border-slate-700 rounded-lg p-2.5 bg-slate-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer"
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="paid">✅ Paid</option>
                        <option value="failed">❌ Failed</option>
                        <option value="refunded">↩️ Refunded</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">ট্র্যাকিং নম্বর</label>
                      <div className="relative">
                        <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <Input
                          placeholder="Tracking ID"
                          defaultValue={order.trackingNumber}
                          className="h-10 text-sm pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500"
                          onBlur={(e) => handleUpdate(order._id, { trackingNumber: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  {updating === order._id && (
                    <div className="flex items-center gap-2 text-xs text-indigo-400 animate-pulse font-medium">
                      <Loader2 className="w-3 h-3 animate-spin" /> আপডেট হচ্ছে...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900 border border-dashed border-slate-800 rounded-2xl">
          <Package className="w-12 h-12 mx-auto text-slate-700 mb-4" />
          <p className="text-slate-500 font-medium">কোনো অর্ডার পাওয়া যায়নি!</p>
        </div>
      )}
    </div>
  );
}