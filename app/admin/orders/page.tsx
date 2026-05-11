"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, Loader2, Truck, 
  CreditCard, MapPin, User, Mail, Calendar
} from "lucide-react";

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
    if (res.ok) {
      fetchOrders();
    }
    setUpdating(null);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <ShoppingBag className="text-indigo-600" /> অর্ডার ম্যানেজমেন্ট ({orders.length})
        </h1>
      </div>

      <div className="space-y-6">
        {orders.length > 0 ? orders.map((order) => (
          <Card key={order._id} className="border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-0">
              {/* Header Info */}
              <div className="bg-slate-50 border-b p-4 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white px-3 py-1 rounded-md border font-mono text-sm font-bold">
                    ID: {order.orderId}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant={order.status === 'delivered' ? 'default' : 'outline'} className="capitalize">
                    {order.status}
                  </Badge>
                  <Badge variant={order.payment.status === 'paid' ? 'secondary' : 'destructive'} className="capitalize">
                    Payment: {order.payment.status}
                  </Badge>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Customer & Shipping */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-100 p-2 rounded-full text-indigo-600"><User className="w-4 h-4"/></div>
                    <div>
                      <p className="text-sm font-bold">{order.shippingAddress.fullName}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3"/> {order.shippingAddress.email}</p>
                      <p className="text-xs text-slate-500">{order.shippingAddress.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-full text-slate-600"><MapPin className="w-4 h-4"/></div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      {order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2 && `${order.shippingAddress.addressLine2}, `}
                      {order.shippingAddress.city} - {order.shippingAddress.postalCode}
                    </div>
                  </div>
                </div>

                {/* 2. Items & Summary */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">অর্ডার আইটেমস</p>
                  <div className="space-y-3">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex gap-3 items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.coverImage} className="w-10 h-14 object-cover rounded shadow-sm" alt="" />
                        <div className="flex-1">
                          <p className="text-xs font-bold line-clamp-1">{item.title}</p>
                          <p className="text-[10px] text-slate-500">Qty: {item.quantity} × ৳{item.unitPrice}</p>
                        </div>
                        <p className="text-xs font-bold">৳{item.subtotal}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
                    <span className="text-sm font-bold">মোট টাকা</span>
                    <span className="text-lg font-black text-indigo-600">৳{order.totalAmount}</span>
                  </div>
                </div>

                {/* 3. Admin Controls */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Status Update</label>
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdate(order._id, { status: e.target.value })}
                        className="w-full text-sm border-slate-200 rounded-md p-2 focus:ring-indigo-500 bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Payment Status</label>
                      <select 
                        value={order.payment.status}
                        onChange={(e) => handleUpdate(order._id, { paymentStatus: e.target.value })}
                        className="w-full text-sm border-slate-200 rounded-md p-2 focus:ring-indigo-500 bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Tracking Number</label>
                      <div className="relative">
                        <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <Input 
                          placeholder="Tracking ID" 
                          defaultValue={order.trackingNumber}
                          className="h-9 text-xs pl-9"
                          onBlur={(e) => handleUpdate(order._id, { trackingNumber: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  {updating === order._id && <div className="flex items-center gap-2 text-xs text-indigo-600 animate-pulse"><Loader2 className="w-3 h-3 animate-spin" /> Updating database...</div>}
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
            <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">কোনো অর্ডার পাওয়া যায়নি!</p>
          </div>
        )}
      </div>
    </div>
  );
}